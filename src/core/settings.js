/**
 * Simplified settings management for Name Tracker extension
 * Uses SillyTavern standard patterns with preserved error handling
 */

import { errorHandler } from './errors.js';

const MODULE_NAME = 'STnametracker';

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
    analysisCache: new Map()
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
        lastProcessedTime: null
    }
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
        // Ensure chat_metadata exists
        if (typeof chat_metadata === 'undefined') {
            console.warn('[STnametracker] chat_metadata not available');
            return {};
        }

        // Initialize if not exists
        if (!chat_metadata[MODULE_NAME]) {
            chat_metadata[MODULE_NAME] = { ...DEFAULT_CHAT_DATA };
        }

        return chat_metadata[MODULE_NAME].characters || {};
    }, {});
}

/**
 * Update chat characters and save
 * @param {Object} characters - Characters data to save
 */
function setCharacters(characters) {
    return errorHandler.withErrorBoundary('Settings', () => {
        // Ensure chat_metadata exists
        if (typeof chat_metadata === 'undefined') {
            console.warn('[STnametracker] chat_metadata not available for saving');
            return;
        }

        // Initialize if not exists
        if (!chat_metadata[MODULE_NAME]) {
            chat_metadata[MODULE_NAME] = { ...DEFAULT_CHAT_DATA };
        }

        // Update characters
        chat_metadata[MODULE_NAME].characters = characters;
        
        // Save to SillyTavern
        if (typeof saveMetadataDebounced !== 'undefined') {
            saveMetadataDebounced();
        }
    });
}

/**
 * Get chat-level data
 * @returns {Object} Chat metadata
 */
function getChatData() {
    return errorHandler.withErrorBoundary('Settings', () => {
        // Ensure chat_metadata exists
        if (typeof chat_metadata === 'undefined') {
            console.warn('[STnametracker] chat_metadata not available');
            return { ...DEFAULT_CHAT_DATA };
        }

        // Initialize if not exists
        if (!chat_metadata[MODULE_NAME]) {
            chat_metadata[MODULE_NAME] = { ...DEFAULT_CHAT_DATA };
        }

        return chat_metadata[MODULE_NAME];
    }, { ...DEFAULT_CHAT_DATA });
}

/**
 * Update chat-level data
 * @param {Object} data - Data to update
 */
function setChatData(data) {
    return errorHandler.withErrorBoundary('Settings', () => {
        // Ensure chat_metadata exists
        if (typeof chat_metadata === 'undefined') {
            console.warn('[STnametracker] chat_metadata not available for saving');
            return;
        }

        // Initialize if not exists
        if (!chat_metadata[MODULE_NAME]) {
            chat_metadata[MODULE_NAME] = { ...DEFAULT_CHAT_DATA };
        }

        // Update data
        Object.assign(chat_metadata[MODULE_NAME], data);
        
        // Save to SillyTavern
        if (typeof saveMetadataDebounced !== 'undefined') {
            saveMetadataDebounced();
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
    setSetting
};