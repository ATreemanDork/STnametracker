/**
 * LLM Integration Module
 *
 * Handles LLM API calls to SillyTavern and Ollama for character analysis.
 * Includes conservative parameter settings, token management, context window handling,
 * and JSON parsing for deterministic character extraction.
 */

import { createModuleLogger } from '../core/debug.js';
import { withErrorBoundary, NameTrackerError } from '../core/errors.js';
import { get_settings, getCharacters, getLLMConfig } from '../core/settings.js';
import { stContext } from '../core/context.js';
import { simpleHash } from '../utils/helpers.js';
import { NotificationManager } from '../utils/notifications.js';

const debug = createModuleLogger('llm');
const notifications = new NotificationManager('LLM Integration');

// ============================================================================
// DEBUG CONFIGURATION
// ============================================================================
const DEBUG_LOGGING = true; // Set to false in production after testing

function debugLog(message, data = null) {
    if (DEBUG_LOGGING) {
        console.log(`[NT-LLM] ${message}`, data || '');
    }
}

// ============================================================================
// CONFIGURATION CONSTANTS - Conservative parameters for deterministic output
// ============================================================================
// These hardcoded values ensure reliable JSON extraction with minimal hallucination.
// They override user chat settings specifically for character analysis operations.

// Generation Parameters (Anti-hallucination configuration)
const GENERATION_TEMPERATURE = 0.2;     // Very low for deterministic output
const GENERATION_TOP_P = 0.85;          // Slightly reduced nucleus sampling
const GENERATION_TOP_K = 25;            // Standard focused sampling
const GENERATION_REP_PEN = 1.1;         // Slight repetition penalty

// Context Window Management
// Reserved for future dynamic context management
// eslint-disable-next-line no-unused-vars
const RESPONSE_BUFFER_PERCENT = 25;     // Reserve 25% for response generation
// eslint-disable-next-line no-unused-vars
const SAFETY_MARGIN_PERCENT = 10;       // Reserve 10% safety margin
// eslint-disable-next-line no-unused-vars
const MIN_RESPONSE_TOKENS = 1000;       // Minimum tokens allowed for response

// Ollama-Specific Parameters
// eslint-disable-next-line no-unused-vars
const OLLAMA_MIN_PREDICT = 500;         // Minimum tokens to predict
// eslint-disable-next-line no-unused-vars
const OLLAMA_MAX_PREDICT = 4000;        // Maximum tokens to predict

// Cache Configuration
// eslint-disable-next-line no-unused-vars
const CACHE_MAX_ENTRIES = 50;           // Maximum cached analysis results
// eslint-disable-next-line no-unused-vars
const CACHE_INVALIDATION_TIME = 3600000; // 1 hour cache duration

// LLM state management
const analysisCache = new Map(); // Cache for LLM analysis results
let ollamaModels = []; // Available Ollama models

/**
 * Default system prompt for character analysis
 */
const DEFAULT_SYSTEM_PROMPT = `Extract character information from messages and return ONLY a JSON object.

CRITICAL: Your entire response must be a single JSON object starting with { and ending with }

DO NOT include:
- Any text before the JSON
- Any text after the JSON  
- Code block markers
- Explanations or commentary

REQUIRED JSON structure (copy this exact format):
{
  "characters": [
    {
      "name": "Character name",
      "aliases": ["Other names"],
      "physicalAge": "Age if mentioned",
      "mentalAge": "Mental age if different",
      "physical": "Physical description",
      "personality": "Personality traits",
      "sexuality": "Sexual orientation if mentioned",
      "raceEthnicity": "Race/ethnicity if mentioned",
      "roleSkills": "Job/role/skills",
      "lastInteraction": "Recent interaction with user",
      "relationships": ["Relationships with other characters"],
      "confidence": 75
    }
  ]
}

Rules:
- Only extract clearly named speaking characters
- Skip generic references ("the waiter", "a woman")
- Use most recent information for conflicts
- Empty array if no clear characters: {"characters":[]}
- Confidence: 90+ (explicit), 70-89 (clear), 50-69 (mentioned), <50 (vague)

Your response must start with { immediately.`;

/**
 * Get the system prompt for analysis
 * @returns {string} System prompt text
 */
function getSystemPrompt() {
    const settings = get_settings();
    const prompt = settings?.systemPrompt || DEFAULT_SYSTEM_PROMPT;
    // Ensure we return a string, not a Promise or object
    return typeof prompt === 'string' ? prompt : DEFAULT_SYSTEM_PROMPT;
}

/**
 * Load available Ollama models
 * @returns {Promise<Array>} Array of available models
 */
export async function loadOllamaModels() {
    return withErrorBoundary('loadOllamaModels', async () => {
        const ollamaEndpoint = get_settings('ollamaEndpoint', 'http://localhost:11434');
        debugLog(`[OllamaModels] Loading models from ${ollamaEndpoint}`);

        try {
            const response = await fetch(`${ollamaEndpoint}/api/tags`);

            if (!response.ok) {
                throw new Error(`Failed to connect to Ollama: ${response.statusText}`);
            }

            const data = await response.json();
            ollamaModels = data.models || [];
            debugLog(`[OllamaModels] Found ${ollamaModels.length} models: ${ollamaModels.map(m => m.name).join(', ')}`);

            return ollamaModels;
        } catch (error) {
            console.error('Error loading Ollama models:', error);
            notifications.error('Failed to load Ollama models. Check endpoint and try again.');
            throw error;
        }
    });
}

