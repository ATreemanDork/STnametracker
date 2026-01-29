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
import {
    logRawResponse,
    logRegexExtraction,
    createParsingSession,
} from '../../tests/debug-parser.js';

const debug = createModuleLogger('llm');
const notifications = new NotificationManager('LLM Integration');

// ============================================================================
// DEBUG CONFIGURATION
// ============================================================================
const DEBUG_LOGGING = false; // Default off to reduce console noise

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

// Session telemetry tracking (reset on chat change)
const sessionTelemetry = {
    budgetingMethod: [], // 'NER' or 'fallback'
    entityCounts: [],
    rosterSizes: [],
    calculatedBudgets: [],
    actualResponseTokens: [],
    totalCalls: 0,
    nerSuccesses: 0,
    nerFailures: 0,
};

/**
 * Reset session telemetry (call on chat change)
 */
export function resetSessionTelemetry() {
    sessionTelemetry.budgetingMethod = [];
    sessionTelemetry.entityCounts = [];
    sessionTelemetry.rosterSizes = [];
    sessionTelemetry.calculatedBudgets = [];
    sessionTelemetry.actualResponseTokens = [];
    sessionTelemetry.totalCalls = 0;
    sessionTelemetry.nerSuccesses = 0;
    sessionTelemetry.nerFailures = 0;
    console.log('[NT-Telemetry] Session telemetry reset');
}

/**
 * Log session telemetry summary
 */
export function logSessionTelemetry() {
    if (sessionTelemetry.totalCalls === 0) {
        console.log('[NT-Telemetry] No LLM calls this session');
        return;
    }

    console.log('[NT-Telemetry] ========== Session Summary ==========');
    console.log('[NT-Telemetry] Total LLM calls:', sessionTelemetry.totalCalls);
    console.log('[NT-Telemetry] NER successes:', sessionTelemetry.nerSuccesses,
        `(${((sessionTelemetry.nerSuccesses / sessionTelemetry.totalCalls) * 100).toFixed(1)}%)`);
    console.log('[NT-Telemetry] NER failures (fallback used):', sessionTelemetry.nerFailures,
        `(${((sessionTelemetry.nerFailures / sessionTelemetry.totalCalls) * 100).toFixed(1)}%)`);

    if (sessionTelemetry.calculatedBudgets.length > 0) {
        const avgBudget = sessionTelemetry.calculatedBudgets.reduce((a, b) => a + b, 0) / sessionTelemetry.calculatedBudgets.length;
        console.log('[NT-Telemetry] Average calculated budget:', Math.round(avgBudget), 'tokens');
    }

    if (sessionTelemetry.actualResponseTokens.length > 0) {
        const avgActual = sessionTelemetry.actualResponseTokens.reduce((a, b) => a + b, 0) / sessionTelemetry.actualResponseTokens.length;
        console.log('[NT-Telemetry] Average actual response:', Math.round(avgActual), 'tokens');

        // Calculate efficiency
        if (sessionTelemetry.calculatedBudgets.length === sessionTelemetry.actualResponseTokens.length) {
            let totalEfficiency = 0;
            for (let i = 0; i < sessionTelemetry.calculatedBudgets.length; i++) {
                totalEfficiency += (sessionTelemetry.actualResponseTokens[i] / sessionTelemetry.calculatedBudgets[i]) * 100;
            }
            const avgEfficiency = totalEfficiency / sessionTelemetry.calculatedBudgets.length;
            console.log('[NT-Telemetry] Average efficiency:', avgEfficiency.toFixed(1) + '%');
        }
    }

    console.log('[NT-Telemetry] ========================================');
}

/**
 * Calculate response token budget using NER with fallback
 * @param {string} messageText - Messages to analyze for entity count
 * @param {number} rosterSize - Number of existing characters in lorebook
 * @returns {Promise<{budget: number, method: string, entityCount: number}>}
 */
// eslint-disable-next-line no-unused-vars
async function calculateResponseBudget(messageText, rosterSize) {
    const settings = await get_settings();
    const maxResponseTokens = settings.maxResponseTokens || 5000;

    let entityCount = 0;
    let method = 'fallback';

    // Try NER-based entity extraction
    try {
        // Attempt to use SillyTavern transformers for NER
        // This is the proper way to access transformers in ST extensions
        const context = stContext.getContext();
        if (context?.ai?.transformers?.pipeline) {
            const ner = await context.ai.transformers.pipeline('ner');
            const entities = await ner(messageText);

            // Count unique entities (people)
            const uniqueEntities = new Set();
            for (const entity of entities) {
                if (entity.entity_group === 'PER' || entity.entity.startsWith('B-PER') || entity.entity.startsWith('I-PER')) {
                    uniqueEntities.add(entity.word.toLowerCase());
                }
            }

            entityCount = uniqueEntities.size;
            method = 'NER';
            sessionTelemetry.nerSuccesses++;

            console.log('[NT-Budget] NER detected', entityCount, 'entities');
        } else {
            throw new Error('Transformers pipeline not available');
        }
    } catch (error) {
        // Fallback to character count estimation
        console.log('[NT-Budget] NER unavailable, using fallback estimation:', error.message);
        method = 'fallback';
        sessionTelemetry.nerFailures++;

        // Estimate: characterCount × 300 + 1000
        const characterCount = messageText.length;
        entityCount = Math.ceil(characterCount / 1000); // Rough estimate for logging
    }

    // Calculate budget based on method
    let budget;
    if (method === 'NER') {
        // NER-based: entityCount + rosterSize, scaled by 300 tokens per character
        const totalCharacters = entityCount + rosterSize;
        budget = (totalCharacters * 300) + 1000; // Base 1000 + scaling
    } else {
        // Fallback: character count × 300 + 1000
        budget = (messageText.length * 300) + 1000;
    }

    // Apply cap
    budget = Math.min(budget, maxResponseTokens);

    console.log('[NT-Budget] Method:', method);
    console.log('[NT-Budget] Entity count:', entityCount);
    console.log('[NT-Budget] Roster size:', rosterSize);
    console.log('[NT-Budget] Calculated budget:', budget, 'tokens');
    console.log('[NT-Budget] Max cap:', maxResponseTokens, 'tokens');

    // Track telemetry
    sessionTelemetry.totalCalls++;
    sessionTelemetry.budgetingMethod.push(method);
    sessionTelemetry.entityCounts.push(entityCount);
    sessionTelemetry.rosterSizes.push(rosterSize);
    sessionTelemetry.calculatedBudgets.push(budget);

    return { budget, method, entityCount };
}

/**
 * Default system prompt for character analysis
 */
