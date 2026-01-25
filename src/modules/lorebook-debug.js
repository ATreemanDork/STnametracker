/**
 * Temporary debug version of lorebook module with extensive logging
 */

import { createModuleLogger } from '../core/debug.js';
import { withErrorBoundary, NameTrackerError } from '../core/errors.js';
import { get_settings } from '../core/settings.js';
import { stContext } from '../core/context.js';
import { generateUID } from '../utils/helpers.js';
import { NotificationManager } from '../utils/notifications.js';

// Add extensive debug logging
console.log('[STnametracker] Lorebook module: Starting imports validation');
console.log('[STnametracker] Lorebook module: createModuleLogger =', typeof createModuleLogger, createModuleLogger);
console.log('[STnametracker] Lorebook module: withErrorBoundary =', typeof withErrorBoundary, withErrorBoundary);
console.log('[STnametracker] Lorebook module: NameTrackerError =', typeof NameTrackerError, NameTrackerError);
console.log('[STnametracker] Lorebook module: get_settings =', typeof get_settings, get_settings);
console.log('[STnametracker] Lorebook module: stContext =', typeof stContext, stContext);
console.log('[STnametracker] Lorebook module: generateUID =', typeof generateUID, generateUID);
console.log('[STnametracker] Lorebook module: NotificationManager =', typeof NotificationManager, NotificationManager);

// Try to create module logger and catch any errors
let debug;
try {
    console.log('[STnametracker] Lorebook module: About to call createModuleLogger');
    debug = createModuleLogger('lorebook');
    console.log('[STnametracker] Lorebook module: Successfully created debug logger =', typeof debug, debug);
} catch (error) {
    console.error('[STnametracker] Lorebook module: Failed to create debug logger:', error);
    debug = (...args) => console.log('[STnametracker] Lorebook fallback debug:', ...args);
}

// Try to create notification manager and catch any errors
let notifications;
try {
    console.log('[STnametracker] Lorebook module: About to create NotificationManager');
    notifications = new NotificationManager('Lorebook Management');
    console.log('[STnametracker] Lorebook module: Successfully created notifications =', typeof notifications, notifications);
} catch (error) {
    console.error('[STnametracker] Lorebook module: Failed to create notifications:', error);
    notifications = {
        success: (...args) => console.log('[STnametracker] Lorebook success:', ...args),
        error: (...args) => console.error('[STnametracker] Lorebook error:', ...args),
        info: (...args) => console.log('[STnametracker] Lorebook info:', ...args),
    };
}

// Lorebook state
// eslint-disable-next-line no-unused-vars
let lorebookName = null;

/**
 * Initialize lorebook for current chat
 * @returns {Promise<string|null>} Lorebook name if successful, null if no chat
 */
export async function initializeLorebook() {
    console.log('[STnametracker] initializeLorebook: Starting function');
    console.log('[STnametracker] initializeLorebook: withErrorBoundary =', typeof withErrorBoundary, withErrorBoundary);

    // Validate all dependencies before proceeding
    const validations = [
        { name: 'withErrorBoundary', value: withErrorBoundary, type: typeof withErrorBoundary },
        { name: 'stContext', value: stContext, type: typeof stContext },
        { name: 'stContext.getContext', value: stContext?.getContext, type: typeof stContext?.getContext },
        { name: 'get_settings', value: get_settings, type: typeof get_settings },
        { name: 'debug', value: debug, type: typeof debug },
        { name: 'notifications', value: notifications, type: typeof notifications },
    ];

    console.log('[STnametracker] initializeLorebook: Dependency validation:');
    validations.forEach(v => {
        console.log(`  ${v.name}: ${v.type} =`, v.value);
        if (v.type === 'undefined') {
            console.error(`[STnametracker] initializeLorebook: CRITICAL - ${v.name} is undefined!`);
        }
    });

    try {
        console.log('[STnametracker] initializeLorebook: About to call withErrorBoundary');

        return withErrorBoundary('initializeLorebook', async () => {
            console.log('[STnametracker] initializeLorebook: Inside withErrorBoundary');
            console.log('[STnametracker] initializeLorebook: stContext =', typeof stContext, stContext);
            console.log('[STnametracker] initializeLorebook: stContext.getContext =', typeof stContext?.getContext, stContext?.getContext);

            let context;
            try {
                console.log('[STnametracker] initializeLorebook: About to call stContext.getContext()');
                context = stContext.getContext();
                console.log('[STnametracker] initializeLorebook: Successfully got context =', typeof context, context);
            } catch (contextError) {
                console.error('[STnametracker] initializeLorebook: Failed to get context:', contextError);
                throw contextError;
            }

            if (!context.chatId) {
                console.log('[STnametracker] initializeLorebook: No chatId, skipping initialization');
                debug('No active chat, skipping lorebook initialization');
                lorebookName = null;
                return null;
            }

            console.log('[STnametracker] initializeLorebook: Chat found, proceeding with lorebook initialization');

            // For now, return success to isolate the error
            return 'debug-placeholder';
        });

    } catch (mainError) {
        console.error('[STnametracker] initializeLorebook: Main function error:', mainError);
        throw mainError;
    }
}
