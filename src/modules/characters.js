/**
 * Character Management Module
 *
 * Handles character CRUD operations, merging, alias detection, and relationship management
 * for the Name Tracker extension.
 */

import { updateLorebookEntry } from './lorebook.js';
import { createModuleLogger } from '../core/debug.js';
import { withErrorBoundary, NameTrackerError } from '../core/errors.js';
import { 
    getCharacters, getCharacter, setCharacter, removeCharacter,
    get_settings, set_chat_metadata 
} from '../core/settings.js';
import { escapeHtml, generateUID, normalizeTitle } from '../utils/helpers.js';
import { NotificationManager } from '../utils/notifications.js';

const debug = createModuleLogger('characters');
const notifications = new NotificationManager('Character Management');

// Character management state
let undoHistory = []; // Store last 3 merge operations

/**
 * Character data structure
 * @typedef {Object} CharacterData
 * @property {string} preferredName - The preferred/canonical name
 * @property {string[]} aliases - List of alternative names
 * @property {string} physicalAge - Physical age description
 * @property {string} mentalAge - Mental age description
 * @property {string} physical - Physical description
 * @property {string} personality - Personality traits
 * @property {string} sexuality - Sexual orientation/preferences
 * @property {string} raceEthnicity - Race/ethnicity information
 * @property {string} roleSkills - Role and skills description
 * @property {string} lastInteraction - Last interaction with user
 * @property {string[]} relationships - Relationships with other characters
 * @property {boolean} ignored - Whether character is ignored
 * @property {number} confidence - Confidence score (0-100)
 * @property {string|null} lorebookEntryId - Associated lorebook entry ID
 * @property {number} lastUpdated - Timestamp of last update
 * @property {boolean} isMainChar - Whether this is the main character
 */

/**
 * Check if a character is in the ignored list
 * @param {string} name - Character name to check
 * @returns {boolean} True if character is ignored
 */
export function isIgnoredCharacter(name) {
    return withErrorBoundary('isIgnoredCharacter', () => {
        const chars = getCharacters();
        return Object.values(chars).some(
            char => char.ignored && (char.preferredName === name || char.aliases.includes(name)),
        );
    });
}

/**
 * Find existing character by name or alias
 * @param {string} name - Name to search for
 * @returns {CharacterData|null} Character data if found, null otherwise
 */
export function findExistingCharacter(name) {
    return withErrorBoundary('findExistingCharacter', () => {
        const chars = getCharacters();
        return Object.values(chars).find(
            char => char.preferredName === name || char.aliases.includes(name),
        ) || null;
    });
}

/**
 * Find potential match for a new character based on confidence threshold
 * @param {Object} analyzedChar - Character data from LLM analysis
 * @returns {Promise<CharacterData|null>} Potential match if found
 */
export async function findPotentialMatch(analyzedChar) {
    return withErrorBoundary('findPotentialMatch', async () => {
        const chars = getCharacters();
        const threshold = get_settings('confidenceThreshold', 70);

        debug.log();

        // Simple matching logic - can be enhanced with LLM-based similarity
        for (const existingChar of Object.values(chars)) {
            // Check for name similarity (simple approach)
            const similarity = calculateNameSimilarity(analyzedChar.name, existingChar.preferredName);

            if (similarity >= threshold) {
                debug.log();
                return existingChar;
            }

            // Check aliases
            for (const alias of existingChar.aliases) {
                const aliasSimilarity = calculateNameSimilarity(analyzedChar.name, alias);
                if (aliasSimilarity >= threshold) {
                    debug.log();
                    return existingChar;
                }
            }
        }

        return null;
    });
}

/**
 * Calculate simple name similarity (0-100)
 * @param {string} name1 - First name to compare
 * @param {string} name2 - Second name to compare
 * @returns {number} Similarity score 0-100
 */
export function calculateNameSimilarity(name1, name2) {
    return withErrorBoundary('calculateNameSimilarity', () => {
        name1 = name1.toLowerCase();
        name2 = name2.toLowerCase();

        // Exact match
        if (name1 === name2) {
            return 100;
        }

        // One contains the other
        if (name1.includes(name2) || name2.includes(name1)) {
            return 85;
        }

        // Check if they share significant parts
        const words1 = name1.split(/\s+/);
        const words2 = name2.split(/\s+/);

        const commonWords = words1.filter(w => words2.includes(w));
        if (commonWords.length > 0) {
            return 70;
        }

        // No significant similarity
        return 0;
    });
}

/**
 * Filter and clean aliases
 * Removes character's own name, relationship words, and other invalid aliases
 * @param {string[]} aliases - Array of alias strings
 * @param {string} characterName - The character's actual name
 * @returns {string[]} Cleaned array of unique aliases
 */
