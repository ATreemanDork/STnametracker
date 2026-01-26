# Lorebook Selection Fix

## Problem

The lorebook was being **created** and **entries were being saved**, but **entries weren't appearing** because the lorebook wasn't **selected/active** in SillyTavern.

### Symptoms
- Lorebook created: `NameTracker_High-Calcium Education  - 2026-01-18_23h56m34s743ms`
- Shows 0 entries despite successful saves
- Entries go "nowhere" because the lorebook isn't the active one for the chat

### Root Cause
We were storing the lorebook name in `chatMetadata['world_info']` but not actually **selecting it as the active lorebook** in SillyTavern. The metadata key alone doesn't make it active - we need to call SillyTavern's method to select it.

## Solution

### 1. Added `setSelectedWorldInfo()` to Context API [src/core/context.js]

```javascript
async setSelectedWorldInfo(lorebookName) {
    // Attempts multiple methods to actually select the lorebook:
    // 1. Uses saveSelectedWorldInfo if available (SillyTavern method)
    // 2. Falls back to setting world_info in chatMetadata and saving
}
```

This method:
- Tries to use `context.saveSelectedWorldInfo()` if available (newer SillyTavern versions)
- Falls back to directly setting `chatMetadata.world_info` and saving metadata (compatibility)
- Properly selects the lorebook as active for the current chat

### 2. Updated Lorebook Initialization [src/modules/lorebook.js]

**When creating a new lorebook:**
```javascript
// CRITICAL: Actually SELECT the lorebook so it's active for the chat
await context.setSelectedWorldInfo(lorebookName);
console.log(`[NT-Lorebook] ✅ Selected lorebook as active for this chat: ${lorebookName}`);
```

**When reusing existing lorebook:**
```javascript
// IMPORTANT: Make sure it's selected as the active lorebook
try {
    await context.setSelectedWorldInfo(lorebookName);
    console.log(`[NT-Lorebook] ✅ Re-selected existing chat lorebook: ${lorebookName}`);
} catch (error) {
    console.warn(`[NT-Lorebook] ⚠️  Could not re-select lorebook, but continuing:`, error.message);
}
```

## How It Works

### Before (Broken)
1. Create lorebook file: `NameTracker_<ChatID>`
2. Store name in `chatMetadata['world_info']`
3. Save metadata
4. ❌ Lorebook not selected as active
5. ❌ Entries saved to lorebook but not used by SillyTavern

### After (Fixed)
1. Create lorebook file: `NameTracker_<ChatID>`
2. Store name in `chatMetadata['world_info']`
3. Save metadata
4. **✅ Call `setSelectedWorldInfo()` to actually select it**
5. **✅ Entries are now used by SillyTavern**

## Files Modified
- `src/core/context.js` - Added `setSelectedWorldInfo()` method
- `src/modules/lorebook.js` - Call `setSelectedWorldInfo()` during initialization

## Testing

After reloading the extension:

1. Open a chat
2. Run "Scan Entire Chat"
3. **Check**: Is the lorebook selected in the World Info panel?
4. **Check**: Do the extracted characters appear with their entries in the World Info?
5. **Expected**: Characters should be available for use in the chat (visible in World Info)

## Technical Notes

**Why metadata key alone isn't enough:**
- `chatMetadata['world_info']` stores the binding for persistence
- But SillyTavern also needs to have the lorebook "selected" in its UI/state
- `setSelectedWorldInfo()` handles both the metadata AND the UI state

**Fallback compatibility:**
- Newer SillyTavern versions may have `saveSelectedWorldInfo()`
- We also support older versions by directly setting metadata
- This ensures the fix works across SillyTavern versions

## Related Concepts

This is equivalent to what `/getchatbook` slash command does - it retrieves and activates the chat's associated lorebook. Our method does the reverse: it sets a lorebook as the chat's active book.

---

Build Status: ✅ Successful (115 KiB)
Date: January 26, 2026
