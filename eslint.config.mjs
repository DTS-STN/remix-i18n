import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const compat = new FlatCompat({ baseDirectory: import.meta.name });

export default tseslint.config(
  { ignores: ['build/', 'coverage/', 'tmp/'] },
  {
    //
    // base config
    //
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2023,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        projectService: true,
        tsconfigRootDir: import.meta.name,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  {
    //
    // non-typescript
    //
    files: ['**/*.{js,cjs,mjs}'],
    extends: [eslint.configs.recommended],
  },
  {
    //
    // typescript
    //
    files: ['**/*.{ts,tsx}'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.strict,
      ...fixupConfigRules(compat.config(importPlugin.configs.recommended)),
    ],
    rules: {
      'no-param-reassign': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      // Rule: @typescript-eslint/require-await
      // Note: you must disable the base rule as it can report incorrect errors
      // https://typescript-eslint.io/rules/require-await/#how-to-use
      'require-await': 'off',
      '@typescript-eslint/require-await': 'error',

      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },
  {
    //
    // react
    //
    files: ['**/*.tsx'],
    extends: [
      ...compat.config(jsxA11yPlugin.configs.recommended),
      ...fixupConfigRules(compat.config(reactPlugin.configs.recommended)),
      ...fixupConfigRules(compat.config(reactPlugin.configs['jsx-runtime'])),
      ...fixupConfigRules(compat.config(reactHooksPlugin.configs.recommended)),
    ],
    rules: {
      'react/no-unknown-property': [
        'error',
        { ignore: ['property', 'resource', 'typeof', 'vocab'] },
      ],
      'react/prop-types': 'off',
    },
    settings: {
      formComponents: ['Form'],
      linkComponents: [
        { name: 'Link', linkAttribute: 'to' },
        { name: 'NavLink', linkAttribute: 'to' },
      ],
      react: {
        version: 'detect',
      },
    },
  },
);

//   //
//   // Base config
//   //
//   extends: ['eslint:recommended'],
//   overrides: [
//     // React
//     {
//       files: ['**/*.{js,jsx,ts,tsx}'],
//       plugins: ['react', 'jsx-a11y'],
//       extends: [
//         'plugin:react/recommended',
//         'plugin:react/jsx-runtime',
//         'plugin:react-hooks/recommended',
//         'plugin:jsx-a11y/recommended',
//       ],
//       settings: {
//         react: {
//           version: 'detect',
//         },
//         formComponents: ['Form'],
//         linkComponents: [
//           { name: 'Link', linkAttribute: 'to' },
//           { name: 'NavLink', linkAttribute: 'to' },
//         ],
//         'import/resolver': {
//           typescript: {},
//         },
//       },
//     },
//     //
//     // Typescript
//     //
//     {
//       files: ['**/*.{ts,tsx}'],
//       plugins: ['@typescript-eslint', 'import'],
//       parser: '@typescript-eslint/parser',
//       settings: {
//         'import/internal-regex': '^~/',
//         'import/resolver': {
//           node: {
//             extensions: ['.ts', '.tsx'],
//           },
//           typescript: {
//             alwaysTryTypes: true,
//           },
//         },
//       },
//       rules: {
//         '@typescript-eslint/no-unused-vars': [
//           'error',
//           { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
//         ],
//       },
//       extends: [
//         'plugin:@typescript-eslint/recommended',
//         'plugin:import/recommended',
//         'plugin:import/typescript',
//       ],
//     },
//     //
//     // Node
//     //
//     {
//       files: ['.eslintrc.cjs'],
//       env: {
//         node: true,
//       },
//     },
//   ],
// };
