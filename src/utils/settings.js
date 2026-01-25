/**
 * Simplified settings management for Name Tracker extension
 * Follows SillyTavern standard patterns with preserved error handling
 */

import debugLogger from '../core/debug.js';
import { errorHandler } from '../core/errors.js';
import notifications from './notifications.js';

// SillyTavern globals - these are provided by SillyTavern's global scope
// In browser environment, these are available as window properties
const { extension_settings, saveSettingsDebounced, saveMetadataDebounced } = window;

const debug = debugLogger.createModuleLogger('Settings');

const MODULE_NAME = 'STnametracker';

// Default settings structure
export const DEFAULT_SETTINGS = Object.freeze({
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
});

// Default chat-level data structure
export const DEFAULT_CHAT_DATA = Object.freeze({
    characters: {}, // character data indexed by preferred name
    messageCounter: 0,
    lastHarvestMessage: 0,
    lastScannedMessageId: -1, // Track last scanned message by ID
});

// Settings state
let _initialized = false;

/**
 * Get SillyTavern context with error handling
 * @returns {Object} SillyTavern context
 */
function getContext() {
    const ctx = SillyTavern?.getContext?.();
    if (!ctx) {
        throw new Error('SillyTavern context not available');
    }
    return ctx;
}

/**
 * Initialize settings system
 * @returns {Promise<void>}
 */
export async function initializeSettings() {
    return errorHandler.withErrorBoundary('Settings', async () => {
        if (_initialized) {
            debug.log('Settings already initialized');
            return;
        }

        debug.log('Initializing settings manager');

        // Initialize global settings
        if (!extension_settings[MODULE_NAME]) {
            extension_settings[MODULE_NAME] = { ...DEFAULT_SETTINGS };
        } else {
            // Merge with defaults to ensure all properties exist
            const current = extension_settings[MODULE_NAME];
            extension_settings[MODULE_NAME] = { ...DEFAULT_SETTINGS, ...current };
        }

        // Initialize chat-level data if needed
        const ctx = getContext();
        const chatMetadata = ctx.chatMetadata;
        if (!chatMetadata[MODULE_NAME]) {
            chatMetadata[MODULE_NAME] = { ...DEFAULT_CHAT_DATA };
        } else {
            // Merge with defaults to ensure all properties exist
            const current = chatMetadata[MODULE_NAME];
            chatMetadata[MODULE_NAME] = { ...DEFAULT_CHAT_DATA, ...current };
        }

        _initialized = true;
        debug.log('Settings initialized');
    });
}

/**
 * Check if settings are initialized
 * @throws {Error} If not initialized
 */
function checkInitialized() {
    if (!_initialized) {
        throw new Error('Settings manager not initialized');
    }
}

/**
 * Get entire settings object
 * @returns {Object} Current settings
 */
export function getSettings() {
    checkInitialized();
    return extension_settings[MODULE_NAME] || {};
}

/**
 * Get a specific setting value
 * @param {string} key - Setting key
 * @returns {any} Setting value or default
 */
export function get_settings(key) {
    return errorHandler.withErrorBoundary('Settings', () => {
        if (!(key in DEFAULT_SETTINGS)) {
            throw new Error(`Unknown setting key: ${key}`);
        }
        return extension_settings[MODULE_NAME]?.[key] ?? DEFAULT_SETTINGS[key];
    });
}

/**
 * Set a setting value
 * @param {string} key - Setting key
 * @param {any} value - New value
 */
export function set_settings(key, value) {
    return errorHandler.withErrorBoundary('Settings', () => {
        if (!(key in DEFAULT_SETTINGS)) {
            throw new Error(`Unknown setting key: ${key}`);
        }

        if (!extension_settings[MODULE_NAME]) {
            extension_settings[MODULE_NAME] = { ...DEFAULT_SETTINGS };
        }

        const oldValue = extension_settings[MODULE_NAME][key];
        extension_settings[MODULE_NAME][key] = value;

        debug.log(`Updated setting ${key}: ${oldValue} → ${value}`);

        // Save with built-in SillyTavern debouncing
        saveSettingsDebounced();
    });
}

/**
 * Get chat metadata
 * @param {string} key - Metadata key
 * @returns {any} Metadata value
 */
export function get_chat_metadata(key) {
    return errorHandler.withErrorBoundary('Settings', () => {
        checkInitialized();
        const ctx = getContext();
        return ctx.chatMetadata[MODULE_NAME]?.[key];
    });
}

/**
 * Set chat metadata
 * @param {string} key - Metadata key
 * @param {any} value - New value
 */
