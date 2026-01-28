/**
 * SillyTavern context abstraction layer for Name Tracker extension
 * Provides a thin wrapper around SillyTavern.getContext() with error handling
 */

import debugLogger from './debug.js';
import { errorHandler } from './errors.js';

const logger = debugLogger.createModuleLogger('Context');

class SillyTavernContext {
    constructor() {
        this._context = null;
        this._lastUpdate = 0;
        this._updateInterval = 1000; // Cache context for 1 second
    }

    /**
     * Get fresh SillyTavern context
     * @returns {Object} SillyTavern context object
     */
    getContext() {
        const now = Date.now();
        if (!this._context || (now - this._lastUpdate) > this._updateInterval) {
            try {
                this._context = SillyTavern.getContext();
                this._lastUpdate = now;
            } catch (error) {
                logger.error('Failed to get SillyTavern context:', error);
                throw new Error('SillyTavern context not available');
            }
        }
        return this._context;
    }

    /**
     * Get current chat
     * @returns {Array} Current chat messages
     */
    getChat() {
        return this.getContext().chat || [];
    }

    /**
     * Get current chat metadata
     * @returns {Object} Chat metadata object
     */
    getChatMetadata() {
        return this.getContext().chatMetadata || {};
    }

    /**
     * Get current chat ID
     * @returns {string|null} Chat identifier
     */
    getChatId() {
        return this.getContext().chatId || null;
    }

    /**
     * Get current character ID
     * @returns {number|null} Character index
     */
    getCharacterId() {
        return this.getContext().characterId;
    }

    /**
     * Get characters list
     * @returns {Array} Available characters
     */
    getCharacters() {
        return this.getContext().characters || [];
    }

    /**
     * Get user name (name1)
     * @returns {string} User's persona name
     */
    getUserName() {
        return this.getContext().name1 || 'User';
    }

    /**
     * Get extension settings object
     * @returns {Object} Extension settings
     */
    getExtensionSettings() {
        return this.getContext().extensionSettings || {};
    }

    /**
     * Save extension settings
     * @returns {Promise<void>}
     */
    async saveExtensionSettings() {
        return errorHandler.withErrorBoundary('Context', async () => {
            const context = this.getContext();
            if (context.saveSettingsDebounced) {
                context.saveSettingsDebounced();
            } else {
                logger.warn('saveSettingsDebounced not available');
            }
        }, { silent: true });
    }

    /**
     * Save chat metadata
     * @returns {Promise<void>}
     */
    async saveMetadata() {
        return errorHandler.withErrorBoundary('Context', async () => {
            const context = this.getContext();
            if (context.saveMetadata) {
                await context.saveMetadata();
            } else {
                logger.warn('saveMetadata not available');
            }
        }, { silent: true });
    }

    /**
     * Generate quiet prompt (background LLM call)
     * @param {Object} options - Generation options
     * @returns {Promise<string>} Generated text
     */
    async generateQuietPrompt(options) {
        return errorHandler.withErrorBoundary('Context', async () => {
            const context = this.getContext();
            if (!context.generateQuietPrompt) {
                throw new Error('generateQuietPrompt not available');
            }
            return await context.generateQuietPrompt(options);
        }, { retries: 1 });
    }

    /**
     * Load world info (lorebook)
     * Direct passthrough to SillyTavern API - no error boundary wrapping
     * to prevent Promise contamination in structuredClone operations
     * @param {string} lorebookName - Name of lorebook
     * @returns {Promise<Object|null>} Lorebook data
     */
    async loadWorldInfo(lorebookName) {
        try {
            const context = this.getContext();
            if (!context.loadWorldInfo) {
                throw new Error('loadWorldInfo not available');
            }
            return await context.loadWorldInfo(lorebookName);
        } catch (error) {
            console.error('[NT-Context] loadWorldInfo error:', error);
            throw error;
        }
    }

    /**
     * Save world info (lorebook)
     * Direct passthrough to SillyTavern API - no error boundary wrapping
     * to prevent Promise contamination in structuredClone operations
     * @param {string} lorebookName - Name of lorebook
     * @param {Object} data - Lorebook data
     * @param {boolean} create - Create if doesn't exist
     * @returns {Promise<void>}
     */
    async saveWorldInfo(lorebookName, data, create = false) {
        try {
            const context = this.getContext();
            if (!context.saveWorldInfo) {
                throw new Error('saveWorldInfo not available');
            }
            return await context.saveWorldInfo(lorebookName, data, create);
        } catch (error) {
            console.error('[NT-Context] saveWorldInfo error:', error);
            throw error;
        }
    }

    /**
     * Save world info entry
     * @param {string} lorebookName - Lorebook name
     * @param {Object} entryData - Entry data
     * @returns {Promise<void>}
     */
    async saveWorldInfoEntry(lorebookName, entryData) {
        return errorHandler.withErrorBoundary('Context', async () => {
            const context = this.getContext();
            if (!context.saveWorldInfoEntry) {
                throw new Error('saveWorldInfoEntry not available');
            }
            return await context.saveWorldInfoEntry(lorebookName, entryData);
        });
    }

