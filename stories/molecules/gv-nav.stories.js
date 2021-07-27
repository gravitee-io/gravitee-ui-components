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
import '../../src/molecules/gv-nav';
import { makeStory } from '../lib/make-story';

export default {
  title: 'Molecules/gv-nav',
  component: 'gv-nav',
};

const conf = {
  component: 'gv-nav',
};

const routes = [
  { path: '', title: 'Dashboard' },
  { path: '', title: 'Catalogue', active: true },
  { path: '', title: 'Mes applications' },
];

export const basics = makeStory(conf, {
  items: [
    {
      routes: routes,
    },
  ],
});

export const vertical = makeStory(conf, {
  items: [
    {
      routes: routes,
      vertical: true,
    },
  ],
});
