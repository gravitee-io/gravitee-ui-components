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
import '../../src/molecules/gv-metrics.js';
import { delay } from '../lib/delay';
import notes from '../../.docs/gv-metrics.md';
import { storiesOf } from '@storybook/html';

const subscribers = 234;
const hits = 15000;
const health = 0.9532;
const metrics = Promise.resolve({ subscribers, hits, health });

storiesOf('2. Molecules|<gv-metrics>', module)
  .addParameters({ notes })
  .add('Basics', () => {

    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title">Basics</div>
      <gv-metrics id="basic"></gv-metrics>
      <gv-metrics id="big_health"></gv-metrics>
      <gv-metrics id="small_health"></gv-metrics>

      <div class="title">Missing metrics</div>
      <gv-metrics id="one"></gv-metrics>
      <gv-metrics id="two"></gv-metrics>
    `;

    container.querySelector('#basic').metrics = metrics;
    container.querySelector('#big_health').metrics = Promise.resolve({ subscribers, hits, health: 1 });
    container.querySelector('#small_health').metrics = Promise.resolve({ subscribers, hits, health: 0.034 });

    container.querySelector('#one').metrics = Promise.resolve({ subscribers });
    container.querySelector('#two').metrics = Promise.resolve({ hits, health });

    return container;
  }).add('Skeleton / Delay', () => {
    const container = document.createElement('div');
    container.innerHTML = `
    <div class="title">Skeleton</div>
    <gv-metrics></gv-metrics>
    <div class="title">Delay</div>
    <gv-metrics id="delay"></gv-metrics>
    `;

    container.querySelector('#delay').metrics = Promise.resolve({
      subscribers,
      hits,
      health,
    }).then(delay(2000));

    return container;
  }).add('Empty / Errors', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title">Empty</div>
      <gv-metrics id="empty"></gv-metrics>
    
      <div class="title">Error</div>
      <gv-metrics id="error"></gv-metrics>
    `;
    container.querySelector('#empty').metrics = Promise.resolve({});
    container.querySelector('#error').metrics = Promise.reject(new Error());
    return container;
  });
