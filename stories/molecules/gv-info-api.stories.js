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
import notes from '../../.docs/gv-info-api.md';
import '../../src/molecules/gv-info-api';
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

const withActions = withCustomEventActions('gv-info-api:click-view', 'gv-info-api:click-label');

storiesOf('2. Molecules|<gv-info-api>', module)
  .addParameters({ notes })
  .add('Basics', withActions(() => {

    const container = document.createElement('div');

    container.innerHTML = `
    <div style="display:flex;">
      <div style="margin: 10px;">
        <div class="title">Basics</div>
        <gv-info-api id="basics"></gv-info-api>
      </div>
      <div style="margin: 10px;">
        <div class="title">Skeleton</div>
        <gv-info-api></gv-info-api>
      </div>
      <div style="margin: 10px;">
        <div class="title">Delay</div>
        <gv-info-api id="delay"></gv-info-api>
      </div>
    </div>
    `;

    const bgColor = color('--gv-info-api--bgc', '');

    container.style = [
      { value: bgColor, prop: '--gv-info-api--bgc' }]
      .filter(({ value }) => value)
      .map(({ value, prop }) => `${prop}:${value}`)
      .join(';');

    container.querySelector('#basics').api = Promise.resolve(api);
    container.querySelector('#basics').resources = resources;
    container.querySelector('#basics').miscellaneous = miscellaneous;
    container.querySelector('#basics').metrics = metrics;

    container.querySelector('#delay').api = Promise.resolve(api).then(delay(2000));
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
        <gv-info-api id="basics" with-dc></gv-info-api>
      </div>
      <div style="margin: 10px;">
        <div class="title">Skeleton</div>
        <gv-info-api with-dc></gv-info-api>
      </div>
      <div style="margin: 10px;">
        <div class="title">Delay</div>
        <gv-info-api id="delay" with-dc></gv-info-api>
      </div>
    </div>
    `;

    container.querySelector('#basics').api = Promise.resolve(api);
    container.querySelector('#basics').resources = resources;
    container.querySelector('#basics').miscellaneous = miscellaneous;
    container.querySelector('#basics').metrics = metrics;

    container.querySelector('#delay').api = Promise.resolve(api).then(delay(2000));
    container.querySelector('#delay').metrics = metrics.then(delay(3000));
    container.querySelector('#delay').resources = resources;
    container.querySelector('#delay').miscellaneous = miscellaneous;
    return container;
  }))
  .add('Errors', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title">Empty</div>
      <gv-info-api id="empty"></gv-info-api>

      <div class="title">Error</div>
      <gv-info-api id="error"></gv-info-api>
    `;
    container.querySelector('#empty').api = Promise.resolve({});
    container.querySelector('#error').api = Promise.reject(new Error());
    return container;
  });
