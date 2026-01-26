# Async/Await Audit Report

## Executive Summary

**CRITICAL PATTERN**: `withErrorBoundary()` is an ASYNC function - every function wrapped in it returns a Promise. This applies to ALL functions that use this pattern, regardless of whether their internal callback is async or sync.

**RULE**: If a function uses `return withErrorBoundary(...)`, then ALL calls to that function MUST be awaited.

---

## Functions Requiring Await (Wrapped in withErrorBoundary)

### src/modules/llm.js
- ✅ `loadOllamaModels()` - async callback, must await
- ✅ `getOllamaModelContext()` - async callback, must await
- ✅ `buildCharacterRoster()` - **sync callback, but wrapped in withErrorBoundary**, must await
- ✅ `getMaxPromptLength()` - async callback, must await
- ✅ `calculateMessageTokens()` - async callback, must await
- ✅ `callSillyTavern()` - async callback, must await
- ✅ `callOllama()` - async callback, must await
- ✅ `parseJSONResponse()` - **sync callback, but wrapped in withErrorBoundary**, must await
- ✅ `callLLMAnalysis()` - async callback, must await

### src/modules/characters.js
- ✅ `isIgnoredCharacter()` - **sync callback**, must await
- ✅ `findExistingCharacter()` - **sync callback**, must await
- ✅ `findPotentialMatch()` - async callback, must await
- ✅ `calculateNameSimilarity()` - **sync callback**, must await
- ✅ `cleanAliases()` - **sync callback**, must await
- ✅ `detectMergeOpportunities()` - **sync callback**, must await
- ✅ `createCharacter()` - async callback, must await
- ✅ `updateCharacterProcessingState()` - **CHANGED TO async callback**, must await
- ✅ `updateCharacter()` - async callback, must await
- ✅ `mergeCharacters()` - async callback, must await
- ✅ `undoLastMerge()` - async callback, must await
- ✅ `toggleIgnoreCharacter()` - async callback, must await
- ✅ `createNewCharacter()` - async callback, must await
- ✅ `purgeAllCharacters()` - async callback, must await
- ✅ `hasUnresolvedRelationships()` - **sync callback**, must await
- ✅ `exportCharacters()` - **sync callback**, must await
- ✅ `importCharacters()` - async callback, must await

### src/modules/lorebook.js
- ✅ `updateLorebookEntry()` - async callback, must await

### src/modules/processing.js
- ✅ `processAnalysisResults()` - NOT wrapped, but async function
- ✅ `processCharacterData()` - NOT wrapped, but async function
- ✅ `scanEntireChat()` - async callback, must await

### src/modules/ui.js
- ✅ `updateCharacterList()` - **sync callback**, but wrapped in withErrorBoundary, must await (but usually fire-and-forget is OK for UI)
- ✅ `showMergeDialog()` - async callback, must await
- ✅ `showCreateCharacterModal()` - async callback, must await
- ✅ `showPurgeConfirmation()` - async callback, must await
- ✅ `showSystemPromptEditor()` - async callback, must await
- ✅ `showEditLorebookModal()` - async callback, must await
- ✅ `openChatLorebook()` - async callback, must await
- ✅ `showDebugStatus()` - async callback, must await
- ✅ `loadSettingsHTML()` - async callback, must await

### src/core/settings.js
- ✅ `set_settings()` - **sync callback**, but wrapped in withErrorBoundary, must await

---

## Audit Findings & Fixes (Jan 26, 2026)

### Found and Fixed
1. **processing.js:390** - `findExistingCharacter()` not awaited ❌→✅ FIXED
2. **processing.js:438** - `detectMergeOpportunities()` not awaited ❌→✅ FIXED
3. **characters.js:402** - `cleanAliases()` not awaited ❌→✅ FIXED
4. **characters.js:447** - `findExistingCharacter()` in `updateCharacterProcessingState()` not awaited, and function wasn't async ❌→✅ FIXED (made async)
5. **ui.js:749** - `showCreateCharacterModal()` not awaited in click handler ❌→✅ FIXED
6. **ui.js:767** - `showPurgeConfirmation()` not awaited in click handler ❌→✅ FIXED
7. **ui.js:771** - `showSystemPromptEditor()` not awaited in click handler ❌→✅ FIXED
8. **ui.js:775** - `showDebugStatus()` not awaited in click handler ❌→✅ FIXED

### Previously Fixed
- **llm.js:629** - `parseJSONResponse()` not awaited ✅ FIXED (in prior session)
- **processing.js:185** - `isIgnoredCharacter()` not awaited ✅ FIXED (in prior session)
- **processing.js:198** - `findExistingCharacter()` not awaited ✅ FIXED (in prior session)
- **processing.js:212** - `findPotentialMatch()` not awaited ✅ FIXED (in prior session)

---

## Why This Happens

`withErrorBoundary()` is defined as:
```javascript
async withErrorBoundary(moduleName, operation, options = {}) {
    // ... implementation that awaits operation()
}
```

This means:
- **Every function it wraps becomes async**
- **Callers must use await**
- **This is true even if the callback is synchronous**
- The async wrapper provides error handling, retries, and logging

---

## Validation Strategy

To prevent future regressions, follow these patterns:

### Rule 1: Always Await withErrorBoundary Calls
```javascript
// ❌ WRONG
const result = someFunction();  // Returns Promise
if (result) { ... }             // Promise is always truthy!

// ✅ CORRECT
const result = await someFunction();  // Wait for Promise resolution
if (result) { ... }                   // Now you have actual value
```

### Rule 2: Make Functions Async if They Await
```javascript
// ❌ WRONG
export function myFunction() {
    return withErrorBoundary('myFunction', async () => {
        const char = await findExistingCharacter(name);  // Await inside
    });
}

// ✅ CORRECT (what we have)
export async function myFunction() {
    return withErrorBoundary('myFunction', async () => {
        const char = await findExistingCharacter(name);
    });
}
```

### Rule 3: Check Click Handlers
```javascript
// ❌ WRONG
$('#button').on('click', () => {
    showModal();  // Modal returns Promise
});

// ✅ CORRECT
$('#button').on('click', async () => {
    await showModal();
});
```

### Rule 4: Fire-and-Forget vs Sequential
```javascript
// ✅ OK for UI updates (fire-and-forget)
updateCharacterList();  // Doesn't block UI, OK to skip await for UI-only functions

// ✅ REQUIRED when data flow matters
const char = await findExistingCharacter(name);  // Need actual value
```

---

## Code Inventory Summary

**Total Functions Wrapped in withErrorBoundary**: 35+

**Critical Functions** (used in data pipelines):
- `callLLMAnalysis()` - must await
- `parseJSONResponse()` - must await
- `createCharacter()` - must await
- `updateCharacter()` - must await
- `findExistingCharacter()` - must await (3 locations)
- `updateLorebookEntry()` - must await (2 locations)

**Detection Pattern**: 
Search for: `return withErrorBoundary\('.*?', .*?\) => {`

All matches need review of their call sites.

---

## Testing Recommendations

1. **Character Extraction**: Run "Scan Entire Chat" and verify all characters are created
2. **Character Updates**: Verify updates don't trigger "Cannot read properties of undefined" errors
3. **Lorebook Sync**: Check that lorebook entries are created for all characters
4. **Modal Interactions**: Test all modal buttons to ensure they work correctly
5. **Merge Operations**: Verify character merges complete without promise errors

---

## Build Status
✅ All fixes applied and webpack compiled successfully (115 KiB)

Date: January 26, 2026
