/**
 * Centralized settings management for Name Tracker extension
 * Handles both global extension settings and chat-level data persistence
 */

import debugLogger from './debug.js';
import { errorHandler } from './errors.js';
import sillyTavernContext from './context.js';

const logger = debugLogger.createModuleLogger('Settings');

const EXTENSION_NAME = 'STnametracker';

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
});

// Default chat-level data structure
const DEFAULT_CHAT_DATA = Object.freeze({
    characters: {}, // character data indexed by preferred name
    messageCounter: 0,
    lastHarvestMessage: 0,
    lastScannedMessageId: -1, // Track last scanned message by ID
});

class SettingsManager {
    constructor() {
        this._settings = null;
        this._chatData = null;
        this._settingsCallbacks = [];
        this._chatCallbacks = [];
        this._saveTimeout = null;
        this._initialized = false;
    }

    /**
     * Initialize settings system
     * @returns {Promise<void>}
     */
    async initialize() {
        return errorHandler.withErrorBoundary('Settings', async () => {
            if (this._initialized) {
                return;
            }

            logger.debug('Initializing settings manager');

            // Load global settings
            await this.loadSettings();

            // Load chat-level data
            await this.loadChatData();

            this._initialized = true;
            logger.debug('Settings manager initialized');
        });
    }

    /**
     * Load global extension settings
     * @returns {Promise<void>}
     */
    async loadSettings() {
        return errorHandler.withErrorBoundary('Settings', async () => {
            const extensionSettings = sillyTavernContext.getExtensionSettings();

            // Initialize with defaults if not exists
            if (!extensionSettings[EXTENSION_NAME]) {
                extensionSettings[EXTENSION_NAME] = {};
            }

            // Merge with defaults to ensure all properties exist
            this._settings = { ...DEFAULT_SETTINGS };
            Object.assign(this._settings, extensionSettings[EXTENSION_NAME]);

            // Update the reference in SillyTavern
            extensionSettings[EXTENSION_NAME] = this._settings;

            logger.debug('Loaded global settings:', Object.keys(this._settings));

            // Trigger callbacks
            this._settingsCallbacks.forEach(callback => {
                try {
                    callback(this._settings);
                } catch (error) {
                    logger.error('Settings callback error:', error);
                }
            });
        });
    }

    /**
     * Load chat-level data from metadata
     * @returns {Promise<void>}
     */
    async loadChatData() {
        return errorHandler.withErrorBoundary('Settings', async () => {
            const chatMetadata = sillyTavernContext.getChatMetadata();

            // Initialize chat data if not exists
            if (!chatMetadata[EXTENSION_NAME]) {
                this._chatData = { ...DEFAULT_CHAT_DATA };
                chatMetadata[EXTENSION_NAME] = this._chatData;
                logger.debug('Initialized new chat data');
            } else {
                // Merge with defaults to ensure all properties exist
                this._chatData = { ...DEFAULT_CHAT_DATA };
                Object.assign(this._chatData, chatMetadata[EXTENSION_NAME]);
                chatMetadata[EXTENSION_NAME] = this._chatData;
                logger.debug('Loaded existing chat data:', Object.keys(this._chatData.characters));
            }

            // Trigger callbacks
            this._chatCallbacks.forEach(callback => {
                try {
                    callback(this._chatData);
                } catch (error) {
                    logger.error('Chat data callback error:', error);
                }
            });
        });
    }

    /**
     * Get current settings object
     * @returns {Object} Current settings
     */
    getSettings() {
        if (!this._initialized) {
            throw new Error('Settings manager not initialized');
        }
        return this._settings;
    }

    /**
     * Get current chat data
     * @returns {Object} Current chat data
     */
    getChatData() {
        if (!this._initialized) {
            throw new Error('Settings manager not initialized');
        }
        return this._chatData;
    }

    /**
     * Update a setting value
     * @param {string} key - Setting key
     * @param {any} value - New value
     * @returns {Promise<void>}
     */
    async updateSetting(key, value) {
        return errorHandler.withErrorBoundary('Settings', async () => {
            if (!this._initialized) {
                throw new Error('Settings manager not initialized');
            }

            if (!(key in DEFAULT_SETTINGS)) {
                throw new Error(`Unknown setting key: ${key}`);
            }

            const oldValue = this._settings[key];
            this._settings[key] = value;

            logger.debug(`Updated setting ${key}: ${oldValue} → ${value}`);

            // Trigger callbacks
            this._settingsCallbacks.forEach(callback => {
                try {
                    callback(this._settings, key, value, oldValue);
                } catch (error) {
                    logger.error('Settings callback error:', error);
                }
            });

            // Save with debounce
            await this.saveSettings();
        });
    }

