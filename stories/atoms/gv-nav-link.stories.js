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
import '../../src/atoms/gv-nav-link.js';
import notes from '../../.docs/gv-nav-link.md';
import { storiesOf } from '@storybook/html';
import { withCustomEventActions } from '../lib/event-action.js';

const withActions = withCustomEventActions('gv-nav-link:click');

storiesOf('1. Atoms | <gv-nav-link>', module)
  .addParameters({ notes })
  .add('Basics', withActions(() => {

    const container = document.createElement('div');
    container.style = '--gv-nav-link-active--bdb: 8px solid #CCCCCC;'
      + '--gv-nav-link-active--c: #F4F4F4;'
      + '--gv-nav-link-active--bgc: #137752;'
      + '--gv-nav-link--c: #137752;';

    container.innerHTML = `
      <div class="title">Nav link</div>
      <gv-nav-link id="bread" title="Bread" icon="food:french-bread"></gv-nav-link>
      <gv-nav-link id="cheese" icon="food:cheese"></gv-nav-link>
      <gv-nav-link id="wine" icon="food:wine" active></gv-nav-link>
      <gv-nav-link id="empty"></gv-nav-link>
      <gv-nav-link id="error"></gv-nav-link>
      <gv-nav-link id="wine" icon="navigation:waiting" title="Waiting" skeleton active></gv-nav-link>
    `;

    container.querySelector('#bread').title = Promise.resolve('Bread');
    container.querySelector('#wine').title = Promise.resolve('Wine')
      .then((value) => new Promise((resolve) => setTimeout(() => {
        resolve(value);
      }, 1000)));
    return container;

  }));
