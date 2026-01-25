/**
 * Name Tracker Extension for SillyTavern - Modular Version
 * Main entry point and orchestration
 */

// Import CSS
import '../style.css';

// Core infrastructure
import debugLogger from './core/debug.js';
import { errorHandler } from './core/errors.js';
import sillyTavernContext from './core/context.js';
import settingsManager from './core/settings.js';

// Utilities
import notifications from './utils/notifications.js';
import { /* escapeHtml, generateUID */ } from './utils/helpers.js';

const logger = debugLogger.createModuleLogger('Main');

/**
 * Name Tracker Extension main class
 */
class NameTrackerExtension {
    constructor() {
        this.initialized = false;
        this.modules = new Map();
    }

    /**
     * Initialize the extension
     * @returns {Promise<void>}
     */
    async initialize() {
        return errorHandler.withErrorBoundary('Main', async () => {
            if (this.initialized) {
                return;
            }

            logger.log('Starting Name Tracker Extension v2.1.0');

            // Initialize core systems
            await this.initializeCore();

            // TODO: Initialize feature modules
            // await this.initializeModules();

            // TODO: Setup UI
            // await this.initializeUI();

            // TODO: Register event listeners
            // this.registerEventListeners();

            this.initialized = true;
            logger.log('Name Tracker Extension initialized successfully');

        }, {
            retries: 2,
            fallback: async (error) => {
                logger.error('Failed to initialize extension:', error);
                notifications.error('Failed to initialize', 'Extension Error');
                return false;
            },
        });
    }

    /**
     * Initialize core infrastructure
     * @returns {Promise<void>}
     */
    async initializeCore() {
        logger.debug('Initializing core systems...');

        // Connect debug system to settings
        debugLogger.isDebugEnabled = () => settingsManager.isDebugMode();

        // Initialize settings manager
        await settingsManager.initialize();

        // Setup error recovery strategies
        this.setupErrorRecovery();

        logger.debug('Core systems initialized');
    }

    /**
     * Setup error recovery strategies
     */
    setupErrorRecovery() {
        // Network error recovery
        errorHandler.registerRecoveryStrategy('NETWORK_ERROR', async (error) => {
            logger.warn('Attempting network error recovery');
            await errorHandler.delay(2000);
            notifications.info('Retrying network operation...');
            return null; // Signal to retry original operation
        });

        // Data format error recovery
        errorHandler.registerRecoveryStrategy('DATA_FORMAT_ERROR', async (error) => {
            logger.warn('Data format error, clearing cache');
            // TODO: Clear relevant caches when modules are implemented
            return null;
        });

        // Critical error handler
        errorHandler.onCriticalError((error) => {
            logger.error('Critical error occurred:', error);
            // TODO: Save state for debugging when modules are implemented
        });
    }

    /**
     * Get extension status for debugging
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            initialized: this.initialized,
            context: sillyTavernContext.getStatus(),
            settings: settingsManager.getStatus(),
            debug: debugLogger.getPerformanceSummary(),
            errors: errorHandler.getRecentErrors(5).length,
        };
    }

    /**
     * Shutdown the extension
     * @returns {Promise<void>}
     */
    async shutdown() {
        return errorHandler.withErrorBoundary('Main', async () => {
            logger.log('Shutting down Name Tracker Extension');

            // TODO: Cleanup modules
            // TODO: Remove event listeners
            // TODO: Save state

            this.initialized = false;
            debugLogger.clear();

            logger.log('Extension shutdown complete');
        }, { silent: true });
    }
}

// Create extension instance
const nameTrackerExtension = new NameTrackerExtension();

// Initialize when jQuery is ready
jQuery(async () => {
    try {
        await nameTrackerExtension.initialize();

        // Make extension available globally for debugging
        window.nameTrackerExtension = nameTrackerExtension;

        // Add debug commands to browser console
        window.ntDebug = {
            status: () => nameTrackerExtension.getStatus(),
            errors: () => errorHandler.getRecentErrors(),
            settings: () => settingsManager.getSettings(),
            chatData: () => settingsManager.getChatData(),
            clear: () => debugLogger.clear(),
        };

        console.log('[STnametracker] Extension loaded. Use ntDebug.status() for diagnostics.');

    } catch (error) {
        console.error('[STnametracker] Failed to initialize:', error);
        notifications.error('Extension failed to load', 'Critical Error');
    }
});

export default nameTrackerExtension;
