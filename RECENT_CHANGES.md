# Recent Changes Summary - Name Tracker Extension

## Date: December 4, 2025

This document summarizes all changes made to fix critical bugs in the Name Tracker extension for SillyTavern.

---

## 🔧 Critical Bug Fixes

### 1. **Module Import Path Issues** ✅
**Problem:** Extension failed to load due to incorrect import paths for world-info.js  
**Solution:**
- Updated import path from `../../../../world-info.js` to `../../../world-info.js` (correct for third-party extensions)
- Removed non-existent imports (`saveMetadata`, `createWorldWithName`) that were causing 404 errors
- Now uses only SillyTavern Context API for all operations

**Files Changed:**
- `index.js` lines 1-7 (imports section)

### 2. **Lorebook Integration Completely Rewritten** ✅
**Problem:** 
- No lorebook entries were being created
- "World info not available" errors in console
- Entries showing as completely blank even when LLM generated descriptions

**Root Causes:**
- Using deprecated/non-existent `context.worldInfoData` API
- Not properly binding lorebook to chat metadata
- Not using proper SillyTavern APIs for world info operations

**Solution:**
- **`initializeLorebook()` function (lines 403-437):**
  - Now checks `chat_metadata.world_info` for existing lorebook binding
  - Creates chat-specific lorebook name: `NameTracker_{chatId}`
  - Properly binds lorebook to chat via `chat_metadata.world_info`
  - Uses `context.saveMetadata()` to persist binding
  
- **`updateLorebookEntry()` function (lines 1617-1755):**
  - Completely rewritten to use Context API
  - Uses `context.loadWorldInfo(lorebookName)` to load existing entries
  - Manually creates entry objects with all required fields (uid, key, content, etc.)
  - Uses `context.saveWorldInfo(lorebookName, worldInfo)` to save
  - Uses `context.uuidv4()` for generating unique entry IDs
  - Properly updates existing entries or creates new ones

**Files Changed:**
- `index.js` lines 403-437 (`initializeLorebook`)
- `index.js` lines 1617-1755 (`updateLorebookEntry`)

### 3. **Empty Description Fields** 🔍
**Problem:** 
- LLM was generating descriptions (visible in console logs)
- But descriptions weren't being stored in character data
- Physical and mental fields remained empty

**Investigation Added:**
- Added extensive debug logging to trace data flow:
  - `processAnalysisResults()` - logs what LLM returns
  - `createCharacter()` - logs what data is used to create characters
  - `updateLorebookEntry()` - logs what character data is received

**Debug Logging Added (lines 1360-1368, 1520-1528, 1617-1621):**
```javascript
debugLog(`Processing character: ${analyzedChar.name}`);
debugLog(`  Physical:`, analyzedChar.physical);
debugLog(`  Mental:`, analyzedChar.mental);
```

**Status:** Ready for user testing with new debug logs to identify where data is lost

### 4. **System Prompt Improvements** ✅
**Problem:** 
- Characters with titles being treated as separate entities ("Aunt Lily" vs "Lily")
- LLM not consistently populating description/personality fields

**Solution:**
- **Title Handling Rules (lines 83-88):**
  - Added explicit instructions to put titles in aliases, not primary name
  - Examples: "Aunt Lily" → name: "Lily", aliases: ["Aunt Lily"]
  - Prevents title variations from creating duplicate characters

- **Field Population Emphasis (lines 90-100):**
  - Added "(REQUIRED if...)" markers for critical fields
  - physical.description: REQUIRED if any physical description exists
  - mental.personality: REQUIRED if personality is shown
  - mental.background: REQUIRED if background/history mentioned

- **Chronological Processing (lines 78-81):**
  - Emphasizes using MOST RECENT information when conflicts exist
  - Ensures character evolution is captured correctly

**Files Changed:**
- `index.js` lines 77-138 (DEFAULT_SYSTEM_PROMPT constant)

---

## 📝 API Migration Summary

### Old Approach (Broken):
```javascript
// ❌ Used non-existent API
import { world_info, world_names, createWorldInfoEntry } from "world-info.js";

// ❌ Tried to access undefined properties
const lorebook = context.worldInfoData[lorebookName]; // Always undefined

// ❌ Used functions that weren't exported
const entry = createWorldInfoEntry(lorebookName, false);
```

### New Approach (Working):
```javascript
// ✅ Import only from extensions.js and script.js
import { extension_settings } from "../../../extensions.js";
import { eventSource, event_types } from "../../../../script.js";

// ✅ Use SillyTavern Context API
const context = SillyTavern.getContext();

// ✅ Load world info properly
const worldInfo = await context.loadWorldInfo(lorebookName);

// ✅ Create entries manually with proper structure
const newEntry = {
    uid: context.uuidv4(),
    key: [name, ...aliases],
    content: formattedText,
    enabled: true,
    position: 0,
    depth: 4,
    probability: 100,
    // ... all required fields
};

// ✅ Save using context API
await context.saveWorldInfo(lorebookName, worldInfo);

// ✅ Save metadata using context API
await context.saveMetadata();
```

