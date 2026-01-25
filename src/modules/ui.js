/**
 * UI Management Module
 *
 * Handles user interface components, settings panel management, character lists,
 * modal dialogs, and progress indicators for the Name Tracker extension.
 */

import { createModuleLogger } from '../core/debug.js';
import { withErrorBoundary, NameTrackerError } from '../core/errors.js';
import { 
    getSettings, get_settings, set_settings, 
    getCharacters, getCharacter, setCharacter, removeCharacter,
    get_chat_metadata, set_chat_metadata, getSetting, setSetting
} from '../core/settings.js';
import { stContext } from '../core/context.js';
import { escapeHtml } from '../utils/helpers.js';
import { NotificationManager } from '../utils/notifications.js';
import { mergeCharacters, toggleIgnoreCharacter, createNewCharacter, purgeAllCharacters, hasUnresolvedRelationships } from './characters.js';
import { loadOllamaModels } from './llm.js';
import { harvestMessages, scanEntireChat, clearProcessingQueue } from './processing.js';
import { viewInLorebook } from './lorebook.js';

const debug = createModuleLogger('ui');
const notifications = new NotificationManager('UI Management');

/**
 * Update character list display in settings
 * @returns {void}
 */
export function updateCharacterList() {
    return withErrorBoundary('updateCharacterList', () => {
        const $container = $('#name_tracker_character_list');
        if ($container.length === 0) {
            debug.log();
            return;
        }

        const characters = getCharacters();
        const characterNames = Object.keys(characters);

        if (characterNames.length === 0) {
            $container.html(`
                <div class="name_tracker_no_characters">
                    <p style="text-align: center; color: var(--SmartThemeQuoteColor);">
                        No characters tracked yet. Start a conversation and character information will be extracted automatically!
                    </p>
                </div>
            `);
            return;
        }

        // Sort characters: Main characters first, then alphabetically
        const sortedCharacters = Object.values(characters).sort((a, b) => {
            if (a.isMainChar && !b.isMainChar) return -1;
            if (!a.isMainChar && b.isMainChar) return 1;
            return a.preferredName.localeCompare(b.preferredName);
        });

        let html = '<div class="name_tracker_character_list">';

        for (const character of sortedCharacters) {
            const charIcon = character.isMainChar ? '<i class="fa-solid fa-user"></i>' : '';
            const ignoreIcon = character.ignored ? '<span class="char-ignored-badge">IGNORED</span>' : '';
            const reviewBadge = hasUnresolvedRelationships(character) ? '<span class="char-review-badge">NEEDS REVIEW</span>' : '';

            const aliasText = character.aliases && character.aliases.length > 0
                ? `<div class="char-aliases">Aliases: ${escapeHtml(character.aliases.join(', '))}</div>`
                : '';

            const relationshipText = character.relationships && character.relationships.length > 0
                ? `<div class="char-relationships">Relationships: ${escapeHtml(character.relationships.join('; '))}</div>`
                : '';

            const lastUpdated = character.lastUpdated
                ? new Date(character.lastUpdated).toLocaleString()
                : 'Never';

            html += `
                <div class="name_tracker_character_item" data-character="${escapeHtml(character.preferredName)}">
                    <div class="char-header">
                        <span class="char-name">
                            ${charIcon}
                            ${escapeHtml(character.preferredName)}
                            ${ignoreIcon}
                            ${reviewBadge}
                        </span>
                        <div class="char-actions">
                            <button class="char-action-btn char-action-edit" data-name="${escapeHtml(character.preferredName)}" title="Edit lorebook entry">
                                <i class="fa-solid fa-edit"></i>
                            </button>
                            <button class="char-action-btn char-action-view" data-name="${escapeHtml(character.preferredName)}" title="View in lorebook">
                                <i class="fa-solid fa-book"></i>
                            </button>
                            <button class="char-action-btn char-action-merge" data-name="${escapeHtml(character.preferredName)}" title="Merge with another character">
                                <i class="fa-solid fa-code-merge"></i>
                            </button>
                            <button class="char-action-btn char-action-ignore" data-name="${escapeHtml(character.preferredName)}" title="${character.ignored ? 'Unignore' : 'Ignore'} character">
                                <i class="fa-solid ${character.ignored ? 'fa-eye' : 'fa-eye-slash'}"></i>
                            </button>
                        </div>
                    </div>
                    ${aliasText}
                    ${relationshipText}
                    <div class="char-metadata">
                        <span>Confidence: ${character.confidence}%</span>
                        <span>Updated: ${lastUpdated}</span>
                    </div>
                </div>
            `;
        }

        html += '</div>';
        $container.html(html);
    });
}

