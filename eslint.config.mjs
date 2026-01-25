import js from '@eslint/js';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        files: ['src/**/*.js'],
        languageOptions: {
            globals: {
                ...globals.browser,
                SillyTavern: 'readonly',
                jQuery: 'readonly',
                $: 'readonly',
                toastr: 'readonly',
                console: 'readonly'
            },
            ecmaVersion: 2022,
            sourceType: 'module'
        },
        rules: {
            'prefer-const': 'error',
            'no-unused-vars': ['error', { args: 'none' }],
            'no-control-regex': 'off',
            'no-constant-condition': ['error', { checkLoops: false }],
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
            'indent': ['error', 4, { SwitchCase: 1 }],
            'comma-dangle': ['error', 'always-multiline'],
            'eol-last': ['error', 'always'],
            'no-trailing-spaces': 'error',
            'object-curly-spacing': ['error', 'always'],
            'space-infix-ops': 'error',
        }
    },
    {
        ignores: ['dist/**', 'node_modules/**', 'index.js', 'settings.html', 'style.css']
    }
];