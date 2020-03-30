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
module.exports = {
  'extends': ['plugin:lit/recommended'],
  'env': {'browser': true},
  'rules': {
    'arrow-parens': ['error', 'always'],
    'brace-style': ['error', 'stroustrup'],
    'comma-dangle': ['error', 'always-multiline'],
    'import/extensions': ['error', 'always', {'js': 'never'}],
    'line-comment-position': ['error', {'position': 'above'}],
    'no-console': ['error',  { 'allow': ['warn', 'error'] }],
    'operator-linebreak': ['error', 'before'],
    'padded-blocks': 'off',
    'quotes': ['error', 'single', {'allowTemplateLiterals': true}],
    'semi': ['error', 'always'],
  },
  globals: {
    'Event': 'readonly'
  }
};
