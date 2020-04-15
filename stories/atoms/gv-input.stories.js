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
import notes from '../../.docs/gv-input.md';
import { makeStory } from '../lib/make-story';

export default {
  title: 'Atoms|gv-input',
  component: 'gv-input',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-input',
};

const items = [
  { placeholder: 'Text...', label: 'Text label' },
  { placeholder: 'Password...', 'icon-left': 'general:shield-protected', type: 'password', label: 'Password label' },
  { placeholder: 'Email...', type: 'email', label: 'Email label' },
  { placeholder: 'Number...', type: 'number', min: '1', max: '10', label: 'Number label' },
  { placeholder: 'Search...', type: 'search', label: 'Search label' },
  { placeholder: 'Clipboard...', type: 'clipboard', label: 'Clipboard label', value: 'Copy me !' },
  { placeholder: 'Url...', type: 'url', label: 'Url label' },
  { placeholder: 'No Label...' },
];

export const Types = makeStory(conf, {
  items,
});

export const Small = makeStory(conf, {
  items: items.map((p) => ({ ...p, small: true, clearable: true })),
});

export const Large = makeStory(conf, {
  items: items.map((p) => ({ ...p, large: true, clearable: true })),
});

export const Clearable = makeStory(conf, {
  items: items.map((p) => ({ ...p, clearable: true })),
});

export const IconLeft = makeStory(conf, {
  items: items.map((p) => ({ ...p, 'icon-left': 'general:search' })),
});

export const Disabled = makeStory(conf, {
  items: items.map((p) => ({ ...p, disabled: true })),
});

export const Readonly = makeStory(conf, {
  items: items.map((p) => ({ ...p, readonly: true })),
});

export const Required = makeStory(conf, {
  items: items.map((p) => ({ ...p, required: true })),
});

export const Slotted = makeStory(conf, {
  items: [
    {
      placeholder: 'Password...',
      'icon-left': 'general:shield-protected',
      type: 'password',
      label: 'Password label',
      innerHTML: '<input></input>',
    },
  ],
});

export const DisabledAndRequired = makeStory(conf, {
  items: items.map((p) => ({ ...p, disabled: true, required: true })),
});

export const Loading = makeStory(conf, {
  items: items.map((p) => ({ ...p, loading: true })),
});

export const LoadingAndRequired = makeStory(conf, {
  items: items.map((p) => ({ ...p, loading: true, required: true })),
});

export const Autofocus = makeStory(conf, {
  docs: `
  All fields have the autofocus attribute, so it's the last one in the dom that gets it.
`,
  items: items.map((p) => ({ ...p, autofocus: true })),
});

export const Skeleton = makeStory(conf, {
  items: items.map((p) => ({ ...p, skeleton: true })),
});
