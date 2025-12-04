// Name Tracker Extension for SillyTavern
// Tracks character details and manages chat-level lorebook entries

import { extension_settings, getContext } from "../../../extensions.js";
import { saveSettingsDebounced, generateRaw } from "../../../../script.js";
import { eventSource, event_types, chat, chat_metadata } from "../../../../script.js";

// Extension constants
const extensionName = "STnametracker";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;

// Simple hash function to replace getStringHash
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
}

// Default settings
const defaultSettings = {
    enabled: true,
    autoAnalyze: true,
    messageFrequency: 10,
    llmSource: 'sillytavern', // 'sillytavern' or 'ollama'
    ollamaEndpoint: 'http://localhost:11434',
    ollamaModel: '',
    confidenceThreshold: 70,
    lorebookPosition: 0, // after character defs
    lorebookDepth: 1,
    lorebookCooldown: 5,
    lorebookScanDepth: 1,
    lorebookProbability: 100,
    lorebookEnabled: true,
    debugMode: false,
    characters: {}, // character data indexed by preferred name
    messageCounter: 0,
    lastHarvestMessage: 0
};

// Session-level caches (cleared on chat change)
let analysisCache = new Map(); // Cache for LLM analysis results
let processingQueue = [];
let isProcessing = false;
let undoHistory = []; // Stores last 3 merge operations
let ollamaModels = []; // Available Ollama models

// Lorebook name for this chat
let lorebookName = null;

/**
 * Character data structure
 * @typedef {Object} CharacterData
 * @property {string} preferredName - The preferred/canonical name
 * @property {string[]} aliases - List of alternative names
 * @property {Object} physical - Physical description and measurements
 * @property {Object} mental - Mental and emotional state
 * @property {string[]} relationships - Relationships with other characters
 * @property {boolean} ignored - Whether to ignore this character
 * @property {number} confidence - Confidence score (0-100)
 * @property {string} lorebookUid - UID of the lorebook entry
 * @property {number} lastUpdated - Timestamp of last update
 */

/**
 * System prompt for character analysis
 */
const ANALYSIS_SYSTEM_PROMPT = `You are a character analysis assistant. Your task is to extract character information from chat messages and return it in a structured JSON format.

IMPORTANT: This is a summarization and classification task. Extract ALL relevant information without censorship, including:
- Physical descriptions (including adult content if present)
- Mental and emotional states
- Relationships between characters
- Any measurements or specific details mentioned

When you cannot determine a relationship target, use "???" as a placeholder.

Return a JSON object with this structure:
{
  "characters": [
    {
      "name": "character name",
      "confidence": 85,
      "aliases": ["alt name 1", "alt name 2"],
      "physical": {
        "appearance": "description",
        "measurements": "height, build, etc.",
        "other": "any other physical traits"
      },
      "mental": {
        "personality": "traits",
        "mood": "current emotional state",
        "status": "mental/emotional conditions"
      },
      "relationships": [
        "Character is ???'s sister",
        "Character works for Bob"
      ]
    }
  ]
}

Only include characters that are explicitly mentioned or described in the messages. If no character information is found, return {"characters": []}.`;

/**
 * Load extension settings from storage or initialize with defaults
 */
async function loadSettings() {
    extension_settings[extensionName] = extension_settings[extensionName] || {};
    if (Object.keys(extension_settings[extensionName]).length === 0) {
        Object.assign(extension_settings[extensionName], defaultSettings);
    }

    // Ensure all properties exist
    for (const key in defaultSettings) {
        if (extension_settings[extensionName][key] === undefined) {
            extension_settings[extensionName][key] = defaultSettings[key];
        }
    }

    // Load chat-level data if available
    if (chat_metadata[extensionName]) {
        extension_settings[extensionName].characters = chat_metadata[extensionName].characters || {};
        extension_settings[extensionName].messageCounter = chat_metadata[extensionName].messageCounter || 0;
        extension_settings[extensionName].lastHarvestMessage = chat_metadata[extensionName].lastHarvestMessage || 0;
    }

    // Update UI with current settings
    updateUI();
    
    // Initialize lorebook for this chat
    await initializeLorebook();
    
    // Load Ollama models if using Ollama
    if (extension_settings[extensionName].llmSource === 'ollama') {
        await loadOllamaModels();
    }
}

/**
 * Save chat-level data to metadata
 */