const DEFAULT_SYSTEM_PROMPT = `Extract character information from messages and return ONLY a JSON object.

/nothink

[CURRENT LOREBOOK ENTRIES]
The following characters have already been identified. Their information is shown in lorebook format (keys + content).
If a character appears in the new messages with additional/changed information, include them in your response.
If a character is NOT mentioned or has no new information, do NOT include them in your response.

{{CHARACTER_ROSTER}}

⚠️ REQUIRED: Always include the user character ({{user}}) in your response, even if minimal details
For other characters from Current Lorebook Entries: only include if NEW information appears in these messages
Returning only the user character is valid when no other character updates exist

⚠️ CRITICAL INSTRUCTION: Only include characters with NEW information in these specific messages. If a character from the lorebook appears but provides no new details, DO NOT include them in your response.

Example: Alice from lorebook says 'Hi' in message 5 → No new info → Omit Alice from response
Example: {{user}} always appears → Always include {{user}} with any available details

CRITICAL JSON REQUIREMENTS:
⚠️ STRICT JSON FORMATTING - PARSING WILL FAIL IF NOT FOLLOWED ⚠️

🚨 ABSOLUTELY NO XML TAGS: Do not use <think>, </think>, <thinking>, or any XML tags
🚨 PURE JSON ONLY: Your response must be immediately parseable JSON with no wrappers

MANDATORY SYNTAX RULES:
- Your ENTIRE response must be valid JSON starting with { and ending with }
- ALL property names MUST use double quotes: "name", "aliases", etc.
- ALL string values MUST use double quotes and escape internal quotes: "He said \\"hello\\""
- NEVER output unquoted text in any field: "roleSkills": observed symptoms ❌ WRONG
- CORRECT: "roleSkills": "observed symptoms" ✅ or "roleSkills": null ✅
- NO control characters (line breaks, tabs) inside string values
- NO trailing commas before } or ]
- EVERY property must have a colon: "name": "value" (not "name" "value")
- NO markdown, NO explanations, NO text before or after the JSON

⛔ ABSOLUTELY FORBIDDEN PATTERNS THAT BREAK PARSING:
❌ <think>reasoning</think> or </think> or any XML tags
❌ Code blocks: \\\`\\\`\\\`json { "characters": [...] } \\\`\\\`\\\`
❌ "name": "John", "He is tall and strong", "age": 25
   (orphaned description without property name)
❌ "physical" "brown hair and blue eyes"
   (missing colon)
❌ "aliases": ["John", "Scout",]
   (trailing comma)
❌ Here's the analysis: { "characters": [...] }
   (text before JSON)

✅ CORRECT FORMAT ONLY:
{
  "characters": [
    {
      "name": "Full Name",
      "physical": "description here",
      "aliases": ["nick1", "nick2"]
    }
  ]
}

⚠️ VALIDATION CHECK: Before responding, verify:
1. Starts with { immediately (no text before)
2. Every string has opening AND closing quotes
3. Every property has a colon after the name
4. No orphaned text without property names
5. Ends with } immediately (no text after)

ONLY include characters mentioned in these specific messages or with new information
DO NOT repeat unchanged characters from the Current Lorebook Entries

DO NOT include:
- Any text before the JSON
- Any text after the JSON
- Code block markers like \\\`\\\`\\\`json
- Explanations, commentary, or thinking tags
- XML tags like <think> or </think> (these break JSON parsing)

REQUIRED JSON structure (copy this exact format):
{
  "characters": [
    {
      "name": "Full character name (SINGLE NAME ONLY - never include aliases here)",
      "aliases": ["Alternative names for THIS SAME person - nicknames, shortened names, titles"],
      "physicalAge": "Age if mentioned",
      "mentalAge": "Mental age if different",
      "physical": "Physical description",
      "personality": "Personality traits",
      "sexuality": "Sexual orientation if mentioned",
      "raceEthnicity": "Race/ethnicity if mentioned",
      "roleSkills": "Job/role/skills (MUST be quoted string or null, never unquoted text)",
      "relationships": ["currentchar, otherchar, relationship"],
      "confidence": 75
    }
  ]
}

CRITICAL FIELD SPECIFICATIONS:

NAME FIELD RULES:
- Use the MOST COMPLETE proper name mentioned (e.g., "John Blackwood")
- NEVER include commas, slashes, or multiple names in the name field
- NEVER combine name + alias (❌ "John Blackwood, John" ❌ "John/Scout")
- If only a first name is known, use just that ("John")

ALIASES FIELD RULES:
- Include ALL other ways this character is referred to
- Nicknames, shortened names, titles, alternative spellings
- Examples: ["John", "Scout", "JB", "Mr. Blackwood"]

RELATIONSHIPS FIELD - NATURAL LANGUAGE FORMAT:
🚨 CRITICAL: ONLY use this format: "Character A is to Character B: relationship1, relationship2"

⛔ FORBIDDEN FORMATS:
- "Character, Other, relationship" (OLD TRIPLET FORMAT - DO NOT USE)
- "Character A, Character B, relationship" (OLD TRIPLET FORMAT - DO NOT USE)

✅ MANDATORY FORMAT: "Character A is to Character B: relationship1, relationship2"

⚠️ CRITICAL NAMING REQUIREMENTS:
- ALWAYS use the character's CANONICAL/PREFERRED name in relationships
- If "John Blackwood" is the main name, use "John Blackwood" NOT "John"
- Maintain name consistency across ALL relationship entries
- Multiple relationships for same pair: separate with commas

✅ CORRECT examples:
- "Dora is to John Blackwood: lover, submissive"
- "Maya is to Sarah Chen: sister, gymnastics partner"
- "John Blackwood is to Julia Martinez: son"
- "Sarah Chen is to John Blackwood: rival, former colleague"

❌ FORBIDDEN patterns:
- "Dora, John, lover" (OLD FORMAT - NEVER USE)
- "Dora, John Blackwood, lover" (OLD FORMAT - NEVER USE)
- "John, Jasmine, friend" (OLD FORMAT - NEVER USE)
- "Dora is to John: lover" + "Dora is to John Blackwood: lover" (inconsistent naming)
- Narrative text: "Living in luxury penthouse since age 17"
- Actions/events: "Takes charge of organizing rescue mission"

🔄 RELATIONSHIP FORMAT - DIRECTIONALITY IS CRITICAL:
⚠️ MANDATORY FORMAT: "[CurrentCharacter] is to [TargetCharacter]: [role]"

DIRECTIONALITY EXAMPLES (notice the direction matters!):
✅ CORRECT:
- "John Blackwood is to Julia Chen: son" (John is Julia's son)
- "Julia Chen is to John Blackwood: mother" (Julia is John's mother)
- "Emma is to David: wife" (Emma is David's wife)
- "David is to Emma: husband" (David is Emma's husband)

❌ WRONG - These lose directionality:
- "John, Julia, son" ← NO! Ambiguous direction
- "Julia is to John: son" ← NO! Julia is not John's son

ALLOWED CORE RELATIONSHIP TYPES ONLY:
FAMILY: parent, mother, father, child, son, daughter, sibling, brother, sister, spouse, husband, wife
**Standardized Relationships (Directional Dynamics):**

Relationships MUST follow this specific string format: "[CurrentCharacterName] is to [TargetCharacterName]: [Role1], [Role2]"

**Directionality is Critical:** The first name MUST be the character defined in the current JSON entry. The second name is the target.

**Multi-Faceted Roles:** Include all applicable dynamics.
Example: "John is to Jasmine: Friend, Lab Partner, Lover, Rival"

**Depth Requirement:** Capture real social, professional, romantic, or power dynamics.

**ALLOWED (Examples, not exhaustive):** Friend, Lover, Spouse, Rival, Boss, Employee, Captor, Prisoner, Illicit Affair Partner, Sexual Dominant, Submissive, Mentor, Protégé, Parent, Child, Sibling, Cousin, Uncle, Aunt, Neighbor, Landlord, Tenant, Doctor, Patient, Teacher, Student, etc.

**FORBIDDEN:** Do not use situational "concepts" or passive states like "Witness," "Bystander," "Observer," "Listener," or "Interviewer." If no real dynamic exists beyond "witnessing," do not include the relationship.

**Strict Constraint:** Do NOT include actions, events, or history (e.g., "John met Julia at a bar" or "John is angry at Julia"). Only include the core social or familial standing.

**No History/Actions:** Do not include events (e.g., "John is to Jasmine: Person who saved her life"). Focus strictly on the current standing/role.

⚠️ CRITICAL FORMAT RULES:
1. ALWAYS use "[Name] is to [Name]: [role]" format
2. Use CANONICAL character names from lorebook (never aliases)
3. Direction matters: "A is to B: parent" ≠ "B is to A: parent"
4. Multiple roles allowed per relationship: "A is to B: Friend, Colleague, Rival"

Rules:
- One entry per distinct person. NEVER combine two different people into one entry.
- If the same person is referred by variants ("John", "John Blackwell", "Scout"), make ONE entry with name = best full name ("John Blackwell") and put other names in aliases.
- Do NOT create names like "Jade/Jesse" or "Sarah and Maya". Instead, create separate entries: [{"name":"Jade"}, {"name":"Jesse"}].
- Only extract clearly named speaking characters.
- Skip generic references ("the waiter", "a woman").
- Use most recent information for conflicts.
- Empty array if no clear characters: {"characters":[]}
- Confidence: 90+ (explicit), 70-89 (clear), 50-69 (mentioned), <50 (vague).

FIELD EXAMPLES:

NAME EXAMPLES:
✅ "John Blackwood" (not "John Blackwood, John")
✅ "Maria Santos" (not "Maria/Marie")
✅ "Alex" (when full name unknown)

ALIAS EXAMPLES:
✅ ["John", "Scout", "JB"]
✅ ["Marie", "Maria"]
✅ ["Mom", "Mother", "Sarah"]

RELATIONSHIP EXAMPLES:
✅ ["Dora is to John Blackwood: lover, submissive", "Maya is to Sarah Chen: sister, gymnastics partner"]
❌ ["Lives in penthouse", "Writing novels", "Leading group", "Met at bar"]
❌ ["Dora, John, lover", "John, Jasmine, friend"] (OLD TRIPLET FORMAT - NEVER USE)
❌ ["Dora is to John: lover", "Dora is to John Blackwood: submissive"] (split relationships)

🔥 FINAL REMINDER - CRITICAL FOR SUCCESS:
Your response must start with { immediately and end with } immediately.
NO text, explanations, or markers before or after the JSON.
Every description must have a property name: "physical": "tall", not just "tall".
Validate your JSON syntax before responding - missing colons or orphaned strings will cause parsing failure.

Your response must start with { immediately.`;

