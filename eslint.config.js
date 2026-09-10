/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const path = require('path');

const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const globals = require('globals');

// `eslint-config-standard` and `eslint-plugin-lit` are still published in the eslintrc format.
const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  { ignores: ['dist/**', 'wc/**', 'storybook-static/**', 'coverage/**', '.docs/**', 'node_modules/**'] },
  ...compat.extends('standard', 'prettier'),
  {
    rules: {
      'arrow-parens': ['error', 'always'],
      'brace-style': ['error', '1tbs'],
      'comma-dangle': ['error', 'always-multiline'],
      indent: 'off',
      'line-comment-position': ['error', { position: 'above' }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'padded-blocks': 'off',
      'space-before-function-paren': 'off',
      quotes: ['error', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
      semi: ['error', 'always'],
      'accessor-pairs': 'off',
    },
    languageOptions: {
      globals: {
        Event: 'readonly',
      },
    },
  },
  {
    files: ['src/**/*.js'],
    ...compat.extends('plugin:lit/recommended')[0],
    languageOptions: {
      globals: globals.browser,
    },
  },
];
