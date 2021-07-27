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
import '../../src/atoms/gv-state';
import { makeStory } from '../lib/make-story';

export default {
  title: 'Atoms/gv-state',
  component: 'gv-state',
};

const conf = {
  component: 'gv-state',
};

const items = [
  { innerHTML: 'beta' },
  { innerHTML: 'running', major: true },

  { innerHTML: 'error', error: true },
  { innerHTML: 'success', success: true },
  { innerHTML: 'warn', warn: true },
];

export const Basics = makeStory(conf, {
  items,
});

export const empty = makeStory(conf, {
  items: [{}, {}],
});

export const skeleton = makeStory(conf, {
  items: items.map((p) => ({ ...p, skeleton: true })),
});
