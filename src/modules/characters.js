/**
 * Character Management Module
 *
 * Handles character CRUD operations, merging, alias detection, relationship management,
 * and per-character processing state tracking for the Name Tracker extension.
 */

import { updateLorebookEntry } from './lorebook.js';
import { createModuleLogger } from '../core/debug.js';
import { withErrorBoundary, NameTrackerError } from '../core/errors.js';
import {
    getCharacters, getCharacter, setCharacter, removeCharacter,
    set_chat_metadata, getSetting,
} from '../core/settings.js';
import { NotificationManager } from '../utils/notifications.js';

const debug = createModuleLogger('characters');
const notifications = new NotificationManager('Character Management');

/**
 * Validate and clean character data from LLM analysis
 * @param {Object} analyzedChar - Raw character data from LLM
 * @param {Array} allCharacters - Existing characters for validation
 * @returns {Object} Cleaned and validated character data
 */
function validateCharacterData(analyzedChar, allCharacters = []) {
    // Ensure required fields exist
    const name = (analyzedChar.name || '').trim();
    if (!name) {
        throw new NameTrackerError('Character name is required');
    }
    
    // Validate confidence score
    const confidence = typeof analyzedChar.confidence === 'number' && analyzedChar.confidence >= 0 && analyzedChar.confidence <= 100 
        ? analyzedChar.confidence 
        : 75;
    
    // Clean and validate arrays
    const aliases = Array.isArray(analyzedChar.aliases) ? analyzedChar.aliases.filter(a => typeof a === 'string' && a.trim()) : [];
    const relationships = Array.isArray(analyzedChar.relationships) ? analyzedChar.relationships.filter(r => typeof r === 'string' && r.trim()) : [];
    
    // Clean text fields
    const cleanTextField = (field) => {
        return typeof field === 'string' ? field.trim() : '';
    };
    
    // Clean name using helper if available (fallback to basic sanitization)
    const sanitizedName = name.replace(/[<>&"']/g, '').trim();
    
    return {
        name: sanitizedName,
        aliases,
        physicalAge: cleanTextField(analyzedChar.physicalAge),
        mentalAge: cleanTextField(analyzedChar.mentalAge),
        physical: cleanTextField(analyzedChar.physical),
        personality: cleanTextField(analyzedChar.personality),
        sexuality: cleanTextField(analyzedChar.sexuality),
        raceEthnicity: cleanTextField(analyzedChar.raceEthnicity),
        roleSkills: cleanTextField(analyzedChar.roleSkills),
        relationships,
        confidence
    };
}

// ============================================================================
// DEBUG CONFIGURATION
// ============================================================================
const DEBUG_LOGGING = true; // Set to false in production after testing

function debugLog(message, data = null) {
    if (DEBUG_LOGGING) {
        console.log(`[NT-Characters] ${message}`, data || '');
    }
}

// ============================================================================
// CHARACTER-LOREBOOK SYNCHRONIZATION
// ============================================================================

/**
 * Validate character-lorebook synchronization
 * Ensures 1:1 relationship between characters and lorebook entries
 * @returns {Promise<{valid: boolean, issues: string[]}>} Validation results
 */
export async function validateCharacterLorebookSync() {
    return withErrorBoundary('validateCharacterLorebookSync', async () => {
        const characters = await getCharacters();
        const issues = [];
        let orphanedCharacters = 0;
        let orphanedEntries = 0;

        debugLog('🔍 Validating character-lorebook synchronization...');

        // Check each character has a valid lorebook entry ID
        for (const [name, character] of Object.entries(characters)) {
            if (!character.lorebookEntryId) {
                issues.push(`Character '${name}' missing lorebookEntryId`);
                orphanedCharacters++;
            }
        }

        // Get lorebook stats to compare counts
        try {
            const { getLorebookStats } = await import('./lorebook.js');
            const stats = await getLorebookStats();
            const characterCount = Object.keys(characters).length;
            
            if (stats.totalEntries !== characterCount) {
                issues.push(`Count mismatch: ${characterCount} characters vs ${stats.totalEntries} lorebook entries`);
            }
            
            debugLog(`📊 Sync validation: ${characterCount} characters, ${stats.totalEntries} entries`);
            
        } catch (error) {
            issues.push(`Could not validate lorebook entries: ${error.message}`);
        }

        const valid = issues.length === 0;
        
        if (!valid) {
            console.warn('[NT-Characters] ⚠️ Character-Lorebook sync issues:', issues);
        } else {
            debugLog('✅ Character-lorebook synchronization validated');
        }

        return { valid, issues };
    });
}

/**
 * Repair character-lorebook synchronization issues
 * @returns {Promise<{repaired: number, errors: string[]}>} Repair results
 */
export async function repairCharacterLorebookSync() {
    return withErrorBoundary('repairCharacterLorebookSync', async () => {
        const characters = await getCharacters();
        const { updateLorebookEntry } = await import('./lorebook.js');
        let repaired = 0;
        const errors = [];

        debugLog('🔧 Repairing character-lorebook synchronization...');

        for (const [name, character] of Object.entries(characters)) {
            try {
                if (!character.lorebookEntryId) {
                    debugLog(`🔧 Creating missing lorebook entry for: ${name}`);
                    await updateLorebookEntry(character, name);
                    repaired++;
                }
            } catch (error) {
                const errorMsg = `Failed to repair ${name}: ${error.message}`;
                errors.push(errorMsg);
                console.error(`[NT-Characters] ${errorMsg}`);
            }
        }

        debugLog(`🔧 Repair complete: ${repaired} entries repaired, ${errors.length} errors`);
        return { repaired, errors };
    });
}

// Merge Confidence Tiers (as percentages: 0-100)
const MERGE_CONFIDENCE_HIGH = 0.9;      // 90%+ - Automatic merge (e.g., exact substring: "Jazz"/"Jasmine")
const MERGE_CONFIDENCE_MEDIUM = 0.7;    // 70%+ - User prompt required (e.g., phonetic similarity)
// eslint-disable-next-line no-unused-vars
const MERGE_CONFIDENCE_LOW = 0.5;       // 50%+ - No automatic action (may indicate false positives)

// ============================================================================
// CHARACTER DATA VALIDATION AND CLEANUP
// ============================================================================

/**
 * Parse and normalize relationship strings from the new natural language format
 * Handles: "Character A is to Character B: relationship1, relationship2"
 * @param {Array<string>} relationships - Raw relationship strings from LLM
 * @param {string} currentCharName - Name of the current character
 * @param {Object} allCharacters - All known characters for name resolution
 * @returns {Array<string>} Normalized relationship triplets
 */
function parseNewRelationshipFormat(relationships, currentCharName, allCharacters) {
    if (!relationships || !Array.isArray(relationships)) {
        return [];
    }

    debugLog(`🔄 Parsing ${relationships.length} new-format relationships for ${currentCharName}`);
    const parsedTriplets = [];

    for (const rel of relationships) {
        if (!rel || typeof rel !== 'string') continue;

        // Parse format: "Character A is to Character B: relationship1, relationship2"
        const match = rel.match(/^(.+?)\s+is\s+to\s+(.+?):\s*(.+)$/i);
        if (!match) {
            debugLog(`❌ Failed to parse relationship format: "${rel}"`);
            continue;
        }

        const [, char1, char2, relationshipsPart] = match;
        const char1Trimmed = char1.trim();
        const char2Trimmed = char2.trim();
        
        // Normalize character names to preferred names
        const normalizedChar1 = findPreferredName(char1Trimmed, allCharacters);
        const normalizedChar2 = findPreferredName(char2Trimmed, allCharacters);
        
        if (!normalizedChar1 || !normalizedChar2) {
            debugLog(`❌ Could not normalize names: "${char1Trimmed}" -> "${normalizedChar1}", "${char2Trimmed}" -> "${normalizedChar2}"`);
            continue;
        }

        // Split multiple relationships and create individual triplets
        const relationshipTypes = relationshipsPart.split(',').map(r => r.trim());
        
        for (const relType of relationshipTypes) {
            if (relType) {
                const triplet = `${normalizedChar1}, ${normalizedChar2}, ${relType.toLowerCase()}`;
                parsedTriplets.push(triplet);
                debugLog(`✅ Parsed: "${rel}" -> "${triplet}"`);
            }
        }
    }

    debugLog(`📝 Converted ${relationships.length} relationships to ${parsedTriplets.length} triplets`);
    return parsedTriplets;
}
/**
 * Normalize and rationalize character relationships with new natural language format
 * @param {Array<string>} relationships - Raw relationship strings from LLM
 * @param {string} currentCharName - Name of the current character
 * @param {Object} allCharacters - All known characters for name resolution
 * @returns {Array<string>} Cleaned relationship triplets
 */
function rationalizeRelationships(relationships, currentCharName, allCharacters) {
    if (!relationships || !Array.isArray(relationships)) {
        return [];
    }

    debugLog(`🔧 Rationalizing ${relationships.length} relationships for ${currentCharName}`);

    // First, check for legacy triplet format and warn
    const hasLegacyTriplets = relationships.some(rel => {
        if (typeof rel === 'string') {
            const parts = rel.split(',');
            return parts.length === 3 && !rel.includes(' is to ');
        }
        return false;
    });
    
    if (hasLegacyTriplets) {
        debugLog(`⚠️ WARNING: Detected legacy triplet format in relationships. LLM should use new format.`);
    }

    // Determine if we're dealing with new format or legacy triplets
    const hasNewFormat = relationships.some(rel => typeof rel === 'string' && /\s+is\s+to\s+.+:/.test(rel));
    
    let parsedTriplets;
    if (hasNewFormat) {
        // Parse new natural language format
        parsedTriplets = parseNewRelationshipFormat(relationships, currentCharName, allCharacters);
    } else {
        // Handle legacy triplet format
        parsedTriplets = relationships.filter(rel => {
            if (!rel || typeof rel !== 'string') return false;
            const parts = rel.split(',');
            return parts.length === 3 && parts.every(part => part.trim().length > 0);
        });
    }

    if (parsedTriplets.length === 0) {
        debugLog(`❌ No valid relationships found after parsing`);
        return [];
    }

    // Continue with existing rationalization logic for the triplets
    const relationshipObjects = [];
    
    for (const triplet of parsedTriplets) {
        const parts = triplet.split(',').map(part => part.trim());
        if (parts.length !== 3) continue;
        
        const [char1, char2, relationship] = parts;
        
        // Normalize character names again (in case of legacy format)
        const normalizedChar1 = findPreferredName(char1, allCharacters);
        const normalizedChar2 = findPreferredName(char2, allCharacters);
        
        if (normalizedChar1 && normalizedChar2 && relationship) {
            relationshipObjects.push({
                char1: normalizedChar1,
                char2: normalizedChar2,
                relationship: relationship.toLowerCase().trim(),
                original: triplet
            });
        }
    }

    debugLog(`📋 Processed ${relationshipObjects.length} relationship objects`);

    // Group relationships by character pair for deduplication
    const relationshipsByPair = new Map();
    
    for (const rel of relationshipObjects) {
        const pairKey = `${rel.char1}|${rel.char2}`;
        
        if (!relationshipsByPair.has(pairKey)) {
            relationshipsByPair.set(pairKey, []);
        }
        relationshipsByPair.get(pairKey).push(rel);
    }

    // Rationalize each character pair
    const finalizedRelationships = [];
    
    for (const [pairKey, rels] of relationshipsByPair.entries()) {
        const rationalized = rationalizeRelationshipGroup(rels);
        if (rationalized) {
            finalizedRelationships.push(`${rationalized.char1}, ${rationalized.char2}, ${rationalized.relationship}`);
        }
    }

    debugLog(`✅ Finalized ${finalizedRelationships.length} relationships (reduced from ${relationships.length})`);
    
    return finalizedRelationships;
}

/**
 * Find the preferred canonical name for a character
 * @param {string} name - Name variant to resolve
 * @param {Object} allCharacters - All known characters
 * @returns {string|null} Preferred name or null if not found
 */
function findPreferredName(name, allCharacters) {
    if (!name || !allCharacters) return name;
    
    // First, try exact match on preferred names
    for (const [preferredName, character] of Object.entries(allCharacters)) {
        if (preferredName === name) {
            return preferredName;
        }
    }
    
    // Then try aliases
    for (const [preferredName, character] of Object.entries(allCharacters)) {
        if (character.aliases && character.aliases.includes(name)) {
            return preferredName;
        }
    }
    
    // Return original if no match found
    return name;
}

/**
 * Rationalize a group of relationships for the same character pair
 * Now maintains multiple compatible relationships instead of choosing just one
 * @param {Array} relationships - Array of relationship objects for same pair
 * @returns {Object|null} Single rationalized relationship or null
 */
function rationalizeRelationshipGroup(relationships) {
    if (!relationships || relationships.length === 0) return null;
    
    const relTypes = relationships.map(r => r.relationship);
    debugLog(`🎯 Rationalizing group: [${relTypes.join(', ')}]`);
    
    // Deduplication mapping - convert synonyms to canonical forms
    const equivalents = {
        'sexual partner': 'lover',
        'romantic partner': 'lover',
        'boyfriend': 'lover',
        'girlfriend': 'lover',
        'husband': 'spouse',
        'wife': 'spouse',
        'father': 'parent',
        'mother': 'parent',
        'son': 'child',
        'daughter': 'child',
        'brother': 'sibling',
        'sister': 'sibling',
        'manager': 'boss',
        'supervisor': 'boss'
    };
    
    // Normalize to canonical forms and remove duplicates
    const normalizedRels = [...new Set(relTypes.map(rel => equivalents[rel] || rel))];
    
    // Remove contradictory relationships (keep the first one found)
    const contradictions = [
        ['dominant', 'submissive'],
        ['leader', 'follower'],
        ['boss', 'employee'],
        ['parent', 'child']
    ];
    
    let filteredRels = [...normalizedRels];
    for (const [rel1, rel2] of contradictions) {
        const hasRel1 = filteredRels.includes(rel1);
        const hasRel2 = filteredRels.includes(rel2);
        
        if (hasRel1 && hasRel2) {
            // Keep the first one, remove the second
            const index1 = filteredRels.indexOf(rel1);
            const index2 = filteredRels.indexOf(rel2);
            
            if (index1 < index2) {
                filteredRels = filteredRels.filter(r => r !== rel2);
                debugLog(`🚫 Removed contradictory '${rel2}', kept '${rel1}'`);
            } else {
                filteredRels = filteredRels.filter(r => r !== rel1);
                debugLog(`🚫 Removed contradictory '${rel1}', kept '${rel2}'`);
            }
        }
    }
    
    if (filteredRels.length === 0) {
        debugLog(`❌ No relationships left after filtering contradictions`);
        return null;
    }
    
    // Combine multiple relationships with commas (new approach)
    const combinedRelationship = filteredRels.join(', ');
    
    debugLog(`🎯 Combined relationships: "${combinedRelationship}" from [${relTypes.join(', ')}]`);
    
    const baseRel = relationships[0];
    return {
        char1: baseRel.char1,
        char2: baseRel.char2,
        relationship: combinedRelationship
    };
}

// Substring Matching Thresholds
const MIN_SUBSTRING_LENGTH = 3;         // Minimum length for substring detection
const SUBSTRING_MATCH_BONUS = 0.95;     // High confidence for substring matches

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
export async function isIgnoredCharacter(name) {
    return withErrorBoundary('isIgnoredCharacter', async () => {
        const chars = await getCharacters();
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
export async function findExistingCharacter(name) {
    return withErrorBoundary('findExistingCharacter', async () => {
        const chars = await getCharacters();
        const found = Object.values(chars).find(
            char => char.preferredName === name || char.aliases.includes(name),
        ) || null;
        debugLog(`[FindChar] Searching for '${name}': ${found ? 'FOUND as ' + found.preferredName : 'NOT FOUND'}`);
        return found;
    });
}

/**
 * Find potential match for a new character based on confidence threshold
 * @param {Object} analyzedChar - Character data from LLM analysis
 * @returns {Promise<CharacterData|null>} Potential match if found
 */
export async function findPotentialMatch(analyzedChar) {
    return withErrorBoundary('findPotentialMatch', async () => {
        const chars = await getCharacters();
        // Use the user-configured confidence threshold (0-100)
        const threshold = await getSetting('confidenceThreshold', 70);

        debug.log();

        // Simple matching logic - can be enhanced with LLM-based similarity
        for (const existingChar of Object.values(chars)) {
            // Check for name similarity (simple approach)
            const similarity = await calculateNameSimilarity(analyzedChar.name, existingChar.preferredName);

            if (similarity >= threshold) {
                debug.log();
                return existingChar;
            }

            // Check aliases
            for (const alias of existingChar.aliases) {
                const aliasSimilarity = await calculateNameSimilarity(analyzedChar.name, alias);
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

// ============================================================================
// MERGE DETECTION AND CONFIDENCE SCORING
// ============================================================================

/**
 * Detect potential merge opportunities for a new character
 * Finds existing characters that might be the same person with different names
 * @param {string} newCharacterName - Name of the newly discovered character
 * @returns {Array} Array of potential merge targets with confidence scores
 */
export async function detectMergeOpportunities(newCharacterName) {
    return withErrorBoundary('detectMergeOpportunities', async () => {
        debugLog(`[MergeDetect] Checking merge opportunities for: ${newCharacterName}`);

        const potentialMatches = [];
        const existingCharacters = await getCharacters();

        if (!newCharacterName || typeof newCharacterName !== 'string') {
            debugLog('[MergeDetect] Invalid name provided');
            return potentialMatches;
        }

        // eslint-disable-next-line no-unused-vars
        for (const [_existingName, existingChar] of Object.entries(existingCharacters)) {
            const confidence = calculateMergeConfidence(newCharacterName, existingChar);

            if (confidence >= MERGE_CONFIDENCE_MEDIUM) {
                const tier = confidence >= MERGE_CONFIDENCE_HIGH ? 'HIGH' : 'MEDIUM';
                const reason = generateMergeReason(newCharacterName, existingChar, confidence);
                potentialMatches.push({
                    targetName: existingChar.preferredName,
                    confidence: confidence,
                    tier: tier,
                    reason: reason,
                });
                debugLog(`[MergeDetect] ${newCharacterName} -> ${existingChar.preferredName}: ${tier} (${Math.round(confidence * 100)}%) - ${reason}`);
            }
        }

        // Sort by confidence descending
        potentialMatches.sort((a, b) => b.confidence - a.confidence);

        debugLog(`[MergeDetect] Total merge candidates for ${newCharacterName}: ${potentialMatches.length}`);

        return potentialMatches;
    }, []);
}

/**
 * Calculate merge confidence between two character names
 * Returns value 0-1 (0-100%)
 * @private
 */
function calculateMergeConfidence(newName, existingChar) {
    debugLog(`[CalcConfidence] Comparing '${newName}' vs '${existingChar.preferredName}'`);

    const existingName = existingChar.preferredName;
    let confidence = 0;

    // Check for exact substring match (e.g., "Jazz" in "Jasmine")
    if (isSubstringMatch(newName, existingName)) {
        confidence = SUBSTRING_MATCH_BONUS;
        debugLog('[CalcConfidence] Substring match detected');
    }
    // Check if new name matches any existing alias
    else if (existingChar.aliases && existingChar.aliases.some(alias =>
        newName.toLowerCase() === alias.toLowerCase())) {
        confidence = 0.95;
    }
    // Check for phonetic similarity
    else if (isPhoneticSimilar(newName, existingName)) {
        confidence = 0.8;
    }
    // Check for partial similarity
    else if (isPartialMatch(newName, existingName)) {
        confidence = 0.65;
    }

    return confidence;
}

/**
 * Check if newName is a substring of existingName (or vice versa)
 * Used for detecting nickname relationships like "Jazz" for "Jasmine"
 * @private
 */
function isSubstringMatch(newName, existingName) {
    const newLower = newName.toLowerCase();
    const existLower = existingName.toLowerCase();

    // Check if one is a substring of the other, and long enough to be meaningful
    if (newName.length >= MIN_SUBSTRING_LENGTH) {
        return existLower.includes(newLower) || newLower.includes(existLower);
    }

    return false;
}

/**
 * Basic phonetic similarity check using Levenshtein distance
 * @private
 */
function isPhoneticSimilar(str1, str2) {
    const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
    const maxLength = Math.max(str1.length, str2.length);
    const similarity = 1 - (distance / maxLength);

    // Consider similar if >75% match
    return similarity >= 0.75;
}

/**
 * Check for partial name match (e.g., first/last name components)
 * @private
 */
function isPartialMatch(newName, existingName) {
    const newParts = newName.toLowerCase().split(/\s+/);
    const existParts = existingName.toLowerCase().split(/\s+/);

    // Check if any part of new name matches parts of existing
    return newParts.some(newPart => existParts.some(existPart =>
        newPart === existPart && newPart.length > 2,
    ));
}

/**
 * Calculate Levenshtein distance between two strings
 * @private
 */
function levenshteinDistance(str1, str2) {
    const track = Array(str2.length + 1).fill(null).map(() =>
        Array(str1.length + 1).fill(null),
    );

    for (let i = 0; i <= str1.length; i++) {
        track[0][i] = i;
    }

    for (let j = 0; j <= str2.length; j++) {
        track[j][0] = j;
    }

    for (let j = 1; j <= str2.length; j++) {
        for (let i = 1; i <= str1.length; i++) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
            track[j][i] = Math.min(
                track[j][i - 1] + 1,
                track[j - 1][i] + 1,
                track[j - 1][i - 1] + indicator,
            );
        }
    }

    return track[str2.length][str1.length];
}

/**
 * Generate human-readable reason for merge suggestion
 * @private
 */
function generateMergeReason(newName, existingChar, confidence) {
    if (confidence >= MERGE_CONFIDENCE_HIGH) {
        if (newName.toLowerCase().includes(existingChar.preferredName.toLowerCase())) {
            return `"${newName}" contains "${existingChar.preferredName}" (likely nickname)`;
        }
        return `Exact match confidence: ${(confidence * 100).toFixed(0)}%`;
    }

    return `Phonetic/partial match with confidence: ${(confidence * 100).toFixed(0)}%`;
}

/**
 * Create a new character entry
antml:parameter>

 * @param {Object} analyzedChar - Character data from LLM analysis
 * @param {boolean} isMainChar - Whether this is the main character
 * @returns {Promise<CharacterData>} Created character data
 */
export async function createCharacter(analyzedChar, isMainChar = false) {
    return withErrorBoundary('createCharacter', async () => {
        debug.log();
        console.log('[NT-Characters] 🟦 createCharacter() called for:', analyzedChar.name);
        
        // Get all characters for relationship normalization
        const allCharacters = await getCharacters();
        
        // Validate and clean character data from LLM
        const cleanedChar = validateCharacterData(analyzedChar, allCharacters);
        
        // Clean and filter aliases
        const aliases = await cleanAliases(cleanedChar.aliases || [], cleanedChar.name);

        const character = {
            preferredName: cleanedChar.name,
            aliases: aliases,
            physicalAge: cleanedChar.physicalAge || '',
            mentalAge: cleanedChar.mentalAge || '',
            physical: cleanedChar.physical || '',
            personality: cleanedChar.personality || '',
            sexuality: cleanedChar.sexuality || '',
            raceEthnicity: cleanedChar.raceEthnicity || '',
            roleSkills: cleanedChar.roleSkills || '',
            relationships: cleanedChar.relationships || [],
            ignored: false,
            confidence: cleanedChar.confidence || 50,
            lorebookEntryId: null,
            lastUpdated: Date.now(),
            isMainChar: isMainChar || false,
            needsReview: true,  // New characters always need review
        };

        debug.log();

        // Store character in settings - CRITICAL: AWAIT to ensure save completes
        await setCharacter(character.preferredName, character);
        console.log('[NT-Characters] 🟦 Created and saved character:', character.preferredName);

        // Create lorebook entry and ensure ID is saved
        await updateLorebookEntry(character, character.preferredName);
        
        // Verify lorebook entry was created successfully
        if (!character.lorebookEntryId) {
            console.warn(`[NT-Characters] ⚠️ Lorebook entry creation may have failed for: ${character.preferredName}`);
        } else {
            debugLog(`✅ Lorebook entry created with ID: ${character.lorebookEntryId}`);
        }

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

        // Get all characters for relationship normalization
        const allCharacters = await getCharacters();

        // Validate and clean new character data from LLM
        const cleanedChar = validateCharacterData(analyzedChar, allCharacters);

        // Mark as main character if detected
        if (isMainChar) {
            existingChar.isMainChar = true;
        }

        // If adding as alias, add the analyzed name to aliases if not already present
        if (addAsAlias && cleanedChar.name !== existingChar.preferredName) {
            if (!existingChar.aliases) existingChar.aliases = [];
            if (!existingChar.aliases.includes(cleanedChar.name) &&
                cleanedChar.name.toLowerCase() !== existingChar.preferredName.toLowerCase()) {
                existingChar.aliases.push(cleanedChar.name);
            }
        }

        // Clean up all aliases using the helper function
        existingChar.aliases = await cleanAliases(existingChar.aliases || [], existingChar.preferredName);

        // Update consolidated fields (new data takes precedence if not empty)
        if (cleanedChar.physicalAge) existingChar.physicalAge = cleanedChar.physicalAge;
        if (cleanedChar.mentalAge) existingChar.mentalAge = cleanedChar.mentalAge;
        if (cleanedChar.physical) existingChar.physical = cleanedChar.physical;
        if (cleanedChar.personality) existingChar.personality = cleanedChar.personality;
        if (cleanedChar.sexuality) existingChar.sexuality = cleanedChar.sexuality;
        if (cleanedChar.raceEthnicity) existingChar.raceEthnicity = cleanedChar.raceEthnicity;
        if (cleanedChar.roleSkills) existingChar.roleSkills = cleanedChar.roleSkills;

        // Merge relationships array - deduplicate and filter to valid triplets
        if (cleanedChar.relationships && Array.isArray(cleanedChar.relationships)) {
            if (!existingChar.relationships) existingChar.relationships = [];
            for (const rel of cleanedChar.relationships) {
                if (!existingChar.relationships.includes(rel)) {
                    existingChar.relationships.push(rel);
                }
            }
        }

        // Update confidence (average of old and new)
        if (cleanedChar.confidence) {
            existingChar.confidence = Math.round((existingChar.confidence + cleanedChar.confidence) / 2);
        }

        existingChar.lastUpdated = Date.now();
        existingChar.needsReview = true;  // Updated characters need review

        // Update character in settings - AWAIT to ensure save completes
        await setCharacter(existingChar.preferredName, existingChar);
        console.log('[NT-Characters] 🟦 Updated and saved character:', existingChar.preferredName);

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
        const chars = await getCharacters();

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

        // Merge relationships
        for (const rel of sourceChar.relationships) {
            if (!targetChar.relationships.includes(rel)) {
                targetChar.relationships.push(rel);
            }
        }

        // Update timestamp
        targetChar.lastUpdated = Date.now();

        // Update target character and delete source - AWAIT both
        await setCharacter(targetChar.preferredName, targetChar);
        await removeCharacter(sourceName);

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

        // Restore source character - AWAIT
        await setCharacter(lastOp.sourceName, lastOp.sourceData);

        // Restore target character to pre-merge state - AWAIT
        await setCharacter(lastOp.targetName, lastOp.targetDataBefore);

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
        const character = await getCharacter(characterName);

        if (!character) {
            throw new NameTrackerError('Character not found');
        }

        character.ignored = !character.ignored;

        await setCharacter(characterName, character);

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
        if (await getCharacter(trimmedName)) {
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
        const chars = await getCharacters();
        const characterCount = Object.keys(chars).length;

        if (characterCount === 0) {
            notifications.info('No characters to purge');
            return 0;
        }

        // Clear all character data
        await set_chat_metadata('characters', {});

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
export async function hasUnresolvedRelationships(character) {
    return withErrorBoundary('hasUnresolvedRelationships', async () => {
        if (!character.relationships || character.relationships.length === 0) {
            return false;
        }

        const chars = await getCharacters();
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
export async function exportCharacters() {
    return withErrorBoundary('exportCharacters', async () => {
        return await getCharacters();
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
            if (merge || !await getCharacter(name)) {
                await setCharacter(name, character);
                importCount++;
            }
        }

        debug.log();
        notifications.success(`Imported ${importCount} characters`);

        return importCount;
    });
}
