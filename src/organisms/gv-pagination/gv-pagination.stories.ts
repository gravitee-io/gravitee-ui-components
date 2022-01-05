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

export const Large = makeStory(conf, {
  items: [
    {
      data: { first: 1, last: 100, total: 100, current_page: 59, total_pages: 70 },
    },
  ],
});

export const Empty = makeStory(conf, {
  items: [{}],
});

export const Widget = makeStory(conf, {
  items: [
    {
      data: { first: 1, last: 1, total: 10, current_page: 1, total_pages: 10 },
      widget: true,
    },
  ],
});
