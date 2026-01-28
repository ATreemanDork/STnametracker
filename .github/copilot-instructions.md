# Name Tracker Extension - AI Developer Instructions

# ⚠️ CRITICAL: ZERO-ASSUMPTION DEVELOPMENT PROTOCOL ⚠️

## MANDATORY VALIDATION REQUIREMENTS

**YOU MUST FOLLOW THESE RULES BEFORE ANY PLANNING OR IMPLEMENTATION:**

### 🚫 NEVER MAKE ASSUMPTIONS

1. **DO NOT assume** code exists based on naming patterns or logical inference
2. **DO NOT assume** API methods exist without checking actual source code
3. **DO NOT assume** import/export interfaces match without validation
4. **DO NOT assume** documentation is current or accurate
5. **DO NOT assume** similar patterns work across different contexts

### ✅ ALWAYS VALIDATE FIRST

**Before planning ANY change:**

1. **READ the actual source code** - Use `grep_search` or `read_file` to verify code exists
2. **CHECK actual exports** - Grep for `export` statements to confirm what's available  
3. **VERIFY actual imports** - Grep for `import` statements to see what's being used
4. **EXAMINE reference implementations** - Read actual GitHub repository code, not just documentation
5. **RUN validation scripts** - Execute `validate-interfaces.js`, `validate-async-await.js`, `validate-method-calls.js`

### 🔍 VALIDATION CHECKLIST (MANDATORY)

Before proposing ANY solution:
- [ ] Grep for function/method definitions to confirm they exist
- [ ] Read actual file contents to verify signatures and parameters
- [ ] Check all import statements match actual export statements
- [ ] Examine reference extension code from GitHub repositories (not just docs)
- [ ] Run applicable validation scripts and confirm they pass
- [ ] Test that all assumed APIs actually exist in the codebase

### ❌ FORBIDDEN BEHAVIORS

- Writing plans based on "what should be there" instead of "what IS there"
- Assuming method names or APIs without grepping/reading source
- Treating documentation as source of truth without code verification
- Creating interfaces that don't match actual implementations
- Binding to methods that don't exist in the actual class/object

### 🎯 CORRECT WORKFLOW

1. **RESEARCH** → Read actual code, grep for patterns, examine GitHub repos
2. **VALIDATE** → Run validation scripts, check interfaces, verify methods exist
3. **PLAN** → Only after validation passes, create implementation plan
4. **IMPLEMENT** → Write code based on verified facts, not assumptions

**VIOLATION OF THIS PROTOCOL CAUSES CRITICAL BUGS. ALWAYS VALIDATE BEFORE PLANNING.**

---

## 🛑 CRITICAL: NEVER DISMISS ERRORS OR WARNINGS

### ERROR INVESTIGATION PROTOCOL

**MANDATORY: Every error/warning must be investigated to completion. NO EXCEPTIONS.**

### 🚨 ZERO TOLERANCE FOR "FALSE POSITIVE" ASSUMPTIONS

**FORBIDDEN STATEMENTS:**
- ❌ "These look like false positives"
- ❌ "This error isn't critical"  
- ❌ "The validation script must be wrong"
- ❌ "We can ignore this warning for now"
- ❌ "This is probably just a script bug"

**REQUIRED BEHAVIOR:**
1. **INVESTIGATE EVERY ERROR** - No error is "false" until proven through code examination
2. **FIX THE ROOT CAUSE** - Either fix the code OR fix the validation script
3. **VERIFY THE FIX** - Re-run validation to confirm error is resolved
4. **DOCUMENT WHY** - If dismissing, provide evidence (file/line proof)

### 📋 ERROR INVESTIGATION CHECKLIST

When ANY validation script reports errors:
- [ ] Read the exact error message completely
- [ ] Identify which file and line number is flagged
- [ ] Read the actual source code at that location
- [ ] Determine if error is in code or in validation script
- [ ] Fix whichever is wrong (code OR script)
- [ ] Re-run validation to confirm fix
- [ ] Never proceed until error count reaches ZERO

### ⚙️ VALIDATION SCRIPT ERRORS

