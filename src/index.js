/**
 * Name Tracker Extension - Main Orchestrator
 * 
 * Modular architecture v2.1.0+
 * Coordinates all feature modules while maintaining SillyTavern extension compatibility
 */

// Core infrastructure
import { createModuleLogger } from './core/debug.js';
import { withErrorBoundary, NameTrackerError } from './core/errors.js';
import { settings } from './core/settings.js';
import { stContext } from './core/context.js';

// Utility functions  
import { NotificationManager } from './utils/notifications.js';

// Feature modules
import { initializeLorebook, resetLorebookState, adoptExistingEntries } from './modules/lorebook.js';
import { onMessageReceived, onChatChanged, clearProcessingQueue } from './modules/processing.js';
import { 
    loadSettingsHTML, 
    bindSettingsHandlers, 
    initializeMenuButtons, 
    initializeUIHandlers,
    updateUI,
    updateCharacterList,
    updateStatusDisplay 
} from './modules/ui.js';
import { clearAnalysisCache } from './modules/llm.js';

// Import styles
import '../style.css';

// Main extension orchestrator
const debug = createModuleLogger('main');
const notifications = new NotificationManager('Name Tracker');

/**
 * Extension constants
 */
const extensionName = "STnametracker";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;

/**
 * Main extension class - coordinates all modules
 */
class NameTrackerExtension {
    constructor() {
        this.initialized = false;
        this.context = null;
        debug('Extension instance created');
    }

    /**
     * Initialize the extension
     * @returns {Promise<void>}
     */
    async initialize() {
        return withErrorBoundary('initialize', async () => {
            if (this.initialized) {
                debug('Extension already initialized');
                return;
            }

            debug('Starting extension initialization...');

            // Initialize core systems
            await this.initializeCore();

            // Initialize feature modules  
            await this.initializeFeatures();

            // Initialize UI systems
            await this.initializeUI();

            // Set up event subscriptions
            this.setupEventHandlers();

            this.initialized = true;
            debug('Extension initialization complete');
            console.log('Name Tracker extension v2.1.0 loaded (modular architecture)');
        });
    }

    /**
     * Initialize core systems
     * @returns {Promise<void>}
     */
    async initializeCore() {
        return withErrorBoundary('initializeCore', async () => {
            // Initialize SillyTavern context
            this.context = stContext.getSillyTavernContext();
            
            // Initialize settings system
            await settings.initialize(extensionName);
            
            debug('Core systems initialized');
        });
    }

    /**
     * Initialize feature modules
     * @returns {Promise<void>}
     */
    async initializeFeatures() {
        return withErrorBoundary('initializeFeatures', async () => {
            // Initialize lorebook for current chat
            await initializeLorebook();
            
            // Adopt any existing lorebook entries
            await adoptExistingEntries();
            
            debug('Feature modules initialized');
        });
    }

    /**
     * Initialize UI systems
     * @returns {Promise<void>}
     */
    async initializeUI() {
        return withErrorBoundary('initializeUI', async () => {
            // Load and inject settings HTML
            await loadSettingsHTML(extensionFolderPath);
            
            // Bind all UI event handlers
            bindSettingsHandlers();
            initializeUIHandlers();
            
            // Initialize extension menu buttons
            initializeMenuButtons();
            
            // Update UI with current settings
            updateUI();
            
            debug('UI systems initialized');
        });
    }

    /**
     * Set up SillyTavern event handlers
     * @returns {void}
     */
    setupEventHandlers() {
        return withErrorBoundary('setupEventHandlers', () => {
            const { eventSource, event_types } = window;
            
            if (!eventSource || !event_types) {
                console.warn('[Name Tracker] SillyTavern event system not available');
                return;
            }

            // Subscribe to SillyTavern events
            eventSource.on(event_types.MESSAGE_RECEIVED, this.handleMessageReceived.bind(this));
            eventSource.on(event_types.MESSAGE_SENT, this.handleMessageReceived.bind(this));
            eventSource.on(event_types.CHAT_CHANGED, this.handleChatChanged.bind(this));
            
            debug('Event handlers set up');
        });
    }

    /**
     * Handle message received/sent events
     * @param {number} messageId - Message ID
     * @returns {Promise<void>}
     */
    async handleMessageReceived(messageId) {
        return withErrorBoundary('handleMessageReceived', async () => {
            debug('Message event received:', messageId);
            
            try {
                await onMessageReceived(messageId);
                
                // Update UI after message processing
                updateCharacterList();
                updateStatusDisplay();
            } catch (error) {
                console.error('[Name Tracker] Error handling message:', error);
            }
        });
    }

    /**
     * Handle chat changed event
     * @returns {Promise<void>}
     */
    async handleChatChanged() {
        return withErrorBoundary('handleChatChanged', async () => {
            debug('Chat changed event received');
            
            try {
                // Reset module states for new chat
                resetLorebookState();
                clearProcessingQueue();
                clearAnalysisCache();
                await onChatChanged();
                
                // Reinitialize for new chat
                await this.initializeFeatures();
                
                // Update UI
                updateUI();
                
                debug('Chat changed handling complete');
            } catch (error) {
                console.error('[Name Tracker] Error handling chat change:', error);
            }
        });
    }

    /**
     * Cleanup extension resources
     * @returns {void}
     */
    cleanup() {
        return withErrorBoundary('cleanup', () => {
            debug('Cleaning up extension resources');
            
            // Clear processing queues and caches
            clearProcessingQueue();
            clearAnalysisCache();
            
            // Reset module states
            resetLorebookState();
            
            this.initialized = false;
            debug('Extension cleanup complete');
        });
    }

    /**
     * Get extension status
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            initialized: this.initialized,
            version: '2.1.0',
            architecture: 'modular',
            modules: {
                core: ['debug', 'errors', 'settings', 'context'],
                utils: ['helpers', 'notifications'],
                features: ['characters', 'llm', 'lorebook', 'processing', 'ui']
            }
        };
    }
}

/**
 * Global extension instance
 */
let nameTrackerExtension = null;

/**
 * Initialize extension when jQuery is ready
 */
jQuery(async () => {
    try {
        // Create extension instance
        nameTrackerExtension = new NameTrackerExtension();
        
        // Initialize extension
        await nameTrackerExtension.initialize();
        
        // Make extension accessible for debugging
        if (window.SillyTavern) {
            window.SillyTavern.nameTracker = nameTrackerExtension;
        }
        
    } catch (error) {
        console.error('[Name Tracker] Failed to initialize extension:', error);
        
        // Show user-friendly error
        if (typeof toastr !== 'undefined') {
            toastr.error('Failed to initialize Name Tracker extension. Check console for details.', 'Name Tracker');
        }
    }
});

/**
 * Export extension for potential external access
 */
export { nameTrackerExtension };

// Legacy support - ensure extension globals are available
if (typeof window !== 'undefined') {
    window.NameTrackerExtension = NameTrackerExtension;
}