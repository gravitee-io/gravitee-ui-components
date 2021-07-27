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
import '../../src/charts/gv-chart-line';
import { makeStory, storyWait } from '../lib/make-story';

const events = ['gv-chart-line:zoom'];

function randomArray(moreZero) {
  return Array.from({ length: 10 }, () => {
    const number = Math.floor(Math.random() * 1000);
    if (moreZero && number > 300) {
      return 0;
    }
    return number;
  });
}

const series = {
  values: [
    { name: '200', data: randomArray(true) },
    { name: '401', data: randomArray(true) },
    { name: '403', data: randomArray(true) },
    { name: '404', data: randomArray(true) },
    { name: '500', data: randomArray(true) },
  ],
};

const series2 = {
  values: [
    { name: '200', data: randomArray() },
    { name: '401', data: randomArray() },
    { name: '403', data: randomArray() },
    { name: '404', data: randomArray() },
    { name: '500', data: randomArray() },
  ],
};

const now = new Date();
const options = {
  labelPrefix: 'HTTP Status',
  pointStart: Math.round(now.setDate(now.getDate() - 5) / 1000) * 1000,
  pointInterval: 43200000,
};

export default {
  title: 'charts/gv-chart-line',
  component: 'gv-chart-line',
  parameters: {
    chromatic: { disable: true },
  },
};

const conf = {
  component: 'gv-chart-line',
  events,
  css: `
    gv-chart-line {
      min-height: 200px;
    }
  `,
};

export const Basics = makeStory(conf, {
  items: [{ series, options }],
});

export const Synchronized = makeStory(conf, {
  items: [
    { series, options },
    { series: series2, options },
  ],
});

const manySeries = {
  values: series2.values
    .concat(series2.values)
    .concat(series2.values)
    .concat(series2.values)
    .concat(series2.values)
    .concat(series2.values)
    .concat(series2.values),
};
export const MoreData = makeStory(conf, {
  items: [{ series: manySeries, options }],
});

export const Empty = makeStory(conf, {
  items: [{ series: [], options }],
});

let seriesResolver;
export const Loading = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(0, ([component]) => {
      component.series = new Promise((resolve) => (seriesResolver = resolve));
      component.options = options;
    }),

    storyWait(750, () => {
      seriesResolver(series);
    }),
  ],
});

export const LoadingAndError = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(0, ([component]) => {
      component.series = new Promise((resolve, reject) => (seriesResolver = reject));
      component.options = options;
    }),

    storyWait(750, () => {
      seriesResolver({});
    }),
  ],
});