/**
 * Get Ollama model context size
 * @param {string} modelName - Name of the Ollama model
 * @returns {Promise<number>} Context size in tokens, or default 4096
 */
export async function getOllamaModelContext(modelName) {
    return withErrorBoundary('getOllamaModelContext', async () => {
        const ollamaEndpoint = get_settings('ollamaEndpoint', 'http://localhost:11434');

        if (!modelName) {
            debug.log();
            return 4096;
        }

        try {
            const response = await fetch(`${ollamaEndpoint}/api/show`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: modelName,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch model info: ${response.statusText}`);
            }

            const data = await response.json();

            // Look for num_ctx in parameters array
            if (data.parameters && Array.isArray(data.parameters)) {
                for (const param of data.parameters) {
                    const match = param.match(/num_ctx\\s+(\\d+)/);
                    if (match) {
                        const contextSize = parseInt(match[1]);
                        debug.log();
                        return contextSize;
                    }
                }
            }

            // Fallback: check if it's in model details
            if (data.model_info && data.model_info.num_ctx) {
                const contextSize = parseInt(data.model_info.num_ctx);
                debug.log();
                return contextSize;
            }

            debug.log();
            return 4096;
        } catch (error) {
            console.error('Error fetching Ollama model context:', error);
            debug.log();
            return 4096;
        }
    });
}

/**
 * Build a roster of known characters for context
 * @returns {string} Formatted roster text
 */
export function buildCharacterRoster() {
    return withErrorBoundary('buildCharacterRoster', () => {
        const characters = getCharacters();
        const characterNames = Object.keys(characters);

        if (characterNames.length === 0) {
            return '';
        }

        const roster = characterNames.map(name => {
            const char = characters[name];
            const aliases = char.aliases && char.aliases.length > 0
                ? ` (also known as: ${char.aliases.join(', ')})`
                : '';
            const relationships = char.relationships && char.relationships.length > 0
                ? `\\n    Relationships: ${char.relationships.join('; ')}`
                : '';
            return `  - ${name}${aliases}${relationships}`;
        }).join('\\n');

        return `\\n\\n[KNOWN CHARACTERS]\\nThe following characters have already been identified. If you encounter them again, use the same name and add any new details:\\n${roster}\\n`;
    });
}

/**
 * Get the maximum safe prompt length based on API context window
 * Uses actual token counts from messages when available
 * @returns {Promise<number>} Maximum prompt length in tokens
 */
export async function getMaxPromptLength() {
    return withErrorBoundary('getMaxPromptLength', async () => {
        const detectionLog = []; // Track detection attempts
        const logEntry = (msg) => {
            detectionLog.push(msg);
            console.log(`[NT-MaxContext] ${msg}`);
        };

        try {
            const llmConfig = getLLMConfig();
            let maxContext = 4096; // Default
            let maxGenTokens = 2048; // Default generation limit
            let detectionMethod = 'fallback';

            logEntry(`Starting context detection for LLM source: ${llmConfig.source}`);

            if (llmConfig.source === 'ollama' && llmConfig.ollamaModel) {
                logEntry(`Using Ollama model: ${llmConfig.ollamaModel}`);
                // Get Ollama model's context size
                maxContext = await getOllamaModelContext(llmConfig.ollamaModel);
                detectionMethod = 'ollama';
            } else {
                logEntry(`Using SillyTavern context`);
                // Use SillyTavern's context
                let context = null;
                
                try {
                    context = stContext.getContext();
                    logEntry(`Successfully retrieved SillyTavern context`);
                } catch (error) {
                    logEntry(`ERROR: Failed to get context: ${error.message}`);
                    context = null;
                }

                // Debug: Log all context properties
                if (context) {
                    try {
                        const contextKeys = Object.keys(context);
                        const relevantKeys = contextKeys.filter(k => 
                            k.toLowerCase().includes('max') || 
                            k.toLowerCase().includes('context') ||
                            k.toLowerCase().includes('token') ||
                            k.toLowerCase().includes('prompt')
                        );
                        logEntry(`Available context properties: ${relevantKeys.join(', ')}`);
                    } catch (e) {
                        logEntry(`Error analyzing context keys: ${e.message}`);
                    }
                }

                // Try multiple possible paths for max context
                let detectedMaxContext = null;

                // Method 1: Direct maxContext property (PRIMARY)
                logEntry(`Method 1: Checking context.maxContext...`);
                if (context && typeof context.maxContext === 'number' && context.maxContext > 0) {
                    detectedMaxContext = context.maxContext;
                    logEntry(`✓ Method 1 SUCCESS: context.maxContext = ${detectedMaxContext}`);
                    detectionMethod = 'context.maxContext';
                } else {
                    const reason = !context ? 'context is null' : 
                                   typeof context.maxContext !== 'number' ? `type is ${typeof context.maxContext}` :
                                   context.maxContext <= 0 ? `value is ${context.maxContext}` : 'unknown';
                    logEntry(`✗ Method 1 FAILED: ${reason}`);
                }

                // Method 2: extensionSettings.common.maxContext path
                if (!detectedMaxContext) {
                    logEntry(`Method 2: Checking context.extensionSettings.common.maxContext...`);
                    if (context?.extensionSettings?.common) {
                        if (typeof context.extensionSettings.common.maxContext === 'number' && context.extensionSettings.common.maxContext > 0) {
                            detectedMaxContext = context.extensionSettings.common.maxContext;
                            logEntry(`✓ Method 2 SUCCESS: extensionSettings.common.maxContext = ${detectedMaxContext}`);
                            detectionMethod = 'extensionSettings.common.maxContext';
                        } else {
                            logEntry(`✗ Method 2 FAILED: extensionSettings.common exists but maxContext is invalid`);
                        }
                    } else {
                        logEntry(`✗ Method 2 FAILED: extensionSettings.common path does not exist`);
                    }
                }

                // Method 3: chat.maxContextSize path
                if (!detectedMaxContext) {
                    logEntry(`Method 3: Checking context.chat.maxContextSize...`);
                    if (context?.chat && typeof context.chat === 'object' && !Array.isArray(context.chat)) {
                        if (typeof context.chat.maxContextSize === 'number' && context.chat.maxContextSize > 0) {
                            detectedMaxContext = context.chat.maxContextSize;
                            logEntry(`✓ Method 3 SUCCESS: chat.maxContextSize = ${detectedMaxContext}`);
                            detectionMethod = 'chat.maxContextSize';
                        } else {
                            logEntry(`✗ Method 3 FAILED: chat exists but maxContextSize is invalid`);
                        }
                    } else {
                        logEntry(`✗ Method 3 FAILED: chat path does not exist or is an array`);
                    }
                }

                // Method 4: token_limit
                if (!detectedMaxContext) {
                    logEntry(`Method 4: Checking context.token_limit...`);
                    if (context && typeof context.token_limit === 'number' && context.token_limit > 0) {
                        detectedMaxContext = context.token_limit;
                        logEntry(`✓ Method 4 SUCCESS: token_limit = ${detectedMaxContext}`);
                        detectionMethod = 'token_limit';
                    } else {
                        logEntry(`✗ Method 4 FAILED: token_limit is not valid`);
                    }
                }

                // Method 5: amount_gen (maximum generation tokens)
                if (!detectedMaxContext) {
                    logEntry(`Method 5: Checking context.amount_gen (fallback)...`);
                    if (context && typeof context.amount_gen === 'number' && context.amount_gen > 0) {
                        // amount_gen is typically small (generation limit), not context size
                        // Use as indicator if no other value found
                        detectedMaxContext = context.amount_gen * 4; // Rough estimate
                        logEntry(`✓ Method 5 FALLBACK: amount_gen = ${context.amount_gen}, estimated context = ${detectedMaxContext}`);
                        detectionMethod = 'amount_gen_estimate';
                    } else {
                        logEntry(`✗ Method 5 FAILED: amount_gen is not valid`);
                    }
                }

                // Method 6: Check settings object directly
                if (!detectedMaxContext) {
                    logEntry(`Method 6: Checking context.settings.max_context...`);
                    if (context && typeof context.settings === 'object') {
                        if (typeof context.settings.max_context === 'number' && context.settings.max_context > 0) {
                            detectedMaxContext = context.settings.max_context;
                            logEntry(`✓ Method 6 SUCCESS: settings.max_context = ${detectedMaxContext}`);
                            detectionMethod = 'settings.max_context';
                        } else {
                            logEntry(`✗ Method 6 FAILED: settings exists but max_context is invalid`);
                        }
                    } else {
                        logEntry(`✗ Method 6 FAILED: settings path does not exist`);
                    }
                }

                // Final check: is detected value reasonable?
                if (detectedMaxContext && (typeof detectedMaxContext !== 'number' || detectedMaxContext < 100)) {
                    logEntry(`WARNING: Detected maxContext is not valid: ${detectedMaxContext}, type: ${typeof detectedMaxContext}`);
                    detectedMaxContext = null;
                }

                // Check if context is fully loaded
                if (!context || !detectedMaxContext) {
                    logEntry(`WARNING: Could not detect maxContext from any path, using fallback (4096)`);
                    logEntry(`Context exists: ${!!context}, detectedMaxContext: ${detectedMaxContext}`);
                    if (context) {
                        try {
                            const allKeys = Object.keys(context).sort();
                            logEntry(`Full context object keys (first 20): ${allKeys.slice(0, 20).join(', ')}${allKeys.length > 20 ? `... (${allKeys.length - 20} more)` : ''}`);
                        } catch (e) {
                            logEntry(`Could not enumerate context keys: ${e.message}`);
                        }
                    }
                    maxContext = 4096;
                    maxGenTokens = 1024;
                    detectionMethod = 'fallback';
                } else {
                    maxContext = Math.floor(detectedMaxContext);
                    logEntry(`Detected maxContext: ${maxContext} (type: ${typeof maxContext})`);

                    // For our extension's background analysis, we set our own max_tokens in generateRaw()
                    // We don't use amount_gen (that's for user chat messages)
                    // Reserve a reasonable amount for our structured JSON responses
                    maxGenTokens = Math.min(4096, Math.floor(maxContext * 0.15)); // 15% or 4096, whichever is lower

                    logEntry(`Extension will request max ${maxGenTokens} tokens for analysis responses (15% of context, capped at 4096)`);
                }
            }

            // Reserve space for: system prompt (500 tokens) + max generation (maxGenTokens) + safety margin (500)
            const reservedTokens = 500 + maxGenTokens + 500;
            const tokensForPrompt = Math.max(1000, maxContext - reservedTokens);

            logEntry(`Token allocation: maxContext=${maxContext}, reserved=${reservedTokens}, available=${tokensForPrompt}`);
            logEntry(`Final detection method: ${detectionMethod}`);

            const finalValue = Math.max(1000, Math.min(tokensForPrompt, 50000));
            logEntry(`Returning maxPromptLength: ${finalValue}`);

            // Return object with detection details
            return {
                maxPrompt: finalValue,
                detectionMethod: detectionMethod,
                maxContext: maxContext,
                debugLog: detectionLog.join('\n')
            };
        } catch (error) {
            const errorMsg = `ERROR in getMaxPromptLength: ${error.message}`;
            logEntry(errorMsg);
            console.error(`[NT-MaxContext] Stack:`, error.stack);
            // Return conservative fallback on any error with details
            return {
                maxPrompt: 3276, // Based on default 4096 context with reserves
                detectionMethod: 'error',
                maxContext: 4096,
                debugLog: detectionLog.join('\n') + '\nFATAL ERROR: ' + error.message
            };
        }
    });
}

/**
 * Calculate total token count for a batch of messages
 * Uses pre-calculated token counts from SillyTavern when available
 * @param {Array} messages - Array of chat message objects
 * @returns {Promise<number>} Total token count
 */
export async function calculateMessageTokens(messages) {
    return withErrorBoundary('calculateMessageTokens', async () => {
        const context = stContext.getContext();
        let totalTokens = 0;

        // Try to use pre-calculated token counts from message objects
        for (const msg of messages) {
            if (msg && typeof msg === 'object' && msg.extra && typeof msg.extra.token_count === 'number') {
                // SillyTavern stores token count in extra.token_count
                totalTokens += msg.extra.token_count;
            } else {
                // Fallback: use getTokenCountAsync for the message text
                const text = msg?.mes || msg?.message || String(msg);
                if (text && context.getTokenCountAsync) {
                    try {
                        const count = await context.getTokenCountAsync(text);
                        totalTokens += count;
                    // eslint-disable-next-line no-unused-vars
                    } catch (_error) {
                        debug.log();
                        // Final fallback: rough estimate (4 chars per token)
                        totalTokens += Math.ceil(text.length / 4);
                    }
                } else {
                    // Character-based estimate
                    totalTokens += Math.ceil(text.length / 4);
                }
            }
        }

        return totalTokens;
    });
}

/**
 * Call SillyTavern's LLM using systemPrompt + prompt structure
 * Works in both Chat Completion and Text Completion modes
 * Retries up to 3 times with 2s delay on parse failures
 * @param {string} systemPrompt - System-level instructions
 * @param {string} prompt - User data/instructions to analyze
 * @param {string} prefill - Optional response prefill (e.g., "{" to force JSON)
 * @returns {Promise<Object>} Parsed JSON response
 */
export async function callSillyTavern(systemPrompt, prompt, prefill = '') {
    return withErrorBoundary('callSillyTavern', async () => {
        debug.log();

        // Use SillyTavern.getContext() as recommended in official docs
        const context = stContext.getContext();

        // Check if we have an active API connection
        if (!context.onlineStatus) {
            throw new NameTrackerError('No API connection available. Please connect to an API first.');
        }

        console.log('[NT-ST-Call] Starting SillyTavern LLM call');
        console.log('[NT-ST-Call] System prompt length:', systemPrompt.length, 'characters');
        console.log('[NT-ST-Call] User prompt length:', prompt.length, 'characters');
        if (prefill) console.log('[NT-ST-Call] Prefill:', prefill);
        console.log('[NT-ST-Call] ========== PROMPT STRUCTURE START ==========');
        console.log('SYSTEM:', systemPrompt);
        console.log('USER:', prompt);
        if (prefill) console.log('PREFILL:', prefill);
        console.log('[NT-ST-Call] ========== PROMPT STRUCTURE END ==========');

        // Get token count for combined text
        const combinedText = systemPrompt + '\n\n' + prompt + (prefill ? '\n' + prefill : '');
        let promptTokens;
        try {
            promptTokens = await context.getTokenCountAsync(combinedText);
            console.log('[NT-ST-Call] Token count:', promptTokens);
            debug.log();
        } catch (_error) {
            console.log('[NT-ST-Call] Token count failed, estimating:', _error.message);
            debug.log();
            promptTokens = Math.ceil(combinedText.length / 4);
            console.log('[NT-ST-Call] Estimated tokens:', promptTokens);
            debug.log();
        }

        // Calculate max_tokens dynamically: 1/4 of context size, minimum 4000
        const maxContext = context.maxContext || 4096;
        const calculatedMaxTokens = Math.floor(maxContext * 0.25);
        const maxTokens = Math.max(4000, calculatedMaxTokens);
        console.log('[NT-ST-Call] Max context:', maxContext, 'Calculated maxTokens:', maxTokens);
        debug.log();

        // Retry logic: attempt up to 3 times with 2s delay
        const MAX_RETRIES = 3;
        const RETRY_DELAY_MS = 2000;
        let lastError = null;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                console.log(`[NT-ST-Call] Attempt ${attempt}/${MAX_RETRIES}`);
                console.log('[NT-ST-Call] Calling generateRaw with params:', {
                    temperature: GENERATION_TEMPERATURE,
                    top_p: GENERATION_TOP_P,
                    top_k: GENERATION_TOP_K,
                    rep_pen: GENERATION_REP_PEN,
                    responseLength: maxTokens,
                });

                const result = await context.generateRaw({
                    systemPrompt,
                    prompt,
                    prefill,
                    temperature: GENERATION_TEMPERATURE,
                    top_p: GENERATION_TOP_P,
                    top_k: GENERATION_TOP_K,
                    rep_pen: GENERATION_REP_PEN,
                    responseLength: maxTokens, // SillyTavern uses responseLength for text completion length
                });

                console.log('[NT-ST-Call] ========== RAW API RESPONSE START ==========');
                console.log('[NT-ST-Call] Response type:', typeof result);
                console.log(JSON.stringify(result, null, 2));
                console.log('[NT-ST-Call] ========== RAW API RESPONSE END ==========');

                console.log('[NT-ST-Call] Raw result type:', typeof result);
                console.log('[NT-ST-Call] Raw result object:', JSON.stringify(result).substring(0, 500));
                
                // Extract text from chat completion response
                // Chat format: { choices: [{ message: { content: "..." } }] }
                // Text format: { choices: [{ text: "..." }] }
                let resultText = result;
                
                if (typeof result === 'object' && result.choices && Array.isArray(result.choices)) {
                    // Try chat completion format first
                    if (result.choices[0]?.message?.content) {
                        console.log('[NT-ST-Call] Detected chat completion format, extracting from choices[0].message.content');
                        resultText = result.choices[0].message.content;
                    } 
                    // Fall back to text completion format
                    else if (result.choices[0]?.text) {
                        console.log('[NT-ST-Call] Detected text completion format, extracting from choices[0].text');
                        resultText = result.choices[0].text;
                    }
                }
                
                console.log('[NT-ST-Call] Extracted text type:', typeof resultText);
                console.log('[NT-ST-Call] Extracted text length:', resultText ? resultText.length : 'null');
                if (resultText && typeof resultText === 'string') {
                    console.log('[NT-ST-Call] Extracted text preview:', resultText.substring(0, 300));
                }
                console.log('[NT-ST-Call] ========== EXTRACTED TEXT START ==========');
                console.log(resultText);
                console.log('[NT-ST-Call] ========== EXTRACTED TEXT END ==========');
                debug.log();

                // The result should be a string
                if (!resultText || typeof resultText !== 'string') {
                    throw new NameTrackerError('Empty or invalid response from SillyTavern LLM');
                }

                // If we used a prefill, prepend it to complete the JSON
                if (prefill) {
                    console.log('[NT-ST-Call] Prepending prefill to complete JSON:', prefill);
                    resultText = prefill + resultText;
                    
                    // If the prefill opened an object but response doesn't close it, add closing brace
                    // Count braces to see if balanced
                    const openBraces = (resultText.match(/{/g) || []).length;
                    const closeBraces = (resultText.match(/}/g) || []).length;
                    
                    if (openBraces > closeBraces) {
                        const missing = openBraces - closeBraces;
                        console.log(`[NT-ST-Call] Adding ${missing} closing brace(s) to complete JSON`);
                        resultText += '}'.repeat(missing);
                    }
                    
                    console.log('[NT-ST-Call] Combined text preview:', resultText.substring(0, 300));
                }

                const parsed = parseJSONResponse(resultText);
                console.log('[NT-ST-Call] parseJSONResponse returned type:', typeof parsed);
                console.log('[NT-ST-Call] parseJSONResponse returned value:', parsed);
                console.log('[NT-ST-Call] parsed.characters exists?:', parsed && 'characters' in parsed);
                console.log('[NT-ST-Call] parsed.characters type:', typeof parsed?.characters);
                console.log('[NT-ST-Call] parsed.characters is Array?:', Array.isArray(parsed?.characters));
                const parsedCount = Array.isArray(parsed?.characters) ? parsed.characters.length : 0;
                console.log('[NT-ST-Call] ✅ Successfully parsed on attempt', attempt, 'characters:', parsedCount);
                console.log('[NT-ST-Call] Parsed result:', JSON.stringify(parsed).substring(0, 300));
                return parsed;

            } catch (error) {
                lastError = error;
                console.error(`[NT-ST-Call] ❌ Attempt ${attempt}/${MAX_RETRIES} failed:`, error.message);
                console.error('[NT-ST-Call] Error details:', error);
                
                if (attempt < MAX_RETRIES) {
                    console.log(`[NT-ST-Call] Waiting ${RETRY_DELAY_MS}ms before retry...`);
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                }
            }
        }

        // All retries failed - prompt user
        const shouldContinue = confirm(
            `Failed to parse LLM response after ${MAX_RETRIES} attempts.\n\n` +
            `Last error: ${lastError.message}\n\n` +
            `Check console for detailed logs. Continue processing remaining batches?`
        );

        if (!shouldContinue) {
            throw new NameTrackerError('User aborted after parse failures');
        }

        // Return empty result if user wants to continue
        return { characters: [] };
    });
}

/**
 * Call Ollama API with optimized parameters for JSON extraction
 * Uses low temperature and focused sampling for deterministic, structured output
 * @param {string} prompt - The complete prompt to send
 * @returns {Promise<Object>} Parsed JSON response
 */
export async function callOllama(prompt) {
    return withErrorBoundary('callOllama', async () => {
        const llmConfig = getLLMConfig();

        if (!llmConfig.ollamaModel) {
            throw new NameTrackerError('No Ollama model selected');
        }

        debug.log();

        // Calculate max_tokens dynamically: 1/4 of context size, minimum 4000
        const maxContext = await getOllamaModelContext(llmConfig.ollamaModel);
        const calculatedMaxTokens = Math.floor(maxContext * 0.25);
        const maxTokens = Math.max(4000, calculatedMaxTokens);
        debug.log();

        const response = await fetch(`${llmConfig.ollamaEndpoint}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: llmConfig.ollamaModel,
                prompt: prompt,
                stream: false,
                format: 'json',
                // Ollama-specific generation parameters for structured output
                // Using same conservative settings as SillyTavern for consistency
                options: {
                    temperature: GENERATION_TEMPERATURE,      // Very low for deterministic output
                    top_p: GENERATION_TOP_P,                  // Focused sampling
                    top_k: GENERATION_TOP_K,                  // Standard focused sampling
                    repeat_penalty: GENERATION_REP_PEN,       // Slight repetition penalty
                    num_predict: maxTokens,  // Dynamic: 25% of context, min 4000 (prevents truncation)
                },
            }),
        });

        if (!response.ok) {
            throw new NameTrackerError(`Ollama API error: ${response.statusText}`);
        }

        const data = await response.json();
        debug.log();
        debug.log();

        return parseJSONResponse(data.response);
    });
}

