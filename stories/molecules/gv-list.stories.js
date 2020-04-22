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
import notes from '../../.docs/gv-list.md';
import '../../src/molecules/gv-list';
import logo from '../../assets/images/logo.png';
import { makeStory, storyWait } from '../lib/make-story';

const api1 = { name: 'Long Supernova', description: 'short description about items', version: '1.0.0' };
const api2 = { name: 'Long Supernova 2', description: 'another descriptions', version: '2.0.0' };
const api3 = { name: 'Long Supernova 3', description: 'short description', version: '3.0.0', picture: logo };
const items = [{ item: api1 }, { item: api2 }, { item: api3 }];

export default {
  title: 'Molecules|gv-list',
  component: 'gv-list',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-list',
};

export const basics = makeStory(conf, {
  items: [{ items, title: 'Basic items' }],
});

export const withLinks = makeStory(conf, {
  items: [{ items, title: 'Items with link', clickable: true }],
});

export const empty = makeStory(conf, {
  items: [{}],
});

export const loading = makeStory(conf, {
  items: [{ items: new Promise(() => ([])), 'with-dc': true }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.items = items;
      component.title = 'Wait items';
    }),
  ],
});

export const loadingAndError = makeStory(conf, {
  items: [{ items: new Promise(() => ([])), resources: {}, 'with-dc': true }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.items = Promise.reject(new Error());
    }),
  ],
});