If you suspect the validation script is wrong:
1. **Read the script's logic** - Understand what it's checking
2. **Test with manual examples** - Verify the pattern it's looking for
3. **Fix the script** - Update regex, logic, or detection patterns
4. **Re-run to confirm** - Ensure both true positives caught AND false positives eliminated
5. **Document the fix** - Note what was wrong with the detection

### 🎯 REAL EXAMPLE: Async/Await Validation

**❌ WRONG APPROACH:**
```
Agent: "This is a false positive - the code has await"
(Moves on without investigation)
```

**✅ CORRECT APPROACH:**
```
Agent: "Script reports error at line 1088. Let me investigate."
1. Read line 1088: const dump = await stContext.dumpContextToConsole();
2. Error says "not awaited" but I see "await"
3. Read validation script regex: (?<!await\\s)functionName\\(
4. DISCOVERY: Regex checks for "await " immediately before function name
5. BUG FOUND: Pattern misses "await obj.method()" - only catches "await method()"
6. FIX: Update regex to handle method calls with lookback context
7. RE-RUN: Error eliminated, validation passes
```

### 🔒 NON-NEGOTIABLE RULES

1. **All validation errors = BLOCKERS** - No "proceed anyway" allowed
2. **Zero is the only acceptable error count** - Not "close enough"
3. **Scripts must be 100% accurate** - Fix false positives AND false negatives
4. **Investigate before dismissing** - Reading code is cheaper than debugging later
5. **Trust but verify** - Even if error "looks wrong", investigate fully

### 💡 WHY THIS MATTERS

**What happened when we ignored "false positives":**
1. validate-interfaces.js reported 19 errors → Dismissed as "false positives"
2. Investigation revealed: Script had 3 bugs + 1 stale file in codebase
3. validate-async-await.js reported 1 error → Dismissed as "false positive"  
4. Investigation revealed: Script's regex pattern was incomplete

**Cost of dismissing errors without investigation:**
- Bugs remain hidden in codebase
- Validation tools become unreliable
- Technical debt accumulates
- Real issues get masked by assumed "false positives"

**The rule:** If a script says there's an error, there IS an error - either in the code or in the script. Find it and fix it.

---

## Project Overview

This is a **SillyTavern browser extension** that automatically tracks character information from chat messages using LLM analysis. The extension creates and manages chat-level lorebooks with detailed character profiles extracted from conversations.

**Key Architecture**: Modular browser extension with Webpack build system, using modern ES6 modules for maintainability and testability.

## New Modular Architecture (v2.1.0+)

### Build System
- **Webpack bundler** combines modules into single `index.js` output
- **ES6 modules** with import/export for clean dependencies  
- **ESLint** for code quality and SillyTavern compatibility
- **Source maps** for debugging modular code in production

### Core Infrastructure (`src/core/`)
- **`debug.js`** - Module-specific logging, performance monitoring, operation tracing
- **`errors.js`** - Error boundaries, graceful degradation, transaction rollback
- **`settings.js`** - Centralized settings management (global + chat-level data)
- **`context.js`** - Thin SillyTavern API wrapper with error handling

### Utility Layer (`src/utils/`)
- **`helpers.js`** - Common functions (HTML escaping, hashing, name normalization)
- **`notifications.js`** - Centralized toastr notifications with consistent styling

### Feature Modules (`src/modules/`) - **✅ COMPLETE**
- **`characters.js`** - Character CRUD operations and merging logic
- **`llm.js`** - LLM API integration (SillyTavern + Ollama)  
- **`lorebook.js`** - SillyTavern lorebook integration
- **`processing.js`** - Message analysis and batch processing
- **`ui.js`** - User interface components and interactions
- **`processing.js`** - Message analysis and batch processing
- **`ui.js`** - User interface components and interactions

### Development Commands
```bash
npm run build     # Production build → index.js
npm run dev       # Development build with watch
npm run lint      # ESLint validation
```

## Testing & Validation

Always run the unit/validation tests before any integration test to ensure coding work is complete and stable before end-to-end runs.

### Pre-Development Validation

