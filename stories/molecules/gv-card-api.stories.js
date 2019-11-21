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
import image from '../../assets/images/logo.png';
import { withActions } from '@storybook/addon-actions';
import { color } from '@storybook/addon-knobs';

const eventNames = ['click gv-card-api'];

const title = 'Supernova';
const version = 'v.1.1';

storiesOf('2. Molecules|<gv-card-api>', module)
  .addParameters({ notes })
  .add('Basics', () => withActions(...eventNames)(() => {

    const container = document.createElement('div');

    container.innerHTML = `
    <div class="title">Basics</div>
    <gv-card-api title="${title}"></gv-card-api>
    <gv-card-api title="Long Supernova" picture="${horizontalImage}" version="${version}"></gv-card-api>
    <gv-card-api title="Comet Api." picture="${image}" version="${version}"></gv-card-api>
    
    <div class="title">Skeleton & Delay</div>
    <gv-card-api title="${title}" version="${version}" skeleton ></gv-card-api>
    <gv-card-api id="delay" version="${version}" picture="${image}"></gv-card-api>
    `;

    container.querySelectorAll('gv-card-api').forEach((card) => {
      card.states = [{ value: 'beta', minor: true }, { value: 'running', major: true }];
    });

    const bgColor = color('--gv-card-api--bgc', '');

    container.style = [
      { value: bgColor, prop: '--gv-card-api--bgc' }]
      .filter(({ value }) => value)
      .map(({ value, prop }) => `${prop}:${value}`)
      .join(';');

    const delayElement = container.querySelector('#delay');
    delayElement.title = Promise.resolve('Slow api').then(delay(2000));

    return container;
  }))
  .add('Errors', () => withActions(...eventNames)(() => {
    const container = document.createElement('div');

    container.innerHTML = `
      <div class="title">Empty</div>
      <gv-card-api></gv-card-api>
    
      <div class="title">Errors</div>
      <gv-card-api picture="/fake" title="Fake Image path"></gv-card-api>
      <gv-card-api id="error" picture="${image}"></gv-card-api>
    `;
    const errorElement = container.querySelector('#error');
    errorElement.title = Promise.reject(new Error());
    return container;
  }));
