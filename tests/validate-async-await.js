#!/usr/bin/env node

/**
 * Async/Await Violation Detector
 * 
 * Finds functions wrapped in withErrorBoundary and detects if they're called
 * without await in places where it matters
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, '..', 'src');
const SKIP_PATTERNS = [
    'updateCharacterList',  // UI-only, fire-and-forget is OK
    'updateStatusDisplay',  // UI-only
];

class AsyncAuditValidator {
    constructor() {
        this.errorBoundaryFunctions = new Map();
        this.violations = [];
        this.warnings = [];
    }

    /**
     * Scan all JS files and find functions wrapped in withErrorBoundary
     */
    scanForAsyncFunctions() {
        console.log('🔍 Scanning for withErrorBoundary wrapped functions...\n');
        
        const jsFiles = this.getAllJSFiles(SRC_DIR);
        
        for (const file of jsFiles) {
            const content = fs.readFileSync(file, 'utf-8');
            const fileName = path.relative(__dirname, file);
            
            // Find function signatures and their withErrorBoundary usage
            const funcPattern = /export\s+(async\s+)?function\s+(\w+)\(([^)]*)\)\s*\{[^}]*?withErrorBoundary/gs;
            const matches = [...content.matchAll(funcPattern)];
            
            for (const match of matches) {
                const isAsync = !!match[1];
                const funcName = match[2];
                this.errorBoundaryFunctions.set(`${fileName}:${funcName}`, {
                    isAsync,
                    file: fileName,
                    name: funcName,
                    line: content.substring(0, match.index).split('\n').length,
                });
            }
        }
        
        console.log(`✅ Found ${this.errorBoundaryFunctions.size} functions wrapped in withErrorBoundary\n`);
        this.errorBoundaryFunctions.forEach((info, key) => {
            console.log(`  - ${key} (line ${info.line})`);
        });
        console.log();
    }

    /**
     * Scan for calls to these functions and check if they're awaited
     */
    detectUnawaited() {
        console.log('🔎 Scanning for unawaited async function calls...\n');
        
        const jsFiles = this.getAllJSFiles(SRC_DIR);
        let issueCount = 0;
        
        for (const file of jsFiles) {
            const content = fs.readFileSync(file, 'utf-8');
            const fileName = path.relative(__dirname, file);
            const lines = content.split('\n');
            
            // Look for function calls without await
            for (const [key, funcInfo] of this.errorBoundaryFunctions.entries()) {
                if (!funcInfo.isAsync) {
                    continue; // Only enforce await on async functions
                }
                const funcName = funcInfo.name;
                
                // Pattern: const/let/var = functionName( or simple functionName(
                const pattern = new RegExp(
                    `(const|let|var)?\\s+(\\w+\\s*=\\s*)?(?<!await\\s)${funcName}\\(`,
                    'g'
                );
                
                for (const match of content.matchAll(pattern)) {
                    // Skip if this is the function definition itself
                    if (match.index === 0 || content[match.index - 1] === '\n' || content[match.index - 8] === 'export') {
                        continue;
                    }
                    
                    const lineNum = content.substring(0, match.index).split('\n').length;
                    const lineContent = lines[lineNum - 1];
                    
                    // Skip if it's being awaited or in a SKIP_PATTERNS list
                    if (lineContent.includes(`await ${funcName}`) || SKIP_PATTERNS.some(p => funcName.includes(p))) {
                        continue;
                    }
                    
                    const isAssignment = match[2] && match[2].includes('=');
                    
                    if (isAssignment) {
                        // Assignment without await is definitely a violation
                        this.violations.push({
                            file: fileName,
                            line: lineNum,
                            func: funcName,
                            code: lineContent.trim(),
                            severity: 'ERROR',
                        });
                        issueCount++;
                    } else if (match[1]) {
                        // Variable declaration without value assignment - might be OK
                        this.warnings.push({
                            file: fileName,
                            line: lineNum,
                            func: funcName,
                            code: lineContent.trim(),
                            severity: 'WARNING',
                        });
                    }
                }
            }
        }
        
        if (this.violations.length > 0 || this.warnings.length > 0) {
            console.log('⚠️  Found potential violations:\n');
            
            this.violations.forEach(v => {
                console.log(`❌ ERROR: ${v.file}:${v.line}`);
                console.log(`   Function: ${v.func}()`);
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
            console.log('✅ No unawaited async function calls detected!\n');
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
