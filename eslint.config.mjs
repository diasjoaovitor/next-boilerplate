import json from '@eslint/json'
import markdown from '@eslint/markdown'
import vitest from '@vitest/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions'
import pluginPromise from 'eslint-plugin-promise'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import eslintPluginTailwindcss from 'eslint-plugin-tailwindcss'
import unicorn from 'eslint-plugin-unicorn'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  pluginPromise.configs['flat/recommended'],
  prettier,
  eslintPluginTailwindcss.configs.recommended,
  preferArrowFunctions.configs.all,
  {
    settings: {
      tailwindcss: {
        cssConfigPath: './src/app/styles/globals.css',
        parseKeyFunctions: ['classnames', 'classNames']
      }
    }
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: {
      unicorn
    },
    extends: ['unicorn/recommended'],
    rules: {
      'unicorn/prevent-abbreviations': [
        'error',
        {
          replacements: {
            utils: false,
            props: false
          }
        }
      ]
    }
  },
  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/no-anonymous-default-export': 'off'
    }
  },
  {
    files: ['**/*.test.{js,jsx,ts,tsx}'],
    ...vitest.configs.recommended
  },
  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    extends: ['json/recommended']
  },
  {
    files: ['**/*.md'],
    plugins: { markdown },
    language: 'markdown/commonmark',
    extends: ['markdown/recommended']
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts'])
])

export default eslintConfig
