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
import notes from '../../.docs/gv-card-api.md';
import '../../src/molecules/gv-card-api';
import { delay } from '../lib/delay';
import horizontalImage from '../../assets/images/gravitee-logo-darker.png';
import picture from '../../assets/images/logo.png';
import { withActions } from '@storybook/addon-actions';
import { color } from '@storybook/addon-knobs';

const eventNames = ['click gv-card-api'];

const name = 'Supernova';
const version = 'v.1.1';
const states = [{ value: 'beta', minor: true }, { value: 'running', major: true }];
const api = { name: 'Long Supernova', picture: horizontalImage, version, states };
storiesOf('2. Molecules|<gv-card-api>', module)
  .addParameters({ notes })
  .add('Basics', () => withActions(...eventNames)(() => {

    const container = document.createElement('div');

    container.innerHTML = `
    <div class="title">Basics</div>
    <gv-card-api id="name"></gv-card-api>
    <gv-card-api id="horizontalImage"></gv-card-api>
    <gv-card-api id="image"></gv-card-api>
    
    <div class="title">Skeleton & Delay</div>
    <gv-card-api></gv-card-api>
    <gv-card-api id="delay"></gv-card-api>
    `;

    const bgColor = color('--gv-card-api--bgc', '');

    container.style = [
      { value: bgColor, prop: '--gv-card-api--bgc' }]
      .filter(({ value }) => value)
      .map(({ value, prop }) => `${prop}:${value}`)
      .join(';');

    const delayElement = container.querySelector('#delay');
    delayElement.title = Promise.resolve('Slow api').then(delay(2000));

    container.querySelector('#name').api = Promise.resolve({ name });
    container.querySelector('#horizontalImage').api = Promise.resolve(api);
    container.querySelector('#image').api = Promise.resolve({ name: 'Comet Api.', picture, version, states });
    container.querySelector('#delay').api = Promise.resolve(api).then(delay(2000));
    return container;
  }))
  .add('Errors', () => withActions(...eventNames)(() => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title">Empty</div>
      <gv-card-api id="empty"></gv-card-api>
    
      <div class="title">Error</div>
      <gv-card-api id="error"></gv-card-api>
    `;
    container.querySelector('#empty').api = Promise.resolve({});
    container.querySelector('#error').api = Promise.reject(new Error());
    return container;
  }));
