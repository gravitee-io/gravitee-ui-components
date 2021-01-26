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
import '../../src/atoms/gv-input';
import '../../src/atoms/gv-date-picker';
import notes from '../../.docs/gv-date-picker.md';
import { makeStory } from '../lib/make-story';

export default {
  title: 'Atoms/gv-date-picker',
  component: 'gv-date-picker',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-date-picker',
  css: `
    :host {
    }
  `,
};

const items = [
  {
    label: 'Simple',
  }, {
    label: 'Simple (min-max)',
    max: Date.now(),
    min: Date.now() - (1000 * 60 * 60 * 24 * 2),
  },
  { label: 'Range', range: true },
  { label: 'Time', time: true },
  { label: 'Just time', time: true, strict: true },
  { label: 'Range & time', range: true, time: true },
  {
    label: 'Range & time (min-max)',
    range: true,
    time: true,
    max: Date.now() + (1000 * 60 * 60 * 24 * 7),
    min: Date.now() - (1000 * 60 * 60 * 24 * 7),
  },
  {
    label: 'Distance from now',
    range: true,
    time: true,
    distanceFromNow: (1000 * 60 * 60 * 24 * 29),
  },
];

export const Types = makeStory(conf, {
  items,
});

export const Small = makeStory(conf, {
  items: items.map((item) => ({ ...item, small: true })),
});

export const Disabled = makeStory(conf, {
  items: items.map((item) => ({ ...item, disabled: true })),
});
