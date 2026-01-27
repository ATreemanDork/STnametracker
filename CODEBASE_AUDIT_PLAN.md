# SillyTavern Name Tracker Extension - Codebase Audit & Remediation Plan

**Date:** January 27, 2026  
**Status:** Code Quality Issues Requiring Systematic Review  
**Priority:** HIGH - Multiple critical failures affecting core functionality

---

## Executive Summary

The Name Tracker extension has accumulated multiple coding issues, with the latest being incomplete context management implementation. This document provides a comprehensive audit plan to identify, document, and fix all issues systematically rather than applying ad-hoc patches.

**Key Concerns:**
- Recent code changes not appearing in bundled output
- JSON parsing regressions breaking LLM response processing
- Missing context usage tracking despite source code changes
- Incomplete error handling causing batch processing crashes

---

## Current State Assessment

### What's Working ✅
- **Lorebook Integration**: Creates, updates, and verifies entries successfully
- **Character Processing**: When JSON parsing succeeds, character data is processed and saved correctly
- **Context Detection**: Successfully detects maxContext (65024 tokens) via SillyTavern API
- **UI Integration**: Settings panel, scan controls, and character list display functional

### What's Broken ❌
1. **Context Logging Missing**: New `[NT-CONTEXT]` tracking logs completely absent from output
2. **JSON Parsing Regression**: Markdown code block extraction destroying valid JSON (1960 chars → 7 chars)
3. **Batch Processing Crashes**: Null handling missing, first batch crashes with `Cannot read properties of null`
4. **Response Visibility**: Only 100-300 char previews logged, hiding actual problems in LLM responses
5. **Token Management Uncertainty**: Unclear if new 20% buffer calculation is being used

### Evidence from console.txt

**Missing Context Logs:**
```
Expected: [NT-CONTEXT] ========== Context Usage Tracking ==========
Expected: [NT-CONTEXT] maxContext: 65024
Expected: [NT-CONTEXT] systemTokens: 1250
Expected: [NT-CONTEXT] userTokens: 890
Actual: NONE OF THESE LOGS APPEAR
```

**JSON Parsing Failure:**
```
Line 105: [NT-Parse] Input length: 1960
Line 113: [NT-Parse] 🔍 Found markdown code block, extracting JSON
Line 114: [NT-Parse] 📄 After markdown extraction, length: 7
Line 115: [NT-Parse] 🧹 Removed XML/HTML tags, length change: 7 -> 0
Line 116: [NT-Parse] 🚨 Response appears to be non-JSON content: ""
```

**Batch Processing Crash:**
```
Line 175: Error processing batch 1: TypeError: Cannot read properties of null (reading 'characters')
```

**TempResponseLength Override:**
```
Line 78: [TempResponseLength] Saved original response length: 16256
Line 81: [TempResponseLength] Restored original response length: 16256
Note: Extension calculates responseLength but SillyTavern may override it
```

---

## Audit Plan

### Phase 1: Baseline Verification (1-2 hours)

#### 1.1 Build System Verification
**Objective:** Confirm source code changes are included in bundled output

**Tasks:**
- [ ] Run `npm run build` and verify successful webpack compilation
- [ ] Search `index.js` for `[NT-CONTEXT]` string - should appear if changes were bundled
- [ ] Compare token calculation logic in `src/modules/llm.js` vs `index.js` bundled version
- [ ] Verify `DEBUG_LOGGING` constant and its usage in bundled code
- [ ] Check webpack.config.js for proper entry points and module resolution

**Expected Findings:**
- Determine if context logging code is in bundle or missing
- Identify if build system is excluding new code
- Verify source maps are working for debugging

**Files to Check:**
- `src/modules/llm.js` (lines 720-850)
- `index.js` (search for "NT-CONTEXT", "systemTokens", "userTokens")
- `webpack.config.js`
- `package.json` build scripts

#### 1.2 Working Version Comparison
**Objective:** Identify all changes since last known-good state

