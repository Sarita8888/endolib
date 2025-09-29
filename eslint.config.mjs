import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  // ignore build artifacts everywhere
  { ignores: ['**/dist/**', '**/node_modules/**'] },

  // base JS rules
  js.configs.recommended,

  // TypeScript rules (works across all packages)
  ...tseslint.configs.recommended,
];
