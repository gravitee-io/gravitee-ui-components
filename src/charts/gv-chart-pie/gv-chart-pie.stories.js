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
import './gv-chart-pie';
import { makeStory } from '../../../testing/lib/make-story';
import { wait } from '../../../testing/lib/sequence';

const events = ['gv-chart-pie:select'];

const series = {
  values: {
    '100.0-200.0': 0,
    '200.0-300.0': 27567,
    '300.0-400.0': 0,
    '400.0-500.0': 1000,
    '500.0-600.0': 300,
  },
};

const options = {
  name: 'Number of API requests',
  data: [
    { name: '1xx', color: '#bbb' },
    { name: '2xx', color: '#30ab61' },
    { name: '3xx', color: '#365bd3' },
    { name: '4xx', color: '#ff9f40' },
    { name: '5xx', color: '#cf3942' },
  ],
};

export default {
  title: 'charts/gv-chart-pie',
  component: 'gv-chart-pie',
  parameters: {
    chromatic: { disable: true },
  },
};

const conf = {
  component: 'gv-chart-pie',
  events,
  css: `
    gv-chart-pie {
      min-height: 200px;
    }
  `,
};

export const Basics = makeStory(conf, {
  items: [{ series, options }],
});

export const Empty = makeStory(conf, {
  items: [{ series: [], options }],
});

export const Loading = makeStory(conf, {
  items: [{}],
  play: async ({ component }) => {
    let seriesResolver;
    component.series = new Promise((resolve) => (seriesResolver = resolve));
    component.options = options;

    await wait(750);
    seriesResolver(series);
  },
});

export const LoadingAndError = makeStory(conf, {
  items: [{}],
  play: async ({ component }) => {
    let seriesResolver;
    component.series = new Promise((resolve, reject) => (seriesResolver = reject));
    component.options = options;

    await wait(750);
    seriesResolver({});
  },
});
