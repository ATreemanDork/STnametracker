# Name Tracker UI Improvements - Changelog

## Version 2.1.0 - Extension Menu Integration

### New Features

#### 1. **Lorebook Editor Integration**
- **"View in Lorebook" button now opens the actual lorebook editor**
  - Previously showed a toast notification with character data
  - Now directly opens the SillyTavern World Info editor
  - Uses the chat's existing lorebook (initialized on chat change)
  - Falls back to opening World Info panel if `openWorldInfoEditor()` API isn't available
  - Shows success toast when editor opens

#### 2. **Extension Menu Shortcuts**
Two new buttons added to SillyTavern's extension menu (three-dot menu):

##### **📖 Open Chat Lorebook**
- Opens the Name Tracker chat lorebook directly in the editor
- Accessible from the extension menu dropdown
- One-click access to view/edit all tracked characters
- Icon: Book (fa-book)

##### **🌱 Toggle Auto-Harvest**
- Toggle automatic character harvesting on/off with one click
- Syncs with the extension settings panel
- Shows toast notification of current state
- Icon: Seedling (fa-seedling)

### Technical Changes

#### Modified Files:

**index.js:**
- Updated `viewInLorebook()` function (lines 1368-1400)
  - Removed non-existent `ensureLorebookExists()` call
  - Uses existing `lorebookName` from chat initialization
  - Calls `context.openWorldInfoEditor(lorebookName)` API
  - Includes fallback for older SillyTavern versions
  
- Added `openChatLorebook()` function (lines 1755-1772)
  - Opens chat lorebook in World Info editor
  - Checks for active chat/lorebook first
  - Uses same API pattern as viewInLorebook()

- Added `toggleAutoHarvest()` function (lines 1774-1787)
  - Toggles `settings.autoAnalyze` flag
  - Syncs with settings UI checkbox
  - Saves settings via `saveSettingsDebounced()`
  - Shows toast notification

- Added `initializeMenuButtons()` function (lines 1789-1809)
  - Uses `context.addExtensionMenuButton()` API
  - Registers two menu items with callbacks
  - Follows same pattern as Qvink Memory extension
  - Called during extension initialization

**style.css:**
- Removed custom `.name-tracker-shortcuts` styles (no longer needed)
- Uses SillyTavern's built-in extension menu styling

### User Experience Improvements

1. **Direct Lorebook Access:**
   - No more copying from toast notifications
   - Edit character entries immediately
   - Seamless integration with SillyTavern's World Info system

2. **Native Extension Menu:**
   - Consistent with other SillyTavern extensions
   - Accessible from the standard three-dot menu
   - No custom UI elements cluttering the chat

3. **Quick Toggle Controls:**
   - Enable/disable auto-harvest without opening settings
   - Toast feedback of current state
   - Settings persist across sessions

### Compatibility

- **Requires:** SillyTavern with extension menu support
- **API Used:** 
  - `context.openWorldInfoEditor()` (with fallback)
  - `context.addExtensionMenuButton()` (with safety check)
- **Graceful Degradation:** Functions check for API availability before use

### Usage

**Opening Lorebook Editor:**
1. Click "View" button next to any character in the roster
2. **OR** click the three-dot extension menu → "Open Chat Lorebook"
3. Lorebook editor opens automatically to the Name Tracker chat lorebook

**Toggling Auto-Harvest:**
1. Click the three-dot extension menu → "Toggle Auto-Harvest"
2. Toast shows new state: "Auto-harvest enabled/disabled"
3. Setting syncs with extension settings panel
4. Setting persists across sessions

### Bug Fixes

- Fixed `ensureLorebookExists is not defined` error
  - Removed calls to non-existent function
  - Lorebook is already initialized in `onChatChanged()` event handler
  - Uses existing `lorebookName` variable

### Known Issues

None currently identified.

### Future Enhancements (Ideas)

- Add menu shortcut to trigger manual character analysis
- Add character count badge indicator
- Add keyboard shortcuts for common actions
- Add "Scan Last N Messages" quick action

