# Name Tracker Extension - AI Developer Instructions

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

When working on this codebase, prioritize maintaining the event-driven architecture and ensuring data persistence through SillyTavern's API patterns.