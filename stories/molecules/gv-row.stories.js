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
import notes from '../../.docs/gv-row.md';
import '../../src/molecules/gv-row';
import { delay } from '../lib/delay';
import horizontalImage from '../../assets/images/gravitee-logo-darker.png';
import picture from '../../assets/images/logo.png';
import { withActions } from '@storybook/addon-actions';
import { color } from '@storybook/addon-knobs';

const eventNames = ['click gv-row'];

const name = 'Supernova';
const version = 'v.1.1';
const states = [{ value: 'beta', minor: true }, { value: 'running', major: true }];
const owner = { display_name: 'Garry Marshall' };
const description = 'Tempore quo primis auspiciis in mundanum fulgorem surgeret victura dum erunt homines Roma, '
  + 'ut augeretur sublimibus incrementis, foedere pacis aeternae Virtus convenit atque  plerumque dissidentes,';
const labels = ['brta', 'custom', 'web'];
const api = { name: 'Long Supernova', picture: horizontalImage, version, states, owner, labels, description };
storiesOf('2. Molecules|<gv-row>', module)
  .addParameters({ notes })
  .add('Basics', () => withActions(...eventNames)(() => {

    const container = document.createElement('div');

    container.innerHTML = `
    <div class="title">Basics</div>
    <gv-row id="name"></gv-row>
    <gv-row id="horizontalImage"></gv-row>
    <gv-row id="image"></gv-row>

    <div class="title">Skeleton & Delay</div>
    <gv-row></gv-row>
    <gv-row id="delay"></gv-row>
    `;

    const bgColor = color('--gv-row--bgc', '');

    container.style = [
      { value: bgColor, prop: '--gv-row--bgc' }]
      .filter(({ value }) => value)
      .map(({ value, prop }) => `${prop}:${value}`)
      .join(';');

    const delayElement = container.querySelector('#delay');
    delayElement.title = Promise.resolve('Slow api').then(delay(2000));

    container.querySelector('#name').item = Promise.resolve({ name, owner });
    container.querySelector('#horizontalImage').item = Promise.resolve(api);
    container.querySelector('#image').item = Promise.resolve({ name: 'Comet Api.', picture, version, states, owner, labels, description });
    container.querySelector('#delay').item = Promise.resolve(api).then(delay(2000));
    return container;
  }))
  .add('Errors', () => withActions(...eventNames)(() => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title">Empty</div>
      <gv-row id="empty"></gv-row>

      <div class="title">Error</div>
      <gv-row id="error"></gv-row>
    `;
    container.querySelector('#empty').item = Promise.resolve({});
    container.querySelector('#error').item = Promise.reject(new Error());
    return container;
  }));
