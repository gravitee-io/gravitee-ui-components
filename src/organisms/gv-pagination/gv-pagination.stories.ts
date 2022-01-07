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
import './gv-pagination';
import { makeStory } from '../../../testing/lib/make-story';

export default {
  title: 'Organisms/gv-pagination',
  component: 'gv-pagination',
};

const conf = {
  component: 'gv-pagination',
};

export const Basics = makeStory(conf, {
  items: [
    {
      data: { first: 1, last: 1, total: 10, current_page: 1, total_pages: 10 },
    },
  ],
});

export const Medium = makeStory(conf, {
  items: [
    {
      'has-search': true,
      'has-select': true,
      medium: true,
      data: { first: 1, last: 1, total: 10, current_page: 1, total_pages: 10, size: 1, sizes: [5, 10, 25, 50, 100] },
    },
  ],
});

export const MoreThanTen = makeStory(conf, {
  items: [
    {
      data: { first: 1, last: 100, total: 100, current_page: 59, total_pages: 70 },
    },
  ],
});

export const NoData = makeStory(conf, {
  items: [{}],
});

export const HideEmpty = makeStory(conf, {
  items: [
    {
      'hide-empty': true,
      data: { first: 1, last: 1, total: 10, current_page: 1, total_pages: 1 },
    },
  ],
});

export const WithSearch = makeStory(conf, {
  items: [
    {
      'has-search': true,
      data: { first: 1, last: 1, total: 10, current_page: 1, total_pages: 10 },
    },
  ],
});

export const Selector = makeStory(conf, {
  items: [
    {
      'has-select': true,
      data: { first: 1, last: 1, total: 10, current_page: 1, total_pages: 10, sizes: [5, 10, 25, 50, 100] },
    },
  ],
});

export const Widget = makeStory(conf, {
  items: [
    {
      data: { first: 1, last: 1, total: 10, current_page: 1, total_pages: 10 },
      widget: true,
    },
  ],
});
