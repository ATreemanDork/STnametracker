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

## Batch Size Configuration

The extension intelligently batches large message sets based on both **token limits** and **message count constraints**:

```javascript
// From src/modules/processing.js
const MIN_MESSAGES_PER_BATCH = 5;       // Never create batches smaller than this
const MAX_MESSAGES_PER_BATCH = 50;      // Cap batches at this size even if tokens allow
const TARGET_MESSAGES_PER_BATCH = 30;   // Aim for this size when possible
```

**How it works:**
1. Calculates available tokens based on LLM context window and `CONTEXT_TARGET_PERCENT`
2. Divides messages into batches respecting BOTH:
   - Token limit (won't exceed available context)
   - Message count limit (won't exceed 50 messages per batch)
3. Shows user a dialog: `"Analyzing X messages in Y batches (~Z messages each)"`

**Example:**
```
476 messages → 10 batches (token-based)
Batches capped at: 50 messages max
Average per batch: ~48 messages ✓ (under 50 limit)
User sees: "Analyzing 476 messages in 10 batches (~48 messages each)"
```

### Adjusting Batch Sizes

If you find batches too large/small, adjust these constants in `src/modules/processing.js`:

```javascript
// More conservative (smaller batches, more API calls)
const MAX_MESSAGES_PER_BATCH = 30;
const TARGET_MESSAGES_PER_BATCH = 20;

// More aggressive (larger batches, fewer API calls)  
const MAX_MESSAGES_PER_BATCH = 100;
const TARGET_MESSAGES_PER_BATCH = 50;
```

Then rebuild: `npm run build`

## What Gets Logged - By Phase

### Batch Window Calculation (Pre-Processing)

**Key Variables Logged:**
```
[Batching] Message selection: startIdx=0, endIdx=476, requesting 476 messages, got 476 messages
[Batching] Token budget: maxPromptTokens=8192, reserved=1000, availableTokens=7192
[Batching] Context target: 80%
[Batching] Total tokens for 476 messages: 9247 tokens
[Batching] Messages exceed token limit (9247 > 7192), creating batches
[Batching] Batch constraints: MIN=5, TARGET=30, MAX=50
```

**What this shows:**
- **startIdx/endIdx**: Tells you exactly which messages in the chat are being analyzed
- **maxPromptTokens**: What the LLM reports as its max context window
- **availableTokens**: How much space is left after reserving 1000 for system prompt
- **Context target**: Current processing context percentage (can reduce on errors)
- **Total tokens**: Actual token count of all messages combined
- **Batch constraints**: The limits being applied

### Batch Creation Details

```
[Batching] Batch 1 complete: 47 messages, 6891 tokens (split by token limit)
[Batching] Batch 2 complete: 49 messages, 7105 tokens (split by token limit)
[Batching] Batch 3 complete: 48 messages, 7001 tokens (split by token limit)
...
[Batching] Final batch 10: 35 messages, 5240 tokens
[Batching] Created 10 total batches: Batch 1: 47msg/6891tok (token limit) | Batch 2: 49msg/7105tok (token limit) | ... | Batch 10: 35msg/5240tok (final batch)
[Batching] Constraints applied: MIN=5, TARGET=30, MAX=50, TokenLimit=7192
```

**What this shows:**
- **Each batch line**: How many messages and tokens in each batch, and what triggered the split
  - "token limit" = Token count exceeded availableTokens
  - "message count limit" = Batch reached MAX_MESSAGES_PER_BATCH
  - "final batch" = Last batch with remaining messages
- **Summary line**: Complete breakdown of all batches for easy reference

### Batch Processing Loop

```
[Batching] Starting batch processing loop: 10 batches
[BatchProcessing] Processing batch 1/10: messages 0-46 (47 messages)
[BatchProcessing] Processing batch 2/10: messages 47-95 (49 messages)
...
[BatchProcessing] Batch analysis complete: 10/10 successful, 0 failed, 8 characters found
```

**What this shows:**
- **Loop start**: Confirms batching loop starting
- **Each batch**: Specific message indices and count
- **Final summary**: How many batches succeeded, failed, and characters found

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

### Scenario 1: Batch Size Validation

**Test**: 476 messages analyzed with proper batch sizing

**Setup**: 
1. Enable debug logging (already enabled)
2. Load a chat with 476+ messages
3. Click "Scan All" or trigger batch processing

**Expected Dialog**:
```
"Analyzing 476 messages in 10 batches (~48 messages each). This may take a while. Continue?"
```

**Expected Console Logs**:
```
[NT-Processing] [Batching] Messages exceed token limit (...), creating batches
[NT-Processing] [Batching] Created 10 batches (max 50 messages per batch, target 30)
[NT-Processing] Analyzing messages 1-48...
[NT-Processing] Analyzing messages 49-96...
... (8 more batches)
```

**Success Criteria**: 
- Batches respect MAX_MESSAGES_PER_BATCH limit
- User sees accurate message count and batch count
- Average batch size is reasonable (~48 messages is acceptable)
- User can click "OK" or "Cancel"

### Scenario 1b: User Cancels Batch Processing

**Test**: User sees dialog and cancels analysis

**Expected**:
```
User clicks "Cancel" in dialog
[NT-Processing] [Batching] User cancelled batch processing
Analysis stops, progress bar disappears
```

**Success Criteria**: No API calls made, no partial character data created

### Scenario 2: Basic Name Detection

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

### When Batch Errors Occur

If you get an error in the batch processing dialog, check the console for logs like:

```
[Batching] Token budget: maxPromptTokens=8192, reserved=1000, availableTokens=7192
[Batching] Batch constraints: MIN=5, TARGET=30, MAX=50
[Batching] Batch 2 complete: 49 messages, 7105 tokens (split by token limit)
[BatchProcessing] Processing batch 2/10: messages 47-95 (49 messages)
[BatchProcessing] ERROR in batch 2: JSON parsing failed
[BatchProcessing] Context: messages 47-95, batch size 49, token count calc error
```

**This tells you:**
- Batch 2 had 49 messages (under 50 max)
- It was triggered by token limit (7105 tokens available)
- The error occurred when processing messages 47-95
- **To fix**: Could reduce MAX_MESSAGES_PER_BATCH to make smaller batches

### Understanding Token Calculation

The system logs exact token values so you can diagnose issues:

```
[Batching] Token budget: maxPromptTokens=8192, reserved=1000, availableTokens=7192
```

This means:
- LLM's context window = 8192 tokens
- Reserved for system prompt + response = 1000 tokens
- Available for messages = 7192 tokens
- Any batch exceeding 7192 tokens triggers a split

### Context Target Reduction

If auto-recovery is enabled and processing fails:

```
[Batching] Context target: 80%
[PHASE 2] Auto-reducing context target to 75%
[Batching] Context target: 75%
```

This shows the system is automatically adjusting to handle errors.

### Verifying Message Selection

Check that the right messages are being selected:

```
[Batching] Message selection: startIdx=0, endIdx=476, requesting 476 messages, got 476 messages
```

If you requested 100 messages but got 476:
- Check if you selected "Scan All" instead of "Analyze Last 100"
- Or the chat may have grown between operations

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