/**
 * Update status display in settings
 * @returns {void}
 */
export function updateStatusDisplay() {
    return withErrorBoundary('updateStatusDisplay', () => {
        const $statusContainer = $('#name_tracker_status_display');
        if ($statusContainer.length === 0) {
            return;
        }

        const characters = getCharacters();
        const characterCount = Object.keys(characters).length;
        const messageCounter = getSetting('messageCounter', 0);
        const lastScannedId = getSetting('lastScannedMessageId', -1);
        const messageFreq = getSetting('messageFrequency', 10);

        const context = stContext.getContext();
        const currentMessageId = context?.chat?.length || 0;
        const pendingMessages = Math.max(0, currentMessageId - lastScannedId);
        const progressText = messageCounter > 0 ? ` (${messageCounter} analyzed)` : '';
        const currentChatLength = context.chat ? context.chat.length : 0;
        const messagesToNextScan = Math.max(0, messageFreq - (currentChatLength - lastScannedId));

        const statusHtml = `
            <div class="name_tracker_status">
                <div class="status-item">
                    <strong>Characters tracked:</strong> ${characterCount}${progressText}
                </div>
                <div class="status-item">
                    <strong>Messages in chat:</strong> ${currentChatLength}
                </div>
                <div class="status-item">
                    <strong>Last scanned message:</strong> ${lastScannedId >= 0 ? lastScannedId + 1 : 'None'}
                </div>
                <div class="status-item">
                    <strong>Pending messages:</strong> ${pendingMessages}
                </div>
                <div class="status-item">
                    <strong>Messages until next scan:</strong> ${messagesToNextScan}
                </div>
            </div>
        `;

        $statusContainer.html(statusHtml);
    });
}

/**
 * Show character merge dialog
 * @param {string} sourceName - Name of source character
 * @returns {Promise<void>}
 */
export async function showMergeDialog(sourceName) {
    return withErrorBoundary('showMergeDialog', async () => {
        const characters = getCharacters();

        // Create list of other characters
        const otherChars = Object.keys(characters).filter(name => name !== sourceName);

        if (otherChars.length === 0) {
            notifications.warning('No other characters to merge with');
            return;
        }

        // Simple prompt for target character
        const targetName = prompt(`Merge "${sourceName}" into which character? Available: ${otherChars.join(', ')}`);
        if (targetName && characters[targetName]) {
            await mergeCharacters(sourceName, targetName);
            updateCharacterList();
            updateStatusDisplay();
        } else if (targetName) {
            notifications.error('Invalid target character name');
        }
    });
}

/**
 * Show character creation modal
 * @returns {Promise<void>}
 */
export async function showCreateCharacterModal() {
    return withErrorBoundary('showCreateCharacterModal', async () => {
        const characterName = prompt('Enter character name:');

        if (!characterName || !characterName.trim()) {
            return;
        }

        try {
            await createNewCharacter(characterName.trim());
            updateCharacterList();
            updateStatusDisplay();
        } catch (error) {
            notifications.error(error.message);
        }
    });
}

/**
 * Show purge confirmation dialog
 * @returns {Promise<void>}
 */
export async function showPurgeConfirmation() {
    return withErrorBoundary('showPurgeConfirmation', async () => {
        const characters = getCharacters();
        const characterCount = Object.keys(characters).length;

        if (characterCount === 0) {
            notifications.info('No characters to purge');
            return;
        }

        const confirmed = confirm(`This will delete all ${characterCount} tracked characters and their lorebook entries.\\n\\nThis action cannot be undone!\\n\\nContinue?`);

        if (confirmed) {
            try {
                const deletedCount = await purgeAllCharacters();
                updateCharacterList();
                updateStatusDisplay();
                notifications.success(`Purged ${deletedCount} characters`);
            } catch (error) {
                notifications.error(`Failed to purge characters: ${error.message}`);
            }
        }
    });
}

/**
 * Show system prompt editor modal
 * @returns {Promise<void>}
 */
