import js from '@eslint/js';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        files: ['src/**/*.js'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                SillyTavern: 'readonly',
                jQuery: 'readonly',
                $: 'readonly',
                toastr: 'readonly',
                console: 'readonly',
                process: 'readonly',
                extension_settings: 'readonly',
                chat_metadata: 'readonly',
                saveSettingsDebounced: 'readonly',
                saveMetadataDebounced: 'readonly',
            },
            ecmaVersion: 2022,
            sourceType: 'module'
        },
        rules: {
            'prefer-const': 'error',
            'no-unused-vars': ['error', { args: 'none', ignoreRestSiblings: true, argsIgnorePattern: '^_' }],
            'no-control-regex': 'off',
            'no-constant-condition': ['error', { checkLoops: false }],
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
            'indent': ['error', 4, { SwitchCase: 1 }],
            'comma-dangle': ['error', 'always-multiline'],
            'eol-last': ['error', 'always'],
            'no-trailing-spaces': 'error',
            // Custom validation rules to prevent method assumption errors
            'no-undef': 'error', // Catch undefined variables/methods
            'no-unused-expressions': ['error', { allowShortCircuit: true }],
            'object-curly-spacing': ['error', 'always'],
            'space-infix-ops': 'error',
        }
    },
    {
        ignores: ['dist/**', 'node_modules/**', 'index.js', 'settings.html', 'style.css']
    }
];