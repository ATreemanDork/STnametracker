# Static Code Validation Guide

This guide documents our **build-time validation system** that catches interface errors and method assumptions **before deployment**. No runtime overhead, maximum reliability.

## 🎯 Philosophy: Static > Runtime

**Static validation** runs during development and build time:
- ✅ **Zero runtime overhead** - production code stays clean
- ✅ **Immediate feedback** - catch issues during development  
- ✅ **Build integration** - prevents broken deployments
- ✅ **CI/CD compatible** - automated validation in pipelines

**Runtime validation** was removed because:
- ❌ **Browser compatibility issues** - Node.js patterns don't work in browser
- ❌ **Performance overhead** - validation runs on every function call
- ❌ **Complexity** - adds unnecessary code to production builds

## 🚀 Quick Start

**Basic validation** (recommended for daily development):
```bash
npm run validate:core  # Interface + method validation + lint
```

**Full validation** (required before deployment):
```bash
npm run validate:strict  # Full validation + build test
```

## 🔧 Available Static Analysis Tools

### 1. Advanced Method Call Validator (`validate-method-calls.js`)
**What it catches**: Calls to non-existent methods with smart suggestions
```bash
npm run validate:methods
```

**Enhanced Detection**:
```javascript
// ❌ This gets caught with suggestion:
stContext.getSillyTavernContext() // → Suggests: getContext()

// ❌ Wrong interface usage:
notifications.notify() // → Suggests: success(), error(), info(), warning()
```

### 2. Import/Export Validator (`validate-interfaces.js`) 
**What it catches**: Mismatched imports and exports
```bash
npm run validate:interfaces
```

### 3. ESLint Integration
**What it catches**: Code quality, undefined variables, unused imports
```bash
npm run lint        # Check issues
npm run lint:fix    # Auto-fix where possible
```

## 🎯 Static Validation Workflow

### During Development
1. **Write code** with immediate IDE feedback  
2. **Run validation frequently**: `npm run validate:core`
3. **Fix issues immediately** - no runtime surprises

### Before Commits  
1. **Pre-commit validation**: `npm run precommit` (runs automatically)
2. **Must pass validation** before commit is allowed
3. **Clean builds ensured** at commit time

### CI/CD Pipeline
Add to your CI configuration:
```yaml
- name: Static Code Validation  
  run: npm run validate:strict
```

### Emergency Development
Quick validation during debugging:
```bash
npm run validate:methods  # Just check method calls
npm run validate:interfaces  # Just check imports/exports
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