#!/usr/bin/env node

/**
 * Pre-commit hook to validate interfaces before commits
 * Add this to your package.json scripts and .git/hooks/pre-commit
 */

import { execSync } from 'child_process';
import chalk from 'chalk';

console.log(chalk.blue('🔍 Running pre-commit validation...\n'));

const validationSteps = [
    {
        name: 'Interface Validation',
        command: 'node validate-interfaces.js',
        description: 'Checking import/export consistency',
        blocking: true,
    },
    {
        name: 'Async/Await Validation',
        command: 'node tests/validate-async-await.js',
        description: 'Checking for unawaited Promise calls',
        blocking: true,
    },
    {
        name: 'Method Call Validation', 
        command: 'node tests/validate-method-calls.js',
        description: 'Scanning for method assumption errors',
        blocking: true,
    },
    {
        name: 'ESLint Check',
        command: 'npm run lint',
        description: 'Running code quality checks',
        blocking: false,
    },
    {
        name: 'Build Test',
        command: 'npm run build',
        description: 'Verifying clean build',
        blocking: true,
    }
];

let hasErrors = false;
let hasBlockingErrors = false;

for (const step of validationSteps) {
    console.log(chalk.yellow(`⏳ ${step.name}: ${step.description}`));
    
    try {
        execSync(step.command, { 
            stdio: 'inherit', 
            cwd: process.cwd() 
        });
        console.log(chalk.green(`✅ ${step.name} passed\n`));
    } catch (error) {
        const severity = step.blocking ? 'BLOCKING' : 'WARNING';
        console.log(chalk.red(`❌ ${step.name} failed [${severity}]\n`));
        
        hasErrors = true;
        if (step.blocking) {
            hasBlockingErrors = true;
        }
        
        // Don't stop on first error - run all checks
        continue;
    }
}

if (hasBlockingErrors) {
    console.log(chalk.red.bold('🚫 Pre-commit validation BLOCKED!'));
    console.log(chalk.yellow('Fix BLOCKING errors above before committing.\n'));
    process.exit(1);
} else if (hasErrors) {
    console.log(chalk.yellow.bold('⚠️  Pre-commit validation has warnings'));
    console.log(chalk.yellow('Review warnings above, but commit is allowed.\n'));
    process.exit(0);
} else {
    console.log(chalk.green.bold('✅ All pre-commit checks passed!\n'));
    process.exit(0);
}
    process.exit(1);
} else {
    console.log(chalk.green.bold('🎉 All validations passed! Commit allowed.\n'));
    process.exit(0);
}
