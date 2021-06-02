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
import '../../src/organisms/gv-menu';
import notes from '../../.docs/gv-menu.md';
import horizontalImage from '../../assets/images/gravitee-logo-cyan.svg';
import { makeStory, storyWait } from '../lib/make-story';

const events = ['gv-link:click', 'gv-input:input', 'gv-input:submit', 'gv-header:subscribe', 'gv-header:support'];

export default {
  title: 'Organisms/gv-menu',
  component: 'gv-menu',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-menu',
  events,
};
const routes = [
  { path: '#', title: 'Categories', icon: 'layout:layout-arrange' },
  { path: '#', title: 'Featured', active: true, icon: 'home:flower#2' },
  { path: '#', title: 'Starred', icon: 'home:flower#1' },
  { path: '#', title: 'Trendings', icon: 'appliances:fan' },
];

export const Basics = makeStory(conf, { items: [{ routes }] });

export const Sticky = makeStory(conf, { items: [{ routes, sticky: true }] });

export const Empty = makeStory(conf, { items: [{}] });

export const RightSlot = makeStory(conf, {
  items: [
    {
      routes: routes,
      innerHTML: '<gv-button slot="right" primary icon="code:plus">Create an app</gv-button>',
    },
  ],
});

export const TopSlot = makeStory(conf, {
  items: [
    {
      routes: routes,
      innerHTML: '<gv-header slot="top" can-subscribe></gv-header>',
    },
  ],
  simulations: [
    storyWait(0, ([component]) => {
      component.firstElementChild.item = {
        name: 'Long Supernova',
        picture: horizontalImage,
        version: 'v.1.1',
        states: [
          { value: 'beta', minor: true },
          { value: 'running', major: true },
        ],
      };

      component.firstElementChild.breadcrumbs = [
        { path: '#', title: 'Catalog' },
        { path: '#', title: 'Categories' },
        { path: '#', title: 'My API' },
      ];
    }),
  ],
});

export const TopSlotSticky = makeStory(conf, {
  items: [
    {
      routes: routes,
      innerHTML: '<gv-header slot="top" can-subscribe></gv-header>',
      sticky: true,
    },
  ],
  simulations: [
    storyWait(0, ([component]) => {
      component.firstElementChild.item = {
        name: 'Long Supernova',
        picture: horizontalImage,
        version: 'v.1.1',
        states: [
          { value: 'beta', minor: true },
          { value: 'running', major: true },
        ],
      };

      component.firstElementChild.breadcrumbs = [
        { path: '#', title: 'Catalog' },
        { path: '#', title: 'Categories' },
        { path: '#', title: 'My API' },
      ];
    }),
  ],
});

export const RightTransitionSlot = makeStory(conf, {
  items: [
    {
      routes: routes,
      innerHTML: '<gv-input slot="right-transition" type="search" placeholder="Rechercher une API, une APP..."></gv-input>',
    },
  ],
});

export const TopRightTransitionSlot = makeStory(conf, {
  items: [
    {
      routes: routes,
      innerHTML:
        '<gv-header slot="top" can-subscribe></gv-header>' +
        '<gv-input slot="right-transition" type="search" placeholder="Rechercher une API, une APP..."></gv-input>',
    },
  ],
  simulations: [
    storyWait(0, ([component]) => {
      component.firstElementChild.item = {
        name: 'Long Supernova',
        picture: horizontalImage,
        version: 'v.1.1',
        states: [
          { value: 'beta', minor: true },
          { value: 'running', major: true },
        ],
      };

      component.firstElementChild.breadcrumbs = [
        { path: '#', title: 'Catalog' },
        { path: '#', title: 'Categories' },
        { path: '#', title: 'My API' },
      ];
    }),
  ],
});

const options = [
  { label: 'Global Dashboard 1', value: '1' },
  { label: 'Dashboard 2', value: '2' },
  { label: 'Dashboard 3', value: '3' },
];

export const TopRightSlot = makeStory(conf, {
  items: [
    {
      routes: routes,
      innerHTML: '<gv-header slot="top" can-subscribe></gv-header>' + '<gv-select slot="right"></gv-select>',
    },
  ],
  simulations: [
    storyWait(0, ([component]) => {
      component.querySelector('gv-select').options = options;

      component.firstElementChild.item = {
        name: 'Long Supernova',
        picture: horizontalImage,
        version: 'v.1.1',
        states: [
          { value: 'beta', minor: true },
          { value: 'running', major: true },
        ],
      };

      component.firstElementChild.breadcrumbs = [
        { path: '#', title: 'Catalog' },
        { path: '#', title: 'Categories' },
        { path: '#', title: 'My API' },
      ];
    }),
  ],
});
