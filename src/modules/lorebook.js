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
import {
    get_settings, getCharacters, getCharacter, setCharacter, getLorebookConfig,
} from '../core/settings.js';
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
        debug: console.debug.bind(console, '[LOREBOOK]'),
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
    console.log('╔═══════════════════════════════════════════════════════════════════════════');
    console.log('║ [NT-Lorebook] initializeLorebook() CALLED');
    console.log('╚═══════════════════════════════════════════════════════════════════════════');

    return withErrorBoundary('initializeLorebook', async () => {
        console.log('║ [NT-Lorebook] Inside withErrorBoundary, getting context...');
        const context = stContext.getContext();
        console.log('║ [NT-Lorebook] Got context:', !!context);
        console.log('║ [NT-Lorebook] context.chatId:', context?.chatId);

        if (!context.chatId) {
            console.warn('║ [NT-Lorebook] ⚠️  NO ACTIVE CHAT - Aborting initialization');
            debug.log('No active chat, skipping lorebook initialization');
            lorebookName = null;
            return null;
        }

        console.log('║ [NT-Lorebook] Active chat detected, proceeding...');
        const METADATA_KEY = 'world_info';
        const chatMetadata = context.chatMetadata;
        console.log('║ [NT-Lorebook] chatMetadata exists?:', !!chatMetadata);

        if (!chatMetadata) {
            console.warn('║ [NT-Lorebook] ⚠️  NO CHAT METADATA - Aborting initialization');
            debug.log('No chat metadata available, skipping lorebook initialization');
            lorebookName = null;
            return null;
        }

        console.log('║ [NT-Lorebook] Checking for existing bound lorebook...');
        console.log('║ [NT-Lorebook] chatMetadata[world_info]:', chatMetadata[METADATA_KEY]);

        // Check if chat already has a bound lorebook
        if (chatMetadata[METADATA_KEY]) {
            lorebookName = chatMetadata[METADATA_KEY];
            console.log('╔═══════════════════════════════════════════════════════════════════════════');
            console.log('║ [NT-Lorebook] ✅ EXISTING LOREBOOK FOUND');
            console.log('╠═══════════════════════════════════════════════════════════════════════════');
            console.log('║ Lorebook Name:', lorebookName);
            console.log('║ Module Variable Set: YES');
            console.log('╚═══════════════════════════════════════════════════════════════════════════');
            debug.log(`Using existing chat lorebook: ${lorebookName}`);

            // Lorebook is already bound in chatMetadata - no additional selection needed
            return lorebookName;
        }

        // Create a new chat-bound lorebook name
        const bookName = `NameTracker_${context.chatId}`
            .replace(/[^a-z0-9 -]/gi, '_')
            .replace(/_{2,}/g, '_')
            .substring(0, 64);

        console.log('╔═══════════════════════════════════════════════════════════════════════════');
        console.log('║ [NT-Lorebook] 🆕 CREATING NEW LOREBOOK');
        console.log('╠═══════════════════════════════════════════════════════════════════════════');
        console.log('║ Generated Name:', bookName);
        console.log('║ Chat ID:', context.chatId);
        console.log('╚═══════════════════════════════════════════════════════════════════════════');
        debug.log(`Creating new chat lorebook: ${bookName}`);
        lorebookName = bookName;
        console.log('║ [NT-Lorebook] Module variable lorebookName SET TO:', lorebookName);

        // Bind it to the chat metadata
        chatMetadata[METADATA_KEY] = lorebookName;

        // Save chat metadata using context API
        try {
            await context.saveMetadata();
            console.log(`[NT-Lorebook] ✅ Bound lorebook to chat metadata: ${lorebookName}`);
            debug.log(`Bound lorebook to chat: ${lorebookName}`);

            // CRITICAL: Actually SELECT the lorebook so it's active for the chat
            await context.setSelectedWorldInfo(lorebookName);
            console.log(`[NT-Lorebook] ✅ Selected lorebook as active for this chat: ${lorebookName}`);

            // Ensure the lorebook file exists (create empty if needed)
            const worldInfo = await context.loadWorldInfo(lorebookName);
            if (!worldInfo) {
                console.log(`[NT-Lorebook] 📝 Creating empty lorebook file: ${lorebookName}`);
                debug.log();
                await context.saveWorldInfo(lorebookName, { entries: {} }, true);
                console.log('[NT-Lorebook] ✅ Lorebook file created successfully');
            } else {
                console.log(`[NT-Lorebook] ℹ️  Lorebook file already exists with ${Object.keys(worldInfo.entries || {}).length} entries`);
            }

            // Notify user
            notifications.info(`Chat lorebook "${lorebookName}" created and bound to this chat`, { timeOut: 5000 });
            console.log('[NT-Lorebook] 🎉 Chat lorebook initialization complete');
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
        console.log('╔════════════════════════════════════════════════════════════════');
        console.log('║ [NT-Lorebook] updateLorebookEntry CALLED');
        console.log('╠════════════════════════════════════════════════════════════════');
        console.log('║ CRITICAL: Checking lorebookName variable');
        console.log('║ lorebookName value:', lorebookName);
        console.log('║ lorebookName type:', typeof lorebookName);
        console.log('║ lorebookName is null?:', lorebookName === null);
        console.log('║ lorebookName is undefined?:', lorebookName === undefined);
        console.log('║ lorebookName is falsy?:', !lorebookName);
        console.log('╚════════════════════════════════════════════════════════════════');

        if (!lorebookName) {
            console.error('╔════════════════════════════════════════════════════════════════');
            console.error('║ [NT-Lorebook] ❌ CRITICAL ERROR: NO LOREBOOK INITIALIZED!');
            console.error('╠════════════════════════════════════════════════════════════════');
            console.error('║ lorebookName is:', lorebookName);
            console.error('║ Character:', characterName);
            console.error('║ SKIPPING LOREBOOK ENTRY UPDATE');
            console.error('╚════════════════════════════════════════════════════════════════');
            debug.log('No lorebook initialized, skipping entry update');
            return;
        }

        console.log('╔════════════════════════════════════════════════════════════════');
        console.log('║ [NT-Lorebook] ✅ Lorebook IS initialized');
        console.log('╠════════════════════════════════════════════════════════════════');
        console.log('║ Character Name:', characterName);
        console.log('║ Character Object:', JSON.stringify(character, null, 2));
        console.log('║ Has lorebookEntryId?:', !!character.lorebookEntryId);
        console.log('║ Existing Entry ID:', character.lorebookEntryId || 'NONE');
        console.log('╚════════════════════════════════════════════════════════════════');

        debug.log(`updateLorebookEntry called for: ${characterName}`);
        debug.log('  Character data:', character);

        const context = stContext.getContext();
        const lorebookConfig = getLorebookConfig();

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
            contentParts.push(`\n**Physical Description:**\n${character.physical}`);
        }

        // Personality (consolidated traits, likes, dislikes)
        if (character.personality) {
            contentParts.push(`\n**Personality:**\n${character.personality}`);
        }

        // Sexuality
        if (character.sexuality) {
            contentParts.push(`\n**Sexuality:**\n${character.sexuality}`);
        }

        // Race/Ethnicity
        if (character.raceEthnicity) {
            contentParts.push(`**Race/Ethnicity:** ${character.raceEthnicity}`);
        }

        // Role & Skills
        if (character.roleSkills) {
            contentParts.push(`\n**Role & Skills:**\n${character.roleSkills}`);
        }

        // Relationships
        if (character.relationships && character.relationships.length > 0) {
            contentParts.push('\n**Relationships:**');
            character.relationships.forEach(rel => {
                contentParts.push(`- ${rel}`);
            });
        }

        const content = contentParts.join('\n');

        // Build the keys array (name + aliases)
        const keys = [character.preferredName];
        if (character.aliases) {
            keys.push(...character.aliases);
        }

        // Load the world info to check if entry exists
        let worldInfo = await context.loadWorldInfo(lorebookName);

        if (!worldInfo) {
            debug.log();
            // Match SillyTavern's world info structure
            worldInfo = {
                entries: {},
            };
        }

        // Clean up orphaned entries for this character
        // Remove any entries that match this character's name/aliases but aren't the current entry ID
        console.log(`[NT-Lorebook] 🧹 Cleaning up orphaned entries for: ${characterName}`);
        const orphanedUids = [];
        for (const [uid, entry] of Object.entries(worldInfo.entries)) {
            if (!entry.key || !Array.isArray(entry.key)) continue;

            // Check if any of this entry's keys match our character's primary name or aliases
            const hasMatchingKey = entry.key.some(k =>
                k.toLowerCase() === characterName.toLowerCase() ||
                (character.aliases && character.aliases.some(alias =>
                    k.toLowerCase() === alias.toLowerCase(),
                )),
            );

            // If this entry has matching keys but isn't our current entry, mark it for removal
            if (hasMatchingKey && uid !== character.lorebookEntryId) {
                console.log(`[NT-Lorebook]    Removing orphaned entry: ${uid} (keys: ${entry.key.join(', ')})`);
                orphanedUids.push(uid);
            }
        }

        // Remove orphaned entries
        for (const uid of orphanedUids) {
            delete worldInfo.entries[uid];
        }

        if (orphanedUids.length > 0) {
            console.log(`[NT-Lorebook] ✅ Removed ${orphanedUids.length} orphaned entries`);
        }

        // Calculate dynamic cooldown
        const messageFreq = get_settings('messageFrequency', 10);
        const calculatedCooldown = Math.max(1, Math.floor(messageFreq * 0.75));


        let existingUid = null;

        // Check if this character already has a lorebook entry
        if (character.lorebookEntryId && worldInfo.entries && worldInfo.entries[character.lorebookEntryId]) {
            // Update existing entry
            existingUid = character.lorebookEntryId;
            const existingEntry = worldInfo.entries[existingUid];

            console.log(`[NT-Lorebook] 🔄 Updating existing entry for: ${characterName}`);
            console.log(`[NT-Lorebook]    Entry UID: ${existingUid}`);
            console.log(`[NT-Lorebook]    Keys: ${keys.join(', ')}`);
            console.log(`[NT-Lorebook]    Content length: ${content.length} chars`);

            existingEntry.key = keys;
            existingEntry.content = content;
            existingEntry.enabled = lorebookConfig.enabled;
            existingEntry.position = lorebookConfig.position;
            existingEntry.probability = lorebookConfig.probability;
            existingEntry.depth = lorebookConfig.depth;
            existingEntry.scanDepth = lorebookConfig.scanDepth;
            existingEntry.cooldown = calculatedCooldown;

            debug.log();
        } else {
            // Create new entry
            const newUid = generateUID();

            console.log('╔════════════════════════════════════════════════════════════════');
            console.log('║ [NT-Lorebook] CREATING NEW ENTRY');
            console.log('╠════════════════════════════════════════════════════════════════');
            console.log('║ Character Name:', characterName);
            console.log('║ Generated UID:', newUid);
            console.log('║ Keys Array:', JSON.stringify(keys));
            console.log('║ Content Preview:', content.substring(0, 200) + '...');
            console.log('║ Content Length:', content.length, 'characters');
            console.log('╚════════════════════════════════════════════════════════════════');

            const newEntry = {
                uid: newUid,
                key: keys,
                keysecondary: [],
                comment: character.preferredName,
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

            console.log(`[NT-Lorebook] 🆕 Creating new entry for: ${characterName}`);
            console.log(`[NT-Lorebook]    Entry UID: ${newUid}`);
            console.log(`[NT-Lorebook]    Keys: ${keys.join(', ')}`);
            console.log(`[NT-Lorebook]    Content length: ${content.length} chars`);
            console.log(`[NT-Lorebook]    Enabled: ${lorebookConfig.enabled}`);
            console.log(`[NT-Lorebook]    Position: ${lorebookConfig.position}`);

            // Save the character with the new lorebook entry ID
            console.log('╔════════════════════════════════════════════════════════════════');
            console.log('║ [NT-Lorebook] SAVING CHARACTER WITH ENTRY ID');
            console.log('╠════════════════════════════════════════════════════════════════');
            console.log('║ Character Name:', characterName);
            console.log('║ Character Object BEFORE save:', JSON.stringify(character, null, 2));
            console.log('║ Lorebook Entry ID:', newUid);
            console.log('╚════════════════════════════════════════════════════════════════');

            await setCharacter(characterName, character);

            console.log('╔════════════════════════════════════════════════════════════════');
            console.log('║ [NT-Lorebook] CHARACTER SAVE COMPLETE');
            console.log('╠════════════════════════════════════════════════════════════════');
            console.log('║ Character Name:', characterName);
            console.log('║ Entry ID Saved:', character.lorebookEntryId);
            console.log('╚════════════════════════════════════════════════════════════════');

            debug.log();
        }

        // Save the lorebook
        try {
            console.log('╔════════════════════════════════════════════════════════════════');
            console.log('║ [NT-Lorebook] SAVING LOREBOOK TO DISK');
            console.log('╠════════════════════════════════════════════════════════════════');
            console.log('║ Lorebook Name:', lorebookName);
            console.log('║ Total Entries:', Object.keys(worldInfo.entries).length);
            console.log('║ Entry UIDs:', Object.keys(worldInfo.entries));
            console.log('║ WorldInfo Structure:', JSON.stringify({
                entryCount: Object.keys(worldInfo.entries).length,
                entryKeys: Object.keys(worldInfo.entries),
                sampleEntry: Object.values(worldInfo.entries)[0] ? {
                    uid: Object.values(worldInfo.entries)[0].uid,
                    key: Object.values(worldInfo.entries)[0].key,
                    contentLength: Object.values(worldInfo.entries)[0].content.length,
                } : 'NONE',
            }, null, 2));
            console.log('╚════════════════════════════════════════════════════════════════');

            await context.saveWorldInfo(lorebookName, worldInfo, true);

            console.log('╔════════════════════════════════════════════════════════════════');
            console.log('║ [NT-Lorebook] LOREBOOK SAVE COMPLETE');
            console.log('╠════════════════════════════════════════════════════════════════');
            console.log('║ Lorebook Name:', lorebookName);
            console.log('║ Save Successful: YES');
            console.log('╚════════════════════════════════════════════════════════════════');

            // Verify the save worked by reloading
            console.log('╔════════════════════════════════════════════════════════════════');
            console.log('║ [NT-Lorebook] VERIFYING LOREBOOK SAVE');
            console.log('╠════════════════════════════════════════════════════════════════');
            console.log('║ Reloading:', lorebookName);
            console.log('╚════════════════════════════════════════════════════════════════');

            const verifyWorldInfo = await context.loadWorldInfo(lorebookName);
            const targetUid = existingUid || character.lorebookEntryId;

            console.log('╔════════════════════════════════════════════════════════════════');
            console.log('║ [NT-Lorebook] VERIFICATION RESULTS');
            console.log('╠════════════════════════════════════════════════════════════════');
            console.log('║ Target UID:', targetUid);
            console.log('║ Verification Data Loaded?:', !!verifyWorldInfo);
            console.log('║ Has Entries Object?:', !!verifyWorldInfo?.entries);
            console.log('║ Available Entry UIDs:', Object.keys(verifyWorldInfo?.entries || {}));
            console.log('║ Target Entry Found?:', !!(verifyWorldInfo?.entries?.[targetUid]));

            if (verifyWorldInfo && verifyWorldInfo.entries && verifyWorldInfo.entries[targetUid]) {
                console.log('║ ✅ VERIFICATION: SUCCESS');
                console.log('║ Entry Data:', JSON.stringify({
                    uid: verifyWorldInfo.entries[targetUid].uid,
                    key: verifyWorldInfo.entries[targetUid].key,
                    enabled: verifyWorldInfo.entries[targetUid].enabled,
                    contentLength: verifyWorldInfo.entries[targetUid].content.length,
                }, null, 2));
                console.log('╚════════════════════════════════════════════════════════════════');
                debug.log();
            } else {
                console.log('║ ❌ VERIFICATION: FAILED');
                console.log('║ Entry NOT found in reloaded lorebook!');
                console.log('╚════════════════════════════════════════════════════════════════');
                console.error('[NT-Lorebook] ❌ WARNING: Lorebook verification failed - entries may not have been saved!');
                console.error('[NT-Lorebook]    Target UID:', targetUid);
                console.error('[NT-Lorebook]    Available entries:', Object.keys(verifyWorldInfo?.entries || {}));
                console.error('[Name Tracker] WARNING: Lorebook verification failed - entries may not have been saved!');
            }

            debug.log();
        } catch (error) {
            console.error('[NT-Lorebook] ❌ Error saving lorebook:', error);
            console.error('[NT-Lorebook]    Lorebook name:', lorebookName);
            console.error('[NT-Lorebook]    Error details:', error.message);
            console.error('[Name Tracker] Error saving lorebook:', error);
            debug.log();
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
        const character = getCharacter(characterName);

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
            debug.log();
            return false;
        }

        const context = stContext.getContext();

        try {
            const worldInfo = await context.loadWorldInfo(lorebookName);
            if (worldInfo && worldInfo.entries && worldInfo.entries[character.lorebookEntryId]) {
                delete worldInfo.entries[character.lorebookEntryId];
                await context.saveWorldInfo(lorebookName, worldInfo, true);

                debug.log();
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
            debug.log();
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
                        debug.log();
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
            debug.log();
            return 0;
        }

        const context = stContext.getContext();
        let adoptedCount = 0;

        try {
            const worldInfo = await context.loadWorldInfo(lorebookName);

            if (!worldInfo || !worldInfo.entries) {
                debug.log();
                return 0;
            }

            const characters = getCharacters();

            // Look for entries that might belong to our extension
            for (const [entryId, entry] of Object.entries(worldInfo.entries)) {
                if (!entry.key || !Array.isArray(entry.key) || entry.key.length === 0) {
                    continue;
                }

                const primaryName = entry.key[0];

                // Check if this entry represents a character we should track
                const managedByExtension = entry.comment?.includes('Auto-generated entry for')
                    || entry.comment === primaryName
                    || entry.comment === `Auto-generated entry for ${primaryName}`;

                if (!characters[primaryName] && managedByExtension) {
                    // Try to parse the content to recreate character data
                    const character = {
                        preferredName: primaryName,
                        aliases: entry.key.slice(1),
                        physical: '',
                        personality: '',
                        sexuality: '',
                        raceEthnicity: '',
                        roleSkills: '',
                        relationships: [],
                        ignored: false,
                        confidence: 50,
                        lorebookEntryId: entryId,
                        lastUpdated: Date.now(),
                        isMainChar: false,
                    };

                    // Store the adopted character
                    setCharacter(primaryName, character);
                    adoptedCount++;

                    debug.log();
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
    debug.log();
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
            const characters = getCharacters();

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
