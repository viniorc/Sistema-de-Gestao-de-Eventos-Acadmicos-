import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import parser from '@typescript-eslint/parser';
import plugin from '@typescript-eslint/eslint-plugin';
export default [
  { ignores: ['dist/**', 'coverage/**', 'node_modules/**', 'generated/**'] },
  js.configs.recommended,
  { files: ['**/*.ts'], languageOptions: { parser }, plugins: { '@typescript-eslint': plugin }, rules: { 'no-undef': 'off', 'no-unused-vars': 'off', '@typescript-eslint/no-explicit-any': 'error', '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }] } },
  prettier,
];
