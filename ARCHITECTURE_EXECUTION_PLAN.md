# **ARCHITECTURE EXECUTION PLAN**
**Name Tracker Extension v2.1.0 → v2.2.0**  
**Plan Date:** January 28, 2026  
**Based On:** ARCHITECTURE_REVIEW_REPORT.md (comprehensive review)

---

## **EXECUTIVE SUMMARY**

**Objective:** Address critical LLM integration failures (35-40% failure rate), establish foundational data integrity patterns, and optimize performance through NER-focused targeting.

**Timeline:** 4-week phased implementation
- **Week 1 (P0):** Foundational fixes - Establishes data integrity
- **Week 2 (P1a):** Data quality improvements - Leverages Week 1 foundation  
- **Week 3 (P1b):** Performance optimization - NER integration
- **Week 4+ (P2):** Polish and cleanup

**Expected Outcomes:**
- Failure rate: 35-40% → 5-10%
- Token costs: 40-60% reduction via NER targeting
- Relationship accuracy: 90%+ with inventory-based normalization
- Data integrity: Reliable chat switching, no stale characters

---

## **PHASE 0: PRE-IMPLEMENTATION CLEANUP**

**Duration:** 1-2 days  
**Priority:** Housekeeping and validation before core work

### **TASK 0.1: Documentation Cleanup**

**Action:** Archive obsolete markdown docs

**Files to Archive** → `/reference/deprecated-docs/`:
```
CODEBASE_AUDIT_PLAN.md               (462 lines) - Superseded by ARCHITECTURE_REVIEW_REPORT
IMPLEMENTATION_SUMMARY.md            (274 lines) - Pre-v2.1.1 historical context
IMPLEMENTATION_PLAN.md               (159 lines) - Obsolete roadmap
INCREMENTAL_UPDATE_IMPLEMENTATION.md  (87 lines) - Applied fix documentation
UI_UPDATE_AWAIT_FIX.md               (194 lines) - Applied fix documentation
CONSOLE_PREFIX_FIX.md                (130 lines) - Partially applied (see REC-16)
CONTEXT_AVAILABILITY_FIX.md          (135 lines) - Applied fix documentation
JSON_PARSING_FIX.md                  (108 lines) - Applied fix documentation
prompt_edits.md                       (48 lines) - Historical edit log
next_steps.md                         (54 lines) - Obsolete roadmap
```

**Keep Active:**
- `README.md` - User documentation
- `ARCHITECTURE_REVIEW_REPORT.md` - Current comprehensive review
- `Name Tracker Documentation.md` - Feature specifications
- `.github/copilot-instructions.md` - AI development guidelines
- `ARCHITECTURE_EXECUTION_PLAN.md` (this file) - Implementation roadmap

**Commands:**
```powershell
New-Item -ItemType Directory -Path "c:\Users\msn\Nametrackercopy\STnametracker\reference\deprecated-docs" -Force
$filesToArchive = @(
    "CODEBASE_AUDIT_PLAN.md",
    "IMPLEMENTATION_SUMMARY.md",
    "IMPLEMENTATION_PLAN.md",
    "INCREMENTAL_UPDATE_IMPLEMENTATION.md",
    "UI_UPDATE_AWAIT_FIX.md",
    "CONSOLE_PREFIX_FIX.md",
    "CONTEXT_AVAILABILITY_FIX.md",
    "JSON_PARSING_FIX.md",
    "prompt_edits.md",
    "next_steps.md"
)
foreach ($file in $filesToArchive) {
    Move-Item "c:\Users\msn\Nametrackercopy\STnametracker\$file" "c:\Users\msn\Nametrackercopy\STnametracker\reference\deprecated-docs\" -Force
}
```

**Acceptance Criteria:**
- ✅ Root directory has 4 markdown files only (README, ARCHITECTURE_REVIEW_REPORT, Name Tracker Documentation, ARCHITECTURE_EXECUTION_PLAN)
- ✅ 10 obsolete docs archived to `/reference/deprecated-docs/`

---

### **TASK 0.2: Module Size Assessment - NO ACTION NEEDED**

**Analysis Complete:**
```
llm.js:        1630 lines (89.83 KB) - Split in Phase 3 (P2)
processing.js: 1027 lines (51.64 KB) - ACCEPTABLE, don't split
ui.js:          996 lines (47.04 KB) - ACCEPTABLE, don't split
characters.js:  972 lines (43.19 KB) - ACCEPTABLE
lorebook.js:    671 lines (37.06 KB) - ACCEPTABLE
```

**Decision:** Only llm.js requires splitting (REC-8, P2 priority). All other modules have clean boundaries and cohesive responsibilities. Do NOT split further.

---

### **TASK 0.3: Pre-Implementation Validation**

**Critical Checks Before Starting Implementation:**

**Function Existence Validation:**
```powershell
# Check if required helper functions exist
grep -r "findCharacterByNameOrAlias" src/
grep -r "findCharacterByUid" src/
grep -r "formatCharacterInfo" src/modules/lorebook.js
```

**Expected Results:**
- If functions exist: Note file locations for REC-14/REC-15
- If functions missing: Flag for creation in Phase 1

**Import Path Validation:**
```powershell
# Verify generateRaw availability in SillyTavern
# Check actual ST installation structure
grep -r "generateRaw" ../../../../script.js
```

**Note:** Import path for `generateRaw` may need adjustment based on ST installation. Use dynamic import fallback if path issues occur.

**Dependency Availability:**
```powershell
# Verify sillytavern-transformers@2.14.6 is available
npm view sillytavern-transformers@2.14.6
```

**Validation Checklist:**
- [ ] Helper functions documented (exist or need creation)
- [ ] `formatCharacterInfo()` output format documented for parser
- [ ] `generateRaw` import path validated
- [ ] `sillytavern-transformers@2.14.6` availability confirmed
- [ ] All validation scripts pass (interfaces, async/await, method-calls)

**Acceptance Criteria:**
- ✅ All helper functions accounted for
- ✅ External dependencies verified
- ✅ Import paths validated or fallback strategy defined

---

## **PHASE 1: FOUNDATIONAL FIXES (P0 - Week 1)**

**Duration:** 5-7 days  
**Goal:** Establish data integrity foundation and eliminate thinking contamination

**Critical Path:** REC-15 → REC-14 (dependency)

---

### **REC-15: CHAT_CHANGED Lifecycle + 1:1 Lorebook Sync**

**Priority:** P0 - FOUNDATIONAL (blocks REC-14, REC-4)  
**Impact:** Prevents stale data, enables authoritative character inventory  
**Files:** `src/index.js`, `src/modules/characters.js`, `src/modules/lorebook.js`

**Implementation Steps:**

**Step 0: Verify/Create Helper Functions**

File: `src/modules/characters.js` (verify these exist or add them)

