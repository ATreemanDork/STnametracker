#!/usr/bin/env node

/**
 * Async/Await Violation Detector
 * 
 * Finds functions that return withErrorBoundary (which ALWAYS returns Promise)
 * and detects if they're called without await
 * 
 * KEY INSIGHT: withErrorBoundary is async, so ANY function returning it returns a Promise!
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, '..', 'src');

class AsyncAuditValidator {
    constructor() {
        this.errorBoundaryFunctions = new Map();
        this.violations = [];
        this.warnings = [];
    }

    /**
     * Scan all JS files and find functions that return withErrorBoundary
     * These ALWAYS return Promises regardless of async keyword!
     */
    scanForAsyncFunctions() {
        console.log('🔍 Scanning for functions returning withErrorBoundary...\n');
        
        const jsFiles = this.getAllJSFiles(SRC_DIR);
        
        for (const file of jsFiles) {
            const content = fs.readFileSync(file, 'utf-8');
            const fileName = path.relative(__dirname, file);
            
            // Find ANY function (export or not) that returns withErrorBoundary
            // Pattern: function name() { return withErrorBoundary(...) }
            const funcPattern = /(export\s+)?(async\s+)?function\s+(\w+)\s*\([^)]*\)\s*\{[^}]*?return\s+\w*\.?withErrorBoundary/gs;
            const matches = [...content.matchAll(funcPattern)];
            
            for (const match of matches) {
                const funcName = match[3];
                const lineNum = content.substring(0, match.index).split('\n').length;
                
                this.errorBoundaryFunctions.set(`${fileName}:${funcName}`, {
                    file: fileName,
                    name: funcName,
                    line: lineNum,
                    isExported: !!match[1],
                });
            }
        }
        
        console.log(`✅ Found ${this.errorBoundaryFunctions.size} functions returning withErrorBoundary (all return Promises)\n`);
        this.errorBoundaryFunctions.forEach((info, key) => {
            const exportStr = info.isExported ? '[exported]' : '[internal]';
            console.log(`  - ${key} (line ${info.line}) ${exportStr}`);
        });
        console.log();
    }

    /**
     * Scan for calls to these functions and check if they're awaited
     */
    detectUnawaited() {
        console.log('🔎 Scanning for unawaited Promise-returning function calls...\n');
        
        const jsFiles = this.getAllJSFiles(SRC_DIR);
        let issueCount = 0;
        
        for (const file of jsFiles) {
            const content = fs.readFileSync(file, 'utf-8');
            const fileName = path.relative(__dirname, file);
            const lines = content.split('\n');
            
            // Look for function calls without await
            for (const [key, funcInfo] of this.errorBoundaryFunctions.entries()) {
                const funcName = funcInfo.name;
                
                // Pattern: functionName( without await before it
                const pattern = new RegExp(
                    `(?<!await\\s)${funcName}\\(`,
                    'g'
                );
                
                for (const match of content.matchAll(pattern)) {
                    const lineNum = content.substring(0, match.index).split('\n').length;
                    const lineContent = lines[lineNum - 1].trim();
                    
                    // Skip if this is the function definition itself
                    if (lineContent.startsWith('function ' + funcName) || 
                        lineContent.startsWith('export function ' + funcName) ||
                        lineContent.startsWith('async function ' + funcName) ||
                        lineContent.startsWith('export async function ' + funcName) ||
                        lineContent.startsWith(funcName + '()') || // Class method definition
                        lineContent.startsWith('async ' + funcName + '()')) { // Async class method
                        continue;
                    }
                    
                    // Skip comments
                    if (lineContent.startsWith('//') || 
                        lineContent.startsWith('/*') || 
                        lineContent.startsWith('*')) {
                        continue;
                    }
                    
                    // Skip if it's inside a string (console.log, comments, etc.)
                    // Check if the function call is within quotes
                    const beforeMatch = content.substring(0, match.index);
                    const lastLineStart = beforeMatch.lastIndexOf('\n');
                    const currentLineStart = lastLineStart === -1 ? 0 : lastLineStart + 1;
                    const posInLine = match.index - currentLineStart;
                    
                    // Count quotes before the match on this line
                    const lineUpToMatch = content.substring(currentLineStart, match.index);
                    const singleQuotes = (lineUpToMatch.match(/'/g) || []).length;
                    const doubleQuotes = (lineUpToMatch.match(/"/g) || []).length;
                    const backticks = (lineUpToMatch.match(/`/g) || []).length;
                    
                    // If odd number of quotes before match, it's inside a string
                    if (singleQuotes % 2 === 1 || doubleQuotes % 2 === 1 || backticks % 2 === 1) {
                        continue;
                    }
                    
                    // Skip console.log, debug.log, debugLog statements
                    if (lineContent.includes('console.log') || 
                        lineContent.includes('debug.log') || 
                        lineContent.includes('debugLog')) {
                        continue;
                    }
                    
                    // Skip if it's being awaited (check more broadly)
                    const prevChars = content.substring(Math.max(0, match.index - 10), match.index);
                    if (prevChars.includes('await')) {
                        continue;
                    }
                    
                    // Skip if inside Promise.all (the Promise.all itself is awaited)
                    // Look backwards for Promise.all opening bracket
                    const beforeContext = content.substring(Math.max(0, match.index - 200), match.index);
                    if (beforeContext.includes('Promise.all([') && 
                        !beforeContext.substring(beforeContext.lastIndexOf('Promise.all([')).includes('])')) {
                        continue;
                    }
                    
                    // Check if it's an assignment or direct call
                    const isAssignment = lineContent.includes('=') && lineContent.indexOf('=') < lineContent.indexOf(funcName);
                    const isDirectCall = !isAssignment && lineContent.includes(funcName + '(');
                    
                    // Only flag calls in async contexts (inside other withErrorBoundary functions or async functions)
                    // For now, flag ALL unawaited calls as violations
                    this.violations.push({
                        file: fileName,
                        line: lineNum,
                        func: funcName,
                        code: lineContent,
                        severity: 'ERROR',
                        type: isAssignment ? 'assignment' : 'call',
                    });
                    issueCount++;
                }
            }
        }
        
        if (this.violations.length > 0 || this.warnings.length > 0) {
            console.log('⚠️  Found potential violations:\n');
            
            this.violations.forEach(v => {
                console.log(`❌ ERROR: ${v.file}:${v.line}`);
                console.log(`   Function: ${v.func}() [returns Promise via withErrorBoundary]`);
                console.log(`   Type: ${v.type}`);
                console.log(`   Code: ${v.code}`);
                console.log();
            });
            
            this.warnings.forEach(w => {
                console.log(`⚠️  WARNING: ${w.file}:${w.line}`);
                console.log(`   Function: ${w.func}()`);
                console.log(`   Code: ${w.code}`);
                console.log();
            });
        } else {
            console.log('✅ No unawaited Promise-returning function calls detected!\n');
        }
        
        return this.violations.length === 0;
    }

    /**
     * Get all JS files recursively
     */
    getAllJSFiles(dir) {
        const files = [];
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory() && entry.name !== 'node_modules') {
                files.push(...this.getAllJSFiles(fullPath));
            } else if (entry.isFile() && entry.name.endsWith('.js')) {
                files.push(fullPath);
            }
        }
        
        return files;
    }

    /**
     * Print summary report
     */
    printSummary() {
        console.log('📊 ASYNC/AWAIT AUDIT SUMMARY');
        console.log('============================\n');
        console.log(`Total withErrorBoundary functions: ${this.errorBoundaryFunctions.size}`);
        console.log(`Critical violations found: ${this.violations.length}`);
        console.log(`Warnings found: ${this.warnings.length}`);
        console.log();
        
        if (this.violations.length > 0) {
            console.log('❌ FIX REQUIRED - Critical violations detected!');
            return false;
        } else if (this.warnings.length > 0) {
            console.log('⚠️  Review warnings above');
            return true;
        } else {
            console.log('✅ All async/await patterns are correct!');
            return true;
        }
    }

    /**
     * Run full audit
     */
    run() {
        this.scanForAsyncFunctions();
        const isValid = this.detectUnawaited();
        this.printSummary();
        process.exit(isValid ? 0 : 1);
    }
}

// Run the validator
const validator = new AsyncAuditValidator();
validator.run();
