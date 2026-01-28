/**
 * Simplified settings management for Name Tracker extension
 * Uses SillyTavern standard patterns with preserved error handling
 */

import { errorHandler } from './errors.js';
import { createModuleLogger } from './debug.js';
import { stContext } from './context.js';

const MODULE_NAME = 'STnametracker';
const debug = createModuleLogger('Settings');

// Cache for context availability to avoid repeated null checks
let contextAvailable = false;
let lastContextCheck = 0;
const CONTEXT_CHECK_INTERVAL = 100; // Check every 100ms max
let hasLoggedUnavailable = false; // Only log warning once

function getContextSettings() {
    // CORRECTED: Use direct global access pattern (MessageSummarize/Codex/Nicknames pattern)
    // All reference extensions use window.extension_settings[MODULE_NAME] directly,
    // NOT through context.extension_settings (which doesn't exist)
    
    // Check if window.extension_settings is available
    if (!window.extension_settings) {
        return {
            extSettings: null,
            saveSettings: null,
        };
    }

    // Get context for saveSettingsDebounced
    const context = stContext.getContext();
    
    return {
        extSettings: window.extension_settings,  // Direct global access
        saveSettings: context?.saveSettingsDebounced || null,
    };
}

// Default settings structure
const DEFAULT_SETTINGS = Object.freeze({
    enabled: true,
    autoAnalyze: true,
    messageFrequency: 10,
    llmSource: 'sillytavern', // 'sillytavern' or 'ollama'
    ollamaEndpoint: 'http://localhost:11434',
    ollamaModel: '',
    confidenceThreshold: 70,
    lorebookPosition: 0, // after character defs
    lorebookDepth: 1,
    lorebookCooldown: 10,
    lorebookScanDepth: 1,
    lorebookProbability: 100,
    lorebookEnabled: true,
    debugMode: false,
    systemPrompt: null, // null means use default
    maxResponseTokens: 5000, // Maximum tokens for LLM response (budget cap)
    lastScannedMessageId: -1,
    totalCharactersDetected: 0,
    lastAnalysisTime: null,
    analysisCache: new Map(),
});

// Default chat-level data structure
const DEFAULT_CHAT_DATA = Object.freeze({
    characters: {},
    lastScannedMessageId: -1,
    analysisHistory: [],
    lorebookEntries: {},
    processingStats: {
        totalProcessed: 0,
        charactersFound: 0,
        lastProcessedTime: null,
    },
});

/**
 * Get current settings with defaults
 * @returns {Object} Current settings
 */
function get_settings() {
    return errorHandler.withErrorBoundary('Settings', () => {
        const { extSettings } = getContextSettings();
        if (!extSettings) {
            // Only log once to avoid console spam
            if (!hasLoggedUnavailable) {
                console.warn('[STnametracker] extension_settings not yet available, using defaults');
                hasLoggedUnavailable = true;
            }
            return { ...DEFAULT_SETTINGS };
        }

        // Context now available, reset warning flag for next session
        hasLoggedUnavailable = false;

        // Initialize if not exists
        let needsSave = false;
        if (!extSettings[MODULE_NAME]) {
            console.log('[STnametracker] First-time initialization: creating default settings');
            extSettings[MODULE_NAME] = { ...DEFAULT_SETTINGS };
            needsSave = true;
        }

        // Merge with defaults to ensure all properties exist
        const settings = { ...DEFAULT_SETTINGS, ...extSettings[MODULE_NAME] };
        
        // Persist defaults if this was first initialization
        if (needsSave && saveSettings && typeof saveSettings === 'function') {
            console.log('[STnametracker] Saving default settings to persist them');
            saveSettings();
        }
        
        return settings;
    }, { ...DEFAULT_SETTINGS });
}

/**
 * Update settings and save
 * @param {Object} newSettings - Settings to update
 */
function set_settings(newSettings) {
    return errorHandler.withErrorBoundary('Settings', () => {
        const { extSettings, saveSettings } = getContextSettings();
        if (!extSettings) {
            console.warn('[STnametracker] extension_settings not available for saving');
            return;
        }

        // Initialize if not exists
        if (!extSettings[MODULE_NAME]) {
            extSettings[MODULE_NAME] = { ...DEFAULT_SETTINGS };
        }

        // Update settings
        Object.assign(extSettings[MODULE_NAME], newSettings);

        // Save to SillyTavern
        if (typeof saveSettings === 'function') {
            saveSettings();
        }
    });
}

/**
 * Get current chat characters
 * @returns {Object} Chat characters data
 */