```javascript
/**
 * Find character by name or alias
 * @param {string} name - Name to search for
 * @returns {Object|null} Character object or null
 */
export function findCharacterByNameOrAlias(name) {
    if (!name) return null;
    
    const normalizedSearch = name.toLowerCase().trim();
    
    return characters.find(c => 
        c.preferredName.toLowerCase() === normalizedSearch ||
        c.aliases.some(a => a.toLowerCase() === normalizedSearch)
    );
}

/**
 * Find character by unique ID
 * @param {string} uid - Character UID
 * @returns {Object|null} Character object or null
 */
export function findCharacterByUid(uid) {
    if (!uid) return null;
    return characters.find(c => c.uid === uid);
}
```

**Validation:**
```powershell
# If functions already exist, verify they match this signature
grep -A 10 "findCharacterByNameOrAlias" src/modules/characters.js
```

---

**Step 1: Add Automation ID to Lorebook Entries**

File: `src/modules/lorebook.js` (updateLorebookEntry function)

```javascript
// Add around line 164
const entryData = {
    uid: generateUID(),
    // 🆕 Automation ID + JSON serialization for reliable round-trip
    comment: `NT-AUTO-${character.uid}|||${JSON.stringify(character)}`,
    key: [character.preferredName, ...character.aliases],
    content: formatCharacterInfo(character),
    position: settings.lorebookPosition,
    enabled: settings.lorebookEnabled,
    // ... rest of fields
};
```

**Step 2: Create Character Loader from Lorebook**

File: `src/modules/characters.js` (new function)

```javascript
/**
 * Load characters from lorebook entries (chat reopen)
 * @returns {Promise<Array>} Loaded characters
 */
export async function loadCharactersFromLorebook() {
    const logger = createModuleLogger('characters');
    logger.log('Loading characters from lorebook...');
    
    const lorebook = await getCurrentWorldInfo();
    if (!lorebook) {
        logger.log('No lorebook found');
        return [];
    }
    
    // Filter entries created by Name Tracker
    const autoEntries = lorebook.entries.filter(e => 
        e.comment && e.comment.startsWith('NT-AUTO-')
    );
    
    logger.log(`Found ${autoEntries.length} Name Tracker lorebook entries`);
    
    const loadedCharacters = [];
    for (const entry of autoEntries) {
        try {
            const charData = parseCharacterFromLorebookEntry(entry);
            loadedCharacters.push(charData);
        } catch (error) {
            logger.error(`Failed to parse lorebook entry ${entry.uid}:`, error);
        }
    }
    
    logger.log(`Successfully loaded ${loadedCharacters.length} characters`);
    return loadedCharacters;
}

/**
 * Parse character data from lorebook entry content
 * @param {Object} entry - Lorebook entry
 * @returns {Object} Character object
 */
function parseCharacterFromLorebookEntry(entry) {
    const logger = createModuleLogger('characters');
    
    // Extract UID from comment: "NT-AUTO-{character.uid}"
    const uidMatch = entry.comment.match(/NT-AUTO-([^|]+)/);
    const uid = uidMatch ? uidMatch[1] : entry.uid;
    
    // OPTION A (RECOMMENDED): JSON serialization in comment
    // Format: "NT-AUTO-{uid}|||{JSON}"
    const jsonMatch = entry.comment.match(/NT-AUTO-[^|]+\|\|\|(.+)$/);
    if (jsonMatch) {
        try {
            const characterData = JSON.parse(jsonMatch[1]);
            logger.log(`✅ Parsed character from JSON: ${characterData.preferredName}`);
            return {
                ...characterData,
                lorebookEntryId: entry.uid // Ensure lorebook ID is current
            };
        } catch (error) {
            logger.error('Failed to parse character JSON from comment:', error);
            // Fall through to Option B
        }
    }
    
    // OPTION B (FALLBACK): Parse from formatted text
    // Extract basic data from entry structure
    const character = {
        uid: uid,
        preferredName: entry.key[0], // First key is always preferred name
        aliases: entry.key.slice(1), // Rest are aliases
        physical: {},
        mental: {},
        relationships: [],
        lorebookEntryId: entry.uid,
        ignored: false,
        isMainChar: false
    };
    
    // Parse formatted content (basic extraction)
    // This is fragile - recommend using Option A (JSON in comment)
    const content = entry.content || '';
    
    // Extract physical description (between **Physical:** and next **)
    const physicalMatch = content.match(/\*\*Physical:\*\*\s*([^*]+)/);
    if (physicalMatch) {
        character.physical = { description: physicalMatch[1].trim() };
    }
    
    // Extract personality (between **Personality:** and next **)
    const personalityMatch = content.match(/\*\*Personality:\*\*\s*([^*]+)/);
    if (personalityMatch) {
        character.mental = { personality: personalityMatch[1].trim() };
    }
    
    // Extract relationships (between **Relationships:** and next section)
    const relMatch = content.match(/\*\*Relationships:\*\*\s*([^*]+)/);
    if (relMatch) {
        character.relationships = relMatch[1]
            .split('\n')
            .map(r => r.trim())
            .filter(r => r.length > 0 && r.startsWith('-'))
            .map(r => r.substring(1).trim());
    }
    
    logger.log(`⚠️ Parsed character from formatted text (fallback): ${character.preferredName}`);
    return character;
}
```

**Step 3: Update CHAT_CHANGED Event Handler**

File: `src/index.js` (onChatChanged function)

```javascript
// Update around line 180
async function onChatChanged() {
    const logger = createModuleLogger('main');
    logger.log('🔄 CHAT_CHANGED event triggered');
    
    try {
        // 🆕 CRITICAL: Save current characters to lorebook before clearing
        if (characters.length > 0) {
            logger.log(`Syncing ${characters.length} characters to lorebook before chat change...`);
            await syncCharactersToLorebook();
        }
        
        // 🆕 Clear extension memory (don't delete lorebooks!)
        const previousCount = characters.length;
        characters = [];
        logger.log(`Cleared ${previousCount} characters from memory`);
        
        // Initialize lorebook for new chat
        await initializeLorebook();
        
        // 🆕 Load characters from new chat's lorebook
        characters = await loadCharactersFromLorebook();
        logger.log(`Loaded ${characters.length} characters from new chat's lorebook`);
        
        // Update UI
        await updateCharacterList();
        await updateUI();
        
        // Clear analysis cache
        clearAnalysisCache();
        
        logger.log('✅ Chat change complete');
    } catch (error) {
        logger.error('❌ Error during chat change:', error);
        toastr.error('Failed to switch chat properly', 'Name Tracker');
    }
}
```

**Step 4: Create Sync Helper Function**

File: `src/modules/lorebook.js` (new function)

```javascript
/**
 * Sync all characters to lorebook (before chat change)
 * @returns {Promise<void>}
 */
