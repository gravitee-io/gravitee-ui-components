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
import notes from '../../.docs/gv-list.md';
import '../../src/molecules/gv-list';
import { delay } from '../lib/delay';
import { color } from '@storybook/addon-knobs';
import logo from '../../assets/images/logo.png';

const item = { name: 'Long Supernova', description: 'short description about items' };
const item2 = { name: 'Long Supernova 2', description: 'another descriptions' };
const item3 = { name: 'Long Supernova 3', description: 'short description', picture: logo };
const items = Promise.resolve([item, item2, item3]);
storiesOf('2. Molecules|<gv-list>', module)
  .addParameters({ notes })
  .add('Basics', () => {

    const container = document.createElement('div');

    container.innerHTML = `
    <div style="display:flex;">
      <div style="margin: 10px;">
        <div class="title">Basics</div>
        <gv-list id="basics"></gv-list>
      </div>
      <div style="margin: 10px;">
        <div class="title">Skeleton </div>
        <gv-list></gv-list>
      </div>
      <div style="margin: 10px;">
        <div class="title">Delay</div>
        <gv-list id="delay"></gv-list>
      </div>
    </div>
    `;

    const bgColor = color('--gv-list--bgc', '');

    container.style = [
      { value: bgColor, prop: '--gv-list--bgc' }]
      .filter(({ value }) => value)
      .map(({ value, prop }) => `${prop}:${value}`)
      .join(';');

    container.querySelector('#basics').items = items;
    container.querySelector('#basics').title = 'Basics items';

    container.querySelector('#delay').items = items.then(delay(2000));
    container.querySelector('#delay').title = 'Delayed items';

    return container;
  })
  .add('Errors', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title">Empty</div>
      <gv-list id="empty"></gv-list>
    
      <div class="title">Error</div>
      <gv-list id="error"></gv-list>
    `;
    container.querySelector('#empty').items = Promise.resolve([]);
    container.querySelector('#error').items = Promise.reject(new Error());
    return container;
  });
