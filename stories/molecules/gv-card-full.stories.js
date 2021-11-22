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
import '../../src/molecules/gv-card-full';
import horizontalImage from '../../assets/images/gravitee-logo-cyan.svg';
import { makeStory, storyWait } from '../lib/make-story';

const name = 'Supernova';
const description =
  'Tempore quo primis auspiciis in mundanum fulgorem surgeret victura dum erunt homines Roma, ' +
  'ut augeretur sublimibus incrementis, foedere pacis aeternae Virtus convenit atque  plerumque dissidentes,';

const version = 'v.1.1';

const states = [{ value: 'beta' }, { value: 'running', major: true }];
const ratingSummary = { average: 3.4, count: 124 };
const labels = ['APIDays', 'December', 'Foobar'];
const owner = { display_name: 'Garry Marshall' };
const applicationMetrics = Promise.resolve({ subscribers: '3' });
const api = Promise.resolve({
  name,
  description,
  version,
  states,
  labels,
  rating_summary: ratingSummary,
});
const application = Promise.resolve({ name: `${name} app`, description, applicationType: 'Web' });

export default {
  title: 'Molecules/gv-card-full',
  component: 'gv-card-full',
};

const conf = {
  component: 'gv-card-full',
  css: `
      gv-card-full {
        max-width: 500px;
      }
    `,
};

const apiItems = [
  { item: api },
  { item: api, metrics: { hits: '11M+' } },
  { item: api, metrics: { hits: '11M+', subscribers: '689' } },
  { item: api, metrics: { hits: '11M+', subscribers: '689', health: '0.95' } },
  {
    item: {
      name: 'Long Supernova with empty description',
      version,
      _links: { picture: horizontalImage },
    },
  },
  {
    item: {
      name: 'Supernova with owner name',
      description,
      version,
      labels,
      states,
      owner,
    },
  },
];

const appItems = [{ item: application }, { item: application, metrics: applicationMetrics }];

export const Api = makeStory(conf, {
  items: apiItems,
});

export const Applications = makeStory(conf, {
  items: appItems,
});

export const empty = makeStory(conf, {
  items: [{ item: {} }],
});

let itemResolver;
let metricResolver;
export const loading = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(0, ([component]) => {
      component.item = new Promise((resolve) => (itemResolver = resolve));
      component.metrics = new Promise((resolve) => (metricResolver = resolve));
    }),

    storyWait(750, ([component]) => {
      itemResolver(api);
    }),

    storyWait(2000, ([component]) => {
      metricResolver({ hits: '11M+', subscribers: '689', health: '0.95' });
    }),
  ],
});

export const loadingAndError = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(0, ([component]) => {
      component.item = new Promise((resolve, reject) => (itemResolver = reject));
      component.metrics = new Promise((resolve) => (metricResolver = resolve));
    }),

    storyWait(2000, ([component]) => {
      itemResolver({});
    }),

    storyWait(750, ([component]) => {
      metricResolver({ hits: '11M+', subscribers: '689', health: '0.95' });
    }),
  ],
});
