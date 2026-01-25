#!/usr/bin/env node

/**
 * Advanced Static Method Call Validator
 * 
 * This script performs comprehensive static analysis to detect method assumption errors
 * BEFORE deployment. No runtime validation needed - all checks happen at build time.
 */

import fs from 'fs';
import path from 'path';

const srcDir = './src';

// Simple logger for validation script
const logger = {
    info: (msg, ...args) => console.log('ℹ️ ', msg, ...args),
    warn: (msg, ...args) => console.warn('⚠️ ', msg, ...args),
    error: (msg, ...args) => console.error('❌', msg, ...args),
    success: (msg, ...args) => console.log('✅', msg, ...args)
};

// Track all exported methods/classes from each module
const moduleExports = new Map();
const methodCalls = [];
const potentialErrors = [];

console.log('🔍 Static Method Call Analysis - Build Time Validation\n');

/**
 * Extract all exports from a JavaScript file
 */
function extractExports(filePath, content) {
    const exports = [];
    
    // Named exports: export { methodName }
    const namedExportMatches = content.matchAll(/export\s*\{\s*([^}]+)\s*\}/g);
    for (const match of namedExportMatches) {
        const exportList = match[1].split(',').map(item => {
            const trimmed = item.trim();
            // Handle "as" aliases: methodName as aliasName
            const asMatch = trimmed.match(/^(\w+)\s+as\s+(\w+)$/);
            return asMatch ? asMatch[2] : trimmed;
        });
        exports.push(...exportList);
    }
    
    // Function exports: export function methodName()
    const funcExportMatches = content.matchAll(/export\s+(?:async\s+)?function\s+(\w+)/g);
    for (const match of funcExportMatches) {
        exports.push(match[1]);
    }
    
    // Const exports: export const methodName = 
    const constExportMatches = content.matchAll(/export\s+const\s+(\w+)\s*=/g);
    for (const match of constExportMatches) {
        exports.push(match[1]);
    }
    
    // Class exports: export class ClassName
    const classExportMatches = content.matchAll(/export\s+class\s+(\w+)/g);
    for (const match of classExportMatches) {
        exports.push(match[1]);
    }
    
    // Default exports with names
    const defaultExportMatches = content.matchAll(/export\s+default\s+(?:class\s+)?(\w+)/g);
    for (const match of defaultExportMatches) {
        exports.push('default');
    }

    return exports;
}

/**
 * Extract all method calls that could be interface assumptions
 */
function extractMethodCalls(filePath, content) {
    const calls = [];
    
    // Pattern: object.methodName( or object.methodName.bind(
    const methodCallPattern = /(\w+)\.(\w+)(?:\(|\.\s*bind\s*\()/g;
    let match;
    
    while ((match = methodCallPattern.exec(content)) !== null) {
        const [fullMatch, objectName, methodName] = match;
        const lineNumber = content.substring(0, match.index).split('\n').length;
        
        calls.push({
            file: filePath,
            line: lineNumber,
            object: objectName,
            method: methodName,
            fullMatch,
            context: getLineContext(content, match.index)
        });
    }
    
    return calls;
}

/**
 * Extract class methods from a class definition
 */
function extractClassMethods(content, className) {
    const methods = [];
    
    // Find the class definition
    const classRegex = new RegExp(`class\\s+${className}\\s*\\{([^}]*)\\}`, 's');
    const classMatch = content.match(classRegex);
    
    if (classMatch) {
        const classBody = classMatch[1];
        
        // Extract method definitions: methodName() { or async methodName() {
        const methodMatches = classBody.matchAll(/(?:async\s+)?(\w+)\s*\([^)]*\)\s*\{/g);
        for (const match of methodMatches) {
            methods.push(match[1]);
        }
    }
    
    return methods;
}

/**
 * Get context around a match for better error reporting
 */
function getLineContext(content, index) {
    const lines = content.split('\n');
    const lineNumber = content.substring(0, index).split('\n').length - 1;
    
    const start = Math.max(0, lineNumber - 1);
    const end = Math.min(lines.length - 1, lineNumber + 1);
    
    return {
        lineNumber: lineNumber + 1,
        context: lines.slice(start, end + 1).join('\n'),
        targetLine: lines[lineNumber]
    };
}

/**
 * Recursively scan directory for JavaScript files
 */
function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            scanDirectory(fullPath);
        } else if (file.endsWith('.js')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const relativePath = path.relative('.', fullPath).replace(/\\/g, '/');
            
            // Extract exports from this module
            const exports = extractExports(relativePath, content);
            moduleExports.set(relativePath, exports);
            
            // Extract method calls
            const calls = extractMethodCalls(relativePath, content);
            methodCalls.push(...calls);
            
            // Extract class methods for class exports
            for (const exportName of exports) {
                if (content.includes(`class ${exportName}`)) {
                    const classMethods = extractClassMethods(content, exportName);
                    if (classMethods.length > 0) {
                        moduleExports.set(`${relativePath}:${exportName}`, classMethods);
                    }
                }
            }
        }
    }
}

/**
 * Analyze imports to build object-to-module mapping
 */
