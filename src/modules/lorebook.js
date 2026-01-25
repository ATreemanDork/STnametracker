/**
 * Lorebook Management Module
 *
 * Handles chat-level lorebook creation, entry formatting, and SillyTavern integration
 * for the Name Tracker extension.
 */

// Early debugging
console.log('[LOREBOOK] Starting module load...');

import { createModuleLogger } from '../core/debug.js';
import { withErrorBoundary, NameTrackerError } from '../core/errors.js';
import { settings } from '../core/settings.js';
import { stContext } from '../core/context.js';
import { generateUID } from '../utils/helpers.js';
import { NotificationManager } from '../utils/notifications.js';

// Post-import debugging
console.log('[LOREBOOK] Imports completed. Types:');
console.log('[LOREBOOK] createModuleLogger:', typeof createModuleLogger);
console.log('[LOREBOOK] withErrorBoundary:', typeof withErrorBoundary);
console.log('[LOREBOOK] NameTrackerError:', typeof NameTrackerError);

// Try to create debug logger with explicit error handling
let debug;
try {
    console.log('[LOREBOOK] About to call createModuleLogger...');
    debug = createModuleLogger('lorebook');
    console.log('[LOREBOOK] Debug logger created successfully:', debug);
} catch (error) {
    console.error('[LOREBOOK] Failed to create debug logger:', error);
    console.error('[LOREBOOK] Error stack:', error.stack);
    // Create fallback logger
    debug = {
        log: console.log.bind(console, '[LOREBOOK]'),
        error: console.error.bind(console, '[LOREBOOK]'),
        warn: console.warn.bind(console, '[LOREBOOK]'),
        debug: console.debug.bind(console, '[LOREBOOK]')
    };
}
const notifications = new NotificationManager('Lorebook Management');

// Lorebook state
let lorebookName = null;

/**
 * Initialize or get the lorebook for this chat
 * @returns {Promise<string|null>} Lorebook name if successful, null if no chat
 */
export async function initializeLorebook() {
    return withErrorBoundary('initializeLorebook', async () => {
        const context = stContext.getContext();

        if (!context.chatId) {
            debug('No active chat, skipping lorebook initialization');
            lorebookName = null;
            return null;
        }

        const METADATA_KEY = 'world_info';
        const chatMetadata = context.chatMetadata;

        if (!chatMetadata) {
            debug('No chat metadata available, skipping lorebook initialization');
            lorebookName = null;
            return null;
        }

        // Check if chat already has a bound lorebook
        if (chatMetadata[METADATA_KEY]) {
            lorebookName = chatMetadata[METADATA_KEY];
            debug(`Using existing chat lorebook: ${lorebookName}`);
            return lorebookName;
        }

        // Create a new chat-bound lorebook name
        const bookName = `NameTracker_${context.chatId}`
            .replace(/[^a-z0-9 -]/gi, '_')
            .replace(/_{2,}/g, '_')
            .substring(0, 64);

        debug(`Creating new chat lorebook: ${bookName}`);
        lorebookName = bookName;

        // Bind it to the chat metadata
        chatMetadata[METADATA_KEY] = lorebookName;

        // Save chat metadata using context API
        try {
            await context.saveMetadata();
            debug(`Bound lorebook to chat: ${lorebookName}`);

            // Ensure the lorebook file exists (create empty if needed)
            const worldInfo = await context.loadWorldInfo(lorebookName);
            if (!worldInfo) {
                debug(`Creating initial empty lorebook file: ${lorebookName}`);
                await context.saveWorldInfo(lorebookName, { entries: {} }, true);
            }

            // Notify user
            notifications.info(`Chat lorebook "${lorebookName}" created and bound to this chat`, { timeOut: 5000 });
        } catch (error) {
            console.error('Failed to initialize lorebook:', error);
            lorebookName = null;
            throw new NameTrackerError(`Failed to initialize lorebook: ${error.message}`);
        }

        return lorebookName;
    });
}

/**
 * Update or create lorebook entry for a character
 * @param {Object} character - Character data
 * @param {string} characterName - Character name
 * @returns {Promise<void>}
 */
