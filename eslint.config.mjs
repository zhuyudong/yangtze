// @ts-nocheck

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { fixupPluginRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import markdownPlugin from '@eslint/markdown'
import htmlPlugin from 'eslint-plugin-html'
import jsdocPLugin from 'eslint-plugin-jsdoc'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
// NOTE: ...reactPlugin.configs['jsx-runtime'].rules
// import reactJsxRuntime from 'eslint-plugin-react/configs/jsx-runtime.js'
// NOTE: ...reactPlugin.configs.recommended.rules
// import reactRecommended from 'eslint-plugin-react/configs/recommended.js'
// import checkFilePlugin from 'eslint-plugin-check-file'
import mochaPlugin from 'eslint-plugin-mocha'
import playwrightPlugin from 'eslint-plugin-playwright'
import prettierPlugin from 'eslint-plugin-prettier/recommended'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort'
import storybookPlugin from 'eslint-plugin-storybook'
import tailwindPlugin from 'eslint-plugin-tailwindcss'
import unusedImportsPlugin from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

// https://blog.linotte.dev/eslint-9-next-js-935c2b6d0371
export default tseslint.config(
  {
    ignores: [
      'venv',
      'out',
      '**/dist/',
      '.next/*',
      '.history',
      '.swc',
      '.pytest_cache',
      'coverage',
      'node_modules',
      'storybook-static',
      'test-results',
      '**/*.py',
      'README.md',
      'src/types/schema.d.ts'
    ]
  },
  // ...compat.extends('next/core-web-vitals'),
  js.configs.recommended,
  // ...compat.plugins('lodash'),
  // https://typescript-eslint.io/getting-started/typed-linting/
  // ...tseslint.configs.recommended,
  // ...tseslint.configs.strictTypeChecked,
  // ...tseslint.configs.stylisticTypeChecked,
  ...tseslint.configs.recommendedTypeChecked,
  // reactRecommended,
  // reactJsxRuntime,
  ...storybookPlugin.configs['flat/recommended'],
  ...tailwindPlugin.configs['flat/recommended'],
  // NOTE: 建议使用 eslint-plugin-prettier 而不是 eslint-config-prettier
  prettierPlugin,
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mts,mtsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser
      },
      parserOptions: {
        project: './tsconfig.eslint.json',
        // projectService: true,
        ecmaFeatures: {
          jsx: true
        },
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.md']
      }
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    plugins: {
      'jsdoc': jsdocPLugin,
      'react': reactPlugin,
      'jsx-a11y': jsxA11yPlugin,
      // 'check-file': checkFilePlugin,
      'react-hooks': fixupPluginRules(reactHooksPlugin),
      'react-refresh': reactRefreshPlugin,
      'unused-imports': unusedImportsPlugin,
      'simple-import-sort': simpleImportSortPlugin
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'no-unused-vars': 'off', // or "@typescript-eslint/no-unused-vars": "off",
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': 'off',
      // 'unused-imports/no-unused-vars': [
      //   'warn',
      //   {
      //     vars: 'all',
      //     varsIgnorePattern: '^_',
      //     args: 'after-used',
      //     argsIgnorePattern: '^_'
      //   }
      // ],
      'no-constant-binary-expression': 'off',
      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/unbound-method': 'off',
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': 'off',
      'react-hooks/exhaustive-deps': 'off',
      // 'react-refresh/only-export-components': [
      //   'warn',
      //   {
      //     allowConstantExport: true
      //   }
      // ],
      '@typescript-eslint/no-unused-vars': 'off',
      'react/prop-types': 'off',
      'tailwindcss/no-custom-classname': 'off',
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn'
      // 'check-file/no-index': 'off',
      // 'check-file/filename-blocklist': [
      //   'error',
      //   {
      //     '**/*.model.ts': '*.models.ts',
      //     '**/*.util.ts': '*.utils.ts'
      //   }
      // ],
      // 'check-file/folder-match-with-fex': [
      //   'error',
      //   {
      //     '*.test.{js,jsx,ts,tsx}': '**/__tests__/',
      //     '*.styled.{jsx,tsx}': '**/pages/'
      //   }
      // ],
      // 'check-file/filename-naming-convention': [
      //   'error',
      //   {
      //     '**/*.{jsx,tsx}': 'CAMEL_CASE',
      //     '**/*.{js,ts}': 'KEBAB_CASE'
      //   }
      // ],
      // 'check-file/folder-naming-convention': [
      //   'error',
      //   {
      //     'src/**/': 'CAMEL_CASE',
      //     'mocks/*/': 'KEBAB_CASE'
      //   }
      // ]
    }
  },
  ...[
    ...compat.extends('plugin:cypress/recommended'),
    mochaPlugin.configs.flat.recommended
  ].map(config => ({
    ...config,
    files: ['**/cypress/**/*']
  })),
  {
    files: ['**/cypress/**/*'],
    rules: {
      'cypress/no-unnecessary-waiting': 'warn',
      'cypress/unsafe-to-chain-command': 'warn',
      'mocha/max-top-level-suites': 'off',
      'mocha/no-exclusive-tests': 'error',
      'mocha/no-identical-title': 'off',
      'mocha/no-mocha-arrows': 'off',
      'mocha/no-setup-in-describe': 'off'
    }
  },
  {
    files: ['**/*.html'],
    plugins: { html: htmlPlugin }
  },
  {
    files: ['**/playwright/**/*'],
    ...playwrightPlugin.configs['flat/recommended']
  },
  {
    files: ['**/*.md'], // 'README.md'
    plugins: {
      markdown: markdownPlugin
    },
    // language: 'markdown/commonmark',
    language: 'markdown/gfm',
    rules: {
      'markdown/no-html': 'error',
      'no-irregular-whitespace': 'off'
    }
  }
)