/**
 * Get the system prompt for analysis
 * @returns {string} System prompt text
 */
async function getSystemPrompt() {
    const settings = await get_settings();
    const prompt = settings?.systemPrompt || DEFAULT_SYSTEM_PROMPT;
    // Ensure we return a string, not a Promise or object
    return typeof prompt === 'string' ? prompt : DEFAULT_SYSTEM_PROMPT;
}

/**
 * Load available Ollama models from the configured endpoint and cache them.
 * @returns {Promise<Array>} Array of available models
 */
export async function loadOllamaModels() {
    return withErrorBoundary('loadOllamaModels', async () => {
        const ollamaEndpoint = await get_settings('ollamaEndpoint', 'http://localhost:11434');

        try {
            const response = await fetch(`${ollamaEndpoint}/api/tags`);

            if (!response.ok) {
                throw new Error(`Failed to load Ollama models: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            ollamaModels = Array.isArray(data?.models) ? data.models : [];
            debugLog(`[OllamaModels] Found ${ollamaModels.length} models: ${ollamaModels.map(m => m.name).join(', ')}`);
            return [...ollamaModels];
        } catch (error) {
            console.error('Error loading Ollama models:', error);
            notifications.error('Failed to load Ollama models. Check endpoint and try again.');
            throw error;
        }
    });
}

/**
 * Get cached Ollama models
 * @returns {Array} Array of available models
 */
export function getOllamaModels() {
    return [...ollamaModels];
}

/**
 * Get Ollama model context size
 * @param {string} modelName - Name of the Ollama model
 * @returns {Promise<number>} Context size in tokens, or default 4096
 */
export async function getOllamaModelContext(modelName) {
    return withErrorBoundary('getOllamaModelContext', async () => {
        const ollamaEndpoint = await get_settings('ollamaEndpoint', 'http://localhost:11434');

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
 * Build a roster of known characters in lorebook format for context
 * Returns keys and formatted content fields to support incremental updates
 * @returns {string} Formatted roster text with lorebook entries
 */
export async function buildCharacterRoster() {
    return withErrorBoundary('buildCharacterRoster', async () => {
        const characters = await getCharacters();
        const characterNames = Object.keys(characters);

        if (characterNames.length === 0) {
            return '(None - this is the first analysis)';
        }

        const entries = characterNames.map(name => {
            const char = characters[name];

            // Build keys array (name + aliases)
            const keys = [char.preferredName || name];
            if (char.aliases && char.aliases.length > 0) {
                keys.push(...char.aliases);
            }

            // Build formatted content (same format as lorebook)
            const contentParts = [];

            // Age info
            if (char.physicalAge || char.mentalAge) {
                const ageInfo = [];
                if (char.physicalAge) ageInfo.push(`Physical: ${char.physicalAge}`);
                if (char.mentalAge) ageInfo.push(`Mental: ${char.mentalAge}`);
                contentParts.push(`**Age:** ${ageInfo.join(', ')}`);
            }

            // Physical
            if (char.physical) {
                contentParts.push(`\\n**Physical Description:**\\n${char.physical}`);
            }

            // Personality
            if (char.personality) {
                contentParts.push(`\\n**Personality:**\\n${char.personality}`);
            }

            // Sexuality
            if (char.sexuality) {
                contentParts.push(`\\n**Sexuality:**\\n${char.sexuality}`);
            }

            // Race/Ethnicity
            if (char.raceEthnicity) {
                contentParts.push(`**Race/Ethnicity:** ${char.raceEthnicity}`);
            }

            // Role & Skills
            if (char.roleSkills) {
                contentParts.push(`\\n**Role & Skills:**\\n${char.roleSkills}`);
            }

            // Relationships
            if (char.relationships && char.relationships.length > 0) {
                contentParts.push('\\n**Relationships:**');
                char.relationships.forEach(rel => {
                    contentParts.push(`- ${rel}`);
                });
            }

            const content = contentParts.join('\\n');

            return `
---
KEYS: ${keys.join(', ')}
CONTENT:
${content}
`;
        }).join('\\n');

        return entries;
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
            const llmConfig = await getLLMConfig();
            let maxContext = 8192; // Default minimum context
            let detectionMethod = 'fallback';

            logEntry(`Starting context detection for LLM source: ${llmConfig.source}`);

            if (llmConfig.source === 'ollama' && llmConfig.ollamaModel) {
                logEntry(`Using Ollama model: ${llmConfig.ollamaModel}`);
                // Get Ollama model's context size
                maxContext = await getOllamaModelContext(llmConfig.ollamaModel);
                detectionMethod = 'ollama';
            } else {
                logEntry('Using SillyTavern context');
                // Use SillyTavern's context
                let context = null;

                try {
                    context = stContext.getContext();
                    logEntry('Successfully retrieved SillyTavern context');
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
                            k.toLowerCase().includes('prompt'),
                        );
                        logEntry(`Available context properties: ${relevantKeys.join(', ')}`);
                    } catch (e) {
                        logEntry(`Error analyzing context keys: ${e.message}`);
                    }
                }

                // Try multiple possible paths for max context
                let detectedMaxContext = null;

                // Method 1: Direct maxContext property (PRIMARY)
                logEntry('Method 1: Checking context.maxContext...');
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

                // Method 2: extensionSettings.common.maxContext path (REMOVED - API doesn't exist)
                // This property path was incorrect and has been removed.
                // Use getMaxContextSize() instead.

                // Method 3: chat.maxContextSize path
                if (!detectedMaxContext) {
                    logEntry('Method 3: Checking context.chat.maxContextSize...');
                    if (context?.chat && typeof context.chat === 'object' && !Array.isArray(context.chat)) {
                        if (typeof context.chat.maxContextSize === 'number' && context.chat.maxContextSize > 0) {
                            detectedMaxContext = context.chat.maxContextSize;
                            logEntry(`✓ Method 3 SUCCESS: chat.maxContextSize = ${detectedMaxContext}`);
                            detectionMethod = 'chat.maxContextSize';
                        } else {
                            logEntry('✗ Method 3 FAILED: chat exists but maxContextSize is invalid');
                        }
                    } else {
                        logEntry('✗ Method 3 FAILED: chat path does not exist or is an array');
                    }
                }

                // Method 4: token_limit
                if (!detectedMaxContext) {
                    logEntry('Method 4: Checking context.token_limit...');
                    if (context && typeof context.token_limit === 'number' && context.token_limit > 0) {
                        detectedMaxContext = context.token_limit;
                        logEntry(`✓ Method 4 SUCCESS: token_limit = ${detectedMaxContext}`);
                        detectionMethod = 'token_limit';
                    } else {
                        logEntry('✗ Method 4 FAILED: token_limit is not valid');
                    }
                }

                // Method 5: amount_gen (maximum generation tokens)
                if (!detectedMaxContext) {
                    logEntry('Method 5: Checking context.amount_gen (fallback)...');
                    if (context && typeof context.amount_gen === 'number' && context.amount_gen > 0) {
                        // amount_gen is typically small (generation limit), not context size
                        // Use as indicator if no other value found
                        detectedMaxContext = context.amount_gen * 4; // Rough estimate
                        logEntry(`✓ Method 5 FALLBACK: amount_gen = ${context.amount_gen}, estimated context = ${detectedMaxContext}`);
                        detectionMethod = 'amount_gen_estimate';
                    } else {
                        logEntry('✗ Method 5 FAILED: amount_gen is not valid');
                    }
                }

                // Method 6: Check settings object directly
                if (!detectedMaxContext) {
                    logEntry('Method 6: Checking context.settings.max_context...');
                    if (context && typeof context.settings === 'object') {
                        if (typeof context.settings.max_context === 'number' && context.settings.max_context > 0) {
                            detectedMaxContext = context.settings.max_context;
                            logEntry(`✓ Method 6 SUCCESS: settings.max_context = ${detectedMaxContext}`);
                            detectionMethod = 'settings.max_context';
                        } else {
                            logEntry('✗ Method 6 FAILED: settings exists but max_context is invalid');
                        }
                    } else {
                        logEntry('✗ Method 6 FAILED: settings path does not exist');
                    }
                }

                // Final check: is detected value reasonable?
                if (detectedMaxContext && (typeof detectedMaxContext !== 'number' || detectedMaxContext < 100)) {
                    logEntry(`WARNING: Detected maxContext is not valid: ${detectedMaxContext}, type: ${typeof detectedMaxContext}`);
                    detectedMaxContext = null;
                }

                // Check if context is fully loaded
                if (!context || !detectedMaxContext) {
                    logEntry('WARNING: Could not detect maxContext from any path, using fallback (8192)');
                    logEntry(`Context exists: ${!!context}, detectedMaxContext: ${detectedMaxContext}`);
                    if (context) {
                        try {
                            const allKeys = Object.keys(context).sort();
                            logEntry(`Full context object keys (first 20): ${allKeys.slice(0, 20).join(', ')}${allKeys.length > 20 ? `... (${allKeys.length - 20} more)` : ''}`);
                        } catch (e) {
                            logEntry(`Could not enumerate context keys: ${e.message}`);
                        }
                    }
                    maxContext = 8192; // Use minimum required context as fallback
                    detectionMethod = 'fallback';
                } else {
                    maxContext = Math.floor(detectedMaxContext);
                    logEntry(`Detected maxContext: ${maxContext} (type: ${typeof maxContext})`);
                    // detectionMethod already set correctly
                }
            }

            // Validate minimum context requirement (8K minimum)
            if (maxContext < 8192) {
                const errorMsg = `Model context too small: ${maxContext} tokens. Minimum required: 8192 tokens. Please use a model with larger context.`;
                logEntry(errorMsg);
                throw new NameTrackerError(errorMsg);
            }

            // Use generous context allocation for prompts (60% for prompt, 40% for response)
            // Remove artificial 50K ceiling to use full available context
            const tokensForPrompt = Math.floor(maxContext * 0.6);

            logEntry(`Token allocation: maxContext=${maxContext}, promptAllocation=${tokensForPrompt}, responseAllocation=${maxContext - tokensForPrompt}`);
            logEntry(`Final detection method: ${detectionMethod}`);

            const finalValue = Math.max(1000, tokensForPrompt);
            logEntry(`Returning maxPromptLength: ${finalValue}`);

            // Return object with detection details
            return {
                maxPrompt: finalValue,
                detectionMethod: detectionMethod,
                maxContext: maxContext,
                debugLog: detectionLog.join('\n'),
            };
        } catch (error) {
            const errorMsg = `ERROR in getMaxPromptLength: ${error.message}`;
            logEntry(errorMsg);
            console.error('[NT-MaxContext] Stack:', error.stack);
            // Return conservative fallback on any error with details
            return {
                maxPrompt: 4915, // Based on 8192 minimum context with 60% allocation
                detectionMethod: 'error',
                maxContext: 8192, // Minimum required context
                debugLog: detectionLog.join('\n') + '\nFATAL ERROR: ' + error.message,
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
export async function callSillyTavern(systemPrompt, prompt, prefill = '', interactive = false) {
    return withErrorBoundary('callSillyTavern', async () => {
        debug.log();

        // Use SillyTavern.getContext() as recommended in official docs
        const context = stContext.getContext();

        // Check if we have an active API connection
        if (!context.onlineStatus) {
            throw new NameTrackerError('No API connection available. Please connect to an API first.');
        }

        if (DEBUG_LOGGING) {
            console.log('[NT-ST-Call] Starting SillyTavern LLM call');
            console.log('[NT-ST-Call] System prompt length:', systemPrompt.length, 'characters');
            console.log('[NT-ST-Call] User prompt length:', prompt.length, 'characters');
            if (prefill) console.log('[NT-ST-Call] Prefill:', prefill);
            console.log('[NT-ST-Call] ========== PROMPT STRUCTURE START ==========');
            console.log('SYSTEM:', systemPrompt);
            console.log('USER:', prompt);
            if (prefill) console.log('PREFILL:', prefill);
            console.log('[NT-ST-Call] ========== PROMPT STRUCTURE END ==========');
        }

        // Calculate token counts separately for better tracking
        const maxContext = context.maxContext || 8192;
        let systemTokens, userTokens, totalPromptTokens;

        try {
            systemTokens = await context.getTokenCountAsync(systemPrompt);
            const userPromptText = prompt + (prefill ? '\n' + prefill : '');
            userTokens = await context.getTokenCountAsync(userPromptText);
            totalPromptTokens = systemTokens + userTokens;
        } catch (_error) {
            if (DEBUG_LOGGING) console.log('[NT-ST-Call] Token count failed, estimating:', _error.message);
            // Fallback to character-based estimation
            systemTokens = Math.ceil(systemPrompt.length / 4);
            const userPromptText = prompt + (prefill ? '\n' + prefill : '');
            userTokens = Math.ceil(userPromptText.length / 4);
            totalPromptTokens = systemTokens + userTokens;
        }

        // Calculate response length with 20% buffer
        const bufferTokens = Math.ceil(maxContext * 0.20); // 20% buffer
        const calculatedResponseLength = Math.max(1024, maxContext - totalPromptTokens - bufferTokens);

        // Log context usage tracking
        console.log('[NT-CONTEXT] ========== Context Usage Tracking ==========');
        console.log('[NT-CONTEXT] maxContext:', maxContext);
        console.log('[NT-CONTEXT] systemTokens:', systemTokens);
        console.log('[NT-CONTEXT] userTokens:', userTokens);
        console.log('[NT-CONTEXT] totalPromptTokens:', totalPromptTokens);
        console.log('[NT-CONTEXT] bufferTokens (20%):', bufferTokens);
        console.log('[NT-CONTEXT] calculatedResponseLength:', calculatedResponseLength);
        console.log('[NT-CONTEXT] contextUtilization:', ((totalPromptTokens / maxContext) * 100).toFixed(1) + '%');

        const maxTokens = calculatedResponseLength;
        debug.log();

        // Retry logic: attempt up to 2 times with a short delay
        const MAX_RETRIES = 2;
        const RETRY_DELAY_MS = 2000;
        let lastError = null;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                if (DEBUG_LOGGING) {
                    console.log(`[NT-ST-Call] Attempt ${attempt}/${MAX_RETRIES}`);
                    console.log('[NT-ST-Call] 🔧 DEBUG: Token allocation details:');
                    console.log(`[NT-ST-Call] - maxContext: ${maxContext}`);
                    console.log(`[NT-ST-Call] - systemTokens: ${systemTokens}`);
                    console.log(`[NT-ST-Call] - userTokens: ${userTokens}`);
                    console.log(`[NT-ST-Call] - totalPromptTokens: ${totalPromptTokens}`);
                    console.log(`[NT-ST-Call] - calculated maxTokens: ${maxTokens}`);
                    console.log(`[NT-ST-Call] - buffer used: ${bufferTokens} tokens (20%)`);
                    console.log(`[NT-ST-Call] - actual responseLength param: ${maxTokens}`);
                    console.log('[NT-ST-Call] Calling generateRaw with params:', {
                        temperature: GENERATION_TEMPERATURE,
                        top_p: GENERATION_TOP_P,
                        top_k: GENERATION_TOP_K,
                        rep_pen: GENERATION_REP_PEN,
                        responseLength: maxTokens,
                    });
                }

                // Add /nothink suffix to instruct model to avoid thinking contamination
                // Escalate suffix on retries after contamination detection
                let promptWithSuffix = prompt + '\n\n/nothink';
                if (attempt > 1 && lastError?.code === 'THINKING_CONTAMINATION') {
                    // Use stronger prompt on retry after contamination
                    promptWithSuffix = prompt + '\n\n/nothink\n\nCRITICAL: OUTPUT ONLY VALID JSON - NO THINKING OR COMMENTARY';
                    console.log('[NT-ST-Call] Using escalated anti-thinking prompt on retry', attempt);
                }

                const result = await context.generateRaw({
                    systemPrompt,
                    prompt: promptWithSuffix,
                    prefill,
                    temperature: GENERATION_TEMPERATURE,
                    top_p: GENERATION_TOP_P,
                    top_k: GENERATION_TOP_K,
                    rep_pen: GENERATION_REP_PEN,
                    responseLength: maxTokens, // Use all available tokens for response (no 2048 limit)
                });

                if (DEBUG_LOGGING) {
                    console.log('[NT-ST-Call] ========== RAW API RESPONSE START ==========');
                    console.log('[NT-ST-Call] Response type:', typeof result);
                    console.log(JSON.stringify(result, null, 2));
                    console.log('[NT-ST-Call] ========== RAW API RESPONSE END ==========');

                    console.log('[NT-ST-Call] Raw result type:', typeof result);
                    console.log('[NT-ST-Call] Raw result object:', JSON.stringify(result).substring(0, 500));
                }

                // Extract text from chat completion response
                // Chat format: { choices: [{ message: { content: "..." } }] }
                // Text format: { choices: [{ text: "..." }] }
                let resultText = result;

                if (typeof result === 'object' && result.choices && Array.isArray(result.choices)) {
                    // Try chat completion format first
                    if (result.choices[0]?.message?.content) {
                        if (DEBUG_LOGGING) console.log('[NT-ST-Call] Detected chat completion format, extracting from choices[0].message.content');
                        resultText = result.choices[0].message.content;
                    }
                    // Fall back to text completion format
                    else if (result.choices[0]?.text) {
                        if (DEBUG_LOGGING) console.log('[NT-ST-Call] Detected text completion format, extracting from choices[0].text');
                        resultText = result.choices[0].text;
                    }
                }

                if (DEBUG_LOGGING) {
                    console.log('[NT-ST-Call] Extracted text type:', typeof resultText);
                    console.log('[NT-ST-Call] Extracted text length:', resultText ? resultText.length : 'null');
                    if (resultText && typeof resultText === 'string') {
                        console.log('[NT-ST-Call] Extracted text preview:', resultText.substring(0, 300));
                    }
                    console.log('[NT-ST-Call] ========== EXTRACTED TEXT START ==========');
                    console.log(resultText);
                    console.log('[NT-ST-Call] ========== EXTRACTED TEXT END ==========');
                }

                // Log raw response for debugging if debug mode enabled
                const debugMode = await get_settings('debugMode');
                if (debugMode) {
                    logRawResponse(resultText, 'SillyTavern');
                }

                // Log actual response token usage
                try {
                    const responseTokens = await context.getTokenCountAsync(resultText);
                    console.log('[NT-CONTEXT] actualResponseTokens:', responseTokens);
                    console.log('[NT-CONTEXT] responseEfficiency:', ((responseTokens / calculatedResponseLength) * 100).toFixed(1) + '%');
                    console.log('[NT-CONTEXT] totalTokensUsed:', totalPromptTokens + responseTokens);
                    console.log('[NT-CONTEXT] totalContextUsed:', (((totalPromptTokens + responseTokens) / maxContext) * 100).toFixed(1) + '%');
                } catch (_error) {
                    console.log('[NT-CONTEXT] responseTokenCountError:', _error.message);
                    const estimatedTokens = Math.ceil(resultText.length / 4);
                    console.log('[NT-CONTEXT] estimatedResponseTokens:', estimatedTokens);
                }
                console.log('[NT-CONTEXT] ===============================================');

                debug.log();

                // The result should be a string
                if (!resultText || typeof resultText !== 'string') {
                    throw new NameTrackerError('Empty or invalid response from SillyTavern LLM');
                }

                // REC-13: CRITICAL - Remove thinking tags BEFORE contamination check
                // Must happen here so detectThinkingContamination() doesn't reject valid responses
                const beforeThinkRemoval = resultText;
                if (resultText.includes('<think>') || resultText.includes('</think>') || 
                    resultText.includes('<thinking>') || resultText.includes('</thinking>')) {
                    
                    console.log('[NT-ST-Call] 🧹 Removing thinking tags from response...');
                    
                    // Remove complete thinking blocks with content
                    resultText = resultText.replace(/<think>[\s\S]*?<\/think>/gi, '');
                    resultText = resultText.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '');
                    
                    // Remove orphaned opening tags
                    resultText = resultText.replace(/<think>/gi, '');
                    resultText = resultText.replace(/<thinking>/gi, '');
                    
                    // Remove orphaned closing tags
                    resultText = resultText.replace(/<\/think>/gi, '');
                    resultText = resultText.replace(/<\/thinking>/gi, '');
                    
                    // Remove any text from start up to first closing think tag (handles truncated opening)
                    resultText = resultText.replace(/^[\s\S]*?<\/think>/i, '');
                    resultText = resultText.replace(/^[\s\S]*?<\/thinking>/i, '');
                    
                    console.log(`[NT-ST-Call] ✅ Removed thinking tags, length: ${beforeThinkRemoval.length} -> ${resultText.length}`);
                }

                // Check for thinking contamination BEFORE attempting parse
                const isContaminated = detectThinkingContamination(resultText, calculatedResponseLength);
                if (isContaminated) {
                    const error = new NameTrackerError('LLM response contains thinking contamination - rejecting and will retry');
                    error.code = 'THINKING_CONTAMINATION';
                    throw error;
                }

                // Pre-validation: Check if response follows JSON format requirements
                console.log('[NT-ST-Call] 🔍 Pre-validation checks...');

                const trimmedResult = resultText.trim();

                // Check for common format violations before parsing
                if (!trimmedResult.startsWith('{')) {
                    console.warn('[NT-ST-Call] ⚠️ Response does not start with { - attempting extraction');
                    // Try to find JSON in the response
                    const jsonMatch = trimmedResult.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        resultText = jsonMatch[0];
                        console.log('[NT-ST-Call] ✅ Extracted JSON from response');
                    } else {
                        console.error('[NT-ST-Call] ❌ No valid JSON found in response');
                        throw new NameTrackerError('LLM response does not contain valid JSON format');
                    }
                }

                // Check for orphaned strings (common parsing issue)
                const orphanedStringPattern = /"[^"]+",\s*"[^"]*[a-zA-Z][^"]*",\s*"[a-zA-Z_]/;
                if (orphanedStringPattern.test(resultText)) {
                    console.warn('[NT-ST-Call] ⚠️ Detected potential orphaned strings in response');
                    console.log('[NT-ST-Call] Response will need JSON repair during parsing');
                }

                // If we used a prefill, prepend it to complete the JSON
                if (prefill) {
                    if (DEBUG_LOGGING) console.log('[NT-ST-Call] Prepending prefill to complete JSON:', prefill);
                    resultText = prefill + resultText;

                    // If the prefill opened an object but response doesn't close it, add closing brace
                    // Count braces to see if balanced
                    const openBraces = (resultText.match(/{/g) || []).length;
                    const closeBraces = (resultText.match(/}/g) || []).length;

                    if (openBraces > closeBraces) {
                        const missing = openBraces - closeBraces;
                        if (DEBUG_LOGGING) console.log(`[NT-ST-Call] Adding ${missing} closing brace(s) to complete JSON`);
                        resultText += '}'.repeat(missing);
                    }

                    if (DEBUG_LOGGING) console.log('[NT-ST-Call] Combined text preview:', resultText.substring(0, 300));
                }

                const parsed = await parseJSONResponse(resultText);
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
                    const waitStart = Date.now();
                    const waitSeconds = Math.round(RETRY_DELAY_MS / 100) / 10; // one decimal place
                    console.log(`[NT-ST-Call] Waiting ${RETRY_DELAY_MS}ms (~${waitSeconds}s) before retry...`);
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                    const waited = Date.now() - waitStart;
                    console.log(`[NT-ST-Call] Waited ${waited}ms before next attempt`);
                }
            }
        }

        // All retries failed
        if (interactive) {
            const shouldContinue = confirm(
                `Failed to parse LLM response after ${MAX_RETRIES} attempts.\n\n` +
                `Last error: ${lastError.message}\n\n` +
                'Check console for detailed logs. Continue processing remaining batches?',
            );

            if (!shouldContinue) {
                throw new NameTrackerError('User aborted after parse failures');
            }
            // Return empty result if user wants to continue
            return { characters: [] };
        }

        // Non-interactive mode: throw to allow outer logic to retry/split
        const err = new NameTrackerError(`Failed to parse LLM response as JSON after ${MAX_RETRIES} attempts (non-interactive mode)`);
        err.code = 'JSON_PARSE_FAILED';
        err.lastError = lastError;
        throw err;
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
        const llmConfig = await getLLMConfig();

        if (!llmConfig.ollamaModel) {
            throw new NameTrackerError('No Ollama model selected');
        }

        debug.log();

        // Calculate response tokens: use generous allocation within available context
        const maxContext = await getOllamaModelContext(llmConfig.ollamaModel);
        const promptTokens = Math.ceil(prompt.length / 4); // Rough estimate
        const maxTokens = Math.max(8192, maxContext - promptTokens - 1000); // Generous response allocation with safety buffer
        debug.log();

        // Add /nothink suffix to instruct model to avoid thinking contamination
        const promptWithSuffix = prompt + '\n\n/nothink';

        const response = await fetch(`${llmConfig.ollamaEndpoint}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: llmConfig.ollamaModel,
                prompt: promptWithSuffix,
                stream: false,
                format: 'json',
                // Ollama-specific generation parameters for structured output
                // Using same conservative settings as SillyTavern for consistency
                options: {
                    temperature: GENERATION_TEMPERATURE,      // Very low for deterministic output
                    top_p: GENERATION_TOP_P,                  // Focused sampling
                    top_k: GENERATION_TOP_K,                  // Standard focused sampling
                    repeat_penalty: GENERATION_REP_PEN,       // Slight repetition penalty
                    num_predict: maxTokens,  // Dynamic: generous allocation using remaining context after prompt
                },
            }),
        });

        if (!response.ok) {
            throw new NameTrackerError(`Ollama API error: ${response.statusText}`);
        }

        const data = await response.json();
        debug.log();
        debug.log();

        // Check for thinking contamination before parsing
        const responseText = data.response || '';
        const estimatedTokens = Math.ceil(responseText.length / 4);
        const isContaminated = detectThinkingContamination(responseText, estimatedTokens);

        if (isContaminated) {
            console.warn('[NT-Ollama] Response contaminated with thinking - attempting parse anyway (Ollama has no retry)');
            // Note: Ollama doesn't have built-in retry like SillyTavern, so we proceed with repair
        }

        return await parseJSONResponse(data.response);
    });
}

