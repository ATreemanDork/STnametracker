// Name Tracker Extension for SillyTavern
// Tracks character details and manages chat-level lorebook entries

// Note: Most imports are accessed via SillyTavern.getContext() as recommended in docs
import { extension_settings } from "../../../extensions.js";
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
    systemPrompt: null, // null means use default
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
 * Default system prompt for character analysis
 */
const DEFAULT_SYSTEM_PROMPT = `You are a character analysis assistant. Your task is to extract character information from chat messages and return it in a structured JSON format.

CRITICAL: You MUST respond with ONLY valid JSON. Do not include any explanatory text, markdown formatting, or commentary. Just the raw JSON object.

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
 * Get the current system prompt (custom or default)
 */
function getSystemPrompt() {
    const settings = getSettings();
    return settings.systemPrompt || DEFAULT_SYSTEM_PROMPT;
}

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
    
    // Auto-add user's character to ignored list if extension is enabled
    if (extension_settings[extensionName].enabled) {
        ensureUserCharacterIgnored();
    }
    
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
    
    // Use saveSettingsDebounced from context
    const context = SillyTavern.getContext();
    context.saveSettingsDebounced();
}

/**
 * Get the current extension settings
 * @returns {Object} Current extension settings
 */
function getSettings() {
    return extension_settings[extensionName];
}

/**
 * Add user's character to ignored list if not already present
 */
function ensureUserCharacterIgnored() {
    const settings = getSettings();
    const context = SillyTavern.getContext();
    const userName = context.name2;
    
    if (!userName) {
        debugLog('No user character name available (context.name2 is empty)');
        return;
    }
    
    // Check if user's character already exists and is ignored
    if (settings.characters[userName]) {
        if (!settings.characters[userName].ignored) {
            settings.characters[userName].ignored = true;
            saveChatData();
            debugLog(`Marked existing user character "${userName}" as ignored`);
        }
        return;
    }
    
    // Add user's character as ignored
    settings.characters[userName] = {
        preferredName: userName,
        aliases: [],
        notes: 'Auto-added: User character',
        ignored: true,
        isMainChar: false,
        appearances: 0,
        lastMentioned: 0
    };
    
    saveChatData();
    updateCharacterList();
    debugLog(`Auto-added user character "${userName}" to ignored list`);
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
    
    // Sort: Main characters first, then by name
    characters.sort((a, b) => {
        // {{char}} always comes first
        if (a.isMainChar && !b.isMainChar) return -1;
        if (!a.isMainChar && b.isMainChar) return 1;
        // Otherwise sort alphabetically
        return a.preferredName.localeCompare(b.preferredName);
    });
    
    for (const char of characters) {
        const charIcon = char.isMainChar ? '<i class="fa-solid fa-user" title="Active Character"></i> ' : '';
        
        const item = $(`
            <div class="name-tracker-character ${char.isMainChar ? 'main-character' : ''}" data-name="${escapeHtml(char.preferredName)}">
                <div class="character-header">
                    <span class="character-name ${char.ignored ? 'ignored' : ''}">${charIcon}${escapeHtml(char.preferredName)}</span>
                    ${char.isMainChar ? '<span class="character-badge main-char">ACTIVE</span>' : ''}
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
    const context = SillyTavern.getContext();
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
 * Get Ollama model context size
 * @param {string} modelName - Name of the Ollama model
 * @returns {Promise<number>} Context size in tokens, or default 4096
 */
async function getOllamaModelContext(modelName) {
    const settings = getSettings();
    
    if (!modelName) {
        debugLog('No Ollama model specified, using default context size');
        return 4096;
    }
    
    try {
        const response = await fetch(`${settings.ollamaEndpoint}/api/show`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: modelName
            })
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch model info: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Look for num_ctx in parameters array
        if (data.parameters && Array.isArray(data.parameters)) {
            for (const param of data.parameters) {
                const match = param.match(/num_ctx\s+(\d+)/);
                if (match) {
                    const contextSize = parseInt(match[1]);
                    debugLog(`Ollama model ${modelName} context size: ${contextSize} tokens`);
                    return contextSize;
                }
            }
        }
        
        // Fallback: check if it's in model details
        if (data.model_info && data.model_info.num_ctx) {
            const contextSize = parseInt(data.model_info.num_ctx);
            debugLog(`Ollama model ${modelName} context size: ${contextSize} tokens`);
            return contextSize;
        }
        
        debugLog(`Could not find context size for ${modelName}, using default 4096`);
        return 4096;
    } catch (error) {
        console.error('Error fetching Ollama model context:', error);
        debugLog(`Failed to get Ollama context size, using default 4096`);
        return 4096;
    }
}

