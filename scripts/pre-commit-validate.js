#!/usr/bin/env node

/**
 * Pre-commit hook to validate interfaces before commits
 * Add this to your package.json scripts and .git/hooks/pre-commit
 */

import { execSync } from 'child_process';
import chalk from 'chalk';

console.log(chalk.blue('🔍 Running pre-commit interface validation...\n'));

const validationSteps = [
    {
        name: 'Interface Validation',
        command: 'node validate-interfaces.js',
        description: 'Checking import/export consistency'
    },
    {
        name: 'Method Call Validation', 
        command: 'node validate-method-calls.js',
        description: 'Scanning for method assumption errors'
    },
    {
        name: 'ESLint Check',
        command: 'npm run lint',
        description: 'Running code quality checks'
    },
    {
        name: 'Build Test',
        command: 'npm run build',
        description: 'Verifying clean build'
    }
];

let hasErrors = false;

for (const step of validationSteps) {
    console.log(chalk.yellow(`⏳ ${step.name}: ${step.description}`));
    
    try {
        execSync(step.command, { 
            stdio: 'inherit', 
            cwd: process.cwd() 
        });
        console.log(chalk.green(`✅ ${step.name} passed\n`));
    } catch (error) {
        console.log(chalk.red(`❌ ${step.name} failed\n`));
        hasErrors = true;
        
        // Don't stop on first error - run all checks
        continue;
    }
}

if (hasErrors) {
    console.log(chalk.red.bold('💥 Pre-commit validation failed!'));
    console.log(chalk.yellow('Fix the issues above before committing.\n'));
    process.exit(1);
} else {
    console.log(chalk.green.bold('🎉 All validations passed! Commit allowed.\n'));
    process.exit(0);
}