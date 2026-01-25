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
const srcDir = path.join(__dirname, 'src');
findImportExportMismatches(srcDir);