**Tasks:**
- [ ] Compare `archive/working-version.js` vs current `src/modules/llm.js`
- [ ] Document every function that was modified
- [ ] List all new features added since working version
- [ ] Identify removed/changed logic that might cause regressions

**Key Areas to Compare:**
- `callSillyTavern()` function (token calculation)
- `parseJSONResponse()` function (JSON extraction)
- `callLLMAnalysis()` function (retry/error handling)
- Global constants (RESPONSE_BUFFER_PERCENT, etc.)

#### 1.3 Validation Script Audit
**Objective:** Run all existing validation to establish code health baseline

**Tasks:**
- [ ] Run `node validate-interfaces.js` - document all failures
- [ ] Run `node tests/validate-async-await.js` - document all failures
- [ ] Run `node tests/validate-method-calls.js` - document all failures
- [ ] Check ESLint output: `npm run lint`

**Document:**
- Count of errors per category
- Critical vs warning level issues
- Any new errors since last working version

---

### Phase 2: JSON Parsing Pipeline Audit (2-3 hours)

#### 2.1 LLM Response Flow Analysis
**Objective:** Map complete data flow from API response to parsed character data

**Flow to Document:**
```
SillyTavern generateRaw() 
  → result object extraction
  → resultText string
  → parseJSONResponse()
    → markdown removal
    → XML tag removal  
    → brace extraction
    → JSON repair
    → JSON.parse()
  → character data validation
```

**Tasks:**
- [ ] Add extensive logging at EACH step (not just start/end)
- [ ] Log actual string content, not just length/preview
- [ ] Create test cases for each transformation step
- [ ] Identify which step is destroying the 1960-char JSON