export async function updateLorebookEntry(character, characterName) {
    return withErrorBoundary('updateLorebookEntry', async () => {
        debug(`updateLorebookEntry called for: ${characterName}`);
        debug('  Character data:', character);

        if (!lorebookName) {
            debug('No lorebook initialized, skipping entry update');
            return;
        }

        const context = stContext.getContext();
        const lorebookConfig = settings.getLorebookConfig();

        // Build the entry content in a readable format
        const contentParts = [];

        // Physical Age / Mental Age
        if (character.physicalAge || character.mentalAge) {
            const ageInfo = [];
            if (character.physicalAge) ageInfo.push(`Physical: ${character.physicalAge}`);
            if (character.mentalAge) ageInfo.push(`Mental: ${character.mentalAge}`);
            contentParts.push(`**Age:** ${ageInfo.join(', ')}`);
        }

        // Physical (consolidated body description)
        if (character.physical) {
            contentParts.push(`\\n**Physical Description:**\\n${character.physical}`);
        }

        // Personality (consolidated traits, likes, dislikes)
        if (character.personality) {
            contentParts.push(`\\n**Personality:**\\n${character.personality}`);
        }

        // Sexuality
        if (character.sexuality) {
            contentParts.push(`\\n**Sexuality:**\\n${character.sexuality}`);
        }

        // Race/Ethnicity
        if (character.raceEthnicity) {
            contentParts.push(`**Race/Ethnicity:** ${character.raceEthnicity}`);
        }

        // Role & Skills
        if (character.roleSkills) {
            contentParts.push(`\\n**Role & Skills:**\\n${character.roleSkills}`);
        }

        // Last Interaction
        if (character.lastInteraction) {
            contentParts.push(`\\n**Last Interaction with {{user}}:**\\n${character.lastInteraction}`);
        }

        // Relationships
        if (character.relationships && character.relationships.length > 0) {
            contentParts.push('\\n**Relationships:**');
            character.relationships.forEach(rel => {
                contentParts.push(`- ${rel}`);
            });
        }

        const content = contentParts.join('\\n');

        // Build the keys array (name + aliases)
        const keys = [character.preferredName];
        if (character.aliases) {
            keys.push(...character.aliases);
        }

        // Load the world info to check if entry exists
        let worldInfo = await context.loadWorldInfo(lorebookName);

        if (!worldInfo) {
            debug(`WARNING: Could not load lorebook ${lorebookName}. Creating new lorebook structure.`);
            // Match SillyTavern's world info structure
            worldInfo = {
                entries: {},
            };
        }

        // Calculate dynamic cooldown
        const messageFreq = settings.getSetting('messageFrequency', 10);
        const calculatedCooldown = Math.max(1, Math.floor(messageFreq * 0.75));

        let existingUid = null;

        // Check if this character already has a lorebook entry
        if (character.lorebookEntryId && worldInfo.entries && worldInfo.entries[character.lorebookEntryId]) {
            // Update existing entry
            existingUid = character.lorebookEntryId;
            const existingEntry = worldInfo.entries[existingUid];

            existingEntry.key = keys;
            existingEntry.content = content;
            existingEntry.enabled = lorebookConfig.enabled;
            existingEntry.position = lorebookConfig.position;
            existingEntry.probability = lorebookConfig.probability;
            existingEntry.depth = lorebookConfig.depth;
            existingEntry.scanDepth = lorebookConfig.scanDepth;
            existingEntry.cooldown = calculatedCooldown;

            debug(`Updated existing lorebook entry ${existingUid} for ${characterName}`);
        } else {
            // Create new entry
            const newUid = generateUID();

            const newEntry = {
                uid: newUid,
                key: keys,
                keysecondary: [],
                comment: `Auto-generated entry for ${character.preferredName}`,
                content: content,
                constant: false,
                selective: true,
                contextConfig: {
                    prefix: '',
                    suffix: '',
                    tokenBudget: 0,
                    reservedTokens: 0,
                    budgetPriority: 400,
                    trimDirection: 'doNotTrim',
                    insertionOrder: 0,
                    maximumTrimType: 'sentence',
                    insertionPosition: 'before',
                },
                enabled: lorebookConfig.enabled,
                position: lorebookConfig.position,
                excludeRecursion: false,
                preventRecursion: false,
                delayUntilRecursion: false,
                probability: lorebookConfig.probability,
                useProbability: true,
                depth: lorebookConfig.depth,
                selectiveLogic: 0,
                group: '',
                scanDepth: lorebookConfig.scanDepth,
                caseSensitive: null,
                matchWholeWords: null,
                useGroupScoring: null,
                automationId: '',
                role: 0,
                vectorized: false,
                sticky: 0,
                cooldown: calculatedCooldown,
                delay: 0,
            };

            // World info entries are stored as an object with UID as key
            worldInfo.entries[newUid] = newEntry;
            character.lorebookEntryId = newUid;

            debug(`Created new lorebook entry ${newUid} for ${characterName}`);
        }

        // Save the lorebook
        try {
            await context.saveWorldInfo(lorebookName, worldInfo, true);

            // Verify the save worked by reloading
            const verifyWorldInfo = await context.loadWorldInfo(lorebookName);
            const targetUid = existingUid || character.lorebookEntryId;

            if (verifyWorldInfo && verifyWorldInfo.entries && verifyWorldInfo.entries[targetUid]) {
                debug(`Verified lorebook entry ${targetUid} was saved successfully`);
            } else {
                console.error('[Name Tracker] WARNING: Lorebook verification failed - entries may not have been saved!');
            }

            debug(`Saved lorebook: ${lorebookName}`);
        } catch (error) {
            console.error('[Name Tracker] Error saving lorebook:', error);
            debug(`Failed to save lorebook: ${error.message}`);
            throw error; // Re-throw so caller knows it failed
        }
    });
}

