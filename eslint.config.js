import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Allow the conventional "_" prefix for deliberately unused bindings, and
      // the `const { omitted, ...rest } = obj` pattern used to strip fields
      // from request payloads.
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    // Modules that intentionally export things other than components. The
    // react-refresh rule only guards HMR granularity, which does not apply to
    // route tables, constants, data builders, or shadcn/ui variant exports.
    files: [
      'src/router/**/*.{ts,tsx}',
      'src/constants/**/*.{ts,tsx}',
      'src/components/ui/**/*.{ts,tsx}',
      'src/**/*.data.{ts,tsx}',
      'src/**/*Helper.{ts,tsx}',
    ],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
