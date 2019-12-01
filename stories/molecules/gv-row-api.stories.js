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
import notes from '../../.docs/gv-row-api.md';
import '../../src/molecules/gv-row-api';
import { delay } from '../lib/delay';
import horizontalImage from '../../assets/images/gravitee-logo-darker.png';
import picture from '../../assets/images/logo.png';
import { withActions } from '@storybook/addon-actions';
import { color } from '@storybook/addon-knobs';

const eventNames = ['click gv-row-api'];

const name = 'Supernova';
const version = 'v.1.1';
const states = [{ value: 'beta', minor: true }, { value: 'running', major: true }];
const owner = { display_name: 'Garry Marshall' };
const description = 'Tempore quo primis auspiciis in mundanum fulgorem surgeret victura dum erunt homines Roma, '
  + 'ut augeretur sublimibus incrementis, foedere pacis aeternae Virtus convenit atque  plerumque dissidentes,';
const labels = [{ value: 'beta', minor: true }, { value: 'Custom', major: true }, { value: 'web' }];
const api = { name: 'Long Supernova', picture: horizontalImage, version, states, owner, labels, description };
storiesOf('2. Molecules|<gv-row-api>', module)
  .addParameters({ notes })
  .add('Basics', () => withActions(...eventNames)(() => {

    const container = document.createElement('div');

    container.innerHTML = `
    <div class="title">Basics</div>
    <gv-row-api id="name"></gv-row-api>
    <gv-row-api id="horizontalImage"></gv-row-api>
    <gv-row-api id="image"></gv-row-api>
    
    <div class="title">Skeleton & Delay</div>
    <gv-row-api></gv-row-api>
    <gv-row-api id="delay"></gv-row-api>
    `;

    const bgColor = color('--gv-row-api--bgc', '');

    container.style = [
      { value: bgColor, prop: '--gv-row-api--bgc' }]
      .filter(({ value }) => value)
      .map(({ value, prop }) => `${prop}:${value}`)
      .join(';');

    const delayElement = container.querySelector('#delay');
    delayElement.title = Promise.resolve('Slow api').then(delay(2000));

    container.querySelector('#name').api = Promise.resolve({ name, owner });
    container.querySelector('#horizontalImage').api = Promise.resolve(api);
    container.querySelector('#image').api = Promise.resolve({ name: 'Comet Api.', picture, version, states, owner, labels, description });
    container.querySelector('#delay').api = Promise.resolve(api).then(delay(2000));
    return container;
  }))
  .add('Errors', () => withActions(...eventNames)(() => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title">Empty</div>
      <gv-row-api id="empty"></gv-row-api>
    
      <div class="title">Error</div>
      <gv-row-api id="error"></gv-row-api>
    `;
    container.querySelector('#empty').api = Promise.resolve({});
    container.querySelector('#error').api = Promise.reject(new Error());
    return container;
  }));
