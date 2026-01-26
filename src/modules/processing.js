/**
 * Message Processing Module
 *
 * Handles two-phase character detection (lightweight name scan → focused LLM processing),
 * batch processing with character-specific context windows, and SillyTavern event integration.
 */

import { createModuleLogger } from '../core/debug.js';
import { withErrorBoundary, NameTrackerError } from '../core/errors.js';
import { get_settings, set_settings, getLLMConfig, getCharacters } from '../core/settings.js';
import { stContext } from '../core/context.js';
import { NotificationManager } from '../utils/notifications.js';
import { callLLMAnalysis, buildCharacterRoster, getMaxPromptLength, calculateMessageTokens } from './llm.js';
import { createCharacter, updateCharacter, findExistingCharacter, findPotentialMatch, isIgnoredCharacter, detectMergeOpportunities, mergeCharacters } from './characters.js';
import { updateLorebookEntry } from './lorebook.js';
import { updateCharacterList, updateStatusDisplay } from './ui.js';

const debug = createModuleLogger('processing');
const notifications = new NotificationManager('Message Processing');

// ============================================================================
// DEBUG CONFIGURATION
// ============================================================================
const DEBUG_LOGGING = false; // Default off to reduce console noise

function debugLog(message, data = null) {
    if (DEBUG_LOGGING) {
        console.log(`[NT-Processing] ${message}`, data || '');
    }
}

// ============================================================================
// CONFIGURATION CONSTANTS - Core processing parameters
// ============================================================================
// These values drive the processing pipeline. Future user-exposed settings
// should reference these constant names for easy discovery and updates.

// Context Management
const CONTEXT_TARGET_PERCENT = 80;      // Target percentage of context window to use
const OVERLAP_SIZE = 3;                 // Messages to overlap between batches for continuity
const MIN_CONTEXT_TARGET = 50;          // Minimum allowed context target (floor for auto-reduction)

// Name Detection
const CAPITALIZED_WORD_REGEX = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g;  // Matches capitalized names
const QUOTED_NAME_REGEX = /"([^"]+)"/g;  // Matches quoted names
const POSSESSIVE_REGEX = /(\b[A-Z][a-z]+)'s\b/g;  // Matches possessive forms

// Processing Control
// const BATCH_TIMEOUT_MS = 30000;         // Maximum time for a single batch to process (reserved for future)
const MAX_RETRY_ATTEMPTS = 3;           // Maximum retries before halting processing
const CONTEXT_REDUCTION_STEP = 5;       // Percentage to reduce context target on each failure

// Batch Size Constraints (token-based, but with message-count limits for safety)
const MIN_MESSAGES_PER_BATCH = 5;       // Never create batches smaller than this (unless last batch)
const MAX_MESSAGES_PER_BATCH = 50;      // Cap batches at this size even if tokens allow more
const TARGET_MESSAGES_PER_BATCH = 30;   // Aim for this size when possible (balance: not too small, not too large)
const TARGET_MESSAGE_PERCENT = 35;      // Use 35% of max context for message data (conservative)

// Error Recovery
const ENABLE_AUTO_RECOVERY = true;      // Enable automatic context reduction on failure
// const PRESERVE_PROCESSING_STATE = true; // Always save character state even on errors (reserved for future)

// ============================================================================
// SHARED HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate available token budget for message data
 * @param {number} maxPromptTokens - Maximum tokens available from context
 * @returns {number} Available tokens for message content
 */
function calculateAvailableTokens(maxPromptTokens) {
    // Use only 35% of max context for messages (conservative to avoid overwhelming the model)
    // This leaves room for: system prompt (~1000 tokens) + response (up to 4000 tokens)
    return Math.floor(maxPromptTokens * (TARGET_MESSAGE_PERCENT / 100));
}

/**
 * Create batches of messages based on token limits
 * @param {Array} messages - Messages to batch
 * @param {number} availableTokens - Token budget per batch
 * @param {boolean} enforceMessageLimit - Whether to enforce MAX_MESSAGES_PER_BATCH
 * @returns {Promise<Array>} Array of message batches
 */
async function createMessageBatches(messages, availableTokens, enforceMessageLimit = true) {
    const batches = [];
    let currentBatch = [];
    let currentTokens = 0;

    for (const msg of messages) {
        const msgTokens = await calculateMessageTokens([msg]);

        // Check if batch would exceed limits
        const wouldExceedTokens = currentTokens + msgTokens > availableTokens;
        const wouldExceedMessageCount = enforceMessageLimit && currentBatch.length >= MAX_MESSAGES_PER_BATCH;

        if ((wouldExceedTokens || wouldExceedMessageCount) && currentBatch.length > 0) {
            // Current batch is full, start new one
            batches.push(currentBatch);
            currentBatch = [msg];
            currentTokens = msgTokens;
        } else {
            // Add to current batch
            currentBatch.push(msg);
            currentTokens += msgTokens;
        }
    }

    // Add final batch
    if (currentBatch.length > 0) {
        batches.push(currentBatch);
    }

    return batches;
}

