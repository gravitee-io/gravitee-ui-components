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
import notes from '../../.docs/gv-option.md';
import '../../src/molecules/gv-option';
import { makeStory } from '../lib/make-story';

export default {
  title: 'Molecules|gv-option',
  component: 'gv-option',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-option',
};

const items = [
  {
    options: [
      { id: 'sun', title: 'Sun glasses', icon: 'clothers:sun-glasses' },
      { id: 'cap', title: 'Cap', icon: 'clothers:cap', active: true },
      { id: 'shorts', title: 'Shorts', icon: 'clothers:shorts' }],
  }];

export const basics = makeStory(conf, {
  items,
});
