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
import './gv-vertical-menu';
import { makeStory } from '../../../testing/lib/make-story';
import logo from '../../../assets/images/gravitee-g-logo-cyan.svg';

const events = ['gv-link:click', 'gv-input:input', 'gv-input:submit', 'gv-header:subscribe', 'gv-header:support'];

export default {
  title: 'Organisms/gv-vertical-menu',
  component: 'gv-vertical-menu',
};

const conf = {
  component: 'gv-vertical-menu',
  events,
};
const routes = [
  { path: '#', title: 'Categories', icon: 'layout:layout-arrange' },
  { path: '#', title: 'Featured', active: true, icon: 'home:flower#2' },
  { path: '#', title: 'Starred', icon: 'home:flower#1' },
  { path: '#', title: 'My very long category that breaks the menu', icon: 'cooking:cooking-book' },
  { path: '#', title: 'Trendings', icon: 'appliances:fan' },
];
const items = [{ routes }];

export const Basics = makeStory(conf, { items });

const itemsWithLogo = [
  {
    routes: routes,
    logo: logo,
  },
];

export const WithLogo = makeStory(conf, { items: itemsWithLogo });