// Processing state
let processingQueue = [];
let isProcessing = false;
let abortScan = false;
const currentProcessingState = {
    totalBatches: 0,
    currentBatch: 0,
    failedCharacters: [],
    lastError: null,
    contextTarget: CONTEXT_TARGET_PERCENT,
};

/**
 * Process analysis results from LLM
 * @param {Array} analyzedCharacters - Array of character data from LLM
 * @returns {Promise<void>}
 */
export async function processAnalysisResults(analyzedCharacters) {
    return withErrorBoundary('processAnalysisResults', async () => {
        debugLog('processAnalysisResults', {
            inputType: typeof analyzedCharacters,
            isArray: Array.isArray(analyzedCharacters),
            length: analyzedCharacters?.length,
        });

        if (!analyzedCharacters || !Array.isArray(analyzedCharacters)) {
            console.warn('[NT-Processing] ⚠️  Invalid input - not an array:', analyzedCharacters);
            debug.log();
            return;
        }

        debugLog(`Processing ${analyzedCharacters.length} characters`);

        for (const analyzedChar of analyzedCharacters) {
            try {
                await processCharacterData(analyzedChar);
            } catch (error) {
                console.error(`[NT-Processing] ❌ Error processing character ${analyzedChar.name}:`, error);
                console.error('[NT-Processing] Error stack:', error.stack);
                // Continue with other characters
            }
        }

        debugLog('All characters processed');
        updateCharacterList();
        updateStatusDisplay();
    });
}

/**
 * Process individual character data from LLM analysis
 * @param {Object} analyzedChar - Character data from LLM
 * @returns {Promise<void>}
 */
async function processCharacterData(analyzedChar) {
    return withErrorBoundary('processCharacterData', async () => {
        debugLog('Processing character data', analyzedChar?.name);

        if (!analyzedChar.name || analyzedChar.name.trim() === '') {
            console.warn('[NT-CharData] ⚠️  Character has no name, skipping');
            debug.log();
            return;
        }

        const characterName = analyzedChar.name.trim();
        debugLog('Character name', characterName);

        // Check if character is ignored
        const isIgnored = await isIgnoredCharacter(characterName);
        if (isIgnored) {
            debugLog('Character ignored, skipping', characterName);
            debug.log();
            return;
        }

        // Check for main character detection
        const isMainChar = characterName.toLowerCase().includes('{{char}}') ||
                  analyzedChar.isMainCharacter === true ||
                  analyzedChar.role === 'main';
        debugLog('Is main char', isMainChar);

        // Check if character already exists
        const existingChar = await findExistingCharacter(characterName);
        debugLog('Existing character found', !!existingChar);

        if (existingChar) {
            // Update existing character
            await updateCharacter(existingChar, analyzedChar, false, isMainChar);
            await updateLorebookEntry(existingChar, existingChar.preferredName);
            debug.log();
        } else {
            // Check for potential matches (similar names)
            const potentialMatch = await findPotentialMatch(analyzedChar);
            debugLog('Potential match found', !!potentialMatch);

            if (potentialMatch) {
                // Update potential match and add as alias
                await updateCharacter(potentialMatch, analyzedChar, true, isMainChar);
                await updateLorebookEntry(potentialMatch, potentialMatch.preferredName);
                debug.log();
            } else {
                // Create new character
                const newCharacter = await createCharacter(analyzedChar, isMainChar);
                await updateLorebookEntry(newCharacter, newCharacter.preferredName);
                debug.log();
            }
        }
    });
}

// ============================================================================
// TWO-PHASE DETECTION SYSTEM
// ============================================================================

/**
 * PHASE 1: Lightweight name extraction from message batch
 * Uses regex patterns to find all potential character names without LLM
 * @param {Array} messages - Messages to scan for names
 * @returns {Array} Array of unique name candidates found
 */
