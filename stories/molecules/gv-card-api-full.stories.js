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
import image from '../../assets/images/logo.png';
import { withActions } from '@storybook/addon-actions';
import { color } from '@storybook/addon-knobs';

const eventNames = ['click gv-card-api-full'];

const title = 'Supernova';
const description = 'Tempore quo primis auspiciis in mundanum fulgorem surgeret victura dum erunt homines Roma, '
  + 'ut augeretur sublimibus incrementis, foedere pacis aeternae Virtus convenit atque  plerumque dissidentes,';

const version = 'v.1.1';

storiesOf('2. Molecules|<gv-card-api-full>', module)
  .addParameters({ notes })
  .add('Basics', () => withActions(...eventNames)(() => {

    const container = document.createElement('div');

    container.innerHTML = `
    <div class="title">Basics</div>
    <gv-card-api-full title="${title}" description="${description}"></gv-card-api-full>
    <gv-card-api-full title="Long Supernova with empty description" picture="${horizontalImage}" version="${version}"></gv-card-api-full>
    `;

    container.querySelectorAll('gv-card-api-full').forEach((card, index) => {

      card.states = [{ value: 'beta' }, { value: 'running', major: true }];
      card.hits = '11M+';
      card.health = '80%';
      const average = index + 2.5;
      card.rating = { average, count: average * 124 };
      card.subscribers = '345';
      card.labels = [{ value: 'APIDays', major: true }, { value: 'December', minor: index === 0 }];
    });

    const bgColor = color('--gv-card-api-full--bgc', '');

    container.style = [
      { value: bgColor, prop: '--gv-card-api-full--bgc' }]
      .filter(({ value }) => value)
      .map(({ value, prop }) => `${prop}:${value}`)
      .join(';');

    return container;
  })).add('Skeleton / Delay', () => withActions(...eventNames)(() => {

    const container = document.createElement('div');

    container.innerHTML = `
    <div class="title">Skeleton</div>
    <gv-card-api-full title="${title}" version="${version}" skeleton></gv-card-api-full>
    <div class="title">Delay</div>
    <gv-card-api-full id="delay" version="${version}" picture="${image}" description="${description}"></gv-card-api-full>
    `;

    const delayElement = container.querySelector('#delay');
    delayElement.title = Promise.resolve('Slow api').then(delay(2000));

    return container;
  }))
  .add('Empty / Errors', () => withActions(...eventNames)(() => {
    const container = document.createElement('div');

    container.innerHTML = `
    <div class="title">Empty</div>
    <gv-card-api-full></gv-card-api-full>
    
    <div class="title">Errors</div>
    <gv-card-api-full picture="/fake" title="Fake Image path" description="${description}"></gv-card-api-full>
    <gv-card-api-full id="error" picture="${image}"></gv-card-api-full>
    `;
    const errorElement = container.querySelector('#error');
    errorElement.title = Promise.reject(new Error());

    return container;
  }));