function getCharacters() {
    return errorHandler.withErrorBoundary('Settings', () => {
        try {
            const metadata = stContext.getChatMetadata();

            // Initialize if not exists
            if (!metadata[MODULE_NAME]) {
                metadata[MODULE_NAME] = { ...DEFAULT_CHAT_DATA };
            }

            return metadata[MODULE_NAME].characters || {};
        } catch (error) {
            debug.warn('Failed to get characters:', error.message);
            return {};
        }
    }, {});
}

/**
 * Update chat characters and save
 * @param {Object} characters - Characters data to save
 */
async function setCharacters(characters) {
    return errorHandler.withErrorBoundary('Settings', async () => {
        try {
            const metadata = stContext.getChatMetadata();

            // Initialize if not exists
            if (!metadata[MODULE_NAME]) {
                metadata[MODULE_NAME] = { ...DEFAULT_CHAT_DATA };
            }

            // Update characters
            metadata[MODULE_NAME].characters = characters;

            // CRITICAL: AWAIT the save to complete before returning
            await stContext.saveMetadata();
        } catch (error) {
            debug.warn('Failed to set characters:', error.message);
            throw error; // Re-throw so caller knows it failed
        }
    });
}

/**
 * Get chat-level data
 * @returns {Object} Chat metadata
 */
function getChatData() {
    return errorHandler.withErrorBoundary('Settings', () => {
        try {
            const metadata = stContext.getChatMetadata();

            // Initialize if not exists
            if (!metadata[MODULE_NAME]) {
                metadata[MODULE_NAME] = { ...DEFAULT_CHAT_DATA };
            }

            return metadata[MODULE_NAME];
        } catch (error) {
            debug.warn('Failed to get chat data:', error.message);
            return { ...DEFAULT_CHAT_DATA };
        }
    }, { ...DEFAULT_CHAT_DATA });
}

/**
 * Update chat-level data
 * @param {Object} data - Data to update
 */
async function setChatData(data) {
    return errorHandler.withErrorBoundary('Settings', async () => {
        try {
            const metadata = stContext.getChatMetadata();

            // Initialize if not exists
            if (!metadata[MODULE_NAME]) {
                metadata[MODULE_NAME] = { ...DEFAULT_CHAT_DATA };
            }

            // Update data
            Object.assign(metadata[MODULE_NAME], data);

            // CRITICAL: AWAIT the save to complete before returning
            await stContext.saveMetadata();
        } catch (error) {
            debug.warn('Failed to set chat data:', error.message);
            throw error; // Re-throw so caller knows it failed
        }
    });
}

/**
 * Add a character to the current chat
 * @param {string} name - Character name
 * @param {Object} characterData - Character data
 */
async function addCharacter(name, characterData) {
    return errorHandler.withErrorBoundary('Settings', async () => {
        const characters = await getCharacters();
        characters[name] = characterData;
        await setCharacters(characters); // AWAIT the async save
    });
}

/**
 * Remove a character from the current chat
 * @param {string} name - Character name to remove
 */
async function removeCharacter(name) {
    return errorHandler.withErrorBoundary('Settings', async () => {
        const characters = await getCharacters();
        delete characters[name];
        await setCharacters(characters); // AWAIT the async save
    });
}

/**
 * Get a specific setting value
 * @param {string} key - Setting key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Setting value
 */
async function getSetting(key, defaultValue) {
    const settings = await get_settings();
    return settings[key] !== undefined ? settings[key] : defaultValue;
}

/**
 * Set a specific setting value
 * @param {string} key - Setting key
 * @param {*} value - Setting value
 */
async function setSetting(key, value) {
    const update = {};
    update[key] = value;
    await set_settings(update);
}

/**
 * Get a single character by name
 * @param {string} name - Character name
 * @returns {Object|null} Character data or null if not found
 */
async function getCharacter(name) {
    return errorHandler.withErrorBoundary('Settings', async () => {
        if (!name || typeof name !== 'string') {
            console.warn('[STnametracker] Invalid character name:', name);
            return null;
        }
        const chars = await getCharacters();
        return chars[name] || null;
    });
}

/**
 * Set a character by name
 * @param {string} name - Character name
 * @param {Object} character - Character data
 */
async function setCharacter(name, character) {
    return errorHandler.withErrorBoundary('Settings', async () => {
        if (!name || typeof name !== 'string') {
            throw new Error('Character name must be a non-empty string');
        }
        if (!character || typeof character !== 'object') {
            throw new Error('Character data must be an object');
        }
        console.log('[NT-Settings] 🟩 setCharacter() called for:', name);
        const chars = { ...await getCharacters() };
        chars[name] = character;
        await setCharacters(chars); // AWAIT the async setCharacters
        debug.log(`Set character: ${name}`);
        console.log('[NT-Settings] 🟩 setCharacter() completed for:', name);
    });
}

