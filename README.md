# SillyTavern Name Tracker Extension

## Version 2.1.0

A powerful character tracking extension for SillyTavern that automatically analyzes chat messages using LLM to extract and maintain comprehensive character information in chat-level lorebook entries.

## Overview

Name Tracker automatically analyzes your chat messages to build detailed character profiles stored in dedicated lorebook entries. Using LLM analysis, it extracts physical descriptions, personality traits, relationships, and more - keeping everything organized and accessible through SillyTavern's lorebook system.

## Features

### Automatic Character Tracking
- **LLM-Powered Analysis**: Uses AI to intelligently extract character information from conversations
- **Consolidated Character Data**: Tracks 7 key fields per character (Age, Physical, Personality, Sexuality, Race/Ethnicity, Role & Skills, Last Interaction)
- **Smart Alias Detection**: Automatically recognizes when different names refer to the same character
- **Message ID Tracking**: Reliably handles message edits, deletions, and regenerations
- **Relationship Mapping**: Tracks connections between characters

### Lorebook Integration
- **Chat-Level Lorebooks**: Each chat gets its own dedicated lorebook automatically
- **Fully Customizable Injection**: Control position, depth, cooldown, scan depth, and probability from GUI
- **Dynamic Cooldown**: Automatically calculated as 3/4 of your message frequency setting
- **Auto-Enable Control**: Choose whether new entries are enabled by default

### LLM Flexibility
- **Dual LLM Support**: 
  - Use SillyTavern's currently connected model (OpenAI, Claude, etc.)
  - Use local Ollama instance with automatic model discovery
- **Smart Context Management**: Automatically splits large analyses to fit context windows
- **Intelligent Caching**: Session-based caching prevents redundant API calls

### Character Management
- **Quick Access Menu**: View characters, toggle auto-harvest, and open lorebook from Extensions menu
- **Merge Duplicates**: Combine character entries with intelligent conflict resolution
- **Undo Merges**: Reverse up to last 3 merge operations
- **Ignore List**: Exclude specific characters (user character auto-ignored)
- **Deletion Detection**: Prompts for rescan when messages are deleted

### User Control
- **Configurable Frequency**: Set how many messages between automatic analyses
- **Manual Analysis**: Analyze last X messages or scan entire chat on demand
- **Batch Scanning**: Progress bars and abort controls for long scans
- **Debug Mode**: Comprehensive console logging for troubleshooting

## Installation

1. Download or clone this repository
2. Place the folder in your SillyTavern extensions directory:
   ```
   SillyTavern/public/scripts/extensions/third-party/STnametracker/
   ```
3. Restart SillyTavern or reload the page
4. Enable the extension in Extensions → Name Tracker

## Configuration

### Basic Setup

1. **Enable the Extension**: Check "Enable Name Tracking"
2. **Set Message Frequency**: Default is 10 messages between analyses
3. **Choose LLM Source**: 
   - **SillyTavern**: Uses your currently connected model
   - **Ollama**: Uses a local Ollama instance

### Ollama Configuration

If using Ollama:
1. Ensure Ollama is running locally
2. Set the endpoint (default: `http://localhost:11434`)
3. Click "Refresh" to load available models
4. Select your preferred model from the dropdown

### Lorebook Settings

Configure how character entries are injected into context:
- **Position**: After/before character defs, top/bottom of prompt (default: After character defs)
- **Depth**: How deep in chat history to inject entries (default: 1)
- **Scan Depth**: How many messages back to scan for keywords (default: 1)
- **Cooldown**: Messages between activations (default: calculated as 3/4 of message frequency)
- **Probability**: Chance of activation when keywords match (default: 100%)
- **Enabled**: Whether new entries are enabled by default (default: true)

All settings are fully configurable in the GUI and respected by the extension.

### Confidence Threshold

**Note**: Confidence threshold is currently not used in v2.1.0. Merging is manual only.
- Future versions may reintroduce automatic similarity detection
- For now, use the manual merge feature to combine duplicates

## Usage