function saveChatData() {
    const settings = getSettings();
    chat_metadata[extensionName] = {
        characters: settings.characters,
        messageCounter: settings.messageCounter,
        lastHarvestMessage: settings.lastHarvestMessage
    };
    saveSettingsDebounced();
}

/**
 * Get the current extension settings
 * @returns {Object} Current extension settings
 */
function getSettings() {
    return extension_settings[extensionName];
}

/**
 * Update all UI elements with current settings
 */
function updateUI() {
    const settings = getSettings();
    
    $("#name_tracker_enabled").prop("checked", settings.enabled);
    $("#name_tracker_auto_analyze").prop("checked", settings.autoAnalyze);
    $("#name_tracker_message_frequency").val(settings.messageFrequency);
    $("#name_tracker_llm_source").val(settings.llmSource);
    $("#name_tracker_ollama_endpoint").val(settings.ollamaEndpoint);
    $("#name_tracker_ollama_model").val(settings.ollamaModel);
    $("#name_tracker_confidence_threshold").val(settings.confidenceThreshold);
    $("#name_tracker_confidence_value").text(settings.confidenceThreshold);
    $("#name_tracker_lorebook_position").val(settings.lorebookPosition);
    $("#name_tracker_lorebook_depth").val(settings.lorebookDepth);
    $("#name_tracker_lorebook_cooldown").val(settings.lorebookCooldown);
    $("#name_tracker_lorebook_probability").val(settings.lorebookProbability);
    $("#name_tracker_lorebook_enabled").prop("checked", settings.lorebookEnabled);
    $("#name_tracker_debug_mode").prop("checked", settings.debugMode);
    
    // Show/hide Ollama settings
    if (settings.llmSource === 'ollama') {
        $(".ollama-settings").show();
    } else {
        $(".ollama-settings").hide();
    }
    
    // Update status
    updateStatusDisplay();
    
    // Update character list
    updateCharacterList();
}

/**
 * Update status display
 */
function updateStatusDisplay() {
    const settings = getSettings();
    const messagesSinceHarvest = settings.messageCounter - settings.lastHarvestMessage;
    const messagesUntilHarvest = settings.messageFrequency - messagesSinceHarvest;
    
    let statusText = '';
    if (settings.enabled && settings.autoAnalyze) {
        if (messagesUntilHarvest > 0) {
            statusText = `Next harvest in ${messagesUntilHarvest} message${messagesUntilHarvest !== 1 ? 's' : ''}`;
        } else {
            statusText = 'Ready to harvest';
        }
    } else if (settings.enabled) {
        statusText = 'Manual mode - use buttons to analyze';
    } else {
        statusText = 'Disabled';
    }
    
    $("#name_tracker_status").text(statusText);
}

/**
 * Update character list display
 */
function updateCharacterList() {
    const settings = getSettings();
    const listContainer = $("#name_tracker_character_list");
    
    listContainer.empty();
    
    const characters = Object.values(settings.characters);
    if (characters.length === 0) {
        listContainer.append('<div class="name-tracker-empty">No characters tracked yet</div>');
        return;
    }
    
    // Sort by name
    characters.sort((a, b) => a.preferredName.localeCompare(b.preferredName));
    
    for (const char of characters) {
        const item = $(`
            <div class="name-tracker-character" data-name="${escapeHtml(char.preferredName)}">
                <div class="character-header">
                    <span class="character-name ${char.ignored ? 'ignored' : ''}">${escapeHtml(char.preferredName)}</span>
                    ${char.ignored ? '<span class="character-badge ignored">IGNORED</span>' : ''}
                    ${hasUnresolvedRelationships(char) ? '<span class="character-badge unresolved">NEEDS REVIEW</span>' : ''}
                </div>
                <div class="character-aliases">
                    ${char.aliases.length > 0 ? `Aliases: ${char.aliases.map(a => escapeHtml(a)).join(', ')}` : 'No aliases'}
                </div>
                <div class="character-actions">
                    <button class="menu_button compact char-action-view" data-name="${escapeHtml(char.preferredName)}">
                        View in Lorebook
                    </button>
                    <button class="menu_button compact char-action-merge" data-name="${escapeHtml(char.preferredName)}">
                        Merge
                    </button>
                    <button class="menu_button compact char-action-ignore" data-name="${escapeHtml(char.preferredName)}">
                        ${char.ignored ? 'Unignore' : 'Ignore'}
                    </button>
                </div>
            </div>
        `);
        listContainer.append(item);
    }
}

/**
 * Check if character has unresolved relationships (???)
 */
