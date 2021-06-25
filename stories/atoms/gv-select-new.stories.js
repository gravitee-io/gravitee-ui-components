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
import '../../src/atoms/gv-select-new';
import notes from '../../.docs/gv-select-new.md';
import { makeStory } from '../lib/make-story';

export default {
  title: 'Atoms/gv-select-new',
  component: 'gv-select-new',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-select-new',
};

const options = [
  { label: 'Application 1', value: '1' },
  { label: 'Application 2', value: '2' },
  { label: 'Application 3', value: '3' },
  { value: '4' },
  'Application 5',
];

const innerHTML = `
  <label slot="label">App</label>
  <select slot="input">
    <option value="1">Application 1</option>
    <option value="2">Application 2</option>
    <option value="3">Application 3</option>
    <option value="4">4</option>
    <option value="Application 5">Application 5</option>
  </select>
`;

const items = [
  {
    innerHTML
  },
];

export const Simple = makeStory(conf, {
  items,
});