export async function syncCharactersToLorebook() {
    const logger = createModuleLogger('lorebook');
    logger.log('Syncing all characters to lorebook...');
    
    let syncCount = 0;
    let errorCount = 0;
    
    for (const character of characters) {
        if (character.ignored) {
            logger.log(`Skipping ignored character: ${character.preferredName}`);
            continue;
        }
        
        try {
            await updateLorebookEntry(character);
            syncCount++;
        } catch (error) {
            logger.error(`Failed to sync character ${character.preferredName}:`, error);
            errorCount++;
        }
    }
    
    logger.log(`✅ Synced ${syncCount} characters, ${errorCount} errors`);
}
```

**Testing Checklist:**
- [ ] Switch between chats with tracked characters
- [ ] Verify characters persist after chat switch and return
- [ ] Check lorebook entries have `NT-AUTO-{uid}` in comment field
- [ ] Confirm no duplicate entries created
- [ ] Test with empty chat (no characters)
- [ ] Verify ignored characters are not synced

**Acceptance Criteria:**
- ✅ Lorebook entries have automation ID in comment field
- ✅ Characters cleared from memory on CHAT_CHANGED
- ✅ Characters reload from lorebook on chat reopen
- ✅ No stale character data across chats
- ✅ UI updates correctly after chat change

---

### **🧪 INTEGRATION TEST POINT 1: Chat Lifecycle Validation**

**When:** Immediately after REC-15 completion (Day 3, Week 1)

**Why:** CHAT_CHANGED lifecycle is foundational - must verify before building dependent features

**Git Tag:** `v2.2.0-test1-chat-lifecycle`

**Test Procedure:**
```powershell
# Create test branch
git checkout -b test-point-1-chat-lifecycle
git add .
git commit -m "REC-15: CHAT_CHANGED lifecycle implementation"
git tag v2.2.0-test1-chat-lifecycle
git push origin test-point-1-chat-lifecycle --tags
```

**Test Scenarios:**
1. **Chat Switching Test:**
   - Create Chat A with 5 characters
   - Create Chat B with 5 different characters
   - Create Chat C with 3 characters
   - Switch: A → B → C → A → B
   - Verify: Each chat loads correct characters

2. **Data Persistence Test:**
   - Add character in Chat A
   - Switch to Chat B
   - Switch back to Chat A
   - Verify: Character still exists with all data intact

3. **Lorebook Sync Test:**
   - Check lorebook entries have `NT-AUTO-{uid}|||{JSON}` format
   - Manually inspect lorebook in ST World Info editor
   - Verify: One entry per character, correct keys/content

4. **Edge Cases:**
   - Switch to empty chat (no characters)
   - Switch to chat with 20+ characters
   - Rapid switching (5 switches in 30 seconds)

**Success Criteria:**
- ✅ 100% character persistence across switches
- ✅ No duplicate lorebook entries
- ✅ No stale data (old chat's characters in new chat)
- ✅ UI updates correctly every time
- ✅ No console errors during switches

**Failure Actions:**
- Document failure scenarios
- Fix issues before proceeding to REC-2
- Re-test until all scenarios pass

---

### **REC-2: Extension-Specific Connection with Thinking Suppression**

**Priority:** P0 - CRITICAL  
**Impact:** Reduces failure rate from 35-40% to 5-10%  
**Files:** `src/modules/llm.js`

**Implementation Steps:**

**Step 1: Add Imports**

File: `src/modules/llm.js` (top of file)

```javascript
// Add after existing imports
import { generateRaw } from '../../../../script.js';

// ⚠️ VALIDATION NOTE: Path may vary based on ST installation structure
// If import fails, use dynamic fallback:
// const generateRaw = window.generateRaw || SillyTavern.getContext().generateRaw;
```

**Step 2: Create New Generation Function**

File: `src/modules/llm.js` (new function after callSillyTavern)

```javascript
/**
 * Call SillyTavern with explicit generation parameters
 * Replaces generateQuietPrompt with API-level thinking suppression
 * @param {string} prompt - User prompt
 * @param {string} systemPrompt - System prompt
 * @param {number} responseLength - Max tokens for response
 * @returns {Promise<string>} LLM response
 */
async function callSillyTavernWithParams(prompt, systemPrompt, responseLength) {
    const logger = createModuleLogger('llm-st-params');
    logger.log('Calling SillyTavern with explicit parameters...');
    
    // Target generation parameters (from ARCHITECTURE_REVIEW_REPORT.md)
    const generationParams = {
        temperature: 0.2,              // Very low for deterministic output
        top_p: 0.85,                   // Slightly reduced nucleus sampling
        top_k: 25,                     // Standard focused sampling
        repetition_penalty: 1.1,       // Slight repetition penalty
        max_tokens: responseLength,
        extended_thinking: false,      // 🚨 CRITICAL: API-level thinking suppression
        thinking_budget: 0,
        stop_sequences: []
    };
    
    logger.log('Generation params:', generationParams);
    
    // Construct prompt with system prompt
    const fullPrompt = `${systemPrompt}\n\n${prompt}`;
    
    try {
        const response = await generateRaw(fullPrompt, generationParams);
        logger.log(`✅ Received response (${response.length} chars)`);
        return response;
    } catch (error) {
        logger.error('❌ generateRaw failed:', error);
        throw new Error(`Extension-specific connection failed: ${error.message}`);
    }
}
```

**Step 3: Replace callSillyTavern Calls**

File: `src/modules/llm.js` (around line 870)

```javascript
// OLD (remove):
const response = await context.generateQuietPrompt({
    prompt: promptWithSuffix,
    systemPrompt: systemPrompt
});

// NEW (replace with):
const response = await callSillyTavernWithParams(
    promptWithSuffix,
    systemPrompt,
    responseLength
);
```

**Step 4: Update Debug Logging**

File: `src/modules/llm.js` (ensure logging reflects new method)

```javascript
console.log('[NT-ST-Call] 🔄 Using extension-specific connection with thinking suppression');
```

**Testing Checklist:**
- [ ] Verify Claude 3.5+ no longer generates thinking tags
- [ ] Check failure rate drops below 10%
- [ ] Test with different LLM providers (Claude, OpenAI, local)
- [ ] Verify temperature=0.2 produces deterministic output
- [ ] Monitor token costs vs old method

**Acceptance Criteria:**
- ✅ `generateRaw()` called instead of `generateQuietPrompt()`
- ✅ API parameters explicitly set (temp=0.2, extended_thinking=false)
- ✅ Thinking contamination rate drops to <10%
- ✅ JSON parsing success rate improves to 90%+

---

### **REC-13: Thinking Tag Content Removal**

**Priority:** P0 - CRITICAL  
**Impact:** Prevents thinking prose leaking into JSON parsing  
**Files:** `src/modules/llm.js`

**Implementation:**

File: `src/modules/llm.js` (repairJSON function, around line 1298)

```javascript
// REPLACE lines 1298-1303 with:

// 0. Remove XML thinking tags WITH CONTENT (critical fix)
// Strategy 1: Remove matched tag pairs with content (run first)
repaired = repaired.replace(/<think[^>]*>[\s\S]*?<\/think>/gi, '');
repaired = repaired.replace(/<thinking[^>]*>[\s\S]*?<\/thinking>/gi, '');

// Strategy 2: Remove from start to closing tag (handles missing open tag)
if (repaired.includes('</think>')) {
    repaired = repaired.replace(/^[\s\S]*?<\/think>\s*/gi, '');
    console.log('[NT-Repair] 🧹 Removed thinking content from start to </think>');
}
if (repaired.includes('</thinking>')) {
    repaired = repaired.replace(/^[\s\S]*?<\/thinking>\s*/gi, '');
    console.log('[NT-Repair] 🧹 Removed thinking content from start to </thinking>');
}