**Critical Bug to Investigate:**
```javascript
// In parseJSONResponse around line 1130-1150
// Current code: Markdown extraction reduces 1960 chars to 7 chars
// Need to review regex: /(?:```(?:json)?\s*)([\s\S]*?)(?:```)/i
// Expected: Should extract content BETWEEN markers, not destroy it
```

#### 2.2 Test Cases for JSON Parsing

**Create test inputs for each scenario:**
- [ ] Valid JSON with no wrappers
- [ ] JSON wrapped in markdown code blocks
- [ ] JSON with XML thinking tags before/after
- [ ] JSON with text before/after
- [ ] Malformed JSON (missing braces, trailing commas, etc.)
- [ ] Truncated JSON (finish_reason: "length")
- [ ] Empty response
- [ ] Non-JSON response (censorship/refusal)

**For Each Test:**
- Document input string
- Document expected output
- Document actual output
- Note which transformation breaks it

#### 2.3 JSON Repair Logic Review

**Tasks:**
- [ ] Review all repair patterns in `repairJSON()` function
- [ ] Test each repair pattern in isolation
- [ ] Verify repairs don't destroy valid JSON
- [ ] Check if repair is needed vs harmful

**Specific Patterns to Test:**
- Control character removal
- Missing field addition
- Trailing comma removal
- Brace/bracket balancing
- Escaped quote handling

---

### Phase 3: Token Management Deep Dive (2-3 hours)

#### 3.1 Context Calculation Investigation
**Objective:** Understand why new context logging isn't appearing

**Tasks:**
- [ ] Add console.log() at the very start of `callSillyTavern()` to confirm function is called
- [ ] Add console.log() immediately before token counting code
- [ ] Add console.log() immediately after token counting code
- [ ] Verify `maxContext` variable is populated correctly
- [ ] Confirm `getTokenCountAsync()` is available and working

**Hypothesis to Test:**
- Is `callSillyTavern()` being called at all?
- Is there an early return before new code?
- Is token counting failing silently?
- Is context object missing required methods?

#### 3.2 Response Length Flow Analysis
**Objective:** Understand complete flow of responseLength parameter

**Flow to Document:**
```
Extension calculates responseLength (our new 20% buffer logic)
  → passes to context.generateRaw({ responseLength })
  → SillyTavern TempResponseLength.save() captures it
  → SillyTavern applies it (or overrides it?)
  → TempResponseLength.restore() reverts it
  → Actual API call uses ??? value
```

**Tasks:**
- [ ] Trace responseLength through SillyTavern's generateRaw implementation
- [ ] Document where TempResponseLength saves/restores the value
- [ ] Determine if our value is used or overridden
- [ ] Check if SillyTavern has max/min limits on responseLength
- [ ] Verify responseLength vs max_tokens vs amount_gen terminology

**Questions to Answer:**
- Why does console show 16256 when we calculate ~52000?
- Is 16256 a SillyTavern default or user setting?
- Does responseLength parameter actually control max_tokens in API call?
- Is there a separate path for chat completion vs text completion?

#### 3.3 Token Counting Validation

**Tasks:**
- [ ] Test `context.getTokenCountAsync()` with known strings
- [ ] Verify token counts match expected values
- [ ] Check if different APIs have different tokenizers
- [ ] Test error handling when token counting fails

**Test Cases:**
- Empty string (should return 0)
- Known 100-char string (should return ~25 tokens)
- System prompt (should return consistent value)
- Combined prompt (should return sum of parts)

---

### Phase 4: Error Handling & Resilience (1-2 hours)

#### 4.1 Null Handling Audit

**Tasks:**
- [ ] Search all modules for `.characters` property access
- [ ] Add null checks before accessing nested properties
- [ ] Verify all Promise rejections are caught
- [ ] Check all async functions have try-catch blocks

**Critical Fix Needed:**
```javascript
// In src/modules/processing.js around line 1060
// Current: parsed.characters.forEach(...)
// Problem: parsed can be null when JSON parsing fails
// Fix: if (!parsed || !Array.isArray(parsed.characters)) { continue; }
```

#### 4.2 Batch Processing Resilience

**Tasks:**
- [ ] Review batch loop in `scanEntireChat()`
- [ ] Ensure failed batches don't stop entire scan
- [ ] Log batch failures without crashing
- [ ] Continue processing remaining batches after failure

**Pattern to Implement:**
```javascript
for (const batch of batches) {
    try {
        const result = await processBatch(batch);
        if (result && result.characters) {
            // process characters
        } else {
            console.warn(`Batch ${i} returned no characters, skipping`);
            continue; // Don't crash, move to next batch
        }
    } catch (error) {
        console.error(`Batch ${i} failed:`, error);
        // Log error, continue to next batch
        continue;
    }
}
```

#### 4.3 withErrorBoundary Usage Audit

**Tasks:**
- [ ] List all functions wrapped with `withErrorBoundary`
- [ ] Verify error boundary is catching errors
- [ ] Check if errors are logged properly
- [ ] Ensure user notifications are sent on failure

---

### Phase 5: Logging & Debugging Infrastructure (1 hour)

#### 5.1 Debug Logging Enhancement

**Tasks:**
- [ ] Enable `DEBUG_LOGGING` flag in `src/modules/llm.js` (line 20)
- [ ] Add full response logging (not just 300-char previews)
- [ ] Log complete JSON before each transformation step
- [ ] Add timing information for performance analysis

**Logging to Add:**
```javascript
// In callSillyTavern after generateRaw call
console.log('[NT-RESPONSE-FULL] Complete LLM Response:');
console.log(resultText); // Full response, not substring

// In parseJSONResponse at each transformation
console.log('[NT-JSON-STEP-1] Original input:', json.substring(0, 500));
console.log('[NT-JSON-STEP-2] After markdown removal:', json.substring(0, 500));
console.log('[NT-JSON-STEP-3] After XML removal:', json.substring(0, 500));
// etc.
```

#### 5.2 Context Tracking Logging

**Priority: CRITICAL - This is the main feature requested**

**Tasks:**
- [ ] Verify context tracking code exists in source
- [ ] Confirm it's included in bundle
- [ ] Force enable it regardless of DEBUG_LOGGING flag
- [ ] Test that logs appear in console

**Required Output Format:**
```
[NT-CONTEXT] ========== Context Usage Tracking ==========
[NT-CONTEXT] maxContext: 65024
[NT-CONTEXT] systemTokens: 1250
[NT-CONTEXT] userTokens: 890
[NT-CONTEXT] totalPromptTokens: 2140
[NT-CONTEXT] bufferTokens (20%): 13107
[NT-CONTEXT] calculatedResponseLength: 50289
[NT-CONTEXT] contextUtilization: 3.3%
[NT-CONTEXT] actualResponseTokens: 1456
[NT-CONTEXT] responseEfficiency: 2.9%
[NT-CONTEXT] totalTokensUsed: 3596
[NT-CONTEXT] totalContextUsed: 5.5%
[NT-CONTEXT] ===============================================
```

---

### Phase 6: Integration Testing (1-2 hours)

#### 6.1 End-to-End Test Scenarios

**Test 1: Simple Chat Scan**
- Setup: Chat with 5 messages, 2 characters
- Execute: Click "Scan Chat" button
- Verify: Both characters detected, lorebook entries created
- Check: All logs appear correctly

**Test 2: Large Chat Scan**
- Setup: Chat with 50+ messages, 5+ characters
- Execute: Click "Scan Chat" button  
- Verify: Characters detected across multiple batches
- Check: Context logs show token distribution

**Test 3: JSON Parsing Edge Cases**
- Setup: Manually trigger LLM call with problematic response
- Test: Response with markdown wrappers
- Test: Response with XML thinking tags
- Test: Truncated response (finish_reason: "length")
- Verify: All scenarios parse correctly or fail gracefully

**Test 4: Error Recovery**
- Setup: Trigger intentional JSON parsing failure
- Verify: Error logged, batch skipped, processing continues
- Check: User receives informative error notification

#### 6.2 Regression Testing

**Compare Against Working Version:**
- [ ] Same chat produces same character detection results
- [ ] Performance is equal or better
- [ ] No new errors introduced
- [ ] All existing features still work

---

## Priority Issue List

### P0 - Critical (Blocking Core Functionality)
1. **Missing Context Logging** - Primary feature requested, completely absent
2. **JSON Parsing Regression** - Destroying valid LLM responses
3. **Null Handling Crash** - Batch processing fails completely

### P1 - High (Degraded Functionality)  
4. **Response Visibility** - Can't debug LLM issues without full response logs
5. **Token Management Uncertainty** - Unclear if new logic is active
6. **Error Recovery** - Failed batches stop entire scan

### P2 - Medium (Enhancement)
7. **Build Verification** - No way to confirm source matches bundle
8. **Test Coverage** - No automated tests for critical paths
9. **Documentation** - Code changes not documented

---

## Investigation Protocol

### For Each Issue:

1. **Reproduce**
   - Document exact steps
   - Note environment (model, context size, etc.)
   - Capture full console output

2. **Isolate**
   - Identify specific function/line causing issue
   - Test in isolation if possible
   - Determine if regression or new bug

3. **Understand**
   - Why does it fail?
   - What changed to cause it?
   - What was the intended behavior?

4. **Fix**
   - Minimal change to resolve issue
   - Don't refactor while fixing
   - Add logging to verify fix

5. **Test**
   - Verify fix resolves issue
   - Check for regressions
   - Test edge cases

6. **Document**
   - Update code comments
   - Add to changelog
   - Note in this document

---

## Recommended Tools & Techniques

### Debugging Tools
- **Chrome DevTools**: Set breakpoints in bundled `index.js`
- **Source Maps**: Verify webpack generates correct source maps
- **Console Filtering**: Use `[NT-CONTEXT]`, `[NT-Parse]` prefixes to filter logs
- **Network Tab**: Check actual API calls to SillyTavern backend

### Code Analysis
- **ESLint**: Catch syntax errors and anti-patterns
- **Validation Scripts**: Use existing scripts before/after changes
- **Git Diff**: Compare working version line-by-line
- **Regex Tester**: Test JSON extraction patterns at regex101.com

### Testing Strategy
- **Unit Tests**: Test individual functions with known inputs
- **Integration Tests**: Test full LLM call → character save flow
- **Regression Tests**: Verify working version behavior maintained
- **Manual Tests**: Real-world usage with actual chats

---

## Success Criteria

### Minimum Viable Fix
- [ ] Context tracking logs appear in console output
- [ ] JSON parsing handles markdown-wrapped responses correctly
- [ ] Batch processing continues after failures
- [ ] Full LLM responses logged for debugging

### Complete Remediation
- [ ] All P0 issues resolved
- [ ] All P1 issues resolved  
- [ ] Regression tests pass
- [ ] Code passes all validation scripts
- [ ] Documentation updated

### Quality Gates
- [ ] No new ESLint errors introduced
- [ ] All validation scripts pass
- [ ] Manual testing in real SillyTavern environment successful
- [ ] Performance equal or better than working version

---

## Risk Assessment

### High Risk Areas
- **JSON Parsing**: Complex regex, easy to break edge cases
- **Token Management**: Deep integration with SillyTavern internals
- **Async Operations**: Promise chains, error propagation
- **Build System**: Webpack configuration, module resolution

### Mitigation Strategies
- Make minimal changes per fix
- Test each fix in isolation
- Keep working version as rollback option
- Add extensive logging before removing it
- Test with multiple LLM providers/models

---

## Handoff Checklist

Before starting implementation:
- [ ] Review this entire document
- [ ] Set up development environment (Node.js, npm, SillyTavern)
- [ ] Verify can build and test extension
- [ ] Read copilot-instructions.md for project context
- [ ] Review working-version.js to understand baseline
- [ ] Run all validation scripts to establish baseline

During implementation:
- [ ] Follow investigation protocol for each issue
- [ ] Document all findings in this document
- [ ] Keep changelog of all changes made
- [ ] Test after each fix, not at the end
- [ ] Commit frequently with descriptive messages

After implementation:
- [ ] Run full test suite
- [ ] Update documentation
- [ ] Create summary of changes made
- [ ] Note any remaining issues for future work

---

## Additional Context

### Project Structure
```
src/
  core/         - Core infrastructure (context, settings, errors, debug)
  modules/      - Feature modules (llm, characters, lorebook, processing, ui)
  utils/        - Utilities (helpers, notifications)
index.js        - Webpack bundle (DO NOT EDIT DIRECTLY)
archive/
  working-version.js  - Last known-good version for comparison
```

### Key Dependencies
- **SillyTavern**: Extension runs in browser context, uses ST's API
- **Webpack**: Bundles src/ modules into index.js
- **jQuery**: Used by SillyTavern for UI operations

### Development Workflow
1. Edit files in `src/` directory
2. Run `npm run build` to bundle
3. Reload SillyTavern extension
4. Test in actual ST environment
5. Check console for logs
6. Iterate

### Critical Reference Files
- `.github/copilot-instructions.md` - Project overview and patterns
- `tests/README.md` - Validation script usage
- `src/modules/llm.js` - Primary issue location
- `console.txt` - Recent error output showing issues

---

## Questions for Original Developer

1. **Context Logging**: Why might the new code not be executing? Build issue? Wrong function path?

2. **JSON Parsing**: Was the markdown extraction working before? Or is this a new regression?

3. **Token Management**: Should responseLength be capped at 16256, or is that a SillyTavern override we need to work around?

4. **Build System**: Are there any webpack config issues that might prevent new code from bundling?

5. **Testing**: What was the manual testing process that confirmed working version was stable?

---

**END OF DOCUMENT**

*This audit plan is comprehensive but not exhaustive. Use engineering judgment to add additional investigation as issues are discovered. Focus on stability and correctness over new features. When in doubt, revert to working version and reapply changes incrementally with validation at each step.*
