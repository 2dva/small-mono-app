import { defineConfig } from 'eslint/config'
import rootConfig from '../eslint.config.mjs'

export default defineConfig([
  ...rootConfig,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',

      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
])
