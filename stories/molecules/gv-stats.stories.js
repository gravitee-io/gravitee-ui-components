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
import notes from '../../.docs/gv-stats.md';
import '../../src/molecules/gv-stats';
import { makeStory, storyWait } from '../lib/make-story';

const stats = {
  count: 6,
  min: 1,
  max: 125,
  avg: 32.166668,
  sum: 193,
  rps: 0.000069444446,
  rpm: 0.004166667,
  rph: 0.25,
};

const statsWithFallback = {
  count: 6,
  min: 1,
  max: 125,
  avg: 32.166668,
  rps: 0.100069444446,
  rpm: 0.304166667,
  rph: 0.75,
};

const options = [
  { key: 'min', unit: 'ms', color: '#66bb6a' },
  { key: 'max', unit: 'ms', color: '#ef5350' },
  { key: 'avg', unit: 'ms', color: '#42a5f5' },
  {
    key: 'rps',
    label: 'requests per second',
    color: '#ff8f2d',
    fallback: [{
      key: 'rpm',
      label: 'requests per minute',
    }, {
      key: 'rph',
      label: 'requests per hour',
    }],
  },
  { key: 'count', label: 'total' },
];

export default {
  title: 'Molecules|gv-stats',
  component: 'gv-stats',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-stats',
  css: `
    :host {
      height: 200px;
    }
  `,
};

export const Basics = makeStory(conf, {
  items: [{ stats, options }],
});

export const WithFallback = makeStory(conf, {
  items: [{ stats: statsWithFallback, options }],
});

export const Empty = makeStory(conf, {
  items: [{ stats: [], options }],
});

export const Loading = makeStory(conf, {
  items: [{ stats: new Promise(() => ({})), options }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.stats = stats;
    }),
  ],
});

export const LoadingAndError = makeStory(conf, {
  items: [{ stats: new Promise(() => ({})), options }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.stats = Promise.reject(new Error());
    }),
  ],
});
