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
const longDescription
  = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla non viverra magna. '
  + 'Duis justo risus, iaculis vel luctus vel, euismod quis ipsum. Sed pellentesque elit eu enim auctor ullamcorper. '
  + 'Donec rhoncus, nunc eget tempus viverra, leo libero lobortis nibh, quis vulputate ligula nunc sit amet erat. '
  + 'Suspendisse mi mauris, convallis non lobortis id, elementum eu orci. Fusce mattis aliquam augue eu pharetra. '
  + 'Morbi quam neque, interdum ut ullamcorper lacinia, viverra ut odio. Aliquam porttitor a augue ut dignissim. '
  + 'Nulla facilisi. Praesent eget varius ante. Interdum et malesuada fames ac ante ipsum primis in faucibus.';

const ratingSummary = { average: 3.2, count: 345 };
const metrics = { hits: '11M+', subscribers: '689', health: '0.95' };
const version = 'v1.1';
const labels = ['APIDays', 'December', 'Foobar'];

export default {
  title: 'Molecules|gv-promote',
  component: 'gv-promote',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-promote',
  css: `
      gv-promote {
        max-width: 1000px;
      }
    `,
};

export const withDefaultImage = makeStory(conf, {
  items: [{ item: { name, description, version }, href: 'https://gravitee.io' }],
});

export const withImage = makeStory(conf, {
  items: [{ item: { name, description, version, _links: { picture } } }],
});

export const withLargeImage = makeStory(conf, {
  items: [{ item: { name, description, version, _links: { picture: horizontalImage } } }],
});

export const withMetrics = makeStory(conf, {
  items: [
    { item: { name, description, version, _links: { picture } }, metrics: { hits: '11M+' } },
    { item: { name, description, version, _links: { picture } }, metrics: { hits: '11M+', subscribers: '689' } },
    {
      item: { name, description, version, _links: { picture } },
      metrics: { hits: '11M+', subscribers: '689', health: '0.95' },
    },
  ],
});

export const withRating = makeStory(conf, {
  items: [
    {
      item: { name, description, version, _links: { picture }, rating_summary: ratingSummary },
      metrics: { hits: '11M+' },
    },
    {
      item: { name, description, version, _links: { picture }, rating_summary: ratingSummary },
      metrics: { hits: '11M+', subscribers: '689' },
    },
    {
      item: { name, description, version, _links: { picture }, rating_summary: ratingSummary },
      metrics: { hits: '11M+', subscribers: '689', health: '0.95' },
    },
  ],
});

export const withLabels = makeStory(conf, {
  items: [{ item: { name, description, version, _links: { picture }, labels }, metrics }],
});

export const withShortDescription = makeStory(conf, {
  items: [{ item: { name, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', version }, href: 'https://gravitee.io' }],
});

export const withLongDescription = makeStory(conf, {
  items: [{ item: { name, description: longDescription, version }, href: 'https://gravitee.io' }],
});

export const empty = makeStory(conf, {
  items: [{ item: {} }],
});

let itemResolver;
let metricsResolver;
export const loading = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(0, ([component]) => {
      component.item = new Promise((resolve) => (itemResolver = resolve));
      component.metrics = new Promise((resolve) => (metricsResolver = resolve));
    }),
    storyWait(1000, () => {
      metricsResolver(metrics);
    }),
    storyWait(500, () => {
      itemResolver({ name, description, version, _links: { picture }, rating_summary: ratingSummary });
    }),
  ],
});

export const loadingAndError = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(0, ([component]) => {
      component.item = new Promise((resolve) => (itemResolver = resolve));
      component.metrics = new Promise((resolve) => (metricsResolver = resolve));
    }),
    storyWait(1000, () => {
      itemResolver({});
    }),
    storyWait(2000, ([component]) => {
      metricsResolver(metrics);
    }),
  ],
});
