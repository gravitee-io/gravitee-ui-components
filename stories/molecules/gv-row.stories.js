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
import notes from '../../.docs/gv-row.md';
import '../../src/molecules/gv-row';
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
};

export default {
  title: 'Molecules/gv-row',
  component: 'gv-row',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-row',
};

const items = [
  { item: { name, owner } },
  { item: api },
  {
    item: {
      name: 'Comet Api.',
      picture,
      version,
      states,
      owner,
      labels,
      description,
    },
  },
];

export const Basics = makeStory(conf, {
  items,
});

export const Small = makeStory(conf, {
  items: items.map((item) => ({ ...item, small: true })),
});

export const empty = makeStory(conf, {
  items: [{}],
});

export const loading = makeStory(conf, {
  items: [{ item: new Promise(() => ({})) }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.item = api;
    }),
  ],
});

export const loadingAndError = makeStory(conf, {
  items: [{ item: new Promise(() => ({})) }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.item = Promise.reject(new Error());
    }),
  ],
});
