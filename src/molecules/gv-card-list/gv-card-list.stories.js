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
import './gv-card-list';
import '../gv-category-list';
import { makeStory, storyWait } from '../../../testing/lib/make-story';
import horizontalImage from '../../../assets/images/gravitee-logo-cyan.svg';

const name = 'Supernova';
const description =
  'Tempore quo primis auspiciis in mundanum fulgorem surgeret victura dum erunt homines Roma, ' +
  'ut augeretur sublimibus incrementis, foedere pacis aeternae Virtus convenit atque  plerumque dissidentes,';

const version = 'v.1.1';

const states = [{ value: 'beta' }, { value: 'running', major: true }];
const ratingSummary = { average: 3.4, count: 124 };
const labels = ['APIDays', 'December', 'Foobar'];
const apiMetrics = Promise.resolve({ hits: '11M+', subscribers: '689', health: '0.95' });
const api = Promise.resolve({
  name,
  description,
  version,
  states,
  labels,
  rating_summary: ratingSummary,
});

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

export default {
  title: 'Molecules/gv-card-list',
  component: 'gv-card-list',
};

const conf = {
  component: 'gv-card-list',
  events: ['gv-card:click'],
};

export const basics = makeStory(conf, {
  items: [{ items: apiItems }],
});

const longNameItems = [
  'Customer Onboarding Integration Platform Backend Service',
  'Internal Payments Reconciliation and Settlement Gateway',
  'Partner Loyalty Rewards Synchronisation Connector',
].map((longName) => ({ item: Promise.resolve({ name: longName, description, version, states, labels }) }));

// The breakpoints follow the width of the list itself, so each list is given the width of one layout
export const breakpoints = makeStory(conf, {
  css: `
    gv-card-list {
      margin-bottom: 2rem;
    }

    gv-card-list:nth-of-type(1) {
      width: 1300px;
    }

    gv-card-list:nth-of-type(2) {
      width: 1000px;
    }

    gv-card-list:nth-of-type(3) {
      width: 600px;
    }
  `,
  items: [{ items: longNameItems }, { items: longNameItems }, { items: longNameItems }],
});
// Wide enough for the 1300px list, and late enough for the cards to fade in
breakpoints.parameters = {
  ...breakpoints.parameters,
  chromatic: { viewports: [1440], delay: 1000 },
};

export const empty = makeStory(conf, {
  items: [{}],
});

export const loading = makeStory(conf, {
  items: [{ items: new Array(apiItems.length).fill({ item: null, metrics: null }) }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.items = apiItems;
    }),
  ],
});

export const loadingAndError = makeStory(conf, {
  items: [{ items: new Array(apiItems.length) }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.items = apiItems.map(() => ({ item: Promise.reject(new Error()), metrics: null }));
    }),
  ],
});
