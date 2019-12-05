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
import notes from '../../.docs/gv-card-api-full.md';
import '../../src/molecules/gv-card-api-full';
import { delay } from '../lib/delay';
import horizontalImage from '../../assets/images/gravitee-logo-darker.png';
import picture from '../../assets/images/logo.png';
import { withActions } from '@storybook/addon-actions';
import { color } from '@storybook/addon-knobs';

const eventNames = ['click gv-card-api-full'];

const name = 'Supernova';
const description = 'Tempore quo primis auspiciis in mundanum fulgorem surgeret victura dum erunt homines Roma, '
  + 'ut augeretur sublimibus incrementis, foedere pacis aeternae Virtus convenit atque  plerumque dissidentes,';

const version = 'v.1.1';

const states = [{ value: 'beta' }, { value: 'running', major: true }];
const ratingSummary = { average: 3.4, count: 124 };
const labels = [{ value: 'APIDays', major: true }, { value: 'December', minor: true }, { value: 'Foobar' }];
const metrics = Promise.resolve({ hits: '11M+', subscribers: '689', health: '0.95' });
const api = Promise.resolve({ name, description, version, states, labels, rating_summary: ratingSummary });
storiesOf('2. Molecules|<gv-card-api-full>', module)
  .addParameters({ notes })
  .add('Basics', () => withActions(...eventNames)(() => {

    const container = document.createElement('div');

    container.innerHTML = `
    <div class="title">Basics</div>
    <gv-card-api-full id="basic"></gv-card-api-full>
    <gv-card-api-full id="horizontalImage"></gv-card-api-full>
    <gv-card-api-full id="withoutMetrics"></gv-card-api-full>
    `;

    const bgColor = color('--gv-card-api-full--bgc', '');

    container.style = [
      { value: bgColor, prop: '--gv-card-api-full--bgc' }]
      .filter(({ value }) => value)
      .map(({ value, prop }) => `${prop}:${value}`)
      .join(';');

    container.querySelector('#basic').api = api;
    container.querySelector('#basic').metrics = metrics;
    container.querySelector('#horizontalImage').api = Promise.resolve({
      name: 'Long Supernova with empty description',
      description,
      version,
      _links: { picture: horizontalImage },
    });
    container.querySelector('#withoutMetrics').api = api;

    return container;
  })).add('Skeleton / Delay', () => withActions(...eventNames)(() => {

    const container = document.createElement('div');

    container.innerHTML = `
    <div class="title">Skeleton</div>
    <gv-card-api-full></gv-card-api-full>
    <div class="title">Delay</div>
    <gv-card-api-full id="delay"></gv-card-api-full>
    `;

    container.querySelector('#delay').api = Promise.resolve({
      name,
      description,
      version,
      states,
      labels,
      rating_summary: ratingSummary,
      _links: { picture },
    }).then(delay(2000));

    container.querySelector('#delay').metrics = metrics.then(delay(3000));

    return container;
  }))
  .add('Empty / Errors', () => withActions(...eventNames)(() => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title">Empty</div>
      <gv-card-api-full id="empty"></gv-card-api-full>
    
      <div class="title">Error</div>
      <gv-card-api-full id="error"></gv-card-api-full>
    `;
    container.querySelector('#empty').api = Promise.resolve({});
    container.querySelector('#empty').metrics = Promise.resolve({});

    container.querySelector('#error').api = Promise.reject(new Error());
    container.querySelector('#error').metrics = Promise.reject(new Error());
    return container;
  }));
