// @ts-check
import eslint from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig(
    eslint.configs.recommended,
    tseslint.configs.recommended,

    {
        ignores: [
            'dist/**',
            'scripts/**',
            'tests/**',
            'coverage/**',
            'node_modules/**',
            'eslint.config.mjs',
            'jest.config.ts',
            '**/*.spec.ts',
            '**/*.test.ts',
        ],
    },

    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },

        rules: {
            'no-console': 'error',
            'dot-notation': 'error',

            // ----- FIX UNSAFE ERRORS -----
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',

            // Practical relax
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/require-await': 'off',
        },
    },
)
