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
import './gv-chart-gauge-progress';
import { makeStory } from '../../../testing/lib/make-story';

const events = ['gv-chart-gauge:select'];

export default {
  title: 'charts/gv-chart-gauge-progress',
  component: 'gv-chart-gauge-progress',
  parameters: {
    chromatic: { disable: true },
  },
};

const conf = {
  component: 'gv-chart-gauge-progress',
  events,
  css: `
  :host {
    height: 300px;
  }
`,
};

const series = [
  {
    data: [
      {
        color: 'var(--gv-theme-color-info)',
        radius: '112%',
        innerRadius: '88%',
        y: 0,
      },
    ],
  },
];

export const Basics = makeStory(conf, {
  items: [{ series, max: 60 * 1000 }],
});