    /**
     * Set the chat's selected world info book (makes it active for the chat)
     * @param {string} lorebookName - Name of lorebook to select
     * @returns {Promise<void>}
     */
    async setSelectedWorldInfo(lorebookName) {
        return errorHandler.withErrorBoundary('Context', async () => {
            const context = this.getContext();

            // First method: Use saveSelectedWorldInfo if available
            if (context.saveSelectedWorldInfo && typeof context.saveSelectedWorldInfo === 'function') {
                await context.saveSelectedWorldInfo(lorebookName);
                return;
            }

            // Second method: Set the world_info directly in chat metadata
            if (!context.chatMetadata) {
                throw new Error('Chat metadata not available');
            }

            context.chatMetadata.world_info = lorebookName;

            // Save the metadata
            if (context.saveMetadata && typeof context.saveMetadata === 'function') {
                await context.saveMetadata();
            }

            logger.debug(`Selected world info: ${lorebookName}`);
        }, { silent: true });
    }

    /**
     * Get event source for listening to SillyTavern events
     * @returns {Object} Event source object
     */
    getEventSource() {
        const context = this.getContext();
        return context.eventSource;
    }

    /**
     * Get event types constants
     * @returns {Object} Event types
     */
    getEventTypes() {
        const context = this.getContext();
        return context.event_types;
    }

    /**
     * Call generic popup
     * @param {string} content - HTML content
     * @param {number} type - Popup type
     * @param {string} input - Input placeholder
     * @param {Object} options - Additional options
     * @returns {Promise<any>} Popup result
     */
    async callGenericPopup(content, type, input = '', options = {}) {
        return errorHandler.withErrorBoundary('Context', async () => {
            const context = this.getContext();
            if (!context.callGenericPopup) {
                throw new Error('callGenericPopup not available');
            }
            return await context.callGenericPopup(content, type, input, options);
        });
    }

    /**
     * Check if SillyTavern context is available
     * @returns {boolean} Context availability
     */
    isContextAvailable() {
        try {
            return !!this.getContext();
        } catch {
            return false;
        }
    }

    /**
     * Clear cached context (force refresh on next access)
     */
    clearCache() {
        this._context = null;
        this._lastUpdate = 0;
        logger.debug('Cleared context cache');
    }

    /**
     * Get context status information for debugging
     * @returns {Object} Context status
     */
    getStatus() {
        return {
            available: this.isContextAvailable(),
            cached: !!this._context,
            lastUpdate: this._lastUpdate,
            chatId: this.getChatId(),
            characterId: this.getCharacterId(),
        };
    }

    /**
     * Dump entire context object to console for debugging
     * Shows all properties and their values in a readable format
     */
    dumpContextToConsole() {
        try {
            const context = this.getContext();

            // Create a formatted dump
            const dump = {
                timestamp: new Date().toISOString(),
                availableProperties: Object.keys(context),
                fullContext: context,
                detailedBreakdown: {},
            };

            // Add detailed breakdown of key properties
            const keyProps = [
                'maxContext', 'maxTokens', 'amount_gen', 'token_limit',
                'extensionSettings', 'settings', 'chat', 'chatMetadata',
                'characters', 'world_info', 'botId', 'characterId', 'chatId',
                'impersonate', 'groups',
            ];

            for (const prop of keyProps) {
                if (prop in context) {
                    dump.detailedBreakdown[prop] = {
                        type: typeof context[prop],
                        value: context[prop],
                        isNull: context[prop] === null,
                        isUndefined: context[prop] === undefined,
                    };
                }
            }

            // Log to console with formatting
            console.group('%c[Name Tracker] COMPLETE CONTEXT DUMP', 'color: #00ff00; font-weight: bold; font-size: 14px;');
            console.log('%cTimestamp:', 'color: #ffaa00; font-weight: bold;', dump.timestamp);
            console.log('%cTotal Properties:', 'color: #ffaa00; font-weight: bold;', dump.availableProperties.length);
            console.log('%cAll Property Names:', 'color: #00aaff; font-weight: bold;', dump.availableProperties.join(', '));
            console.log('%cDetailed Property Breakdown:', 'color: #ff00ff; font-weight: bold;', dump.detailedBreakdown);
            console.log('%cFull Context Object:', 'color: #00ff00; font-weight: bold;', context);
            console.log('%cJSON Dump (for copying):', 'color: #ffff00; font-weight: bold;', JSON.stringify(dump, null, 2));
            console.groupEnd();

            return dump;
        } catch (error) {
            console.error('[Name Tracker] ERROR dumping context:', error);
            throw error;
        }
    }
}

// Create singleton instance
const sillyTavernContext = new SillyTavernContext();

export { sillyTavernContext as stContext };
export default sillyTavernContext;
