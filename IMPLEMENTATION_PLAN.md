# Implementation Plan: UI Logging Standardization & Refresh Reliability

**Goal:** Fix async/await errors (blocking issue), standardize debug logging with simple on/off toggle, ensure UI always refreshes with error notifications, and consolidate lorebook modules.

**Status:** In Progress  
**Started:** 2026-01-26

---

## Implementation Steps

### Step 1: [BLOCKING] Validate and fix all async/await errors ✅
**Priority:** CRITICAL - Root cause of silent failures

- [x] Run validate-interfaces.js - **PASSED**
- [x] Run tests/validate-async-await.js - **PASSED**
- [x] Run tests/validate-method-calls.js - **PASSED**
- [x] Document validation results

**Results:** All validation scripts pass! Async/await patterns are correct.

**Real Issue Found:** UI updates (updateCharacterList/updateStatusDisplay) are missing after batch processing and in error paths. Need to add try/catch/finally blocks with guaranteed UI refresh.

**Files affected:** processing.js, characters.js, ui.js

---

### Step 2: [BLOCKING] Add try/catch/finally pattern for guaranteed UI refresh ✅
**Priority:** CRITICAL - Ensures UI consistency

- [x] Review all LLM call sites in processing.js
- [x] Wrap in try/catch/finally blocks with UI refresh in `finally`
- [x] Errors shown via toastr notifications
- [x] Apply pattern to all character operations (merge, create, ignore, purge)

**Changes made:**
- Added `finally` blocks with updateCharacterList() + updateStatusDisplay() after:
  - harvestMessages() - both batch and single-batch paths
  - scanEntireChat() - full chat scan
  - onChatChanged() - when chat switches
  - showMergeDialog() - character merging
  - showCreateCharacterModal() - character creation
  - showPurgeConfirmation() - purge all characters
  - toggleIgnoreCharacter() - ignore/unignore

**Files affected:** src/modules/processing.js, src/modules/ui.js

---

### Step 3: [BLOCKING] Verify all async fixes with validation ✅
**Priority:** CRITICAL - Validation gate

- [x] Re-run tests/validate-async-await.js - **PASSED: Zero errors**
- [x] Re-run tests/validate-method-calls.js - **PASSED: Zero errors**
- [x] Run `npm run build` - **SUCCESS**

**Build output:** 329 KiB bundle (warnings about size are acceptable)

**Success criteria:** ✅ All validation scripts pass, no async warnings

---

## 🛑 INTEGRATION TEST CHECKPOINT #1

**Test Status:** Ready for Integration Testing

**What to test:**
1. Operations complete or show errors (no silent failures)
2. UI (character list + status display) updates after EVERY LLM call
3. UI updates after character operations (merge, create, ignore, purge)
4. Error notifications appear via toastr when operations fail
5. No hanging promises or stuck loading states

**Files changed so far:**
- src/modules/processing.js - Added UI refresh after all LLM operations
- src/modules/ui.js - Added try/catch/finally to character operations

**Next steps after test:** If Integration Test #1 passes, proceed to Step 4 (debug logging standardization)

---

### Step 4: Enhance debug.js with simple toggle and consistent prefix ⏸️

- [ ] Modify prefix to `STnametracker:${moduleName}` in debug.js line 51
- [ ] Connect isDebugEnabled() to dynamically check `get_settings('debugMode')` (line 136)
- [ ] Set debugMode default to `false` in settings.js DEFAULT_SETTINGS
- [ ] Implement log gating: debugMode=false (minimal), debugMode=true (verbose)
- [ ] Add `logStartup()` helper for initialization summary (always shown)

**Files affected:** src/core/debug.js, src/core/settings.js

---

### Step 5: Add debug toggle to settings UI ⏸️

- [ ] Add checkbox in settings.html: "Enable Debug Logging"
- [ ] Wire in bindSettingsHandlers() to save debugMode changes
- [ ] Update updateUI() to reflect current debugMode checkbox state
- [ ] Test toggle: verify log output changes immediately

**Files affected:** settings.html, src/modules/ui.js

---

### Step 6: Consolidate lorebook modules ⏸️

- [ ] Delete src/modules/lorebook-debug.js (abandoned debug fork)
- [ ] Replace all console.log calls in lorebook.js (lines 55-148) with shared logger
- [ ] Use prefix `STnametracker:lorebook`
- [ ] debugMode=false: Creation, binding, errors only
- [ ] debugMode=true: Initialization steps, entry counts, metadata
- [ ] Verify imports still work (processing.js, characters.js, ui.js)

