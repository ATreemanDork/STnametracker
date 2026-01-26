/**
 * Simplified settings management for Name Tracker extension
 * Uses SillyTavern standard patterns with preserved error handling
 */

import { errorHandler } from './errors.js';
import { createModuleLogger } from './debug.js';
import { stContext } from './context.js';

const MODULE_NAME = 'STnametracker';
const debug = createModuleLogger('Settings');

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
    lorebookCooldown: 5,
    lorebookScanDepth: 1,
    lorebookProbability: 100,
    lorebookEnabled: true,
    debugMode: false,
    systemPrompt: null, // null means use default
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
        // Ensure extension_settings exists
        if (typeof extension_settings === 'undefined') {
            console.warn('[STnametracker] extension_settings not available');
            return { ...DEFAULT_SETTINGS };
        }

        // Initialize if not exists
        if (!extension_settings[MODULE_NAME]) {
            extension_settings[MODULE_NAME] = { ...DEFAULT_SETTINGS };
        }

        // Merge with defaults to ensure all properties exist
        const settings = { ...DEFAULT_SETTINGS, ...extension_settings[MODULE_NAME] };
        return settings;
    }, { ...DEFAULT_SETTINGS });
}

/**
 * Update settings and save
 * @param {Object} newSettings - Settings to update
 */
function set_settings(newSettings) {
    return errorHandler.withErrorBoundary('Settings', () => {
        // Ensure extension_settings exists
        if (typeof extension_settings === 'undefined') {
            console.warn('[STnametracker] extension_settings not available for saving');
            return;
        }

        // Initialize if not exists
        if (!extension_settings[MODULE_NAME]) {
            extension_settings[MODULE_NAME] = { ...DEFAULT_SETTINGS };
        }

        // Update settings
        Object.assign(extension_settings[MODULE_NAME], newSettings);

        // Save to SillyTavern
        if (typeof saveSettingsDebounced !== 'undefined') {
            saveSettingsDebounced();
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
function setCharacters(characters) {
    return errorHandler.withErrorBoundary('Settings', () => {
        try {
            const metadata = stContext.getChatMetadata();

            // Initialize if not exists
            if (!metadata[MODULE_NAME]) {
                metadata[MODULE_NAME] = { ...DEFAULT_CHAT_DATA };
            }

            // Update characters
            metadata[MODULE_NAME].characters = characters;

            // Save to SillyTavern
            stContext.saveChatMetadata().catch(err => {
                debug.warn('Failed to save chat metadata:', err.message);
            });
        } catch (error) {
            debug.warn('Failed to set characters:', error.message);
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
function setChatData(data) {
    return errorHandler.withErrorBoundary('Settings', () => {
        try {
            const metadata = stContext.getChatMetadata();

            // Initialize if not exists
            if (!metadata[MODULE_NAME]) {
                metadata[MODULE_NAME] = { ...DEFAULT_CHAT_DATA };
            }

            // Update data
            Object.assign(metadata[MODULE_NAME], data);

            // Save to SillyTavern
            stContext.saveChatMetadata().catch(err => {
                debug.warn('Failed to save chat metadata:', err.message);
            });
        } catch (error) {
            debug.warn('Failed to set chat data:', error.message);
        }
    });
}

/**
 * Add a character to the current chat
 * @param {string} name - Character name
 * @param {Object} characterData - Character data
 */
function addCharacter(name, characterData) {
    return errorHandler.withErrorBoundary('Settings', () => {
        const characters = getCharacters();
        characters[name] = characterData;
        setCharacters(characters);
    });
}

/**
 * Remove a character from the current chat
 * @param {string} name - Character name to remove
 */
function removeCharacter(name) {
    return errorHandler.withErrorBoundary('Settings', () => {
        const characters = getCharacters();
        delete characters[name];
        setCharacters(characters);
    });
}

/**
 * Get a specific setting value
 * @param {string} key - Setting key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Setting value
 */
function getSetting(key, defaultValue) {
    const settings = get_settings();
    return settings[key] !== undefined ? settings[key] : defaultValue;
}

/**
 * Set a specific setting value
 * @param {string} key - Setting key
 * @param {*} value - Setting value
 */
function setSetting(key, value) {
    const update = {};
    update[key] = value;
    set_settings(update);
}

/**
 * Get a single character by name
 * @param {string} name - Character name
 * @returns {Object|null} Character data or null if not found
 */
function getCharacter(name) {
    return errorHandler.withErrorBoundary('Settings', () => {
        if (!name || typeof name !== 'string') {
            console.warn('[STnametracker] Invalid character name:', name);
            return null;
        }
        const chars = getCharacters();
        return chars[name] || null;
    }, null);
}

/**
 * Set a character by name
 * @param {string} name - Character name
 * @param {Object} character - Character data
 */
function setCharacter(name, character) {
    return errorHandler.withErrorBoundary('Settings', () => {
        if (!name || typeof name !== 'string') {
            throw new Error('Character name must be a non-empty string');
        }
        if (!character || typeof character !== 'object') {
            throw new Error('Character data must be an object');
        }
        const chars = { ...getCharacters() };
        chars[name] = character;
        setCharacters(chars);
        debug.log(`Set character: ${name}`);
    });
}

/**
 * Get LLM configuration
 * @returns {Object} LLM configuration object
 */
function getLLMConfig() {
    return errorHandler.withErrorBoundary('Settings', () => {
        const llmSource = getSetting('llmSource');
        console.log('[NT-LLMConfig] llmSource setting:', llmSource);
        console.log('[NT-LLMConfig] All extension_settings keys:', Object.keys(extension_settings.sillytavern_nametracker || {}));
        return {
            source: llmSource,
            ollamaEndpoint: getSetting('ollamaEndpoint'),
            ollamaModel: getSetting('ollamaModel'),
            systemPrompt: getSetting('systemPrompt'),
        };
    }, { source: 'sillytavern', ollamaEndpoint: 'http://localhost:11434', ollamaModel: '', systemPrompt: null });
}

/**
 * Get lorebook configuration
 * @returns {Object} Lorebook configuration object
 */
function getLorebookConfig() {
    return errorHandler.withErrorBoundary('Settings', () => {
        return {
            position: getSetting('lorebookPosition'),
            depth: getSetting('lorebookDepth'),
            cooldown: getSetting('lorebookCooldown'),
            scanDepth: getSetting('lorebookScanDepth'),
            probability: getSetting('lorebookProbability'),
            enabled: getSetting('lorebookEnabled'),
        };
    }, { position: 0, depth: 1, cooldown: 5, scanDepth: 1, probability: 100, enabled: true });
}

/**
 * Alias for get_settings for compatibility
 * @returns {Object} Current settings
 */
function getSettings() {
    return get_settings();
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

            stContext.saveChatMetadata().catch(err => {
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