// Strategy 3: Cleanup orphaned tags (run last)
repaired = repaired.replace(/<\/?think[^>]*>/gi, '');
repaired = repaired.replace(/<\/?thinking[^>]*>/gi, '');

if (repaired !== text) {
    console.log('[NT-Repair] 🧹 Removed XML thinking tags and content');
}
```

**Testing Checklist:**
- [ ] Test with thinking tags containing JSON: `<think>{ "test": true }</think>`
- [ ] Test with thinking prose before JSON: `<think>Let me analyze...</think>{"characters":[]}`
- [ ] Test with unclosed tags: `<think>{"characters":[]}`
- [ ] Verify JSON parsing success after tag removal

**Acceptance Criteria:**
- ✅ Content between `<think>` tags removed completely
- ✅ Content from start to `</think>` removed (handles missing open tag)
- ✅ Orphaned tags cleaned up
- ✅ JSON parsing success rate improves

---

### **🧪 INTEGRATION TEST POINT 2: Phase 1 (P0) Complete - Thinking Suppression**

**When:** End of Week 1 (after REC-15 + REC-2 + REC-13)

**Why:** Validate all foundational fixes work together in production

**Git Tag:** `v2.2.0-alpha`

**Test Procedure:**
```powershell
# Merge all Phase 1 changes
git checkout main
git merge test-point-1-chat-lifecycle
git add .
git commit -m "Phase 1 Complete: REC-15 + REC-2 + REC-13"
git tag v2.2.0-alpha
git push origin main --tags
```

**Test Scenarios:**
1. **Thinking Suppression Test (Claude 3.5+):**
   - Make 50 LLM calls for character extraction
   - Monitor console for thinking contamination warnings
   - Target: <10% failure rate (down from 35-40%)

2. **JSON Parsing Success Rate:**
   - Count successful parses vs failures
   - Target: >90% success rate

3. **Token Cost Measurement:**
   - Record token usage for 20 analysis runs
   - Compare to baseline (if available)
   - Verify no unexpected cost increases

4. **Integration Test:**
   - Switch between 5 chats
   - Analyze 10 messages per chat
   - Verify all P0 features work together

**Success Criteria:**
- ✅ Thinking contamination rate <10%
- ✅ JSON parsing success rate >90%
- ✅ No thinking tags leak into final JSON
- ✅ Chat switching + analysis work seamlessly
- ✅ Temperature=0.2 produces deterministic output

**Metrics to Record:**
- Failure rate: ___% (baseline: 35-40%)
- JSON parse success: ___% (target: >90%)
- Thinking tags detected: ___/50 calls
- Average tokens per call: ___

**Failure Actions:**
- If failure rate >15%: Review REC-2 implementation
- If parse failures >20%: Review REC-13 regex patterns
- Document all issues before proceeding

---

## **PHASE 2A: DATA QUALITY (P1 - Week 2)**

**Duration:** 5-7 days  
**Goal:** Relationship accuracy and data integrity  
**Dependencies:** Requires Phase 1 (REC-15) complete

---

### **REC-14: Relationship Extraction Refactoring**

**Priority:** P1 - HIGH  
**Impact:** 90%+ relationship accuracy, eliminates duplicates  
**Files:** `src/modules/llm.js`, `src/modules/characters.js`  
**Dependencies:** Requires REC-15 (authoritative character inventory)

**Implementation Steps:**

**Step 0: Verify Helper Functions (from Phase 1)**

File: `src/modules/characters.js`

**Validation:**
```powershell
# Verify these functions were created in REC-15 Step 0
grep -A 5 "findCharacterByNameOrAlias" src/modules/characters.js
grep -A 5 "findCharacterByUid" src/modules/characters.js
```

**Expected:** Both functions should exist from REC-15. If not, add them now before proceeding.

**Dependencies:**
- `findCharacterByNameOrAlias(name)` - Required for name normalization
- `findCharacterByUid(uid)` - Required for deduplication by UID

---

**Step 1: Simplify System Prompt**

File: `src/modules/llm.js` (around lines 330-398)

```javascript
// REPLACE entire relationships section with:

RELATIONSHIPS - DIRECTIONAL DYNAMICS:

FORMAT REQUIREMENT:
"[CurrentCharacter] is to [TargetCharacter]: [Role1], [Role2]"

DIRECTIONALITY RULE:
First name = character in this JSON entry
Second name = relationship target
Example: "Rosa is to John: Subordinate" (Rosa's entry, Rosa is John's subordinate)

VALIDATION CRITERION - THE BEHAVIORAL TEST:
A relationship is valid ONLY if it defines a persistent dynamic that influences behavior.

Test: "If this relationship were removed from the character's profile, would their 
behavior toward the other person change?"
- If YES → Valid relationship
- If NO → Reject (situational, not relational)

ARCHETYPAL CATEGORIES (Guidance, not exhaustive):
- Kinship: Parent, Child, Sibling, Spouse, Extended Family
- Authority: Superior/Subordinate, Mentor/Protégé, Captor/Prisoner, Owner/Property
- Intimacy: Lover, Romantic Partner, Close Friend, Confidant
- Conflict: Rival, Enemy, Competitor, Adversary

Any relationship passing the Behavioral Test is valid, even if not listed above.

MULTI-FACETED DYNAMICS:
Combine roles when multiple dynamics coexist:
✅ "Rosa is to John: Subordinate, Secret Admirer" (Authority + Intimacy)
✅ "Julia is to Sarah: Sister, Professional Rival" (Kinship + Conflict)

CONSOLIDATION RULE:
Merge redundant descriptors:
❌ "Lover, Romantic Partner, Sexual Partner" → ✅ "Lover"
❌ "Boss, Superior, Manager" → ✅ "Boss"

THE WITNESS PROHIBITION:
Reject purely observational or situational states that don't create lasting dynamics.

FORBIDDEN (fails Behavioral Test):
- Witness, Bystander, Observer, Spectator, Audience Member
- "Target of Speech", "Listener", "Person Present During Event"
- "Person who saw/heard X do Y"

If observation created lasting impact, describe the RESULTING dynamic:
✅ "Witness to crime" → "Blackmailer" or "Co-Conspirator" or "Confidant"
✅ "Observer of affair" → "Rival" (if adversarial) or "Ally" (if supportive)

NO HISTORY OR EVENTS:
Do not include one-time actions or past events.
❌ "Person who bought him a drink"
❌ "Saved her life"
Focus on CURRENT standing/role, not historical interactions.

NAME CONSISTENCY:
ALWAYS use character's canonical name from "preferredName" field.
If entry says "John Blackwood", use "John Blackwood" in ALL relationships, not "John".
```

**Step 2: Create Relationship Normalization Function**

File: `src/modules/characters.js` (new function)

```javascript
/**
 * Normalize relationships using character inventory as source of truth
 * Deduplicates, consolidates redundant roles, filters forbidden terms
 * @param {Object} character - Character whose relationships to normalize
 * @param {Array<string>} rawRelationships - Raw relationship strings from LLM
 * @returns {Array<string>} Normalized relationships
 */