export async function showSystemPromptEditor() {
    return withErrorBoundary('showSystemPromptEditor', async () => {
        const currentPrompt = getSetting('systemPrompt') || '';

        // Create modal dialog
        const modal = $(`
            <div class="nametracker-modal" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--SmartThemeBlurTintColor);
                border: 1px solid var(--SmartThemeBorderColor);
                border-radius: 10px;
                padding: 20px;
                max-width: 700px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                z-index: 9999;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            ">
                <h3 style="margin-top: 0;">Edit System Prompt</h3>
                <p>Customize the system prompt used for character analysis. Leave blank to use default.</p>
                <textarea id="system_prompt_editor" rows="20" style="width: 100%; margin: 10px 0;" 
                          placeholder="Enter custom system prompt or leave blank for default...">${escapeHtml(currentPrompt)}</textarea>
                <div style="margin-top: 20px; text-align: right;">
                    <button class="menu_button" id="system_prompt_save">Save</button>
                    <button class="menu_button" id="system_prompt_reset">Reset to Default</button>
                    <button class="menu_button" id="system_prompt_cancel">Cancel</button>
                </div>
            </div>
        `);

        const overlay = $(`
            <div class="nametracker-overlay" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                z-index: 9998;
            "></div>
        `);

        $('body').append(overlay).append(modal);

        const removeModal = () => {
            modal.remove();
            overlay.remove();
        };

        modal.find('#system_prompt_save').on('click', () => {
            const newPrompt = modal.find('#system_prompt_editor').val().trim();
            setSetting('systemPrompt', newPrompt || null);
            notifications.success('System prompt updated');
            removeModal();
        });

        modal.find('#system_prompt_reset').on('click', () => {
            modal.find('#system_prompt_editor').val('');
            setSetting('systemPrompt', null);
            notifications.success('Reset to default system prompt');
            removeModal();
        });

        modal.find('#system_prompt_cancel').on('click', removeModal);
        overlay.on('click', removeModal);
    });
}

/**
 * Show character list modal
 * @returns {void}
 */
export function showCharacterListModal() {
    return withErrorBoundary('showCharacterListModal', () => {
        const characters = Object.values(getCharacters() || {});

        // Build character list HTML
        let charactersHtml = '';

        if (characters.length === 0) {
            charactersHtml = '<p style="text-align: center; color: var(--SmartThemeQuoteColor);">No characters tracked yet</p>';
        } else {
            // Sort: Main characters first, then by name
            characters.sort((a, b) => {
                if (a.isMainChar && !b.isMainChar) return -1;
                if (!a.isMainChar && b.isMainChar) return 1;
                return a.preferredName.localeCompare(b.preferredName);
            });

            charactersHtml = '<div style="max-height: 400px; overflow-y: auto;">';
            for (const char of characters) {
                const badges = [];
                if (char.isMainChar) badges.push('<span style="background: var(--SmartThemeBodyColor); padding: 2px 6px; border-radius: 3px; font-size: 0.85em; margin-left: 5px;">MAIN</span>');
                if (char.ignored) badges.push('<span style="background: var(--black70a); padding: 2px 6px; border-radius: 3px; font-size: 0.85em; margin-left: 5px;">IGNORED</span>');
                if (hasUnresolvedRelationships(char)) badges.push('<span style="background: var(--crimsonDark); padding: 2px 6px; border-radius: 3px; font-size: 0.85em; margin-left: 5px;">NEEDS REVIEW</span>');

                const aliasText = char.aliases && char.aliases.length > 0
                    ? `<div style="font-size: 0.9em; color: var(--SmartThemeQuoteColor); margin-top: 3px;">Aliases: ${escapeHtml(char.aliases.join(', '))}</div>`
                    : '';

                charactersHtml += `
                    <div style="padding: 10px; margin: 5px 0; background: var(--SmartThemeBlurTintColor); border: 1px solid var(--SmartThemeBorderColor); border-radius: 5px;">
                        <div style="font-weight: bold;">
                            ${char.isMainChar ? '<i class="fa-solid fa-user" style="margin-right: 5px;"></i>' : ''}
                            ${escapeHtml(char.preferredName)}
                            ${badges.join('')}
                        </div>
                        ${aliasText}
                    </div>
                `;
            }
            charactersHtml += '</div>';
        }

        // Create and show modal
        const modalHtml = `
            <div class="name-tracker-character-modal">
                <h3 style="margin-top: 0;">Tracked Characters (${characters.length})</h3>
                ${charactersHtml}
                <div style="margin-top: 15px; text-align: center;">
                    <button class="menu_button" onclick="$('#name_tracker_settings').find('.inline-drawer-toggle').click(); $(this).closest('.popup').remove();">
                        <i class="fa-solid fa-gear"></i> Open Settings
                    </button>
                </div>
            </div>
        `;

        const context = stContext.getContext();
        context.callGenericPopup(modalHtml, context.POPUP_TYPE.TEXT, '', { wider: true, okButton: 'Close' });
    });
}