/**
 * Build a roster of known characters for context
 * @returns {string} Formatted roster text
 */
function buildCharacterRoster() {
    const settings = getSettings();
    const characters = settings.characters || {};
    const characterNames = Object.keys(characters);
    
    if (characterNames.length === 0) {
        return '';
    }
    
    const roster = characterNames.map(name => {
        const char = characters[name];
        const aliases = char.aliases && char.aliases.length > 0 
            ? ` (also known as: ${char.aliases.join(', ')})`
            : '';
        const relationships = char.relationships && char.relationships.length > 0
            ? `\n    Relationships: ${char.relationships.join('; ')}`
            : '';
        return `  - ${name}${aliases}${relationships}`;
    }).join('\n');
    
    return `\n\n[KNOWN CHARACTERS]\nThe following characters have already been identified. If you encounter them again, use the same name and add any new details:\n${roster}\n`;
}

/**
 * Get the maximum safe prompt length based on API context window
 * Uses actual token counts from messages when available
 * @returns {Promise<number>} Maximum prompt length in tokens
 */
async function getMaxPromptLength() {
    const settings = getSettings();
    let maxContext = 4096; // Default
    
    if (settings.llmSource === 'ollama' && settings.ollamaModel) {
        // Get Ollama model's context size
        maxContext = await getOllamaModelContext(settings.ollamaModel);
    } else {
        // Use SillyTavern's context
        const context = SillyTavern.getContext();
        maxContext = context.maxContext || 4096;
    }
    
    // Reserve 50% of context for system prompt, response, and safety margin
    const tokensForPrompt = Math.floor(maxContext * 0.5);
    
    debugLog(`API max context: ${maxContext} tokens, calculated max prompt: ${tokensForPrompt} tokens`);
    
    // Return at least 1000 tokens, max 25000 tokens
    return Math.max(1000, Math.min(tokensForPrompt, 25000));
}

/**
 * Calculate total token count for a batch of messages
 * Uses pre-calculated token counts from SillyTavern when available
 * @param {Array} messages - Array of chat message objects
 * @returns {number} Total token count
 */
async function calculateMessageTokens(messages) {
    const context = SillyTavern.getContext();
    let totalTokens = 0;
    
    // Try to use pre-calculated token counts from message objects
    for (const msg of messages) {
        if (msg && typeof msg === 'object' && msg.extra && typeof msg.extra.token_count === 'number') {
            // SillyTavern stores token count in extra.token_count
            totalTokens += msg.extra.token_count;
        } else {
            // Fallback: use getTokenCountAsync for the message text
            const text = msg?.mes || msg?.message || String(msg);
            if (text && context.getTokenCountAsync) {
                try {
                    const count = await context.getTokenCountAsync(text);
                    totalTokens += count;
                } catch (e) {
                    // Final fallback: rough estimate (4 chars per token)
                    totalTokens += Math.ceil(text.length / 4);
                }
            } else {
                // Character-based estimate
                totalTokens += Math.ceil(text.length / 4);
            }
        }
    }
    
    return totalTokens;
}

/**
 * Call LLM for character analysis with automatic batch splitting if prompt is too long
 * @param {Array} messageObjs - Array of message objects (with .mes property) or strings
 * @param {string} knownCharacters - Roster of previously identified characters
 * @param {number} depth - Recursion depth (for logging)
 * @returns {Promise<Object>} Analysis result with merged characters
 */
