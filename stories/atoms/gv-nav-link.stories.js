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

const withActions = withCustomEventActions('gv-nav-link_click');

storiesOf('Components.Atoms', module)
  .addParameters({ notes })
  .add('<gv-nav-link>', withActions(() => {

    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title">Nav link</div>
      <gv-nav-link id="empty"></gv-nav-link>
      <gv-nav-link id="dashboard"></gv-nav-link>
      <gv-nav-link id="catalog"></gv-nav-link>
      <gv-nav-link id="apps"></gv-nav-link>
      <gv-nav-link id="error"></gv-nav-link>
    `;
    container.querySelector('#empty').route = Promise.resolve(null);
    container.querySelector('#dashboard').route = { title: 'Dashboard', path: '#' };
    container.querySelector('#catalog').route = Promise.resolve({ title: 'Catalog', path: '#', isActive: true });
    container.querySelector('#catalog').style = '--gv-nav-link-active--bgc:#357edd;';
    container.querySelector('#apps').route = Promise.resolve({ title: 'Apps', path: '#', isActive: false });
    container.querySelector('#error').route = Promise.reject(new Error('True story.'));
    return container;

  }));
