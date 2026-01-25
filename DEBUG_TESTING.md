# Debug Testing Guide - Phase 2a

## Overview

The Name Tracker extension now includes comprehensive debug logging throughout the two-phase detection system. This guide shows how to test and validate the behavior before integration testing with actual SillyTavern chat history.

## Debug Logging Configuration

### Enabling Debug Logs

All three core modules have a `DEBUG_LOGGING` constant at the top:

```javascript
// src/modules/processing.js | characters.js | llm.js
const DEBUG_LOGGING = true; // Set to false in production after testing
```

When `DEBUG_LOGGING = true`, detailed logs are sent to the browser console with prefixes:
- `[NT-Processing]` - processing.js logs
- `[NT-Characters]` - characters.js logs  
- `[NT-LLM]` - llm.js logs

### Viewing Logs

1. **Open SillyTavern** in your browser
2. **Press F12** to open Developer Tools
3. **Go to Console tab**
4. **Filter by `[NT-` prefix** to see extension logs only

### Disabling After Testing

Once testing is complete, set `DEBUG_LOGGING = false` in each module and rebuild:

```bash
npm run build
```

## What Gets Logged - By Phase

### Phase 1: Name Scanning (scanForNewNames)

```
[NT-Processing] [PHASE 1] Starting name scan on 45 messages
[NT-Processing] [PHASE 1] Existing characters in memory: 3
[NT-Processing] [PHASE 1] Capitalized names found: John, Sarah, Marcus
[NT-Processing] [PHASE 1] Quoted names found: "The Shadow", "Captain"
[NT-Processing] [PHASE 1] Possessive forms found: Alice's, Bob's
[NT-Processing] [PHASE 1] Total unique names to process: 8
```

**What to verify:**
- Correct message count being scanned
- Existing characters are loaded correctly
- All three regex patterns find appropriate names
- No duplicate names appear
- Total count matches expected names

### Phase 2: Character Processing (processPhaseTwoAnalysis)

```
[NT-Processing] [PHASE 2] Starting focused LLM analysis
[NT-Processing] [PHASE 2] New characters: 8, Existing mentions: 2
[NT-Processing] [PHASE 2] Current context target: 80%
[NT-Processing] [PHASE 2] Processing 8 new characters
[NT-Processing] [P2-NewChar] Processing: John
[NT-Processing] [P2-NewChar] Context window size: 3456 chars
[NT-Processing] [P2-NewChar] Calling LLM for John
[NT-Processing] [P2-NewChar] LLM returned data: {"name":"John","aliases":["Johnny"],...
[NT-Processing] [P2-NewChar] Successfully created: John
```

**What to verify:**
- Phase 2 starts after Phase 1 completes
- Context window sizes are reasonable (typically 2000-5000 chars per character)
- LLM is called once per new character
- Character data is properly returned
- No duplicate processing

### Merge Detection Logging (detectMergeOpportunities)

```
[NT-Characters] [MergeDetect] Checking merge opportunities for: Jon
[NT-Characters] [CalcConfidence] Comparing 'Jon' vs 'John'
[NT-Characters] [CalcConfidence] Substring match detected
[NT-Characters] [MergeDetect] Jon -> John: HIGH (95%) - Substring match: 'Jon' found in 'John'
[NT-Characters] [MergeDetect] Total merge candidates for Jon: 1
```

**What to verify:**
- Merge detection runs automatically before character creation
- Confidence tiers are correct:
  - HIGH (90%+): Substrings, exact aliases
  - MEDIUM (70%+): Phonetic similarity
  - LOW (50%+): Partial matches
- Reason descriptions are clear and accurate
- Candidates are sorted by confidence (highest first)

### Character Lookup Logging (findExistingCharacter)

```
[NT-Characters] [FindChar] Searching for 'Sarah': FOUND as Sarah
[NT-Characters] [FindChar] Searching for 'Marcus': NOT FOUND
```

**What to verify:**
- Lookups properly find existing characters
- Correct canonical names are returned
- Failed lookups are clearly marked

## Testing Scenarios

### Scenario 1: Basic Name Detection

**Test**: Phase 1 regex patterns capture all name formats

**Sample Messages**:
```
User: "Hi Alice, have you met Bob?"
Assistant: "Alice and Bob are talking about Charlie."
User: "What about 'The Shadow'?"
Assistant: "The Shadow's role is mysterious."
```

**Expected Logs**:
- Capitalized: Alice, Bob, Charlie, The, Shadow
- Quoted: "The Shadow"
- Possessive: Shadow's

**Success Criteria**: All names detected, no false positives from common words

### Scenario 2: Merge Detection