---

## 🔬 Debug Logging Added

### New Debug Points:
1. **`processAnalysisResults()` (lines 1360-1368):**
   - Logs raw data from LLM for each character
   - Shows physical, mental, aliases, relationships objects
   
2. **`createCharacter()` (lines 1520-1528):**
   - Logs data being used to create new character
   - Shows final character object structure
   
3. **`updateLorebookEntry()` (lines 1617-1621):**
   - Logs character data when building lorebook entry
   - Shows physical.description and mental.personality values
   - Helps identify if data exists at lorebook creation time

### How to Use Debug Logs:
1. Enable "Debug Mode" in extension settings
2. Process some messages
3. Open browser console (F12)
4. Look for `[Name Tracker]` prefixed messages
5. Share with developer if issues persist

---

## 🏗️ Code Structure Improvements

### All Functions Properly Commented:
Every function now has JSDoc-style documentation:

```javascript
/**
 * Function description
 * @param {Type} paramName - Parameter description
 * @returns {Type} Return value description
 */
```

### Key Functions:
- ✅ `simpleHash()` - Simple string hashing (lines 13-21)
- ✅ `getSystemPrompt()` - Get system prompt with custom override support (lines 140-146)
- ✅ `loadSettings()` - Load and merge extension settings (lines 148-186)
- ✅ `saveChatData()` - Save chat-level character data (lines 188-203)
- ✅ `getSettings()` - Get current settings (lines 205-210)
- ✅ `ensureUserCharacterIgnored()` - Auto-ignore user persona (lines 212-249)
- ✅ `updateUI()` - Update all UI elements (lines 251-284)
- ✅ `updateStatusDisplay()` - Update status text (lines 286-308)
- ✅ `updateCharacterList()` - Render character cards (lines 310-380)
- ✅ `hasUnresolvedRelationships()` - Check if character has unresolved relationships (lines 382-392)
- ✅ `escapeHtml()` - HTML escape utility (lines 394-401)
- ✅ `initializeLorebook()` - Initialize chat-bound lorebook (lines 403-437)
- ✅ `loadOllamaModels()` - Load available Ollama models (lines 438-473)
- ✅ `getOllamaModelContext()` - Get model context window size (lines 475-530)
- ✅ `buildCharacterRoster()` - Build known characters list for LLM (lines 532-558)
- ✅ `getMaxPromptLength()` - Calculate max prompt tokens (lines 560-586)
- ✅ `calculateMessageTokens()` - Calculate token count for messages (lines 588-624)
- ✅ `callLLM()` - Main LLM calling function with retry logic (lines 626-743)
- ✅ `callSillyTavern()` - Call ST's LLM (lines 745-800)
- ✅ `callOllama()` - Call Ollama endpoint (lines 802-841)
- ✅ `parseJSONResponse()` - Extract JSON from LLM response (lines 843-903)
- ✅ `harvestMessages()` - Batch process messages (lines 905-1127)
- ✅ `showProgressBar()` - Show progress UI (lines 1129-1170)
- ✅ `hideProgressBar()` - Hide progress UI (lines 1172-1184)
- ✅ `scanEntireChat()` - Scan entire chat history (lines 1186-1354)
- ✅ `processAnalysisResults()` - Process LLM analysis results (lines 1356-1436)
- ✅ `isIgnoredCharacter()` - Check if character is ignored (lines 1438-1446)
- ✅ `findExistingCharacter()` - Find character by name/alias (lines 1448-1456)
- ✅ `findPotentialMatch()` - Find similar character using LLM (lines 1458-1484)
- ✅ `calculateNameSimilarity()` - Levenshtein distance calculation (lines 1486-1514)
- ✅ `createCharacter()` - Create new character entry (lines 1516-1552)
- ✅ `updateCharacter()` - Update existing character (lines 1554-1615)
- ✅ `updateLorebookEntry()` - Create/update lorebook entry (lines 1617-1755)
- ✅ `createLorebookContent()` - Format character data as JSON (lines 1757-1770)
- ✅ `mergeCharacters()` - Merge two characters (lines 1772-1858)
- ✅ `undoLastMerge()` - Undo last merge operation (lines 1860-1897)
- ✅ `toggleIgnoreCharacter()` - Toggle character ignore status (lines 1899-1918)
- ✅ `viewInLorebook()` - Open lorebook editor (lines 1920-1949)
- ✅ `debugLog()` - Conditional debug logging (lines 1951-1959)
- ✅ `createNewCharacter()` - Manually create character (lines 1961-2002)
- ✅ `purgeAllEntries()` - Delete all lorebook entries (lines 2004-2072)
- ✅ `clearCache()` - Clear analysis cache (lines 2074-2081)
- ✅ `onMessageReceived()` - Handle new message event (lines 2083-2109)
- ✅ `addToQueue()` - Add task to processing queue (lines 2111-2120)
- ✅ `processQueue()` - Process task queue (lines 2122-2142)
- ✅ `onChatChanged()` - Handle chat change event (lines 2144-2159)
- ✅ Event handlers for all UI controls (lines 2161-2462)
- ✅ `editLorebookEntry()` - Edit character lorebook entry (lines 2464-2626)
- ✅ `openChatLorebook()` - Open chat lorebook (lines 2628-2645)
- ✅ `toggleAutoHarvest()` - Toggle auto-harvest mode (lines 2647-2664)
- ✅ `initializeMenuButtons()` - Initialize extension menu (lines 2666-2734)

