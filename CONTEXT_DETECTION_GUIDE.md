# Context Size Detection - Complete Diagnostic Guide

## Current Status

✅ **Build succeeded** with improved error handling and 6 different detection methods

## What Changed

The `getMaxPromptLength()` function now:

1. **Wraps everything in try/catch** - Won't crash if anything fails
2. **Tries 6 different paths** - Maximum chance of finding the correct value:
   - `context.maxContext` (most common)
   - `context.extensionSettings.common.maxContext`
   - `context.chat.maxContextSize`
   - `context.token_limit`
   - `context.amount_gen` (with estimation)
   - `context.settings.max_context`

3. **Validates detected values** - Only accepts numbers > 100
4. **Falls back gracefully** - Uses 4096 tokens if nothing found
5. **Logs everything** - Check console with Debug Mode enabled

## How to Diagnose

### Step 1: Load the Diagnostic HTML
1. Open `CONTEXT_DIAGNOSTIC.html` in your browser (alongside SillyTavern)
2. This file contains 6 test scripts you can run in the console

### Step 2: Run Tests in Order

**Test 1: Full Context**
```javascript
const ctx = SillyTavern.getContext();
console.log('=== FULL CONTEXT OBJECT ===');
console.log(ctx);
console.log('=== CONTEXT KEYS ===');
console.log(Object.keys(ctx).sort());
```

**Test 2: Check All Paths**
```javascript
const ctx = SillyTavern.getContext();
console.log('=== PATH DETECTION ===');
console.log('1. ctx.maxContext:', ctx.maxContext);
console.log('2. ctx.extensionSettings?.common?.maxContext:', ctx.extensionSettings?.common?.maxContext);
console.log('3. ctx.chat?.maxContextSize:', ctx.chat?.maxContextSize);
console.log('4. ctx.token_limit:', ctx.token_limit);
console.log('5. ctx.amount_gen:', ctx.amount_gen);
console.log('6. ctx.max_context:', ctx.max_context);
console.log('7. ctx.context_size:', ctx.context_size);
```

**Test 3: Deep Search**
```javascript
const ctx = SillyTavern.getContext();
console.log('=== SEARCHING FOR ANY MAX/TOKEN PROPERTIES ===');

function findAll(obj, depth = 0, maxDepth = 2, visited = new Set()) {
    if (depth > maxDepth || visited.has(obj)) return;
    if (obj === null || typeof obj !== 'object') return;
    
    visited.add(obj);
    
    for (const key of Object.keys(obj)) {
        if (key.toLowerCase().includes('max') || 
            key.toLowerCase().includes('context') || 
            key.toLowerCase().includes('token')) {
            console.log(`${'  '.repeat(depth)}${key}:`, obj[key]);
        }
        
        if (depth < maxDepth && typeof obj[key] === 'object' && obj[key] !== null) {
            try {
                findAll(obj[key], depth + 1, maxDepth, visited);
            } catch(e) {
                // skip circular references
            }
        }
    }
}

findAll(ctx);
```

### Step 3: Check Extension Logs

With **Debug Mode enabled**:

1. Open Name Tracker settings
2. Enable "Debug Mode"
3. Run an analysis action
4. Check console for logs like:

```
[STnametracker:LLM] Method 1 SUCCESS (context.maxContext): 8192
```

Or if all fail:

```
[STnametracker:LLM] WARNING: Could not detect maxContext from any path, using fallback (4096)
[STnametracker:LLM] Full context object keys: [list of available keys]
```

## What to Look For

### Success Indicators
- One of the 6 methods logs `SUCCESS`
- A numeric value between 2000-32000
- Messages like `Detected maxContext: XXXX`

### Fallback Indicators  
- `WARNING: Could not detect maxContext`
- Using default 4096
- Messages like `Using fallback`

### Critical Information to Share
If the detection fails:

1. **All available context keys**: From the debug log or test output
2. **Which paths you checked**: From Test 2 output
3. **Deep search results**: From Test 3 output
4. **Any numeric values found**: Between 1000-50000

## Current Detection Chain

```
SillyTavern.getContext()
    ↓ Try Method 1
context.maxContext?
    ↓ Try Method 2
context.extensionSettings.common.maxContext?
    ↓ Try Method 3
context.chat.maxContextSize?
    ↓ Try Method 4
context.token_limit?
    ↓ Try Method 5
context.amount_gen (estimate)?
    ↓ Try Method 6
context.settings.max_context?
    ↓ Validate & Return
Return maxContext or fallback to 4096
```

## Error Handling

Even if detection fails completely:

- ✅ Extension won't crash
- ✅ Uses conservative 4096 token default
- ✅ All features still work
- ✅ Logs indicate what happened

## Next Steps

1. **Run the diagnostic tests** from CONTEXT_DIAGNOSTIC.html
2. **Enable debug mode** in Name Tracker settings
3. **Trigger an analysis** to see which method succeeded
4. **Share the results** if you want further optimization

## Expected Output Examples

### Success Case
```
[STnametracker:LLM] 7:15:23 PM Method 1 SUCCESS (context.maxContext): 8192
[STnametracker:LLM] 7:15:23 PM Detected maxContext: 8192 (type: number)
[STnametracker:LLM] 7:15:23 PM Token allocation: maxContext=8192, reserved=3048, available=5144
```

### Fallback Case
```
[STnametracker:LLM] 7:15:23 PM WARNING: Could not detect maxContext from any path, using fallback (4096)
[STnametracker:LLM] 7:15:23 PM Token allocation: maxContext=4096, reserved=3048, available=1048
```

## Technical Notes

- The function is async and properly awaited
- Error boundaries prevent extension crashes
- Detection happens every time analysis runs (allows dynamic API changes)
- Multiple fallback strategies ensure something always works
- Validation prevents invalid context values

## Questions?

If detection still fails after testing:

1. Check which test found a numeric value
2. Note exactly which path returned the value
3. Share the console output
4. Mention your SillyTavern version if known
