// Name Tracker Extension for SillyTavern
// Tracks character details and manages chat-level lorebook entries

// Note: Most imports are accessed via SillyTavern.getContext() as recommended in docs
import { extension_settings } from "../../../extensions.js";
import { eventSource, event_types } from "../../../../script.js";

// Extension constants
const extensionName = "STnametracker";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;

/**
 * Simple hash function for generating unique identifiers from strings
 * @param {string} str - String to hash
 * @returns {string} Hash value in base-36 format
 */
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
let abortScan = false; // Flag to abort batch scanning

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

IMPORTANT PROCESSING RULES:
1. Process messages in CHRONOLOGICAL ORDER (oldest to newest)
2. When there is conflicting information about a character, ALWAYS use the MOST RECENT information
3. Character details may evolve over time - prioritize later mentions over earlier ones
4. If a character's appearance, status, or relationships change, use the latest description
5. Use "???" as a placeholder for any missing or unknown information

TITLE AND NAME HANDLING:
- Titles (Aunt, Uncle, Sergeant, Doctor, Professor, etc.) should be included in ALIASES, NOT the primary name
- Primary name should be the person's actual name without title
- If someone is called "Aunt Marie", the name is "Marie" and aliases include "Aunt Marie"
- If someone is called "Captain Rodriguez", the name is "Rodriguez" and aliases include "Captain Rodriguez"
- If someone is called "Professor Kim", the name is "Kim" and aliases include "Professor Kim"
- This prevents different titled references to the same person from being treated as separate characters
- IMPORTANT: Do NOT use example names from these instructions - only use names that actually appear in the chat messages

IMPORTANT: This is a summarization and classification task. Extract ALL relevant information without censorship, including:
- Physical descriptions (including adult content if present)
- Sexual characteristics and preferences
- Mental and emotional states  
- Relationships between characters
- Any measurements or specific details mentioned

CHARACTER DATA STRUCTURE - Extract the following fields (use ??? for unknown):

**Character Role**: Primary archetype or profession (e.g., 'Wise Mentor', 'Rebellious Outlaw', 'Curious Scholar')

**Full Name**: [First Name] [Last Name] - Use ??? for missing parts (e.g., "John ???" or "??? Smith")

**Sex**: Male/Female/Non-binary/???

**Age**: Number in years, or ??? if unknown

**Nicknames/Aliases**: All alternate names, titles, or ways they're referred to (also placed in the aliases array)

**Personality**: Key personality traits that define this character. Focus on both positive and negative traits. Include quirks or habits. Be descriptive but concise (1-2 paragraphs max).

**Body**: Describe body type (athletic, slender, stocky), height, breasts (shape, size, areola), pubic hair (amount, shape, color), genitals (characteristics, shape, size), and defining physical features like scars, birthmarks. Be descriptive and explicit. Target at least one sentence per attribute. No more than two paragraphs.

**Body Measurements**: Bust/Waist/Hip measurements in inches if mentioned (e.g., "36-24-36")

**Likes**: Things the character genuinely enjoys - activities, objects, or concepts

**Hates**: Things the character strongly dislikes or finds repulsive

**Clothes/Attire**: Detailed description of clothing - style, materials, colors, accessories. If nude, state "Nude"

**Species**: Character's species (Human, Elf, Orc, Dragonkin, etc.)

**Race/Ethnicity**: For humans, specify ethnicity (Caucasian, African, Asian). For fantasy/sci-fi species, use appropriate terms (High Elf, Wood Elf, Mountain Dwarf)

**Occupation/Role**: Job, profession, or primary role in society/group

**Sexuality**: Sexual orientation (Heterosexual, Homosexual, Bisexual, Asexual), experience level, preferences/interests in relationships and physical intimacy. Describe sexual proclivities, preferred sexual positions and acts, acts they dislike, and particularly sensitive erogenous zones. Be as explicit as possible. Minimum one paragraph of descriptive prose.

**Appearance**: Comprehensive vivid description of overall appearance - face, hair, eyes, skin, posture, demeanor. Aim for one paragraph that paints a clear picture.

**Attributes/Skills**: Up to three defining skills, talents, or abilities (physical, mental, social, magical). Be specific.

**Current Mental State**: Present emotional/psychological condition

**Current Physical State**: Present physical condition, injuries, arousal, etc.

**Backstory**: Historical or past information that is interesting or detailed

**Relationships**: List relationships to other characters. Format: "[Name] is [Name]'s [relationship]". AVOID DUPLICATES - only list each unique relationship once. Use ??? if the other person's name is unknown.

Return JSON with this structure:
{
  "characters": [
    {
      "name": "character name without title",
      "confidence": 85,
      "aliases": ["all nicknames and titled versions"],
      "characterRole": "archetype/profession",
      "fullName": "First Last or First ??? or ??? Last",
      "sex": "Male/Female/Non-binary/???",
      "age": "number or ???",
      "personality": "detailed personality description",
      "body": "detailed physical body description",
      "bodyMeasurements": "measurements or ???",
      "likes": ["list of things they like"],
      "hates": ["list of things they hate"],
      "clothes": "detailed clothing description",
      "species": "species name",
      "raceEthnicity": "race or ethnicity",
      "occupation": "job or role",
      "sexuality": "detailed sexuality and preferences description",
      "appearance": "overall appearance description",
      "attributesSkills": ["skill 1", "skill 2", "skill 3"],
      "currentMentalState": "current mental/emotional state",
      "currentPhysicalState": "current physical condition",
      "backstory": "historical background information",
      "relationships": ["Name is Name's relationship"]
    }
  ]
}