/**
 * Initialize UI event handlers
 * @returns {void}
 */
export function initializeUIHandlers() {
    return withErrorBoundary('initializeUIHandlers', () => {
        // Character action handlers
        $(document).on('click', '.char-action-merge', async function() {
            const sourceName = $(this).data('name');
            await showMergeDialog(sourceName);
        });

        $(document).on('click', '.char-action-ignore', async function() {
            const name = $(this).data('name');
            await toggleIgnoreCharacter(name);
            updateCharacterList();
            updateStatusDisplay();
        });

        $(document).on('click', '.char-action-view', async function() {
            const name = $(this).data('name');
            await viewInLorebook(name);
        });

        $(document).on('click', '.char-action-edit', async function() {
            const name = $(this).data('name');
            await showEditLorebookModal(name);
        });

        debug.log();
    });
}

/**
 * Show edit lorebook entry modal
 * @param {string} characterName - Name of character to edit
 * @returns {Promise<void>}
 */
async function showEditLorebookModal(characterName) {
    return withErrorBoundary('showEditLorebookModal', async () => {
        const character = getCharacter(characterName);

        if (!character) {
            notifications.error('Character not found');
            return;
        }

        // Build edit dialog
        const currentKeys = [characterName, ...(character.aliases || [])].join(', ');

        const dialogHtml = `
            <div class="lorebook-entry-editor">
                <h3>Edit Lorebook Entry: ${escapeHtml(characterName)}</h3>
                
                <div class="editor-section">
                    <label for="entry-keys">Keys (comma-separated):</label>
                    <input type="text" id="entry-keys" class="text_pole" value="${escapeHtml(currentKeys)}" 
                           placeholder="${escapeHtml(characterName)}, aliases, nicknames">
                    <small>These words trigger this entry in the chat context</small>
                </div>
                
                <div class="editor-section">
                    <label for="entry-content">Entry Content:</label>
                    <textarea id="entry-content" rows="10" class="text_pole" 
                              placeholder="Description, personality, background, relationships...">${escapeHtml(character.notes || '')}</textarea>
                    <small>This will be injected into context when keys are mentioned</small>
                </div>
                
                <div class="editor-section">
                    <label for="entry-relationships">Relationships:</label>
                    <textarea id="entry-relationships" rows="3" class="text_pole" 
                              placeholder="Friend of Alice; Enemy of Bob; Works for XYZ Corp">${escapeHtml((character.relationships || []).join('; '))}</textarea>
                    <small>One relationship per line or semicolon-separated</small>
                </div>
            </div>
        `;

        // Create simple modal dialog
        const modal = $(`
            <div class="nametracker-modal" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--SmartThemeBlurTintColor);
                border: 1px solid var(--SmartThemeBorderColor);
                border-radius: 10px;
                padding: 20px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                z-index: 9999;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            ">
                ${dialogHtml}
                <div style="margin-top: 20px; text-align: right;">
                    <button class="menu_button" id="entry-save">Save</button>
                    <button class="menu_button" id="entry-cancel">Cancel</button>
                </div>
            </div>
        `);

        const overlay = $(`
            <div class="nametracker-overlay" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                z-index: 9998;
            "></div>
        `);

        $('body').append(overlay).append(modal);

        const removeModal = () => {
            modal.remove();
            overlay.remove();
        };

        modal.find('#entry-save').on('click', async () => {
            const keys = modal.find('#entry-keys').val().split(',').map(k => k.trim()).filter(k => k);
            const content = modal.find('#entry-content').val();
            const relationships = modal.find('#entry-relationships').val()
                .split(/[;\\n]/)
                .map(r => r.trim())
                .filter(r => r);

            // Update character data
            const preferredName = keys[0] || characterName;
            const aliases = keys.slice(1);

            character.preferredName = preferredName;
            character.aliases = aliases;
            character.notes = content;
            character.relationships = relationships;

            // If preferred name changed, need to update the key in settings
            if (preferredName !== characterName) {
                removeCharacter(characterName);
            }
            setCharacter(preferredName, character);

            updateCharacterList();
            updateStatusDisplay();

            notifications.success(`Updated lorebook entry for ${preferredName}`);
            removeModal();
        });

        modal.find('#entry-cancel').on('click', removeModal);
        overlay.on('click', removeModal);
    });
}

