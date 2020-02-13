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
import notes from '../../.docs/gv-card-full.md';
import '../../src/molecules/gv-card-full';
import horizontalImage from '../../assets/images/gravitee-logo.png';
import { makeStory, storyWait } from '../lib/make-story';

const name = 'Supernova';
const description
  = 'Tempore quo primis auspiciis in mundanum fulgorem surgeret victura dum erunt homines Roma, '
  + 'ut augeretur sublimibus incrementis, foedere pacis aeternae Virtus convenit atque  plerumque dissidentes,';

const version = 'v.1.1';

const states = [{ value: 'beta' }, { value: 'running', major: true }];
const ratingSummary = { average: 3.4, count: 124 };
const labels = ['APIDays', 'December', 'Foobar'];
const apiMetrics = Promise.resolve({ hits: '11M+', subscribers: '689', health: '0.95' });
const applicationMetrics = Promise.resolve({ subscribers: '3' });
const api = Promise.resolve({
  name,
  description,
  version,
  states,
  labels,
  rating_summary: ratingSummary,
});
const application = Promise.resolve({ name, description, applicationType: 'Web' });

export default {
  title: 'Molecules|gv-card-full',
  component: 'gv-card-full',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-card-full',
};

const apiItems = [
  { item: api },
  { item: api, metrics: apiMetrics },
  {
    item: {
      name: 'Long Supernova with empty description',
      version,
      _links: { picture: horizontalImage },
    },
  },
];

const appItems = [
  { item: application },
  { item: application, metrics: applicationMetrics },
];

export const Api = makeStory(conf, {
  items: apiItems,
});

export const Applications = makeStory(conf, {
  items: appItems,
});

export const empty = makeStory(conf, {
  items: [{}],
});

export const loading = makeStory(conf, {
  items: [{ item: new Promise(() => ({})), metrics: new Promise(() => ({})) }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.item = api;
      component.metrics = apiMetrics;
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