/**
 * Parse JSON response from LLM, handling various formats
 * @param {string} text - Raw text response from LLM
 * @returns {Object} Parsed JSON object
 */
export function parseJSONResponse(text) {
    return withErrorBoundary('parseJSONResponse', () => {
        console.log('[NT-Parse] ========== PARSE START ==========');
        console.log('[NT-Parse] Input type:', typeof text);
        console.log('[NT-Parse] Input is null?:', text === null);
        console.log('[NT-Parse] Input is undefined?:', text === undefined);
        
        if (typeof text === 'object' && text !== null) {
            console.log('[NT-Parse] Input is an OBJECT (not string). Keys:', Object.keys(text));
            console.log('[NT-Parse] Full object:', JSON.stringify(text).substring(0, 500));
            
            // If it's already an object with characters, return it
            if (text.characters && Array.isArray(text.characters)) {
                console.log('[NT-Parse] Object already has characters array, returning as-is');
                return text;
            }
        }
        
        console.log('[NT-Parse] Input length:', text ? text.length : 'null');
        if (text && typeof text === 'string') {
            console.log('[NT-Parse] First 300 chars:', text.substring(0, 300));
            console.log('[NT-Parse] Last 100 chars:', text.substring(Math.max(0, text.length - 100)));
        }
        
        if (!text || typeof text !== 'string') {
            console.error('[NT-Parse] ❌ INVALID: Response is not a string:', typeof text);
            console.error('[NT-Parse] ❌ Response value:', text);
            throw new NameTrackerError('LLM returned empty or invalid response');
        }

        // Remove any leading/trailing whitespace
        text = text.trim();
        console.log('[NT-Parse] After trim, length:', text.length);
        if (text.length === 0) {
            console.error('[NT-Parse] ❌ Text is empty after trim');
            throw new NameTrackerError('LLM returned empty response');
        }

        // Try to extract JSON from markdown code blocks (```json or ```)
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
            console.log('[NT-Parse] Found markdown code block, extracting JSON');
            text = jsonMatch[1].trim();
            console.log('[NT-Parse] After markdown extraction, length:', text.length);
        }

        // Try to find JSON object in the text (look for first { to last })
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');

        console.log('[NT-Parse] Brace search: first={' + firstBrace + ', last=' + lastBrace + '}');

        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            const beforeText = text.substring(0, firstBrace);
            const jsonText = text.substring(firstBrace, lastBrace + 1);
            const afterText = text.substring(lastBrace + 1);
            
            console.log('[NT-Parse] Text before JSON:', beforeText.substring(0, 100));
            console.log('[NT-Parse] Extracted JSON length:', jsonText.length);
            console.log('[NT-Parse] Text after JSON:', afterText.substring(0, 100));
            
            text = jsonText;
        }

        // Remove common prefixes that LLMs add
        text = text.replace(/^(?:Here's the analysis:|Here is the JSON:|Result:|Output:)\s*/i, '');

        // Clean up common formatting issues
        text = text.trim();

        console.log('[NT-Parse] Before JSON.parse, length:', text.length);
        console.log('[NT-Parse] First 200 chars:', text.substring(0, 200));
        console.log('[NT-Parse] Last 100 chars:', text.substring(Math.max(0, text.length - 100)));

        try {
            console.log('[NT-Parse] Attempting JSON.parse...');
            const parsed = JSON.parse(text);

            console.log('[NT-Parse] ✅ Successfully parsed JSON');
            console.log('[NT-Parse] Parsed type:', typeof parsed);
            console.log('[NT-Parse] Parsed keys:', Object.keys(parsed));
            console.log('[NT-Parse] Full parsed object:', JSON.stringify(parsed).substring(0, 500));
            
            // Validate structure
            if (!parsed.characters) {
                console.warn('[NT-Parse] ⚠️  parsed.characters is undefined or null');
                console.warn('[NT-Parse] Available keys in object:', Object.keys(parsed));
            } else if (!Array.isArray(parsed.characters)) {
                console.warn('[NT-Parse] ⚠️  parsed.characters exists but is NOT an array. Type:', typeof parsed.characters);
                console.warn('[NT-Parse] Value:', parsed.characters);
            }
            
            if (!parsed.characters || !Array.isArray(parsed.characters)) {
                console.warn('[NT-Parse] ❌ Response missing characters array, returning empty');
                console.warn('[NT-Parse] Full parsed object:', parsed);
                return { characters: [] };
            }

            console.log('[NT-Parse] ✅ Valid response with', parsed.characters.length, 'characters');
            console.log('[NT-Parse] ========== PARSE END (SUCCESS) ==========');
            return parsed;
        } catch (error) {
            console.error('[NT-Parse] ❌ JSON.parse failed:', error.message);
            console.error('[NT-Parse] ❌ Error at position:', error.name);
            console.log('[NT-Parse] Text being parsed (first 500 chars):', text.substring(0, 500));
            console.log('[NT-Parse] Text being parsed (last 200 chars):', text.substring(Math.max(0, text.length - 200)));

            // Check if response was truncated (common issue with long responses)
            if (text.includes('"characters"') && !text.trim().endsWith('}')) {
                console.log('[NT-Parse] Detected truncated response, attempting recovery...');

                // Try to salvage partial data by attempting to close the JSON
                let salvaged = text;

                // Count open vs closed braces to determine how many we need
                const openBraces = (text.match(/\{/g) || []).length;
                const closeBraces = (text.match(/\}/g) || []).length;
                const openBrackets = (text.match(/\[/g) || []).length;
                const closeBrackets = (text.match(/\]/g) || []).length;

                console.log('[NT-Parse] Recovery attempt - braces: open=' + openBraces + ' close=' + closeBraces + ', brackets: open=' + openBrackets + ' close=' + closeBrackets);

                // Try to close incomplete strings and objects
                if (salvaged.match(/"[^"]*$/)) {
                    // Has unclosed quote
                    console.log('[NT-Parse] Adding closing quote');
                    salvaged += '"';
                }

                // Close missing brackets/braces
                for (let i = 0; i < (openBrackets - closeBrackets); i++) {
                    salvaged += ']';
                }
                for (let i = 0; i < (openBraces - closeBraces); i++) {
                    salvaged += '}';
                }

                console.log('[NT-Parse] Salvaged text length:', salvaged.length);
                console.log('[NT-Parse] Attempting to parse salvaged content...');

                try {
                    const recovered = JSON.parse(salvaged);
                    console.log('[NT-Parse] ✅ Successfully recovered JSON with', recovered.characters?.length || 0, 'characters');
                    console.log('[NT-Parse] ========== PARSE END (RECOVERED) ==========');
                    return recovered;
                } catch (e) {
                    console.error('[NT-Parse] ❌ Recovery failed:', e.message);
                    console.error('[NT-Parse] Salvaged text (first 500):', salvaged.substring(0, 500));
                }
            }

            console.log('[NT-Parse] ========== PARSE END (FAILED) ==========');
            throw new NameTrackerError('Failed to parse LLM response as JSON. The response may be too long or truncated. Try analyzing fewer messages at once.');
        }
    });
}