/**
 * Add a menu button to the extensions menu
 * @param {string} text - Button text
 * @param {string} faIcon - Font Awesome icon classes
 * @param {Function} callback - Click handler
 * @param {string} hover - Tooltip text
 * @param {string} className - Optional additional CSS class
 * @returns {void}
 */
export function addMenuButton(text, faIcon, callback, hover = null, className = '') {
    return withErrorBoundary('addMenuButton', () => {
        const $button = $(`
            <div class="list-group-item flex-container flexGap5 interactable ${className}" title="${hover || text}" tabindex="0">
                <i class="${faIcon}"></i>
                <span>${text}</span>
            </div>
        `);

        const $extensionsMenu = $('#extensionsMenu');
        if (!$extensionsMenu.length) {
            console.error('[Name Tracker] Could not find the extensions menu');
            return;
        }

        $button.appendTo($extensionsMenu);
        $button.on('click', () => callback());
    });
}

/**
 * Toggle auto-harvest on/off
 * @returns {void}
 */
export function toggleAutoHarvest() {
    return withErrorBoundary('toggleAutoHarvest', () => {
        const currentValue = getSetting('autoAnalyze', true);
        setSetting('autoAnalyze', !currentValue);

        // Update the settings UI
        $('#name_tracker_auto_analyze').prop('checked', !currentValue);

        // Update menu button icon to reflect state
        const $menuButton = $('#extensionsMenu .name-tracker-toggle-harvest');
        if (!currentValue) {
            $menuButton.find('i').removeClass('fa-toggle-off').addClass('fa-toggle-on');
        } else {
            $menuButton.find('i').removeClass('fa-toggle-on').addClass('fa-toggle-off');
        }

        updateStatusDisplay();

        notifications.success(
            `Auto-harvest ${!currentValue ? 'enabled' : 'disabled'}`,
        );
    });
}

/**
 * Open the chat lorebook in the World Info editor
 * @returns {Promise<void>}
 */
export async function openChatLorebook() {
    return withErrorBoundary('openChatLorebook', async () => {
        const context = stContext.getContext();
        const lorebookName = context.chatMetadata?.world_info;

        if (!lorebookName) {
            notifications.warning('No active chat or lorebook');
            return;
        }

        if (typeof context.openWorldInfoEditor === 'function') {
            await context.openWorldInfoEditor(lorebookName);
        } else {
            // Fallback: show the world info panel
            $('#WorldInfo').click();
            notifications.info(`Please select "${lorebookName}" from the World Info panel`);
        }
    });
}

/**
 * Initialize extension menu buttons
 * @returns {void}
 */
export function initializeMenuButtons() {
    return withErrorBoundary('initializeMenuButtons', () => {
        // Add toggle auto-harvest button with visual state
        const autoAnalyze = getSetting('autoAnalyze', true);
        const toggleIcon = autoAnalyze ? 'fa-solid fa-toggle-on' : 'fa-solid fa-toggle-off';
        addMenuButton(
            'Toggle Auto-Harvest',
            toggleIcon,
            toggleAutoHarvest,
            'Toggle automatic character harvesting on/off',
            'name-tracker-toggle-harvest',
        );

        // Add character list button
        addMenuButton(
            'View Characters',
            'fa-solid fa-users',
            showCharacterListModal,
            'View all tracked characters',
        );

        // Add open lorebook button
        addMenuButton(
            'Open Chat Lorebook',
            'fa-solid fa-book',
            openChatLorebook,
            'Open the Name Tracker chat lorebook in the World Info editor',
        );

        debug.log();
    });
}

/**
 * Bind settings UI event handlers
 * @returns {void}
 */
