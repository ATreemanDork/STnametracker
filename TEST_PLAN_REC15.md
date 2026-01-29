# Integration Test Point 1: Chat Lifecycle Management (REC-15)

**Test Tag:** `v2.2.0-test1-chat-lifecycle`  
**Date:** January 28, 2026  
**Priority:** P0-CRITICAL  
**Expected Outcome:** 100% character persistence, no data bleed between chats

---

## Prerequisites

1. Build extension: `npm run build`
2. Copy `index.js` to SillyTavern: `[ST]/data/default-user/extensions/NameTracker/`
3. Reload SillyTavern extension
4. Enable debug mode in extension settings
5. Have 3+ different chats available (or create them)

---

## Test Scenarios

### Scenario 1: Basic Chat Switching (Critical Path)

**Objective:** Verify characters persist when switching between chats

**Steps:**
1. **Chat A:** Send 10+ messages mentioning "Alice" and "Bob"
2. Wait for automatic processing (or use "Process All Messages" button)
3. Verify characters appear in UI panel (Alice, Bob)
4. **Switch to Chat B** (different character/scenario)
5. Verify Chat A's characters cleared from UI
6. Send 10+ messages mentioning "Charlie" and "Diana"
7. Wait for processing
8. Verify only Chat B characters shown (Charlie, Diana - no Alice/Bob)
9. **Switch back to Chat A**
10. **CRITICAL CHECK:** Verify Alice and Bob reappear in UI
11. Send 5 more messages with new info about Alice
12. Verify Alice's entry updates (not duplicates)

**Success Criteria:**
- [ ] Chat A characters persist after switch-away and switch-back
- [ ] Chat B characters completely isolated (no Chat A data)
- [ ] Character updates work correctly after reload
- [ ] No duplicate character entries created
- [ ] UI updates immediately on chat switch (no refresh needed)

**Debug Logs to Check:**
```
[NT-Processing] 🔄 Chat changed - clearing and reloading characters from lorebook
[NT-Processing] 🗑️ Clearing in-memory characters...
[NT-Processing] 📖 Loading characters from chat lorebook...
[NT-lorebook] 📖 Found X NameTracker entries in lorebook
[NT-lorebook] ✅ Loaded character: Alice (UID: xxx)
[NT-Processing] ✅ Loaded X characters from lorebook
```

---

### Scenario 2: Data Persistence Validation

**Objective:** Verify lorebook entries survive SillyTavern restart

**Steps:**
1. Create characters in Chat A (as above)
2. Open SillyTavern World Info panel
3. Find Chat A's lorebook: `NameTracker_{chatId}`
4. **CRITICAL CHECK:** Verify entries have:
   - `automationId: 'NameTracker'`
   - `comment: 'NT-AUTO-{uid}|||{...JSON...}'`
   - `key: [name, alias1, alias2]`
5. **Restart SillyTavern** (full browser reload)
6. Reload extension
7. Open Chat A
8. **CRITICAL CHECK:** Characters reappear without reprocessing messages

**Success Criteria:**
- [ ] Lorebook entries correctly formatted
- [ ] automationId field set to 'NameTracker'
- [ ] Comment field contains parseable JSON
- [ ] Characters reload after ST restart
- [ ] No reprocessing required

**Manual Lorebook Inspection:**
```json
{
  "uid": "entry-uid-here",
  "key": ["Alice", "Ally"],
  "automationId": "NameTracker",
  "comment": "NT-AUTO-char-uid-here|||{\"preferredName\":\"Alice\",\"uid\":\"char-uid\",...}",
  "content": "**Physical Description:**\n...",
  "enabled": true
}
```

---

### Scenario 3: Empty Chat Handling

**Objective:** Verify extension handles chats with no characters gracefully

**Steps:**
1. Create new empty chat
2. Switch to it
3. **CRITICAL CHECK:** No errors in console
4. Verify UI shows "No characters tracked"
5. Send first message with name mention
6. Process messages
7. Verify character appears
8. Switch away and back
9. Verify character persists

**Success Criteria:**
- [ ] No errors on empty chat load
- [ ] UI gracefully shows empty state
- [ ] First character creation works
- [ ] Persistence works even with single character

---

### Scenario 4: High-Volume Chat (20+ Characters)

**Objective:** Verify performance with many characters

**Steps:**
1. Create chat with 20+ named characters (can use bulk processing)
2. **CRITICAL CHECK:** All characters load without timeout
3. Verify UI renders all 20+ characters
4. Switch to different chat
5. Switch back
6. **CRITICAL CHECK:** All 20+ characters reload correctly
7. Time the reload operation (should be <2 seconds)

**Success Criteria:**
- [ ] Handles 20+ characters without errors
- [ ] Reload completes in <2 seconds
- [ ] All characters displayed correctly in UI
- [ ] No memory leaks (check browser DevTools)

**Performance Metrics:**
- Character count: _____
- Reload time: _____
- Memory usage: _____

---

### Scenario 5: Rapid Chat Switching (Race Condition Test)

**Objective:** Verify no race conditions during rapid switching

