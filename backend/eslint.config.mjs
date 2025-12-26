import { defineConfig, globalIgnores } from 'eslint/config'
import rootConfig from '../eslint.config.mjs'

export default defineConfig([
  globalIgnores(['**/node_modules', '**/dist', '**/*.config.js']),
  ...rootConfig,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',

      parserOptions: {
        project: './tsconfig.json',
      },
    },

    rules: {
      'no-console': 'warn',

      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/**/!(*.integration.test.ts)',
              from: './src/test',
              message: 'Import something from test dir only inside integration tests',
            },
          ],
        },
      ],

      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'parent', 'sibling', 'index'],

          pathGroups: [
            {
              pattern: '{.,..}/**/env\n',
              group: 'builtin',
              position: 'before',
            },
            {
              pattern: '{.,..}/**/test/integration\n',
              group: 'builtin',
              position: 'before',
            },
          ],

          alphabetize: {
            order: 'asc',
            caseInsensitive: false,
            orderImportKind: 'asc',
          },
        },
      ],
    },
  },
  {
    files: ['**/eslint.config.mjs'],

    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',

      parserOptions: {
        project: './tsconfig.node.json',
      },
    },
  },
])
