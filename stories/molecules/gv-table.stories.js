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
import { makeStory } from '../lib/make-story';

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
  name: 'Echo Stock',
  picture: horizontalImage,
  version,
  owner,
  description,
  created_at: 'Jul 22, 2019',
  type: 'WEB',
};

export default {
  title: 'Molecules|gv-table',
  component: 'gv-table',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-table',
};

const apiItems = [
  { name, owner },
  api,
  { name: 'Comet Api.', picture, version, states, owner, labels, description, running: true },
];

const apiOptions = [
  { data: 'picture', type: 'image', alt: 'name' },
  { data: 'name', label: 'Name', tag: 'version' },
  { data: 'description', label: 'Description' },
  { data: 'owner.display_name', label: 'Owner' },
  { icon: (item) => (item.public ? '' : 'general:lock') },
  {
    icon: (item) => (item.running ? 'design:circle' : ''),
    style: (item) => (item.running ? '--gv-icon--c: #009B5B' : '--gv-icon--c: #FF7875'),
  },
];

export const Apis = makeStory(conf, {
  items: [{ items: apiItems, options: apiOptions, title: 'APIs' }],
});

const appItems = [application, application, application];

const appOptions = [
  { data: 'picture', type: 'image', alt: 'name' },
  { data: 'name', label: 'Name', tag: 'type' },
  { data: 'owner.display_name', label: 'Owner' },
  { data: 'created_at', type: 'date', label: 'Creation' },
];

export const Applications = makeStory(conf, {
  items: [{ items: appItems, options: appOptions, title: 'Applications' }],
});

const appWithoutHeaderOptions = [
  { data: 'picture', type: 'image', alt: 'name' },
  { data: 'name', label: 'Name', tag: 'type' },
  { data: 'owner.display_name', label: 'Owner' },
  { data: 'created_at', type: 'date', label: 'Creation' },
];

export const applicationsWithoutHeader = makeStory(conf, {
  items: [{ items: appItems, options: appWithoutHeaderOptions, noheader: true, title: 'Applications without header' }],
});

export const empty = makeStory(conf, {
  items: [{ items: [] }],
});