export function normalizeRelationships(character, rawRelationships) {
    const logger = createModuleLogger('characters');
    logger.log(`Normalizing ${rawRelationships.length} relationships for ${character.preferredName}`);
    
    const seenPairs = new Map(); // Key: targetChar.uid, Value: [roles]
    
    for (const rel of rawRelationships) {
        // Parse: "Source is to Target: role1, role2"
        const match = rel.match(/^(.+?) is to (.+?): (.+)$/);
        if (!match) {
            logger.log(`⚠️ Invalid format, skipping: ${rel}`);
            continue;
        }
        
        let [_, source, targetName, roles] = match;
        
        // Normalize target to character inventory entry
        const targetChar = findCharacterByNameOrAlias(targetName);
        if (!targetChar) {
            logger.log(`⚠️ Unknown character "${targetName}", using ??? placeholder`);
            targetName = '???';
        } else {
            targetName = targetChar.preferredName;
        }
        
        // Ensure source uses current character's entry name
        source = character.preferredName;
        
        // Split roles and filter forbidden terms
        const roleList = roles.split(',').map(r => r.trim().toLowerCase());
        const filtered = roleList.filter(r => 
            !['observer', 'witness', 'bystander', 'interviewer', 'spectator', 
              'audience member', 'listener', 'target of speech'].includes(r)
        );
        
        if (filtered.length === 0) {
            logger.log(`⚠️ All roles forbidden for ${targetName}, skipping`);
            continue;
        }
        
        // Merge with existing entry for same target
        const key = targetChar?.uid || targetName;
        if (seenPairs.has(key)) {
            const existing = seenPairs.get(key);
            existing.push(...filtered);
            logger.log(`Merging duplicate relationship with ${targetName}`);
        } else {
            seenPairs.set(key, filtered);
        }
    }
    
    // Consolidate redundant roles
    const consolidated = [];
    for (const [targetKey, roles] of seenPairs.entries()) {
        const uniqueRoles = consolidateRelationshipRoles(roles);
        const targetChar = findCharacterByUid(targetKey) || { preferredName: targetKey };
        const relString = `${character.preferredName} is to ${targetChar.preferredName}: ${uniqueRoles.join(', ')}`;
        consolidated.push(relString);
        logger.log(`✅ ${relString}`);
    }
    
    logger.log(`Normalized ${rawRelationships.length} → ${consolidated.length} relationships`);
    return consolidated;
}

/**
 * Consolidate redundant relationship roles
 * @param {Array<string>} roles - Role names (lowercase)
 * @returns {Array<string>} Consolidated unique roles
 */
function consolidateRelationshipRoles(roles) {
    const unique = [...new Set(roles)];
    
    // Redundancy elimination rules
    const redundancyMap = {
        'sexual partner': ['lover'],
        'romantic partner': ['lover', 'spouse', 'husband', 'wife'],
        'friend': ['best friend'],
        'colleague': ['coworker'],
        'superior': ['boss'],
        'subordinate': ['employee'],
        'observer of power shifts': [], // Always remove
        'observer of power dynamics': [], // Always remove
    };
    
    return unique.filter(role => {
        for (const [redundant, preferred] of Object.entries(redundancyMap)) {
            if (role === redundant) {
                // Check if any preferred terms are in the list
                if (preferred.length === 0 || preferred.some(p => unique.includes(p))) {
                    return false; // Filter out redundant role
                }
            }
        }
        return true;
    });
}
```

**Step 3: Call Normalization in Character Processing**

File: `src/modules/processing.js` (processCharacterData function)

```javascript
// Add after extracting character data from LLM response
if (charData.relationships && charData.relationships.length > 0) {
    console.log(`[NT-Processing] Normalizing ${charData.relationships.length} relationships...`);
    charData.relationships = normalizeRelationships(character, charData.relationships);
}
```

**Testing Checklist:**
- [ ] Test with duplicate relationships (same pair, different roles)
- [ ] Test with inconsistent names ("John" vs "John Blackwood")
- [ ] Test with forbidden terms ("observer", "witness")
- [ ] Test with redundant roles ("lover" + "sexual partner")
- [ ] Verify ??? placeholder for unknown characters
- [ ] Check consolidation rules work correctly

**Acceptance Criteria:**
- ✅ System prompt uses Behavioral Test validation
- ✅ No forbidden patterns shown as examples
- ✅ Post-processing normalizes all names to `preferredName`
- ✅ Duplicate relationships merged
- ✅ Redundant roles consolidated
- ✅ Forbidden passive terms filtered

---

### **🧪 INTEGRATION TEST POINT 3: Relationship Normalization**

**When:** Mid Week 2 (after REC-14 completion)

**Why:** Relationship extraction is complex - needs isolated validation

**Git Tag:** `v2.2.0-test2-relationships`

**Test Procedure:**
```powershell
git checkout -b test-point-2-relationships
git add .
git commit -m "REC-14: Relationship normalization implementation"
git tag v2.2.0-test2-relationships
git push origin test-point-2-relationships --tags
```

**Test Scenarios:**

**1. Duplicate Relationship Test:**
Create messages with these relationships:
- "Rosa is to John: lover"
- "Rosa is to John Blackwood: sexual partner"
- "Rosa is to John Blackwood: romantic interest"

**Expected Result:** Normalized to `"Rosa is to John Blackwood: lover"`

**2. Forbidden Terms Test:**
Create messages with:
- "Sarah is to Julia: observer"
- "Mike is to Tom: witness, bystander"
- "Emma is to David: observer of power dynamics"

**Expected Result:** All filtered out (no relationships created)

**3. Name Inconsistency Test:**
Create messages using:
- "John" in message 1
- "John Blackwood" in message 2
- "JB" in message 3

**Expected Result:** All normalized to `character.preferredName`

**4. Multi-Faceted Dynamics Test:**
Create message: "Rosa is to John: subordinate, secret admirer, rival"

**Expected Result:** All three roles preserved (distinct dynamics)

**5. Consolidation Test:**
Create message: "Emma is to David: lover, sexual partner, romantic partner, intimate friend"

**Expected Result:** Consolidated to `"Emma is to David: lover"`

**Success Criteria:**
- ✅ 100% name consistency (all use `preferredName`)
- ✅ 0 forbidden terms in final relationships
- ✅ Duplicates merged correctly
- ✅ Redundant roles consolidated
- ✅ Multi-faceted dynamics preserved
- ✅ Behavioral Test prompt works (LLM validates relationships)

**Metrics to Record:**
- Test relationships created: 20
- Normalized successfully: ___/20
- Forbidden terms filtered: ___
- Duplicates merged: ___
- Consolidations applied: ___

**Failure Actions:**
- If normalization <90%: Review `findCharacterByNameOrAlias()` logic
- If forbidden terms slip through: Update filter list
- Document all edge cases discovered

---

### **REC-4: External Lorebook Deletion Detection**

**Priority:** P1 - HIGH  
**Impact:** Maintains 1:1 sync, prevents orphaned data  
**Files:** `src/modules/lorebook.js`, `src/modules/characters.js`  
**Dependencies:** Requires REC-15 (automation IDs)

**Implementation Steps:**

**Step 1: Create Sync Validation Function**

File: `src/modules/characters.js` (new function)

```javascript
/**
 * Validate 1:1 sync between characters and lorebook entries
 * Detects external deletions and marks characters as ignored
 * @returns {Promise<Object>} Sync validation results
 */