export function scanForNewNames(messages) {
    return withErrorBoundary('scanForNewNames', () => {
        debugLog(`[PHASE 1] Starting name scan on ${messages.length} messages`);

        if (!Array.isArray(messages) || messages.length === 0) {
            debugLog('[PHASE 1] No messages to scan');
            return [];
        }

        const foundNames = new Set();
        const existingCharacters = getCharacters();
        const existingNames = new Set();

        debugLog(`[PHASE 1] Existing characters in memory: ${Object.keys(existingCharacters).length}`);

        // Build set of existing character names and aliases
        for (const char of Object.values(existingCharacters)) {
            existingNames.add(char.preferredName.toLowerCase());
            if (char.aliases && Array.isArray(char.aliases)) {
                char.aliases.forEach(alias => existingNames.add(alias.toLowerCase()));
            }
        }

        const capitalizedFound = [];
        const quotedFound = [];
        const possessiveFound = [];

        // Scan messages for potential names
        for (const msg of messages) {
            if (!msg.mes || typeof msg.mes !== 'string') continue;

            const text = msg.mes;

            // Extract capitalized words (names)
            const capitalizedMatches = text.match(CAPITALIZED_WORD_REGEX) || [];
            capitalizedMatches.forEach(match => {
                const normalized = match.toLowerCase();
                if (!existingNames.has(normalized) && match.length > 1) {
                    foundNames.add(match);
                    capitalizedFound.push(match);
                }
            });

            // Extract quoted names
            const quotedMatches = text.match(QUOTED_NAME_REGEX) || [];
            quotedMatches.forEach(match => {
                const name = match.slice(1, -1); // Remove quotes
                const normalized = name.toLowerCase();
                if (!existingNames.has(normalized) && name.length > 1) {
                    foundNames.add(name);
                    quotedFound.push(name);
                }
            });

            // Extract possessive forms
            const possessiveMatches = text.match(POSSESSIVE_REGEX) || [];
            possessiveMatches.forEach(match => {
                const name = match.replace(/'s$/, '');
                const normalized = name.toLowerCase();
                if (!existingNames.has(normalized)) {
                    foundNames.add(name);
                    possessiveFound.push(name);
                }
            });
        }

        debugLog(`[PHASE 1] Capitalized names found: ${capitalizedFound.join(', ')}`);
        debugLog(`[PHASE 1] Quoted names found: ${quotedFound.join(', ')}`);
        debugLog(`[PHASE 1] Possessive forms found: ${possessiveFound.join(', ')}`);
        debugLog(`[PHASE 1] Total unique names to process: ${foundNames.size}`);

        return Array.from(foundNames);
    }, []);
}

/**
 * PHASE 2: Focused LLM analysis for new characters and existing character updates
 * Processes new names individually and updates existing characters that were mentioned
 * @param {Array} newNames - New character names to analyze
 * @param {Array} messages - Message context for character details
 * @param {Array} existingMentions - Names of existing characters mentioned in messages
 * @returns {Promise<Object>} Results of processing with success/error details
 */
export async function processPhaseTwoAnalysis(newNames, messages, existingMentions = []) {
    return withErrorBoundary('processPhaseTwoAnalysis', async () => {
        debugLog('[PHASE 2] Starting focused LLM analysis');
        debugLog(`[PHASE 2] New characters: ${newNames.length}, Existing mentions: ${existingMentions.length}`);
        debugLog(`[PHASE 2] Current context target: ${currentProcessingState.contextTarget}%`);

        const results = {
            newCharactersCreated: [],
            existingCharactersUpdated: [],
            failedCharacters: [],
            mergesDetected: [],
        };

        if (!Array.isArray(messages) || messages.length === 0) {
            debugLog('[PHASE 2] No messages provided, returning empty results');
            return results;
        }

        try {
            // Process new characters
            if (newNames && newNames.length > 0) {
                debugLog(`[PHASE 2] Processing ${newNames.length} new characters`);

                for (const newName of newNames) {
                    if (abortScan) {
                        debugLog(`[PHASE 2] Processing aborted by user at character: ${newName}`);
                        break;
                    }

                    try {
                        await processNewCharacter(newName, messages, results);
                    } catch (error) {
                        debugLog(`[PHASE 2] Failed to process new character ${newName}: ${error.message}`);
                        results.failedCharacters.push({ name: newName, error: error.message });
                        currentProcessingState.failedCharacters.push(newName);
                        currentProcessingState.lastError = error;

                        // If ENABLE_AUTO_RECOVERY, attempt to reduce context and retry
                        if (ENABLE_AUTO_RECOVERY && currentProcessingState.contextTarget > MIN_CONTEXT_TARGET) {
                            currentProcessingState.contextTarget -= CONTEXT_REDUCTION_STEP;
                            debugLog(`[PHASE 2] Auto-reducing context target to ${currentProcessingState.contextTarget}%`);
                        } else if (results.failedCharacters.length >= MAX_RETRY_ATTEMPTS) {
                            // Halt processing after max retries
                            throw new NameTrackerError(
                                `Processing halted: Maximum retries exceeded. Last error: ${error.message}`,
                                'PROCESSING_MAX_RETRIES',
                            );
                        }
                    }
                }
            }

            // Update existing characters mentioned in messages
            if (existingMentions && existingMentions.length > 0) {
                debug.log(`Phase 2: Updating ${existingMentions.length} existing characters`);

                for (const charName of existingMentions) {
                    if (abortScan) break;

                    try {
                        const existingChar = await findExistingCharacter(charName);
                        if (existingChar) {
                            await processExistingCharacter(existingChar, messages, results);
                        }
                    } catch (error) {
                        debug.log(`Failed to update character ${charName}: ${error.message}`);
                        results.failedCharacters.push({ name: charName, error: error.message });
                    }
                }
            }

        } catch (error) {
            debug.log(`Phase 2 analysis error: ${error.message}`);
            throw error;
        }

        return results;
    }, { newCharactersCreated: [], existingCharactersUpdated: [], failedCharacters: [], mergesDetected: [] });
}

/**
 * Process a new character: LLM analysis → create entry → check for merges
 * @private
 */
async function processNewCharacter(name, messages, results) {
    debugLog(`[P2-NewChar] Processing: ${name}`);

    // Build context with 3-message overlap for this character
    const characterContext = buildCharacterContext(name, messages, OVERLAP_SIZE);
    debugLog(`[P2-NewChar] Context window size: ${characterContext ? characterContext.length : 0} chars`);

    if (!characterContext || characterContext.length === 0) {
        debugLog(`[P2-NewChar] FAILED: No context for ${name}`);
        throw new NameTrackerError(`No context found for character: ${name}`, 'NO_CONTEXT');
    }

    // Analyze the character with LLM
    debugLog(`[P2-NewChar] Calling LLM for ${name}`);
    const characterData = await callLLMAnalysis([{ mes: characterContext }], [name], currentProcessingState.contextTarget);

    if (!characterData || characterData.length === 0) {
        debugLog(`[P2-NewChar] FAILED: LLM returned no data for ${name}`);
        throw new NameTrackerError(`LLM returned no data for character: ${name}`, 'LLM_EMPTY_RESPONSE');
    }

    debugLog(`[P2-NewChar] LLM returned data: ${JSON.stringify(characterData[0]).substring(0, 200)}...`);

    // Create the character
    const newCharacter = await createCharacter(characterData[0], false);
    await updateLorebookEntry(newCharacter, newCharacter.preferredName);

    results.newCharactersCreated.push(newCharacter.preferredName);
    debugLog(`[P2-NewChar] Successfully created: ${newCharacter.preferredName}`);

    // Re-check merge opportunities now that the character exists in the cache
    const potentialMerges = await detectMergeOpportunities(newCharacter.preferredName);
    if (potentialMerges && potentialMerges.length > 0) {
        debugLog(`[P2-NewChar] Merge opportunities: ${potentialMerges.map(m => `${m.targetName} (${Math.round(m.confidence * 100)}%)`).join(', ')}`);
        results.mergesDetected.push({ source: newCharacter.preferredName, targets: potentialMerges });

        for (const opportunity of potentialMerges) {
            if (opportunity.targetName === newCharacter.preferredName) {
                continue;
            }

            if (opportunity.confidence >= 0.9) {
                await mergeCharacters(newCharacter.preferredName, opportunity.targetName);
                notifications.success(`Auto-merged "${newCharacter.preferredName}" into "${opportunity.targetName}" (${Math.round(opportunity.confidence * 100)}% match)`, 'Character Merged');
                break; // stop after first high-confidence merge
            }

            if (opportunity.confidence >= 0.7) {
                notifications.info(`Possible duplicate: "${newCharacter.preferredName}" ≈ "${opportunity.targetName}" (${Math.round(opportunity.confidence * 100)}%). Review in settings if needed.`, 'Merge Suggested');
            }
        }
    }
}

/**
 * Process existing character: build context from last processed message → update entry
 * @private
 */
async function processExistingCharacter(existingChar, messages, results) {
    debug.log(`Updating existing character: ${existingChar.preferredName}`);

    // Build fresh context for this character from the current message window
    const characterContext = buildCharacterContext(existingChar.preferredName, messages, OVERLAP_SIZE);

    if (!characterContext || characterContext.length === 0) {
        debug.log(`No new context for character ${existingChar.preferredName} since last processing`);
        return;
    }

    // Analyze updated context for this character
    debugLog(`[P2-Existing] Calling LLM for ${existingChar.preferredName}`);
    const characterData = await callLLMAnalysis([{ mes: characterContext }], [existingChar.preferredName], currentProcessingState.contextTarget);

    if (!characterData || characterData.length === 0) {
        debugLog(`[P2-Existing] FAILED: LLM returned no data for ${existingChar.preferredName}`);
        throw new NameTrackerError(`LLM returned no data for character: ${existingChar.preferredName}`, 'LLM_EMPTY_RESPONSE');
    }

    // Update the character with new information
    await updateCharacter(existingChar, characterData[0], true, existingChar.isMainChar);
    await updateLorebookEntry(existingChar, existingChar.preferredName);

    results.existingCharactersUpdated.push(existingChar.preferredName);
    debugLog(`[P2-Existing] Successfully updated: ${existingChar.preferredName}`);
}

/**
 * Build contextual text window for a character from a set of messages.
 * Includes an overlap of messages before and after any detected mentions.
 * @param {string} characterName - Name of the character to search for
 * @param {Array} messages - Array of chat message objects ({ mes: string })
 * @param {number} overlapSize - Number of messages to include before/after mentions
 * @returns {string} Joined context text or empty string if no mentions
 */
function buildCharacterContext(characterName, messages, overlapSize) {
    if (!characterName || !Array.isArray(messages) || messages.length === 0) {
        return '';
    }

    const nameLower = String(characterName).toLowerCase();
    const mentionIndices = [];

    for (let i = 0; i < messages.length; i++) {
        const text = messages[i]?.mes || '';
        if (typeof text === 'string' && text.toLowerCase().includes(nameLower)) {
            mentionIndices.push(i);
        }
    }

    if (mentionIndices.length === 0) {
        return '';
    }

    const minIdx = Math.max(0, Math.min(...mentionIndices) - overlapSize);
    const maxIdx = Math.min(messages.length - 1, Math.max(...mentionIndices) + overlapSize);

    const windowTexts = [];
    for (let i = minIdx; i <= maxIdx; i++) {
        const text = messages[i]?.mes;
        if (text) {
            windowTexts.push(text);
        }
    }

    return windowTexts.join('\n\n');
}

/**
 * Build context starting from a specific message point (for continuing character updates)
 * @private
 */
// Note: Deprecated helper removed; continuing updates now use buildCharacterContext()

/**
 * Harvest and analyze messages
 * @param {number} messageCount - Number of recent messages to analyze
 * @param {boolean} showProgress - Whether to show progress notifications
 * @returns {Promise<void>}
 */
export async function harvestMessages(messageCount, showProgress = true) {
    return withErrorBoundary('harvestMessages', async () => {
        if (!get_settings('enabled', true)) {
            debug.log();
            return;
        }

        // Check API connection for SillyTavern mode
        const llmConfig = getLLMConfig();
        if (llmConfig.source === 'sillytavern') {
            const context = stContext.getContext();
            if (!context.onlineStatus) {
                notifications.warning('Please connect to an API (OpenAI, Claude, etc.) before analyzing messages');
                return;
            }
        }

        const context = stContext.getContext();
        if (!context.chat || context.chat.length === 0) {
            debug.log();
            notifications.info('No messages in chat to analyze');
            return;
        }

        // Get the messages to analyze - count forward and check token limits
        const endIdx = context.chat.length;
        const startIdx = Math.max(0, endIdx - messageCount);
        const messagesToAnalyze = context.chat.slice(startIdx, endIdx);

        debugLog(`[Batching] Message selection: startIdx=${startIdx}, endIdx=${endIdx}, requesting ${messageCount} messages, got ${messagesToAnalyze.length} messages`);

        let processedMessages = 0;

        // Check if messages fit in context window
        const maxPromptResult = await getMaxPromptLength();
        const maxPromptTokens = maxPromptResult.maxPrompt;
        const availableTokens = calculateAvailableTokens(maxPromptTokens);

        debugLog(`[Batching] Token budget: maxPromptTokens=${maxPromptTokens}, targetPercent=${TARGET_MESSAGE_PERCENT}%, availableTokens=${availableTokens}`);
        debugLog(`[Batching] Context target: ${currentProcessingState.contextTarget}%`);
        debugLog(`[Batching] Estimated reserves: systemPrompt=~1000tok, response=~4000tok, messages=${availableTokens}tok`);

        // Calculate actual token count for the requested messages
        const messageTokens = await calculateMessageTokens(messagesToAnalyze);

        debugLog(`[Batching] Total tokens for ${messagesToAnalyze.length} messages: ${messageTokens} tokens`);

        // If too large, split into batches
        if (messageTokens > availableTokens) {
            debugLog(`[Batching] Messages exceed token limit (${messageTokens} > ${availableTokens}), creating batches`);

            // Create batches using shared helper
            const batches = await createMessageBatches(messagesToAnalyze, availableTokens, true);

            // Log batch details for debugging
            const batchDetails = await Promise.all(batches.map(async (batch, i) => {
                const tokens = await calculateMessageTokens(batch);
                return `Batch ${i + 1}: ${batch.length}msg/${tokens}tok`;
            }));

            debugLog(`[Batching] Created ${batches.length} total batches: ${batchDetails.join(' | ')}`);
            debugLog(`[Batching] Constraints applied: MIN=${MIN_MESSAGES_PER_BATCH}, TARGET=${TARGET_MESSAGES_PER_BATCH}, MAX=${MAX_MESSAGES_PER_BATCH}, TokenLimit=${availableTokens}`);

            // Reset abort flag
            abortScan = false;

            // Calculate average batch size for user notification
            const avgBatchSize = Math.round(messagesToAnalyze.length / batches.length);
            const notification = `Analyzing ${messagesToAnalyze.length} messages in ${batches.length} batches (~${avgBatchSize} messages each). This may take a while. Continue?`;

            if (showProgress) {
                // Ask user before proceeding with large analysis
                const shouldProceed = confirm(notification);
                if (!shouldProceed) {
                    debugLog('[Batching] User cancelled batch processing');
                    abortScan = true;
                    return;
                }
            }

            // Show progress bar
            showProgressBar(0, batches.length, 'Starting analysis...');

            let successfulBatches = 0;
            let failedBatches = 0;
            const uniqueCharacters = new Set();

            debugLog(`[Batching] Starting batch processing loop: ${batches.length} batches`);

            // Process each batch
            for (let i = 0; i < batches.length; i++) {
                // Check if user aborted
                if (abortScan) {
                    debugLog(`[BatchProcessing] User aborted at batch ${i + 1}/${batches.length}`);
                    hideProgressBar();
                    notifications.warning('Analysis aborted');
                    return;
                }

                const batch = batches[i];

                // Calculate actual message range for this batch
                const batchStartMsg = batches.slice(0, i).reduce((sum, b) => sum + b.length, 0);
                const batchStart = startIdx + batchStartMsg;
                const batchEnd = batchStart + batch.length;

                debugLog(`[BatchProcessing] Processing batch ${i + 1}/${batches.length}: messages ${batchStart}-${batchEnd - 1} (${batch.length} messages)`);

                try {
                    showProgressBar(i + 1, batches.length, `Analyzing messages ${batchStart + 1}-${batchEnd}...`);

                    // Build roster of characters found so far
                    const characterRoster = buildCharacterRoster();

                    // Call LLM for analysis
                    const analysis = await callLLMAnalysis(batch, characterRoster);

                    console.log('[NT-Batch] 📊 LLM analysis returned');
                    console.log('[NT-Batch]    Type:', typeof analysis);
                    console.log('[NT-Batch]    Value:', analysis);
                    console.log('[NT-Batch]    Has characters?:', analysis && 'characters' in analysis);
                    console.log('[NT-Batch]    Characters type:', typeof analysis?.characters);
                    console.log('[NT-Batch]    Characters is Array?:', Array.isArray(analysis?.characters));
                    console.log('[NT-Batch]    Characters length:', analysis?.characters?.length);

                    // Process the analysis
                    if (analysis.characters && Array.isArray(analysis.characters)) {
                        console.log('[NT-Batch] ✅ Calling processAnalysisResults with', analysis.characters.length, 'characters');
                        await processAnalysisResults(analysis.characters);
                        analysis.characters.forEach(char => uniqueCharacters.add(char.name));
                        processedMessages += batch.length;
                    } else {
                        console.warn('[NT-Batch] ⚠️  Condition failed - not processing results');
                        console.warn('[NT-Batch]    analysis:', analysis);
                        console.warn('[NT-Batch]    analysis.characters:', analysis?.characters);
                    }

                    successfulBatches++;

                    // Small delay between batches to avoid rate limiting
                    if (i < batches.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }

                } catch (error) {
                    debugLog(`[BatchProcessing] ERROR in batch ${i + 1}: ${error.message}`);
                    debugLog(`[BatchProcessing] Context: messages ${batchStart}-${batchEnd - 1}, batch size ${batch.length}, token count calc error`);
                    console.error(`Error processing batch ${i + 1}:`, error);
                    failedBatches++;
                    notifications.error(`Batch ${i + 1} failed: ${error.message}`);
                    // Continue to next batch automatically to avoid blocking popups
                }
            }

            // Hide progress bar
            hideProgressBar();

            // Show summary
            const summary = `Analysis complete!

Batches processed: ${successfulBatches}/${batches.length}
Unique characters found: ${uniqueCharacters.size}
Failed batches: ${failedBatches}`;

            debugLog(`[BatchProcessing] Batch analysis complete: ${successfulBatches}/${batches.length} successful, ${failedBatches} failed, ${uniqueCharacters.size} characters found`);

            if (failedBatches > 0) {
                notifications.warning(summary, 'Batch Analysis', { timeOut: 8000 });
            } else {
                notifications.success(summary, 'Batch Analysis', { timeOut: 8000 });
            }

            // Persist scan progress and update UI
            if (processedMessages > 0) {
                const existingCount = get_settings('messageCounter', 0);
                set_settings('messageCounter', existingCount + processedMessages);
                set_settings('lastScannedMessageId', endIdx - 1);
                updateStatusDisplay();
            }

            return;
        }

        // Messages fit in one batch - process normally
        if (showProgress) {
            notifications.info(`Analyzing ${messagesToAnalyze.length} messages for character information...`);
        }

        try {
            // Build roster of characters found so far
            const characterRoster = buildCharacterRoster();

            // Call LLM for analysis with character context
            const analysis = await callLLMAnalysis(messagesToAnalyze, characterRoster);

            debug.log();

            // Process the analysis
            if (analysis.characters && Array.isArray(analysis.characters)) {
                await processAnalysisResults(analysis.characters);
                processedMessages += messagesToAnalyze.length;

                if (showProgress) {
                    notifications.success(`Found ${analysis.characters.length} character(s) in messages`);
                }
            } else {
                debug.log();
            }

        } catch (error) {
            console.error('Error during harvest:', error);
            notifications.error(`Analysis failed: ${error.message}`);
        }

        // Persist scan progress and update UI
        if (processedMessages > 0) {
            const existingCount = get_settings('messageCounter', 0);
            set_settings('messageCounter', existingCount + processedMessages);
            set_settings('lastScannedMessageId', endIdx - 1);
            updateStatusDisplay();
        }
    });
}

/**
 * Handle new message event
 * @param {number} messageId - ID of the new message
 * @returns {Promise<void>}
 */
export async function onMessageReceived(messageId) {
    return withErrorBoundary('onMessageReceived', async () => {
        if (!get_settings('enabled', true) || !get_settings('autoAnalyze', true)) {
            return;
        }

        const context = stContext.getContext();
        const chat = context.chat;

        if (!chat || chat.length === 0) {
            return;
        }

        // Get the current message index
        const currentMessageIndex = chat.length - 1;

        // Check if this message was already scanned
        const lastScannedId = get_settings('lastScannedMessageId', -1);
        if (currentMessageIndex <= lastScannedId) {
            debug.log();
            return;
        }

        // Detect if messages were deleted (current index jumped backwards)
        if (lastScannedId >= 0 && currentMessageIndex < lastScannedId) {
            debug.log();

            // Prompt user for rescan decision
            const shouldRescan = await showRescanModal(currentMessageIndex, lastScannedId);

            if (shouldRescan.rescan) {
                set_settings('lastScannedMessageId', shouldRescan.fromMessage - 1);

                // Queue a full scan from the specified message
                addToQueue(async () => {
                    await harvestMessages(currentMessageIndex - shouldRescan.fromMessage + 1, true);
                });

                return;
            } else {
                // Reset to current position without scanning
                set_settings('lastScannedMessageId', currentMessageIndex);
                return;
            }
        }

        // Check if we've reached the next scan milestone
        const messageFreq = get_settings('messageFrequency', 10);
        const messagesSinceLastScan = currentMessageIndex - lastScannedId;

        if (messagesSinceLastScan >= messageFreq) {
            debug.log();

            // Queue harvest
            addToQueue(async () => {
                await harvestMessages(messageFreq, true);
                // Update last scanned message ID after successful harvest
                set_settings('lastScannedMessageId', currentMessageIndex);
            });
        }
    });
}

/**
 * Show rescan modal when message deletion is detected
 * @param {number} currentMessageIndex - Current message index
 * @param {number} lastScannedId - Last scanned message ID
 * @returns {Promise<Object>} Rescan decision
 */
async function showRescanModal(currentMessageIndex, lastScannedId) {
    return new Promise((resolve) => {
        const modal = $(`
            <div class="name-tracker-rescan-modal" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: var(--SmartThemeBodyColor); border: 2px solid var(--SmartThemeBorderColor); padding: 20px; border-radius: 10px; z-index: 9999; max-width: 500px;">
                <h3>Message History Changed</h3>
                <p>Messages have been deleted or edited. Would you like to rescan the chat?</p>
                <p>Current last scanned message: ${lastScannedId}<br>
                Current message index: ${currentMessageIndex}</p>
                <div style="margin-top: 15px;">
                    <label>Rescan from message: <input type="number" id="rescan-from" value="0" min="0" max="${currentMessageIndex}" style="width: 80px; margin-left: 10px;"></label>
                </div>
                <div style="margin-top: 15px; text-align: right;">
                    <button id="rescan-yes" class="menu_button">Rescan</button>
                    <button id="rescan-no" class="menu_button">Skip</button>
                </div>
            </div>
        `);

        $('body').append(modal);

        modal.find('#rescan-yes').on('click', () => {
            const fromMessage = parseInt(modal.find('#rescan-from').val()) || 0;
            modal.remove();
            resolve({ rescan: true, fromMessage });
        });

        modal.find('#rescan-no').on('click', () => {
            modal.remove();
            resolve({ rescan: false });
        });
    });
}

/**
 * Show progress bar for batch scanning
 * @param {number} current - Current batch number (1-indexed)
 * @param {number} total - Total number of batches
 * @param {string} status - Status message
 */
function showProgressBar(current, total, status = '') {
    const progressBarId = 'name_tracker_progress';
    const $existing = $(`.${progressBarId}`);

    if ($existing.length > 0) {
        // Update existing progress bar
        if (status) $existing.find('.title').text(status);
        $existing.find('.progress').text(current);
        $existing.find('.total').text(total);
        $existing.find('progress').val(current).attr('max', total);
        return;
    }

    // Create new progress bar
    const bar = $(`
        <div class="${progressBarId} name_tracker_progress_bar flex-container justifyspacebetween alignitemscenter" style="
            padding: 10px;
            margin: 5px 0;
            background: var(--SmartThemeBlurTintColor);
            border: 1px solid var(--SmartThemeBorderColor);
            border-radius: 5px;
        ">
            <div class="title" style="flex: 1; font-weight: bold;">${status || 'Name Tracker Scan'}</div>
            <div style="margin: 0 10px;">(<span class="progress">${current}</span> / <span class="total">${total}</span>)</div>
            <progress value="${current}" max="${total}" style="flex: 2; margin: 0 10px;"></progress>
            <button class="menu_button fa-solid fa-stop" title="Abort scan" style="padding: 5px 10px;"></button>
        </div>
    `);

    // Add click event to abort the scan
    bar.find('button').on('click', function() {
        abortScan = true;
        hideProgressBar();
        notifications.warning('Scan aborted by user');
    });

    // Append to the main chat area (#sheld)
    $('#sheld').append(bar);
}

/**
 * Hide and remove progress bar
 */
function hideProgressBar() {
    const progressBarId = 'name_tracker_progress';
    const $existing = $(`.${progressBarId}`);
    if ($existing.length > 0) {
        $existing.fadeOut(300, function() {
            $(this).remove();
        });
    }
}

/**
 * Scan entire chat in batches from oldest to newest
 * @returns {Promise<void>}
 */
export async function scanEntireChat() {
    return withErrorBoundary('scanEntireChat', async () => {
        // CRITICAL: Ensure lorebook is initialized BEFORE processing
        console.log('[NT-Processing] 🔧 Ensuring lorebook is initialized before scan...');
        const { initializeLorebook } = await import('./lorebook.js');
        await initializeLorebook();
        console.log('[NT-Processing] ✅ Lorebook initialization complete');

        const context = stContext.getContext();

        if (!context.chat || context.chat.length === 0) {
            notifications.warning('No chat messages to scan');
            return;
        }

        // Check API connection for SillyTavern mode
        const llmConfig = getLLMConfig();
        if (llmConfig.source === 'sillytavern') {
            if (!context.onlineStatus) {
                notifications.warning('Please connect to an API (OpenAI, Claude, etc.) before analyzing messages');
                return;
            }
        }

        const totalMessages = context.chat.length;

        // Calculate optimal batch size based on context window
        const maxPromptResult = await getMaxPromptLength();
        const maxPromptTokens = maxPromptResult.maxPrompt;
        const availableTokens = calculateAvailableTokens(maxPromptTokens);

        // Build batches using shared helper
        const batches = await createMessageBatches(context.chat, availableTokens, false);

        const numBatches = batches.length;

        const confirmed = confirm(`This will analyze all ${totalMessages} messages in ${numBatches} batches. This may take a while. Continue?`);

        if (!confirmed) {
            return;
        }

        // Reset abort flag
        abortScan = false;

        // Show progress bar
        showProgressBar(0, numBatches, 'Starting batch scan...');

        let successfulBatches = 0;
        let failedBatches = 0;
        let processedMessages = 0;
        const uniqueCharacters = new Set(); // Track unique character names

        // Process from oldest to newest
        for (let i = 0; i < numBatches; i++) {
            // Check if user aborted
            if (abortScan) {
                debug.log();
                break;
            }

            const batchMessages = batches[i];

            // Calculate message range for progress display
            const startIdx = batches.slice(0, i).reduce((sum, b) => sum + b.length, 0);
            const endIdx = startIdx + batchMessages.length;

            try {
                showProgressBar(i + 1, numBatches, `Processing messages ${startIdx + 1}-${endIdx}...`);

                // Build roster of characters found so far
                const characterRoster = buildCharacterRoster();

                // Call LLM for analysis with character context
                const analysis = await callLLMAnalysis(batchMessages, characterRoster);

                // Process the analysis
                if (analysis.characters && Array.isArray(analysis.characters)) {
                    await processAnalysisResults(analysis.characters);
                    // Track unique characters
                    analysis.characters.forEach(char => uniqueCharacters.add(char.name));
                    processedMessages += batchMessages.length;
                }

                successfulBatches++;

                // Small delay between batches
                if (i < numBatches - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

            } catch (error) {
                console.error(`Error processing batch ${i + 1}:`, error);
                failedBatches++;
                notifications.error(`Batch ${i + 1} failed: ${error.message}`);
                // Continue to next batch automatically to avoid blocking popups
            }
        }

        // Hide progress bar
        hideProgressBar();

        // Update scan completion status
        set_settings('lastScannedMessageId', totalMessages - 1);

        if (processedMessages > 0) {
            const existingCount = get_settings('messageCounter', 0);
            set_settings('messageCounter', existingCount + processedMessages);
            updateStatusDisplay();
        }

        // Show summary
        const summary = `Full chat scan complete!\n\nMessages: ${totalMessages}\nBatches: ${successfulBatches}/${numBatches}\nCharacters found: ${uniqueCharacters.size}\nFailed: ${failedBatches}`;

        // Ensure summary is a string (defense against undefined values)
        const safeSummary = String(summary || 'Scan completed');

        if (failedBatches > 0) {
            notifications.warning(safeSummary, 'Scan Complete', { timeOut: 10000 });
        } else {
            notifications.success(safeSummary, 'Scan Complete', { timeOut: 10000 });
        }
    });
}

/**
 * Add task to processing queue
 * @param {Function} task - Async function to execute
 * @returns {Promise<void>}
 */
export async function addToQueue(task) {
    return withErrorBoundary('addToQueue', async () => {
        processingQueue.push(task);

        if (!isProcessing) {
            await processQueue();
        }
    });
}

/**
 * Process queued tasks
 * @returns {Promise<void>}
 */
export async function processQueue() {
    return withErrorBoundary('processQueue', async () => {
        if (isProcessing || processingQueue.length === 0) {
            return;
        }

        isProcessing = true;

        while (processingQueue.length > 0) {
            const task = processingQueue.shift();
            try {
                await task();
            } catch (error) {
                console.error('Error processing queue task:', error);
            }
        }

        isProcessing = false;
    });
}

/**
 * Handle chat changed event
 * @returns {Promise<void>}
 */
export async function onChatChanged() {
    return withErrorBoundary('onChatChanged', async () => {
        debug.log();

        // Clear processing state
        processingQueue = [];
        isProcessing = false;
        abortScan = false;

        // Reset scan state
        set_settings('lastScannedMessageId', -1);
        set_settings('messageCounter', 0);

        updateStatusDisplay();

        debug.log();
    });
}

/**
 * Clear the processing queue
 */
export function clearProcessingQueue() {
    processingQueue = [];
    isProcessing = false;
    debug.log();
}

/**
 * Get processing status
 * @returns {Object} Processing status information
 */
export function getProcessingStatus() {
    return {
        isProcessing,
        queueLength: processingQueue.length,
        abortScan,
    };
}

/**
 * Abort current scan operation
 */
export function abortCurrentScan() {
    abortScan = true;
    hideProgressBar();
    debug.log();
}
