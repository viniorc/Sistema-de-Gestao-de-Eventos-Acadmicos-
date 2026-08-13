import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import parser from '@typescript-eslint/parser';
import plugin from '@typescript-eslint/eslint-plugin';
export default [js.configs.recommended, { files: ['**/*.ts'], languageOptions: { parser, parserOptions: { project: './tsconfig.json' } }, plugins: { '@typescript-eslint': plugin }, rules: { '@typescript-eslint/no-explicit-any': 'error' } }, prettier];
