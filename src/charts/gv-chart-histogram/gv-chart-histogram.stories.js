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
import './gv-chart-histogram';
import { makeStory, storyWait } from '../../../testing/lib/make-story';

const series = {
  values: [
    {
      name: '9ec7b0e2-a649-40a3-87b0-e2a649e0a377',
      color: '#5cb85c',
      data: [100.0, 80.0, 90.0, 100.0, 0, 0, 0, 20.0, 30.0, 50.0, 60.0, 70.0, 0, 90.0, 100.0, 0, 0, 0, 20.0, 30.0, 50.0, 60.0, 70.0, 0],
    },
  ],
};

const options = {
  title: 'Global availability',
  subtitle: 'Global availability including results of all health-checked endpoints (see below).',
  yAxis: {
    min: 0,
    max: 100,
    title: {
      text: 'Availability',
    },
    labels: {
      format: '{value}%',
    },
  },
  plotOptions: {
    series: {
      pointInterval: 12500,
      pointStart: 1620283750000,
    },
  },
};

export default {
  title: 'charts/gv-chart-histogram',
  component: 'gv-chart-histogram',
  parameters: {
    chromatic: { disable: true },
  },
};

const conf = {
  component: 'gv-chart-histogram',
  css: `
    gv-chart-histogram {
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

    storyWait(1500, () => {
      seriesResolver(series);
    }),
  ],
});
