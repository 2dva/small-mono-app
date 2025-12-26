import tslintParser from '@typescript-eslint/parser' // Парсер для TS
import { defineConfig, globalIgnores } from 'eslint/config'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import rootConfig from '../eslint.config.mjs'

export default defineConfig([
  globalIgnores(['**/node_modules', '**/dist', '**/*.config.js']),
  ...rootConfig,
  {
    plugins: {
      vue: pluginVue,
    },

    languageOptions: {
      parser: vueParser,

      ecmaVersion: 5,
      sourceType: 'script',
      parserOptions: {
        parser: tslintParser,
        project: './tsconfig.json',
        extraFileExtensions: ['.vue'],
      },
    },

    rules: {
      'vue/no-v-html': [
        'error',
        {
          ignorePattern: '^html',
        },
      ],

      'jsx-a11y/anchor-is-valid': 'off',
      'node/no-process-env': 'error',
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@small-mono-app/backend/**',
                '!@small-mono-app/backend/**',
                '!@small-mono-app/backend/src/lib/tree.ts',
              ],
              allowTypeImports: true,
              message: 'Only types and schemas are allowedd to import from backend',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/vite.config.ts', '**/eslint.config.mjs'],

    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',

      parserOptions: {
        project: './tsconfig.node.json',
      },
    },
  },
])
