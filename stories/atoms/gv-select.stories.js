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
import '../../src/atoms/gv-select';
import notes from '../../.docs/gv-select.md';
import { makeStory } from '../lib/make-story';

export default {
  title: 'Atoms|gv-select',
  component: 'gv-select',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-select',
  css: `
    :host {
      height: 250px;
    }
  `,
};

const options = [
  { label: 'Application 1', value: '1' },
  { label: 'Application 2', value: '2' },
  { label: 'Application 3', value: '3' },
  { value: '4' },
  'Application 5',
];

const items = [
  { options },
  { label: 'Associer une application', placeholder: 'Trouver une application', options },
];

export const Simple = makeStory(conf, {
  items,
});

export const Small = makeStory(conf, {
  items: items.map((p) => ({ ...p, small: true })),
});

export const Large = makeStory(conf, {
  items: items.map((p) => ({ ...p, large: true })),
});

export const Required = makeStory(conf, {
  items: items.map((p) => ({ ...p, required: true })),
});

export const Disabled = makeStory(conf, {
  items: items.map((p) => ({ ...p, disabled: true })),
});

export const DisabledAndRequired = makeStory(conf, {
  items: items.map((p) => ({ ...p, disabled: true, required: true })),
});

export const Skeleton = makeStory(conf, {
  items: items.map((p) => ({ ...p, skeleton: true })),
});

const hundredOptions = Array.from(Array(100), (x, index) => index + 1).map((i) => {
  return { label: `Application ${i}`, value: `${i}` };
});

export const HundredOptions = makeStory(conf, {
  items: items.map((p) => ({ ...p, options: hundredOptions })),
});

export const MultipleSelection = makeStory(conf, {
  items: items.map((p) => ({ ...p, multiple: true })),
});
