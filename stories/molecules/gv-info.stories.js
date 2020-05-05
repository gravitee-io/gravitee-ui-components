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
import notes from '../../.docs/gv-info.md';
import '../../src/molecules/gv-info';
import logo from '../../assets/icons/gravitee/graviteeio.svg';
import { makeStory, storyWait } from '../lib/make-story';

const views = ['Azure', 'Swiss', 'All', 'Magic'];
const ratingSummary = { average: 3.4 };
const labels = ['APIDays', 'December', 'Foobar'];
const resources = [
  { title: 'Homepage', link: '#' },
  { title: 'Repository', link: '#' },
  { title: 'Licence', link: '#' },
  { title: 'Changelog', link: '#', target: '_self' },
  { title: 'Download Extension', link: '#', target: '_blank' },
];

const miscellaneous = [
  { key: 'Version:', value: 'v1' },
  { key: 'Released:', value: '2019-12-25, 12:00PM' },
  { key: 'Last Update:', value: '2019-12-25, 12:00PM' },
  { key: 'Publisher:', value: 'Richard T.' },
];
const metrics = Promise.resolve({ hits: '11M+', subscribers: '689', health: '0.95' });
const api = {
  name: 'Long Supernova',
  views,
  rating_summary: ratingSummary,
  labels,
  version: 'v1',
  description:
    'Hinc ille commotus ut iniusta perferens et indigna pra custodiam protectoribus mandaverat fidis '
    + 'quo con perto Montius tunc. nc ille commotus ut iniusta perferens et indigna pra custodiam protectoribus '
    + 'mandaverat fidis quo con perto Montius tunc.',
  _links: {
    picture: logo,
  },
};

export default {
  title: 'Molecules|gv-info',
  component: 'gv-info',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-info',
};

export const simple = makeStory(conf, {
  items: [{ item: api }],
});

export const withResources = makeStory(conf, {
  items: [{ item: api, resources }],
});

export const withMiscellaneous = makeStory(conf, {
  items: [{ item: api, resources, miscellaneous }],
});

export const withMetrics = makeStory(conf, {
  items: [{ item: api, resources, miscellaneous, metrics }],
});

export const withTitleAndPicture = makeStory(conf, {
  items: [{ item: api, resources, miscellaneous, metrics, 'with-dc': true }],
});

export const empty = makeStory(conf, {
  items: [{ item: {} }],
});

let itemResolver;
export const loading = makeStory(conf, {
  items: [{ }],
  simulations: [
    storyWait(0, ([component]) => {
      component.item = new Promise((resolve) => (itemResolver = resolve));
    }),
    storyWait(750, ([component]) => {
      itemResolver(api);
      component.resources = resources;
      component.miscellaneous = miscellaneous;
      component['with-dc'] = true;
    }),
  ],
});

export const loadingAndError = makeStory(conf, {
  items: [{ }],
  simulations: [
    storyWait(0, ([component]) => {
      component.item = new Promise((resolve, reject) => (itemResolver = reject));
    }),
    storyWait(750, ([component]) => {
      itemResolver({});
      component.resources = resources;
      component.miscellaneous = miscellaneous;
      component['with-dc'] = true;
    }),
  ],
});
