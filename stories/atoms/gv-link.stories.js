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
import '../../src/atoms/gv-link';
import { makeStory } from '../lib/make-story';

export default {
  title: 'Atoms/gv-link',
  component: 'gv-link',
};

const conf = {
  component: 'gv-link',
};

const items = [
  { title: 'Simple', icon: 'food:french-bread', help: 'baguette', path: 'baguette' },
  { title: 'Active', icon: 'food:wine', active: true, target: '_blank' },
];

export const Basic = makeStory(conf, {
  items,
});

export const Small = makeStory(conf, {
  items: items.map((p) => ({ ...p, small: true })),
});
export const Empty = makeStory(conf, {
  items: [{}, {}],
});

export const Skeleton = makeStory(conf, {
  items: items.map((p) => ({ ...p, skeleton: true })),
});