function buildImportMap() {
    const importMap = new Map(); // objectName -> {module, exportName}
    
    for (const [filePath] of moduleExports) {
        // Skip composite keys (file:class patterns)
        if (filePath.includes(':')) continue;
        
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Match import statements: import { name1, name2 } from 'module'
            const importMatches = content.matchAll(/import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]([^'"]+)['"]/g);
            
            for (const match of importMatches) {
                const [, importList, modulePath] = match;
                const imports = importList.split(',').map(item => {
                    const trimmed = item.trim();
                    // Handle aliases: name as alias
                    const asMatch = trimmed.match(/^(\w+)\s+as\s+(\w+)$/);
                    return asMatch ? 
                        { exportName: asMatch[1], localName: asMatch[2] } :
                        { exportName: trimmed, localName: trimmed };
                });
                
                for (const { exportName, localName } of imports) {
                    // Resolve relative imports
                    const resolvedPath = resolveImportPath(filePath, modulePath);
                    importMap.set(`${filePath}:${localName}`, {
                        module: resolvedPath,
                        exportName: exportName
                    });
                }
            }
        } catch (error) {
            logger.warn(`Failed to read ${filePath}:`, error.message);
            continue;
        }
    }
    
    return importMap;
}

/**
 * Resolve relative import paths
 */
function resolveImportPath(fromFile, importPath) {
    if (importPath.startsWith('./') || importPath.startsWith('../')) {
        const fromDir = path.dirname(fromFile);
        let resolved = path.join(fromDir, importPath).replace(/\\/g, '/');
        
        // Add .js extension if missing
        if (!resolved.endsWith('.js')) {
            resolved += '.js';
        }
        
        return resolved;
    }
    return importPath;
}

/**
 * Main validation logic with enhanced static analysis
 */
function validateMethodCalls() {
    logger.info('Static Analysis Summary:');
    console.log(`   📁 Modules scanned: ${moduleExports.size}`);
    console.log(`   🔍 Method calls found: ${methodCalls.length}`);
    console.log(`   🎯 Build-time validation (no runtime overhead)\n`);
    
    const importMap = buildImportMap();
    
    // Enhanced validation with known SillyTavern patterns
    const knownInterfaces = {
        'stContext': {
            methods: ['getContext', 'getChatMetadata', 'getChatId'],
            commonErrors: {
                'getSillyTavernContext': 'getContext',
                'getChatData': 'getChatMetadata'
            }
        },
        'debug': {
            methods: ['log', 'warn', 'error', 'createModuleLogger']
        },
        'settings': {
            methods: [
                // Core settings methods
                'get', 'set', 'getSettings', 'getChatData', 'getSetting', 'setSetting', 'updateSetting', 'updateChatData',
                'saveSettings', 'saveChatData', 'onSettingsChange', 'onChatDataChange', 'onChatChanged',
                'isEnabled', 'isDebugMode', 'getAutoAnalysisConfig', 'getLLMConfig', 'getLorebookConfig',
                'reset', 'getStatus',
                // Character-specific methods
                'getCharacters', 'getCharacter', 'setCharacter', 'removeCharacter', 'clearAllCharacters'
            ]
        },
        'notifications': {
            methods: ['success', 'error', 'info', 'warning']
        }
    };
    
    for (const call of methodCalls) {
        const key = `${call.file}:${call.object}`;
        const importInfo = importMap.get(key);
        
        // Check known interfaces first
        if (knownInterfaces[call.object]) {
            const iface = knownInterfaces[call.object];
            if (!iface.methods.includes(call.method)) {
                const suggestion = iface.commonErrors?.[call.method];
                potentialErrors.push({
                    type: 'known-interface-error',
                    ...call,
                    availableMethods: iface.methods,
                    suggestion
                });
                continue;
            }
        }
        
        if (importInfo) {
            const { module, exportName } = importInfo;
            
            // Check if the module exports this object
            const moduleExportsList = moduleExports.get(module) || [];
            
            if (moduleExportsList.includes(exportName)) {
                // Check if this is a class and if the method exists
                const classMethods = moduleExports.get(`${module}:${exportName}`) || [];
                
                if (classMethods.length > 0 && !classMethods.includes(call.method)) {
                    potentialErrors.push({
                        type: 'method-not-found-in-class',
                        ...call,
                        module,
                        className: exportName,
                        availableMethods: classMethods
                    });
                }
            } else {
                potentialErrors.push({
                    type: 'export-not-found',
                    ...call,
                    module,
                    expectedExport: exportName,
                    availableExports: moduleExportsList
                });
            }
        }
    }
    
    // Report findings with enhanced output
    if (potentialErrors.length === 0) {
        logger.success('No method assumption errors detected!');
        logger.info('All method calls validated successfully');
    } else {
        logger.error(`Found ${potentialErrors.length} potential method assumption errors:`);
        
        for (const error of potentialErrors) {
            console.log(`\n❌ ${error.file}:${error.line}`);
            console.log(`   Call: ${error.object}.${error.method}()`);
            console.log(`   Code: ${error.context.targetLine.trim()}`);
            
            if (error.suggestion) {
                console.log(`   💡 Suggestion: Use '${error.suggestion}' instead of '${error.method}'`);
            }
            
            if (error.type === 'method-not-found-in-class') {
                console.log(`   Issue: Method '${error.method}' not found in class '${error.className}'`);
                console.log(`   Available methods: ${error.availableMethods.join(', ')}`);
            } else if (error.type === 'export-not-found') {
                console.log(`   Issue: Export '${error.expectedExport}' not found in ${error.module}`);
                console.log(`   Available exports: ${error.availableExports.join(', ')}`);
            } else if (error.type === 'known-interface-error') {
                console.log(`   Issue: Method '${error.method}' not available on known interface`);
                console.log(`   Available methods: ${error.availableMethods.join(', ')}`);
            }
        }
    }
    
    return potentialErrors.length;
}

// Run the validation
try {
    scanDirectory(srcDir);
    const errorCount = validateMethodCalls();
    
    console.log('\n' + '='.repeat(60));
    if (errorCount === 0) {
        logger.success('All method calls validated successfully!');
        logger.info('✓ Static analysis complete - ready for deployment');
    } else {
        logger.error(`Build should fail - found ${errorCount} method issues`);
        logger.warn('Fix these issues before deployment');
    }
    
    process.exit(errorCount);
} catch (error) {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
}