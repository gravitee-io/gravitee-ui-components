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
import '../../src/atoms/gv-input-message';
import notes from '../../.docs/gv-input-message.md';
import { makeStory } from '../lib/make-story';

const items = [
  { level: 'warning', innerHTML: 'This is a warning (Default)' },
  { level: 'info', innerHTML: 'This is an info' },
  { level: 'error', innerHTML: 'This is an error' },
];

export default {
  title: 'Atoms/gv-input-message',
  component: 'gv-input-message',
  parameters: {
    notes,
  },
};

const conf = { component: 'gv-input-message' };

export const modes = makeStory(conf, {
  items,
});