export function bindSettingsHandlers() {
    return withErrorBoundary('bindSettingsHandlers', () => {
        // Main settings handlers
        $('#name_tracker_enabled').on('input', (event) => {
            setSetting('enabled', event.target.checked);
            updateStatusDisplay();
        });

        $('#name_tracker_auto_analyze').on('input', (event) => {
            setSetting('autoAnalyze', event.target.checked);
            updateStatusDisplay();
        });

        $('#name_tracker_message_frequency').on('input', (event) => {
            setSetting('messageFrequency', parseInt(event.target.value) || 10);
            updateStatusDisplay();
        });

        $('#name_tracker_llm_source').on('change', (event) => {
            setSetting('llmSource', event.target.value);
        });

        $('#name_tracker_ollama_endpoint').on('input', (event) => {
            setSetting('ollamaEndpoint', event.target.value);
        });

        $('#name_tracker_ollama_model').on('change', (event) => {
            setSetting('ollamaModel', event.target.value);
        });

        $('#name_tracker_load_models').on('click', async () => {
            try {
                await loadOllamaModels();
                notifications.success('Ollama models loaded');
            } catch (error) {
                debug.log();
                notifications.error('Failed to load Ollama models');
            }
        });

        $('#name_tracker_confidence_threshold').on('input', (event) => {
            setSetting('confidenceThreshold', parseInt(event.target.value) || 70);
        });

        // Lorebook settings handlers
        $('#name_tracker_lorebook_position').on('change', (event) => {
            setSetting('lorebookPosition', parseInt(event.target.value) || 0);
        });

        $('#name_tracker_lorebook_depth').on('input', (event) => {
            setSetting('lorebookDepth', parseInt(event.target.value) || 1);
        });

        $('#name_tracker_lorebook_cooldown').on('input', (event) => {
            setSetting('lorebookCooldown', parseInt(event.target.value) || 5);
        });

        $('#name_tracker_lorebook_probability').on('input', (event) => {
            setSetting('lorebookProbability', parseInt(event.target.value) || 100);
        });

        $('#name_tracker_lorebook_enabled').on('input', (event) => {
            setSetting('lorebookEnabled', event.target.checked);
        });

        $('#name_tracker_debug_mode').on('input', (event) => {
            setSetting('debugMode', event.target.checked);
        });

        // Action button handlers
        $('#name_tracker_manual_analyze').on('click', async () => {
            const messageFreq = getSetting('messageFrequency', 10);
            await harvestMessages(messageFreq, true);
            updateCharacterList();
            updateStatusDisplay();
        });

        $('#name_tracker_scan_all').on('click', async () => {
            await scanEntireChat();
            updateCharacterList();
            updateStatusDisplay();
        });

        $('#name_tracker_create_character').on('click', () => {
            showCreateCharacterModal();
        });

        $('#name_tracker_clear_cache').on('click', () => {
            clearProcessingQueue();
            notifications.info('Cache and processing queue cleared');
        });

        $('#name_tracker_undo_merge').on('click', async () => {
            const { undoLastMerge } = await import('./characters.js');
            const success = await undoLastMerge();
            if (success) {
                updateCharacterList();
                updateStatusDisplay();
            }
        });

        $('#name_tracker_purge_entries').on('click', () => {
            showPurgeConfirmation();
        });

        $('#name_tracker_edit_prompt').on('click', () => {
            showSystemPromptEditor();
        });

        $('#name_tracker_debug_status').on('click', () => {
            showDebugStatus();
        });

        debug.log();
    });
}

/**
 * Show debug status popup with all relevant variables
 * @returns {void}
 */
