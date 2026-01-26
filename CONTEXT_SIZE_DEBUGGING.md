# SillyTavern Context Size Detection - Debugging Guide

## Current Implementation

The extension now tries **4 different methods** to get the max context size from SillyTavern:

```javascript
// Method 1: Direct maxContext property
context.maxContext

// Method 2: Via extensionSettings
context.extensionSettings.common.maxContext

// Method 3: Via chat object
context.chat.maxContextSize

// Method 4: Token limit
context.token_limit
```

Each attempt logs which method succeeded, so you can see in the console which path is correct.

## How to Debug

### Step 1: Enable Debug Mode
1. Open Name Tracker settings panel
2. Enable "Debug Mode"
3. Open browser console (F12)

### Step 2: Trigger Context Size Detection
Run one of these actions:
- Click "Analyze Last X Messages"
- Click "Scan Entire Chat"
- Wait for auto-analysis (if enabled)

### Step 3: Check Console Output
Look for logs like:
```
[Name Tracker Debug] Available context properties: maxContext, chat, ...
[Name Tracker Debug] Method 1 (context.maxContext): 4096
[Name Tracker Debug] Detected maxContext: 4096 (type: number)
```

Or if it's failing:
```
[Name Tracker Debug] Available context properties: [list of what exists]
[Name Tracker Debug] WARNING: Could not detect maxContext from any path, using fallback (4096)
[Name Tracker Debug] Full context object keys: [all available keys]
```

## What to Look For

### Success Scenario
You should see output like:
```
[Name Tracker] Method X (context.path.to.maxContext): 8192
[Name Tracker] Detected maxContext: 8192 (type: number)
[Name Tracker] Token allocation: maxContext=8192, reserved=X, available=Y
```

### Failure Scenario
If all methods fail, you'll see:
```
[Name Tracker] WARNING: Could not detect maxContext from any path, using fallback (4096)
[Name Tracker] Available context properties: [these are what actually exist]
```

In this case, look at what properties ARE available and provide that list for further investigation.

## If None of the 4 Methods Work

If none of the methods detect the context size, you need to provide:

1. **Full list of available properties** - Copy from the console log:
   ```
   Available context properties: [list shown in console]
   ```

2. **What actually exists** - From the log:
   ```
   Full context object keys: [all keys shown]
   ```

3. **Browser console test** - Run in the browser console (F12):
   ```javascript
   const context = SillyTavern.getContext();
   console.log('Full context object:', context);
   console.log('Max context properties:', {
       maxContext: context.maxContext,
       tokenLimit: context.token_limit,
       extensionSettings: context.extensionSettings?.common?.maxContext,
       chatMax: context.chat?.maxContextSize
   });
   ```

## Expected Outputs by LLM Source

### For SillyTavern LLM (OpenAI, Claude, etc.)
Should show one of these paths working:
- `context.maxContext` (most common)
- `context.extensionSettings.common.maxContext`
- `context.chat.maxContextSize`

### For Ollama
Should use Ollama's model context size directly (fetched from Ollama API, not SillyTavern context).

## Building with New Detection

The code has been rebuilt with multi-method detection:

```
webpack 5.104.1 compiled successfully in 200 ms
```

The updated extension is ready to test.

## Console Filtering

To see ONLY Name Tracker context-related logs, filter the console:
```
[Name Tracker] getMaxPromptLength
```

Or search for specific methods:
- `Method 1` - For direct maxContext
- `Method 2` - For extensionSettings path
- `Method 3` - For chat.maxContextSize
- `Method 4` - For token_limit
- `WARNING: Could not detect` - If all methods fail

## Next Steps After Testing

1. **If detection succeeds**: Note which method worked
2. **If detection fails**: Provide the console logs showing:
   - What properties exist
   - What values they contain
   - Current SillyTavern version (if known)

Then we can either:
- Add the correct path as a new method
- Switch to a hardcoded default if detection is unreliable
- Use a different strategy (e.g., user-configurable settings)
