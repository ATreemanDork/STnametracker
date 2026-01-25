# Error Fixes Summary - v2.1.1 Release

## Issues Fixed

### 1. Chat Metadata Access Error
**Error:** `[STnametracker] chat_metadata not available`  
**Root Cause:** `settings.js` was attempting to access global `chat_metadata` variable directly without using the context abstraction layer  
**Status:** ✅ **FIXED**

**Solution:**
- Added import of context module: `import { stContext } from './context.js';`
- Updated 6 functions to use `stContext.getChatMetadata()` instead of direct global access:
  - `getCharacters()`
  - `setCharacters()`
  - `getChatData()`
  - `setChatData()`
  - `get_chat_metadata()`
  - `set_chat_metadata()`
- Updated save operations to use `stContext.saveChatMetadata()`

**File Modified:** `src/core/settings.js`

---

### 2. Notification Parameter Order Error
**Error:** `TypeError: e.replace is not a function` in toastr notifications  
**Root Cause:** Notification methods were being called with incorrect parameter order. The `success()` and `warning()` methods expect `(message, title, options)` but were being called as `(message, options)`  
**Status:** ✅ **FIXED**

**Solution:**
- Fixed all calls to `notifications.success()` and `notifications.warning()` to include the title parameter
- Updated 2 locations in `processing.js`:
  - Line ~653: Batch analysis notification
  - Line ~997: Scan complete notification

**File Modified:** `src/modules/processing.js`

**Before:**
```javascript
notifications.success(safeSummary, { timeOut: 10000 });  // ❌ Options passed as title
```

**After:**
```javascript
notifications.success(safeSummary, 'Scan Complete', { timeOut: 10000 });  // ✅ Correct order
```

---

## Build Verification

✅ **Development Build:** PASSING  
✅ **Bundle Size:** 300 KiB  
✅ **Webpack:** Successfully compiled  

```
webpack 5.104.1 compiled successfully in 184 ms
```

---

## Testing Recommendations

1. **Chat Metadata Persistence:**
   - Open a chat and enable Name Tracker
   - Send messages and verify characters are detected
   - Reload the page and verify character data persists
   - ✅ No "chat_metadata not available" errors should appear

2. **Notifications:**
   - Run "Scan Entire Chat"
   - Verify completion notification appears correctly
   - Check that notification title and message display properly
   - ✅ No `TypeError: e.replace is not a function` errors

3. **Batch Processing:**
   - Test "Analyze Last X Messages"
   - Test "Scan Entire Chat"
   - Verify progress notifications appear
   - Verify completion notifications appear

---

## Files Modified Summary

| File | Changes | Purpose |
|------|---------|---------|
| `src/core/settings.js` | Added context import + 6 function updates | Fix chat_metadata access pattern |
| `src/modules/processing.js` | Fixed 2 notification calls | Fix toastr parameter order |

---

## Architecture Notes

### Context Abstraction Pattern
All SillyTavern API access now follows the established pattern:

```javascript
// Import context
import { stContext } from './context.js';

// Use context methods with built-in error handling
const metadata = stContext.getChatMetadata();
await stContext.saveChatMetadata();
```

### Notification Usage Pattern
Notifications must follow the correct signature:

```javascript
// Signature: (message, title, options)
notifications.success(message, title, options);
notifications.warning(message, title, options);
notifications.info(message, title, options);
notifications.error(message, title, options);
```

---

## Related Error Details

### Error Stack Traces (Original Issue)
```
settings.js:106 [STnametracker] chat_metadata not available
toastr.js:474 TypeError: e.replace is not a function
```

The second error was a cascading issue - when the notification was called with wrong parameters, toastr tried to call `.replace()` on an object instead of a string.

---

## Version

**Release:** v2.1.1  
**Status:** ✅ Ready for testing  
**Build Date:** January 25, 2026