async function callLLM(messageObjs, knownCharacters = '', depth = 0) {
    const settings = getSettings();
    const context = SillyTavern.getContext();
    const maxPromptTokens = await getMaxPromptLength(); // Dynamic based on API context window
    
    // Extract message text
    const messages = messageObjs.map(msg => {
        if (typeof msg === 'string') return msg;
        if (msg.mes) return msg.mes;
        if (msg.message) return msg.message;
        return JSON.stringify(msg);
    });
    
    // Create cache key
    const cacheKey = simpleHash(messages.join('\n') + settings.llmSource + settings.ollamaModel);
    
    // Check cache
    if (analysisCache.has(cacheKey)) {
        debugLog('Using cached analysis result');
        return analysisCache.get(cacheKey);
    }
    
    // Build the prompt
    const messagesText = messages.map((msg, idx) => `Message ${idx + 1}:\n${msg}`).join('\n\n');
    const systemInstructions = `[SYSTEM INSTRUCTION - DO NOT ROLEPLAY]\n${getSystemPrompt()}${knownCharacters}\n\n[DATA TO ANALYZE]`;
    const fullPrompt = `${systemInstructions}\n${messagesText}\n\n[RESPOND WITH JSON ONLY - NO STORY CONTINUATION]`;
    
    // Calculate actual token count for the prompt
    let promptTokens;
    try {
        promptTokens = await context.getTokenCountAsync(fullPrompt);
    } catch (e) {
        // Fallback to character-based estimate
        promptTokens = Math.ceil(fullPrompt.length / 4);
    }
    
    // If prompt is too long, split into sub-batches
    if (promptTokens > maxPromptTokens && messageObjs.length > 1) {
        const indent = '  '.repeat(depth);
        debugLog(`${indent}Prompt too long (${promptTokens} tokens > ${maxPromptTokens} limit), splitting ${messageObjs.length} messages into 2 sub-batches`);
        
        // Split messages in half
        const midPoint = Math.floor(messages.length / 2);
        const firstHalf = messages.slice(0, midPoint);
        const secondHalf = messages.slice(midPoint);
        
        // Process each half recursively with same character context
        const [result1, result2] = await Promise.all([
            callLLM(firstHalf, knownCharacters, depth + 1),
            callLLM(secondHalf, knownCharacters, depth + 1)
        ]);
        
        // Merge the results
        const mergedResult = {
            characters: [
                ...(result1.characters || []),
                ...(result2.characters || [])
            ]
        };
        
        debugLog(`${indent}Merged ${result1.characters?.length || 0} + ${result2.characters?.length || 0} = ${mergedResult.characters.length} characters from sub-batches`);
        
        // Cache the merged result
        if (analysisCache.size > 50) {
            const firstKey = analysisCache.keys().next().value;
            analysisCache.delete(firstKey);
        }
        analysisCache.set(cacheKey, mergedResult);
        
        return mergedResult;
    }
    
    // Prompt is acceptable length, proceed with analysis
    let result;
    
    if (settings.llmSource === 'ollama') {
        result = await callOllama(fullPrompt);
    } else {
        result = await callSillyTavern(fullPrompt);
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
        
        // Use SillyTavern.getContext() as recommended in official docs
        const context = SillyTavern.getContext();
        
        // Check if we have an active API connection
        if (!context.onlineStatus) {
            throw new Error('No API connection available. Please connect to an API first.');
        }
        
        // Get token count for the prompt
        let promptTokens;
        try {
            promptTokens = await context.getTokenCountAsync(prompt);
            debugLog(`Generating with prompt: ${promptTokens} tokens (~${prompt.length} chars)`);
        } catch (e) {
            promptTokens = Math.ceil(prompt.length / 4);
            debugLog(`Generating with prompt length: ${prompt.length} chars (est. ${promptTokens} tokens)`);
        }
        
        // Use generateRaw as documented in:
        // https://docs.sillytavern.app/for-contributors/writing-extensions/#raw-generation
        const result = await context.generateRaw({
            prompt: prompt,  // Can be string (Text Completion) or array (Chat Completion)
            systemPrompt: '',  // Empty, we include instructions in prompt
            prefill: ''  // No prefill needed for analysis
        });
        
        debugLog('SillyTavern LLM raw response:', result?.substring(0, 200));
        
        // The result should be a string
        if (!result) {
            throw new Error('Empty response from SillyTavern LLM');
        }
        
        return parseJSONResponse(result);
    } catch (error) {
        console.error('Error calling SillyTavern LLM:', error);
        
        // Provide helpful error messages
        if (error.message.includes('No message generated')) {
            // This often means context overflow or API issue
            const contextHint = prompt.length > 10000 
                ? ' (Prompt may be too long - try reducing Message Frequency in settings)' 
                : '';
            throw new Error(`API failed to generate response${contextHint}`);
        }
        
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
        debugLog('Ollama raw response:', data);
        debugLog('Ollama response text:', data.response?.substring(0, 200));
        
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
    if (!text || typeof text !== 'string') {
        console.error('Invalid response text:', text);
        throw new Error('LLM returned empty or invalid response');
    }
    
    // Remove any leading/trailing whitespace
    text = text.trim();
    
    // Try to extract JSON from markdown code blocks (```json or ```)
    let jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
        text = jsonMatch[1].trim();
    }
    
    // Try to find JSON object in the text (look for first { to last })
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        text = text.substring(firstBrace, lastBrace + 1);
    }
    
    // Remove common prefixes that LLMs add
    text = text.replace(/^(?:Here's the analysis:|Here is the JSON:|Result:|Output:)\s*/i, '');
    
    // Clean up common formatting issues
    text = text.trim();
    
    try {
        const parsed = JSON.parse(text);
        
        // Validate structure
        if (!parsed.characters || !Array.isArray(parsed.characters)) {
            console.warn('Response missing characters array, returning empty:', parsed);
            return { characters: [] };
        }
        
        return parsed;
    } catch (error) {
        console.error('Failed to parse JSON response. Original text:', text);
        console.error('Parse error:', error.message);
        
        // Try one more time with more aggressive extraction
        const fallbackMatch = text.match(/\{[\s\S]*"characters"[\s\S]*\}/);
        if (fallbackMatch) {
            try {
                return JSON.parse(fallbackMatch[0]);
            } catch (e) {
                // Give up
            }
        }
        
        throw new Error('Failed to parse LLM response as JSON. The LLM may not be following instructions. Try enabling debug mode to see the raw response.');
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
    
    // Check API connection for SillyTavern mode
    if (settings.llmSource === 'sillytavern') {
        const context = SillyTavern.getContext();
        if (!context.onlineStatus) {
            toastr.warning('Please connect to an API (OpenAI, Claude, etc.) before analyzing messages', 'Name Tracker');
            return;
        }
    }
    
    const context = SillyTavern.getContext();
    if (!context.chat || context.chat.length === 0) {
        debugLog('No chat messages to harvest');
        toastr.info('No messages in chat to analyze', 'Name Tracker');
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
        // Build roster of characters found so far
        const characterRoster = buildCharacterRoster();
        
        // Call LLM for analysis with character context (pass message objects)
        const analysis = await callLLM(messagesToAnalyze, characterRoster);
        
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
 * Show progress bar for batch scanning
 * @param {number} current - Current batch number (1-indexed)
 * @param {number} total - Total number of batches
 * @param {string} status - Status message
 */
function showProgressBar(current, total, status = '') {
    let progressBar = $('#name_tracker_progress');
    
    if (progressBar.length === 0) {
        // Create progress bar if it doesn't exist
        progressBar = $(`
            <div id="name_tracker_progress" style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 9999;
                background: var(--SmartThemeBodyColor);
                border-bottom: 2px solid var(--SmartThemeBorderColor);
                padding: 10px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            ">
                <div style="max-width: 800px; margin: 0 auto;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span id="name_tracker_progress_label" style="font-weight: bold;">Name Tracker</span>
                        <span id="name_tracker_progress_text"></span>
                    </div>
                    <div style="
                        width: 100%;
                        height: 20px;
                        background: var(--SmartThemeBlurTintColor);
                        border-radius: 10px;
                        overflow: hidden;
                        position: relative;
                    ">
                        <div id="name_tracker_progress_fill" style="
                            height: 100%;
                            background: linear-gradient(90deg, #4CAF50, #45a049);
                            transition: width 0.3s ease;
                            width: 0%;
                        "></div>
                    </div>
                </div>
            </div>
        `);
        $('body').append(progressBar);
    }
    
    const percentage = (current / total * 100).toFixed(1);
    progressBar.find('#name_tracker_progress_fill').css('width', percentage + '%');
    progressBar.find('#name_tracker_progress_text').text(`${current}/${total} batches (${percentage}%)`);
    
    if (status) {
        progressBar.find('#name_tracker_progress_label').text(status);
    }
}

/**
 * Hide and remove progress bar
 */
function hideProgressBar() {
    $('#name_tracker_progress').fadeOut(300, function() {
        $(this).remove();
    });
}

/**
 * Scan entire chat in batches from oldest to newest
 * Processes in chunks equal to messageFrequency for progressive context building
 */
async function scanEntireChat() {
    const settings = getSettings();
    const context = SillyTavern.getContext();
    
    if (!context.chat || context.chat.length === 0) {
        toastr.warning('No chat messages to scan', 'Name Tracker');
        return;
    }
    
    // Check API connection for SillyTavern mode
    if (settings.llmSource === 'sillytavern') {
        if (!context.onlineStatus) {
            toastr.warning('Please connect to an API (OpenAI, Claude, etc.) before analyzing messages', 'Name Tracker');
            return;
        }
    }
    
    const totalMessages = context.chat.length;
    const batchSize = settings.messageFrequency || 10;
    const numBatches = Math.ceil(totalMessages / batchSize);
    
    const confirmed = confirm(`This will analyze all ${totalMessages} messages in ${numBatches} batches of up to ${batchSize} messages each. This may take a while. Continue?`);
    
    if (!confirmed) {
        return;
    }
    
    // Show progress bar
    showProgressBar(0, numBatches, 'Starting batch scan...');
    
    let successfulBatches = 0;
    let failedBatches = 0;
    const uniqueCharacters = new Set(); // Track unique character names
    
    // Process from oldest to newest
    for (let i = 0; i < numBatches; i++) {
        const startIdx = i * batchSize;
        const endIdx = Math.min(startIdx + batchSize, totalMessages);
        const batchMessages = context.chat.slice(startIdx, endIdx);
        
        try {
            showProgressBar(i + 1, numBatches, `Processing messages ${startIdx + 1}-${endIdx}...`);
            
            // Build roster of characters found so far
            const characterRoster = buildCharacterRoster();
            
            // Call LLM for analysis with character context (pass message objects)
            const analysis = await callLLM(batchMessages, characterRoster);
            
            // Process the analysis
            if (analysis.characters && Array.isArray(analysis.characters)) {
                await processAnalysisResults(analysis.characters);
                // Track unique characters
                analysis.characters.forEach(char => uniqueCharacters.add(char.name));
                debugLog(`Batch ${i + 1}: Found ${analysis.characters.length} character(s) in this batch`);
            }
            
            successfulBatches++;
            
            // Small delay between batches to avoid rate limiting
            if (i < numBatches - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
        } catch (error) {
            console.error(`Error processing batch ${i + 1}:`, error);
            failedBatches++;
            
            // If it's a "No message generated" error, try splitting this batch in half
            if (error.message.includes('API failed to generate response') && batchMessages.length > 1) {
                const retrySplit = confirm(`Batch ${i + 1} failed (possibly too large). Try splitting it into smaller sub-batches?`);
                if (retrySplit) {
                    try {
                        // Split the batch in half and retry
                        const midPoint = Math.floor(batchMessages.length / 2);
                        const firstHalf = batchMessages.slice(0, midPoint);
                        const secondHalf = batchMessages.slice(midPoint);
                        
                        // Process first half
                        showProgressBar(i + 1, numBatches, `Processing messages ${startIdx + 1}-${startIdx + midPoint} (retry)...`);
                        const characterRoster1 = buildCharacterRoster();
                        const analysis1 = await callLLM(firstHalf, characterRoster1);
                        if (analysis1.characters) {
                            await processAnalysisResults(analysis1.characters);
                            analysis1.characters.forEach(char => uniqueCharacters.add(char.name));
                        }
                        
                        // Process second half
                        showProgressBar(i + 1, numBatches, `Processing messages ${startIdx + midPoint + 1}-${endIdx} (retry)...`);
                        const characterRoster2 = buildCharacterRoster();
                        const analysis2 = await callLLM(secondHalf, characterRoster2);
                        if (analysis2.characters) {
                            await processAnalysisResults(analysis2.characters);
                            analysis2.characters.forEach(char => uniqueCharacters.add(char.name));
                        }
                        
                        successfulBatches++;
                        failedBatches--; // Remove the original failure count
                        debugLog(`Batch ${i + 1}: Retry successful after splitting`);
                        continue;
                    } catch (retryError) {
                        console.error(`Retry of batch ${i + 1} also failed:`, retryError);
                    }
                }
            }
            
            // Ask user if they want to continue on error
            const continueOnError = confirm(`Batch ${i + 1} failed with error: ${error.message}\n\nContinue with remaining batches?`);
            if (!continueOnError) {
                break;
            }
        }
    }
    
    // Hide progress bar
    hideProgressBar();
    
    // Update last harvest message counter
    settings.lastHarvestMessage = settings.messageCounter;
    saveChatData();
    updateStatusDisplay();
    
    // Show summary
    const totalUniqueCharacters = uniqueCharacters.size;
    const summary = `Scan complete!\n\nBatches processed: ${successfulBatches}/${numBatches}\nUnique characters found: ${totalUniqueCharacters}\nFailed batches: ${failedBatches}`;
    if (failedBatches > 0) {
        toastr.warning(summary, 'Name Tracker', { timeOut: 8000 });
    } else {
        toastr.success(summary, 'Name Tracker', { timeOut: 8000 });
    }
}

/**
 * Process analysis results and update character data
 */
async function processAnalysisResults(analyzedChars) {
    const settings = getSettings();
    const context = SillyTavern.getContext();
    
    // Get list of loaded SillyTavern characters for comparison
    const loadedCharacters = context.characters || [];
    const loadedCharNames = loadedCharacters.map(c => c.name || c.avatar?.replace(/\.(png|jpg|jpeg|webp)$/i, ''));
    
    for (const analyzedChar of analyzedChars) {
        if (!analyzedChar.name) {
            continue;
        }
        
        // Special handling for {{user}} - always ignore
        if (analyzedChar.name === '{{user}}' || analyzedChar.name.toLowerCase() === 'user') {
            debugLog(`Auto-ignoring {{user}} character - user characteristics are managed by user`);
            continue;
        }
        
        // Check if this name matches a loaded SillyTavern character
        // If so, mark as main character (they're part of the active cast)
        const isLoadedChar = loadedCharNames.some(name => 
            name && (
                name.toLowerCase() === analyzedChar.name.toLowerCase() ||
                analyzedChar.name.toLowerCase().includes(name.toLowerCase()) ||
                name.toLowerCase().includes(analyzedChar.name.toLowerCase())
            )
        );
        
        // Also check for {{char}} placeholder (but this can match multiple characters)
        const mentionsCharPlaceholder = analyzedChar.name === '{{char}}';
        
        if (isLoadedChar || mentionsCharPlaceholder) {
            debugLog(`Detected loaded character: ${analyzedChar.name}${mentionsCharPlaceholder ? ' (via {{char}})' : ''} - marking as main`);
        }
        
        const isMainChar = isLoadedChar;
        
        // Check if this character should be ignored
        if (isIgnoredCharacter(analyzedChar.name)) {
            debugLog(`Skipping ignored character: ${analyzedChar.name}`);
            continue;
        }
        
        // Try to find existing character (by name or alias)
        const existingChar = findExistingCharacter(analyzedChar.name);
        
        if (existingChar) {
            // Update existing character
            await updateCharacter(existingChar, analyzedChar, false, isMainChar);
        } else {
            // Check if this might be an alias of an existing character
            const matchedChar = await findPotentialMatch(analyzedChar);
            
            if (matchedChar) {
                // High confidence match - merge automatically
                debugLog(`Auto-merging ${analyzedChar.name} into ${matchedChar.preferredName}`);
                await updateCharacter(matchedChar, analyzedChar, true, isMainChar);
            } else {
                // Create new character entry
                await createCharacter(analyzedChar, isMainChar);
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
async function createCharacter(analyzedChar, isMainChar = false) {
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
        lastUpdated: Date.now(),
        isMainChar: isMainChar || false  // Flag for {{char}}
    };
    
    settings.characters[character.preferredName] = character;
    
    // Create lorebook entry
    await updateLorebookEntry(character);
    
    debugLog(`Created new character: ${character.preferredName}${isMainChar ? ' (MAIN CHARACTER)' : ''}`);
}

/**
 * Update existing character with new information
 */
async function updateCharacter(existingChar, analyzedChar, addAsAlias = false, isMainChar = false) {
    // Mark as main character if detected
    if (isMainChar) {
        existingChar.isMainChar = true;
    }
    
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
    
    if (!lorebookName) {
        toastr.warning('No active chat or lorebook', 'Name Tracker');
        return;
    }
    
    // Import the openWorldInfoEditor function from SillyTavern
    const context = SillyTavern.getContext();
    
    // Open the lorebook editor
    if (typeof context.openWorldInfoEditor === 'function') {
        await context.openWorldInfoEditor(lorebookName);
        toastr.success(`Opened lorebook for ${characterName}`, 'Name Tracker');
    } else {
        // Fallback: show the world info panel if openWorldInfoEditor doesn't exist
        $('#WorldInfo').click();
        toastr.info(`Please select "${lorebookName}" from the World Info panel`, 'Name Tracker');
    }
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
    SillyTavern.getContext().saveSettingsDebounced();
    updateStatusDisplay();
    
    // Auto-add user's character to ignored list when enabling
    if (value) {
        ensureUserCharacterIgnored();
    }
    
    toastr.info(value ? 'Name tracking enabled' : 'Name tracking disabled', 'Name Tracker');
}

function onAutoAnalyzeChange(event) {
    const value = Boolean($(event.target).prop("checked"));
    extension_settings[extensionName].autoAnalyze = value;
    SillyTavern.getContext().saveSettingsDebounced();
    updateStatusDisplay();
}

function onMessageFrequencyChange(event) {
    const value = parseInt($(event.target).val());
    if (value > 0) {
        extension_settings[extensionName].messageFrequency = value;
        SillyTavern.getContext().saveSettingsDebounced();
        updateStatusDisplay();
    }
}

function onLLMSourceChange(event) {
    const value = $(event.target).val();
    extension_settings[extensionName].llmSource = value;
    SillyTavern.getContext().saveSettingsDebounced();
    
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
    SillyTavern.getContext().saveSettingsDebounced();
}

function onOllamaModelChange(event) {
    const value = $(event.target).val();
    extension_settings[extensionName].ollamaModel = value;
    SillyTavern.getContext().saveSettingsDebounced();
}

async function onLoadModelsClick() {
    await loadOllamaModels();
    toastr.success('Ollama models reloaded', 'Name Tracker');
}

function onConfidenceThresholdChange(event) {
    const value = parseInt($(event.target).val());
    extension_settings[extensionName].confidenceThreshold = value;
    $("#name_tracker_confidence_value").text(value);
    SillyTavern.getContext().saveSettingsDebounced();
}

function onLorebookPositionChange(event) {
    const value = parseInt($(event.target).val());
    extension_settings[extensionName].lorebookPosition = value;
    SillyTavern.getContext().saveSettingsDebounced();
}

function onLorebookDepthChange(event) {
    const value = parseInt($(event.target).val());
    extension_settings[extensionName].lorebookDepth = value;
    SillyTavern.getContext().saveSettingsDebounced();
}

function onLorebookCooldownChange(event) {
    const value = parseInt($(event.target).val());
    extension_settings[extensionName].lorebookCooldown = value;
    SillyTavern.getContext().saveSettingsDebounced();
}

function onLorebookProbabilityChange(event) {
    const value = parseInt($(event.target).val());
    extension_settings[extensionName].lorebookProbability = value;
    SillyTavern.getContext().saveSettingsDebounced();
}

function onLorebookEnabledChange(event) {
    const value = Boolean($(event.target).prop("checked"));
    extension_settings[extensionName].lorebookEnabled = value;
    SillyTavern.getContext().saveSettingsDebounced();
}

function onDebugModeChange(event) {
    const value = Boolean($(event.target).prop("checked"));
    extension_settings[extensionName].debugMode = value;
    SillyTavern.getContext().saveSettingsDebounced();
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
    await scanEntireChat();
}

function onClearCacheClick() {
    clearCache();
}

async function onUndoMergeClick() {
    await undoLastMerge();
}

async function onEditSystemPromptClick() {
    const settings = getSettings();
    const currentPrompt = settings.systemPrompt || DEFAULT_SYSTEM_PROMPT;
    
    // Create popup HTML
    const popupHtml = `
        <div class="system-prompt-editor">
            <h3>Edit System Prompt</h3>
            <p>Customize the instructions sent to the LLM for character analysis.</p>
            <textarea id="system_prompt_editor" rows="20" style="width: 100%; font-family: monospace; font-size: 12px;">${escapeHtml(currentPrompt)}</textarea>
            <div class="system-prompt-actions" style="margin-top: 10px; display: flex; gap: 10px; justify-content: flex-end;">
                <button id="system_prompt_reset" class="menu_button">Reset to Default</button>
                <button id="system_prompt_cancel" class="menu_button">Cancel</button>
                <button id="system_prompt_save" class="menu_button">Save</button>
            </div>
        </div>
    `;
    
    // Create and show popup
    const popup = $('<div></div>').html(popupHtml);
    $('body').append(popup);
    
    // Style the popup
    popup.css({
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'var(--SmartThemeBodyColor)',
        border: '1px solid var(--SmartThemeBorderColor)',
        borderRadius: '5px',
        padding: '20px',
        zIndex: 9999,
        maxWidth: '800px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
    });
    
    // Add backdrop
    const backdrop = $('<div></div>').css({
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 9998
    });
    $('body').append(backdrop);
    
    // Handle reset button
    $('#system_prompt_reset').on('click', function() {
        if (confirm('Reset to default system prompt? This will discard your custom prompt.')) {
            $('#system_prompt_editor').val(DEFAULT_SYSTEM_PROMPT);
        }
    });
    
    // Handle cancel button
    $('#system_prompt_cancel').on('click', function() {
        popup.remove();
        backdrop.remove();
    });
    
    // Handle save button
    $('#system_prompt_save').on('click', function() {
        const newPrompt = $('#system_prompt_editor').val().trim();
        
        if (!newPrompt) {
            toastr.error('System prompt cannot be empty', 'Name Tracker');
            return;
        }
        
        // Save the prompt (null if it matches default)
        if (newPrompt === DEFAULT_SYSTEM_PROMPT) {
            settings.systemPrompt = null;
        } else {
            settings.systemPrompt = newPrompt;
        }
        
        SillyTavern.getContext().saveSettingsDebounced();
        toastr.success('System prompt updated', 'Name Tracker');
        
        popup.remove();
        backdrop.remove();
    });
    
    // Close on backdrop click
    backdrop.on('click', function() {
        $('#system_prompt_cancel').trigger('click');
    });
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

/**
 * Open the chat lorebook in the World Info editor
 */
async function openChatLorebook() {
    if (!lorebookName) {
        toastr.warning('No active chat or lorebook', 'Name Tracker');
        return;
    }
    
    const context = SillyTavern.getContext();
    if (typeof context.openWorldInfoEditor === 'function') {
        await context.openWorldInfoEditor(lorebookName);
    } else {
        // Fallback: show the world info panel
        $('#WorldInfo').click();
        toastr.info(`Please select "${lorebookName}" from the World Info panel`, 'Name Tracker');
    }
}

/**
 * Toggle auto-harvest on/off
 */
function toggleAutoHarvest() {
    const settings = getSettings();
    settings.autoAnalyze = !settings.autoAnalyze;
    
    // Update the settings UI
    $('#name_tracker_auto_analyze').prop('checked', settings.autoAnalyze);
    
    // Save settings
    SillyTavern.getContext().saveSettingsDebounced();
    
    toastr.success(
        `Auto-harvest ${settings.autoAnalyze ? 'enabled' : 'disabled'}`,
        'Name Tracker'
    );
}

/**
 * Initialize extension menu buttons
 */
function initializeMenuButtons() {
    const context = SillyTavern.getContext();
    
    // Add "Open Chat Lorebook" button
    if (typeof context.addExtensionMenuButton === 'function') {
        context.addExtensionMenuButton(
            'Open Chat Lorebook',
            'fa-solid fa-book',
            openChatLorebook,
            'Open the Name Tracker chat lorebook in the World Info editor'
        );
    }
    
    // Add "Toggle Auto-Harvest" button
    if (typeof context.addExtensionMenuButton === 'function') {
        context.addExtensionMenuButton(
            'Toggle Auto-Harvest',
            'fa-solid fa-seedling',
            toggleAutoHarvest,
            'Toggle automatic character harvesting on/off'
        );
    }
}

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
    $("#name_tracker_edit_prompt").on("click", onEditSystemPromptClick);
    
    // Subscribe to SillyTavern events
    eventSource.on(event_types.MESSAGE_RECEIVED, onMessageReceived);
    eventSource.on(event_types.MESSAGE_SENT, onMessageReceived);
    eventSource.on(event_types.CHAT_CHANGED, onChatChanged);
    
    // Load settings
    await loadSettings();
    
    // Initialize extension menu buttons
    initializeMenuButtons();
    
    console.log("Name Tracker extension loaded");
});