function showDebugStatus() {
    return withErrorBoundary('showDebugStatus', async () => {
        const settings = get_settings();
        const characters = getCharacters();

        // Reusable builder: compute debug info + HTML
        const buildDebugContent = async () => {
            // Get LLM context info
            let llmConfig = {};
            let maxPromptTokens = 4096;
            let contextDetails = {};
            let debugInfo;

            try {
                const { getLLMConfig, getMaxPromptLength } = await import('./llm.js');
                const { stContext } = await import('../core/context.js');

                // Force a fresh SillyTavern context read (bypass 1s cache)
                stContext.clearCache();

                llmConfig = getLLMConfig();
                maxPromptTokens = await getMaxPromptLength();

                // Get raw context info (retry briefly if not yet ready)
                let context = stContext.getContext();
                if (!context || typeof context.maxContext === 'undefined') {
                    for (let i = 0; i < 3; i++) {
                        await new Promise(r => setTimeout(r, 200));
                        stContext.clearCache();
                        context = stContext.getContext();
                        if (context && typeof context.maxContext !== 'undefined') break;
                    }
                }

                if (!context || typeof context.maxContext === 'undefined') {
                    contextDetails = {
                        totalContext: 'Not loaded yet (no chat active)',
                        maxGeneration: 'N/A',
                        maxGenerationNote: 'Context will be available after chat loads',
                        modelName: context?.main_api || 'unknown'
                    };
                } else {
                    const totalContext = context.maxContext;
                    const extensionMaxTokens = Math.min(4096, Math.floor(totalContext * 0.15));

                    contextDetails = {
                        totalContext: totalContext,
                        maxGeneration: extensionMaxTokens,
                        maxGenerationNote: 'Extension-controlled (15% of context, max 4096)',
                        modelName: context.main_api || 'unknown'
                    };
                }
            } catch (error) {
                debug.log('Could not load LLM config:', error);
                contextDetails = {
                    totalContext: 'Error loading',
                    maxGeneration: 'Error',
                    maxGenerationNote: 'Check console for details',
                    modelName: 'unknown'
                };
            }

            // Get batch size constants from processing module
            const batchConstants = {
                MIN_MESSAGES_PER_BATCH: 5,
                TARGET_MESSAGES_PER_BATCH: 30,
                MAX_MESSAGES_PER_BATCH: 50,
                CONTEXT_TARGET_PERCENT: 80,
                MIN_CONTEXT_TARGET: 50
            };

            const systemPromptTokens = 500;
            const maxGenTokens = typeof contextDetails.maxGeneration === 'number' ? contextDetails.maxGeneration : 2048;
            const safetyMargin = 500;
            const reservedTokens = systemPromptTokens + maxGenTokens + safetyMargin;
            const availableTokens = maxPromptTokens;

            // Compile debug info
            debugInfo = {
                'Extension Status': {
                    'Enabled': settings.enabled !== false,
                    'Debug Mode': settings.debugMode !== false,
                    'LLM Source': settings.llmSource || 'sillytavern',
                    'Model API': contextDetails.modelName,
                    'Tracked Characters': Object.keys(characters).length
                },
                'SillyTavern Context': {
                    'Total Context Window': contextDetails.totalContext,
                    'Extension Max Tokens': `${contextDetails.maxGeneration} (${contextDetails.maxGenerationNote})`,
                    'System Prompt Reserve': systemPromptTokens,
                    'Safety Margin': safetyMargin,
                    'Total Reserved': reservedTokens
                },
                'Usable Token Budget': {
                    'Max Prompt Tokens': maxPromptTokens,
                    'Context Target %': batchConstants.CONTEXT_TARGET_PERCENT,
                    'Tokens to Use': Math.floor(availableTokens * (batchConstants.CONTEXT_TARGET_PERCENT / 100))
                },
                'Batch Configuration': {
                    'Min Messages/Batch': batchConstants.MIN_MESSAGES_PER_BATCH,
                    'Target Messages/Batch': batchConstants.TARGET_MESSAGES_PER_BATCH,
                    'Max Messages/Batch': batchConstants.MAX_MESSAGES_PER_BATCH,
                    'Min Context Target': batchConstants.MIN_CONTEXT_TARGET
                },
                'Analysis Settings': {
                    'Message Frequency': settings.messageFrequency || 10,
                    'Auto-Analyze': settings.autoAnalyze !== false,
                    'Confidence Threshold': settings.confidenceThreshold || 70
                },
                'Lorebook Settings': {
                    'Position': ['After Char', 'Before Char', 'Top', 'Bottom'][settings.lorebookPosition || 0],
                    'Depth': settings.lorebookDepth || 1,
                    'Cooldown': settings.lorebookCooldown || 5,
                    'Probability %': settings.lorebookProbability || 100,
                    'Enabled': settings.lorebookEnabled !== false
                }
            };

            // Format for display
            let htmlContent = '<div style="font-family: monospace; font-size: 12px; max-height: 500px; overflow-y: auto;">';
            for (const [section, values] of Object.entries(debugInfo)) {
                htmlContent += `<div style="margin-bottom: 15px; border-bottom: 1px solid #666; padding-bottom: 10px;">`;
                htmlContent += `<strong style=\"color: #90EE90; font-size: 13px;\">${section}</strong><br>`;
                for (const [key, value] of Object.entries(values)) {
                    const displayValue = value === true ? '✓' : (value === false ? '✗' : value);
                    htmlContent += `<div style=\"margin-left: 10px; padding: 2px 0;\">\n                        <span style=\"color: #87CEEB;\">${key}:</span> \n                        <span style=\"color: #FFFF99;\">${displayValue}</span>\n                    </div>`;
                }
                htmlContent += '</div>';
            }
            htmlContent += '</div>';

            return { debugInfo, htmlContent };
        };

        // Initial content
        const initial = await buildDebugContent();

        // Show in modal
        const modal = $(`
            <div class=\"nametracker-modal\" style=\"
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #1a1a1a;
                border: 2px solid #90EE90;
                border-radius: 10px;
                padding: 20px;
                max-width: 550px;
                width: 90%;
                max-height: 75vh;
                overflow-y: auto;
                z-index: 9999;
                box-shadow: 0 4px 20px rgba(0,0,0,0.8);
            \">
                <h3 style=\"margin-top: 0; color: #90EE90; border-bottom: 2px solid #90EE90; padding-bottom: 10px;\">
                    <i class=\"fa-solid fa-bug\"></i> Debug Status
                </h3>
                <div id=\"nt-debug-content\">${initial.htmlContent}</div>
                <div style=\"margin-top: 20px; display: flex; gap: 8px; justify-content: flex-end; border-top: 1px solid #666; padding-top: 10px;\">
                    <button class=\"menu_button\" id=\"debug-refresh\" style=\"background: #2a2a2a; color: #FFFF99; border: 1px solid #90EE90;\">Refresh</button>
                    <button class=\"menu_button\" id=\"debug-close\" style=\"background: #2a2a2a; color: #90EE90; border: 1px solid #90EE90;\">Close</button>
                </div>
            </div>
        `);

        const overlay = $(`
            <div class="nametracker-overlay" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                z-index: 9998;
            "></div>
        `);

        $('body').append(overlay).append(modal);

        const removeModal = () => {
            modal.remove();
            overlay.remove();
        };

        modal.find('#debug-close').on('click', removeModal);
        overlay.on('click', removeModal);

        // Log initial to console
        console.log('[NT-Debug]', initial.debugInfo);

        // Refresh handler: recompute and update content in-place
        modal.find('#debug-refresh').on('click', async () => {
            try {
                const refreshed = await buildDebugContent();
                modal.find('#nt-debug-content').html(refreshed.htmlContent);
                console.log('[NT-Debug]', refreshed.debugInfo);
            } catch (e) {
                console.error('[NT-Debug] Refresh failed:', e);
            }
        });
    });
}