/**
 * Detect thinking contamination in LLM response (binary detection)
 * @param {string} text - LLM response text
 * @param {number} budgetTokens - Expected response budget in tokens
 * @returns {boolean} True if thinking contamination detected
 */
function detectThinkingContamination(text, budgetTokens = 5000) {
    console.log('[NT-Contamination] Checking for thinking contamination...');

    // Check 1: Response length exceeds budget by 2x
    const estimatedTokens = Math.ceil(text.length / 4);
    if (estimatedTokens > budgetTokens * 2.0) {
        console.log('[NT-Contamination] ❌ DETECTED: Response too long');
        console.log('[NT-Contamination] Estimated:', estimatedTokens, 'Budget:', budgetTokens, 'Ratio:', (estimatedTokens / budgetTokens).toFixed(2));
        return true;
    }

    // Check 2: Common thinking phrases
    const thinkingPhrases = [
        /however[,\s]/i,
        /let me (think|consider|analyze|reconsider)/i,
        /upon (reflection|analysis|consideration)/i,
        /it (seems|appears) that/i,
        /looking at (this|these|the)/i,
        /based on (this|these|the) (message|conversation|text)/i,
        /from (this|these|the) (message|conversation|text)/i,
        /these messages (reveal|show|indicate|suggest)/i,
        /this (message|conversation) (reveal|show|indicate|suggest)/i,
        /i (notice|observe|see) that/i,
        /we can (see|infer|deduce|conclude)/i,
        /this (indicates|suggests|shows)/i,
    ];

    for (const pattern of thinkingPhrases) {
        if (pattern.test(text)) {
            console.log('[NT-Contamination] ❌ DETECTED: Thinking phrase found:', pattern.source);
            return true;
        }
    }

    // Check 3: Unquoted prose patterns (text outside JSON structure)
    // Look for sentence-like patterns outside quotes
    const jsonStripped = text.replace(/"([^"]*)"/g, '""'); // Remove all string contents
    const sentencePattern = /[A-Z][a-z]+\s+[a-z]+\s+[a-z]+/; // "Word word word" pattern
    if (sentencePattern.test(jsonStripped)) {
        console.log('[NT-Contamination] ❌ DETECTED: Unquoted prose pattern');
        return true;
    }

    // Check 4: Non-schema fields (common thinking artifacts)
    const nonSchemaFields = [
        /"thinking":/i,
        /"thoughts":/i,
        /"analysis":/i,
        /"reasoning":/i,
        /"notes":/i,
        /"commentary":/i,
        /"observations":/i,
    ];

    for (const pattern of nonSchemaFields) {
        if (pattern.test(text)) {
            console.log('[NT-Contamination] ❌ DETECTED: Non-schema field:', pattern.source);
            return true;
        }
    }

    // Check 5: XML-style thinking tags (DISABLED - handled upstream in REC-13)
    // Tags are now removed BEFORE this function is called
    /* DISABLED
    if (/<think>/i.test(text) || /<thinking>/i.test(text) || /<\/think>/i.test(text)) {
        console.log('[NT-Contamination] ❌ DETECTED: XML thinking tags');
        return true;
    }
    */

    console.log('[NT-Contamination] ✅ No contamination detected');
    return false;
}

