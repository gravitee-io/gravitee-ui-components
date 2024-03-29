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
import './gv-category-list';
import { makeStory, storyWait } from '../../../testing/lib/make-story';
import picture from '../../../assets/images/avatar.png';

const description =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
const categories = [
  {
    name: 'Title',
    _links: { picture },
  },
  {
    name: 'Truncated description if > 4 lines (Default)',
    description,
  },
  {
    name: 'Title + description',
    description,
    limit: 100,
    _links: { picture },
  },
  {
    name: 'Title',
  },
  {
    name: 'Truncated description if > 4 lines (Default)',
    description,
  },
  {
    name: 'Title + description',
    description,
  },
  {
    name: 'Title',
  },
  {
    name: 'Truncated description if > 4 lines (Default)',
    description,
    _links: { picture },
  },
  {
    name: 'Title + description',
    description,
  },
];

export default {
  title: 'Molecules/gv-category-list',
  component: 'gv-category-list',
  parameters: {
    chromatic: { delay: 2500 },
  },
};

const conf = {
  component: 'gv-category-list',
  events: ['gv-category:click'],
};

export const basics = makeStory(conf, {
  items: [{ items: categories }],
});

export const empty = makeStory(conf, {
  items: [{}],
});

export const loading = makeStory(conf, {
  items: [{ items: new Array(categories.length) }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.items = categories;
    }),
  ],
});

export const loadingAndError = makeStory(conf, {
  items: [{ items: new Array(categories.length) }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.items = categories.map(() => Promise.reject(new Error()));
    }),
  ],
});
