import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import tslint from '@typescript-eslint/eslint-plugin'; // Сам плагин
import tslintParser from '@typescript-eslint/parser'; // Парсер для TS
import { defineConfig, globalIgnores } from "eslint/config";
import love from 'eslint-config-love'
import pluginImport from 'eslint-plugin-import';
import pluginJest from 'eslint-plugin-jest'; 
import node from "eslint-plugin-node";
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([
  globalIgnores(['**/node_modules', '**/dist', '**/*.config.js']),
  js.configs.recommended,
  {
    extends: compat.extends('prettier'),

    ...love,

    plugins: {
      '@typescript-eslint': tslint,
      import: pluginImport,
      node,
      jest: pluginJest,
    },

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest, // Добавляем глобальные переменные Jest (test, expect, describe)
      },
      parserOptions: {
        parser: tslintParser,
        project: './tsconfig.json',
      },
    },

    rules: {
      'no-new': 'off',

      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'error',

      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
            caseInsensitive: false,
            orderImportKind: 'asc',
          },
        },
      ],

      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/consistent-type-assertions': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'jsx-a11y/anchor-is-valid': 'off',

      'no-irregular-whitespace': [
        'error',
        {
          skipTemplates: true,
          skipStrings: true,
        },
      ],

      'node/no-process-env': 'error',

      'no-restricted-syntax': [
        'error',
        {
          selector: '[object.type=MetaProperty][property.name=env]',
          message: 'Use instead import { env } from "lib/env"',
        },
      ],
    },
  },
  {
    files: ['./eslint.config.mjs'],

    languageOptions: {
      parserOptions: {
        project: './front/tsconfig.node.json',
      },
    },
  },
])