/**
 * Get LLM configuration (Fixed: No Promise contamination)
 * @returns {Object} LLM configuration object with resolved values
 */
async function getLLMConfig() {
    try {
        const llmSource = await getSetting('llmSource');
        const ollamaEndpoint = await getSetting('ollamaEndpoint');
        const ollamaModel = await getSetting('ollamaModel');
        const systemPrompt = await getSetting('systemPrompt');

        const { extSettings } = getContextSettings();
        const moduleSettings = extSettings ? extSettings[MODULE_NAME] : null;
        debug.log('[NT-LLMConfig] llmSource setting:', llmSource);
        debug.log('[NT-LLMConfig] extension_settings keys for module:', moduleSettings ? Object.keys(moduleSettings) : 'none');

        // Ensure no Promise objects are returned
        return {
            source: (typeof llmSource === 'string') ? llmSource : 'sillytavern',
            ollamaEndpoint: (typeof ollamaEndpoint === 'string') ? ollamaEndpoint : 'http://localhost:11434',
            ollamaModel: (typeof ollamaModel === 'string') ? ollamaModel : '',
            systemPrompt: (typeof systemPrompt === 'string') ? systemPrompt : null,
        };
    } catch (error) {
        console.warn('[STnametracker] Error getting LLM config, using defaults:', error);
        return { source: 'sillytavern', ollamaEndpoint: 'http://localhost:11434', ollamaModel: '', systemPrompt: null };
    }
}

/**
 * Get lorebook configuration (Fixed: No Promise contamination)
 * @returns {Object} Lorebook configuration object with resolved values
 */
async function getLorebookConfig() {
    try {
        const position = await getSetting('lorebookPosition');
        const depth = await getSetting('lorebookDepth');
        const cooldown = await getSetting('lorebookCooldown');
        const scanDepth = await getSetting('lorebookScanDepth');
        const probability = await getSetting('lorebookProbability');
        const enabled = await getSetting('lorebookEnabled');

        // Ensure no Promise objects are returned
        return {
            position: (typeof position === 'number') ? position : 0,
            depth: (typeof depth === 'number') ? depth : 1,
            cooldown: (typeof cooldown === 'number') ? cooldown : 5,
            scanDepth: (typeof scanDepth === 'number') ? scanDepth : 1,
            probability: (typeof probability === 'number') ? probability : 100,
            enabled: (typeof enabled === 'boolean') ? enabled : true,
        };
    } catch (error) {
        console.warn('[STnametracker] Error getting lorebook config, using defaults:', error);
        return { position: 0, depth: 1, cooldown: 5, scanDepth: 1, probability: 100, enabled: true };
    }
}

/**
 * Alias for get_settings for compatibility
 * @returns {Object} Current settings
 */
async function getSettings() {
    return await get_settings();
}

/**
 * Get chat metadata value
 * @param {string} key - Metadata key
 * @returns {any} Metadata value
 */
function get_chat_metadata(key) {
    return errorHandler.withErrorBoundary('Settings', () => {
        try {
            const metadata = stContext.getChatMetadata();

            if (!metadata[MODULE_NAME]) {
                metadata[MODULE_NAME] = { ...DEFAULT_CHAT_DATA };
            }

            return metadata[MODULE_NAME][key];
        } catch (error) {
            debug.warn('Failed to get chat metadata:', error.message);
            return DEFAULT_CHAT_DATA[key];
        }
    }, DEFAULT_CHAT_DATA[key]);
}

/**
 * Set chat metadata value
 * @param {string} key - Metadata key
 * @param {any} value - New value
 */
function set_chat_metadata(key, value) {
    return errorHandler.withErrorBoundary('Settings', () => {
        try {
            const metadata = stContext.getChatMetadata();

            if (!metadata[MODULE_NAME]) {
                metadata[MODULE_NAME] = { ...DEFAULT_CHAT_DATA };
            }

            metadata[MODULE_NAME][key] = value;
            debug.log(`Updated chat data ${key}`);

            stContext.saveMetadata().catch(err => {
                debug.warn('Failed to save chat metadata:', err.message);
            });
        } catch (error) {
            debug.warn('Failed to set chat metadata:', error.message);
        }
    });
}

export {
    MODULE_NAME,
    DEFAULT_SETTINGS,
    DEFAULT_CHAT_DATA,
    get_settings,
    set_settings,
    getCharacters,
    setCharacters,
    getChatData,
    setChatData,
    addCharacter,
    removeCharacter,
    getSetting,
    setSetting,
    getCharacter,
    setCharacter,
    getLLMConfig,
    getLorebookConfig,
    getSettings,
    get_chat_metadata,
    set_chat_metadata,
};
