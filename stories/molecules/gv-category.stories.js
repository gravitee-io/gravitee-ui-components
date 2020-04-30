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
import '../../src/molecules/gv-category';
import notes from '../../.docs/gv-category.md';
import { makeStory, storyWait } from '../lib/make-story';
import picture from '../../assets/images/logo.png';

export default {
  title: 'Molecules|gv-category',
  component: 'gv-category',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-category',
};

const description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore '
  + 'et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo'
  + ' consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et '
  + 'dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex '
  + 'ea commodo consequat.';

const category = { name: 'Truncated description if > 4 lines (Default)', description, _links: { picture }, total_apis: 5 };
const items = [
  { category: { name: 'Title', total_apis: 0 } },
  { category },
  { category: { name: 'Title + description + description limit', description, total_apis: 132 }, limit: 150 },
];

export const Basics = makeStory(conf, {
  items,
});

export const empty = makeStory(conf, {
  items: [{}],
});

export const loading = makeStory(conf, {
  items: [{ category: null }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.category = category;
    }),
  ],
});

export const loadingAndError = makeStory(conf, {
  items: [{ category: null }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.category = Promise.reject(new Error());
    }),
  ],
});
