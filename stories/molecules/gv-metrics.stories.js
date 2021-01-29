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
import '../../src/molecules/gv-metrics';
import notes from '../../.docs/gv-metrics.md';
import { makeStory, storyWait } from '../lib/make-story';

export default {
  title: 'Molecules/gv-metrics',
  component: 'gv-metrics',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-metrics',
  css: `
    :host {
      max-width: 500px;
    }
    gv-metrics {
      display: flex;
      height: 100%;
      justify-content: space-evenly;
    }
  `,
};

const metrics = { subscribers: 234, hits: 15000, health: 0.034 };
const smallMetrics = { subscribers: 1, hits: 1, health: 0.034 };

const items = [{ metrics }];

export const basics = makeStory(conf, {
  items,
});

export const basicsInColumn = makeStory(
  {
    ...conf,
    ...{
      css: `
    :host {
      max-width: 500px;
    }
    gv-metrics {
      display: grid;
      grid-gap: 1rem;
    }
  `,
    },
  },
  {
    items,
  },
);

export const basicsWithRating = makeStory(conf, {
  items: items.map((item) => ({ ...item, innerHTML: '<gv-rating value="3.3" count="345"></gv-rating>' })),
});

export const basicsSmallMetrics = makeStory(conf, {
  items: [{ metrics: smallMetrics }],
});

export const empty = makeStory(conf, {
  items: [{}],
});

export const loading = makeStory(conf, {
  items: [{ metrics: null }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.metrics = metrics;
    }),
  ],
});

export const loadingAndError = makeStory(conf, {
  items: [{ metrics: null }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.metrics = Promise.reject(new Error());
    }),
  ],
});