export function set_chat_metadata(key, value) {
    return errorHandler.withErrorBoundary('Settings', () => {
        if (!(key in DEFAULT_CHAT_DATA)) {
            throw new Error(`Unknown chat data key: ${key}`);
        }

        const ctx = getContext();
        if (!ctx.chatMetadata[MODULE_NAME]) {
            ctx.chatMetadata[MODULE_NAME] = { ...DEFAULT_CHAT_DATA };
        }

        const oldValue = ctx.chatMetadata[MODULE_NAME][key];
        ctx.chatMetadata[MODULE_NAME][key] = value;

        debug.log(`Updated chat data ${key}`);

        // Save with built-in SillyTavern debouncing
        saveMetadataDebounced();
    });
}

/**
 * Get all characters from chat metadata
 * @returns {Object} Characters data
 */
export function getCharacters() {
    return get_chat_metadata('characters') || {};
}

/**
 * Get a specific character
 * @param {string} name - Character name
 * @returns {Object|null} Character data or null
 */
export function getCharacter(name) {
    return errorHandler.withErrorBoundary('Settings', () => {
        if (!name || typeof name !== 'string') {
            debug.warn('Invalid character name:', name);
            return null;
        }
        const chars = getCharacters();
        return chars[name] || null;
    });
}

/**
 * Set a character's data
 * @param {string} name - Character name (sanitized)
 * @param {Object} data - Character data
 */
export function setCharacter(name, data) {
    return errorHandler.withErrorBoundary('Settings', () => {
        if (!name || typeof name !== 'string') {
            throw new Error('Character name must be a non-empty string');
        }
        if (!data || typeof data !== 'object') {
            throw new Error('Character data must be an object');
        }

        const chars = { ...getCharacters() };
        chars[name] = data;
        set_chat_metadata('characters', chars);
        
        debug.log(`Set character: ${name}`);
    });
}

/**
 * Remove a character
 * @param {string} name - Character name
 */
export function removeCharacter(name) {
    return errorHandler.withErrorBoundary('Settings', () => {
        if (!name || typeof name !== 'string') {
            debug.warn('Invalid character name for removal:', name);
            return;
        }

        const chars = { ...getCharacters() };
        if (chars[name]) {
            delete chars[name];
            set_chat_metadata('characters', chars);
            debug.log(`Removed character: ${name}`);
        }
    });
}

/**
 * Update a setting with UI binding support
 * @param {string} key - Setting key
 * @param {any} value - New value
 * @returns {Promise<void>}
 */
export async function updateSetting(key, value) {
    return errorHandler.withErrorBoundary('Settings', async () => {
        set_settings(key, value);
        // Trigger any UI updates that depend on this setting
        if (key === 'debugMode') {
            debugLogger.setDebugMode(value);
        }
    });
}

/**
 * Handler for when chat changes - reinitialize chat-level data
 * @returns {Promise<void>}
 */
export async function onChatChanged() {
    return errorHandler.withErrorBoundary('Settings', async () => {
        debug.log('Chat changed, reinitializing chat data');
        
        const ctx = getContext();
        const chatMetadata = ctx.chatMetadata;
        
        // Initialize chat-level data for new chat
        if (!chatMetadata[MODULE_NAME]) {
            chatMetadata[MODULE_NAME] = { ...DEFAULT_CHAT_DATA };
            debug.log('Initialized new chat data');
        } else {
            // Ensure all default properties exist
            const current = chatMetadata[MODULE_NAME];
            chatMetadata[MODULE_NAME] = { ...DEFAULT_CHAT_DATA, ...current };
            debug.log('Loaded existing chat data');
        }
    });
}

/**
 * Legacy compatibility wrappers for existing code
 */

// Helper function to get LLM configuration object  
export function getLLMConfig() {
    return {
        source: get_settings('llmSource'),
        ollamaEndpoint: get_settings('ollamaEndpoint'),
        ollamaModel: get_settings('ollamaModel'),
        systemPrompt: get_settings('systemPrompt'),
    };
}

// Helper function to get lorebook configuration object
export function getLorebookConfig() {
    return {
        position: get_settings('lorebookPosition'),
        depth: get_settings('lorebookDepth'),
        cooldown: get_settings('lorebookCooldown'),
        scanDepth: get_settings('lorebookScanDepth'),
        probability: get_settings('lorebookProbability'),
        enabled: get_settings('lorebookEnabled'),
    };
}

// Wrapper to maintain getSetting interface
export function getSetting(key, defaultValue) {
    try {
        const value = get_settings(key);
        return value !== undefined ? value : defaultValue;
    } catch (error) {
        debug.warn(`getSetting error for key ${key}:`, error);
        return defaultValue;
    }
}

// Wrapper to maintain setSetting interface  
export function setSetting(key, value) {
    try {
        set_settings(key, value);
    } catch (error) {
        debug.error(`setSetting error for key ${key}:`, error);
        notifications.error(`Failed to update setting: ${error.message}`);
    }
}