/**
 * Repair common JSON syntax errors in LLM responses
 * @param {string} text - Potentially malformed JSON text
 * @returns {string} Repaired JSON text
 */
function repairJSON(text) {
    console.log('[NT-Repair] Starting JSON repair...');
    let repaired = text;

    // 0. Remove XML thinking tags completely (critical fix for recent failures)
    repaired = repaired.replace(/<\/think>/gi, '');
    repaired = repaired.replace(/<think[^>]*>/gi, '');
    repaired = repaired.replace(/<thinking[^>]*>[\s\S]*?<\/thinking>/gi, '');
    repaired = repaired.replace(/<think>[\s\S]*?<\/think>/gi, '');
    if (repaired !== text) {
        console.log('[NT-Repair] 🧹 Removed XML thinking tags');
    }

    // 1. Fix major structural issue: orphaned string values without property names
    // This is the most common issue causing parse failures
    // Pattern: "property": "value", "orphaned description text", "nextProperty":
    // Step 1: Find and fix orphaned strings that should be in physical/personality fields
    repaired = repaired.replace(/"name":\s*"([^"]*)",\s*"([^"]*(?:breast|body|hair|skin|face|eyes|tall|short|curvy|slim|muscular|describe|appear|look|physic)[^"]*)",\s*"([a-zA-Z_][a-zA-Z0-9_]*)":/gi, (match, name, orphanedDesc, nextProp) => {
        console.log(`[NT-Repair] 🔧 Fixing orphaned physical description for ${name}: ${orphanedDesc.substring(0, 50)}...`);
        return `"name": "${name}", "physical": "${orphanedDesc}", "${nextProp}":`;
    });

    // Step 2: Fix personality/mental descriptions
    repaired = repaired.replace(/"name":\s*"([^"]*)",\s*"([^"]*(?:personality|character|behavior|emotion|feel|think|mental|psych|mood)[^"]*)",\s*"([a-zA-Z_][a-zA-Z0-9_]*)":/gi, (match, name, orphanedDesc, nextProp) => {
        console.log(`[NT-Repair] 🔧 Fixing orphaned personality description for ${name}: ${orphanedDesc.substring(0, 50)}...`);
        return `"name": "${name}", "personality": "${orphanedDesc}", "${nextProp}":`;
    });

    // Step 3: Generic fallback - assign any remaining orphaned strings to physical field
    repaired = repaired.replace(/"name":\s*"([^"]*)",\s*"([^"]{20,})",\s*"([a-zA-Z_][a-zA-Z0-9_]*)":/g, (match, name, orphanedDesc, nextProp) => {
        console.log(`[NT-Repair] 🔧 Fixing generic orphaned description for ${name}: ${orphanedDesc.substring(0, 50)}...`);
        return `"name": "${name}", "physical": "${orphanedDesc}", "${nextProp}":`;
    });

    // 2. Fix orphaned strings anywhere in character objects (not just after name)
    // Pattern: }: value, "nextProp": (missing property name before value)
    repaired = repaired.replace(/},\s*"([^"]{15,})",\s*"([a-zA-Z_][a-zA-Z0-9_]*)":/g, (match, orphanedDesc, nextProp) => {
        console.log(`[NT-Repair] 🔧 Fixing orphaned string before ${nextProp}: ${orphanedDesc.substring(0, 50)}...`);
        return `}, "physical": "${orphanedDesc}", "${nextProp}":`;
    });

    // 3. Fix missing commas between object properties (line breaks without commas)
    repaired = repaired.replace(/([}\]])\s*\n\s*(")/g, '$1,\n    $2');

    // 4. Fix control characters (newlines, tabs, etc. in strings) - ENHANCED
    repaired = repaired.replace(/"([^"]*[\n\r\t\f\b\v][^"]*)"/g, (match, content) => {
        const cleaned = content
            .replace(/\n/g, ' ')     // newlines -> space
            .replace(/\r/g, '')      // carriage returns -> remove
            .replace(/\t/g, ' ')     // tabs -> space
            .replace(/\f/g, ' ')     // form feeds -> space
            .replace(/\b/g, '')      // backspace -> remove
            .replace(/\v/g, ' ')     // vertical tabs -> space
            .replace(/\s+/g, ' ')    // collapse multiple spaces
            .trim();                 // remove leading/trailing space
        console.log(`[NT-Repair] 🧹 Cleaned control characters: ${content.length} -> ${cleaned.length} chars`);
        return `"${cleaned}"`;
    });

    // 5. Remove error messages that get mixed into JSON
    repaired = repaired.replace(/,\s*"[^"]*I'm sorry for[^"]*"/gi, '');
    repaired = repaired.replace(/,\s*"[^"]*encountered a problem[^"]*"/gi, '');
    repaired = repaired.replace(/,\s*"[^"]*Please try again[^"]*"/gi, '');
    repaired = repaired.replace(/"[^"]*I'm sorry[^"]*"\s*,/gi, '');

    // Remove property names that are error messages (missing opening quote)
    repaired = repaired.replace(/,\s*[A-Za-z]+"\s*:\s*"[^"]*I'm sorry[^"]*/gi, '');

    // 6. Fix missing quotes around property names (critical fix)
    // Pattern: ,Affected": or }Affected": (missing opening quote)
    repaired = repaired.replace(/([,{]\s*)([A-Za-z_][A-Za-z0-9_]*)("):/g, '$1"$2$3:');

    // 7. Fix trailing commas before closing brackets/braces
    repaired = repaired.replace(/,(\s*[}\]])/g, '$1');

    // 6. Fix missing colons after property names
    repaired = repaired.replace(/"([^"]+)"\s+(?=["'{[])/g, '"$1": ');

    // 7. Fix double commas introduced by repairs
    repaired = repaired.replace(/,,+/g, ',');

    // 8. Fix property names with spaces
    repaired = repaired.replace(/"([^"]*\s[^"]*)"\s*:/g, (match, propName) => {
        const cleanProp = propName.replace(/\s+/g, '');
        return `"${cleanProp}":`;
    });

    // 9. Final validation: ensure all character objects have required fields
    repaired = repaired.replace(/"name":\s*"([^"]*)"(?!\s*,\s*"(?:aliases|physical|personality))/g, (match, name) => {
        console.log(`[NT-Repair] 🔧 Adding missing fields for character: ${name}`);
        return `"name": "${name}", "aliases": [], "physical": "", "personality": ""`;
    });

    console.log('[NT-Repair] Applied repairs, length change:', repaired.length - text.length);

    return repaired;
}