export async function validateLorebookSync() {
    const logger = createModuleLogger('characters');
    logger.log('🔍 Validating 1:1 lorebook synchronization...');
    
    const results = {
        total: characters.length,
        synced: 0,
        orphaned: [],
        missing: []
    };
    
    // Get current lorebook entries
    const lorebook = await getCurrentWorldInfo();
    if (!lorebook) {
        logger.error('❌ No lorebook found');
        return results;
    }
    
    const lorebookEntryIds = new Set(
        lorebook.entries
            .filter(e => e.comment && e.comment.startsWith('NT-AUTO-'))
            .map(e => e.uid)
    );
    
    // Check each character
    for (const character of characters) {
        if (character.ignored) {
            continue; // Skip ignored characters
        }
        
        // Check if lorebook entry exists
        if (!character.lorebookEntryId) {
            logger.log(`⚠️ Character ${character.preferredName} missing lorebook ID`);
            results.missing.push(character.preferredName);
            continue;
        }
        
        if (!lorebookEntryIds.has(character.lorebookEntryId)) {
            logger.log(`🚨 Character ${character.preferredName} lorebook entry deleted externally`);
            results.orphaned.push(character.preferredName);
            
            // Mark as ignored (external deletion = user intent)
            character.ignored = true;
        } else {
            results.synced++;
        }
    }
    
    logger.log(`✅ Sync validation complete: ${results.synced} synced, ${results.orphaned.length} orphaned, ${results.missing.length} missing`);
    return results;
}
```

**Step 2: Add Periodic Validation**

File: `src/index.js` (add validation check after chat change)

```javascript
// Add to onChatChanged function
async function onChatChanged() {
    // ... existing chat change logic ...
    
    // Validate lorebook sync after loading characters
    const syncResults = await validateLorebookSync();
    
    if (syncResults.orphaned.length > 0) {
        toastr.warning(
            `${syncResults.orphaned.length} character(s) had lorebook entries deleted externally and have been marked as ignored: ${syncResults.orphaned.join(', ')}`,
            'Name Tracker - Sync Issue',
            { timeOut: 10000 }
        );
    }
    
    if (syncResults.missing.length > 0) {
        toastr.warning(
            `${syncResults.missing.length} character(s) missing lorebook entries: ${syncResults.missing.join(', ')}`,
            'Name Tracker - Sync Issue',
            { timeOut: 10000 }
        );
    }
}
```

**Step 3: Add Manual Validation Button**

File: `settings.html` (add button in settings panel)

```html
<div class="name-tracker-sync-validation">
    <button id="nametracker_validate_sync" class="menu_button">
        <i class="fa-solid fa-sync"></i>
        Validate Lorebook Sync
    </button>
    <small>Check for external deletions or missing entries</small>
</div>
```

File: `src/modules/ui.js` (bind button handler)

```javascript
$('#nametracker_validate_sync').on('click', async () => {
    const results = await validateLorebookSync();
    
    let message = `Sync Status:\n`;
    message += `✅ ${results.synced} characters synced\n`;
    if (results.orphaned.length > 0) {
        message += `⚠️ ${results.orphaned.length} orphaned (marked as ignored)\n`;
    }
    if (results.missing.length > 0) {
        message += `⚠️ ${results.missing.length} missing lorebook entries\n`;
    }
    
    toastr.info(message, 'Lorebook Sync Validation', { timeOut: 8000 });
    
    // Update UI if changes made
    if (results.orphaned.length > 0 || results.missing.length > 0) {
        await updateCharacterList();
    }
});
```

**Testing Checklist:**
- [ ] Manually delete lorebook entry in ST World Info editor
- [ ] Trigger validation (chat change or button click)
- [ ] Verify character marked as ignored
- [ ] Check toast notification appears
- [ ] Test with multiple deleted entries

**Acceptance Criteria:**
- ✅ External deletions detected via automation ID check
- ✅ Orphaned characters auto-marked as ignored
- ✅ User notified of sync issues via toast
- ✅ Manual validation button available in settings

---

### **REC-3: Remove Context Caching**

**Priority:** P1 - HIGH  
**Impact:** Aligns with community pattern, prevents stale data  
**Files:** `src/core/context.js`

**Implementation:**

File: `src/core/context.js`

```javascript
// REPLACE SillyTavernContext class with:

class SillyTavernContext {
    constructor() {
        // Remove caching - align with reference extensions
    }

    getContext() {
        // Always return fresh context
        return SillyTavern.getContext();
    }
    
    // Remove clearCache() method - no longer needed
}
```

**Testing Checklist:**
- [ ] Verify rapid message sends work correctly
- [ ] Test chat switching
- [ ] Check lorebook updates reflect immediately
- [ ] Monitor performance (should be negligible impact)

**Acceptance Criteria:**
- ✅ No caching logic remains
- ✅ Fresh context returned every call
- ✅ Aligns with MessageSummarize/Codex/Nicknames pattern

---

## **PHASE 2B: PERFORMANCE OPTIMIZATION (P1 - Week 3)**

**Duration:** 5-7 days  
**Goal:** Reduce token costs 40-60% via NER-focused targeting

---

### **REC-17: NER-Focused LLM Targeting**

**Priority:** P1 - HIGH  
**Impact:** 40-60% token cost reduction, faster processing  
**Files:** `src/modules/processing.js`, `package.json`

**Implementation Steps:**

**Step 1: Add Dependency**

File: `package.json`

```json
"dependencies": {
    "sillytavern-transformers": "2.14.6"
}
```

**Step 1.5: Install and Rebuild**

```powershell
# Install new dependency
npm install

# Rebuild extension with new dependency
npm run build

# Verify build succeeded
ls index.js  # Should show updated timestamp
```

**Validation:**
- ✅ `package-lock.json` updated
- ✅ `node_modules/sillytavern-transformers` exists
- ✅ Webpack build completes without errors
- ✅ `index.js` includes NER module code

---

**Step 2: Create NER Integration Module**

File: `src/modules/ner.js` (new file)

```javascript
import { pipeline } from 'sillytavern-transformers';
import { createModuleLogger } from '../core/debug.js';

const logger = createModuleLogger('ner');
let nerPipeline = null;
let nerAvailable = false;

/**
 * Initialize NER pipeline (lazy loading)
 * @returns {Promise<boolean>} Success status
 */