**Steps:**
1. Prepare 3 chats with characters (A, B, C)
2. Rapidly switch: A → B → C → A → B (fast clicks)
3. **CRITICAL CHECK:** Final UI state matches final chat
4. Verify no stale data from intermediate switches
5. Check console for errors/warnings
6. Repeat 5 times

**Success Criteria:**
- [ ] No race conditions or errors
- [ ] Final state always correct
- [ ] No duplicate characters
- [ ] No undefined values in UI

---

### Scenario 6: Lorebook Filtering Accuracy

**Objective:** Verify only NameTracker entries loaded (not user-created entries)

**Steps:**
1. Open Chat A's lorebook in ST World Info editor
2. Manually add non-NameTracker entry (any content, automationId empty)
3. Save and close
4. Switch away from Chat A
5. Switch back to Chat A
6. **CRITICAL CHECK:** Extension only loads NameTracker entries
7. Verify manual entry ignored (not in character list)
8. Verify manual entry still exists in lorebook (not deleted)

**Success Criteria:**
- [ ] Only automationId='NameTracker' entries loaded
- [ ] User-created entries preserved but ignored
- [ ] No errors parsing mixed lorebook content

---

### Scenario 7: Character Update After Reload

**Objective:** Verify character updates work after chat switch

**Steps:**
1. Chat A: Create character "Emma"
2. Switch to Chat B
3. Switch back to Chat A
4. Send messages with new info about Emma (relationships, appearance)
5. Process messages
6. **CRITICAL CHECK:** Emma's entry updates (not duplicates)
7. Check lorebook entry updated
8. Verify only one entry for Emma exists

**Success Criteria:**
- [ ] Character updates correctly after reload
- [ ] No duplicate entries created
- [ ] Lorebook entry reflects updates
- [ ] UID remains consistent

---

## Edge Cases & Error Handling

### Edge Case 1: Malformed Lorebook Entry
**Setup:** Manually corrupt a comment field in lorebook  
**Expected:** Entry skipped, other characters load, no crash

### Edge Case 2: Missing UID in Character
**Setup:** Manually edit lorebook entry to remove UID from JSON  
**Expected:** Entry skipped with warning, extension continues

### Edge Case 3: Chat Switch During Processing
**Setup:** Start message processing, immediately switch chat  
**Expected:** Processing aborted cleanly, new chat loads correctly

---

## Success Criteria Summary

**Critical (Must Pass):**
- ✅ Characters persist across chat switches
- ✅ No data bleed between chats
- ✅ automationId='NameTracker' filtering works
- ✅ Character updates work after reload
- ✅ No race conditions on rapid switching

**Important (Should Pass):**
- ✅ Empty chat handling graceful
- ✅ High-volume (20+ chars) performant
- ✅ Lorebook survives ST restart
- ✅ Manual entries preserved/ignored

**Nice-to-Have:**
- ✅ <2 second reload time for 20+ characters
- ✅ Zero console errors in happy path
- ✅ UI updates <100ms on switch

---

## Failure Investigation Checklist

If tests fail, check:

1. **Console Errors:**
   - Look for `[NT-Processing]` or `[NT-lorebook]` errors
   - Check for JSON parse failures
   - Verify context availability

2. **Lorebook Inspection:**
   - Open ST World Info editor
   - Find `NameTracker_{chatId}` lorebook
   - Verify `automationId: 'NameTracker'` present
   - Validate comment field JSON structure

3. **Debug Logging:**
   - Enable debug mode in settings
   - Filter console for `[NT-` prefix
   - Trace character load sequence

4. **State Inspection:**
   - Check `chat_metadata[MODULE_NAME].characters` in browser console
   - Verify characters object structure
   - Confirm UIDs unique and consistent

---

## Test Result Template

```
Test Date: _____
Tester: _____
ST Version: _____
Extension Version: v2.2.0-test1-chat-lifecycle

Scenario 1 (Basic Switching): [ PASS / FAIL ] - Notes: _____
Scenario 2 (Persistence): [ PASS / FAIL ] - Notes: _____
Scenario 3 (Empty Chat): [ PASS / FAIL ] - Notes: _____
Scenario 4 (High Volume): [ PASS / FAIL ] - Notes: _____
Scenario 5 (Rapid Switch): [ PASS / FAIL ] - Notes: _____
Scenario 6 (Filtering): [ PASS / FAIL ] - Notes: _____
Scenario 7 (Update After Reload): [ PASS / FAIL ] - Notes: _____

Edge Cases:
- Malformed Entry: [ PASS / FAIL ]
- Missing UID: [ PASS / FAIL ]
- Switch During Processing: [ PASS / FAIL ]

OVERALL: [ PASS / FAIL ]

Blocking Issues: _____
Non-Blocking Issues: _____
Performance Notes: _____
```

---

## Next Steps After Testing

**If All Tests Pass:**
- ✅ Merge REC-15 branch
- ✅ Proceed to REC-2 (Thinking Suppression)
- ✅ Document any performance observations

**If Tests Fail:**
- ❌ Document failure details
- ❌ Create bug tickets with reproduction steps
- ❌ Fix issues before proceeding
- ❌ Re-run full test suite

**Metrics to Document:**
- Average reload time for 10 characters: _____
- Average reload time for 20 characters: _____
- Memory usage after 5 chat switches: _____
- Console error count (should be 0): _____
