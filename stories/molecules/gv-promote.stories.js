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
import notes from '../../.docs/gv-promote.md';
import '../../src/molecules/gv-promote';
import horizontalImage from '../../assets/images/gravitee-logo.png';
import picture from '../../assets/images/logo.png';
import { makeStory, storyWait } from '../lib/make-story';

const name = 'supernova cloud';
const description
  = 'Tempore quo primis auspiciis in mundanum fulgorem surgeret victura dum erunt homines Roma, '
  + 'ut augeretur sublimibus incrementis, foedere pacis aeternae Virtus convenit atque  plerumque dissidentes,';

const ratingSummary = { average: 3.2, count: 345 };
const metrics = Promise.resolve({ hits: '11M+', subscribers: '689', health: '0.95' });
const version = 'v1.1';
const labels = ['APIDays', 'December', 'Foobar'];

export default {
  title: 'Molecules|gv-promote',
  component: 'gv-promote',
  parameters: {
    notes,
  },
};

const conf = { component: 'gv-promote' };

export const withDefaultImage = makeStory(conf, {
  items: [{ item: { name, description, version } }],
});

export const withImage = makeStory(conf, {
  items: [{ item: { name, description, version, _links: { picture } } }],
});

export const withLargeImage = makeStory(conf, {
  items: [{ item: { name, description, version, _links: { picture: horizontalImage } } }],
});

export const withMetrics = makeStory(conf, {
  items: [{ item: { name, description, version, _links: { picture } }, metrics }],
});

export const withRating = makeStory(conf, {
  items: [{ item: { name, description, version, _links: { picture }, rating_summary: ratingSummary }, metrics }],
});

export const withLabels = makeStory(conf, {
  items: [{ item: { name, description, version, _links: { picture }, labels }, metrics }],
});

export const empty = makeStory(conf, {
  items: [{}],
});

export const loading = makeStory(conf, {
  items: [{ item: new Promise(() => ({})), metrics: new Promise(() => ({})) }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.item = { name, description, version, _links: { picture }, rating_summary: ratingSummary };
      component.metrics = metrics;
    }),
  ],
});

export const loadingAndError = makeStory(conf, {
  items: [{ item: new Promise(() => ({})), metrics: new Promise(() => ({})) }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.item = Promise.reject(new Error());
      component.metrics = Promise.reject(new Error());
    }),
  ],
});