export function cleanAliases(aliases, characterName) {
    return withErrorBoundary('cleanAliases', () => {
        if (!aliases || !Array.isArray(aliases)) {
            return [];
        }

        // Common relationship/role words that shouldn't be aliases
        const invalidAliases = [
            'son', 'daughter', 'mother', 'father', 'mom', 'dad', 'parent',
            'brother', 'sister', 'sibling', 'cousin', 'uncle', 'aunt',
            'friend', 'boyfriend', 'girlfriend', 'husband', 'wife', 'spouse',
            'boss', 'employee', 'coworker', 'colleague', 'partner',
            'neighbor', 'roommate', 'child', 'kid', 'baby',
            'man', 'woman', 'person', 'guy', 'girl', 'boy',
            'user', '{{user}}', 'char', '{{char}}',
        ];

        const lowerName = characterName.toLowerCase();

        return aliases.filter(alias => {
            if (!alias || typeof alias !== 'string') return false;

            const lowerAlias = alias.trim().toLowerCase();

            // Remove if it's the character's own name
            if (lowerAlias === lowerName) return false;

            // Remove if it's just a relationship word
            if (invalidAliases.includes(lowerAlias)) return false;

            // Remove if it's too short (likely not a real alias)
            if (lowerAlias.length < 2) return false;

            return true;
        })
            .map(alias => alias.trim()) // Trim whitespace
            .filter((alias, index, self) => self.indexOf(alias) === index); // Remove duplicates
    });
}

/**
 * Create a new character entry
 * @param {Object} analyzedChar - Character data from LLM analysis
 * @param {boolean} isMainChar - Whether this is the main character
 * @returns {Promise<CharacterData>} Created character data
 */
export async function createCharacter(analyzedChar, isMainChar = false) {
    return withErrorBoundary('createCharacter', async () => {
        debug.log();

        // Clean and filter aliases
        const aliases = cleanAliases(analyzedChar.aliases || [], analyzedChar.name);

        const character = {
            preferredName: analyzedChar.name,
            aliases: aliases,
            physicalAge: analyzedChar.physicalAge || '',
            mentalAge: analyzedChar.mentalAge || '',
            physical: analyzedChar.physical || '',
            personality: analyzedChar.personality || '',
            sexuality: analyzedChar.sexuality || '',
            raceEthnicity: analyzedChar.raceEthnicity || '',
            roleSkills: analyzedChar.roleSkills || '',
            lastInteraction: analyzedChar.lastInteraction || '',
            relationships: analyzedChar.relationships || [],
            ignored: false,
            confidence: analyzedChar.confidence || 50,
            lorebookEntryId: null,
            lastUpdated: Date.now(),
            isMainChar: isMainChar || false,
        };

        debug.log();

        // Store character in settings
        setCharacter(character.preferredName, character);

        // Create lorebook entry
        await updateLorebookEntry(character, character.preferredName);

        debug.log();

        return character;
    });
}

/**
 * Update existing character with new information
 * @param {CharacterData} existingChar - Existing character data
 * @param {Object} analyzedChar - New character data from LLM analysis
 * @param {boolean} addAsAlias - Whether to add the analyzed name as an alias
 * @param {boolean} isMainChar - Whether this is the main character
 * @returns {Promise<CharacterData>} Updated character data
 */
export async function updateCharacter(existingChar, analyzedChar, addAsAlias = false, isMainChar = false) {
    return withErrorBoundary('updateCharacter', async () => {
        debug.log();

        // Mark as main character if detected
        if (isMainChar) {
            existingChar.isMainChar = true;
        }

        // If adding as alias, add the analyzed name to aliases if not already present
        if (addAsAlias && analyzedChar.name !== existingChar.preferredName) {
            if (!existingChar.aliases) existingChar.aliases = [];
            if (!existingChar.aliases.includes(analyzedChar.name) &&
                analyzedChar.name.toLowerCase() !== existingChar.preferredName.toLowerCase()) {
                existingChar.aliases.push(analyzedChar.name);
            }
        }

        // Clean up all aliases using the helper function
        existingChar.aliases = cleanAliases(existingChar.aliases || [], existingChar.preferredName);

        // Update consolidated fields (new data takes precedence if not empty)
        if (analyzedChar.physicalAge) existingChar.physicalAge = analyzedChar.physicalAge;
        if (analyzedChar.mentalAge) existingChar.mentalAge = analyzedChar.mentalAge;
        if (analyzedChar.physical) existingChar.physical = analyzedChar.physical;
        if (analyzedChar.personality) existingChar.personality = analyzedChar.personality;
        if (analyzedChar.sexuality) existingChar.sexuality = analyzedChar.sexuality;
        if (analyzedChar.raceEthnicity) existingChar.raceEthnicity = analyzedChar.raceEthnicity;
        if (analyzedChar.roleSkills) existingChar.roleSkills = analyzedChar.roleSkills;

        // lastInteraction is always updated (most recent)
        if (analyzedChar.lastInteraction) existingChar.lastInteraction = analyzedChar.lastInteraction;

        // Merge relationships array - deduplicate
        if (analyzedChar.relationships && Array.isArray(analyzedChar.relationships)) {
            if (!existingChar.relationships) existingChar.relationships = [];
            for (const rel of analyzedChar.relationships) {
                if (!existingChar.relationships.includes(rel)) {
                    existingChar.relationships.push(rel);
                }
            }
        }

        // Update confidence (average of old and new)
        if (analyzedChar.confidence) {
            existingChar.confidence = Math.round((existingChar.confidence + analyzedChar.confidence) / 2);
        }

        existingChar.lastUpdated = Date.now();

        // Update character in settings
        setCharacter(existingChar.preferredName, existingChar);

        debug.log();

        return existingChar;
    });
}

