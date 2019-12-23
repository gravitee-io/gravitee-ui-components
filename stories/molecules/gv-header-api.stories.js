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
import { storiesOf } from '@storybook/html';
import notes from '../../.docs/gv-header-api.md';
import '../../src/molecules/gv-header-api';
import { delay } from '../lib/delay';
import picture from '../../assets/images/logo.png';
import { color } from '@storybook/addon-knobs';
import { withCustomEventActions } from '../lib/event-action.js';

const withActions = withCustomEventActions('gv-header-api:subscribe', 'gv-header-api:contact', 'gv-link:click');

const version = 'v.1.1';
const states = [{ value: 'beta', minor: true }, { value: 'running', major: true }];
const api = { name: 'Long Supernova', _links: { picture }, version, states };
storiesOf('2. Molecules|<gv-header-api>', module)
  .addParameters({ notes })
  .add('Basics', withActions(() => {

    const container = document.createElement('div');

    container.innerHTML = `
    <div class="title">Basics</div>
    <gv-header-api class="name"></gv-header-api>
    <br/>
    <div class="title">With actions</div>
    <gv-header-api class="name" can-subscribe></gv-header-api>
    
    <br/>
    <div class="title"> Width: 768px </div>
    <div style="width: 768px;"> <gv-header-api class="name" can-subscribe></gv-header-api></div>
    `;

    const breadcrumbs = [
      { path: '#', title: 'Catalog' },
      { path: '#', title: 'Categories' },
      { path: '#', title: 'My API' },
    ];

    const bgColor = color('--gv-header-api--bgc', '');

    container.style = [
      { value: bgColor, prop: '--gv-header-api--bgc' }]
      .filter(({ value }) => value)
      .map(({ value, prop }) => `${prop}:${value}`)
      .join(';');

    container.querySelectorAll('.name').forEach((element) => {
      element.api = Promise.resolve(api);
      element.breadcrumbs = Promise.resolve(breadcrumbs);
    });

    return container;
  }))
  .add('Skeleton / Delay', withActions(() => {
    const container = document.createElement('div');

    container.innerHTML = `
    <div class="title">Delay</div>
    <gv-header-api class="name" can-subscribe></gv-header-api>
    <br/>
    <div class="title">Skeleton</div>
    <gv-header-api></gv-header-api>
    `;

    const breadcrumbs = [
      { path: '#', title: 'Catalog' },
      { path: '#', title: 'Categories' },
      { path: '#', title: 'My API' },
    ];

    container.querySelectorAll('.name').forEach((element) => {
      element.api = Promise.resolve(api).then(delay(3000));
      element.breadcrumbs = Promise.resolve(breadcrumbs).then(delay(2000));
    });

    return container;
  }))
  .add('Errors', withActions(() => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title">Empty</div>
      <gv-header-api id="empty"></gv-header-api>
    
      <div class="title">Error</div>
      <gv-header-api id="error"></gv-header-api>
    `;
    container.querySelector('#empty').api = Promise.resolve({});
    container.querySelector('#error').api = Promise.reject(new Error());
    return container;
  }));
