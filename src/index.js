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

// Feature modules
import { /* initializeCharacterManager */ } from './modules/characters.js';
import { /* initializeLLMManager */ } from './modules/llm.js';
import { initializeLorebook } from './modules/lorebook.js';
import { /* initializeProcessingManager */ } from './modules/processing.js';
import { initializeUIHandlers, initializeMenuButtons } from './modules/ui.js';

// Immediate import validation
console.log('[STnametracker] Main index.js: Import validation');
console.log('[STnametracker] Main index.js: initializeLorebook import =', typeof initializeLorebook, initializeLorebook);
console.log('[STnametracker] Main index.js: initializeUIHandlers import =', typeof initializeUIHandlers, initializeUIHandlers);
console.log('[STnametracker] Main index.js: initializeMenuButtons import =', typeof initializeMenuButtons, initializeMenuButtons);

if (typeof initializeLorebook !== 'function') {
    console.error('[STnametracker] Main index.js: CRITICAL ERROR - initializeLorebook import failed!');
    console.error('[STnametracker] Main index.js: Expected function, got:', typeof initializeLorebook, initializeLorebook);
}

// Extension name constant - MUST match manifest
const extensionName = 'STnametracker';
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;

/**
 * Get extension settings - Required for SillyTavern integration
 * This is the pattern that SillyTavern expects
 * @returns {Object} Extension settings object
 */
function getSettings() {
    // Use global extension_settings that SillyTavern provides
    return window.extension_settings?.[extensionName] || {};
}

