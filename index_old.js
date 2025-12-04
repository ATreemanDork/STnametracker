// Name Tracker Extension for SillyTavern
// Tracks character details and manages chat-level lorebook entries

import { extension_settings, getContext } from "../../../extensions.js";
import { saveSettingsDebounced, generateRaw } from "../../../../script.js";
import { eventSource, event_types, chat, chat_metadata } from "../../../../script.js";
import { loadWorldInfo, saveWorldInfo, createWorldInfoEntry } from "../../../../world-info.js";
import { getStringHash } from "../../../../utils.js";

// Extension constants
const extensionName = "STnametracker";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;

// Default settings
const defaultSettings = {
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
    characters: {}, // character data indexed by preferred name
    messageCounter: 0,
    lastHarvestMessage: 0
};

// Session-level caches (cleared on chat change)
let analysisCache = new Map(); // Cache for LLM analysis results
let processingQueue = [];
let isProcessing = false;
let undoHistory = []; // Stores last 3 merge operations

// Lorebook name for this chat
let lorebookName = null;

/**
 * Load extension settings from storage or initialize with defaults
 */
async function loadSettings() {
    extension_settings[extensionName] = extension_settings[extensionName] || {};
    if (Object.keys(extension_settings[extensionName]).length === 0) {
        Object.assign(extension_settings[extensionName], defaultSettings);
    }

    // Update UI with current settings
    $("#name_tracker_enabled").prop("checked", extension_settings[extensionName].enabled).trigger("input");
    $("#name_tracker_auto_refresh").prop("checked", extension_settings[extensionName].autoRefresh).trigger("input");
    
    // Refresh the names list display
    updateNamesList();
}

/**
 * Get the current extension settings
 * @returns {Object} Current extension settings
 */
function getSettings() {
    return extension_settings[extensionName];
}

/**
 * Handle enabled checkbox change
 * @param {Event} event - Input event
 */
function onEnabledChange(event) {
    const value = Boolean($(event.target).prop("checked"));
    extension_settings[extensionName].enabled = value;
    saveSettingsDebounced();
    
    if (value) {
        toastr.info("Name tracking enabled");
    } else {
        toastr.info("Name tracking disabled");
    }
}

/**
 * Handle auto-refresh checkbox change
 * @param {Event} event - Input event
 */
function onAutoRefreshChange(event) {
    const value = Boolean($(event.target).prop("checked"));
    extension_settings[extensionName].autoRefresh = value;
    saveSettingsDebounced();
}

/**
 * Extract names from a message text
 * This uses a simple heuristic to find capitalized words that might be names
 * @param {string} text - Message text to analyze
 * @returns {string[]} Array of potential names found
 */
function extractNamesFromText(text) {
    if (!text) return [];
    
    // Pattern to find capitalized words that might be names
    // Matches words starting with uppercase, followed by lowercase letters
    // Also handles names with apostrophes (O'Brien) and hyphens (Mary-Jane)
    const namePattern = /\b([A-Z][a-z]{2,}(?:[-'][A-Z]?[a-z]+)*)\b/g;
    const matches = text.match(namePattern) || [];
    
    return matches.filter(name => !COMMON_WORDS.includes(name));
}

/**
 * Scan all chat messages and extract names
 */
function scanChatForNames() {
    const settings = getSettings();
    if (!settings.enabled) return;
    
    const context = getContext();
    if (!context.chat || context.chat.length === 0) {
        return;
    }
    
    const namesCount = {};
    
    // Scan through all chat messages
    for (const message of context.chat) {
        if (message.mes) {
            const names = extractNamesFromText(message.mes);
            for (const name of names) {
                namesCount[name] = (namesCount[name] || 0) + 1;
            }
        }
    }
    
    // Also ensure the current character name is tracked if available
    if (context.characterId !== undefined && context.characters) {
        const character = context.characters[context.characterId];
        if (character && character.name) {
            // Only add to the list if not already present; don't override existing count
            if (namesCount[character.name] === undefined) {
                namesCount[character.name] = 0;
            }
        }
    }
    
    // Update settings with tracked names
    extension_settings[extensionName].trackedNames = namesCount;
    saveSettingsDebounced();
    
    updateNamesList();
}

/**
 * Update the names list UI
 */
function updateNamesList() {
    const settings = getSettings();
    const trackedNames = settings.trackedNames || {};
    const listContainer = $("#name_tracker_list");
    
    listContainer.empty();
    
    const nameEntries = Object.entries(trackedNames);
    if (nameEntries.length === 0) {
        listContainer.append('<div class="name-tracker-empty">No names tracked yet</div>');
        return;
    }
    
    // Sort by count (descending)
    nameEntries.sort((a, b) => b[1] - a[1]);
    
    for (const [name, count] of nameEntries) {
        const item = $(`
            <div class="name-tracker-item">
                <span class="name-tracker-name">${escapeHtml(name)}</span>
                <span class="name-tracker-count">${count} mention${count !== 1 ? 's' : ''}</span>
            </div>
        `);
        listContainer.append(item);
    }
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Handle refresh button click
 */
function onRefreshClick() {
    scanChatForNames();
    toastr.success("Names list refreshed");
}

/**
 * Handle clear button click
 */
function onClearClick() {
    extension_settings[extensionName].trackedNames = {};
    saveSettingsDebounced();
    updateNamesList();
    toastr.info("Tracked names cleared");
}

/**
 * Handle new message event
 * @param {number} messageId - ID of the new message
 */
function onMessageReceived(messageId) {
    const settings = getSettings();
    if (settings.enabled && settings.autoRefresh) {
        scanChatForNames();
    }
}

/**
 * Handle chat changed event
 */
function onChatChanged() {
    const settings = getSettings();
    if (settings.enabled) {
        // Delay slightly to ensure chat is loaded
        setTimeout(() => {
            scanChatForNames();
        }, 100);
    }
}

// Initialize extension when jQuery is ready
jQuery(async () => {
    // Load the settings HTML
    const settingsHtml = await $.get(`${extensionFolderPath}/settings.html`);
    
    // Append to the extensions settings panel
    $("#extensions_settings").append(settingsHtml);
    
    // Set up event listeners for UI elements
    $("#name_tracker_enabled").on("input", onEnabledChange);
    $("#name_tracker_auto_refresh").on("input", onAutoRefreshChange);
    $("#name_tracker_refresh").on("click", onRefreshClick);
    $("#name_tracker_clear").on("click", onClearClick);
    
    // Subscribe to SillyTavern events
    eventSource.on(event_types.MESSAGE_RECEIVED, onMessageReceived);
    eventSource.on(event_types.MESSAGE_SENT, onMessageReceived);
    eventSource.on(event_types.CHAT_CHANGED, onChatChanged);
    
    // Load settings
    await loadSettings();
    
    console.log("Name Tracker extension loaded");
});
