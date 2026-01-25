/**
 * LLM Integration Module
 *
 * Handles LLM API calls to SillyTavern and Ollama for character analysis.
 * Includes token management, context window handling, and JSON parsing.
 */

import { createModuleLogger } from '../core/debug.js';
import { withErrorBoundary, NameTrackerError } from '../core/errors.js';
import { settings } from '../core/settings.js';
import { stContext } from '../core/context.js';
import { simpleHash } from '../utils/helpers.js';
import { NotificationManager } from '../utils/notifications.js';

const debug = createModuleLogger('llm');
const notifications = new NotificationManager('LLM Integration');

// LLM state management
const analysisCache = new Map(); // Cache for LLM analysis results
let ollamaModels = []; // Available Ollama models

/**
 * Default system prompt for character analysis
 */
const DEFAULT_SYSTEM_PROMPT = `You are a character analysis assistant. Your task is to extract character information from chat messages and return it in a structured JSON format.

CRITICAL: You MUST respond with ONLY valid JSON. Do not include any explanatory text, markdown formatting, or commentary. Just the raw JSON object.

IMPORTANT PROCESSING RULES:
1. Process messages in CHRONOLOGICAL ORDER (oldest to newest)
2. When there is conflicting information about a character, ALWAYS use the MOST RECENT information
3. Be smart about name variations - "Alex" and "Alexandra" may be the same person
4. Track physical attributes, personality traits, relationships, and interactions with {{user}}
5. Don't create entries for generic references like "the bartender" unless given specific names

Required JSON structure:
{
  "characters": [
    {
      "name": "Character's primary/preferred name",
      "aliases": ["Alternative names", "Nicknames"],
      "physicalAge": "Age or age range",
      "mentalAge": "Mental/emotional age if different",
      "physical": "Physical description and appearance",
      "personality": "Personality traits and behavior", 
      "sexuality": "Sexual orientation or preferences",
      "raceEthnicity": "Race/ethnicity information",
      "roleSkills": "Job, role, skills, abilities",
      "lastInteraction": "Most recent interaction or scene with {{user}}",
      "relationships": ["Relationship with other characters"],
      "confidence": 85
    }
  ]
}

Confidence scores (0-100):
- 90-100: Character explicitly named with detailed info
- 70-89: Character clearly identified with some details
- 50-69: Character mentioned but limited info
- Below 50: Uncertain or vague reference

Focus on major speaking characters and those with significant interactions. Avoid analyzing every minor mention.`;

/**
 * Get the system prompt for analysis
 * @returns {string} System prompt text
 */
function getSystemPrompt() {
    return settings.getSetting('systemPrompt') || DEFAULT_SYSTEM_PROMPT;
}

/**
 * Load available Ollama models
 * @returns {Promise<Array>} Array of available models
 */