/**
 * Call LLM for character analysis with automatic batch splitting if prompt is too long
 * @param {Array} messageObjs - Array of message objects (with .mes property) or strings
 * @param {string} knownCharacters - Roster of previously identified characters
 * @param {number} depth - Recursion depth (for logging)
 * @param {number} retryCount - Number of retries attempted
 * @returns {Promise<Object>} Analysis result with merged characters
 */
export async function callLLMAnalysis(messageObjs, knownCharacters = '', depth = 0, retryCount = 0) {
    return withErrorBoundary('callLLMAnalysis', async () => {
        const llmConfig = getLLMConfig();
        const maxPromptResult = await getMaxPromptLength(); // Dynamic based on API context window
        const maxPromptTokens = maxPromptResult.maxPrompt;
        const MAX_RETRIES = 3;

        debug.log();

        // Extract message text
        const messages = messageObjs.map(msg => {
            if (typeof msg === 'string') return msg;
            if (msg.mes) return msg.mes;
            if (msg.message) return msg.message;
            return JSON.stringify(msg);
        });

        // Create cache key
        const cacheKey = simpleHash(messages.join('\\n') + llmConfig.source + llmConfig.ollamaModel);

        // Check cache
        if (analysisCache.has(cacheKey)) {
            debug.log();
            return analysisCache.get(cacheKey);
        }

        // Build the prompt
        const messagesText = messages.map((msg, idx) => `Message ${idx + 1}:\\n${msg}`).join('\\n\\n');
        
        // Get system prompt and ensure it's a string
        let systemPrompt = getSystemPrompt();
        console.log('[NT-Prompt] getSystemPrompt() returned type:', typeof systemPrompt);
        
        // Handle if it's a Promise
        if (systemPrompt && typeof systemPrompt === 'object' && typeof systemPrompt.then === 'function') {
            console.warn('[NT-Prompt] getSystemPrompt returned Promise, awaiting...');
            systemPrompt = await systemPrompt;
            console.log('[NT-Prompt] After await, type:', typeof systemPrompt);
        }
        
        // Handle if it's still an object after await
        if (typeof systemPrompt !== 'string') {
            console.warn('[NT-Prompt] systemPrompt is not a string, using default. Type:', typeof systemPrompt, 'Value:', systemPrompt);
            systemPrompt = DEFAULT_SYSTEM_PROMPT;
        }
        
        // Get character roster and ensure it's a string
        let rosterStr = knownCharacters || '';
        console.log('[NT-Prompt] knownCharacters type:', typeof rosterStr);
        
        // Handle if it's a Promise
        if (rosterStr && typeof rosterStr === 'object' && typeof rosterStr.then === 'function') {
            console.warn('[NT-Prompt] knownCharacters is Promise, awaiting...');
            rosterStr = await rosterStr;
            console.log('[NT-Prompt] After await, type:', typeof rosterStr);
        }
        
        // Ensure it's a string
        rosterStr = String(rosterStr || '');
        
        console.log('[NT-Prompt] Final systemPrompt length:', systemPrompt.length);
        console.log('[NT-Prompt] Final rosterStr length:', rosterStr.length);
        console.log('[NT-Prompt] systemPrompt preview:', systemPrompt.substring(0, 100));
        
        // Build system message with instructions and roster
        const systemMessage = systemPrompt + (rosterStr ? '\n\n' + rosterStr : '');
        
        // Build user prompt with data
        const userPrompt = '[DATA TO ANALYZE]\n' + messagesText;
        
        // No prefill - let model generate complete JSON from system prompt guidance
        const prefill = '';

        // Calculate actual token count for the combined messages
        let promptTokens;
        const combinedText = systemMessage + '\n\n' + userPrompt;
        try {
            promptTokens = await calculateMessageTokens([{ mes: combinedText }]);
            debug.log();
        } catch (tokenError) {
            debug.log();
            // Fallback to character-based estimate
            promptTokens = Math.ceil(combinedText.length / 4);
        }

        // If prompt is too long, split into sub-batches
        if (promptTokens > maxPromptTokens && messageObjs.length > 1) {
            const indent = '  '.repeat(depth);
            debug.log();

            // Split roughly in half
            const midpoint = Math.floor(messageObjs.length / 2);
            const firstHalf = messageObjs.slice(0, midpoint);
            const secondHalf = messageObjs.slice(midpoint);

            debug.log();

            // Analyze both halves in parallel
            const [result1, result2] = await Promise.all([
                callLLMAnalysis(firstHalf, knownCharacters, depth + 1),
                callLLMAnalysis(secondHalf, knownCharacters, depth + 1),
            ]);

            // Merge the results
            const mergedResult = {
                characters: [
                    ...(result1.characters || []),
                    ...(result2.characters || []),
                ],
            };

            debug.log();
            return mergedResult;
        }

        // Prompt is acceptable length, proceed with analysis
        debug.log(`Calling LLM with prompt (${promptTokens} tokens)...`);
        console.log('[NT-Prompt] Prompt composition:');
        console.log('SYSTEM (' + systemMessage.length + ' chars):');
        console.log('='.repeat(80));
        console.log(systemMessage);
        console.log('='.repeat(80));
        console.log('USER (' + userPrompt.length + ' chars):');
        console.log('='.repeat(80));
        console.log(userPrompt);
        console.log('='.repeat(80));
        console.log('PREFILL:', prefill);
        console.log('='.repeat(80));
        
        let result;

        try {
            if (llmConfig.source === 'ollama') {
                // Ollama still uses flat prompt for now
                const flatPrompt = systemMessage + '\n\n' + userPrompt + '\n' + prefill;
                result = await callOllama(flatPrompt);
            } else {
                result = await callSillyTavern(systemMessage, userPrompt, prefill);
            }
        } catch (error) {
            // Retry on JSON parsing errors or empty responses
            if (retryCount < MAX_RETRIES &&
                (error.message.includes('JSON') ||
                 error.message.includes('empty') ||
                 error.message.includes('truncated'))) {

                debug.log();

                // Add exponential backoff delay
                const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
                await new Promise(resolve => setTimeout(resolve, delay));

                // Retry the same call
                return await callLLMAnalysis(messageObjs, knownCharacters, depth, retryCount + 1);
            }

            // Max retries exceeded or non-retryable error
            throw error;
        }

        // Cache the result only if we have characters
        if (result && Array.isArray(result.characters) && result.characters.length > 0) {
            if (analysisCache.size > 50) {
                // Clear oldest entries if cache is getting too large
                const firstKey = analysisCache.keys().next().value;
                analysisCache.delete(firstKey);
            }
            analysisCache.set(cacheKey, result);
        } else {
            console.warn('[NT-Cache] Skipping cache because result is empty or has no characters');
        }

        debug.log();
        return result;
    });
}

/**
 * Clear the analysis cache
 */
export function clearAnalysisCache() {
    analysisCache.clear();
    debug.log();
}

/**
 * Get analysis cache statistics
 * @returns {Object} Cache statistics
 */
export function getCacheStats() {
    return {
        size: analysisCache.size,
        entries: [...analysisCache.keys()].map(key => ({
            key: key.substring(0, 8) + '...',
            timestamp: Date.now(),
        })),
    };
}

/**
 * Get available Ollama models
 * @returns {Array} Array of available models
 */
export function getOllamaModels() {
    return [...ollamaModels];
}
