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
import image from '../../assets/images/gravitee-logo-darker.png';
import { withActions } from '@storybook/addon-actions';
import { color } from '@storybook/addon-knobs';

const eventNames = ['gv-promote-api:click'];

const title = 'supernova cloud';
const description = 'Tempore quo primis auspiciis in mundanum fulgorem surgeret victura dum erunt homines Roma, '
  + 'ut augeretur sublimibus incrementis, foedere pacis aeternae Virtus convenit atque  plerumque dissidentes,';

storiesOf('2. Molecules|<gv-promote-api>', module)
  .addParameters({ notes })
  .add('Basics', () => withActions(...eventNames)(() => {

    const container = document.createElement('div');

    container.innerHTML = `
    <div class="title">Default image</div>
    <gv-promote-api title="${title}" description="${description}"> 
</gv-promote-api>

    <div class="title">With image</div>
    <gv-promote-api title="${title}" description="${description}" src="${image}"> 
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

    return container;
  }))
  .add('Delay', () => withActions(...eventNames)(() => {
    const container = document.createElement('div');

    container.innerHTML = `
        <div class="title">Delay</div>
        <gv-promote-api id="delay" src="${image}"></gv-promote-api>
    `;
    const delayElement = container.querySelector('#delay');
    delayElement.title = Promise.resolve(title).then(delay(1000));
    delayElement.description = Promise.resolve(description).then(delay(2000));

    return container;
  }));