### Extensions Menu Shortcuts

Access Name Tracker quickly from the Extensions menu (wand icon):
- **Toggle Auto-Harvest**: Enable/disable automatic analysis (icon shows current state)
- **View Characters**: Quick modal showing all tracked characters with badges
- **Open Chat Lorebook**: Opens the current chat's lorebook in World Info editor

### Automatic Mode

1. Enable "Auto-analyze on message threshold"
2. Continue chatting normally
3. Every X messages (per your frequency setting), the extension automatically:
   - Analyzes recent messages using LLM
   - Extracts character information
   - Creates or updates lorebook entries
   - Tracks by message ID to handle edits/deletions correctly

### Manual Mode

Use manual controls for on-demand analysis:
- **Analyze Last X Messages**: Specify count and analyze recent messages
- **Scan Entire Chat**: Processes all messages in batches (shows progress bar)
- **Abort Scan**: Stop button available during batch processing

### Character Management

Each tracked character displays:
- **Name**: Preferred/canonical name
- **Badges**: 
  - `ACTIVE`: Currently loaded character
  - `IGNORED`: Excluded from tracking
  - `NEEDS REVIEW`: Has unresolved relationships (???)
- **Aliases**: Alternative names detected
- **Lorebook Entry ID**: Link to the actual lorebook entry

**Available Actions**:
- **Merge**: Combine duplicate entries (with undo support)
- **Ignore/Unignore**: Toggle tracking for specific characters

### Merging Characters

When duplicates are detected:

1. Click "Merge" on the character to remove
2. Select target character from dropdown
3. Confirm the merge
4. Source character deleted, all data merged into target

**Merge Behavior**:
- New information overwrites old for most fields
- Aliases are combined (duplicates removed)
- `lastInteraction` always uses newest data
- Relationships are merged and deduplicated
- Undo available for last 3 merges

## Character Data Structure

Each character is tracked with 7 consolidated fields stored in lorebook entries:

```json
{
  "name": "Character Name",
  "aliases": ["Nickname1", "Alt Name"],
  "physicalAge": "Apparent age in years",
  "mentalAge": "Actual age (can differ for immortals/magic)",
  "physical": "Gender, body type, measurements, hair, eyes, skin, explicit details (2-3 paragraphs)",
  "personality": "Traits, quirks, habits, likes, dislikes (2-3 paragraphs)",
  "sexuality": "Orientation, preferences, kinks, experience (1-2 paragraphs)",
  "raceEthnicity": "Species/ethnicity (e.g., High Elf, Caucasian, etc.)",
  "roleSkills": "Occupation, abilities, talents (3-5 key attributes)",
  "lastInteraction": "Most recent interaction with {{user}}",
  "relationships": [
    "Character is John's sister",
    "Character works for ???"
  ]
}
```

### Unresolved Relationships

When relationships mention unknown characters, `???` is used as a placeholder:
- "Sarah is ???'s boss" - relationship mentioned but target unclear
- Character flagged with `NEEDS REVIEW` badge for manual review

## System Prompt

The extension uses a sophisticated system prompt that:
- Enforces JSON-only output for reliable parsing
- Processes messages chronologically (oldest to newest)
- Prioritizes most recent information for conflicts
- Separates physical age vs mental age (for immortals, magic aging)
- Handles titles properly (e.g., "Aunt Marie" → name: Marie, aliases: ["Aunt Marie"])
- Extracts comprehensive information without censorship
- Uses `???` placeholders for unknown relationship targets

The system prompt can be customized via "Edit System Prompt" button in settings.

## Best Practices

### Harvest Frequency
- **Short conversations**: 5-10 messages
- **Normal chat**: 10-20 messages  
- **Long roleplay**: 20-50 messages

### Confidence Threshold
- Start at 70% and adjust based on results
- Lower if getting too many duplicates
- Raise if getting incorrect merges

### LLM Selection
- **SillyTavern**: Best for cloud models with large context
- **Ollama**: Best for privacy and local processing
- Use capable models (7B+ parameters recommended)

