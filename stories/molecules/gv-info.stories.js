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
import notes from '../../.docs/gv-info.md';
import '../../src/molecules/gv-info';
import { delay } from '../lib/delay';
import { color } from '@storybook/addon-knobs';
import { withCustomEventActions } from '../lib/event-action';

const views = ['Azure', 'Swiss', 'All', 'Magic'];
const ratingSummary = { average: 3.4 };
const labels = ['APIDays', 'December', 'Foobar'];
const resources = ['Repository', 'Homepage', 'Licence', 'Changelog', 'Download Extension'];
const miscellaneous = [{ key: 'Version:', value: 'v1' }, {
  key: 'Released:',
  value: '2019-12-25, 12:00PM',
}, { key: 'Last Update:', value: '2019-12-25, 12:00PM' }, { key: 'Publisher:', value: 'Tichard T.' }];
const metrics = Promise.resolve({ hits: '11M+', subscribers: '689', health: '0.95' });
const api = {
  name: 'Long Supernova',
  views,
  rating_summary: ratingSummary,
  labels,
  version: 'v1',
  description: 'Hinc ille commotus ut iniusta perferens et indigna pra custodiam protectoribus mandaverat fidis '
    + 'quo con perto Montius tunc. nc ille commotus ut iniusta perferens et indigna pra custodiam protectoribus '
    + 'mandaverat fidis quo con perto Montius tunc.',
};

const withActions = withCustomEventActions('gv-info:click-view', 'gv-info:click-label');

storiesOf('2. Molecules|<gv-info>', module)
  .addParameters({ notes })
  .add('Basics', withActions(() => {

    const container = document.createElement('div');

    container.innerHTML = `
    <div style="display:flex;">
      <div style="margin: 10px;">
        <div class="title">Basics</div>
        <gv-info id="basics"></gv-info>
      </div>
      <div style="margin: 10px;">
        <div class="title">Skeleton</div>
        <gv-info></gv-info>
      </div>
      <div style="margin: 10px;">
        <div class="title">Delay</div>
        <gv-info id="delay"></gv-info>
      </div>
    </div>
    `;

    const bgColor = color('--gv-info--bgc', '');

    container.style = [
      { value: bgColor, prop: '--gv-info--bgc' }]
      .filter(({ value }) => value)
      .map(({ value, prop }) => `${prop}:${value}`)
      .join(';');

    container.querySelector('#basics').item = Promise.resolve(api);
    container.querySelector('#basics').resources = resources;
    container.querySelector('#basics').miscellaneous = miscellaneous;
    container.querySelector('#basics').metrics = metrics;

    container.querySelector('#delay').item = Promise.resolve(api).then(delay(2000));
    container.querySelector('#delay').metrics = metrics.then(delay(3000));
    container.querySelector('#delay').resources = resources;
    container.querySelector('#delay').miscellaneous = miscellaneous;

    return container;
  }))
  .add('With DublinCore', withActions(() => {
    const container = document.createElement('div');

    container.innerHTML = `
    <div style="display:flex;">
      <div style="margin: 10px;">
        <div class="title">Basics</div>
        <gv-info id="basics" with-dc></gv-info>
      </div>
      <div style="margin: 10px;">
        <div class="title">Skeleton</div>
        <gv-info with-dc></gv-info>
      </div>
      <div style="margin: 10px;">
        <div class="title">Delay</div>
        <gv-info id="delay" with-dc></gv-info>
      </div>
    </div>
    `;

    container.querySelector('#basics').item = Promise.resolve(api);
    container.querySelector('#basics').resources = resources;
    container.querySelector('#basics').miscellaneous = miscellaneous;
    container.querySelector('#basics').metrics = metrics;

    container.querySelector('#delay').item = Promise.resolve(api).then(delay(2000));
    container.querySelector('#delay').metrics = metrics.then(delay(3000));
    container.querySelector('#delay').resources = resources;
    container.querySelector('#delay').miscellaneous = miscellaneous;
    return container;
  }))
  .add('Errors', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title">Empty</div>
      <gv-info id="empty"></gv-info>

      <div class="title">Error</div>
      <gv-info id="error"></gv-info>
    `;
    container.querySelector('#empty').item = Promise.resolve({});
    container.querySelector('#error').item = Promise.reject(new Error());
    return container;
  });
