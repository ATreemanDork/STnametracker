# Chat Metadata Fix - Name Tracker Extension v2.1.1

## Problem Description

The Name Tracker extension was failing with the error:
```
[STnametracker] chat_metadata not available
```

This error occurred in `src/core/settings.js` when functions like `getCharacters()`, `setCharacters()`, `getChatData()`, and `setChatData()` attempted to access the global `chat_metadata` variable directly using:

```javascript
if (typeof chat_metadata === 'undefined') {
    console.warn('[STnametracker] chat_metadata not available');
    return {};
}
```

## Root Cause

The `chat_metadata` is a **global variable provided by SillyTavern**, but:

1. It may not be defined immediately when the extension module loads
2. It requires proper context initialization from SillyTavern
3. The settings module was not using the context abstraction layer that handles proper SillyTavern API access

The extension had created a `SillyTavernContext` class in `src/core/context.js` with a `getChatMetadata()` method that safely wraps this access with:
- Error handling
- Caching mechanisms
- Fallback to empty objects

But `settings.js` was ignoring this abstraction and trying to access the global directly.

## Solution Implemented

### 1. Import the Context Wrapper
Added import of the context module to `settings.js`:
```javascript
import { stContext } from './context.js';
```

### 2. Updated All chat_metadata Access Functions

**Before:**
```javascript
function getCharacters() {
    if (typeof chat_metadata === 'undefined') {
        console.warn('[STnametracker] chat_metadata not available');
        return {};
    }
    if (!chat_metadata[MODULE_NAME]) {
        chat_metadata[MODULE_NAME] = { ...DEFAULT_CHAT_DATA };
    }
    return chat_metadata[MODULE_NAME].characters || {};
}
```

**After:**
```javascript
function getCharacters() {
    return errorHandler.withErrorBoundary('Settings', () => {
        try {
            const metadata = stContext.getChatMetadata();
            
            if (!metadata[MODULE_NAME]) {
                metadata[MODULE_NAME] = { ...DEFAULT_CHAT_DATA };
            }

            return metadata[MODULE_NAME].characters || {};
        } catch (error) {
            debug.warn('Failed to get characters:', error.message);
            return {};
        }
    }, {});
}
```

### 3. Updated Functions with Context Access

The following functions were updated to use `stContext.getChatMetadata()`:
- `getCharacters()` - Get chat characters
- `setCharacters()` - Update and save characters
- `getChatData()` - Get chat metadata
- `setChatData()` - Update and save metadata
- `get_chat_metadata()` - Get individual metadata key
- `set_chat_metadata()` - Set individual metadata key

### 4. Proper Save Mechanism

Updated save calls to use the context wrapper:
**Before:**
```javascript
if (typeof saveMetadataDebounced !== 'undefined') {
    saveMetadataDebounced();
}
```

**After:**
```javascript
stContext.saveChatMetadata().catch(err => {
    debug.warn('Failed to save chat metadata:', err.message);
});
```

## Benefits of This Fix

1. **Proper Error Handling** - Uses context abstraction with try/catch blocks
2. **Consistent API Usage** - All SillyTavern API access goes through the context layer
3. **Better Debugging** - Uses the module logger with proper error messages
4. **Graceful Degradation** - Falls back safely when chat_metadata is not available
5. **Maintainability** - Centralized context access patterns across the extension

## Build Status

✅ Development build successful: `npm run build:dev`
✅ Linting passed for settings.js
✅ Bundle size: 300 KiB (development mode)

## Testing Recommendations

1. Load the updated extension in SillyTavern
2. Open a chat and ensure no "chat_metadata not available" errors appear
3. Send messages and verify that characters are detected
4. Check that character data persists across chat sessions
5. Verify that lorebook entries are created and saved correctly

## Files Modified

- `src/core/settings.js` - Added context import and updated all metadata access functions

## Version

This fix is included in extension version **2.1.1+**
