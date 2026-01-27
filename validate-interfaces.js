#!/usr/bin/env node

/**
 * Interface Validation Script
 * 
 * This script validates that all import/export statements match actual interfaces
 * Run before making changes to avoid assumption errors
 */

import fs from 'fs';
import path from 'path';

function findImportExportMismatches(srcDir) {
    const imports = new Map(); // file -> [imported items]
    const exports = new Map(); // file -> [exported items]
    
    console.log('🔍 Scanning for import/export patterns...\n');
    
    // Find all imports
    scanDirectory(srcDir, (filePath, content) => {
        const importMatches = content.matchAll(/import\s*{\s*([^}]+)\s*}\s*from\s*['"`]([^'"`]+)['"`]/g);
        
        for (const match of importMatches) {
            const fullMatch = match[0];
            // Skip commented imports
            const lineStart = content.lastIndexOf('\n', match.index) + 1;
            const lineContent = content.substring(lineStart, match.index);
            if (lineContent.trim().startsWith('//')) {
                continue;
            }
            
            const importedItemsRaw = match[1];
            // Skip imports that look like comments (contain /* or */)
            if (importedItemsRaw.includes('/*') || importedItemsRaw.includes('*/')) {
                continue;
            }
            
            const importedItems = importedItemsRaw.split(',').map(s => s.trim());
            const fromModule = match[2];
            const resolvedPath = resolveModulePath(filePath, fromModule);
            
            if (!imports.has(filePath)) imports.set(filePath, []);
            imports.get(filePath).push({ items: importedItems, from: resolvedPath });
        }
        
        // Find exports
        const exportMatches = content.matchAll(/export\s*{\s*([^}]+)\s*}/g);
        for (const match of exportMatches) {
            const exportedItems = match[1].split(',').map(s => {
                const trimmed = s.trim();
                // Handle "exportName as alias" -> keep alias, handle "source as target" -> keep target
                if (trimmed.includes(' as ')) {
                    return trimmed.split(' as ')[1].trim();
                }
                return trimmed;
            });
            
            if (!exports.has(filePath)) exports.set(filePath, []);
            exports.get(filePath).push(...exportedItems);
        }
        
        // Find export const/function/async function
        const namedExports = content.matchAll(/export\s+(?:async\s+)?(?:const|function|class)\s+(\w+)/g);
        for (const match of namedExports) {
            if (!exports.has(filePath)) exports.set(filePath, []);
            exports.get(filePath).push(match[1]);
        }
    });
    
    // Validate imports against exports
    console.log('⚠️  Import/Export Mismatches:');
    let foundIssues = false;
    
    for (const [file, fileImports] of imports) {
        for (const importGroup of fileImports) {
            const targetFile = importGroup.from;
            const targetExports = exports.get(targetFile) || [];
            
            for (const item of importGroup.items) {
                if (!targetExports.includes(item)) {
                    console.log(`❌ ${path.relative(srcDir, file)}:`);
                    console.log(`   Imports '${item}' from ${path.relative(srcDir, targetFile)}`);
                    console.log(`   But ${path.relative(srcDir, targetFile)} only exports: [${targetExports.join(', ')}]\n`);
                    foundIssues = true;
                }
            }
        }
    }
    
    if (!foundIssues) {
        console.log('✅ No import/export mismatches found!\n');
    }
    
    return { imports, exports };
}

function scanDirectory(dir, callback) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        
        if (file.isDirectory()) {
            scanDirectory(fullPath, callback);
        } else if (file.name.endsWith('.js')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            callback(fullPath, content);
        }
    }
}

function resolveModulePath(fromFile, modulePath) {
    if (modulePath.startsWith('./') || modulePath.startsWith('../')) {
        const resolved = path.resolve(path.dirname(fromFile), modulePath);
        return resolved.endsWith('.js') ? resolved : resolved + '.js';
    }
    return modulePath; // External module
}

// Run validation
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Scan both src/ and tests/ directories
console.log('Validating imports/exports across src/ and tests/...\n');

function scanForValidation(baseDir) {
    const imports = new Map();
    const exports = new Map();
    
    function resolveModulePathRelative(fromFilePath, modulePath) {
        if (modulePath.startsWith('./') || modulePath.startsWith('../')) {
            const resolved = path.resolve(path.dirname(fromFilePath), modulePath);
            const withExt = resolved.endsWith('.js') ? resolved : resolved + '.js';
            return path.relative(baseDir, withExt).replace(/\\/g, '/');
        }
        return modulePath; // External module
    }
    
    function scan(dir, relativePath = '') {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const item of items) {
            const fullPath = path.join(dir, item.name);
            const relPath = path.join(relativePath, item.name).replace(/\\/g, '/');
            
            if (item.isDirectory()) {
                // Skip node_modules, .git, etc.
                if (item.name === 'node_modules' || item.name === '.git' || item.name === 'archive') {
                    continue;
                }
                scan(fullPath, relPath);
            } else if (item.name.endsWith('.js')) {
                const content = fs.readFileSync(fullPath, 'utf-8');
                
                // Extract imports
                const importMatches = content.matchAll(/import\s*{\s*([^}]+)\s*}\s*from\s*['"`]([^'"`]+)['"`]/g);
                for (const match of importMatches) {
                    const lineStart = content.lastIndexOf('\n', match.index) + 1;
                    const lineContent = content.substring(lineStart, match.index);
                    if (lineContent.trim().startsWith('//')) continue;
                    
                    const importedItems = match[1].split(',').map(s => s.trim().split(' as ')[0].trim());
                    const fromModule = match[2];
                    const resolvedPath = resolveModulePathRelative(fullPath, fromModule);
                    
                    if (!imports.has(relPath)) imports.set(relPath, []);
                    imports.get(relPath).push({ items: importedItems, from: resolvedPath });
                }
                
                // Extract exports
                const exportMatches = content.matchAll(/export\s*{\s*([^}]+)\s*}/g);
                for (const match of exportMatches) {
                    const exportedItems = match[1].split(',').map(s => {
                        const trimmed = s.trim();
                        if (trimmed.includes(' as ')) {
                            return trimmed.split(' as ')[1].trim();
                        }
                        return trimmed;
                    });
                    
                    if (!exports.has(relPath)) exports.set(relPath, []);
                    exports.get(relPath).push(...exportedItems);
                }
                
                const namedExports = content.matchAll(/export\s+(?:async\s+)?(?:const|function|class)\s+(\w+)/g);
                for (const match of namedExports) {
                    if (!exports.has(relPath)) exports.set(relPath, []);
                    exports.get(relPath).push(match[1]);
                }
            }
        }
    }
    
    scan(baseDir);
    
    // Validate
    console.log('⚠️  Import/Export Mismatches:');
    let foundIssues = false;
    
    for (const [file, fileImports] of imports) {
        for (const importGroup of fileImports) {
            const targetFile = importGroup.from;
            const targetExports = exports.get(targetFile) || [];
            
            for (const item of importGroup.items) {
                if (!targetExports.includes(item)) {
                    foundIssues = true;
                    console.log(`❌ ${file}:`);
                    console.log(`   Imports '${item}' from ${importGroup.from}`);
                    console.log(`   But ${importGroup.from} only exports: [${targetExports.join(', ')}]`);
                    console.log('');
                }
            }
        }
    }
    
    if (!foundIssues) {
        console.log('✅ All imports match their exports!\n');
    }
}

scanForValidation(__dirname);