/**
 * Parse JSON response from LLM, handling various formats
 * @param {string} text - Raw text response from LLM
 * @returns {Object} Parsed JSON object
 */
export function parseJSONResponse(text) {
    return withErrorBoundary('parseJSONResponse', async () => {
        // Create debug session if debug mode is enabled
        const debugMode = await get_settings('debugMode');
        const session = debugMode ? createParsingSession() : null;

        if (session) {
            session.logStart('parseJSONResponse', text);
        }

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

        // CRITICAL: Unescape JSON-escaped string from SillyTavern
        // The API returns escaped JSON string that needs to be unescaped first
        try {
            // If text looks like a JSON-escaped string, unescape it
            if (text.includes('\\n') || text.includes('\\"')) {
                console.log('[NT-Parse] 🔧 Unescaping JSON-encoded string from SillyTavern');
                text = JSON.parse('"' + text.replace(/"/g, '\\"') + '"');
                console.log('[NT-Parse] ✅ Successfully unescaped response');
            }
        // eslint-disable-next-line no-unused-vars
        } catch (unescapeError) {
            console.log('[NT-Parse] ⚠️ Could not unescape response, proceeding with raw text');
        }

        // Remove any leading/trailing whitespace
        const beforeTrim = text;
        text = text.trim();
        console.log('[NT-Parse] After trim, length:', text.length);

        if (session) {
            session.logTransform('Trim whitespace', beforeTrim, text);
        }

        if (text.length === 0) {
            console.error('[NT-Parse] ❌ Text is empty after trim');
            if (session) session.logEnd(false, new Error('Empty after trim'), text);
            throw new NameTrackerError('LLM returned empty response');
        }

        // Extract JSON from markdown code blocks ONLY if response starts with markdown
        // This prevents false positives from backticks embedded in JSON string values
        const startsWithMarkdown = /^```(?:json)?[\s\n]/.test(text);

        if (startsWithMarkdown) {
            console.log('[NT-Parse] 🔍 Response starts with markdown code block, extracting JSON');
            const beforeExtraction = text;

            // Extract content between first ``` and last ```
            const codeBlockMatch = text.match(/^```(?:json)?[\s\n]+([\s\S]*?)```\s*$/);
            if (codeBlockMatch && codeBlockMatch[1]) {
                text = codeBlockMatch[1].trim();
                console.log('[NT-Parse] 📄 After markdown extraction, length:', text.length);

                if (session) {
                    logRegexExtraction(beforeExtraction, '/^```(?:json)?[\\s\\n]+([\\s\\S]*?)```\\s*$/', text);
                    session.logTransform('Extract markdown code block', beforeExtraction, text, {
                        regex: '/^```(?:json)?[\\s\\n]+([\\s\\S]*?)```\\s*$/',
                    });
                }
            } else {
                console.warn('[NT-Parse] ⚠️ Starts with ``` but no matching closing ```, removing markdown markers');
                // Remove opening and closing markers
                text = text.replace(/^```(?:json)?[\s\n]+/, '').replace(/```\s*$/, '');
                console.log('[NT-Parse] 🧹 Removed markdown markers, length:', text.length);

                if (session) {
                    session.logTransform('Remove malformed markdown', beforeExtraction, text);
                }
            }
        } else if (text.includes('```')) {
            // Backticks present but NOT at start - likely embedded in JSON strings
            console.log('[NT-Parse] ℹ️ Found backticks in response but not at start - likely embedded in JSON strings, not extracting');
            console.log('[NT-Parse] First 50 chars:', text.substring(0, 50));
        }

        // Remove any remaining XML/HTML tags that may interfere
        // REC-13: Remove thinking tags BEFORE generic tag removal to handle content properly
        if (text.includes('<think>') || text.includes('</think>') || text.includes('<thinking>') || text.includes('</thinking>')) {
            const beforeThinkRemoval = text;
            const originalLength = text.length;
            
            // Remove complete thinking blocks with content: <think>...</think> or <thinking>...</thinking>
            text = text.replace(/<think>[\s\S]*?<\/think>/gi, '');
            text = text.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '');
            
            // Remove orphaned opening tags
            text = text.replace(/<think>/gi, '');
            text = text.replace(/<thinking>/gi, '');
            
            // Remove orphaned closing tags
            text = text.replace(/<\/think>/gi, '');
            text = text.replace(/<\/thinking>/gi, '');
            
            // Remove any text from start up to first closing think tag (handles truncated opening)
            text = text.replace(/^[\s\S]*?<\/think>/i, '');
            text = text.replace(/^[\s\S]*?<\/thinking>/i, '');
            
            console.log(`[NT-Parse] 🧹 Removed thinking tags, length change: ${originalLength} -> ${text.length}`);
            
            if (session) {
                session.logTransform('Remove thinking tags (REC-13)', beforeThinkRemoval, text);
            }
        }
        
        if (text.includes('<') || text.includes('>')) {
            const beforeTagRemoval = text;
            const originalLength = text.length;
            text = text.replace(/<[^>]*>/g, '');
            console.log(`[NT-Parse] 🧹 Removed remaining XML/HTML tags, length change: ${originalLength} -> ${text.length}`);

            if (session) {
                session.logTransform('Remove XML/HTML tags', beforeTagRemoval, text);
            }
        }

        // Check if response contains obvious error messages
        if (text.includes('I\'m sorry') || text.includes('encountered a problem') || text.includes('Please try again')) {
            console.error(`[NT-Parse] 🚨 Response contains error message: "${text.substring(0, 200)}"`);
            if (session) session.logEnd(false, new Error('LLM error message'), text);
            throw new Error('LLM generated an error response instead of JSON. Try adjusting your request.');
        }

        // Check if response is completely non-JSON (like pure XML tags or text)
        if (text.length < 20 || (!text.includes('{') && !text.includes('['))) {
            console.error(`[NT-Parse] 🚨 Response appears to be non-JSON content: "${text}"`);
            if (session) session.logEnd(false, new Error('Non-JSON response'), text);
            throw new Error('LLM generated non-JSON response. Response may be censored or malformed.');
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

        // Apply JSON repair for common LLM syntax errors
        text = repairJSON(text);

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

            if (session) {
                session.logEnd(true, parsed, text);
            }

            return parsed;
        } catch (error) {
            console.error('[NT-Parse] ❌ JSON.parse failed:', error.message);
            console.error('[NT-Parse] ❌ Error at position:', error.name);
            console.log('[NT-Parse] Text being parsed (first 500 chars):', text.substring(0, 500));
            console.log('[NT-Parse] Text being parsed (last 200 chars):', text.substring(Math.max(0, text.length - 200)));

            // Additional targeted repairs for specific common errors
            if (error.message.includes('Expected \':\'') || error.message.includes('after property name')) {
                console.log('[NT-Parse] Attempting targeted repair for missing property names...');

                let targetedRepair = text;

                // Specific fix for pattern: "name": "value", "orphaned description", "nextProp":
                // This is the exact pattern causing most failures
                targetedRepair = targetedRepair.replace(
                    /"name":\s*"([^"]*)",\s*"([^"]+)",\s*"([a-zA-Z_][a-zA-Z0-9_]*)":\s*/g,
                    (match, name, orphanedText, nextProp) => {
                        console.log(`[NT-Parse] 🎯 Targeted repair: assigning "${orphanedText.substring(0, 30)}..." to physical for ${name}`);
                        return `"name": "${name}", "physical": "${orphanedText}", "${nextProp}": `;
                    },
                );

                // Try parsing again with targeted repair
                try {
                    const repairedParsed = JSON.parse(targetedRepair);
                    console.log('[NT-Parse] ✅ Targeted repair successful!');
                    console.log('[NT-Parse] ========== PARSE END (TARGETED REPAIR) ==========');
                    return repairedParsed;
                } catch (repairError) {
                    console.error('[NT-Parse] ❌ Targeted repair also failed:', repairError.message);
                }
            }

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

            if (session) {
                session.logEnd(false, error, text);
            }

            // Provide specific feedback about the JSON error
            let errorHelp = 'Failed to parse LLM response as JSON.';
            if (error.message.includes('Expected \':\'') || error.message.includes('after property name')) {
                errorHelp = 'JSON parsing failed: Missing colon after property name or orphaned string without property. The LLM likely generated a description without specifying which field it belongs to.';
            } else if (error.message.includes('Unexpected token')) {
                errorHelp = 'JSON parsing failed: Unexpected character found. Check for missing quotes, commas, or control characters.';
            } else if (error.message.includes('Unexpected end')) {
                errorHelp = 'JSON parsing failed: Response appears truncated. Try analyzing fewer messages at once.';
            }

            throw new NameTrackerError(errorHelp);
        }
    });
}