**Files affected:** src/modules/lorebook.js, DELETE: src/modules/lorebook-debug.js

---

### Step 7: Standardize logging in characters.js ⏸️

- [ ] Remove `DEBUG_LOGGING = true` at line 23
- [ ] Replace with shared logger `STnametracker:characters`
- [ ] debugMode=false: Character creation, merge decisions, updates
- [ ] debugMode=true: Similarity scores, match candidates, state dumps
- [ ] Verify character operations trigger UI refresh in calling code
- [ ] **STOP: INTEGRATION TEST #2** - Test character detection and merging

**Files affected:** src/modules/characters.js

---

### Step 8: Audit working-version.js for missing UI refresh triggers ⏸️

- [ ] Scan archive/working-version.js for all updateCharacterList/updateStatusDisplay calls
- [ ] Map to event triggers (LLM, settings, merge, ignore, create, purge, import, export)
- [ ] Compare against modular processing.js and ui.js
- [ ] Create checklist of refresh points
- [ ] Add missing refresh calls where identified

**Files affected:** src/modules/processing.js, src/modules/ui.js

---

### Step 9: Standardize logging in processing.js with guaranteed UI updates ⏸️

- [ ] Remove `DEBUG_LOGGING` flag at line 24
- [ ] Replace all `[NT-Processing]` logs with shared logger `STnametracker:processing`
- [ ] debugMode=false: Batch start/finish, character counts, LLM summary
- [ ] debugMode=true: Message details, token counts, cache hits, analysis results
- [ ] Verify EVERY LLM completion has UI refresh in `finally` block
- [ ] Verify errors shown via toastr

**Files affected:** src/modules/processing.js

---

### Step 10: Standardize logging in ui.js ⏸️

- [ ] Replace all `[NT-UI]`, `[NT-Debug]`, `[Name Tracker]` with shared logger `STnametracker:ui`
- [ ] debugMode=false: Modal opens, imports/exports, setting changes
- [ ] debugMode=true: updateCharacterList/updateStatusDisplay entry/exit, counts, state
- [ ] Add code comments documenting why/when UI refresh called
- [ ] Verify settings changes trigger UI refresh

**Files affected:** src/modules/ui.js

---

### Step 11: Update status display to always show current state ⏸️

- [ ] Modify updateStatusDisplay() to show:
  - Tracked character count (excluding ignored)
  - Messages until next auto-scan threshold
  - Last analysis timestamp (human-readable)
- [ ] Remove any progress bar elements
- [ ] Confirm runs in `finally` blocks after all operations

**Files affected:** src/modules/ui.js

---

### Step 12: Add startup summary logging ⏸️

- [ ] In src/index.js initialize(), add consolidated startup message
- [ ] Always show regardless of debugMode
- [ ] Format: `[STnametracker:Main] ✅ Initialized v2.1.0 | Debug: OFF | LLM: SillyTavern | Modules: 6/6`
- [ ] Include: version, debug mode, LLM config, module count, errors/warnings

**Files affected:** src/index.js

---

### Step 13: Final validation and build ⏸️

- [ ] Run validate-interfaces.js - MUST be zero errors
- [ ] Run tests/validate-async-await.js - MUST be zero errors
- [ ] Run tests/validate-method-calls.js - MUST be zero errors
- [ ] Run `npm run build` - MUST succeed with zero warnings
- [ ] Run `npm run lint` - MUST pass
- [ ] **STOP: INTEGRATION TEST #3** - Full end-to-end testing

**Success criteria:** All validation passes, build succeeds, ready for integration testing

---

## Integration Test Checkpoints

### Test #1 (After Step 3): Verify async fixes
- Operations complete or show errors
- No hanging promises
- Error notifications appear properly

### Test #2 (After Step 7): Core character functionality  
- Character detection works
- Merging works correctly
- Lorebook entries update
- Status display refreshes

### Test #3 (After Step 13): Full end-to-end validation
- Debug toggle works correctly
- Logging output appropriate for both modes
- UI refreshes after all operations
- Large chat batch processing
- All user workflows functional

---

## Notes

- **Default debugMode:** false (users shouldn't need debug by default)
- **Error handling:** All errors shown via toastr, UI refreshes in `finally` blocks
- **Logging prefix:** Consistent `STnametracker:${moduleName}` across all modules
- **Priority:** Fix async/await issues FIRST before touching logging
