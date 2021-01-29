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
import notes from '../../.docs/gv-header.md';
import '../../src/organisms/gv-header';
import picture from '../../assets/images/logo.png';
import background from '../../assets/images/gravitee-logo-inline.png';
import { makeStory, storyWait } from '../lib/make-story';

const events = ['gv-header:subscribe', 'gv-header:contact', 'gv-link:click'];

const version = 'v.1.1';
const states = [
  { value: 'beta', minor: true },
  { value: 'running', major: true },
];
const item = { name: 'Long Supernova', _links: { picture }, version, states };

const itemWithoutPicture = { name: 'Long Supernova', version, states };

export default {
  title: 'Organisms/gv-header',
  component: 'gv-header',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-header',
  events,
  css: `
    :host {
      height: 200px;
    }
  `,
};

const breadcrumbs = [
  { path: '#', title: 'Catalog' },
  { path: '#', title: 'Categories' },
  { path: '#', title: 'My API' },
];

export const Basics = makeStory(conf, {
  items: [{ item, breadcrumbs }],
});

export const BasicsWihoutPicture = makeStory(conf, {
  items: [{ item: itemWithoutPicture, breadcrumbs, type: 'API' }],
});

export const WithBackground = makeStory(conf, {
  items: [{ item: { ...item, ...{ _links: { ...item._links, ...{ background } } } }, breadcrumbs }],
});

export const WithBackgroundWithoutPicture = makeStory(conf, {
  items: [{ item: { ...itemWithoutPicture, ...{ _links: { background } } }, breadcrumbs, type: 'API' }],
});

export const WithSubscribe = makeStory(conf, {
  items: [{ item, breadcrumbs, 'can-subscribe': true }],
});

export const Empty = makeStory(conf, {
  items: [{}],
});

let itemResolver;
export const loading = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(0, ([component]) => {
      component.item = new Promise((resolve) => (itemResolver = resolve));
    }),

    storyWait(750, ([component]) => {
      itemResolver(item);
      component.breadcrumbs = breadcrumbs;
    }),
  ],
});

export const loadingAndError = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(0, ([component]) => {
      component.item = new Promise((resolve, reject) => (itemResolver = reject));
    }),

    storyWait(750, ([component]) => {
      itemResolver(item);
      component.breadcrumbs = breadcrumbs;
    }),
  ],
});