/**
 * Call LLM for character analysis with automatic batch splitting if prompt is too long
 * and adaptive splitting when parse/output failures occur.
 * @param {Array} messageObjs - Array of message objects (with .mes property) or strings
 * @param {string} knownCharacters - Roster of previously identified characters
 * @param {number} depth - Recursion depth (for logging)
 * @param {number} retryCount - Number of retries attempted (simple backoff)
 * @param {number} splitAttempts - Number of times this failing batch has been split
 * @returns {Promise<Object>} Analysis result with merged characters
 */
export async function callLLMAnalysis(messageObjs, knownCharacters = '', depth = 0, retryCount = 0, splitAttempts = 0) {
    return withErrorBoundary('callLLMAnalysis', async () => {
        const llmConfig = await getLLMConfig();
        const maxPromptResult = await getMaxPromptLength(); // Dynamic based on API context window
        const maxPromptTokens = maxPromptResult.maxPrompt;
        const MAX_SIMPLE_RETRIES = 1;   // retry count after first failure (total 2 attempts)
        const MAX_SPLIT_ATTEMPTS = 2;   // how many times we can split on failure (up to 4 chunks)

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

        // Get system prompt
        let systemPrompt = await getSystemPrompt();
        console.log('[NT-Prompt] getSystemPrompt() returned type:', typeof systemPrompt);

        // Handle if it's still not a string
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

        // Inject character roster into system prompt using template placeholder
        const systemMessage = systemPrompt.replace('{{CHARACTER_ROSTER}}', rosterStr);

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
        } catch {
            debug.log();
            // Fallback to character-based estimate
            promptTokens = Math.ceil(combinedText.length / 4);
        }

        // If prompt is too long, split into sub-batches
        if (promptTokens > maxPromptTokens && messageObjs.length > 1) {
            debug.log();

            // Split roughly in half
            const midpoint = Math.floor(messageObjs.length / 2);
            const firstHalf = messageObjs.slice(0, midpoint);
            const secondHalf = messageObjs.slice(midpoint);

            debug.log();

            // Analyze both halves in parallel
            const [result1, result2] = await Promise.all([
                callLLMAnalysis(firstHalf, knownCharacters, depth + 1, 0, splitAttempts),
                callLLMAnalysis(secondHalf, knownCharacters, depth + 1, 0, splitAttempts),
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
        console.log(`[NT-Prompt] Composition: SYSTEM(${systemMessage.length} chars) + USER(${userPrompt.length} chars) + PREFILL`);

        let result;

        try {
            if (llmConfig.source === 'ollama') {
                // Ollama still uses flat prompt for now
                const flatPrompt = systemMessage + '\n\n' + userPrompt + '\n' + prefill;
                result = await callOllama(flatPrompt);
            } else {
                // Use non-interactive mode so outer logic can handle retries/splitting
                result = await callSillyTavern(systemMessage, userPrompt, prefill, false);
            }
        } catch (error) {
            const isRetryable = error.message.includes('JSON')
                || error.message.includes('empty')
                || error.message.includes('truncated');

            // First retry: try the same batch once with backoff
            if (isRetryable && retryCount < MAX_SIMPLE_RETRIES) {
                debug.log();

                const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s
                await new Promise(resolve => setTimeout(resolve, delay));

                return await callLLMAnalysis(messageObjs, knownCharacters, depth, retryCount + 1, splitAttempts);
            }

            // Subsequent retries: split the current failing batch into halves (up to 4 chunks total)
            if (isRetryable && messageObjs.length > 1 && splitAttempts < MAX_SPLIT_ATTEMPTS) {
                const midpoint = Math.floor(messageObjs.length / 2);
                const firstHalf = messageObjs.slice(0, midpoint);
                const secondHalf = messageObjs.slice(midpoint);

                const [result1, result2] = await Promise.all([
                    callLLMAnalysis(firstHalf, knownCharacters, depth + 1, 0, splitAttempts + 1),
                    callLLMAnalysis(secondHalf, knownCharacters, depth + 1, 0, splitAttempts + 1),
                ]);

                return {
                    characters: [
                        ...(result1.characters || []),
                        ...(result2.characters || []),
                    ],
                };
            }

            // Max retries/splits exceeded or non-retryable error
            throw error;
        }

        // Check for empty response and retry once with stronger emphasis
        if (result && Array.isArray(result.characters) && result.characters.length === 0 && retryCount === 0) {
            console.warn('[NT-LLM] Empty response detected, retrying with stronger user character emphasis...');

            // Add stronger user character requirement to the user prompt
            const retryUserPrompt = userPrompt + '\n\nCRITICAL ERROR: Previous response was empty. You MUST return at minimum the user character ({{user}}) with any available details from these messages. An empty character list is INVALID.';

            try {
                let retryResult;
                if (llmConfig.source === 'ollama') {
                    const retryFlatPrompt = systemMessage + '\n\n' + retryUserPrompt + '\n' + prefill;
                    retryResult = await callOllama(retryFlatPrompt);
                } else {
                    retryResult = await callSillyTavern(systemMessage, retryUserPrompt, prefill, false);
                }

                if (retryResult && Array.isArray(retryResult.characters) && retryResult.characters.length > 0) {
                    console.log('[NT-LLM] Retry successful, got', retryResult.characters.length, 'characters');
                    result = retryResult;
                } else {
                    console.error('[NT-LLM] Retry also returned empty, proceeding with empty result');
                }
            } catch (retryError) {
                console.error('[NT-LLM] Retry failed:', retryError.message, 'proceeding with original empty result');
            }
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

// End of module
