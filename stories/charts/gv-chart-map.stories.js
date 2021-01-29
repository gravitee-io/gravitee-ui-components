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
import notes from '../../.docs/gv-chart-map.md';
import '../../src/charts/gv-chart-map';
import { makeStory, storyWait } from '../lib/make-story';

const events = ['gv-chart-map:select'];

const series = {
  values: {
    Unknown: 1000000,
    FR: 7567,
    GB: 1232,
    US: 2000,
    RU: 922,
    IT: 3000,
  },
};

const franceSeries = {
  values: {
    'Hauts-de-France': 7567,
    Normandie: 1232,
    Occitanie: 2000,
    Corse: 922,
    'Île-de-France': 3000,
  },
};

const hdfSeries = {
  values: {
    Nord: 7567,
    'Pas-de-Calais': 1232,
    Aisne: 2000,
    Somme: 922,
    Oise: 3000,
  },
};

const options = {
  name: 'Number of API requests',
  excludedKeys: ['Unknown'],
};

export default {
  title: 'charts/gv-chart-map',
  component: 'gv-chart-map',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-chart-map',
  events,
  css: `
    gv-chart-map {
      min-height: 200px;
    }
  `,
};

export const Basics = makeStory(conf, {
  items: [{ series, options }],
});

export const France = makeStory(conf, {
  items: [{ series: franceSeries, options: { ...options, ...{ zone: 'fr' } } }],
});

export const HautsDeFrance = makeStory(conf, {
  items: [{ series: hdfSeries, options: { ...options, ...{ zone: 'fr-hdf' } } }],
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