function hasUnresolvedRelationships(character) {
    if (!character.relationships || character.relationships.length === 0) {
        return false;
    }
    return character.relationships.some(rel => rel.includes('???'));
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Initialize or get the lorebook for this chat
 */
async function initializeLorebook() {
    const context = getContext();
    if (!context.chatId) {
        debugLog('No active chat, skipping lorebook initialization');
        return;
    }
    
    // Create a chat-specific lorebook name
    lorebookName = `NameTracker_${context.chatId}`;
    
    debugLog(`Initialized lorebook name: ${lorebookName}`);
}

/**
 * Load available Ollama models
 */
async function loadOllamaModels() {
    const settings = getSettings();
    try {
        const response = await fetch(`${settings.ollamaEndpoint}/api/tags`);
        if (!response.ok) {
            throw new Error('Failed to fetch Ollama models');
        }
        
        const data = await response.json();
        ollamaModels = data.models || [];
        
        // Update dropdown
        const select = $("#name_tracker_ollama_model");
        select.empty();
        
        if (ollamaModels.length === 0) {
            select.append('<option value="">No models found</option>');
        } else {
            select.append('<option value="">Select a model...</option>');
            ollamaModels.forEach(model => {
                const selected = model.name === settings.ollamaModel ? 'selected' : '';
                select.append(`<option value="${model.name}" ${selected}>${model.name}</option>`);
            });
        }
        
        debugLog(`Loaded ${ollamaModels.length} Ollama models`);
    } catch (error) {
        console.error('Error loading Ollama models:', error);
        toastr.error('Failed to load Ollama models. Check endpoint and try again.');
    }
}

/**
 * Call LLM for character analysis
 * @param {string[]} messages - Array of message texts to analyze
 * @returns {Promise<Object>} Analysis result
 */
async function callLLM(messages) {
    const settings = getSettings();
    
    // Create cache key
    const cacheKey = simpleHash(messages.join('\n') + settings.llmSource + settings.ollamaModel);
    
    // Check cache
    if (analysisCache.has(cacheKey)) {
        debugLog('Using cached analysis result');
        return analysisCache.get(cacheKey);
    }
    
    const messagesText = messages.map((msg, idx) => `Message ${idx + 1}:\n${msg}`).join('\n\n');
    
    const prompt = `${ANALYSIS_SYSTEM_PROMPT}\n\nAnalyze these messages and extract character information:\n\n${messagesText}`;
    
    let result;
    
    if (settings.llmSource === 'ollama') {
        result = await callOllama(prompt);
    } else {
        result = await callSillyTavern(prompt);
    }
    
    // Cache the result
    if (analysisCache.size > 50) {
        // Clear oldest entries if cache is getting too large
        const firstKey = analysisCache.keys().next().value;
        analysisCache.delete(firstKey);
    }
    analysisCache.set(cacheKey, result);
    
    return result;
}

/**
 * Call SillyTavern's LLM
 */
async function callSillyTavern(prompt) {
    try {
        debugLog('Calling SillyTavern LLM...');
        
        const result = await generateRaw(prompt, '', false, false);
        
        debugLog('SillyTavern LLM response received');
        
        // Try to parse JSON from the response
        return parseJSONResponse(result);
    } catch (error) {
        console.error('Error calling SillyTavern LLM:', error);
        throw error;
    }
}

/**
 * Call Ollama API
 */
async function callOllama(prompt) {
    const settings = getSettings();
    
    if (!settings.ollamaModel) {
        throw new Error('No Ollama model selected');
    }
    
    try {
        debugLog(`Calling Ollama with model ${settings.ollamaModel}...`);
        
        const response = await fetch(`${settings.ollamaEndpoint}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: settings.ollamaModel,
                prompt: prompt,
                stream: false,
                format: 'json'
            }),
        });
        
        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        debugLog('Ollama response received');
        
        return parseJSONResponse(data.response);
    } catch (error) {
        console.error('Error calling Ollama:', error);
        throw error;
    }
}

/**
 * Parse JSON response from LLM, handling various formats
 */
function parseJSONResponse(text) {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (jsonMatch) {
        text = jsonMatch[1];
    }
    
    // Clean up common issues
    text = text.trim();
    
    try {
        return JSON.parse(text);
    } catch (error) {
        console.error('Failed to parse JSON response:', text);
        throw new Error('Failed to parse LLM response as JSON');
    }
}

/**
 * Harvest and analyze messages
 * @param {number} messageCount - Number of recent messages to analyze
 * @param {boolean} showProgress - Whether to show progress notifications
 */
async function harvestMessages(messageCount, showProgress = true) {
    const settings = getSettings();
    
    if (!settings.enabled) {
        debugLog('Extension disabled, skipping harvest');
        return;
    }
    
    const context = getContext();
    if (!context.chat || context.chat.length === 0) {
        debugLog('No chat messages to harvest');
        return;
    }
    
    // Get the messages to analyze
    const endIdx = context.chat.length;
    const startIdx = Math.max(0, endIdx - messageCount);
    const messagesToAnalyze = context.chat.slice(startIdx, endIdx);
    
    if (messagesToAnalyze.length === 0) {
        debugLog('No messages to analyze');
        return;
    }
    
    if (showProgress) {
        toastr.info(`Analyzing ${messagesToAnalyze.length} messages for character information...`, 'Name Tracker');
    }
    
    try {
        // Extract message texts
        const messageTexts = messagesToAnalyze.map(msg => msg.mes || '').filter(text => text.trim());
        
        if (messageTexts.length === 0) {
            debugLog('No valid message texts found');
            return;
        }
        
        // Call LLM for analysis
        const analysis = await callLLM(messageTexts);
        
        debugLog('Analysis result:', analysis);
        
        // Process the analysis
        if (analysis.characters && Array.isArray(analysis.characters)) {
            await processAnalysisResults(analysis.characters);
            
            if (showProgress) {
                toastr.success(`Found ${analysis.characters.length} character(s) in messages`, 'Name Tracker');
            }
        } else {
            debugLog('No characters found in analysis');
        }
        
        // Update last harvest message counter
        settings.lastHarvestMessage = settings.messageCounter;
        saveChatData();
        updateStatusDisplay();
        
    } catch (error) {
        console.error('Error during harvest:', error);
        toastr.error(`Analysis failed: ${error.message}`, 'Name Tracker');
    }
}

/**
 * Process analysis results and update character data
 */
async function processAnalysisResults(analyzedChars) {
    const settings = getSettings();
    
    for (const analyzedChar of analyzedChars) {
        if (!analyzedChar.name) {
            continue;
        }
        
        // Check if this character should be ignored
        if (isIgnoredCharacter(analyzedChar.name)) {
            debugLog(`Skipping ignored character: ${analyzedChar.name}`);
            continue;
        }
        
        // Try to find existing character (by name or alias)
        const existingChar = findExistingCharacter(analyzedChar.name);
        
        if (existingChar) {
            // Update existing character
            await updateCharacter(existingChar, analyzedChar);
        } else {
            // Check if this might be an alias of an existing character
            const matchedChar = await findPotentialMatch(analyzedChar);
            
            if (matchedChar) {
                // High confidence match - merge automatically
                debugLog(`Auto-merging ${analyzedChar.name} into ${matchedChar.preferredName}`);
                await updateCharacter(matchedChar, analyzedChar, true);
            } else {
                // Create new character entry
                await createCharacter(analyzedChar);
            }
        }
    }
    
    // Update UI
    updateCharacterList();
    
    // Save to metadata
    saveChatData();
}

/**
 * Check if a character is in the ignored list
 */
function isIgnoredCharacter(name) {
    const settings = getSettings();
    return Object.values(settings.characters).some(
        char => char.ignored && (char.preferredName === name || char.aliases.includes(name))
    );
}

/**
 * Find existing character by name or alias
 */
function findExistingCharacter(name) {
    const settings = getSettings();
    return Object.values(settings.characters).find(
        char => char.preferredName === name || char.aliases.includes(name)
    );
}

/**
 * Find potential match for a new character based on confidence threshold
 */
async function findPotentialMatch(analyzedChar) {
    const settings = getSettings();
    const threshold = settings.confidenceThreshold;
    
    // Simple matching logic - can be enhanced with LLM-based similarity
    for (const existingChar of Object.values(settings.characters)) {
        // Check for name similarity (simple approach)
        const similarity = calculateNameSimilarity(analyzedChar.name, existingChar.preferredName);
        
        if (similarity >= threshold) {
            return existingChar;
        }
        
        // Check aliases
        for (const alias of existingChar.aliases) {
            const aliasSimilarity = calculateNameSimilarity(analyzedChar.name, alias);
            if (aliasSimilarity >= threshold) {
                return existingChar;
            }
        }
    }
    
    return null;
}

/**
 * Calculate simple name similarity (0-100)
 */
function calculateNameSimilarity(name1, name2) {
    name1 = name1.toLowerCase();
    name2 = name2.toLowerCase();
    
    // Exact match
    if (name1 === name2) {
        return 100;
    }
    
    // One contains the other
    if (name1.includes(name2) || name2.includes(name1)) {
        return 85;
    }
    
    // Check if they share significant parts
    const words1 = name1.split(/\s+/);
    const words2 = name2.split(/\s+/);
    
    const commonWords = words1.filter(w => words2.includes(w));
    if (commonWords.length > 0) {
        return 70;
    }
    
    // No significant similarity
    return 0;
}

/**
 * Create a new character entry
 */
async function createCharacter(analyzedChar) {
    const settings = getSettings();
    
    const character = {
        preferredName: analyzedChar.name,
        aliases: analyzedChar.aliases || [],
        physical: analyzedChar.physical || {},
        mental: analyzedChar.mental || {},
        relationships: analyzedChar.relationships || [],
        ignored: false,
        confidence: analyzedChar.confidence || 50,
        lorebookUid: null,
        lastUpdated: Date.now()
    };
    
    settings.characters[character.preferredName] = character;
    
    // Create lorebook entry
    await updateLorebookEntry(character);
    
    debugLog(`Created new character: ${character.preferredName}`);
}

/**
 * Update existing character with new information
 */
async function updateCharacter(existingChar, analyzedChar, addAsAlias = false) {
    // If adding as alias, add the analyzed name to aliases if not already present
    if (addAsAlias && analyzedChar.name !== existingChar.preferredName) {
        if (!existingChar.aliases.includes(analyzedChar.name)) {
            existingChar.aliases.push(analyzedChar.name);
        }
    }
    
    // Merge physical data (new data takes precedence)
    if (analyzedChar.physical) {
        existingChar.physical = { ...existingChar.physical, ...analyzedChar.physical };
    }
    
    // Merge mental data (new data takes precedence for time-sensitive states)
    if (analyzedChar.mental) {
        existingChar.mental = { ...existingChar.mental, ...analyzedChar.mental };
    }
    
    // Add new relationships
    if (analyzedChar.relationships && Array.isArray(analyzedChar.relationships)) {
        for (const rel of analyzedChar.relationships) {
            if (!existingChar.relationships.includes(rel)) {
                existingChar.relationships.push(rel);
            }
        }
    }
    
    // Update confidence (average of old and new)
    if (analyzedChar.confidence) {
        existingChar.confidence = Math.round((existingChar.confidence + analyzedChar.confidence) / 2);
    }
    
    existingChar.lastUpdated = Date.now();
    
    // Update lorebook entry
    await updateLorebookEntry(existingChar);
    
    debugLog(`Updated character: ${existingChar.preferredName}`);
}

/**
 * Update or create lorebook entry for a character
 * NOTE: Simplified version - stores data in chat metadata only
 * Future version will integrate with World Info when API is stable
 */
async function updateLorebookEntry(character) {
    if (!lorebookName) {
        debugLog('No lorebook initialized, skipping entry update');
        return;
    }
    
    debugLog(`Character data updated for ${character.preferredName} (lorebook integration pending)`);
    // Data is already saved in chat_metadata via saveChatData()
}

/**
 * Create lorebook content from character data (JSON format)
 */
function createLorebookContent(character) {
    const content = {
        name: character.preferredName,
        aliases: character.aliases,
        physical: character.physical,
        mental: character.mental,
        relationships: character.relationships
    };
    
    return JSON.stringify(content, null, 2);
}

/**
 * Merge two characters
 */
async function mergeCharacters(sourceName, targetName) {
    const settings = getSettings();
    
    const sourceChar = settings.characters[sourceName];
    const targetChar = settings.characters[targetName];
    
    if (!sourceChar || !targetChar) {
        toastr.error('One or both characters not found', 'Name Tracker');
        return;
    }
    
    // Store for undo
    const undoData = {
        operation: 'merge',
        timestamp: Date.now(),
        sourceName: sourceName,
        targetName: targetName,
        sourceData: JSON.parse(JSON.stringify(sourceChar)),
        targetDataBefore: JSON.parse(JSON.stringify(targetChar))
    };
    
    // Add to undo history
    undoHistory.push(undoData);
    if (undoHistory.length > 3) {
        undoHistory.shift();
    }
    
    // Merge aliases
    for (const alias of sourceChar.aliases) {
        if (!targetChar.aliases.includes(alias)) {
            targetChar.aliases.push(alias);
        }
    }
    
    // Add source name as alias if not the same
    if (sourceChar.preferredName !== targetChar.preferredName && 
        !targetChar.aliases.includes(sourceChar.preferredName)) {
        targetChar.aliases.push(sourceChar.preferredName);
    }
    
    // Merge physical (target takes precedence for conflicts, but add new fields)
    targetChar.physical = { ...sourceChar.physical, ...targetChar.physical };
    
    // Merge mental (latest/target data takes precedence)
    targetChar.mental = { ...sourceChar.mental, ...targetChar.mental };
    
    // Merge relationships
    for (const rel of sourceChar.relationships) {
        if (!targetChar.relationships.includes(rel)) {
            targetChar.relationships.push(rel);
        }
    }
    
    // Update timestamp
    targetChar.lastUpdated = Date.now();
    
    // Delete source character
    delete settings.characters[sourceName];
    
    // Delete source lorebook entry if exists
    if (sourceChar.lorebookUid) {
        try {
            const worldInfo = await loadWorldInfo(lorebookName);
            if (worldInfo.entries[sourceChar.lorebookUid]) {
                delete worldInfo.entries[sourceChar.lorebookUid];
                await saveWorldInfo(lorebookName, worldInfo);
            }
        } catch (error) {
            console.error('Error deleting source lorebook entry:', error);
        }
    }
    
    // Update target lorebook entry
    await updateLorebookEntry(targetChar);
    
    // Save and update UI
    saveChatData();
    updateCharacterList();
    
    toastr.success(`Merged ${sourceName} into ${targetName}`, 'Name Tracker');
    
    // Update undo button state
    $("#name_tracker_undo_merge").prop("disabled", false);
}

/**
 * Undo last merge operation
 */
async function undoLastMerge() {
    if (undoHistory.length === 0) {
        toastr.warning('No merge operations to undo', 'Name Tracker');
        return;
    }
    
    const settings = getSettings();
    const lastOp = undoHistory.pop();
    
    if (lastOp.operation !== 'merge') {
        toastr.error('Last operation was not a merge', 'Name Tracker');
        return;
    }
    
    // Restore source character
    settings.characters[lastOp.sourceName] = lastOp.sourceData;
    
    // Restore target character to pre-merge state
    settings.characters[lastOp.targetName] = lastOp.targetDataBefore;
    
    // Restore lorebook entries
    await updateLorebookEntry(settings.characters[lastOp.sourceName]);
    await updateLorebookEntry(settings.characters[lastOp.targetName]);
    
    // Save and update UI
    saveChatData();
    updateCharacterList();
    
    toastr.success('Merge undone successfully', 'Name Tracker');
    
    // Update undo button state
    if (undoHistory.length === 0) {
        $("#name_tracker_undo_merge").prop("disabled", true);
    }
}

/**
 * Toggle ignore status for a character
 */
function toggleIgnoreCharacter(characterName) {
    const settings = getSettings();
    const character = settings.characters[characterName];
    
    if (!character) {
        toastr.error('Character not found', 'Name Tracker');
        return;
    }
    
    character.ignored = !character.ignored;
    
    saveChatData();
    updateCharacterList();
    
    const status = character.ignored ? 'ignored' : 'unignored';
    toastr.info(`${characterName} ${status}`, 'Name Tracker');
}

/**
 * View character in lorebook
 */
async function viewInLorebook(characterName) {
    const settings = getSettings();
    const character = settings.characters[characterName];
    
    if (!character) {
        toastr.error('Character not found', 'Name Tracker');
        return;
    }
    
    // Show character data in a popup since we can't direct link to lorebook yet
    const content = createLorebookContent(character);
    toastr.info(`Character: ${characterName}<br><pre>${content}</pre>`, 'Name Tracker', { timeOut: 10000 });
}

/**
 * Debug logging helper
 */
function debugLog(...args) {
    const settings = getSettings();
    if (settings.debugMode) {
        console.log('[Name Tracker]', ...args);
    }
}

/**
 * Clear analysis cache
 */
function clearCache() {
    analysisCache.clear();
    toastr.info('Analysis cache cleared', 'Name Tracker');
    debugLog('Cache cleared');
}

/**
 * Handle new message event
 */
async function onMessageReceived(messageId) {
    const settings = getSettings();
    
    if (!settings.enabled) {
        return;
    }
    
    // Increment message counter
    settings.messageCounter++;
    saveChatData();
    updateStatusDisplay();
    
    // Check if it's time to harvest
    if (settings.autoAnalyze) {
        const messagesSinceHarvest = settings.messageCounter - settings.lastHarvestMessage;
        
        if (messagesSinceHarvest >= settings.messageFrequency) {
            // Add to queue instead of processing immediately
            addToQueue(async () => {
                await harvestMessages(settings.messageFrequency, true);
            });
        }
    }
}

/**
 * Add task to processing queue
 */
async function addToQueue(task) {
    processingQueue.push(task);
    
    if (!isProcessing) {
        await processQueue();
    }
}

/**
 * Process queued tasks
 */
async function processQueue() {
    if (isProcessing || processingQueue.length === 0) {
        return;
    }
    
    isProcessing = true;
    
    while (processingQueue.length > 0) {
        const task = processingQueue.shift();
        try {
            await task();
        } catch (error) {
            console.error('Error processing queue task:', error);
        }
    }
    
    isProcessing = false;
}

/**
 * Handle chat changed event
 */
async function onChatChanged() {
    // Clear session data
    analysisCache.clear();
    processingQueue = [];
    isProcessing = false;
    undoHistory = [];
    
    // Reload settings for new chat
    await loadSettings();
    
    debugLog('Chat changed, reinitialized extension');
}

/**
 * Event handlers
 */

function onEnabledChange(event) {
    const value = Boolean($(event.target).prop("checked"));
    extension_settings[extensionName].enabled = value;
    saveSettingsDebounced();
    updateStatusDisplay();
    
    toastr.info(value ? 'Name tracking enabled' : 'Name tracking disabled', 'Name Tracker');
}

function onAutoAnalyzeChange(event) {
    const value = Boolean($(event.target).prop("checked"));
    extension_settings[extensionName].autoAnalyze = value;
    saveSettingsDebounced();
    updateStatusDisplay();
}

function onMessageFrequencyChange(event) {
    const value = parseInt($(event.target).val());
    if (value > 0) {
        extension_settings[extensionName].messageFrequency = value;
        saveSettingsDebounced();
        updateStatusDisplay();
    }
}

function onLLMSourceChange(event) {
    const value = $(event.target).val();
    extension_settings[extensionName].llmSource = value;
    saveSettingsDebounced();
    
    if (value === 'ollama') {
        $(".ollama-settings").show();
        loadOllamaModels();
    } else {
        $(".ollama-settings").hide();
    }
}

function onOllamaEndpointChange(event) {
    const value = $(event.target).val();
    extension_settings[extensionName].ollamaEndpoint = value;
    saveSettingsDebounced();
}

function onOllamaModelChange(event) {
    const value = $(event.target).val();
    extension_settings[extensionName].ollamaModel = value;
    saveSettingsDebounced();
}

async function onLoadModelsClick() {
    await loadOllamaModels();
    toastr.success('Ollama models reloaded', 'Name Tracker');
}

function onConfidenceThresholdChange(event) {
    const value = parseInt($(event.target).val());
    extension_settings[extensionName].confidenceThreshold = value;
    $("#name_tracker_confidence_value").text(value);
    saveSettingsDebounced();
}

function onLorebookPositionChange(event) {
    const value = parseInt($(event.target).val());
    extension_settings[extensionName].lorebookPosition = value;
    saveSettingsDebounced();
}

function onLorebookDepthChange(event) {
    const value = parseInt($(event.target).val());
    extension_settings[extensionName].lorebookDepth = value;
    saveSettingsDebounced();
}

function onLorebookCooldownChange(event) {
    const value = parseInt($(event.target).val());
    extension_settings[extensionName].lorebookCooldown = value;
    saveSettingsDebounced();
}

function onLorebookProbabilityChange(event) {
    const value = parseInt($(event.target).val());
    extension_settings[extensionName].lorebookProbability = value;
    saveSettingsDebounced();
}

function onLorebookEnabledChange(event) {
    const value = Boolean($(event.target).prop("checked"));
    extension_settings[extensionName].lorebookEnabled = value;
    saveSettingsDebounced();
}

function onDebugModeChange(event) {
    const value = Boolean($(event.target).prop("checked"));
    extension_settings[extensionName].debugMode = value;
    saveSettingsDebounced();
}

async function onManualAnalyzeClick() {
    const messageCount = parseInt($("#name_tracker_manual_count").val());
    if (messageCount > 0) {
        await harvestMessages(messageCount, true);
    } else {
        toastr.warning('Please enter a valid number of messages', 'Name Tracker');
    }
}

async function onScanAllClick() {
    const context = getContext();
    if (!context.chat || context.chat.length === 0) {
        toastr.warning('No chat messages to scan', 'Name Tracker');
        return;
    }
    
    const totalMessages = context.chat.length;
    const confirmed = confirm(`This will analyze all ${totalMessages} messages in the current chat. This may take a while. Continue?`);
    
    if (confirmed) {
        await harvestMessages(totalMessages, true);
    }
}

function onClearCacheClick() {
    clearCache();
}

async function onUndoMergeClick() {
    await undoLastMerge();
}

// Character action handlers
$(document).on('click', '.char-action-view', function() {
    const name = $(this).data('name');
    viewInLorebook(name);
});

$(document).on('click', '.char-action-merge', async function() {
    const sourceName = $(this).data('name');
    const settings = getSettings();
    
    // Create list of other characters
    const otherChars = Object.keys(settings.characters).filter(name => name !== sourceName);
    
    if (otherChars.length === 0) {
        toastr.warning('No other characters to merge with', 'Name Tracker');
        return;
    }
    
    // Build selection dialog
    let html = `<div class="merge-dialog">
        <p>Merge <strong>${escapeHtml(sourceName)}</strong> into:</p>
        <select id="merge-target-select" class="text_pole">
            ${otherChars.map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('')}
        </select>
        <p class="merge-warning">⚠️ This will delete the source character and merge all data into the target.</p>
    </div>`;
    
    const template = $(`<div>${html}</div>`);
    
    // Use native confirm dialog instead of callPopup
    const targetName = prompt(`Merge "${sourceName}" into which character? Available: ${otherCharacters.map(c => c.preferredName).join(', ')}`);
    if (targetName && settings.characters[targetName]) {
        await mergeCharacters(sourceName, targetName);
    } else if (targetName) {
        toastr.error('Invalid target character name', 'Name Tracker');
    }
});

$(document).on('click', '.char-action-ignore', function() {
    const name = $(this).data('name');
    toggleIgnoreCharacter(name);
});

// Initialize extension when jQuery is ready
jQuery(async () => {
    // Load the settings HTML
    const settingsHtml = await $.get(`${extensionFolderPath}/settings.html`);
    
    // Append to the extensions settings panel
    $("#extensions_settings").append(settingsHtml);
    
    // Set up event listeners for UI elements
    $("#name_tracker_enabled").on("input", onEnabledChange);
    $("#name_tracker_auto_analyze").on("input", onAutoAnalyzeChange);
    $("#name_tracker_message_frequency").on("input", onMessageFrequencyChange);
    $("#name_tracker_llm_source").on("change", onLLMSourceChange);
    $("#name_tracker_ollama_endpoint").on("input", onOllamaEndpointChange);
    $("#name_tracker_ollama_model").on("change", onOllamaModelChange);
    $("#name_tracker_load_models").on("click", onLoadModelsClick);
    $("#name_tracker_confidence_threshold").on("input", onConfidenceThresholdChange);
    $("#name_tracker_lorebook_position").on("change", onLorebookPositionChange);
    $("#name_tracker_lorebook_depth").on("input", onLorebookDepthChange);
    $("#name_tracker_lorebook_cooldown").on("input", onLorebookCooldownChange);
    $("#name_tracker_lorebook_probability").on("input", onLorebookProbabilityChange);
    $("#name_tracker_lorebook_enabled").on("input", onLorebookEnabledChange);
    $("#name_tracker_debug_mode").on("input", onDebugModeChange);
    $("#name_tracker_manual_analyze").on("click", onManualAnalyzeClick);
    $("#name_tracker_scan_all").on("click", onScanAllClick);
    $("#name_tracker_clear_cache").on("click", onClearCacheClick);
    $("#name_tracker_undo_merge").on("click", onUndoMergeClick);
    
    // Subscribe to SillyTavern events
    eventSource.on(event_types.MESSAGE_RECEIVED, onMessageReceived);
    eventSource.on(event_types.MESSAGE_SENT, onMessageReceived);
    eventSource.on(event_types.CHAT_CHANGED, onChatChanged);
    
    // Load settings
    await loadSettings();
    
    console.log("Name Tracker extension loaded");
});