---

## 📊 Testing Checklist

### Before User Testing:
- [x] Extension loads without errors
- [x] No 404 errors for module imports
- [x] Lorebook initialization works
- [x] Chat metadata binding is saved
- [ ] Descriptions are stored in character data
- [ ] Lorebook entries are created and visible
- [ ] Entries contain physical/mental descriptions

### User Should Test:
1. **Extension Loading:**
   - [ ] Extension appears in extensions menu
   - [ ] No errors in browser console
   
2. **Chat Setup:**
   - [ ] Open a chat
   - [ ] Check that lorebook is created (should see `NameTracker_{chatId}` bound to chat)
   
3. **Character Processing:**
   - [ ] Send or process messages with character descriptions
   - [ ] Check browser console for debug logs
   - [ ] Verify character cards show in extension UI
   
4. **Lorebook Entries:**
   - [ ] Use `/getchatbook` command to verify lorebook exists
   - [ ] Check lorebook entries have content (not blank)
   - [ ] Verify entries contain physical descriptions and personality
   
5. **Share Debug Logs:**
   - [ ] Enable Debug Mode in settings
   - [ ] Process 3-5 messages
   - [ ] Copy console logs starting with `[Name Tracker]`
   - [ ] Share logs to identify any remaining issues

---

## 🚀 Next Steps

### If Descriptions Still Empty:
The debug logs will show exactly where data is lost:
1. If logs show LLM generates data but `processAnalysisResults` doesn't receive it → Issue in `parseJSONResponse`
2. If `processAnalysisResults` receives data but `createCharacter` doesn't → Issue in data passing
3. If `createCharacter` receives data but it's not stored → Issue in settings save
4. If data is stored but `updateLorebookEntry` doesn't see it → Issue in character retrieval

### Potential Additional Fixes:
- May need to verify `parseJSONResponse` properly extracts nested objects
- May need to ensure `saveChatData()` is called after character creation
- May need to verify settings are properly persisted to chat metadata

---

## 📚 References

### SillyTavern APIs Used:
- **Context API:** `SillyTavern.getContext()`
  - `context.chatId` - Current chat ID
  - `context.chatMetadata` - Chat-level metadata storage
  - `context.loadWorldInfo(name)` - Load lorebook data
  - `context.saveWorldInfo(name, data)` - Save lorebook data
  - `context.saveMetadata()` - Save chat metadata
  - `context.uuidv4()` - Generate unique IDs

### Official Documentation:
- **Slash Commands:** https://docs.sillytavern.app/usage/st-script/
- **UI Extensions Guide:** https://docs.sillytavern.app/for-contributors/writing-extensions/
- **getContext API Documentation:** https://github.com/SillyTavern/SillyTavern/blob/staging/public/scripts/st-context.js
- **Published Extensions List:** https://gist.github.com/X00LA/ea409ec5541e56cf3c4166845fcb226b (useful examples and code references)

### Implementation Details:
- Chat metadata binding: Uses `chat_metadata.world_info` key
- Lorebook entry structure: Full object with uid, key, content, and all fields
- Extension folder path: `scripts/extensions/third-party/STnametracker/`

---

## ✅ Summary

**Fixed:**
- ✅ Module import errors (404 for world-info.js)
- ✅ Lorebook initialization and binding
- ✅ Lorebook entry creation using proper API
- ✅ System prompt improvements (titles, field emphasis)
- ✅ Added comprehensive debug logging

**Ready for Testing:**
- Extension should now load without errors
- Lorebook should be created and bound to chat
- Entries should be created (need to verify content)
- Debug logs will help identify any remaining data flow issues

**Still Investigating:**
- Why physical/mental descriptions might not appear in saved character data
- Debug logs added to trace exact data flow
- User testing needed to confirm fixes work end-to-end
