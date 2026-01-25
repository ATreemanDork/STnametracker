# Proactive Error Detection Guide

This guide documents all the mechanisms we've put in place to catch method assumption errors **before** they cause runtime failures.

## 🚀 Quick Start

Run all validations at once:
```bash
npm run validate:all
```

## 🔧 Available Tools

### 1. Advanced Interface Validation (`validate-method-calls.js`)
**What it catches**: Calls to methods that don't exist in their target objects
```bash
npm run validate:methods
```

**Example Detection**:
```javascript
// ❌ This would be caught:
stContext.getSillyTavernContext() // Method doesn't exist

// ✅ Correct:  
stContext.getContext() // Method exists
```

### 2. Import/Export Validation (`validate-interfaces.js`)
**What it catches**: Mismatched imports and exports
```bash
npm run validate:interfaces
```

### 3. ESLint Integration
**What it catches**: Undefined variables and common patterns
```bash
npm run lint
```

### 4. Runtime Validation (Development)
**What it catches**: Method calls during development with helpful errors

```javascript
// Add to any module for development validation:
import { createSafeWrapper, validateInterface } from '../utils/runtime-validation.js';

// Wrap objects with validation
const safeContext = createSafeWrapper(stContext, 'stContext', ['getContext', 'getChatMetadata']);

// Validate interfaces upfront
validateInterface(stContext, ['getContext', 'getChatMetadata'], 'SillyTavernContext');
```

### 5. Pre-commit Hooks
**What it prevents**: Committing code with interface errors
```bash
npm run precommit
```

## 🎯 Validation Workflow

### During Development
1. **Write code** with your IDE providing basic syntax checking
2. **Run validation** frequently: `npm run validate`
3. **Use runtime wrappers** for immediate feedback during development

### Before Commits
1. **Pre-commit validation** runs automatically: `npm run precommit`
2. **Fixes required** before commit is allowed
3. **Clean builds** ensured

### Continuous Integration
Add to your CI pipeline:
```yaml
- name: Validate Interfaces
  run: npm run validate:all
```

## 🐛 Types of Errors Detected

### Method Assumption Errors
```javascript
// ❌ Wrong method name
obj.getSillyTavernContext()

// ❌ Method doesn't exist in class
myClass.nonExistentMethod()

// ❌ Wrong object reference
wrongObject.validMethod()
```

### Import/Export Mismatches
```javascript
// ❌ Importing non-existent export
import { nonExistentFunction } from './module.js';

// ❌ Wrong import path
import { validFunction } from './wrong-path.js';
```

### Interface Violations
```javascript
// ❌ Missing required methods
class MyClass {
  // Missing expected method
}

// ❌ Wrong method signatures
function expectedMethod(param1, param2) {
  // Should have 3 parameters
}
```

## 🔍 Adding Custom Validations

### 1. Extend Method Call Validator
Edit `validate-method-calls.js` to add your specific validation rules:

```javascript
// Add to knownMethods object
const knownMethods = {
    'yourObject': ['method1', 'method2'],
    'anotherObject': ['methodA', 'methodB']
};
```

### 2. Create Custom ESLint Rules
Add rules to `eslint-rules/no-undefined-methods.js`:

```javascript
// Add specific pattern detection
if (methodName === 'yourProblematicMethod') {
    context.report({
        node,
        message: `Method '${methodName}' is deprecated. Use 'newMethod' instead.`
    });
}
```

### 3. Runtime Validation
Add interface contracts to your modules:

```javascript
// At module level
import { validateInterface } from '../utils/runtime-validation.js';

export function initializeModule(dependencies) {
    // Validate all dependencies have required methods
    validateInterface(dependencies.context, ['getContext', 'getChatMetadata']);
    validateInterface(dependencies.settings, ['get', 'set', 'save']);
    
    // Continue with initialization
}
```

## 📊 Monitoring and Metrics

### Validation Reports
All tools provide detailed reports:

```
🔍 Scanning for method assumption errors...

📊 Analysis Summary:
   📁 Modules scanned: 12
   🔍 Method calls found: 47

✅ No method assumption errors detected!
```

### Error Details
When issues are found:

```
❌ src/modules/lorebook.js:27
   Call: stContext.getSillyTavernContext()
   Issue: Method 'getSillyTavernContext' not found in class 'SillyTavernContext'
   Available methods: getContext, getChatMetadata, getChatId
```

## 🎯 Best Practices

### 1. Run Validations Frequently
- **Before major refactoring**: `npm run validate:all`
- **After adding dependencies**: `npm run validate:interfaces`
- **When in doubt**: `npm run validate`

### 2. Use Runtime Validation in Development
```javascript
// Wrap external dependencies 
const safeExternal = createSafeWrapper(externalLib, 'ExternalLib');

// Enable method call logging
const loggedObj = createMethodLogger(myObject, 'MyObject');
```

### 3. Keep Validations Updated
- **Add new objects** to validation configs as you create them
- **Update method lists** when APIs change
- **Review validation rules** during code reviews

## 🚨 Emergency Recovery

If validations fail unexpectedly:

1. **Check recent changes**: `git diff HEAD~1`
2. **Run individual validators**: 
   - `npm run validate:interfaces`
   - `npm run validate:methods` 
   - `npm run lint`
3. **Review error messages** for specific file/line references
4. **Use runtime validation** to debug dynamically

Remember: **Validation failures in CI prevent broken deployments** - this is a feature, not a bug!