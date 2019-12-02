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
import '../../src/organisms/gv-menu.js';
import notes from '../../.docs/gv-menu.md';
import { storiesOf } from '@storybook/html';
import { withCustomEventActions } from '../lib/event-action.js';
import { color, text } from '@storybook/addon-knobs';

const withActions = withCustomEventActions('gv-nav-link:click', 'gv-input:input', 'gv-input:submit');

storiesOf('3. Organisms|<gv-menu>', module)
  .addParameters({ notes })
  .add('Basics', withActions(() => {

    const menu = document.createElement('gv-menu');
    menu.routes = [
      { path: '#', title: 'All', active: true, icon: 'home:flower#2' },
      { path: '#', title: 'Categories', icon: 'layout:layout-arrange' },
    ];

    const bgc = color('--gv-menu--bgc', '');
    const c = color('--gv-menu--c', '');
    const b = text('--gv-menu-link-active--bdb', '');
    const pl = text('--gv-menu--pl', '');
    const pr = text('--gv-menu--pr', '');

    menu.style = [
      { value: bgc, prop: '--gv-menu--bgc' },
      { value: c, prop: '--gv-menu--c' },
      { value: b, prop: '--gv-menu-link-active--bdb' },
      { value: pl, prop: '--gv-menu--pl' },
      { value: pr, prop: '--gv-menu--pr' },
    ]
      .filter(({ value }) => value)
      .map(({ value, prop }) => `${prop}:${value}`)
      .join(';');

    return menu;
  }))
  .add('Empty', withActions(() => {
    const menu = document.createElement('gv-menu');
    return menu;
  }))
  .add('With search', withActions(() => {
    const menu = document.createElement('gv-menu');

    menu.routes = [
      { path: '#', title: 'Categories', icon: 'layout:layout-arrange' },
      { path: '#', title: 'Featured', active: true, icon: 'home:flower#2' },
      { path: '#', title: 'Starred', icon: 'home:flower#1' },
      { path: '#', title: 'Trendings', icon: 'appliances:fan' },
    ];

    menu.innerHTML = `
        <p slot="right"><gv-input style="width: 100%" type="search" placeholder="Rechercher une API, une APP..."></gv-input></p>
    `;

    return menu;
  }))
  .add('Small', withActions(() => {
    const menu = document.createElement('gv-menu');

    menu.routes = [
      { path: '#', title: 'Categories', icon: 'layout:layout-arrange' },
      { path: '#', title: 'Featured', active: true, icon: 'home:flower#2' },
      { path: '#', title: 'Starred', icon: 'home:flower#1' },
      { path: '#', title: 'Trendings', icon: 'appliances:fan' },
    ];
    menu.small = true;
    menu.innerHTML = `
        <p slot="right"><gv-input style="width: 100%" type="search" placeholder="Rechercher une API, une APP..."></gv-input></p>
    `;

    return menu;
  }));