Before making ANY code edits to modular files, run the validation scripts:

```bash
# Validate interface consistency
node validate-interfaces.js

# Check async/await patterns
node tests/validate-async-await.js

# Verify method signatures
node tests/validate-method-calls.js
```

All three must pass before starting development work.

### Quick Validation Checklist

- [ ] Run `node validate-interfaces.js` - all interfaces match
- [ ] Run `node tests/validate-async-await.js` - all async calls awaited
- [ ] Run `node tests/validate-method-calls.js` - all methods exist
- [ ] `npm run build` succeeds
- [ ] No webpack errors or warnings
- [ ] All console log statements in place for debugging

**See `tests/README.md` for detailed validation script usage and integration with git hooks.**

## MANDATORY PRE-EDIT VALIDATION

**⚠️ CRITICAL REQUIREMENT: Before making ANY code edits, you MUST validate interfaces to avoid assumption-based errors.**

### Required Validation Steps

1. **Check Import/Export Consistency**
   ```bash
   # Use validation script to check for mismatches
   node validate-interfaces.js
   ```

2. **Verify Method Existence Before Binding**
   ```bash
   # Check what methods actually exist in class
   grep -n "^\s*[a-zA-Z_][a-zA-Z0-9_]*\s*(" src/core/debug.js
   
   # Check what's being imported
   grep -r "import.*{.*createModuleLogger" src/
   ```

3. **Cross-Reference Interface Requirements**
   - Map all import statements to see what's being requested
   - Check source files to see what actually exists  
   - Compare interface expectations vs reality
   - Test exports by examining webpack output

4. **Validate Function Signatures**
   ```bash
   # Before adding exports, verify the function exists
   grep -n "function functionName\|const functionName\|functionName.*=" file.js
   ```

### Interface Validation Checklist

**Before ANY export statement:**
- [ ] Confirm the method/property actually exists in the class/object
- [ ] Check the exact method signature and parameters
- [ ] Verify the method is not private or internal-only
- [ ] Test that bind() calls reference valid methods

**Before ANY import statement:**
- [ ] Confirm the target file exports the requested item
- [ ] Check that export names match exactly (case-sensitive)
- [ ] Verify the import path is correct
- [ ] Ensure circular dependencies won't occur

### Common Anti-Patterns to Avoid

❌ **DON'T** assume methods exist based on naming patterns
❌ **DON'T** bind undefined methods (e.g., `obj.nonExistentMethod.bind(obj)`)  
❌ **DON'T** export functions that haven't been implemented
❌ **DON'T** import from modules without checking their exports

✅ **DO** grep for actual function definitions first
✅ **DO** run validation script before making changes
✅ **DO** read the actual source code to understand interfaces
✅ **DO** test webpack builds after interface changes

### Emergency Recovery

If validation reveals missing exports/functions:
1. **Stop immediately** - don't guess or assume
2. **Map out what actually exists** vs what's needed
3. **Create missing functions** or **remove invalid imports**
4. **Rebuild and test** systematically

## Critical Integration Patterns

### SillyTavern API Usage
```javascript
const context = SillyTavern.getContext();  // Primary API access point
extension_settings[extensionName]          // Persistent extension settings
context.chatMetadata                       // Chat-specific data storage
eventSource.on(event_types.MESSAGE_RECEIVED, handler)  // Event hooks
```

**Never** use Node.js patterns - this runs in browser context only. All file I/O goes through SillyTavern's context APIs.

### Settings Architecture
- **Global settings**: Stored in `extension_settings[extensionName]` 
- **Chat-level data**: Stored in `context.chatMetadata[extensionName]` (characters, counters)
- **Pattern**: Always merge defaults with saved settings on load, call `saveChatData()` after character updates

### Character Data Structure
```javascript
{
  preferredName: "Character's canonical name",
  aliases: ["Alternative names", "Nicknames"],
  physical: { description: "Physical appearance..." },
  mental: { personality: "Personality traits...", background: "..." },
  relationships: ["Name is Other's relationship"],
  ignored: boolean,
  isMainChar: boolean,  // {{char}} detection
  lorebookEntryId: "unique_id"
}
```

