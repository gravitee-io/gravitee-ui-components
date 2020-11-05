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
import notes from '../../.docs/gv-table.md';
import '../../src/molecules/gv-table';
import horizontalImage from '../../assets/images/gravitee-logo.png';
import picture from '../../assets/images/logo.png';
import { makeStory, storyWait } from '../lib/make-story';

const name = 'Supernova';
const version = 'v.1.1';
const states = [
  { value: 'beta', minor: true },
  { value: 'running', major: true },
];
const owner = { display_name: 'Garry Marshall' };
const description
  = 'Tempore quo primis auspiciis in mundanum fulgorem surgeret victura dum erunt homines Roma, '
  + 'ut augeretur sublimibus incrementis, foedere pacis aeternae Virtus convenit atque  plerumque dissidentes,';
const labels = ['brta', 'custom', 'web'];
const api = {
  name: 'Long Supernova',
  picture: horizontalImage,
  version,
  states,
  owner,
  labels,
  description,
  running: true,
  public: true,
};
const application = {
  name: 'My app',
  picture: horizontalImage,
  version,
  owner,
  description,
  created_at: 'Jul 22, 2019',
  type: 'WEB',
  hits: 1220,
};

export default {
  title: 'Molecules/gv-table',
  component: 'gv-table',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-table',
  css: `
    :host {
      min-height: 90vh;
    }
  `,
};

const apiItems = [
  { name, owner },
  api,
  { name: 'Comet Api.', picture, version, states, owner, labels, description, running: true },
];

const apiOptions = {
  selectable: true,
  data: [
    { field: 'picture', type: 'image', alt: 'name' },
    { field: 'name', label: 'Name', tag: 'version' },
    { field: 'description', label: 'Description' },
    { field: 'owner.display_name', label: 'Owner' },
    {
      type: 'gv-icon',
      width: '40px',
      attributes: { shape: (item) => (item.public ? 'general:unlock' : 'general:lock') },
    },
    {
      type: 'gv-icon',
      width: '40px',
      attributes: { shape: 'design:circle' },
      style: (item) => (item.running ? '--gv-icon--c: #86c3d0' : '--gv-icon--c: #FF7875'),
    },
  ],
};

export const Apis = makeStory(conf, {
  items: [{ items: apiItems, options: apiOptions, title: 'APIs', order: 'name' }],
});

const appItems = [application, application, application];

const appOptions = {
  selectable: false,
  data: [
    { field: 'picture', type: 'image', alt: 'name' },
    { field: 'name', label: 'Name', tag: 'type' },
    { field: 'owner.display_name', label: 'Owner' },
    { field: 'created_at', type: 'date', label: 'Creation' },
  ],
};

export const Applications = makeStory(conf, {
  items: [{ items: appItems, options: appOptions, title: 'Applications' }],
});

const appWithoutHeaderOptions = {
  selectable: false,
  data: [
    { field: 'picture', type: 'image', alt: 'name' },
    { field: 'name', label: 'Name', tag: 'type' },
    { field: 'owner.display_name', label: 'Owner' },
    { field: 'created_at', type: 'date', label: 'Creation' },
  ],
};

export const NoHeader = makeStory(conf, {
  items: [{ items: appItems, options: appWithoutHeaderOptions, noheader: true, title: 'No header' }],
});

const multipleSelectionOptions = {
  selectable: 'multi',
  data: [
    { field: 'name', label: 'Name' },
    { field: 'hits', label: 'Hits' },
  ],
};

const simpleAppItems = [application, { name: 'Amazing app', hits: 1900 }, { name: 'Simple app', hits: 200 }];

export const multipleSelection = makeStory(conf, {
  items: [{ items: simpleAppItems, options: multipleSelectionOptions, noheader: true }],
});

export const pagination = makeStory(conf, {
  items: [{ items: [...apiItems, ...apiItems], options: { ...apiOptions, paging: 2 }, title: 'APIs', order: 'name' }],
});

export const components = makeStory(conf, {
  items: [{
    items: [{ name: 'input', value: 'Value' }],
    options: {
      data: [
        { field: 'name', label: 'Name' },
        { field: 'value', label: 'Component', type: 'gv-input', attributes: { clipboard: true } },
        { label: 'Button', type: 'gv-button', attributes: { innerHTML: 'Click me !' } },
        { label: 'Confirm', type: 'gv-confirm', attributes: { message: 'Please confirm your click', innerHTML: '<gv-button danger>Click & confirm!</gv-button>' } },
      ],
    },
  }],
});

export const empty = makeStory(conf, {
  items: [{ items: [] }],
});

export const LoadingAndError = makeStory(conf, {
  items: [{ items: new Promise(() => ({})), apiItems }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.items = Promise.reject(new Error());
    }),
  ],
});