### Performance
- Use "Analyze Last X" instead of "Scan All" when possible
- Clear cache periodically if experiencing issues
- Debug mode helps diagnose problems but increases console output

## Troubleshooting

### No Characters Detected
- Verify LLM is responding (check debug mode in console)
- Ensure extension is enabled and auto-analyze is on
- Check that API connection is active (for SillyTavern mode)
- Verify message frequency is appropriate for chat length

### Ollama Connection Issues
- Confirm Ollama is running: `ollama list` in terminal
- Check endpoint URL is correct (default: `http://localhost:11434`)
- Ensure selected model is downloaded: `ollama pull <model-name>`
- Click "Refresh" button to reload model list

### Messages Not Being Analyzed
- Check status display for "Next scan in X messages"
- Verify you've sent enough messages since last scan
- If messages were deleted, respond to rescan prompt
- Clear cache and try manual analysis

### Lorebook Entries Not Activating
- Verify chat-level lorebook is enabled in World Info
- Check lorebook entry settings match your GUI configuration
- Ensure character names/aliases are set as keywords
- Verify depth and scan depth settings are appropriate

### Performance Issues
- Reduce message frequency for shorter chats
- Use "Analyze Last X" instead of "Scan All" when possible
- Clear cache periodically: "Clear Cache" button
- Enable debug mode to identify bottlenecks

## Debug Mode

Enable debug mode for detailed console logging (F12):
- LLM requests and responses (truncated for readability)
- Message ID tracking and deletion detection
- Character creation, updates, and merges
- Lorebook entry modifications
- Cache hits and misses
- Batch processing progress
- Error details and stack traces

Debug output is prefixed with `[Name Tracker]` for easy filtering.

## Future Enhancements

Planned features for future versions:
- **Automatic Similarity Detection**: Reintroduce confidence-based auto-merging
- **Natural Language Lorebook**: Option for prose format vs JSON
- **Character Relationship Graphs**: Visual mapping of connections
- **Cross-Chat Synchronization**: Share character data between chats
- **Export/Import**: Save and load character databases
- **Advanced Search/Filters**: Find characters by attributes
- **Character Preview Cards**: Expandable detail views
- **Custom Field Templates**: User-defined character attributes

## Credits

Developed by ATreemanDork

Inspired by and learned from:
- [MessageSummarize](https://github.com/qvink/SillyTavern-MessageSummarize) by Qvink
- [Codex](https://github.com/LenAnderson/SillyTavern-Codex) by LenAnderson
- [Nicknames](https://github.com/Wolfsblvt/SillyTavern-Nicknames) by Wolfsblvt

## License

[Your chosen license]

## Support

For issues, suggestions, or contributions:
- GitHub Issues: [https://github.com/ATreemanDork/STnametracker/issues](https://github.com/ATreemanDork/STnametracker/issues)
- SillyTavern Discord: Tag @ATreemanDork

## Version History

### v2.1.0 (Current - December 2024)
**Major Improvements:**
- Consolidated character data structure (7 comprehensive fields vs 20+ individual fields)
- Message ID-based tracking (handles edits, deletions, regenerations correctly)
- Extension menu shortcuts (toggle auto-harvest, view characters, open lorebook)
- All GUI lorebook settings now properly respected (was hardcoded)
- Dynamic cooldown calculation (3/4 of message frequency)
- Deletion detection with user prompts for rescan decisions
- Improved system prompt with chronological processing and title handling
- User character auto-ignored on first load

**Technical Changes:**
- Removed backward compatibility code for cleaner data structure
- Fixed syntax errors in status display
- Removed unused "Edit Entry" button from UI
- Enhanced error handling and retry logic
- Better token counting and context management

### v2.0.0
- Complete rewrite with LLM integration
- Chat-level lorebook management
- Character merging and alias detection
- Ollama support with model discovery
- Incremental analysis and caching
- Undo functionality
- Comprehensive character tracking

### v1.0.0
- Initial basic name extraction
- Simple display of mentioned names