**Test**: Existing character "John" + new character "Jon" triggers merge detection

**Setup**: 
1. Pre-populate one character: "John" with alias "Johnny"
2. Process messages mentioning "Jon"

**Expected Logs**:
```
[NT-Processing] [PHASE 1] Total unique names to process: 1
[NT-Processing] [P2-NewChar] Processing: Jon
[NT-Characters] [MergeDetect] Jon -> John: HIGH (95%)
```

**Success Criteria**: Merge confidence is HIGH (0.9+) due to substring match

### Scenario 3: Phonetic Similarity

**Test**: Similar-sounding names trigger MEDIUM confidence

**Setup**: 
1. Existing character: "Catherine"  
2. Process messages mentioning: "Katherine"

**Expected Logs**:
```
[NT-Characters] [CalcConfidence] Comparing 'Katherine' vs 'Catherine'
[NT-Characters] [MergeDetect] Katherine -> Catherine: MEDIUM (70-80%) - Phonetic similarity
```

**Success Criteria**: Confidence is MEDIUM, triggers user review instead of auto-merge

### Scenario 4: Context Window Management

**Test**: Character-specific context windows calculate correctly

**Sample**:
- 100 message chat
- Processing character "Marcus" 
- CONTEXT_TARGET_PERCENT = 80

**Expected Logs**:
```
[NT-Processing] [P2-NewChar] Context window size: ~4200 chars
```

**Success Criteria**: 
- Window size varies by character mentions
- Always targets 80% of available context (minus safety margins)
- Reduces by 5% if LLM call fails (ENABLE_AUTO_RECOVERY)

### Scenario 5: Error Recovery

**Test**: Automatic context reduction on LLM failure

**Setup**:
- Set `GENERATION_TEMPERATURE` very high (>0.8) to cause JSON parsing failures
- Process a character with auto-recovery enabled

**Expected Logs**:
```
[NT-Processing] [P2-NewChar] Calling LLM for Sarah
[NT-Processing] [P2-NewChar] FAILED: LLM returned no data for Sarah
[NT-Processing] [PHASE 2] Auto-reducing context target to 75%
```

**Success Criteria**: Context reduces by 5%, processing continues for next character

## How to Test Integration with Existing Chat

When ready for full integration testing with your chat history:

1. **Enable debug logging** (already enabled in current code)

2. **Set message frequency to trigger processing**:
   - In settings: "Analyze every X messages"
   - Set to a low number (e.g., 5) for frequent processing

3. **Send a few messages** to your current chat

4. **Watch console** (F12 → Console) for:
   ```
   Filter: "[NT-"
   ```

5. **Verify sequence**:
   - Phase 1 scans message text
   - Phase 2 processes found names
   - Merge detection runs
   - Characters created/updated

6. **Check lorebook**:
   - Each character gets an entry
   - Entry contains extracted data
   - Names match console output

## Debugging Tips

### Viewing Full LLM Responses

The logs truncate LLM responses to first 200 chars. To see full response:

```javascript
// In browser console, add a breakpoint
debugger; // Place before return in callLLMAnalysis()
```

Or modify llm.js temporarily:

```javascript
debugLog(`[LLM-Response] ${JSON.stringify(characterData, null, 2)}`);
```

### Checking Processing State

In browser console:

```javascript
// This logs the processing state object
console.log(window.STNameTrackerState);
```

### Verifying Merge Thresholds

All thresholds are at module top in characters.js:

```javascript
const MERGE_CONFIDENCE_HIGH = 0.9;      // 90%+
const MERGE_CONFIDENCE_MEDIUM = 0.7;    // 70%+
const MERGE_CONFIDENCE_LOW = 0.5;       // 50%+
```

Adjust for testing, rebuild with `npm run build`.

## Pre-Minification Checklist

Before running production minification:

- [ ] DEBUG_LOGGING set to `false` in all three modules
- [ ] No console.log() statements remain outside debugLog()
- [ ] Error boundaries catch all exceptions with user-friendly notifications
- [ ] Source maps generated and working
- [ ] Build size still reasonable (~89 KiB)

To do final build:

```bash
npm run build
# Verify index.js is minified (readable as single line)
```

## Next Steps

1. **Phase 2b**: Error Recovery UI - Implement error dialogs with suggested fixes
2. **Phase 2c**: Progress Indicators - Add real-time batch processing updates
3. **Phase 2d**: Integration Testing - Full end-to-end testing with chat history
4. **Phase 2e**: Pre-Minification - Final validation and cleanup

---

**Last Updated**: After Phase 2a implementation
**Debug Logging Added**: ✅ Complete
**Build Verification**: ✅ Successful (89 KiB, no errors)
