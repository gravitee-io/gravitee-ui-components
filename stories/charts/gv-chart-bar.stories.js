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
import '../../src/charts/gv-chart-bar';
import { makeStory, storyWait } from '../lib/make-story';

const events = ['gv-chart-bar:select'];

const series = {
  values: {
    INFO: 152460,
    WARNING: 27567,
    CRITICAL: 21000,
  },
};

const options = {
  data: [
    { name: 'INFO', color: '#54a3ff' },
    { name: 'WARNING', color: '#ff9f40' },
    { name: 'CRITICAL', color: '#cf3942' },
  ],
};

export default {
  title: 'charts/gv-chart-bar',
  component: 'gv-chart-bar',
  parameters: {
    chromatic: { disable: true },
  },
};

const conf = {
  component: 'gv-chart-bar',
  events,
  css: `
    gv-chart-bar {
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