## LLM Integration Patterns

### Dual LLM Support
- **SillyTavern mode**: Uses `context.generateQuietPrompt()` with current model
- **Ollama mode**: Direct fetch to local Ollama endpoint
- **Pattern**: All LLM calls go through `callLLMAnalysis()` wrapper function

### Prompt Engineering
- System prompt with strict JSON output requirements
- Handles chronological processing (latest info wins)
- Title/name normalization rules prevent duplicate characters
- **Critical**: Never censor content - extension analyzes adult conversations

## Event-Driven Architecture

### Message Processing Flow
1. `onMessageReceived` → checks frequency threshold → `processNewMessage`
2. `analyzeMessages` → batches messages → `callLLMAnalysis` 
3. `processCharacterData` → merges/updates characters → `updateLorebookEntry`
4. `saveChatData` → persists to chat metadata

### Async Processing Patterns
```javascript
let processingQueue = [];
let isProcessing = false;

// Prevent concurrent LLM calls
if (isProcessing) {
    processingQueue.push(() => processNewMessage());
    return;
}
```

## Lorebook Management

### Chat-Level Lorebooks
- Each chat gets unique lorebook: `NameTracker_{chatId}`
- Bound via `chatMetadata['world_info']`
- **Pattern**: Always call `initializeLorebook()` on chat change

### Entry Management
```javascript
// Create/update pattern
const entryData = {
    uid: generateUID(),
    key: [character.preferredName, ...character.aliases],
    content: formatCharacterInfo(character),
    position: settings.lorebookPosition,
    enabled: settings.lorebookEnabled
};
await context.saveWorldInfoEntry(lorebookName, entryData);
```

## UI/jQuery Patterns

### Settings Panel Integration
- HTML loaded from `settings.html` via `$.get()`
- Event handlers bound in jQuery ready block
- **Pattern**: `updateUI()` syncs all form elements with settings

### Dynamic Character List
```javascript
// Always escape HTML and handle empty states
const charIcon = char.isMainChar ? '<i class="fa-solid fa-user"></i>' : '';
listContainer.append(sanitizedCharacterHtml);
```

## Common Development Patterns

### Error Handling
```javascript
try {
    await riskyOperation();
} catch (error) {
    console.error('[Name Tracker]', error);
    toastr.error(`Operation failed: ${error.message}`, 'Name Tracker');
    return;
}
```

### Debug Logging
```javascript
function debugLog(message) {
    if (getSettings().debugMode) {
        console.log('[Name Tracker Debug]', message);
    }
}
```

### Merge Operations
- Always store last 3 operations in `undoHistory`
- Use confidence scores for conflict resolution
- **Pattern**: Backup before merge, allow rollback

## File Organization

- `index.js` - Complete extension (3200+ lines)
- `settings.html` - Configuration UI panel  
- `style.css` - Custom styling with SillyTavern theme variables
- `manifest.json` - Extension metadata

## Testing & Debugging

### Key Debug Points
- Enable debug mode for verbose console logging
- Check `context.chatMetadata` for character persistence
- Monitor `analysisCache` for LLM call efficiency
- Verify lorebook binding with `chatMetadata['world_info']`

### Common Issues
- **Memory leaks**: Clear `analysisCache` on chat change
- **Race conditions**: Use `isProcessing` flag for LLM calls  
- **Data loss**: Always call `saveChatData()` after character updates
- **UI sync**: Call `updateUI()` and `updateCharacterList()` after setting changes

## Troubleshooting & Known Issues

### Async/Await Patterns
- **Issue:** Functions wrapped with `withErrorBoundary()` are async even if callback is sync
- **Solution:** Always await calls to functions using `withErrorBoundary()`
- **Reference:** `tests/validate-async-await.js` enforces this pattern

### Context Detection
- **Issue:** `getContext()` may be null if SillyTavern not fully loaded
- **Solution:** Always check context availability; use error boundaries
- **Pattern:** See `src/core/context.js` for safe context access patterns