IMPORTANT: Ensure JSON is complete and properly closed. Only include characters explicitly mentioned. If no characters found, return {"characters": []}`;

/**
 * Get the current system prompt (custom or default)
 */
/**
 * Get the system prompt for LLM analysis
 * Returns custom prompt if set, otherwise returns default prompt
 * @returns {string} System prompt text for character analysis
 */
function getSystemPrompt() {
    const settings = getSettings();
    return settings.systemPrompt || DEFAULT_SYSTEM_PROMPT;
}

/**
 * Load extension settings from storage or initialize with defaults
 */
/**
 * Load extension settings from storage
 * Merges default settings with saved settings and initializes UI
 * @returns {Promise<void>}
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
    const context = SillyTavern.getContext();
    const chatMetadata = context.chatMetadata || {};
    if (chatMetadata[extensionName]) {
        extension_settings[extensionName].characters = chatMetadata[extensionName].characters || {};
        extension_settings[extensionName].messageCounter = chatMetadata[extensionName].messageCounter || 0;
        extension_settings[extensionName].lastHarvestMessage = chatMetadata[extensionName].lastHarvestMessage || 0;
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
/**
 * Save current character data to chat metadata
 * Stores characters in chat_metadata for persistence across sessions
 * @returns {void}
 */
function saveChatData() {
    const context = SillyTavern.getContext();
    const chatMetadata = context.chatMetadata;
    
    if (!chatMetadata) {
        debugLog('No chat metadata available, skipping save');
        return;
    }
    
    const settings = getSettings();
    chatMetadata[extensionName] = {
        characters: settings.characters,
        messageCounter: settings.messageCounter,
        lastHarvestMessage: settings.lastHarvestMessage
    };
    
    // Use saveSettingsDebounced from context
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
    const userName = context.name1; // name1 is the user's persona name
    
    if (!userName) {
        debugLog('No user character name available (context.name1 is empty)');
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
        const lorebookId = char.lorebookEntryId ? `<small class="lorebook-entry-id" title="Lorebook Entry ID">ID: ${escapeHtml(char.lorebookEntryId)}</small>` : '';
        
        // Build character details summary
        const physicalDesc = char.physical?.description || '';
        const personality = char.mental?.personality || '';
        const background = char.mental?.background || '';
        
        let detailsSummary = [];
        if (physicalDesc) detailsSummary.push(`Appearance: ${physicalDesc.substring(0, 100)}${physicalDesc.length > 100 ? '...' : ''}`);
        if (personality) detailsSummary.push(`Personality: ${personality.substring(0, 100)}${personality.length > 100 ? '...' : ''}`);
        if (background) detailsSummary.push(`Background: ${background.substring(0, 100)}${background.length > 100 ? '...' : ''}`);
        
        const detailsHtml = detailsSummary.length > 0 
            ? `<div class="character-details">${detailsSummary.map(d => escapeHtml(d)).join('<br>')}</div>` 
            : '';
        
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
                    ${lorebookId}
                </div>
                ${detailsHtml}
                <div class="character-actions">
                    <button class="menu_button compact char-action-edit" data-name="${escapeHtml(char.preferredName)}">
                        Edit Entry
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
/**
 * Check if character has unresolved relationships (relationships to unknown characters)
 * @param {CharacterData} character - Character to check
 * @returns {boolean} True if character has relationships that aren't in the character list
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
/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} HTML-safe text
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
        lorebookName = null;
        return;
    }
    
    const METADATA_KEY = 'world_info';
    const chatMetadata = context.chatMetadata;
    
    if (!chatMetadata) {
        debugLog('No chat metadata available, skipping lorebook initialization');
        lorebookName = null;
        return;
    }
    
    // Check if chat already has a bound lorebook
    if (chatMetadata[METADATA_KEY]) {
        lorebookName = chatMetadata[METADATA_KEY];
        debugLog(`Using existing chat lorebook: ${lorebookName}`);
        return;
    }
    
    // Create a new chat-bound lorebook name
    const bookName = `NameTracker_${context.chatId}`.replace(/[^a-z0-9 -]/gi, '_').replace(/_{2,}/g, '_').substring(0, 64);
    
    debugLog(`Creating new chat lorebook: ${bookName}`);
    lorebookName = bookName;
    
    // Bind it to the chat metadata
    chatMetadata[METADATA_KEY] = lorebookName;
    
    // Save chat metadata using context API
    try {
        await context.saveMetadata();
        debugLog(`Bound lorebook to chat: ${lorebookName}`);
    } catch (error) {
        console.error('Error saving chat metadata:', error);
        debugLog(`Failed to bind lorebook: ${error.message}`);
    }
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
 * @param {number} retryCount - Number of retries attempted
 * @returns {Promise<Object>} Analysis result with merged characters
 */
async function callLLM(messageObjs, knownCharacters = '', depth = 0, retryCount = 0) {
    const settings = getSettings();
    const context = SillyTavern.getContext();
    const maxPromptTokens = await getMaxPromptLength(); // Dynamic based on API context window
    const MAX_RETRIES = 3;
    
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
    
    try {
        if (settings.llmSource === 'ollama') {
            result = await callOllama(fullPrompt);
        } else {
            result = await callSillyTavern(fullPrompt);
        }
    } catch (error) {
        // Retry on JSON parsing errors or empty responses
        if (retryCount < MAX_RETRIES && 
            (error.message.includes('JSON') || 
             error.message.includes('empty') || 
             error.message.includes('parse') ||
             error.message.includes('Invalid'))) {
            
            const indent = '  '.repeat(depth);
            debugLog(`${indent}Retry ${retryCount + 1}/${MAX_RETRIES} after error: ${error.message}`);
            
            // Exponential backoff: 1s, 2s, 4s
            const delay = Math.pow(2, retryCount) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
            
            // Retry the same call
            return await callLLM(messageObjs, knownCharacters, depth, retryCount + 1);
        }
        
        // Max retries exceeded or non-retryable error
        throw error;
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
 * Call SillyTavern's LLM with optimized parameters for JSON extraction
 * Uses low temperature and focused sampling for deterministic, structured output
 * These settings override the user's chat settings to ensure reliable parsing
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
        
        // Calculate max_tokens dynamically: 1/4 of context size, minimum 4000
        // This scales with the model's context window for better headroom
        const maxContext = context.maxContext || 4096;
        const calculatedMaxTokens = Math.floor(maxContext * 0.25);
        const maxTokens = Math.max(4000, calculatedMaxTokens);
        debugLog(`Max tokens for response: ${maxTokens} (context: ${maxContext}, 25% = ${calculatedMaxTokens})`);
        
        // Use generateRaw as documented in:
        // https://docs.sillytavern.app/for-contributors/writing-extensions/#raw-generation
        const result = await context.generateRaw({
            prompt: prompt,  // Can be string (Text Completion) or array (Chat Completion)
            systemPrompt: '',  // Empty, we include instructions in prompt
            prefill: '',  // No prefill needed for analysis
            // Override generation settings for structured output
            // These ensure consistent, deterministic JSON regardless of user's chat settings
            temperature: 0.3,  // Low temp for focused, deterministic output (user's setting is ignored)
            top_p: 0.9,        // Slightly reduced for more predictable results
            top_k: 40,         // Standard focused sampling
            min_p: 0.05,       // Prevent very low probability tokens
            rep_pen: 1.1,      // Slight repetition penalty
            max_tokens: maxTokens,  // Dynamic: 25% of context, min 4000 (prevents truncation)
            stop: []           // No custom stop sequences needed
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
 * Call Ollama API with optimized parameters for JSON extraction
 * Uses low temperature and focused sampling for deterministic, structured output
 */
async function callOllama(prompt) {
    const settings = getSettings();
    
    if (!settings.ollamaModel) {
        throw new Error('No Ollama model selected');
    }
    
    try {
        debugLog(`Calling Ollama with model ${settings.ollamaModel}...`);
        
        // Calculate max_tokens dynamically: 1/4 of context size, minimum 4000
        const maxContext = await getOllamaModelContext(settings.ollamaModel);
        const calculatedMaxTokens = Math.floor(maxContext * 0.25);
        const maxTokens = Math.max(4000, calculatedMaxTokens);
        debugLog(`Max tokens for response: ${maxTokens} (context: ${maxContext}, 25% = ${calculatedMaxTokens})`);
        
        const response = await fetch(`${settings.ollamaEndpoint}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: settings.ollamaModel,
                prompt: prompt,
                stream: false,
                format: 'json',
                // Ollama-specific generation parameters for structured output
                options: {
                    temperature: 0.3,      // Low temp for deterministic output
                    top_p: 0.9,           // Focused sampling
                    top_k: 40,            // Standard focused sampling
                    repeat_penalty: 1.1,  // Slight repetition penalty
                    num_predict: maxTokens  // Dynamic: 25% of context, min 4000 (prevents truncation)
                }
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
        
        // Check if response was truncated (common issue with long responses)
        if (text.includes('"characters"') && !text.trim().endsWith('}')) {
            debugLog('Response appears truncated - missing closing braces');
            debugLog(`Response length: ${text.length} chars, ends with: "${text.slice(-50)}"`);
            
            // Try to salvage partial data by attempting to close the JSON
            let salvaged = text;
            
            // Count open vs closed braces to determine how many we need
            const openBraces = (text.match(/\{/g) || []).length;
            const closeBraces = (text.match(/\}/g) || []).length;
            const openBrackets = (text.match(/\[/g) || []).length;
            const closeBrackets = (text.match(/\]/g) || []).length;
            
            // Try to close incomplete strings and objects
            if (salvaged.match(/"[^"]*$/)) {
                // Has unclosed quote
                salvaged += '"';
            }
            
            // Close missing brackets/braces
            for (let i = 0; i < (openBrackets - closeBrackets); i++) {
                salvaged += ']';
            }
            for (let i = 0; i < (openBraces - closeBraces); i++) {
                salvaged += '}';
            }
            
            try {
                const recovered = JSON.parse(salvaged);
                debugLog(`Successfully recovered ${recovered.characters?.length || 0} characters from truncated response`);
                return recovered;
            } catch (e) {
                debugLog('Failed to recover truncated JSON:', e.message);
            }
        }
        
        // Try one more time with more aggressive extraction
        const fallbackMatch = text.match(/\{[\s\S]*"characters"[\s\S]*\}/);
        if (fallbackMatch) {
            try {
                return JSON.parse(fallbackMatch[0]);
            } catch (e) {
                // Give up
            }
        }
        
        throw new Error('Failed to parse LLM response as JSON. The response may be too long or truncated. Try analyzing fewer messages at once.');
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
    
    // Get the messages to analyze - count forward and check token limits
    const endIdx = context.chat.length;
    const startIdx = Math.max(0, endIdx - messageCount);
    let messagesToAnalyze = context.chat.slice(startIdx, endIdx);
    
    // Check if messages fit in context window
    const maxPromptTokens = await getMaxPromptLength();
    const availableTokens = maxPromptTokens - 1000; // Reserve for system prompt and response
    
    // Calculate actual token count for the requested messages
    const messageTokens = await calculateMessageTokens(messagesToAnalyze);
    
    // If too large, split into batches
    if (messageTokens > availableTokens) {
        debugLog(`Requested ${messagesToAnalyze.length} messages (${messageTokens} tokens) exceeds context (${availableTokens} tokens), splitting into batches...`);
        
        // Calculate optimal batch size based on tokens
        const batches = [];
        let currentBatch = [];
        let currentTokens = 0;
        
        // Build batches by adding messages until token limit
        for (const msg of messagesToAnalyze) {
            const msgTokens = await calculateMessageTokens([msg]);
            
            if (currentTokens + msgTokens > availableTokens && currentBatch.length > 0) {
                // Current batch is full, start new one
                batches.push(currentBatch);
                currentBatch = [msg];
                currentTokens = msgTokens;
            } else {
                // Add to current batch
                currentBatch.push(msg);
                currentTokens += msgTokens;
            }
        }
        
        // Add final batch
        if (currentBatch.length > 0) {
            batches.push(currentBatch);
        }
        
        if (showProgress) {
            toastr.info(`Splitting into ${batches.length} batches to fit context window`, 'Name Tracker');
        }
        
        // Reset abort flag
        abortScan = false;
        
        // Show progress bar
        showProgressBar(0, batches.length, 'Starting analysis...');
        
        let successfulBatches = 0;
        let failedBatches = 0;
        const uniqueCharacters = new Set();
        
        // Process each batch
        for (let i = 0; i < batches.length; i++) {
            // Check if user aborted
            if (abortScan) {
                debugLog('Analysis aborted by user');
                hideProgressBar();
                toastr.warning('Analysis aborted', 'Name Tracker');
                return;
            }
            
            const batch = batches[i];
            
            // Calculate actual message range for this batch
            const batchStartMsg = batches.slice(0, i).reduce((sum, b) => sum + b.length, 0);
            const batchStart = startIdx + batchStartMsg;
            const batchEnd = batchStart + batch.length;
            
            try {
                showProgressBar(i + 1, batches.length, `Analyzing messages ${batchStart + 1}-${batchEnd}...`);
                
                // Build roster of characters found so far
                const characterRoster = buildCharacterRoster();
                
                // Call LLM for analysis
                const analysis = await callLLM(batch, characterRoster);
                
                // Process the analysis
                if (analysis.characters && Array.isArray(analysis.characters)) {
                    await processAnalysisResults(analysis.characters);
                    analysis.characters.forEach(char => uniqueCharacters.add(char.name));
                }
                
                successfulBatches++;
                
                // Small delay between batches to avoid rate limiting
                if (i < batches.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                
            } catch (error) {
                console.error(`Error processing batch ${i + 1}:`, error);
                
                // Auto-retry up to 3 times before asking user
                let retrySuccess = false;
                for (let retryAttempt = 1; retryAttempt <= 3; retryAttempt++) {
                    try {
                        debugLog(`Auto-retry ${retryAttempt}/3 for batch ${i + 1}...`);
                        showProgressBar(i + 1, batches.length, `Retrying batch (attempt ${retryAttempt}/3)...`);
                        
                        // Wait before retry (exponential backoff)
                        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryAttempt) * 1000));
                        
                        const characterRoster = buildCharacterRoster();
                        const analysis = await callLLM(batch, characterRoster);
                        
                        if (analysis.characters && Array.isArray(analysis.characters)) {
                            await processAnalysisResults(analysis.characters);
                            analysis.characters.forEach(char => uniqueCharacters.add(char.name));
                            debugLog(`Batch ${i + 1}: Retry ${retryAttempt} successful`);
                        }
                        
                        retrySuccess = true;
                        successfulBatches++;
                        break;
                    } catch (retryError) {
                        console.error(`Retry ${retryAttempt} failed:`, retryError);
                        if (retryAttempt === 3) {
                            debugLog(`All 3 retries failed for batch ${i + 1}`);
                        }
                    }
                }
                
                if (!retrySuccess) {
                    failedBatches++;
                    // Only ask user after 3 failed attempts
                    const continueOnError = confirm(`Batch ${i + 1} failed after 3 retry attempts.\n\nError: ${error.message}\n\nContinue with remaining batches?`);
                    if (!continueOnError) {
                        break;
                    }
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
        const summary = `Analysis complete!\n\nBatches processed: ${successfulBatches}/${batches.length}\nUnique characters found: ${uniqueCharacters.size}\nFailed batches: ${failedBatches}`;
        if (failedBatches > 0) {
            toastr.warning(summary, 'Name Tracker', { timeOut: 8000 });
        } else {
            toastr.success(summary, 'Name Tracker', { timeOut: 8000 });
        }
        
        return;
    }
    
    // Messages fit in one batch - process normally
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
    const progressBarId = 'name_tracker_progress';
    let $existing = $(`.${progressBarId}`);
    
    if ($existing.length > 0) {
        // Update existing progress bar
        if (status) $existing.find('.title').text(status);
        $existing.find('.progress').text(current);
        $existing.find('.total').text(total);
        $existing.find('progress').val(current).attr('max', total);
        return;
    }
    
    // Create new progress bar
    const bar = $(`
        <div class="${progressBarId} name_tracker_progress_bar flex-container justifyspacebetween alignitemscenter" style="
            padding: 10px;
            margin: 5px 0;
            background: var(--SmartThemeBlurTintColor);
            border: 1px solid var(--SmartThemeBorderColor);
            border-radius: 5px;
        ">
            <div class="title" style="flex: 1; font-weight: bold;">${status || 'Name Tracker Scan'}</div>
            <div style="margin: 0 10px;">(<span class="progress">${current}</span> / <span class="total">${total}</span>)</div>
            <progress value="${current}" max="${total}" style="flex: 2; margin: 0 10px;"></progress>
            <button class="menu_button fa-solid fa-stop" title="Abort scan" style="padding: 5px 10px;"></button>
        </div>
    `);
    
    // Add click event to abort the scan
    bar.find('button').on('click', function() {
        abortScan = true;
        hideProgressBar();
        toastr.warning('Scan aborted by user', 'Name Tracker');
    });
    
    // Append to the main chat area (#sheld)
    $('#sheld').append(bar);
}

