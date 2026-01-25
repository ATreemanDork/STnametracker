# Debugging Development Build

## Current State
- Switched to development build for better debugging
- Variables and functions have readable names instead of minified single letters
- Source maps available for detailed error tracking
- Added extensive console logging in lorebook.js module

## Build Commands
- `npm run build` - Production build (minified, ~63 KiB)
- `npm run build:dev` - Development build (unminified, ~261 KiB) 
- `npm run dev` - Development build with watch mode

## Next Steps
1. Load the development build in SillyTavern
2. Check browser console for detailed error messages
3. Console logs will show:
   - Module loading sequence
   - Import validation
   - Function type checking
   - Exact error location with readable names

## After Debugging
Once issues are resolved, switch back to production build for deployment.