### Batch Processing
For understanding message batch calculations:
- `startIdx`: First message to include
- `endIdx`: Last message (exclusive)
- Message frequency affects batch size automatically
- Context window limits split messages into sub-batches

### Lorebook Updates
- **Issue:** Character name changes can create orphaned entries
- **Solution:** `updateLorebookEntry()` cleans up orphaned entries automatically
- **Mechanism:** Scans for entries with matching keys, removes non-current IDs

### Character List UI Updates
- **Issue:** Characters created but not displayed in UI panel
- **Solution:** Always call `updateCharacterList()` after processing characters
- **Pattern:** Call at end of `analyzeMessages()` or `processCharacterData()` loops

### Debug Logging
Enable with `get_settings('debugMode')`:
- Module-specific logging via `createModuleLogger()`
- Performance monitoring via `debug.time()` / `debug.timeEnd()`
- Operation tracing for async operations
- All logs prefixed with `[NT-*]` for easy filtering

## Essential SillyTavern Extension References

### Official Documentation
- [Extensions Overview](https://docs.sillytavern.app/extensions/) - Core extension concepts and capabilities
- [Writing Extensions Guide](https://docs.sillytavern.app/for-contributors/writing-extensions/) - Official development guide
- [ST Context API](https://github.com/SillyTavern/SillyTavern/blob/staging/public/scripts/st-context.js) - Complete API reference

### Templates and Examples  
- [Webpack Template](https://github.com/SillyTavern/Extension-WebpackTemplate) - Modern build setup
- [React Template](https://github.com/SillyTavern/Extension-ReactTemplate) - React-based extension template
- [Simple Example](https://github.com/city-unit/st-extension-example) - Basic extension patterns
- [Extension Repository Search](https://github.com/search?q=topic%3Aextension+org%3ASillyTavern&type=Repositories) - Browse existing extensions

### Extension Development Patterns
- **Never** use Node.js filesystem APIs - browser environment only
- Always use `SillyTavern.getContext()` for API access
- Respect SillyTavern's jQuery-based UI patterns and theme variables
- Follow event-driven architecture with proper cleanup on chat changes
- Use `extension_settings` for global config, `chatMetadata` for chat-specific data

### Reference Extensions (Design Influences)

This extension drew patterns and insights from these SillyTavern extensions:

- **[MessageSummarize](https://github.com/qvink/SillyTavern-MessageSummarize)** - LLM integration patterns, message processing workflows, and batch analysis techniques
- **[Codex](https://github.com/LenAnderson/SillyTavern-Codex)** - Chat metadata management, persistent data storage, and extension lifecycle patterns  
- **[Nicknames](https://github.com/Wolfsblvt/SillyTavern-Nicknames)** - Character name handling, alias management, and UI integration approaches

### Settings Architecture (v2.1.1+)

**✅ SIMPLIFIED SETTINGS SYSTEM IMPLEMENTED**

The extension now uses **SillyTavern standard patterns** with preserved error handling:

- **Direct API access**: `extension_settings[MODULE_NAME]` and `chat_metadata[MODULE_NAME]`
- **Built-in persistence**: `saveSettingsDebounced()` and `saveMetadataDebounced()`
- **Simple helper functions**: `get_settings()`, `set_settings()`, `getCharacters()`, etc.
- **Preserved error boundaries**: All operations wrapped with try/catch and user notifications
- **No backward compatibility needed**: Settings data resets cleanly during upgrades

**CRITICAL ARCHITECTURAL DECISIONS:**

1. **Error handling is mandatory** - all public functions have try/catch boundaries with user notifications
2. **Validation preserved** - setting key validation, character name sanitization, API availability checks
3. **Initialization order critical** - Settings → Error Boundaries → Context → Modules → UI → Events
4. **Context availability strategy** - direct `getContext()` checks without caching, following MessageSummarize patterns
5. **Module update sequence** follows dependency flow: Settings → Core → Processing → Characters → UI
6. **Transaction rollback capability** maintained for character operations and state consistency

When working on this codebase, prioritize maintaining the event-driven architecture and ensuring data persistence through SillyTavern's API patterns.