    /**
     * Update chat data
     * @param {string} key - Data key
     * @param {any} value - New value
     * @returns {Promise<void>}
     */
    async updateChatData(key, value) {
        return errorHandler.withErrorBoundary('Settings', async () => {
            if (!this._initialized) {
                throw new Error('Settings manager not initialized');
            }

            if (!(key in DEFAULT_CHAT_DATA)) {
                throw new Error(`Unknown chat data key: ${key}`);
            }

            const oldValue = this._chatData[key];
            this._chatData[key] = value;

            logger.debug(`Updated chat data ${key}`);

            // Trigger callbacks
            this._chatCallbacks.forEach(callback => {
                try {
                    callback(this._chatData, key, value, oldValue);
                } catch (error) {
                    logger.error('Chat data callback error:', error);
                }
            });

            // Save with debounce
            await this.saveChatData();
        });
    }

    /**
     * Get specific setting value
     * @param {string} key - Setting key
     * @param {any} defaultValue - Default if not found
     * @returns {any} Setting value
     */
    getSetting(key, defaultValue = undefined) {
        if (!this._initialized) {
            return defaultValue;
        }
        return this._settings[key] ?? defaultValue;
    }

    /**
     * Save global settings to SillyTavern
     * @returns {Promise<void>}
     */
    async saveSettings() {
        if (this._saveTimeout) {
            clearTimeout(this._saveTimeout);
        }

        this._saveTimeout = setTimeout(async () => {
            await errorHandler.withErrorBoundary('Settings', async () => {
                await sillyTavernContext.saveExtensionSettings();
                logger.debug('Saved global settings');
            }, { silent: true });
        }, 500); // Debounce 500ms
    }

    /**
     * Save chat data to metadata
     * @returns {Promise<void>}
     */
    async saveChatData() {
        return errorHandler.withErrorBoundary('Settings', async () => {
            await sillyTavernContext.saveChatMetadata();
            logger.debug('Saved chat metadata');
        }, { silent: true });
    }

    /**
     * Register callback for settings changes
     * @param {Function} callback - Callback function
     */
    onSettingsChange(callback) {
        this._settingsCallbacks.push(callback);
    }

    /**
     * Register callback for chat data changes
     * @param {Function} callback - Callback function
     */
    onChatDataChange(callback) {
        this._chatCallbacks.push(callback);
    }

    /**
     * Handle chat change event
     * @returns {Promise<void>}
     */
    async onChatChanged() {
        return errorHandler.withErrorBoundary('Settings', async () => {
            logger.debug('Chat changed, reloading chat data');
            await this.loadChatData();
        });
    }

    /**
     * Check if extension is enabled
     * @returns {boolean} Enabled status
     */
    isEnabled() {
        return this.getSetting('enabled', false);
    }

    /**
     * Check if debug mode is enabled
     * @returns {boolean} Debug mode status
     */
    isDebugMode() {
        return this.getSetting('debugMode', false);
    }

    /**
     * Get auto-analysis settings
     * @returns {Object} Auto-analysis configuration
     */
    getAutoAnalysisConfig() {
        return {
            enabled: this.getSetting('autoAnalyze', false),
            frequency: this.getSetting('messageFrequency', 10),
            lastScanned: this._chatData?.lastScannedMessageId ?? -1,
        };
    }

    /**
     * Get LLM configuration
     * @returns {Object} LLM settings
     */
    getLLMConfig() {
        return {
            source: this.getSetting('llmSource', 'sillytavern'),
            ollamaEndpoint: this.getSetting('ollamaEndpoint', 'http://localhost:11434'),
            ollamaModel: this.getSetting('ollamaModel', ''),
            systemPrompt: this.getSetting('systemPrompt'),
        };
    }

    /**
     * Get lorebook configuration
     * @returns {Object} Lorebook settings
     */
    getLorebookConfig() {
        return {
            position: this.getSetting('lorebookPosition', 0),
            depth: this.getSetting('lorebookDepth', 1),
            cooldown: this.getSetting('lorebookCooldown', 5),
            scanDepth: this.getSetting('lorebookScanDepth', 1),
            probability: this.getSetting('lorebookProbability', 100),
            enabled: this.getSetting('lorebookEnabled', true),
        };
    }

    /**
     * Reset to default settings
     * @returns {Promise<void>}
     */
    async reset() {
        return errorHandler.withErrorBoundary('Settings', async () => {
            logger.warn('Resetting settings to defaults');

            Object.assign(this._settings, DEFAULT_SETTINGS);
            Object.assign(this._chatData, DEFAULT_CHAT_DATA);

            await this.saveSettings();
            await this.saveChatData();

            // Trigger callbacks
            this._settingsCallbacks.forEach(callback => {
                try {
                    callback(this._settings);
                } catch (error) {
                    logger.error('Settings callback error:', error);
                }
            });

            this._chatCallbacks.forEach(callback => {
                try {
                    callback(this._chatData);
                } catch (error) {
                    logger.error('Chat data callback error:', error);
                }
            });
        });
    }

    /**
     * Get settings status for debugging
     * @returns {Object} Settings status
     */
    getStatus() {
        return {
            initialized: this._initialized,
            settingsLoaded: !!this._settings,
            chatDataLoaded: !!this._chatData,
            charactersCount: Object.keys(this._chatData?.characters || {}).length,
            callbacks: {
                settings: this._settingsCallbacks.length,
                chatData: this._chatCallbacks.length,
            },
        };
    }
}

// Create singleton instance
const settingsManager = new SettingsManager();

export default settingsManager;