/**
 * Create lorebook content from character data (JSON format)
 * @param {Object} character - Character data
 * @returns {string} JSON string representation
 */
export function createLorebookContent(character) {
    return withErrorBoundary('createLorebookContent', () => {
        const content = {
            name: character.preferredName,
            aliases: character.aliases,
            physical: character.physical,
            mental: character.mental,
            relationships: character.relationships,
        };

        return JSON.stringify(content, null, 2);
    });
}

/**
 * View character in lorebook editor
 * @param {string} characterName - Name of character to view
 * @returns {Promise<void>}
 */
export async function viewInLorebook(characterName) {
    return withErrorBoundary('viewInLorebook', async () => {
        const character = settings.getCharacter(characterName);

        if (!character) {
            throw new NameTrackerError('Character not found');
        }

        if (!lorebookName) {
            notifications.warning('No active chat or lorebook');
            return;
        }

        // Import the openWorldInfoEditor function from SillyTavern
        const context = stContext.getContext();

        // Open the lorebook editor
        if (typeof context.openWorldInfoEditor === 'function') {
            await context.openWorldInfoEditor(lorebookName);
            notifications.success(`Opened lorebook for ${characterName}`);
        } else {
            // Fallback: show the world info panel if openWorldInfoEditor doesn't exist
            $('#WorldInfo').click();
            notifications.info(`Please select "${lorebookName}" from the World Info panel`);
        }
    });
}

/**
 * Delete a character's lorebook entry
 * @param {Object} character - Character data
 * @returns {Promise<boolean>} True if deleted successfully
 */
export async function deleteLorebookEntry(character) {
    return withErrorBoundary('deleteLorebookEntry', async () => {
        if (!lorebookName || !character.lorebookEntryId) {
            debug('No lorebook or entry ID to delete');
            return false;
        }

        const context = stContext.getContext();

        try {
            const worldInfo = await context.loadWorldInfo(lorebookName);
            if (worldInfo && worldInfo.entries && worldInfo.entries[character.lorebookEntryId]) {
                delete worldInfo.entries[character.lorebookEntryId];
                await context.saveWorldInfo(lorebookName, worldInfo, true);

                debug(`Deleted lorebook entry ${character.lorebookEntryId} for ${character.preferredName}`);
                return true;
            }
        } catch (error) {
            console.error('Error deleting lorebook entry:', error);
            return false;
        }

        return false;
    });
}

/**
 * Purge all tracked character entries from lorebook
 * @param {Array} characters - Array of character objects to purge
 * @returns {Promise<number>} Number of entries deleted
 */
