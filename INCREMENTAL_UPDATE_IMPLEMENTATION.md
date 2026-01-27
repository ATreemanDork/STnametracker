# Incremental Character Update Implementation

## Overview
Implemented incremental character update strategy where the LLM receives existing character information in lorebook format and returns only changed/new characters, reducing redundant processing and improving efficiency.

## Implementation Date
January 26, 2026

## Changes Made

### 1. System Prompt Update (`src/modules/llm.js`)

**DEFAULT_SYSTEM_PROMPT** now includes:
- New `[CURRENT LOREBOOK ENTRIES]` section with `{{CHARACTER_ROSTER}}` template placeholder
- Instructions to only return characters mentioned in new messages or with updated information
- Explicit instruction NOT to repeat unchanged characters from the Current Lorebook Entries
- Template replacement pattern for injecting existing character data

### 2. Character Roster Builder Rewrite (`src/modules/llm.js`)

**buildCharacterRoster()** function completely rewritten:
- **Old behavior**: Returned simple list of character names with aliases and relationships
- **New behavior**: Returns lorebook-formatted content for each character
  - Keys array (preferredName + aliases)
  - Formatted content sections matching lorebook entry format:
    - Age (Physical/Mental)
    - Physical Description
    - Personality
    - Sexuality
    - Race/Ethnicity
    - Role & Skills
    - Relationships
- Returns "(None - this is the first analysis)" when no characters exist yet

### 3. Prompt Template Injection (`src/modules/llm.js`)

Updated `callLLMAnalysis()` function:
- Changed from appending roster to system prompt
- Now uses template replacement: `systemPrompt.replace('{{CHARACTER_ROSTER}}', rosterStr)`
- Ensures character context is properly positioned within instructions

### 4. Batch Size Configuration

**Confirmed batch window configuration:**
- Default: 10 messages (`messageFrequency` in settings)
- User-configurable via settings UI (1-100 range)
- Located in [settings.html](settings.html) line 29
- Used in `processNewMessage()` to trigger analysis

## Expected Behavior Changes

### Before (Full Roster Strategy)
1. LLM receives simple name list of known characters
2. LLM returns ALL characters mentioned in messages, including known ones
3. Requires processing and merging of unchanged character data
4. Potential for redundant character entries in response

### After (Incremental Update Strategy)
1. LLM receives detailed lorebook entries for ALL known characters
2. LLM returns ONLY characters with new/changed information
3. Reduces response size and processing overhead
4. Eliminates redundant character data in responses
5. Better context for the LLM to identify character continuity

## Testing Recommendations

1. **First Analysis Test**: Verify "(None - this is the first analysis)" appears in initial prompt
2. **Incremental Update Test**: After first character extraction, verify subsequent analyses include lorebook-formatted character data
3. **Character Recognition Test**: Verify LLM correctly identifies existing characters and doesn't duplicate them
4. **Update Detection Test**: Verify LLM returns characters when new information is mentioned
5. **No-Change Test**: Verify LLM returns empty or minimal response when no character updates exist in messages

## Rollback Strategy

If issues arise:
1. Revert `buildCharacterRoster()` to return simple name list
2. Revert `DEFAULT_SYSTEM_PROMPT` to remove `[CURRENT LOREBOOK ENTRIES]` section
3. Revert prompt injection to use append pattern instead of template replacement

## Related Files

- [src/modules/llm.js](src/modules/llm.js) - Core implementation
- [settings.html](settings.html) - Batch size configuration UI
- [src/modules/processing.js](src/modules/processing.js) - Message batch processing (calls buildCharacterRoster)
- [prompt_edits.md](prompt_edits.md) - Original design document

## Performance Considerations

**Expected Improvements:**
- Reduced LLM response size (fewer characters returned)
- Reduced merge processing overhead
- Reduced duplicate character entry risk
- Better prompt token utilization (context vs redundant output)

**Potential Concerns:**
- Increased prompt token count due to detailed character context
- LLM may still hallucinate unchanged characters if not following instructions
- Requires LLM to understand "only return changes" instruction

## Retry Strategy

Current retry strategy **maintained** (no changes):
- 2 retries with 2-second delay on parse failures
- JSON validation and error recovery
- Located in `callSillyTavern()` function

## Future Enhancements

Potential improvements for consideration:
1. Add token count logging for roster vs response sizes
2. Implement A/B testing to compare full vs incremental strategies
3. Add metrics tracking for character duplicate detection
4. Consider adaptive prompting based on LLM compliance with instructions
5. Add validation to ensure LLM doesn't return unchanged characters
