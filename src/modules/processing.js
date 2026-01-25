/**
 * Message Processing Module
 *
 * Handles message analysis workflows, batch processing, and SillyTavern event handling
 * for the Name Tracker extension.
 */

import { createModuleLogger } from '../core/debug.js';
import { withErrorBoundary } from '../core/errors.js';
import { settings } from '../core/settings.js';
import { stContext } from '../core/context.js';
import { NotificationManager } from '../utils/notifications.js';
import { callLLMAnalysis, buildCharacterRoster, getMaxPromptLength, calculateMessageTokens } from './llm.js';
import { createCharacter, updateCharacter, findExistingCharacter, findPotentialMatch, isIgnoredCharacter } from './characters.js';
import { updateLorebookEntry } from './lorebook.js';

const debug = createModuleLogger('processing');
const notifications = new NotificationManager('Message Processing');

// Processing state
let processingQueue = [];
let isProcessing = false;
let abortScan = false;

/**
 * Process analysis results from LLM
 * @param {Array} analyzedCharacters - Array of character data from LLM
 * @returns {Promise<void>}
 */
export async function processAnalysisResults(analyzedCharacters) {
    return withErrorBoundary('processAnalysisResults', async () => {
        if (!analyzedCharacters || !Array.isArray(analyzedCharacters)) {
            debug.log();
            return;
        }

        debug.log();

        for (const analyzedChar of analyzedCharacters) {
            try {
                await processCharacterData(analyzedChar);
            } catch (error) {
                console.error(`Error processing character ${analyzedChar.name}:`, error);
                // Continue with other characters
            }
        }
    });
}

/**
 * Process individual character data from LLM analysis
 * @param {Object} analyzedChar - Character data from LLM
 * @returns {Promise<void>}
 */
