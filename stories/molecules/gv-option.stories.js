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

const options = [
  { id: 'sun', title: 'Sun glasses', icon: 'clothers:sun-glasses' },
  { id: 'cap', title: 'Cap', icon: 'clothers:cap', active: true },
  { id: 'shorts', title: 'Shorts', icon: 'clothers:shorts' },
];
export const basics = makeStory(conf, {
  items: [{ options }],
});

const description
  = `<p><div>A hands-free application.</div>Using this type, you will be able to define the client_id by your own.</p>`;

export const Description = makeStory(conf, {
  items: [{ options: options.map((p, i) => (Promise.resolve({ ...p, description: i % 2 === 0 ? description : '' }))) }],
});

export const Multiple = makeStory(conf, {
  items: [{
    options: options.map((p, i) => (Promise.resolve({ ...p, description: description, active: i % 2 === 0 })),),
    multiple: true,
  }],
});

const withoutIconOptions = [
  { id: 'sun', title: 'Sun glasses' },
  { id: 'cap', title: 'Cap', active: true },
  { id: 'shorts', title: 'Shorts' },
];

export const NoIcon = makeStory(conf, {
  items: [{ options: withoutIconOptions.map((p) => (Promise.resolve({ ...p, description: description }))) }],
});

const times = [
  { id: '1', title: '5', description: 'Minutes' },
  { id: '2', title: '30', description: 'Minutes' },
  { id: '3', title: '1', description: 'Hours' },
  { id: '4', title: '3', description: 'Hours' },
  { id: '5', title: '6', description: 'Hours' },
  { id: '6', title: '12', description: 'Hours' },
  { id: '7', title: '1', description: 'Day' },
  { id: '8', title: '3', description: 'Days' },
  { id: '9', title: '7', description: 'Days' },
  { id: '10', title: '14', description: 'Days' },
  { id: '11', title: '30', description: 'Days' },
  { id: '12', title: '60', description: 'Days' },
];

export const Times = makeStory(conf, {
  css: `
    gv-option {
      --gv-option-button--maw: 75px;
      width: 100%;
    }
  `,
  items: [{ options: times, reverse: true }],
});
