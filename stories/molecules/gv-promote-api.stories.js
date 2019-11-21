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
import notes from '../../.docs/gv-promote-api.md';
import '../../src/molecules/gv-promote-api';
import { delay } from '../lib/delay';
import { withActions } from '@storybook/addon-actions';
import { color } from '@storybook/addon-knobs';
import horizontalImage from '../../assets/images/gravitee-logo-darker.png';
import image from '../../assets/images/logo.png';

const eventNames = ['gv-promote-api:click'];

const title = 'supernova cloud';
const description = 'Tempore quo primis auspiciis in mundanum fulgorem surgeret victura dum erunt homines Roma, '
  + 'ut augeretur sublimibus incrementis, foedere pacis aeternae Virtus convenit atque  plerumque dissidentes,';

const rating = { average: 3.2, count: 345 };
storiesOf('2. Molecules|<gv-promote-api>', module)
  .addParameters({ notes })
  .add('Basics', () => withActions(...eventNames)(() => {

    const container = document.createElement('div');

    container.innerHTML = `
    <div class="title">Default picture</div>
    <gv-promote-api title="${title}" description="${description}" path="/"> 
</gv-promote-api>

    <div class="title">With picture</div>
    <gv-promote-api title="${title}" description="${description}" picture="${image}" path="/"> 
</gv-promote-api>

    <div class="title">With horizontal picture</div>
        <gv-promote-api title="${title}" description="${description}" picture="${horizontalImage}" path="/"> 
    </gv-promote-api>
    `;

    const bgColor = color('--gv-promote-api--bgc', '');
    const bgImgColor = color('--gv-promote-api-image--bgc', '');
    const btnBgColor = color('--gv-button--bgc', '');

    container.style = [
      { value: bgColor, prop: '--gv-promote-api--bgc' },
      { value: bgImgColor, prop: '--gv-promote-api-image--bgc' },
      { value: btnBgColor, prop: '--gv-button--bgc' }]
      .filter(({ value }) => value)
      .map(({ value, prop }) => `${prop}:${value}`)
      .join(';');

    container.querySelectorAll('gv-promote-api').forEach((card) => (card.rating = rating));

    return container;
  }))
  .add('Skeleton / Delay', () => withActions(...eventNames)(() => {
    const container = document.createElement('div');

    container.innerHTML = `
        <div class="title">Skeleton</div>
        <gv-promote-api picture="${image}" path="/" skeleton></gv-promote-api>
        
        <div class="title">Delay</div>
        <gv-promote-api id="delay" path="/" picture="${image}"></gv-promote-api>
    `;
    const delayElement = container.querySelector('#delay');
    delayElement.title = Promise.resolve(title).then(delay(1000));
    delayElement.description = Promise.resolve(description).then(delay(2000));

    return container;
  }))
  .add('Errors', () => withActions(...eventNames)(() => {
    const container = document.createElement('div');

    container.innerHTML = `
        <div class="title">Empty</div>
        <gv-promote-api picture="" description=""></gv-promote-api>
        
        <div class="title">Errors</div>
        <gv-promote-api picture="/fakepath" description=""></gv-promote-api>
    `;
    return container;
  }));
