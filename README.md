# SillyTavern Name Tracker Extension

## Overview

The Name Tracker extension is an advanced character tracking system for SillyTavern that automatically analyzes chat messages to extract and maintain detailed information about characters, including their physical descriptions, mental/emotional states, and relationships. All data is stored in chat-level lorebook entries for seamless integration with your conversations.

## Features

### Core Functionality
- **Automatic Character Detection**: Uses LLM analysis to identify characters mentioned in messages
- **Intelligent Alias Detection**: Automatically detects when different names refer to the same person
- **Comprehensive Character Profiles**: Tracks physical descriptions, mental/emotional states, and relationships
- **Chat-Level Lorebook Integration**: All character data stored in dedicated lorebook entries
- **Incremental Analysis**: Only analyzes characters mentioned in recent messages for efficiency

### LLM Integration
- **Dual LLM Support**: 
  - Use SillyTavern's currently selected model
  - Use local Ollama endpoint with model selection
- **Automatic Model Discovery**: Ollama models are automatically detected and listed
- **Intelligent Caching**: Session-based caching prevents redundant API calls

### Character Management
- **Merge Characters**: Combine duplicate character entries with intelligent conflict resolution
- **Undo Merges**: Reverse the last 3 merge operations
- **Ignore Characters**: Mark characters to exclude from tracking
- **Unresolved Relationships**: Flags relationships with unknown targets (???) for user review

### User Control
- **Configurable Harvest Frequency**: Set how many messages between automatic analyses
- **Manual Analysis**: Analyze specific number of messages or scan entire chat history
- **Confidence Threshold**: Adjust auto-merge sensitivity (0-100%)
- **Debug Mode**: Detailed console logging for troubleshooting

### Lorebook Settings
- **Customizable Injection**: Configure position, depth, cooldown, and probability
- **Auto-Enable Entries**: Choose whether new entries are enabled by default
- **Chat-Level Storage**: Each chat has its own dedicated lorebook

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

Configure how character entries are injected:
- **Position**: After/before character defs, top/bottom of prompt
- **Scan Depth**: How many messages back to scan for keywords (default: 1)
- **Cooldown**: Messages between activations (default: 5)
- **Probability**: Chance of activation when keywords match (default: 100%)

### Confidence Threshold

Set the similarity threshold (0-100%) for automatic merging:
- **High (80-100%)**: Only merge very similar names
- **Medium (60-79%)**: Balance between safety and automation
- **Low (40-59%)**: More aggressive merging (may create errors)

## Usage

### Automatic Mode

1. Enable "Auto-analyze on message threshold"
2. Continue chatting normally
3. Every X messages (per your frequency setting), the extension will:
   - Analyze the last X messages
   - Extract character information
   - Update or create lorebook entries
   - Merge similar characters above confidence threshold

### Manual Mode

Use the manual controls for on-demand analysis:

- **Analyze Last X Messages**: Enter a number and click to analyze
- **Scan Entire Chat**: Analyzes all messages in the current chat (use cautiously on long chats)

### Character Management

In the character list, each character shows:
- **Preferred Name**: The canonical name
- **Aliases**: Alternative names that refer to this character
- **Status Badges**:
  - `IGNORED`: Character is excluded from tracking
  - `NEEDS REVIEW`: Has unresolved relationships (???)

**Actions**:
- **View in Lorebook**: Opens the character's lorebook entry
- **Merge**: Combine this character with another
- **Ignore/Unignore**: Toggle ignore status

### Merging Characters

When you discover duplicates:

1. Click "Merge" on the character you want to remove
2. Select the target character from the dropdown
3. Confirm the merge
4. The source character is deleted, all data merged into target

**Merge Behavior**:
- Target character data takes precedence for conflicts
- Source aliases are added to target
- Ephemeral states (emotions, moods) from both are preserved
- Relationships are combined

### Undo Feature

Made a mistake? Click "Undo Last Merge" to reverse up to the last 3 merge operations.

## Data Structure

Character data is stored in JSON format within lorebook entries:

```json
{
  "name": "Character Name",
  "aliases": ["Alt Name 1", "Alt Name 2"],
  "physical": {
    "appearance": "Physical description",
    "measurements": "Height, build, etc.",
    "other": "Additional physical traits"
  },
  "mental": {
    "personality": "Personality traits",
    "mood": "Current emotional state",
    "status": "Mental/emotional conditions"
  },
  "relationships": [
    "Character is John's sister",
    "Character works for ???"
  ]
}
```

### Unresolved Relationships

When the LLM cannot determine who a relationship refers to, it uses `???`:
- "Sarah is ???'s boss" (mentions someone but unclear who)
- "Character loves ???" (relationship mentioned but target unknown)

These appear with the `NEEDS REVIEW` badge in the UI.

## System Prompt

The extension uses a carefully crafted system prompt that:
- Instructs the LLM to extract character information without censorship
- Emphasizes this is a classification/summarization task
- Handles adult content appropriately when present
- Uses ??? placeholders for unknown relationship targets
- Returns structured JSON for reliable parsing

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
- Ensure LLM is responding correctly (check debug mode)
- Verify message frequency is set appropriately
- Check that extension is enabled

### Ollama Connection Issues
- Verify Ollama is running: `ollama list`
- Check endpoint URL is correct
- Ensure selected model is downloaded

### Incorrect Merges
- Increase confidence threshold
- Use manual merge instead of automatic
- Utilize undo function to reverse mistakes

### Lorebook Not Working
- Verify the chat-level lorebook is enabled in World Info
- Check lorebook entry settings (depth, probability, etc.)
- Ensure keywords (character names/aliases) are set correctly

## Debug Mode

Enable debug mode to see:
- LLM analysis requests and responses
- Cache hits and misses
- Character creation and updates
- Merge operations
- Lorebook entry modifications

All debug output appears in the browser console (F12).

## Future Enhancements

Potential features for future versions:
- Natural language lorebook format (vs JSON)
- Character relationship graphs
- Export/import character databases
- Multi-chat character synchronization
- Advanced filters and search
- Character preview cards with expandable details

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

### v2.0.0 (Current)
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
