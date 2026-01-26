/**
 * SillyTavern World Info (Lorebook) Integration Layer
 * 
 * Provides access to the world-info module functions for managing
 * the editor state and lorebook selection in the UI.
 * 
 * References the official SillyTavern world-info.js module:
 * https://github.com/SillyTavern/SillyTavern/blob/staging/public/scripts/world-info.js
 */

import { createModuleLogger } from './debug.js';
import { errorHandler } from './errors.js';
import { stContext } from './context.js';

const logger = createModuleLogger('WorldInfo');

/**
 * Reload the world info editor with the specified file
 * Makes the specified world info (lorebook) active in the editor
 * 
 * Calls the SillyTavern world-info.js reloadEditor() function:
 * - Updates the #world_editor_select dropdown value
 * - Triggers 'change' event to load the lorebook in the editor
 * - Only reloads if the file exists and either loadIfNotSelected is true
 *   or the file is already currently selected
 * 
 * @param {string} file - The world info file name to load
 * @param {boolean} [loadIfNotSelected=false] - Load even if not currently selected
 * @returns {boolean} True if successful, false otherwise
 */
export function reloadEditor(file, loadIfNotSelected = false) {
    return errorHandler.withErrorBoundary('WorldInfo', () => {
        try {
            const context = stContext.getContext();
            
            // Use the official SillyTavern reloadWorldInfoEditor if available
            if (typeof context.reloadWorldInfoEditor === 'function') {
                context.reloadWorldInfoEditor(file, loadIfNotSelected);
                logger.log(`Reloaded editor with lorebook: ${file}`);
                return true;
            }

            // Fallback: Manipulate the editor directly via jQuery
            // This mirrors the official implementation from world-info.js
            const currentIndex = Number($('#world_editor_select').val());
            const world_names = context.currentWorldNames || window.world_names || [];
            const selectedIndex = world_names.indexOf(file);
            
            if (selectedIndex !== -1 && (loadIfNotSelected || currentIndex === selectedIndex)) {
                $('#world_editor_select').val(selectedIndex).trigger('change');
                logger.log(`Editor reloaded with lorebook: ${file}`);
                return true;
            }

            logger.warn(`Could not reload editor with lorebook: ${file}`);
            return false;
        } catch (error) {
            logger.error(`Failed to reload editor: ${error.message}`);
            return false;
        }
    }, false);
}

/**
 * Get the currently selected world info file
 * @returns {string|null} Current world info file name or null
 */
export function getCurrentWorldInfo() {
    return errorHandler.withErrorBoundary('WorldInfo', () => {
        try {
            const currentIndex = Number($('#world_editor_select').val());
            const world_names = window.world_names || [];
            
            if (world_names[currentIndex]) {
                return world_names[currentIndex];
            }
            return null;
        } catch (error) {
            logger.error(`Failed to get current world info: ${error.message}`);
            return null;
        }
    }, null);
}

export default {
    reloadEditor,
    getCurrentWorldInfo,
};
