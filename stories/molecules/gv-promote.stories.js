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
import notes from '../../.docs/gv-promote.md';
import '../../src/molecules/gv-promote';
import { delay } from '../lib/delay';
import { withActions } from '@storybook/addon-actions';
import { color } from '@storybook/addon-knobs';
import horizontalImage from '../../assets/images/gravitee-logo-darker.png';
import picture from '../../assets/images/logo.png';

const eventNames = ['gv-promote:click'];

const name = 'supernova cloud';
const description = 'Tempore quo primis auspiciis in mundanum fulgorem surgeret victura dum erunt homines Roma, '
  + 'ut augeretur sublimibus incrementis, foedere pacis aeternae Virtus convenit atque  plerumque dissidentes,';

const ratingSummary = { average: 3.2, count: 345 };
const metrics = Promise.resolve({ hits: '11M+', subscribers: '689', health: '0.95' });
const version = 'v1.1';
const labels = ['APIDays', 'December', 'Foobar'];
storiesOf('2. Molecules|<gv-promote>', module)
  .addParameters({ notes })
  .add('Basics', () => withActions(...eventNames)(() => {

    const container = document.createElement('div');

    container.innerHTML = `
        <div class="title">Default picture</div>
        <gv-promote id="defaultPicture"> </gv-promote>
        <div class="title">With picture</div>
        <gv-promote id="withPicture"></gv-promote>
        <div class="title">With horizontal picture</div>
        <gv-promote id="withHorizontalPicture"></gv-promote>
        <div class="title">With labels</div>
        <gv-promote id="withLabels"></gv-promote>
    `;

    const bgColor = color('--gv-promote--bgc', '');
    const bgImgColor = color('--gv-promote-image--bgc', '');
    const btnBgColor = color('--gv-button--bgc', '');

    container.style = [
      { value: bgColor, prop: '--gv-promote--bgc' },
      { value: bgImgColor, prop: '--gv-promote-image--bgc' },
      { value: btnBgColor, prop: '--gv-button--bgc' }]
      .filter(({ value }) => value)
      .map(({ value, prop }) => `${prop}:${value}`)
      .join(';');

    container.querySelector('#defaultPicture').item = Promise.resolve({
      name,
      description,
      version,
    });
    container.querySelector('#withPicture').item = Promise.resolve({
      name,
      description,
      _links: { picture },
      version,
    });
    container.querySelector('#withPicture').metrics = metrics;
    container.querySelector('#withHorizontalPicture').item = Promise.resolve({
      name,
      description,
      rating_summary: ratingSummary,
      _links: { picture: horizontalImage },
      version,
    });
    container.querySelector('#withLabels').item = Promise.resolve({
      name,
      description,
      rating_summary: ratingSummary,
      _links: { picture: horizontalImage },
      version,
      labels,
    });
    return container;
  }))
  .add('Skeleton / Delay', () => {
    return withActions(...eventNames)(() => {
      const container = document.createElement('div');

      container.innerHTML = `
          <div class="title">Skeleton</div>
          <gv-promote></gv-promote>

          <div class="title">Delay</div>
          <gv-promote id="delay"></gv-promote>
      `;

      container.querySelector('#delay').item = Promise.resolve({ name, description, _links: { picture }, version, metrics }).then(delay(2000));
      container.querySelector('#delay').metrics = metrics.then(delay(3000));

      return container;
    });
  })
  .add('Errors', () => withActions(...eventNames)(() => {
    const container = document.createElement('div');

    container.innerHTML = `
        <div class="title">Empty</div>
        <gv-promote id="empty"></gv-promote>

        <div class="title">Errors</div>
        <gv-promote id="error"></gv-promote>
    `;

    container.querySelector('#empty').metrics = Promise.resolve({});
    container.querySelector('#error').item = Promise.reject(new Error());
    container.querySelector('#error').metrics = Promise.reject(new Error());

    return container;
  }));