/**
 * Merge two characters
 * @param {string} sourceName - Name of character to merge from
 * @param {string} targetName - Name of character to merge into
 * @returns {Promise<void>}
 */
export async function mergeCharacters(sourceName, targetName) {
    return withErrorBoundary('mergeCharacters', async () => {
        const chars = getCharacters();

        const sourceChar = chars[sourceName];
        const targetChar = chars[targetName];

        if (!sourceChar || !targetChar) {
            throw new NameTrackerError('One or both characters not found');
        }

        // Store for undo
        const undoData = {
            operation: 'merge',
            timestamp: Date.now(),
            sourceName: sourceName,
            targetName: targetName,
            sourceData: JSON.parse(JSON.stringify(sourceChar)),
            targetDataBefore: JSON.parse(JSON.stringify(targetChar)),
        };

        // Add to undo history
        undoHistory.push(undoData);
        if (undoHistory.length > 3) {
            undoHistory.shift();
        }

        // Merge aliases
        for (const alias of sourceChar.aliases) {
            if (!targetChar.aliases.includes(alias)) {
                targetChar.aliases.push(alias);
            }
        }

        // Add source name as alias if not the same
        if (sourceChar.preferredName !== targetChar.preferredName &&
            !targetChar.aliases.includes(sourceChar.preferredName)) {
            targetChar.aliases.push(sourceChar.preferredName);
        }

        // Merge fields (target takes precedence for conflicts, but add new fields)
        if (sourceChar.physicalAge && !targetChar.physicalAge) targetChar.physicalAge = sourceChar.physicalAge;
        if (sourceChar.mentalAge && !targetChar.mentalAge) targetChar.mentalAge = sourceChar.mentalAge;
        if (sourceChar.physical && !targetChar.physical) targetChar.physical = sourceChar.physical;
        if (sourceChar.personality && !targetChar.personality) targetChar.personality = sourceChar.personality;
        if (sourceChar.sexuality && !targetChar.sexuality) targetChar.sexuality = sourceChar.sexuality;
        if (sourceChar.raceEthnicity && !targetChar.raceEthnicity) targetChar.raceEthnicity = sourceChar.raceEthnicity;
        if (sourceChar.roleSkills && !targetChar.roleSkills) targetChar.roleSkills = sourceChar.roleSkills;
        if (sourceChar.lastInteraction && !targetChar.lastInteraction) targetChar.lastInteraction = sourceChar.lastInteraction;

        // Merge relationships
        for (const rel of sourceChar.relationships) {
            if (!targetChar.relationships.includes(rel)) {
                targetChar.relationships.push(rel);
            }
        }

        // Update timestamp
        targetChar.lastUpdated = Date.now();

        // Update target character and delete source
        setCharacter(targetChar.preferredName, targetChar);
        removeCharacter(sourceName);

        // Save chat data
        // Auto-saved by new settings system

        debug.log();
        notifications.success(`Merged ${sourceName} into ${targetName}`);

        return undoData;
    });
}

/**
 * Undo last merge operation
 * @returns {Promise<boolean>} True if undo was successful
 */
export async function undoLastMerge() {
    return withErrorBoundary('undoLastMerge', async () => {
        if (undoHistory.length === 0) {
            notifications.warning('No merge operations to undo');
            return false;
        }

        const lastOp = undoHistory.pop();

        if (lastOp.operation !== 'merge') {
            notifications.error('Last operation was not a merge');
            return false;
        }

        // Restore source character
        setCharacter(lastOp.sourceName, lastOp.sourceData);

        // Restore target character to pre-merge state
        setCharacter(lastOp.targetName, lastOp.targetDataBefore);

        debug.log();
        notifications.success('Merge undone successfully');

        return true;
    });
}

