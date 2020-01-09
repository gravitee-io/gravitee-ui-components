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
import notes from '../../.docs/gv-card-full.md';
import '../../src/molecules/gv-card-full';
import { delay } from '../lib/delay';
import horizontalImage from '../../assets/images/gravitee-logo-darker.png';
import picture from '../../assets/images/logo.png';
import { withActions } from '@storybook/addon-actions';
import { color } from '@storybook/addon-knobs';

const eventNames = ['click gv-card-full'];

const name = 'Supernova';
const description = 'Tempore quo primis auspiciis in mundanum fulgorem surgeret victura dum erunt homines Roma, '
  + 'ut augeretur sublimibus incrementis, foedere pacis aeternae Virtus convenit atque  plerumque dissidentes,';

const version = 'v.1.1';

const states = [{ value: 'beta' }, { value: 'running', major: true }];
const ratingSummary = { average: 3.4, count: 124 };
const labels = ['APIDays', 'December', 'Foobar'];
const metrics = Promise.resolve({ hits: '11M+', subscribers: '689', health: '0.95' });
const applicationMetrics = Promise.resolve({ subscribers: '3' });
const api = Promise.resolve({ name, description, version, states, labels, rating_summary: ratingSummary });
const application = Promise.resolve({ name, description, applicationType: 'Web' });
storiesOf('2. Molecules|<gv-card-full>', module)
  .addParameters({ notes })
  .add('APIs', () => withActions(...eventNames)(() => {

    const container = document.createElement('div');

    container.innerHTML = `
    <div class="title">Basics</div>
    <gv-card-full id="basic"></gv-card-full>
    <gv-card-full id="horizontalImage"></gv-card-full>
    <gv-card-full id="withoutMetrics"></gv-card-full>
    `;

    const bgColor = color('--gv-card-full--bgc', '');

    container.style = [
      { value: bgColor, prop: '--gv-card-full--bgc' }]
      .filter(({ value }) => value)
      .map(({ value, prop }) => `${prop}:${value}`)
      .join(';');

    container.querySelector('#basic').item = api;
    container.querySelector('#basic').metrics = metrics;
    container.querySelector('#horizontalImage').item = Promise.resolve({
      name: 'Long Supernova with empty description',
      description,
      version,
      _links: { picture: horizontalImage },
    });
    container.querySelector('#withoutMetrics').item = api;

    return container;
  }))
  .add('Applications', () => withActions(...eventNames)(() => {

    const container = document.createElement('div');

    container.innerHTML = `
    <div class="title">Basics</div>
    <gv-card-full id="basic"></gv-card-full>
    <gv-card-full id="horizontalImage"></gv-card-full>
    <gv-card-full id="withoutMetrics"></gv-card-full>
    `;

    const bgColor = color('--gv-card-full--bgc', '');

    container.style = [
      { value: bgColor, prop: '--gv-card-full--bgc' }]
      .filter(({ value }) => value)
      .map(({ value, prop }) => `${prop}:${value}`)
      .join(';');

    container.querySelector('#basic').item = application;
    container.querySelector('#basic').metrics = applicationMetrics;
    container.querySelector('#horizontalImage').item = Promise.resolve({
      name: 'Long Supernova with empty description',
      description,
      _links: { picture: horizontalImage },
    });
    container.querySelector('#withoutMetrics').item = application;

    return container;
  })).add('Skeleton / Delay', () => withActions(...eventNames)(() => {

    const container = document.createElement('div');

    container.innerHTML = `
    <div class="title">Skeleton</div>
    <gv-card-full></gv-card-full>
    <div class="title">Delay</div>
    <gv-card-full id="delay"></gv-card-full>
    `;

    container.querySelector('#delay').item = Promise.resolve({
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
      <gv-card-full id="empty"></gv-card-full>

      <div class="title">Error</div>
      <gv-card-full id="error"></gv-card-full>
    `;
    container.querySelector('#empty').item = Promise.resolve({});
    container.querySelector('#empty').metrics = Promise.resolve({});

    container.querySelector('#error').item = Promise.reject(new Error());
    container.querySelector('#error').metrics = Promise.reject(new Error());
    return container;
  }));