export async function initializeNER() {
    if (nerPipeline) return true;
    
    try {
        logger.log('Loading NER model (Xenova/bert-base-NER)...');
        nerPipeline = await pipeline('ner', 'Xenova/bert-base-NER');
        nerAvailable = true;
        logger.log('✅ NER model loaded successfully');
        return true;
    } catch (error) {
        logger.error('❌ Failed to load NER model:', error);
        nerAvailable = false;
        return false;
    }
}

/**
 * Detect person names in messages using NER
 * @param {Array<Object>} messages - Messages to analyze
 * @returns {Promise<Array<string>>} Detected person names
 */
export async function detectPersonNames(messages) {
    if (!nerAvailable) {
        logger.log('NER not available, falling back to full LLM extraction');
        return null; // Trigger fallback
    }
    
    const startTime = performance.now();
    const allNames = new Set();
    
    for (const msg of messages) {
        try {
            const entities = await nerPipeline(msg.text);
            
            // Filter to person entities
            const personNames = entities
                .filter(e => e.entity === 'PER' || e.entity === 'B-PER' || e.entity === 'I-PER')
                .map(e => e.word);
            
            personNames.forEach(name => allNames.add(name));
        } catch (error) {
            logger.error(`NER failed for message ${msg.id}:`, error);
        }
    }
    
    const duration = performance.now() - startTime;
    logger.log(`✅ NER detected ${allNames.size} potential names in ${duration.toFixed(0)}ms`);
    
    return Array.from(allNames);
}

/**
 * Check if NER is available
 * @returns {boolean}
 */
export function isNERAvailable() {
    return nerAvailable;
}
```

**Step 3: Update Processing Logic**

File: `src/modules/processing.js` (modify analyzeMessages function)

```javascript
import { initializeNER, detectPersonNames, isNERAvailable } from './ner.js';

// Update analyzeMessages function
async function analyzeMessages(messages, mode = 'full') {
    const logger = createModuleLogger('processing');
    
    // Phase 1: NER Quick Scan (if available)
    let potentialNames = null;
    if (isNERAvailable()) {
        logger.log('🔍 Phase 1: NER name detection...');
        potentialNames = await detectPersonNames(messages);
        
        if (potentialNames && potentialNames.length > 0) {
            logger.log(`Found ${potentialNames.length} potential names: ${potentialNames.join(', ')}`);
            
            // Filter to new or recently active characters
            const charactersToAnalyze = potentialNames.filter(name => {
                const char = findCharacterByNameOrAlias(name);
                return !char; // New character
            });
            
            if (charactersToAnalyze.length === 0) {
                logger.log('✅ All detected characters already tracked, skipping LLM call');
                return { characters: [], cached: true };
            }
            
            logger.log(`🎯 Targeting LLM extraction for: ${charactersToAnalyze.join(', ')}`);
        }
    }
    
    // Phase 2: Targeted LLM Extraction
    logger.log('🔍 Phase 2: LLM extraction...');
    
    // Modify prompt to focus on specific characters
    let focusPrompt = '';
    if (potentialNames && potentialNames.length > 0) {
        focusPrompt = `\n\n🎯 FOCUS: Extract details for ONLY these characters:\n${potentialNames.join(', ')}\n\nFor each character, find their full name, nicknames, and relationship details.`;
    }
    
    const response = await callLLMAnalysis(messages, focusPrompt);
    
    // ... rest of processing logic ...
}
```

**Step 4: Add Settings Toggle**

File: `settings.html`

```html
<div class="name-tracker-ner-setting">
    <label>
        <input type="checkbox" id="nametracker_enable_ner" />
        Enable Fast Name Detection (NER)
    </label>
    <small>Uses local AI model for 40-60% faster processing. Requires 100MB one-time download.</small>
