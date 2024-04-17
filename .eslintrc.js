/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  // Configuration for JavaScript files
  extends: [
    'next/core-web-vitals', // Needed to avoid warning in next.js build: 'The Next.js plugin was not detected in your ESLint configuration'
    'plugin:prettier/recommended'
  ],
  rules: {
    'no-underscore-dangle': 'off', // Allow underscore dangle
    'prefer-object-spread': 'off', // Allow object spread
    'no-restricted-syntax': 'off', // Allow restricted syntax
    'prefer-destructuring': 'off', // Allow destructuring
    'consistent-return': 'off', // Allow implicit return in arrow functions
    'prefer-template': 'off', // Allow template literals
    'no-use-before-define': 'off', // Allow usage of variables before they are defined'
    'no-param-reassign': 'off', // Allow reassigning function parameters
    'import/extensions': 'off',
    'import/prefer-default-export': 'off', // Named export is easier to refactor automatically
    'import/no-extraneous-dependencies': 'off',
    'prettier/prettier': [
      'error',
      {
        arrowParens: 'avoid',
        endOfLine: 'auto',
        semi: false,
        singleQuote: true,
        quoteProps: 'consistent',
        trailingComma: 'none'
      }
    ] // Avoid conflict rule between Prettier and Airbnb Eslint
  },
  overrides: [
    // Configuration for TypeScript files
    {
      files: ['**/*.ts', '**/*.tsx'],
      plugins: [
        '@typescript-eslint',
        'unused-imports',
        'tailwindcss',
        'simple-import-sort',
        'markdown'
      ],
      extends: [
        'plugin:tailwindcss/recommended',
        'airbnb',
        'airbnb-typescript',
        'next/core-web-vitals',
        'plugin:prettier/recommended'
      ],
      parserOptions: {
        project: './tsconfig.json'
      },
      rules: {
        'prettier/prettier': [
          'error',
          {
            arrowParens: 'avoid',
            endOfLine: 'auto',
            semi: false,
            singleQuote: true,
            quoteProps: 'consistent',
            trailingComma: 'none'
          }
        ], // Avoid conflict rule between Prettier and Airbnb Eslint
        'no-console': 'off', // Allow console.log
        'no-plusplus': 'off', // Allow ++ and --
        'no-param-reassign': 'off', // Allow reassigning function parameters
        'consistent-return': 'off', // Allow implicit return in arrow functions
        'no-return-assign': 'off', // Allow assignment in return statement
        'no-nested-ternary': 'off', // Allow nested ternary
        'no-restricted-exports': 'off', // Allow restricted exports
        'no-continue': 'off', // Allow continue statement
        'no-await-in-loop': 'off', // Allow await in loop
        'default-case': 'off', // Allow switch without default case
        'no-restricted-syntax': [
          'error',
          'ForInStatement',
          'LabeledStatement',
          'WithStatement'
        ], // Overrides Airbnb configuration and enable no-restricted-syntax
        'no-html-link-for-pages': 'off', // Allow usage of <a> tag for pages
        'import/extensions': 'off', // Avoid missing file extension errors, TypeScript already provides a similar feature
        'import/prefer-default-export': 'off', // Named export is easier to refactor automatically
        'import/order': 'off', // Avoid conflict rule between `eslint-plugin-import` and `eslint-plugin-simple-import-sort`
        'import/no-extraneous-dependencies': 'off',
        // 'import/no-extraneous-dependencies': [
        //   'error',
        //   { devDependencies: false }
        // ], // Allow devDependencies in Next.js
        'import/no-cycle': 'off',
        'simple-import-sort/imports': 'error', // Import configuration for `eslint-plugin-simple-import-sort`
        'simple-import-sort/exports': 'error', // Export configuration for `eslint-plugin-simple-import-sort`
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'react/function-component-definition': 'off', // Disable Airbnb's specific function type
        'react/destructuring-assignment': 'off', // Vscode doesn't support automatically destructuring, it's a pain to add a new variable
        'react/require-default-props': 'off', // Allow non-defined react props as undefined
        'react/jsx-props-no-spreading': 'off', // _app.tsx uses spread operator and also, react-hook-form
        'react/no-unescaped-entities': 'off', // Allow unescaped entities in JSX
        'react/button-has-type': 'off', // Allow button without type
        'react/no-danger': 'off', // Allow usage of dangerouslySetInnerHTML
        'react/no-array-index-key': 'off', // Allow usage of array index as key
        'react/jsx-no-constructed-context-values': 'off', // Allow usage of constructed context values
        'react-hooks/exhaustive-deps': 'off', // Allow usage of useEffect without exhaustive deps
        'react/jsx-pascal-case': 'off', // Allow usage of PascalCase for components
        'react/no-this-in-sfc': 'off', // Allow usage of `this` in SFC
        'react/jsx-no-bind': 'off', // Allow usage of bind in JSX
        'react/display-name': 'off',
        '@typescript-eslint/comma-dangle': 'off', // Avoid conflict rule between Eslint and Prettier
        '@typescript-eslint/consistent-type-imports': [
          'error',
          {
            disallowTypeAnnotations: false
          }
        ], // Ensure `import type` is used when it's necessary
        '@typescript-eslint/no-use-before-define': [
          'error',
          {
            functions: true,
            classes: true,
            variables: true,
            enums: true,
            typedefs: true
          }
        ], // Allow usage of variables before they are defined
        '@typescript-eslint/no-unused-expressions': 'off', // Allow usage of unused expressions
        '@typescript-eslint/no-unused-vars': 'off', // Allow usage of unused vars
        // '@typescript-eslint/no-unused-vars': [
        //   'warn',
        //   {
        //     args: 'all',
        //     argsIgnorePattern: '^_',
        //     ignoreRestSiblings: true
        //   }
        // ],
        '@typescript-eslint/no-shadow': 'off',
        // '@typescript-eslint/dot-notation': 'off', // Allow usage of bracket notation
        // '@typescript-eslint/no-implied-eval': 'off', // Allow usage of implied eval
        'jsx-a11y/anchor-has-content': 'off', // Allow anchor without content
        'jsx-a11y/img-redundant-alt': 'off', // Allow img without alt
        'jsx-a11y/anchor-is-valid': 'off', // Allow anchor without href
        'jsx-a11y/click-events-have-key-events': 'off', // Allow click events without key events
        'jsx-a11y/interactive-supports-focus': 'off', // Allow interactive elements without focus
        'jsx-a11y/no-static-element-interactions': 'off', // Allow static elements with event listeners
        'jsx-a11y/no-redundant-roles': 'off', // Allow redundant roles
        'jsx-a11y/label-has-associated-control': 'off', // Allow label without associated control
        'jsx-a11y/media-has-caption': 'off', // Allow media without caption
        'jsx-a11y/heading-has-content': 'off',
        'jsx-a11y/alt-text': 'off',
        '@next/next/no-img-element': 'off', // Allow img without alt
        'tailwindcss/no-custom-classname': 'off', // Allow custom classnames
        'tailwindcss/no-contradicting-classname': 'off'
      }
    },
    // Configuration for testing
    {
      files: ['**/*.test.ts', '**/*.test.tsx'],
      plugins: ['jest', 'jest-formatting', 'testing-library', 'jest-dom'],
      extends: [
        'plugin:jest/recommended',
        'plugin:jest-formatting/recommended',
        'plugin:testing-library/react',
        'plugin:jest-dom/recommended'
      ]
    },
    // Configuration for e2e testing (Playwright)
    {
      files: ['**/*.spec.ts'],
      extends: ['plugin:playwright/recommended']
    },
    // Configuration for Storybook
    {
      files: ['*.stories.*'],
      extends: ['plugin:storybook/recommended'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true
          }
        ]
      }
    },
    {
      files: ['*.html'],
      plugins: ['html']
    },
    {
      files: ['*.yaml', '*.yml'],
      plugins: ['yml'],
      extends: ['plugin:yml/standard']
    },
    {
      files: ['*.md', '*.mdx'],
      extends: ['plugin:mdx/recommended'],
      // settings: {
      //   'mdx/code-blocks': false
      // },
      // processor: 'markdown/markdown',
      rules: {
        'no-unused-expressions': 'off',
        'react/jsx-curly-brace-presence': 'error',
        'react/jsx-no-undef': 'warn',
        'react/jsx-sort-props': 'error',
        'react/no-unescaped-entities': 'warn',
        'react/self-closing-comp': 'off',
        'jsx-a11y/alt-text': 'off',
        '@next/next/no-img-element': 'off'
      }
    },
    {
      files: ['**/*.{md,mdx}/**/*.{js,jsx,ts,tsx}'],
      rules: {
        'no-magic-numbers': 'off',
        'import/no-unresolved': 'off',
        'import/prefer-default-export': 'off' // Named export is easier to refactor automatically
      }
    },
    {
      files: ['**/*/next.config.mjs'],
      rules: {
        'import/extensions': 'off' // Avoid missing file extension errors, TypeScript already provides a similar feature
      }
    }
  ]
}
