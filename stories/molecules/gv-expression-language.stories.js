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

import notes from '../../.docs/gv-expression-language.md';
import { makeStory } from '../lib/make-story';
import '../../src/molecules/gv-expression-language';
import grammar from '../resources/el-grammar.json';

export default {
  title: 'Molecules/gv-expression-language',
  component: 'gv-expression-language',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-expression-language',
};

export const Inline = makeStory(conf, {
  items: [{ grammar, rows: 1, value: '{#calloutResponse.status >= 400 and #calloutResponse.status <= 500}' }],
});

export const InlineReadonly = makeStory(conf, {
  items: [{ grammar, rows: 1, readonly: true }],
});

const options = {
  lineNumbers: true,
  allowDropFileTypes: true,
  autoCloseBrackets: true,
  matchBrackets: true,
};

export const Multilines = makeStory(conf, {
  items: [{ grammar, options }],
});

export const MultilinesReadonly = makeStory(conf, {
  items: [{ grammar, options, readonly: true }],
});

const groovyOptions = {
  placeholder: 'Put the body content here',
  lineNumbers: true,
  allowDropFileTypes: true,
  autoCloseBrackets: true,
  matchBrackets: true,
  mode: 'groovy',
};

const groovySrc = `println 'Hello'                                 

int power(int n) { 2**n }                       

println "2^6==\${power(6)}"`;

export const InGroovy = makeStory(conf, {
  items: [{ grammar, options: groovyOptions, value: groovySrc }],
});

const xmlOptions = {
  placeholder: 'Put the body content here',
  lineNumbers: true,
  allowDropFileTypes: true,
  autoCloseBrackets: true,
  matchBrackets: true,
  mode: 'xml',
};

export const InXML = makeStory(conf, {
  items: [{ grammar, options: xmlOptions }],
});