async function processCharacterData(analyzedChar) {
    return withErrorBoundary('processCharacterData', async () => {
        if (!analyzedChar.name || analyzedChar.name.trim() === '') {
            debug.log();
            return;
        }

        const characterName = analyzedChar.name.trim();

        // Check if character is ignored
        if (isIgnoredCharacter(characterName)) {
            debug.log();
            return;
        }

        // Check for main character detection
        const isMainChar = characterName.toLowerCase().includes('{{char}}') ||
                          analyzedChar.isMainCharacter === true ||
                          analyzedChar.role === 'main';

        // Check if character already exists
        const existingChar = findExistingCharacter(characterName);

        if (existingChar) {
            // Update existing character
            await updateCharacter(existingChar, analyzedChar, false, isMainChar);
            await updateLorebookEntry(existingChar, existingChar.preferredName);
            debug.log();
        } else {
            // Check for potential matches (similar names)
            const potentialMatch = await findPotentialMatch(analyzedChar);

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

/**
 * Harvest and analyze messages
 * @param {number} messageCount - Number of recent messages to analyze
 * @param {boolean} showProgress - Whether to show progress notifications
 * @returns {Promise<void>}
 */
export async function harvestMessages(messageCount, showProgress = true) {
    return withErrorBoundary('harvestMessages', async () => {
        if (!settings.getSetting('enabled', true)) {
            debug.log();
            return;
        }

        // Check API connection for SillyTavern mode
        const llmConfig = settings.getLLMConfig();
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

        // Check if messages fit in context window
        const maxPromptTokens = await getMaxPromptLength();
        const availableTokens = maxPromptTokens - 1000; // Reserve for system prompt and response

        // Calculate actual token count for the requested messages
        const messageTokens = await calculateMessageTokens(messagesToAnalyze);

        // If too large, split into batches
        if (messageTokens > availableTokens) {
            debug.log();

            // Calculate optimal batch size based on tokens
            const batches = [];
            let currentBatch = [];
            let currentTokens = 0;

            // Build batches by adding messages until token limit
            for (const msg of messagesToAnalyze) {
                const msgTokens = await calculateMessageTokens([msg]);

                if (currentTokens + msgTokens > availableTokens && currentBatch.length > 0) {
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

            if (showProgress) {
                notifications.info(`Splitting into ${batches.length} batches to fit context window`);
            }

            // Reset abort flag
            abortScan = false;

            // Show progress bar
            showProgressBar(0, batches.length, 'Starting analysis...');

            let successfulBatches = 0;
            let failedBatches = 0;
            const uniqueCharacters = new Set();

            // Process each batch
            for (let i = 0; i < batches.length; i++) {
                // Check if user aborted
                if (abortScan) {
                    debug.log();
                    hideProgressBar();
                    notifications.warning('Analysis aborted');
                    return;
                }

                const batch = batches[i];

                // Calculate actual message range for this batch
                const batchStartMsg = batches.slice(0, i).reduce((sum, b) => sum + b.length, 0);
                const batchStart = startIdx + batchStartMsg;
                const batchEnd = batchStart + batch.length;

                try {
                    showProgressBar(i + 1, batches.length, `Analyzing messages ${batchStart + 1}-${batchEnd}...`);

                    // Build roster of characters found so far
                    const characterRoster = buildCharacterRoster();

                    // Call LLM for analysis
                    const analysis = await callLLMAnalysis(batch, characterRoster);

                    // Process the analysis
                    if (analysis.characters && Array.isArray(analysis.characters)) {
                        await processAnalysisResults(analysis.characters);
                        analysis.characters.forEach(char => uniqueCharacters.add(char.name));
                    }

                    successfulBatches++;

                    // Small delay between batches to avoid rate limiting
                    if (i < batches.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }

                } catch (error) {
                    console.error(`Error processing batch ${i + 1}:`, error);
                    failedBatches++;

                    // Ask user if they want to continue
                    const continueOnError = confirm(`Batch ${i + 1} failed.\\n\\nError: ${error.message}\\n\\nContinue with remaining batches?`);
                    if (!continueOnError) {
                        break;
                    }
                }
            }

            // Hide progress bar
            hideProgressBar();

            // Show summary
            const summary = `Analysis complete!\\n\\nBatches processed: ${successfulBatches}/${batches.length}\\nUnique characters found: ${uniqueCharacters.size}\\nFailed batches: ${failedBatches}`;
            if (failedBatches > 0) {
                notifications.warning(summary, { timeOut: 8000 });
            } else {
                notifications.success(summary, { timeOut: 8000 });
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
    });
}

/**
 * Handle new message event
 * @param {number} messageId - ID of the new message
 * @returns {Promise<void>}
 */
export async function onMessageReceived(messageId) {
    return withErrorBoundary('onMessageReceived', async () => {
        if (!settings.getSetting('enabled', true) || !settings.getSetting('autoAnalyze', true)) {
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
        const lastScannedId = settings.getSetting('lastScannedMessageId', -1);
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
                settings.setSetting('lastScannedMessageId', shouldRescan.fromMessage - 1);

                // Queue a full scan from the specified message
                addToQueue(async () => {
                    await harvestMessages(currentMessageIndex - shouldRescan.fromMessage + 1, true);
                });

                return;
            } else {
                // Reset to current position without scanning
                settings.setSetting('lastScannedMessageId', currentMessageIndex);
                return;
            }
        }

        // Check if we've reached the next scan milestone
        const messageFreq = settings.getSetting('messageFrequency', 10);
        const messagesSinceLastScan = currentMessageIndex - lastScannedId;

        if (messagesSinceLastScan >= messageFreq) {
            debug.log();

            // Queue harvest
            addToQueue(async () => {
                await harvestMessages(messageFreq, true);
                // Update last scanned message ID after successful harvest
                settings.setSetting('lastScannedMessageId', currentMessageIndex);
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
        const context = stContext.getContext();

        if (!context.chat || context.chat.length === 0) {
            notifications.warning('No chat messages to scan');
            return;
        }

        // Check API connection for SillyTavern mode
        const llmConfig = settings.getLLMConfig();
        if (llmConfig.source === 'sillytavern') {
            if (!context.onlineStatus) {
                notifications.warning('Please connect to an API (OpenAI, Claude, etc.) before analyzing messages');
                return;
            }
        }

        const totalMessages = context.chat.length;

        // Calculate optimal batch size based on context window
        const maxPromptTokens = await getMaxPromptLength();
        const availableTokens = maxPromptTokens - 1000;

        // Build batches dynamically based on token counts
        const batches = [];
        let currentBatch = [];
        let currentTokens = 0;

        for (let i = 0; i < totalMessages; i++) {
            const msg = context.chat[i];
            const msgTokens = await calculateMessageTokens([msg]);

            if (currentTokens + msgTokens > availableTokens && currentBatch.length > 0) {
                // Current batch is full, save it and start new one
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
                }

                successfulBatches++;

                // Small delay between batches
                if (i < numBatches - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

            } catch (error) {
                console.error(`Error processing batch ${i + 1}:`, error);
                failedBatches++;

                // Auto-retry logic could be added here
                const continueOnError = confirm(`Batch ${i + 1} failed.\\n\\nError: ${error.message}\\n\\nContinue with remaining batches?`);
                if (!continueOnError) {
                    break;
                }
            }
        }

        // Hide progress bar
        hideProgressBar();

        // Update scan completion status
        settings.setSetting('lastScannedMessageId', totalMessages - 1);

        // Show summary
        const summary = `Full chat scan complete!\\n\\nMessages: ${totalMessages}\\nBatches: ${successfulBatches}/${numBatches}\\nCharacters found: ${uniqueCharacters.size}\\nFailed: ${failedBatches}`;
        if (failedBatches > 0) {
            notifications.warning(summary, { timeOut: 10000 });
        } else {
            notifications.success(summary, { timeOut: 10000 });
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
        settings.setSetting('lastScannedMessageId', -1);
        settings.setSetting('messageCounter', 0);

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