/**
 * Toggle ignore status for a character
 * @param {string} characterName - Name of character to toggle
 * @returns {boolean} New ignore status
 */
export async function toggleIgnoreCharacter(characterName) {
    return withErrorBoundary('toggleIgnoreCharacter', async () => {
        const character = getCharacter(characterName);

        if (!character) {
            throw new NameTrackerError('Character not found');
        }

        character.ignored = !character.ignored;

        setCharacter(characterName, character);

        // Save chat data
        // Auto-saved by new settings system

        const status = character.ignored ? 'ignored' : 'unignored';
        notifications.info(`${characterName} ${status}`);
        debug.log();

        return character.ignored;
    });
}

/**
 * Manually create a new character
 * @param {string} characterName - Name of new character
 * @returns {Promise<CharacterData>} Created character
 */
export async function createNewCharacter(characterName) {
    return withErrorBoundary('createNewCharacter', async () => {
        if (!characterName || !characterName.trim()) {
            throw new NameTrackerError('Character name is required');
        }

        const trimmedName = characterName.trim();

        // Check if character already exists
        if (getCharacter(trimmedName)) {
            throw new NameTrackerError(`Character "${trimmedName}" already exists`);
        }

        // Create basic character structure
        const newChar = {
            name: trimmedName,
            aliases: [],
            physicalAge: '',
            mentalAge: '',
            physical: '',
            personality: '',
            sexuality: '',
            raceEthnicity: '',
            roleSkills: '',
            lastInteraction: '',
            relationships: [],
            confidence: 100, // Manually created = 100% confidence
        };

        const character = await createCharacter(newChar, false);

        // Save chat data
        // Auto-saved by new settings system

        debug.log();
        notifications.success(`Created character: ${trimmedName}`);

        return character;
    });
}

/**
 * Purge all character entries
 * @returns {Promise<number>} Number of characters purged
 */
export async function purgeAllCharacters() {
    return withErrorBoundary('purgeAllCharacters', async () => {
        const chars = getCharacters();
        const characterCount = Object.keys(chars).length;

        if (characterCount === 0) {
            notifications.info('No characters to purge');
            return 0;
        }

        // Clear all character data
        set_chat_metadata('characters', {});

        // Clear undo history
        undoHistory = [];

        debug.log();
        notifications.success(`Purged ${characterCount} characters`);

        return characterCount;
    });
}

/**
 * Check if character has unresolved relationships
 * @param {CharacterData} character - Character to check
 * @returns {boolean} True if character has relationships to unknown characters
 */
export function hasUnresolvedRelationships(character) {
    return withErrorBoundary('hasUnresolvedRelationships', () => {
        if (!character.relationships || character.relationships.length === 0) {
            return false;
        }

        const chars = getCharacters();
        const knownNames = Object.values(chars).reduce((names, char) => {
            names.add(char.preferredName.toLowerCase());
            char.aliases.forEach(alias => names.add(alias.toLowerCase()));
            return names;
        }, new Set());

        return character.relationships.some(rel => {
            // Simple check - extract character names from relationship strings
            const words = rel.toLowerCase().split(/\s+/);
            return words.some(word => {
                return word.length > 2 && !knownNames.has(word);
            });
        });
    });
}

/**
 * Get undo history
 * @returns {Array} Array of undo operations
 */
export function getUndoHistory() {
    return [...undoHistory];
}

/**
 * Clear undo history
 */
export function clearUndoHistory() {
    undoHistory = [];
    debug.log();
}

/**
 * Export all characters as JSON
 * @returns {Object} Character data
 */
export function exportCharacters() {
    return withErrorBoundary('exportCharacters', () => {
        return getCharacters();
    });
}

/**
 * Import characters from JSON
 * @param {Object} characterData - Character data to import
 * @param {boolean} merge - Whether to merge with existing characters
 * @returns {Promise<number>} Number of characters imported
 */
export async function importCharacters(characterData, merge = false) {
    return withErrorBoundary('importCharacters', async () => {
        if (!characterData || typeof characterData !== 'object') {
            throw new NameTrackerError('Invalid character data');
        }

        let importCount = 0;

        for (const [name, character] of Object.entries(characterData)) {
            if (merge || !getCharacter(name)) {
                setCharacter(name, character);
                importCount++;
            }
        }

        debug.log();
        notifications.success(`Imported ${importCount} characters`);

        return importCount;
    });
}
