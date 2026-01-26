# Testing & Validation Scripts

This directory contains scripts for validating code quality and integrity of the Name Tracker extension.

## Available Scripts

### validate-interfaces.js
**Purpose:** Ensure all module imports/exports match correctly  
**Location:** Root directory (actively used during development)  
**Usage:** 
```bash
node validate-interfaces.js
```
**Checks:**
- All import statements reference exported items
- Export names match exactly (case-sensitive)
- No circular dependencies
- All bindings reference valid methods

**When to run:** Before making import/export changes

---

### validate-async-await.js
**Purpose:** Verify async/await patterns are correct throughout codebase  
**Location:** `tests/validate-async-await.js`  
**Usage:**
```bash
node tests/validate-async-await.js
```
**Checks:**
- All `withErrorBoundary()` calls are properly awaited
- Async function invocations use await
- Promise chains are properly handled
- No missing async/await keywords

**When to run:** After adding new functions with error boundaries

---

### validate-method-calls.js
**Purpose:** Check that method signatures match how they're invoked  
**Location:** `tests/validate-method-calls.js`  
**Usage:**
```bash
node tests/validate-method-calls.js
```
**Checks:**
- Methods exist before being called
- Method parameters match invocation
- Class methods are properly bound
- No undefined method references

**When to run:** Before committing code changes

---

### pre-commit-validate.js (Git Hook)
**Purpose:** Automatically validate code before commits  
**Location:** `tests/hooks/pre-commit-validate.js`  
**Setup:**
```bash
# Create symlink in .git/hooks
mklink .git\hooks\pre-commit tests\hooks\pre-commit-validate.js
```
**Checks:** Runs all three validation scripts above

**When:** Automatically before each git commit

---

## Running All Validations

```bash
# Individual scripts
node tests/validate-async-await.js
node tests/validate-method-calls.js
node validate-interfaces.js

# Or use npm script (add to package.json):
npm run validate:all
```

---

## Integration with Development Workflow

1. **During Development:** Run individual script when you make related changes
2. **Before Commit:** All checks run automatically via git hook
3. **In CI/CD:** Add `npm run validate:all` to pipeline (if configured)

---

## Quick Validation Checklist

- [ ] Run `node validate-interfaces.js` - all interfaces match
- [ ] Run `node tests/validate-async-await.js` - all async calls awaited
- [ ] Run `node tests/validate-method-calls.js` - all methods exist
- [ ] `npm run build` succeeds
- [ ] No webpack errors or warnings

---

## Troubleshooting

**Script hangs:** Check for circular dependencies or infinite loops in error boundaries  
**False positives:** Some dynamic require patterns may be flagged - review carefully  
**Missing exports:** Ensure ES6 module syntax is used: `export function` or `export const`