export async function loadOllamaModels() {
    return withErrorBoundary('loadOllamaModels', async () => {
        const ollamaEndpoint = settings.getSetting('ollamaEndpoint', 'http://localhost:11434');

        debug.log();

        try {
            const response = await fetch(`${ollamaEndpoint}/api/tags`);

            if (!response.ok) {
                throw new Error(`Failed to connect to Ollama: ${response.statusText}`);
            }

            const data = await response.json();
            ollamaModels = data.models || [];

            debug.log();

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
        const ollamaEndpoint = settings.getSetting('ollamaEndpoint', 'http://localhost:11434');

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
        const characters = settings.getCharacters();
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
        const llmConfig = settings.getLLMConfig();
        let maxContext = 4096; // Default

        if (llmConfig.source === 'ollama' && llmConfig.ollamaModel) {
            // Get Ollama model's context size
            maxContext = await getOllamaModelContext(llmConfig.ollamaModel);
        } else {
            // Use SillyTavern's context
            const context = stContext.getContext();
            maxContext = context.maxContext || 4096;
        }

        // Reserve 50% of context for system prompt, response, and safety margin
        const tokensForPrompt = Math.floor(maxContext * 0.5);

        debug.log();

        // Return at least 1000 tokens, max 25000 tokens
        return Math.max(1000, Math.min(tokensForPrompt, 25000));
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
                    } catch (error) {
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
 * Call SillyTavern's LLM with optimized parameters for JSON extraction
 * Uses low temperature and focused sampling for deterministic, structured output
 * These settings override the user's chat settings to ensure reliable parsing
 * @param {string} prompt - The complete prompt to send
 * @returns {Promise<Object>} Parsed JSON response
 */
export async function callSillyTavern(prompt) {
    return withErrorBoundary('callSillyTavern', async () => {
        debug.log();

        // Use SillyTavern.getContext() as recommended in official docs
        const context = stContext.getContext();

        // Check if we have an active API connection
        if (!context.onlineStatus) {
            throw new NameTrackerError('No API connection available. Please connect to an API first.');
        }

        // Get token count for the prompt
        let promptTokens;
        try {
            promptTokens = await context.getTokenCountAsync(prompt);
            debug.log();
        } catch (error) {
            debug.log();
            promptTokens = Math.ceil(prompt.length / 4);
            debug.log();
        }

        // Calculate max_tokens dynamically: 1/4 of context size, minimum 4000
        // This scales with the model's context window for better headroom
        const maxContext = context.maxContext || 4096;
        const calculatedMaxTokens = Math.floor(maxContext * 0.25);
        const maxTokens = Math.max(4000, calculatedMaxTokens);
        debug.log();

        // Use generateRaw as documented in:
        // https://docs.sillytavern.app/for-contributors/writing-extensions/#raw-generation
        const result = await context.generateRaw({
            prompt: prompt,  // Can be string (Text Completion) or array (Chat Completion)
            systemPrompt: '',  // Empty, we include instructions in prompt
            prefill: '',  // No prefill needed for analysis
            // Override generation settings for structured output
            // These ensure consistent, deterministic JSON regardless of user's chat settings
            temperature: 0.3,  // Low temp for focused, deterministic output (user's setting is ignored)
            top_p: 0.9,        // Slightly reduced for more predictable results
            top_k: 40,         // Standard focused sampling
            min_p: 0.05,       // Prevent very low probability tokens
            rep_pen: 1.1,      // Slight repetition penalty
            max_tokens: maxTokens,  // Dynamic: 25% of context, min 4000 (prevents truncation)
            stop: [],           // No custom stop sequences needed
        });

        debug.log();

        // The result should be a string
        if (!result) {
            throw new NameTrackerError('Empty response from SillyTavern LLM');
        }

        return parseJSONResponse(result);
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
        const llmConfig = settings.getLLMConfig();

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
                options: {
                    temperature: 0.3,      // Low temp for deterministic output
                    top_p: 0.9,           // Focused sampling
                    top_k: 40,            // Standard focused sampling
                    repeat_penalty: 1.1,  // Slight repetition penalty
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
        if (!text || typeof text !== 'string') {
            console.error('Invalid response text:', text);
            throw new NameTrackerError('LLM returned empty or invalid response');
        }

        // Remove any leading/trailing whitespace
        text = text.trim();

        // Try to extract JSON from markdown code blocks (```json or ```)
        const jsonMatch = text.match(/```(?:json)?\\s*([\\s\\S]*?)```/);
        if (jsonMatch) {
            text = jsonMatch[1].trim();
        }

        // Try to find JSON object in the text (look for first { to last })
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            text = text.substring(firstBrace, lastBrace + 1);
        }

        // Remove common prefixes that LLMs add
        text = text.replace(/^(?:Here's the analysis:|Here is the JSON:|Result:|Output:)\\s*/i, '');

        // Clean up common formatting issues
        text = text.trim();

        try {
            const parsed = JSON.parse(text);

            // Validate structure
            if (!parsed.characters || !Array.isArray(parsed.characters)) {
                console.warn('Response missing characters array, returning empty:', parsed);
                return { characters: [] };
            }

            return parsed;
        } catch (error) {
            console.error('Failed to parse JSON response. Original text:', text);
            console.error('Parse error:', error.message);

            // Check if response was truncated (common issue with long responses)
            if (text.includes('"characters"') && !text.trim().endsWith('}')) {
                debug.log();
                debug.log();

                // Try to salvage partial data by attempting to close the JSON
                let salvaged = text;

                // Count open vs closed braces to determine how many we need
                const openBraces = (text.match(/\{/g) || []).length;
                const closeBraces = (text.match(/\}/g) || []).length;
                const openBrackets = (text.match(/\[/g) || []).length;
                const closeBrackets = (text.match(/\]/g) || []).length;

                // Try to close incomplete strings and objects
                if (salvaged.match(/"[^"]*$/)) {
                    // Has unclosed quote
                    salvaged += '"';
                }

                // Close missing brackets/braces
                for (let i = 0; i < (openBrackets - closeBrackets); i++) {
                    salvaged += ']';
                }
                for (let i = 0; i < (openBraces - closeBraces); i++) {
                    salvaged += '}';
                }

                try {
                    const recovered = JSON.parse(salvaged);
                    debug.log();
                    return recovered;
                } catch (e) {
                    debug.log();
                }
            }

            // Try one more time with more aggressive extraction
            const fallbackMatch = text.match(/\\{[\\s\\S]*"characters"[\\s\\S]*\\}/);
            if (fallbackMatch) {
                try {
                    return JSON.parse(fallbackMatch[0]);
                } catch (parseError) {
                    debug.log();
                    // Give up
                }
            }

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
        const llmConfig = settings.getLLMConfig();
        const maxPromptTokens = await getMaxPromptLength(); // Dynamic based on API context window
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
        const systemInstructions = `[SYSTEM INSTRUCTION - DO NOT ROLEPLAY]\\n${getSystemPrompt()}${knownCharacters}\\n\\n[DATA TO ANALYZE]`;
        const fullPrompt = `${systemInstructions}\\n${messagesText}\\n\\n[RESPOND WITH JSON ONLY - NO STORY CONTINUATION]`;

        // Calculate actual token count for the prompt
        let promptTokens;
        try {
            promptTokens = await calculateMessageTokens([{ mes: fullPrompt }]);
            debug.log();
        } catch (tokenError) {
            debug.log();
            // Fallback to character-based estimate
            promptTokens = Math.ceil(fullPrompt.length / 4);
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
        let result;

        try {
            if (llmConfig.source === 'ollama') {
                result = await callOllama(fullPrompt);
            } else {
                result = await callSillyTavern(fullPrompt);
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

        // Cache the result
        if (analysisCache.size > 50) {
            // Clear oldest entries if cache is getting too large
            const firstKey = analysisCache.keys().next().value;
            analysisCache.delete(firstKey);
        }
        analysisCache.set(cacheKey, result);

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
