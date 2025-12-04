# Name Tracker UI Improvements - Changelog

## Version 2.1.0 - Chat UI Integration

### New Features

#### 1. **Lorebook Editor Integration**
- **"View in Lorebook" button now opens the actual lorebook editor**
  - Previously showed a toast notification with character data
  - Now directly opens the SillyTavern World Info editor
  - Automatically ensures the chat lorebook exists
  - Falls back to opening World Info panel if `openWorldInfoEditor()` API isn't available
  - Shows success toast when editor opens

#### 2. **Chat Extension Shortcuts**
Two new quick-access buttons added to the chat interface:

##### **📖 Chat Lorebook Button**
- Opens the Name Tracker chat lorebook directly in the editor
- Located conveniently near the chat input area
- One-click access to view/edit all tracked characters
- Icon: Book (fa-book)

##### **🌱 Auto-Harvest Toggle Button**
- Toggle automatic character harvesting on/off with one click
- Visual indicator: Green when enabled, default color when disabled
- Updates both the button and extension settings in sync
- Shows current status: "Auto-Harvest: ON" or "Auto-Harvest: OFF"
- Icon: Seedling (fa-seedling)

### Technical Changes

#### Modified Files:

**index.js:**
- Updated `viewInLorebook()` function (lines 1368-1402)
  - Now async function
  - Calls `ensureLorebookExists()` first
  - Uses `context.openWorldInfoEditor(lorebookName)` API
  - Includes fallback for older SillyTavern versions
  
- Added `addChatShortcuts()` function (lines 1757-1838)
  - Creates shortcut container div after `#send_form`
  - Builds "Open Chat Lorebook" button with click handler
  - Builds "Toggle Auto-Harvest" button with state management
  - Updates button styling based on active state
  - Syncs with extension settings

- Modified initialization (line 1877)
  - Added `addChatShortcuts()` call after loading settings

**style.css:**
- Added `.name-tracker-shortcuts` styles (lines 291-332)
  - Flexbox layout for button arrangement
  - Responsive with gap spacing
  - Uses SillyTavern theme variables for consistency
  
- Added `.menu_button` styles for shortcut buttons
  - Inline-flex display with icons
  - Hover effects with transform animation
  - Active state styling (green background)
  - Font Awesome icon spacing

### User Experience Improvements

1. **Direct Lorebook Access:**
   - No more copying from toast notifications
   - Edit character entries immediately
   - Seamless integration with SillyTavern's World Info system

2. **Quick Toggle Controls:**
   - Enable/disable auto-harvest without opening settings
   - Visual feedback of current state
   - Convenient for testing or manual control scenarios

3. **Consistent UI:**
   - Buttons use SillyTavern theme colors
   - Smooth hover animations
   - Clear iconography

### Compatibility

- **Requires:** SillyTavern with World Info support
- **API Used:** `context.openWorldInfoEditor()` (with fallback)
- **Graceful Degradation:** Falls back to opening World Info panel if API unavailable

### Usage

**Opening Lorebook Editor:**
1. Click "View" button next to any character in the roster
2. **OR** click the "Chat Lorebook" shortcut button
3. Lorebook editor opens automatically to the Name Tracker chat lorebook

**Toggling Auto-Harvest:**
1. Click the "Auto-Harvest" button in chat shortcuts
2. Button turns green when enabled, gray when disabled
3. Status text updates: "Auto-Harvest: ON" / "Auto-Harvest: OFF"
4. Setting persists across sessions

### Known Issues

None currently identified.

### Future Enhancements (Ideas)

- Add shortcut to trigger manual character analysis
- Add character count badge to Chat Lorebook button
- Add keyboard shortcuts for common actions
- Add "Scan Last N Messages" quick action button
