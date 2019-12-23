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
import horizontalImage from '../../assets/images/gravitee-logo-darker.png';

const withActions = withCustomEventActions('gv-link:click', 'gv-input:input', 'gv-input:submit', 'gv-header-api:subscribe', 'gv-header-api:support');

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
        <gv-input slot="right" type="search" placeholder="Rechercher une API, une APP..."></gv-input>
    `;

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
        <gv-input slot="right" type="search" placeholder="Rechercher une API, une APP..."></gv-input>
    `;

    return menu;
  }))
  .add('With header', withActions(() => {
    const routes = [
      { path: '#', title: 'Categories', icon: 'layout:layout-arrange' },
      { path: '#', title: 'Featured', active: true, icon: 'home:flower#2' },
      { path: '#', title: 'Starred', icon: 'home:flower#1' },
      { path: '#', title: 'Trendings', icon: 'appliances:fan' },
    ];

    const breadcrumbs = [
      { path: '#', title: 'Catalog' },
      { path: '#', title: 'Categories' },
      { path: '#', title: 'My API' },
    ];

    const version = 'v.1.1';
    const states = [{ value: 'beta', minor: true }, { value: 'running', major: true }];
    const api = { name: 'Long Supernova', picture: horizontalImage, version, states };

    const container = document.createElement('div');
    container.innerHTML = `
        <div class="title">Full screen</div>
        <gv-menu>
            <gv-header-api slot="header" can-subscribe></gv-header-api>
            <gv-input slot="right" type="search" placeholder="Rechercher une API, une APP..."></gv-input>
        </gv-menu>
        
        <div class="title">Width: 1280px</div>
        <div style="width: 1280px;">
          <gv-menu>
              <gv-header-api slot="header" can-subscribe></gv-header-api>
              <gv-input slot="right" type="search" placeholder="Rechercher une API, une APP..."></gv-input>
          </gv-menu>
        </div>
        
        <div class="title">Width: 1024px</div>
        <div style="width: 1024px;">
          <gv-menu>
              <gv-header-api slot="header" can-subscribe></gv-header-api>
              <gv-input slot="right" type="search" placeholder="Rechercher une API, une APP..."></gv-input>
          </gv-menu>
        </div>
        
        <div class="title">Width: 768px</div>
        <div style="width: 768px;">
          <gv-menu>
              <gv-header-api slot="header" can-subscribe></gv-header-api>
              <gv-input slot="right" type="search" placeholder="Rechercher une API, une APP..."></gv-input>
          </gv-menu>
        </div>

        <div class="title">Width: 570px</div>
        <div style="width: 570px;">
          <gv-menu>
              <gv-header-api slot="header" can-subscribe></gv-header-api>
              <gv-input slot="right" type="search" placeholder="Rechercher une API, une APP..."></gv-input>
          </gv-menu>
        </div>
                
        <div class="title">Width: 375px</div>
        <div style="width: 375px;">
          <gv-menu>
              <gv-header-api slot="header" can-subscribe></gv-header-api>
              <gv-input slot="right" type="search" placeholder="Rechercher une API, une APP..."></gv-input>
          </gv-menu>
        </div>
    `;

    container.querySelectorAll('gv-menu').forEach((menu) => {
      menu.routes = routes;
      menu.querySelector('gv-header-api').api = api;
      menu.querySelector('gv-header-api').breadcrumbs = breadcrumbs;
    });

    return container;
  }))
;
