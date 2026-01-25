# Batch Window Calculation Variables Reference

## Quick Reference - What Each Log Variable Means

### Message Selection Phase
```
startIdx        = First message index to include
endIdx          = Last message index (exclusive)
messageCount    = How many messages user requested
gotMessages     = Actual messages in selection
```

**Example:**
```
startIdx=0, endIdx=476, requesting 476, got 476
→ Analyzing all 476 messages in chat (messages 0-475)
```

### Token Budget Calculation
```
maxPromptTokens = LLM's total context window (reported by LLM)
reserved        = 1000 tokens (for system prompt + response)
availableTokens = maxPromptTokens - reserved (actual usable budget)
```

**Example:**
```
maxPromptTokens=8192, reserved=1000, availableTokens=7192
→ Can use up to 7192 tokens for message content
→ 1000 tokens reserved for system instructions and character data output
```

### Message Tokenization
```
messageTokens   = Total token count of all selected messages
contextTarget   = Current processing context target percentage
```

**Example:**
```
Total tokens for 476 messages: 9247 tokens
Context target: 80%
→ 9247 tokens is too much for 7192 available
→ Will split into multiple batches
```

### Batch Constraints
```
MIN_MESSAGES_PER_BATCH  = 5   (minimum batch size, unless final batch)
TARGET_MESSAGES_PER_BATCH = 30 (goal for batch size)
MAX_MESSAGES_PER_BATCH   = 50 (absolute maximum per batch)
availableTokens         = 7192 (token limit per batch)
```

**Example:**
```
Batch constraints: MIN=5, TARGET=30, MAX=50, TokenLimit=7192
→ Try for 30 messages per batch
→ Never smaller than 5 (except last batch)
→ Never larger than 50 messages
→ Never exceed 7192 tokens
→ First limit hit wins (whichever is reached first)
```

### Batch Breakdown
```
Batch 1: 47msg/6891tok (split by token limit)
→ 47 messages, 6891 tokens
→ Split because adding the 48th message would exceed 7192 token limit

Batch 2: 49msg/7105tok (split by message limit)  
→ 49 messages, 7105 tokens
→ Split because batch reached MAX_MESSAGES_PER_BATCH (50), so stop at 49
```

## Interpreting Error Messages

### Error: Token Limit Exceeded
```
[BatchProcessing] ERROR in batch 2: JSON parsing failed
[BatchProcessing] Context: messages 47-95, batch size 49, token count calc error
```

**Diagnosis:**
- Messages 47-95 (49 total messages)
- Check if 49 messages < 50 max (yes ✓)
- Check token count: was it > 7192? (probably, since batching split it)
- Error was JSON parsing during LLM response

**Solution:**
- Reduce `MAX_MESSAGES_PER_BATCH` to 35-40
- Or increase `reserved` tokens from 1000 to 1500

### Error: Message Selection Problem
```
[Batching] Message selection: startIdx=0, endIdx=100, requesting 476, got 100
```

**Diagnosis:**
- User requested 476 messages
- Only got 100 (early in the chat)
- Problem: endIdx is only 100, startIdx=0
- Means: Chat has fewer messages, or calculation was wrong

**Solution:**
- Check chat actually has 476 messages
- Verify "Scan All" was clicked, not "Analyze Last 100"

### Error: Context Target Reduction
```
[PHASE 2] Auto-reducing context target to 75%
[PHASE 2] Auto-reducing context target to 70%
[PHASE 2] Processing halted: Maximum retries exceeded
```

**Diagnosis:**
- LLM processing failed multiple times
- System auto-reduced context target
- Eventually gave up after MAX_RETRY_ATTEMPTS (3) failures

**Solution:**
- Reduce `CONTEXT_TARGET_PERCENT` from 80 to 70
- Or increase `reserved` tokens for more breathing room
- Or split into smaller batches: reduce `MAX_MESSAGES_PER_BATCH`

## Configuration Constants (Location: src/modules/processing.js)

### Context Management
```javascript
const CONTEXT_TARGET_PERCENT = 80;      // How much of available tokens to use
const MIN_CONTEXT_TARGET = 50;          // Minimum allowed (won't reduce below this)
const CONTEXT_REDUCTION_STEP = 5;       // Reduce by 5% per failure
```

### Batch Sizing
```javascript
const MIN_MESSAGES_PER_BATCH = 5;       // Minimum batch size
const MAX_MESSAGES_PER_BATCH = 50;      // Maximum batch size
const TARGET_MESSAGES_PER_BATCH = 30;   // Goal for batch size
```

### Processing Control
```javascript
const BATCH_TIMEOUT_MS = 30000;         // Max time per batch (30 seconds)
const MAX_RETRY_ATTEMPTS = 3;           // Max retries before halting
const OVERLAP_SIZE = 3;                 // Messages to overlap between batches
```

### Error Recovery
```javascript
const ENABLE_AUTO_RECOVERY = true;      // Auto-reduce context on failure
const PRESERVE_PROCESSING_STATE = true; // Save state even on errors
```

## Adjusting for Your Use Case

### If batches are too large:
```javascript
// Current
const MAX_MESSAGES_PER_BATCH = 50;
const TARGET_MESSAGES_PER_BATCH = 30;

// More conservative
const MAX_MESSAGES_PER_BATCH = 30;
const TARGET_MESSAGES_PER_BATCH = 20;
```

### If getting token limit errors:
```javascript
// Current
const CONTEXT_TARGET_PERCENT = 80;
// Reduce available tokens for batch calculation
const CONTEXT_TARGET_PERCENT = 70;

// Or increase reserved tokens
// Current
const RESERVED_TOKENS = 1000; // (hardcoded in line ~495)
// Change to:
const RESERVED_TOKENS = 1500;
```

### If getting batch processing timeouts:
```javascript
// Current
const BATCH_TIMEOUT_MS = 30000;  // 30 seconds

// Increase to 60 seconds if LLM is slow
const BATCH_TIMEOUT_MS = 60000;
```

## Debug Mode

To enable detailed batch logging:

1. Open `src/modules/processing.js`
2. Find: `const DEBUG_LOGGING = true;`
3. Ensure it's set to `true`
4. Run: `npm run build`
5. Refresh SillyTavern browser

All batch calculations will now be logged to console with `[Batching]` prefix.

To disable after testing:
1. Set `const DEBUG_LOGGING = false;`
2. Run: `npm run build`

---

**Last Updated:** After Phase 2a batch logging implementation
**Current Build Size:** ~90 KiB (with debug logging)
**After Minification:** ~85 KiB (without debug logging)