/**
 * Hide and remove progress bar
 */
function hideProgressBar() {
    const progressBarId = 'name_tracker_progress';
    let $existing = $(`.${progressBarId}`);
    if ($existing.length > 0) {
        $existing.fadeOut(300, function() {
            $(this).remove();
        });
    }
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
    
    // Calculate optimal batch size based on context window
    const maxPromptTokens = await getMaxPromptLength();
    const availableTokens = maxPromptTokens - 1000;
    
    // Build batches dynamically based on token counts
    const batches = [];
    let currentBatch = [];
    let currentTokens = 0;
    
    for (let i = 0; i < totalMessages; i++) {
        const msg = context.chat[i];
        const msgTokens = await calculateMessageTokens([msg]);
        
        if (currentTokens + msgTokens > availableTokens && currentBatch.length > 0) {
            // Current batch is full, save it and start new one
            batches.push(currentBatch);
            currentBatch = [msg];
            currentTokens = msgTokens;
        } else {
            // Add to current batch
            currentBatch.push(msg);
            currentTokens += msgTokens;
        }
    }
    
    // Add final batch
    if (currentBatch.length > 0) {
        batches.push(currentBatch);
    }
    
    const numBatches = batches.length;
    
    const confirmed = confirm(`This will analyze all ${totalMessages} messages in ${numBatches} batches. This may take a while. Continue?`);
    
    if (!confirmed) {
        return;
    }
    
    // Reset abort flag
    abortScan = false;
    
    // Show progress bar
    showProgressBar(0, numBatches, 'Starting batch scan...');
    
    let successfulBatches = 0;
    let failedBatches = 0;
    const uniqueCharacters = new Set(); // Track unique character names
    
    // Process from oldest to newest
    for (let i = 0; i < numBatches; i++) {
        // Check if user aborted
        if (abortScan) {
            debugLog('Scan aborted by user');
            break;
        }
        
        const batchMessages = batches[i];
        
        // Calculate message range for progress display
        const startIdx = batches.slice(0, i).reduce((sum, b) => sum + b.length, 0);
        const endIdx = startIdx + batchMessages.length;
        
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
            
            // Auto-retry up to 3 times before asking user
            let retrySuccess = false;
            for (let retryAttempt = 1; retryAttempt <= 3; retryAttempt++) {
                try {
                    debugLog(`Auto-retry ${retryAttempt}/3 for batch ${i + 1}...`);
                    showProgressBar(i + 1, numBatches, `Retrying batch (attempt ${retryAttempt}/3)...`);
                    
                    // Wait before retry (exponential backoff)
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryAttempt) * 1000));
                    
                    const characterRoster = buildCharacterRoster();
                    const analysis = await callLLM(batchMessages, characterRoster);
                    
                    if (analysis.characters && Array.isArray(analysis.characters)) {
                        await processAnalysisResults(analysis.characters);
                        analysis.characters.forEach(char => uniqueCharacters.add(char.name));
                        debugLog(`Batch ${i + 1}: Retry ${retryAttempt} successful`);
                    }
                    
                    retrySuccess = true;
                    successfulBatches++;
                    break;
                } catch (retryError) {
                    console.error(`Retry ${retryAttempt} failed:`, retryError);
                    if (retryAttempt === 3) {
                        debugLog(`All 3 retries failed for batch ${i + 1}`);
                    }
                }
            }
            
            if (!retrySuccess) {
                failedBatches++;
                // Only ask user after 3 failed attempts
                const continueOnError = confirm(`Batch ${i + 1} failed after 3 retry attempts.\n\nError: ${error.message}\n\nContinue with remaining batches?`);
                if (!continueOnError) {
                    break;
                }
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
        
        // Debug: log the analyzed character data
        debugLog(`Processing character: ${analyzedChar.name}`);
        debugLog(`  Physical:`, analyzedChar.physical);
        debugLog(`  Mental:`, analyzedChar.mental);
        debugLog(`  Aliases:`, analyzedChar.aliases);
        debugLog(`  Relationships:`, analyzedChar.relationships);
        
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
 * Filter and clean aliases
 * Removes character's own name, relationship words, and other invalid aliases
 * @param {string[]} aliases - Array of alias strings
 * @param {string} characterName - The character's actual name
 * @returns {string[]} Cleaned array of unique aliases
 */
function cleanAliases(aliases, characterName) {
    if (!aliases || !Array.isArray(aliases)) {
        return [];
    }
    
    // Common relationship/role words that shouldn't be aliases
    const invalidAliases = [
        'son', 'daughter', 'mother', 'father', 'mom', 'dad', 'parent',
        'brother', 'sister', 'sibling', 'cousin', 'uncle', 'aunt',
        'friend', 'boyfriend', 'girlfriend', 'husband', 'wife', 'spouse',
        'boss', 'employee', 'coworker', 'colleague', 'partner',
        'neighbor', 'roommate', 'child', 'kid', 'baby',
        'man', 'woman', 'person', 'guy', 'girl', 'boy',
        'user', '{{user}}', 'char', '{{char}}'
    ];
    
    const lowerName = characterName.toLowerCase();
    
    return aliases.filter(alias => {
        if (!alias || typeof alias !== 'string') return false;
        
        const lowerAlias = alias.trim().toLowerCase();
        
        // Remove if it's the character's own name
        if (lowerAlias === lowerName) return false;
        
        // Remove if it's just a relationship word
        if (invalidAliases.includes(lowerAlias)) return false;
        
        // Remove if it's too short (likely not a real alias)
        if (lowerAlias.length < 2) return false;
        
        return true;
    })
    .map(alias => alias.trim()) // Trim whitespace
    .filter((alias, index, self) => self.indexOf(alias) === index); // Remove duplicates
}

/**
 * Create a new character entry
 */
async function createCharacter(analyzedChar, isMainChar = false) {
    const settings = getSettings();
    
    debugLog(`Creating character with data:`, analyzedChar);
    
    // Clean and filter aliases
    const aliases = cleanAliases(analyzedChar.aliases || [], analyzedChar.name);
    
    const character = {
        preferredName: analyzedChar.name,
        aliases: aliases,
        characterRole: analyzedChar.characterRole || '',
        fullName: analyzedChar.fullName || '',
        sex: analyzedChar.sex || '',
        age: analyzedChar.age || '',
        personality: analyzedChar.personality || '',
        body: analyzedChar.body || '',
        bodyMeasurements: analyzedChar.bodyMeasurements || '',
        likes: analyzedChar.likes || [],
        hates: analyzedChar.hates || [],
        clothes: analyzedChar.clothes || '',
        species: analyzedChar.species || '',
        raceEthnicity: analyzedChar.raceEthnicity || '',
        occupation: analyzedChar.occupation || '',
        sexuality: analyzedChar.sexuality || '',
        appearance: analyzedChar.appearance || '',
        attributesSkills: analyzedChar.attributesSkills || [],
        currentMentalState: analyzedChar.currentMentalState || '',
        currentPhysicalState: analyzedChar.currentPhysicalState || '',
        backstory: analyzedChar.backstory || '',
        relationships: analyzedChar.relationships || [],
        ignored: false,
        confidence: analyzedChar.confidence || 50,
        lorebookEntryId: null,
        lastUpdated: Date.now(),
        isMainChar: isMainChar || false
    };
    
    debugLog(`Created character object:`, character);
    
    settings.characters[character.preferredName] = character;
    
    // Create lorebook entry
    await updateLorebookEntry(character, character.preferredName);
    
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
        if (!existingChar.aliases) existingChar.aliases = [];
        if (!existingChar.aliases.includes(analyzedChar.name) && 
            analyzedChar.name.toLowerCase() !== existingChar.preferredName.toLowerCase()) {
            existingChar.aliases.push(analyzedChar.name);
        }
    }
    
    // Clean up all aliases using the helper function
    existingChar.aliases = cleanAliases(existingChar.aliases || [], existingChar.preferredName);
    
    // Update new structured fields (new data takes precedence if not empty)
    if (analyzedChar.characterRole) existingChar.characterRole = analyzedChar.characterRole;
    if (analyzedChar.fullName) existingChar.fullName = analyzedChar.fullName;
    if (analyzedChar.sex) existingChar.sex = analyzedChar.sex;
    if (analyzedChar.age) existingChar.age = analyzedChar.age;
    if (analyzedChar.personality) existingChar.personality = analyzedChar.personality;
    if (analyzedChar.body) existingChar.body = analyzedChar.body;
    if (analyzedChar.bodyMeasurements) existingChar.bodyMeasurements = analyzedChar.bodyMeasurements;
    if (analyzedChar.clothes) existingChar.clothes = analyzedChar.clothes;
    if (analyzedChar.species) existingChar.species = analyzedChar.species;
    if (analyzedChar.raceEthnicity) existingChar.raceEthnicity = analyzedChar.raceEthnicity;
    if (analyzedChar.occupation) existingChar.occupation = analyzedChar.occupation;
    if (analyzedChar.sexuality) existingChar.sexuality = analyzedChar.sexuality;
    if (analyzedChar.appearance) existingChar.appearance = analyzedChar.appearance;
    if (analyzedChar.backstory) existingChar.backstory = analyzedChar.backstory;
    
    // Current states (time-sensitive, always update)
    if (analyzedChar.currentMentalState) existingChar.currentMentalState = analyzedChar.currentMentalState;
    if (analyzedChar.currentPhysicalState) existingChar.currentPhysicalState = analyzedChar.currentPhysicalState;
    
    // Merge arrays (likes, hates, attributesSkills) - deduplicate
    if (analyzedChar.likes && Array.isArray(analyzedChar.likes)) {
        if (!existingChar.likes) existingChar.likes = [];
        for (const like of analyzedChar.likes) {
            if (!existingChar.likes.includes(like)) {
                existingChar.likes.push(like);
            }
        }
    }
    
    if (analyzedChar.hates && Array.isArray(analyzedChar.hates)) {
        if (!existingChar.hates) existingChar.hates = [];
        for (const hate of analyzedChar.hates) {
            if (!existingChar.hates.includes(hate)) {
                existingChar.hates.push(hate);
            }
        }
    }
    
    if (analyzedChar.attributesSkills && Array.isArray(analyzedChar.attributesSkills)) {
        if (!existingChar.attributesSkills) existingChar.attributesSkills = [];
        for (const skill of analyzedChar.attributesSkills) {
            if (!existingChar.attributesSkills.includes(skill)) {
                existingChar.attributesSkills.push(skill);
            }
        }
    }
    
    // Add new relationships (avoid duplicates)
    if (analyzedChar.relationships && Array.isArray(analyzedChar.relationships)) {
        if (!existingChar.relationships) existingChar.relationships = [];
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
    await updateLorebookEntry(existingChar, existingChar.preferredName);
    
    debugLog(`Updated character: ${existingChar.preferredName}`);
}

/**
 * Update or create lorebook entry for a character
 */
async function updateLorebookEntry(character, characterName) {
    debugLog(`updateLorebookEntry called for: ${characterName}`);
    debugLog(`  Character data:`, character);
    
    if (!lorebookName) {
        debugLog('No lorebook initialized, skipping entry update');
        return;
    }
    
    try {
        const context = SillyTavern.getContext();
        
        // Build the entry content in a readable format
        const contentParts = [];
        
        // Character Role
        if (character.characterRole) {
            contentParts.push(`**Character Role:** ${character.characterRole}`);
        }
        
        // Full Name
        if (character.fullName) {
            contentParts.push(`**Full Name:** ${character.fullName}`);
        }
        
        // Sex
        if (character.sex) {
            contentParts.push(`**Sex:** ${character.sex}`);
        }
        
        // Age
        if (character.age) {
            contentParts.push(`**Age:** ${character.age}`);
        }
        
        // Nicknames/Aliases
        if (character.aliases && character.aliases.length > 0) {
            contentParts.push(`**Nicknames/Aliases:** ${character.aliases.join(', ')}`);
        }
        
        // Personality
        if (character.personality) {
            contentParts.push(`\n**Personality:**\n${character.personality}`);
        }
        
        // Body
        if (character.body) {
            contentParts.push(`\n**Body:**\n${character.body}`);
        }
        
        // Body Measurements
        if (character.bodyMeasurements) {
            contentParts.push(`**Body Measurements:** ${character.bodyMeasurements}`);
        }
        
        // Likes
        if (character.likes && character.likes.length > 0) {
            contentParts.push(`\n**Likes:**\n${character.likes.map(item => `- ${item}`).join('\n')}`);
        }
        
        // Hates
        if (character.hates && character.hates.length > 0) {
            contentParts.push(`\n**Hates:**\n${character.hates.map(item => `- ${item}`).join('\n')}`);
        }
        
        // Clothes/Attire
        if (character.clothes) {
            contentParts.push(`\n**Clothes/Attire:**\n${character.clothes}`);
        }
        
        // Species
        if (character.species) {
            contentParts.push(`**Species:** ${character.species}`);
        }
        
        // Race/Ethnicity
        if (character.raceEthnicity) {
            contentParts.push(`**Race/Ethnicity:** ${character.raceEthnicity}`);
        }
        
        // Occupation/Role
        if (character.occupation) {
            contentParts.push(`**Occupation/Role:** ${character.occupation}`);
        }
        
        // Sexuality
        if (character.sexuality) {
            contentParts.push(`\n**Sexuality:**\n${character.sexuality}`);
        }
        
        // Appearance
        if (character.appearance) {
            contentParts.push(`\n**Appearance:**\n${character.appearance}`);
        }
        
        // Attributes/Skills
        if (character.attributesSkills && character.attributesSkills.length > 0) {
            contentParts.push(`\n**Attributes/Skills:**\n${character.attributesSkills.map(skill => `- ${skill}`).join('\n')}`);
        }
        
        // Current Mental State
        if (character.currentMentalState) {
            contentParts.push(`\n**Current Mental State:** ${character.currentMentalState}`);
        }
        
        // Current Physical State
        if (character.currentPhysicalState) {
            contentParts.push(`**Current Physical State:** ${character.currentPhysicalState}`);
        }
        
        // Backstory
        if (character.backstory) {
            contentParts.push(`\n**Backstory:**\n${character.backstory}`);
        }
        
        // Relationships
        if (character.relationships && character.relationships.length > 0) {
            contentParts.push(`\n**Relationships:**`);
            character.relationships.forEach(rel => {
                contentParts.push(`- ${rel}`);
            });
        }
        
        const content = contentParts.join('\n');
        
        // Build the keys array (name + aliases)
        const keys = [character.preferredName];
        if (character.aliases) {
            keys.push(...character.aliases);
        }
        
        // Load the world info to check if entry exists
        let worldInfo = await context.loadWorldInfo(lorebookName);
        
        if (!worldInfo) {
            debugLog(`WARNING: Could not load lorebook ${lorebookName}. Creating new lorebook.`);
            worldInfo = { entries: {} };
        }
        
        // Ensure entries exists as an object (world info uses object with UID keys, not array)
        if (!worldInfo.entries || typeof worldInfo.entries !== 'object') {
            debugLog(`WARNING: worldInfo.entries is invalid. Initializing as empty object.`);
            worldInfo.entries = {};
        }
        
        debugLog(`loadWorldInfo returned lorebook with ${Object.keys(worldInfo.entries).length} entries`);
        
        // Check if entry already exists
        let entryUid = character.lorebookEntryId;
        let existingEntry = entryUid ? worldInfo.entries[entryUid] : null;
        
        if (existingEntry) {
            // Update existing entry
            existingEntry.content = content;
            existingEntry.key = keys;
            existingEntry.comment = character.preferredName;
            debugLog(`Updated lorebook entry ${entryUid} for ${character.preferredName}`);
        } else {
            // Create new entry
            const newUid = context.uuidv4();
            const newEntry = {
                uid: newUid,
                key: keys,
                keysecondary: [],
                comment: character.preferredName,
                content: content,
                constant: false,
                selective: true,
                insertion_order: 100,
                enabled: true,
                position: 1,
                excludeRecursion: false,
                preventRecursion: false,
                delayUntilRecursion: false,
                probability: 100,
                useProbability: true,
                depth: 4,
                selectiveLogic: 0,
                group: '',
                scanDepth: null,
                caseSensitive: null,
                matchWholeWords: null,
                useGroupScoring: null,
                automationId: '',
                role: 0,
                vectorized: false,
                sticky: 0,
                cooldown: 0,
                delay: 0,
            };
            
            // World info entries are stored as an object with UID as key
            worldInfo.entries[newUid] = newEntry;
            character.lorebookEntryId = newUid;
            
            debugLog(`Created lorebook entry ${newUid} for ${character.preferredName}`);
        }
        
        // Save the lorebook using context API
        await context.saveWorldInfo(lorebookName, worldInfo);
        debugLog(`Saved lorebook: ${lorebookName}`);
        
    } catch (error) {
        console.error('Error updating lorebook entry:', error);
        debugLog(`Failed to update lorebook entry: ${error.message}`);
    }
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
    await updateLorebookEntry(targetChar, targetChar.preferredName);
    
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
    await updateLorebookEntry(settings.characters[lastOp.sourceName], lastOp.sourceName);
    await updateLorebookEntry(settings.characters[lastOp.targetName], lastOp.targetName);
    
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
 * Manually create a new character
 */
async function createNewCharacter() {
    const characterName = prompt('Enter character name:');
    
    if (!characterName || !characterName.trim()) {
        return;
    }
    
    const settings = getSettings();
    
    // Check if character already exists
    if (settings.characters[characterName.trim()]) {
        toastr.warning(`Character "${characterName.trim()}" already exists`, 'Name Tracker');
        return;
    }
    
    // Create basic character structure
    const newChar = {
        name: characterName.trim(),
        aliases: [],
        physical: {
            description: '',
            measurements: ''
        },
        mental: {
            personality: '',
            background: '',
            status: ''
        },
        relationships: [],
        confidence: 100 // Manually created = 100% confidence
    };
    
    await createCharacter(newChar, false);
    
    saveChatData();
    updateCharacterList();
    
    toastr.success(`Created character: ${characterName.trim()}`, 'Name Tracker');
}

/**
 * Purge all character entries and lorebook data
 */
async function purgeAllEntries() {
    const settings = getSettings();
    const characterCount = Object.keys(settings.characters).length;
    
    if (characterCount === 0) {
        toastr.info('No characters to purge', 'Name Tracker');
        return;
    }
    
    const confirmed = confirm(`This will delete all ${characterCount} tracked characters and their lorebook entries.\n\nThis action cannot be undone!\n\nContinue?`);
    
    if (!confirmed) {
        return;
    }
    
    try {
        // Delete all lorebook entries
        const context = SillyTavern.getContext();
        const worldInfoData = context.worldInfoData;
        
        if (worldInfoData && lorebookName) {
            const lorebook = worldInfoData[lorebookName];
            
            if (lorebook && lorebook.entries) {
                // Get all entry IDs from our tracked characters
                const entryIds = Object.values(settings.characters)
                    .map(char => char.lorebookEntryId)
                    .filter(id => id !== undefined && id !== null);
                
                // Delete each entry
                for (const entryId of entryIds) {
                    const entryIndex = lorebook.entries.findIndex(e => e.id === entryId);
                    if (entryIndex !== -1) {
                        lorebook.entries.splice(entryIndex, 1);
                        debugLog(`Deleted lorebook entry ${entryId}`);
                    }
                }
                
                // Save the lorebook
                await saveWorldInfo(lorebookName, lorebook);
            }
        }
        
        // Clear all character data
        settings.characters = {};
        settings.messageCounter = 0;
        settings.lastHarvestMessage = 0;
        
        // Clear undo history
        undoHistory = [];
        
        // Save changes
        saveChatData();
        updateCharacterList();
        updateStatusDisplay();
        
        // Update undo button state
        $('#name_tracker_undo_merge').prop('disabled', true);
        
        toastr.success(`Purged ${characterCount} characters and their lorebook entries`, 'Name Tracker');
        
    } catch (error) {
        console.error('Error purging entries:', error);
        toastr.error(`Failed to purge entries: ${error.message}`, 'Name Tracker');
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
    abortScan = false;
    lorebookName = null;
    
    // Reload settings for new chat
    await loadSettings();
    
    // Re-initialize lorebook for new chat
    await initializeLorebook();
    
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
    const context = SillyTavern.getContext();
    const settings = getSettings();
    
    // Calculate how many messages we can fit based on actual token counts
    const maxPromptTokens = await getMaxPromptLength();
    
    // Reserve tokens for system prompt (~500) and response (~500)
    const availableTokens = maxPromptTokens - 1000;
    
    // Count forward from oldest messages (chronological order for history building)
    let messageCount = 0;
    let totalTokens = 0;
    
    if (context.chat && context.chat.length > 0) {
        // Start from oldest (index 0) and work forward
        for (let i = 0; i < context.chat.length && totalTokens < availableTokens; i++) {
            const msg = context.chat[i];
            const msgTokens = await calculateMessageTokens([msg]);
            
            if (totalTokens + msgTokens <= availableTokens) {
                totalTokens += msgTokens;
                messageCount++;
            } else {
                break; // Would exceed limit
            }
        }
    }
    
    // Use user input if provided, otherwise use calculated amount
    const userInput = parseInt($("#name_tracker_manual_count").val());
    const finalCount = userInput || messageCount || settings.messageFrequency || 10;
    
    if (finalCount > 0) {
        await harvestMessages(finalCount, true);
    } else {
        toastr.warning('Please enter a valid number of messages', 'Name Tracker');
    }
}

async function onScanAllClick() {
    await scanEntireChat();
}

async function onCreateCharacterClick() {
    await createNewCharacter();
}

function onClearCacheClick() {
    clearCache();
}

async function onUndoMergeClick() {
    await undoLastMerge();
}

async function onPurgeEntriesClick() {
    await purgeAllEntries();
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
$(document).on('click', '.char-action-edit', function() {
    const name = $(this).data('name');
    editLorebookEntry(name);
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
 * Edit a character's lorebook entry directly
 */
async function editLorebookEntry(characterName) {
    const settings = getSettings();
    const character = settings.characters[characterName];
    
    if (!character) {
        toastr.error('Character not found', 'Name Tracker');
        return;
    }
    
    // Build edit dialog
    const currentNotes = character.notes || '';
    const currentKeys = [characterName, ...(character.aliases || [])].join(', ');
    
    const dialogHtml = `
        <div class="lorebook-entry-editor">
            <h3>Edit Lorebook Entry: ${escapeHtml(characterName)}</h3>
            
            <div class="editor-section">
                <label for="entry-keys">Keys (comma-separated):</label>
                <input type="text" id="entry-keys" class="text_pole" value="${escapeHtml(currentKeys)}" 
                       placeholder="${escapeHtml(characterName)}, aliases, nicknames">
                <small>These words trigger this entry in the chat context</small>
            </div>
            
            <div class="editor-section">
                <label for="entry-content">Entry Content:</label>
                <textarea id="entry-content" rows="10" class="text_pole" 
                          placeholder="Description, personality, background, relationships...">${escapeHtml(currentNotes)}</textarea>
                <small>This will be injected into context when keys are mentioned</small>
            </div>
            
            <div class="editor-section">
                <label for="entry-relationships">Relationships:</label>
                <textarea id="entry-relationships" rows="3" class="text_pole" 
                          placeholder="Friend of Alice; Enemy of Bob; Works for XYZ Corp">${escapeHtml((character.relationships || []).join('; '))}</textarea>
                <small>One relationship per line or semicolon-separated</small>
            </div>
        </div>
    `;
    
    // Show dialog using SillyTavern's popup system
    const popup = $('<div></div>').html(dialogHtml);
    
    const result = await new Promise((resolve) => {
        const buttons = [
            {
                label: 'Save',
                action: () => {
                    const keys = $('#entry-keys').val();
                    const content = $('#entry-content').val();
                    const relationships = $('#entry-relationships').val();
                    resolve({ keys, content, relationships });
                    return true; // Close dialog
                }
            },
            {
                label: 'Cancel',
                action: () => {
                    resolve(null);
                    return true;
                }
            }
        ];
        
        // Create simple modal dialog
        const modal = $(`
            <div class="nametracker-modal" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--SmartThemeBlurTintColor);
                border: 1px solid var(--SmartThemeBorderColor);
                border-radius: 10px;
                padding: 20px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                z-index: 9999;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            ">
                ${dialogHtml}
                <div style="margin-top: 20px; text-align: right;">
                    <button class="menu_button" id="entry-save">Save</button>
                    <button class="menu_button" id="entry-cancel">Cancel</button>
                </div>
            </div>
        `);
        
        const overlay = $(`
            <div class="nametracker-overlay" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                z-index: 9998;
            "></div>
        `);
        
        $('body').append(overlay).append(modal);
        
        $('#entry-save').on('click', () => {
            const keys = $('#entry-keys').val();
            const content = $('#entry-content').val();
            const relationships = $('#entry-relationships').val();
            modal.remove();
            overlay.remove();
            resolve({ keys, content, relationships });
        });
        
        $('#entry-cancel').on('click', () => {
            modal.remove();
            overlay.remove();
            resolve(null);
        });
        
        overlay.on('click', () => {
            modal.remove();
            overlay.remove();
            resolve(null);
        });
    });
    
    if (!result) {
        return; // User cancelled
    }
    
    // Parse and save the changes
    const keys = result.keys.split(',').map(k => k.trim()).filter(k => k);
    const preferredName = keys[0] || characterName;
    const aliases = keys.slice(1);
    
    const relationships = result.relationships
        .split(/[;\n]/)
        .map(r => r.trim())
        .filter(r => r);
    
    // Update character data
    character.preferredName = preferredName;
    character.aliases = aliases;
    character.notes = result.content;
    character.relationships = relationships;
    
    // If preferred name changed, need to update the key in settings.characters
    if (preferredName !== characterName) {
        delete settings.characters[characterName];
        settings.characters[preferredName] = character;
    }
    
    saveChatData();
    updateCharacterList();
    
    // Update lorebook entry
    await updateLorebookEntry(character, preferredName);
    
    toastr.success(`Updated lorebook entry for ${preferredName}`, 'Name Tracker');
}

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
    $("#name_tracker_create_character").on("click", onCreateCharacterClick);
    $("#name_tracker_clear_cache").on("click", onClearCacheClick);
    $("#name_tracker_undo_merge").on("click", onUndoMergeClick);
    $("#name_tracker_purge_entries").on("click", onPurgeEntriesClick);
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