</div>
```

File: `src/modules/ui.js` (bind toggle)

```javascript
$('#nametracker_enable_ner').on('change', async function() {
    const enabled = $(this).is(':checked');
    await set_settings('enableNER', enabled);
    
    if (enabled) {
        toastr.info('Initializing NER model (100MB download)...', 'Name Tracker', { timeOut: 5000 });
        const success = await initializeNER();
        
        if (!success) {
            $(this).prop('checked', false);
            await set_settings('enableNER', false);
            toastr.error('Failed to load NER model. Extension will use standard LLM extraction.', 'Name Tracker');
        } else {
            toastr.success('NER model loaded successfully!', 'Name Tracker');
        }
    }
});
```

**Testing Checklist:**
- [ ] Enable NER toggle, verify 100MB model downloads
- [ ] Test name detection accuracy vs full LLM
- [ ] Measure token cost reduction
- [ ] Test fallback when NER unavailable
- [ ] Verify nickname handling (context preservation)

**Acceptance Criteria:**
- ✅ NER model loads successfully (100MB download)
- ✅ Person names detected in ~50ms per message
- ✅ LLM extraction targeted to detected names
- ✅ 40-60% token cost reduction verified
- ✅ Fallback to full LLM extraction if NER fails

---

### **🧪 INTEGRATION TEST POINT 4: Phase 2 (P1) Complete - Full Feature Set**

**When:** End of Week 3 (after all P1 features)

**Why:** Comprehensive validation of all core features together

**Git Tag:** `v2.2.0-beta`

**Test Procedure:**
```powershell
# Merge all Phase 2 changes
git checkout main
git merge test-point-2-relationships
git add .
git commit -m "Phase 2 Complete: All P1 features implemented"
git tag v2.2.0-beta
git push origin main --tags
```

**Test Scenarios:**

**1. End-to-End Workflow Test:**
- Start new chat with 0 characters
- Send 20 messages introducing 10 characters
- Verify NER detects names quickly
- Verify LLM extraction targeted correctly
- Check relationship accuracy
- Switch to different chat
- Return to original chat
- Verify all data persists

**2. Token Cost Measurement:**
- Record baseline: Full LLM analysis (no NER)
- Record with NER: Targeted analysis
- Calculate reduction: Target 40-60%

**3. Relationship Quality Test:**
- Create 50 relationships with various issues
- Verify 90%+ accuracy after normalization

**4. External Deletion Test:**
- Delete 3 lorebook entries manually in ST
- Trigger sync validation
- Verify characters marked as ignored
- Check user notification appears

**5. Context Caching Test:**
- Send 10 messages rapidly (1 per second)
- Verify context updates correctly each time
- Check for stale data issues

**6. Stress Test:**
- Chat with 50+ characters
- 100+ messages
- 200+ relationships
- Verify performance acceptable

**Success Criteria:**
- ✅ All P0 + P1 features functional
- ✅ Token cost reduction 40-60% (with NER)
- ✅ Relationship accuracy >90%
- ✅ External deletion detection works
- ✅ Zero context caching issues
- ✅ Chat switching reliable with large data
- ✅ No console errors during stress test

**Metrics to Record:**
| Metric | Baseline | With NER | Target | Actual |
|--------|----------|----------|--------|--------|
| Failure rate | 35-40% | - | <10% | ___% |
| Token cost/call | ___ | ___ | -40-60% | ___% |
| Relationship accuracy | 60-70% | - | >90% | ___% |
| Chat switch time | ___ | ___ | <3s | ___s |
| Parse success rate | ___ | ___ | >90% | ___% |

**Failure Actions:**
- If any metric misses target: Investigate root cause
- Document performance issues
- Consider deferring P2 work if critical issues found

---

## **PHASE 3: POLISH & CLEANUP (P2 - Week 4+)**

**Duration:** 3-5 days  
**Goal:** Code quality improvements

---

### **REC-16: Console Label Standardization**

**Priority:** P2 - CLEANUP  
**Files:** `src/index.js`

**Implementation:**

Replace `[STnametracker]` with `[NT-Main]` or `[NT-Init]` throughout initialization code.

**Acceptance Criteria:**
- ✅ All console logs use `[NT-<module>]` pattern
- ✅ No `[STnametracker]` labels remain

---

### **REC-5: Documentation Updates**

**Priority:** P1 - DOCUMENTATION  
**Files:** `Name Tracker Documentation.md`, `README.md`

**Updates:**
1. Clarify "prompt user to rescan" behavior (no auto-reanalysis on edits/swipes)
2. Update thinking suppression documentation (now API-level, not just prompt)
3. Add NER-focused targeting documentation
4. Update relationship format examples

---

### **REC-11: DOMPurify Integration**

**Priority:** P2 - SECURITY  
**Files:** `src/modules/ui.js`, `src/utils/helpers.js`

**Implementation:**

Replace custom `escapeHtml()` with DOMPurify (available through SillyTavern).

---

### **REC-8: Split llm.js into Sub-Modules**

**Priority:** P2 - MAINTAINABILITY  
**Files:** `src/modules/llm.js` → multiple files

**Split Plan:**
- `llm-prompts.js` - System prompt and user prompt generation
- `llm-sillytavern.js` - ST API integration
- `llm-ollama.js` - Ollama API integration
- `llm-parsing.js` - JSON parsing and repair logic
- `llm-budget.js` - Token budget calculation

---

### **🧪 INTEGRATION TEST POINT 5: Final Release - v2.2.0**

**When:** After Phase 3 (P2 polish complete)

**Why:** Final validation before public release

**Git Tag:** `v2.2.0`

**Test Procedure:**
```powershell
# Final merge and release
git checkout main
git add .
git commit -m "v2.2.0: Architecture overhaul complete"
git tag v2.2.0
git push origin main --tags
```

**Test Scenarios:**

**1. Full Regression Test:**
- Re-run all tests from TEST POINT 1-4
- Verify no regressions introduced by P2 work

**2. Code Quality Check:**
- Run all validation scripts
- Check console labels consistent (`[NT-*]`)
- Verify DOMPurify integration
- Check documentation updated

**3. Multi-Provider Test:**
- Test with Claude 3.5 Sonnet
- Test with GPT-4
- Test with local Ollama model
- Verify all work correctly

**4. Long-Term Stability Test:**
- Run extension for 2 hours continuous use
- Monitor memory usage
- Check for memory leaks
- Verify performance remains stable

**Success Criteria:**
- ✅ All TEST POINT 1-4 scenarios pass
- ✅ All validation scripts: 0 errors
- ✅ Console labels consistent
- ✅ Documentation current
- ✅ Multi-provider compatibility
- ✅ No memory leaks detected
- ✅ Performance stable over time

**Release Checklist:**
- [ ] All test points passed
- [ ] README.md updated with v2.2.0 changes
- [ ] CHANGELOG.md created (if applicable)
- [ ] GitHub release notes written
- [ ] Success metrics documented
- [ ] Known issues documented (if any)

---

## **TESTING & VALIDATION**

### **Pre-Release Checklist**

**Automated Validation (Every Test Point):**
- [ ] Run `validate-interfaces.js` - 0 errors
- [ ] Run `validate-async-await.js` - 0 violations
- [ ] Run `validate-method-calls.js` - 0 errors
- [ ] Webpack build succeeds - 0 errors
- [ ] No console errors during basic operations

**Integration Test Points (See Sections Above):**
- [ ] 🧪 TEST POINT 1: Chat lifecycle (after REC-15)
- [ ] 🧪 TEST POINT 2: Phase 1 complete (after REC-2, REC-13)
- [ ] 🧪 TEST POINT 3: Relationships (after REC-14)
- [ ] 🧪 TEST POINT 4: Phase 2 complete (all P1 features)
- [ ] 🧪 TEST POINT 5: Final release (after P2 polish)

**Each Test Point Includes:**
- Detailed test scenarios
- Success criteria
- Metrics to record
- Failure action plans

---

## **SUCCESS METRICS**

**Baseline (v2.1.0):**
- Failure rate: 35-40% (thinking contamination)
- Token costs: Full analysis every message frequency
- Relationship accuracy: ~60-70% (duplicates, inconsistent names)
- Data integrity: Stale characters on chat switch

**Target (v2.2.0):**
- Failure rate: <10% (API-level thinking suppression)
- Token costs: 40-60% reduction (NER-focused targeting)
- Relationship accuracy: 90%+ (inventory-based normalization)
- Data integrity: 100% sync (CHAT_CHANGED lifecycle)

---

## **ROLLBACK PLAN**

**If Phase 1 Fails:**
1. Revert to v2.1.0 tag
2. Keep REC-13 (thinking tag fix) - low risk
3. Defer REC-2 and REC-15 to future release

**If Phase 2 Fails:**
1. Keep Phase 1 changes (foundational)
2. Disable REC-17 (NER) via settings toggle
3. Revert REC-14 (relationship normalization)

**Git Strategy:**
```bash
# Create feature branches
git checkout -b phase1-p0-fixes
git checkout -b phase2-p1-data-quality
git checkout -b phase2-p1-performance
git checkout -b phase3-p2-polish

# Tag releases
git tag v2.2.0-alpha (after Phase 1)
git tag v2.2.0-beta (after Phase 2)
git tag v2.2.0 (after Phase 3)
```

---

## **APPENDIX: RECOMMENDATIONS QUICK REFERENCE**

**P0 (Week 1 - FOUNDATIONAL):**
- REC-15: CHAT_CHANGED lifecycle + automation IDs
- REC-2: Extension-specific connection (thinking suppression)
- REC-13: Thinking tag content removal

**P1 (Week 2-3 - HIGH PRIORITY):**
- REC-14: Relationship extraction refactoring
- REC-17: NER-focused LLM targeting
- REC-4: External lorebook deletion detection
- REC-3: Remove context caching
- REC-5: Documentation updates

**P2 (Week 4+ - IMPROVEMENTS):**
- REC-16: Console label standardization
- REC-8: Split llm.js into sub-modules
- REC-18: Vector similarity UI toggle
- REC-1: Enable DEBUG_LOGGING
- REC-6: Unify debug logging control
- REC-9: Extract JSON repair patterns
- REC-11: DOMPurify integration

**COMPLETED:**
- REC-12: Deleted lorebook-debug.js ✅
- REC-7: Moved world-info.js to /reference/ ✅

---

**END OF EXECUTION PLAN**
