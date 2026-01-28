#!/usr/bin/env node

/**
 * Automated Await Fixer
 * 
 * Parses validate-async-await.js output, automatically inserts await keywords
 * at flagged locations, backs up original files, and re-runs validation.
 * 
 * Usage: node scripts/fix-missing-awaits.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');

class AwaitFixer {
    constructor() {
        this.violations = [];
        this.backupDir = path.join(PROJECT_ROOT, '.await-fix-backups');
        this.fixedFiles = new Set();
    }

    /**
     * Run validation script and capture output
     */
    runValidation() {
        console.log('🔍 Running async/await validation...\n');
        
        try {
            const output = execSync('node tests/validate-async-await.js', {
                cwd: PROJECT_ROOT,
                encoding: 'utf-8',
                stdio: ['pipe', 'pipe', 'pipe'],
            });
            
            console.log(output);
            return { success: true, output };
        } catch (error) {
            // Validation failed - parse output for violations
            const output = error.stdout || error.stderr || '';
            console.log(output);
            
            return { success: false, output };
        }
    }

    /**
     * Parse validation output to extract violation details
     */
    parseViolations(output) {
        const lines = output.split('\n');
        let currentViolation = null;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Match error line: ❌ ERROR: src/modules/ui.js:1120
            const errorMatch = line.match(/❌ ERROR: (.+):(\d+)/);
            if (errorMatch) {
                if (currentViolation) {
                    this.violations.push(currentViolation);
                }
                
                currentViolation = {
                    file: errorMatch[1],
                    line: parseInt(errorMatch[2]),
                    func: null,
                    code: null,
                };
                continue;
            }
            
            // Match function line: Function: getSetting() [async - returns Promise]
            const funcMatch = line.match(/Function: (\w+)\(\)/);
            if (funcMatch && currentViolation) {
                currentViolation.func = funcMatch[1];
                continue;
            }
            
            // Match code line: Code: ...
            const codeMatch = line.match(/Code: (.+)/);
            if (codeMatch && currentViolation) {
                currentViolation.code = codeMatch[1].trim();
            }
        }
        
        // Don't forget last violation
        if (currentViolation) {
            this.violations.push(currentViolation);
        }
        
        console.log(`\n📋 Found ${this.violations.length} violations to fix\n`);
        return this.violations.length > 0;
    }

    /**
     * Create backup of file before modifying
     */
    backupFile(filePath) {
        const fullPath = path.join(PROJECT_ROOT, filePath);
        
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
        
        const backupPath = path.join(this.backupDir, filePath.replace(/[/\\]/g, '_'));
        fs.copyFileSync(fullPath, backupPath);
        
        console.log(`💾 Backed up: ${filePath} -> ${backupPath}`);
    }

    /**
     * Attempt to automatically fix a violation by inserting await
     */
    fixViolation(violation) {
        const fullPath = path.join(PROJECT_ROOT, violation.file);
        
        if (!fs.existsSync(fullPath)) {
            console.warn(`⚠️  File not found: ${fullPath}`);
            return false;
        }
        
        // Backup file if not already done
        if (!this.fixedFiles.has(violation.file)) {
            this.backupFile(violation.file);
            this.fixedFiles.add(violation.file);
        }
        
        const content = fs.readFileSync(fullPath, 'utf-8');
        const lines = content.split('\n');
        
        // Line numbers are 1-based, array is 0-based
        const lineIndex = violation.line - 1;
        
        if (lineIndex < 0 || lineIndex >= lines.length) {
            console.warn(`⚠️  Invalid line number: ${violation.line} in ${violation.file}`);
            return false;
        }
        
        const originalLine = lines[lineIndex];
        
        // Find the function call and add await before it
        const funcCallPattern = new RegExp(`\\b${violation.func}\\s*\\(`);
        const match = originalLine.match(funcCallPattern);
        
        if (!match) {
            console.warn(`⚠️  Could not find function call ${violation.func}() on line ${violation.line}`);
            return false;
        }
        
        const callIndex = match.index;
        
        // Check if await already exists (might be a false positive)
        const beforeCall = originalLine.substring(0, callIndex);
        if (/await\s*$/.test(beforeCall)) {
            console.log(`✅ Line ${violation.line} already has await, skipping`);
            return true;
        }
        
        // Insert await before the function call
        const fixedLine = originalLine.substring(0, callIndex) + 'await ' + originalLine.substring(callIndex);
        lines[lineIndex] = fixedLine;
        
        // Write back to file
        fs.writeFileSync(fullPath, lines.join('\n'), 'utf-8');
        
        console.log(`✅ Fixed: ${violation.file}:${violation.line}`);
        console.log(`   Before: ${originalLine.trim()}`);
        console.log(`   After:  ${fixedLine.trim()}\n`);
        
        return true;
    }

    /**
     * Fix all violations
     */
    fixAll() {
        console.log('🔧 Attempting to fix violations...\n');
        
        let successCount = 0;
        let failCount = 0;
        
        for (const violation of this.violations) {
            const success = this.fixViolation(violation);
            if (success) {
                successCount++;
            } else {
                failCount++;
            }
        }
        
        console.log(`\n📊 Results: ${successCount} fixed, ${failCount} failed\n`);
        return failCount === 0;
    }

    /**
     * Restore backups (in case of errors)
     */
    restoreBackups() {
        console.log('🔄 Restoring backups...\n');
        
        if (!fs.existsSync(this.backupDir)) {
            console.log('No backups to restore.');
            return;
        }
        
        const backups = fs.readdirSync(this.backupDir);
        
        for (const backup of backups) {
            const backupPath = path.join(this.backupDir, backup);
            const originalFile = backup.replace(/_/g, path.sep);
            const originalPath = path.join(PROJECT_ROOT, originalFile);
            
            fs.copyFileSync(backupPath, originalPath);
            console.log(`✅ Restored: ${originalFile}`);
        }
        
        console.log('\n✅ All backups restored\n');
    }

    /**
     * Clean up backup directory
     */
    cleanupBackups() {
        if (fs.existsSync(this.backupDir)) {
            fs.rmSync(this.backupDir, { recursive: true, force: true });
            console.log('🧹 Cleaned up backup directory\n');
        }
    }

    /**
     * Main execution flow
     */
    run() {
        console.log('🚀 Automated Await Fixer\n');
        console.log('='.repeat(50) + '\n');
        
        // Step 1: Run validation
        const validationResult = this.runValidation();
        
        if (validationResult.success) {
            console.log('✅ No violations found! Nothing to fix.\n');
            return;
        }
        
        // Step 2: Parse violations
        const hasViolations = this.parseViolations(validationResult.output);
        
        if (!hasViolations) {
            console.log('⚠️  Validation failed but no violations parsed. Manual review needed.\n');
            process.exit(1);
        }
        
        // Step 3: Ask for confirmation
        console.log('⚠️  This script will modify source files!\n');
        console.log('Files to be modified:');
        const uniqueFiles = [...new Set(this.violations.map(v => v.file))];
        uniqueFiles.forEach(f => console.log(`  - ${f}`));
        console.log('\nBackups will be created in .await-fix-backups/\n');
        
        // Auto-proceed for now (in production, could add interactive prompt)
        
        // Step 4: Fix violations
        const allFixed = this.fixAll();
        
        if (!allFixed) {
            console.log('❌ Some fixes failed. Run validation manually to review.\n');
            console.log('To restore backups: node scripts/fix-missing-awaits.js --restore\n');
            process.exit(1);
        }
        
        // Step 5: Re-run validation
        console.log('🔍 Re-running validation to confirm fixes...\n');
        const revalidationResult = this.runValidation();
        
        if (revalidationResult.success) {
            console.log('✅ All violations fixed! Validation passes.\n');
            this.cleanupBackups();
            process.exit(0);
        } else {
            console.log('⚠️  Validation still has issues. Manual review needed.\n');
            console.log('Backups preserved in .await-fix-backups/\n');
            process.exit(1);
        }
    }
}

// Handle command-line arguments
const args = process.argv.slice(2);

if (args.includes('--restore')) {
    const fixer = new AwaitFixer();
    fixer.restoreBackups();
    process.exit(0);
}

// Run the fixer
const fixer = new AwaitFixer();
fixer.run();