// Create the logger AFTER the getSettings function is defined
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
        console.log('[STnametracker] Enter initialize() method');
        return errorHandler.withErrorBoundary('Main', async () => {
            console.log('[STnametracker] Inside error boundary');
            if (this.initialized) {
                console.log('[STnametracker] Already initialized, skipping');
                return;
            }

            console.log('[STnametracker] Starting initialization sequence');
            logger.log('Starting Name Tracker Extension v2.1.0');

            // Initialize core systems
            console.log('[STnametracker] Step 1: Initializing core systems...');
            await this.initializeCore();
            console.log('[STnametracker] Step 1: Core systems completed');

            // Initialize feature modules
            console.log('[STnametracker] Step 2: Initializing feature modules...');
            await this.initializeModules();
            console.log('[STnametracker] Step 2: Feature modules completed');

            // Setup UI
            console.log('[STnametracker] Step 3: Initializing UI...');
            await this.initializeUI();
            console.log('[STnametracker] Step 3: UI completed');

            // Register event listeners
            console.log('[STnametracker] Step 4: Registering event listeners...');
            this.registerEventListeners();
            console.log('[STnametracker] Step 4: Event listeners completed');

            this.initialized = true;
            console.log('[STnametracker] Marking as initialized');
            logger.log('Name Tracker Extension initialized successfully');
            console.log('[STnametracker] Full initialization sequence completed successfully');

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
        console.log('[STnametracker] initializeCore: Starting...');
        logger.debug('Initializing core systems...');

        // Connect debug system to settings
        console.log('[STnametracker] initializeCore: Connecting debug system...');
        debugLogger.isDebugEnabled = () => settingsManager.isDebugMode();
        console.log('[STnametracker] initializeCore: Debug system connected');

        // Initialize settings manager
        console.log('[STnametracker] initializeCore: Initializing settings manager...');
        await settingsManager.initialize();
        console.log('[STnametracker] initializeCore: Settings manager initialized');

        // Setup error recovery strategies
        this.setupErrorRecovery();

        logger.debug('Core systems initialized');
    }

    /**
     * Initialize feature modules
     * @returns {Promise<void>}
     */
    async initializeModules() {
        logger.debug('Initializing feature modules...');
        console.log('[STnametracker] initializeModules: Starting module initialization');
        
        // Add extensive debugging for imports
        console.log('[STnametracker] initializeModules: Checking import of initializeLorebook...');
        console.log('[STnametracker] initializeModules: initializeLorebook =', typeof initializeLorebook, initializeLorebook);
        
        if (typeof initializeLorebook !== 'function') {
            console.error('[STnametracker] initializeModules: CRITICAL - initializeLorebook is not a function!');
            console.error('[STnametracker] initializeModules: Type:', typeof initializeLorebook);
            console.error('[STnametracker] initializeModules: Value:', initializeLorebook);
            throw new Error('initializeLorebook is not a function: ' + typeof initializeLorebook);
        }

        try {
            // Initialize lorebook for current chat
            console.log('[STnametracker] initializeModules: About to call initializeLorebook()...');
            await initializeLorebook();
            console.log('[STnametracker] initializeModules: initializeLorebook() completed successfully');

            logger.debug('Feature modules initialized');
        } catch (error) {
            console.error('[STnametracker] initializeModules: Error in initializeLorebook:', error);
            logger.error('Failed to initialize feature modules:', error);
            throw error;
        }
    }

    /**
     * Initialize UI components
     * @returns {Promise<void>}
     */
    async initializeUI() {
        console.log('[STnametracker] initializeUI: Starting UI initialization...');
        logger.debug('Initializing UI...');

        try {
            // Load settings HTML using proper jQuery pattern
            console.log('[STnametracker] initializeUI: Loading settings HTML from:', `${extensionFolderPath}/settings.html`);
            const settingsHtml = await $.get(`${extensionFolderPath}/settings.html`);
            console.log('[STnametracker] initializeUI: Settings HTML loaded, length:', settingsHtml.length);

            console.log('[STnametracker] initializeUI: Finding #extensions_settings element...');
            const targetElement = $('#extensions_settings');
            console.log('[STnametracker] initializeUI: Target element found:', targetElement.length > 0);

            targetElement.append(settingsHtml);
            console.log('[STnametracker] initializeUI: Settings HTML appended');

            // Initialize UI handlers
            console.log('[STnametracker] initializeUI: Initializing UI handlers...');
            initializeUIHandlers();
            console.log('[STnametracker] initializeUI: UI handlers initialized');

            console.log('[STnametracker] initializeUI: Initializing menu buttons...');
            initializeMenuButtons();
            console.log('[STnametracker] initializeUI: Menu buttons initialized');

            logger.debug('UI initialized');
        } catch (error) {
            logger.error('Failed to initialize UI:', error);
            throw error;
        }
    }

    /**
     * Register SillyTavern event listeners
     */
    registerEventListeners() {
        logger.debug('Registering event listeners...');

        try {
            // Get event objects from SillyTavern context
            const context = sillyTavernContext.getContext();
            const eventSource = context.eventSource;
            const event_types = context.event_types;

            if (!eventSource || !event_types) {
                logger.warn('SillyTavern event system not available');
                return;
            }

            // Register for SillyTavern events
            eventSource.on(event_types.MESSAGE_RECEIVED, async (messageId) => {
                logger.debug('Message received event:', messageId);
                // TODO: Process new message
            });

            eventSource.on(event_types.MESSAGE_SENT, async (messageId) => {
                logger.debug('Message sent event:', messageId);
                // TODO: Process new message
            });

            eventSource.on(event_types.CHAT_CHANGED, async () => {
                logger.debug('Chat changed event received');
                await settingsManager.onChatChanged();
            });

            logger.debug('Event listeners registered');
        } catch (error) {
            logger.error('Failed to register event listeners:', error);
        }
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

// Initialize extension when jQuery is ready - SillyTavern pattern
jQuery(async () => {
    console.log('[STnametracker] jQuery ready, starting extension load...');
    try {
        console.log('[STnametracker] Logger available, initializing...');
        logger.log('Name Tracker Extension loading...');

        // Initialize extension_settings for this extension
        console.log('[STnametracker] Setting up extension_settings...');
        if (!window.extension_settings) {
            console.log('[STnametracker] Creating window.extension_settings');
            window.extension_settings = {};
        }
        console.log('[STnametracker] Current extension_settings keys:', Object.keys(window.extension_settings));
        window.extension_settings[extensionName] = window.extension_settings[extensionName] || {};
        console.log('[STnametracker] Extension settings initialized');

        console.log('[STnametracker] Starting main initialization...');
        await nameTrackerExtension.initialize();
        console.log('[STnametracker] Main initialization completed');

        // Make extension available globally for debugging
        window.nameTrackerExtension = nameTrackerExtension;

        // Add debug commands to browser console
        window.ntDebug = {
            status: () => nameTrackerExtension.getStatus(),
            errors: () => errorHandler.getRecentErrors(),
            settings: () => getSettings(),
            chatData: () => settingsManager.getChatData(),
            clear: () => debugLogger.clear(),
        };

        logger.log('Name Tracker Extension loaded successfully');
        console.log('[STnametracker] Extension loaded. Use ntDebug.status() for diagnostics.');

    } catch (error) {
        console.error('[STnametracker] Failed to initialize:', error);
        notifications.error('Extension failed to load', 'Critical Error');
    }
});

export default nameTrackerExtension;