export async function purgeLorebookEntries(characters) {
    return withErrorBoundary('purgeLorebookEntries', async () => {
        if (!lorebookName) {
            debug('No active lorebook');
            return 0;
        }

        const context = stContext.getContext();
        let deletedCount = 0;

        try {
            const worldInfo = await context.loadWorldInfo(lorebookName);

            if (worldInfo && worldInfo.entries) {
                // Get all entry IDs from our tracked characters
                const entryIds = characters
                    .map(char => char.lorebookEntryId)
                    .filter(id => id !== undefined && id !== null);

                // Delete each entry
                for (const entryId of entryIds) {
                    if (worldInfo.entries[entryId]) {
                        delete worldInfo.entries[entryId];
                        deletedCount++;
                        debug(`Deleted lorebook entry ${entryId}`);
                    }
                }

                // Save the lorebook
                await context.saveWorldInfo(lorebookName, worldInfo, true);
            }
        } catch (error) {
            console.error('Error purging lorebook entries:', error);
            throw new NameTrackerError(`Failed to purge lorebook entries: ${error.message}`);
        }

        return deletedCount;
    });
}

/**
 * Adopt existing lorebook entries into character cache
 * This allows manual entries or previous data to be imported
 * @returns {Promise<number>} Number of entries adopted
 */
export async function adoptExistingEntries() {
    return withErrorBoundary('adoptExistingEntries', async () => {
        if (!lorebookName) {
            debug('No active lorebook for adoption');
            return 0;
        }

        const context = stContext.getContext();
        let adoptedCount = 0;

        try {
            const worldInfo = await context.loadWorldInfo(lorebookName);

            if (!worldInfo || !worldInfo.entries) {
                debug('No lorebook entries to adopt');
                return 0;
            }

            const characters = settings.getCharacters();

            // Look for entries that might belong to our extension
            for (const [entryId, entry] of Object.entries(worldInfo.entries)) {
                if (!entry.key || !Array.isArray(entry.key) || entry.key.length === 0) {
                    continue;
                }

                const primaryName = entry.key[0];

                // Check if this entry represents a character we should track
                if (!characters[primaryName] && entry.comment?.includes('Auto-generated entry for')) {
                    // Try to parse the content to recreate character data
                    const character = {
                        preferredName: primaryName,
                        aliases: entry.key.slice(1),
                        physical: '',
                        personality: '',
                        sexuality: '',
                        raceEthnicity: '',
                        roleSkills: '',
                        lastInteraction: '',
                        relationships: [],
                        ignored: false,
                        confidence: 50,
                        lorebookEntryId: entryId,
                        lastUpdated: Date.now(),
                        isMainChar: false,
                    };

                    // Store the adopted character
                    settings.setCharacter(primaryName, character);
                    adoptedCount++;

                    debug(`Adopted existing lorebook entry for: ${primaryName}`);
                }
            }

            if (adoptedCount > 0) {
                notifications.success(`Adopted ${adoptedCount} existing lorebook entries`);
            }

        } catch (error) {
            console.error('Error adopting existing entries:', error);
            throw new NameTrackerError(`Failed to adopt existing entries: ${error.message}`);
        }

        return adoptedCount;
    });
}

/**
 * Get the current lorebook name
 * @returns {string|null} Current lorebook name
 */
export function getCurrentLorebookName() {
    return lorebookName;
}

/**
 * Reset lorebook state (called on chat change)
 */
export function resetLorebookState() {
    lorebookName = null;
    debug('Lorebook state reset');
}

/**
 * Get lorebook statistics
 * @returns {Promise<Object>} Lorebook statistics
 */
export async function getLorebookStats() {
    return withErrorBoundary('getLorebookStats', async () => {
        if (!lorebookName) {
            return {
                name: null,
                entryCount: 0,
                trackedEntries: 0,
                orphanedEntries: 0,
            };
        }

        const context = stContext.getContext();

        try {
            const worldInfo = await context.loadWorldInfo(lorebookName);
            const characters = settings.getCharacters();

            if (!worldInfo || !worldInfo.entries) {
                return {
                    name: lorebookName,
                    entryCount: 0,
                    trackedEntries: 0,
                    orphanedEntries: 0,
                };
            }

            const totalEntries = Object.keys(worldInfo.entries).length;
            const trackedIds = Object.values(characters)
                .map(char => char.lorebookEntryId)
                .filter(id => id);
            const trackedEntries = trackedIds.length;
            const orphanedEntries = totalEntries - trackedEntries;

            return {
                name: lorebookName,
                entryCount: totalEntries,
                trackedEntries,
                orphanedEntries,
            };
        } catch (error) {
            console.error('Error getting lorebook stats:', error);
            return {
                name: lorebookName,
                entryCount: 0,
                trackedEntries: 0,
                orphanedEntries: 0,
                error: error.message,
            };
        }
    });
}