/**
 * Load and inject settings HTML
 * @param {string} extensionFolderPath - Path to extension folder
 * @returns {Promise<void>}
 */
export async function loadSettingsHTML(extensionFolderPath) {
    return withErrorBoundary('loadSettingsHTML', async () => {
        try {
            // Load the settings HTML
            const settingsHtml = await $.get(`${extensionFolderPath}/settings.html`);

            // Append to the extensions settings panel
            $('#extensions_settings').append(settingsHtml);

            debug.log();
        } catch (error) {
            console.error('Failed to load settings HTML:', error);
            throw new NameTrackerError(`Failed to load settings HTML: ${error.message}`);
        }
    });
}

/**
 * Update UI elements based on current settings
 * @returns {void}
 */
export function updateUI() {
    return withErrorBoundary('updateUI', () => {
        // Update all form elements with current settings
        $('#name_tracker_enabled').prop('checked', getSetting('enabled', true));
        $('#name_tracker_auto_analyze').prop('checked', getSetting('autoAnalyze', true));
        $('#name_tracker_message_frequency').val(getSetting('messageFrequency', 10));
        $('#name_tracker_llm_source').val(getSetting('llmSource', 'sillytavern'));
        $('#name_tracker_ollama_endpoint').val(getSetting('ollamaEndpoint', 'http://localhost:11434'));
        $('#name_tracker_ollama_model').val(getSetting('ollamaModel', ''));
        $('#name_tracker_confidence_threshold').val(getSetting('confidenceThreshold', 70));
        $('#name_tracker_lorebook_position').val(getSetting('lorebookPosition', 0));
        $('#name_tracker_lorebook_depth').val(getSetting('lorebookDepth', 1));
        $('#name_tracker_lorebook_cooldown').val(getSetting('lorebookCooldown', 5));
        $('#name_tracker_lorebook_probability').val(getSetting('lorebookProbability', 100));
        $('#name_tracker_lorebook_enabled').prop('checked', getSetting('lorebookEnabled', true));
        $('#name_tracker_debug_mode').prop('checked', getSetting('debugMode', false));

        // Update character list and status
        updateCharacterList();
        updateStatusDisplay();

        debug.log();
    });
}
