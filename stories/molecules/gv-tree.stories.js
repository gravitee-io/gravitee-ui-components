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
import '../../src/molecules/gv-tree.js';
import notes from '../../.docs/gv-tree.md';
import { storiesOf } from '@storybook/html';
import { withCustomEventActions } from '../lib/event-action.js';

const withActions = withCustomEventActions('gv-tree:select', 'gv-nav-link:click');
const menuItems = [
  { name: 'page 1', value: 'p1' },
  { name: 'page 2', value: { id: 'an object', link: 'https://gravitee.io', logo: 'logo' } },
  {
    name: 'folder 1',
    id: 'f1',
    children: [
      { name: 'page 11', value: true },
      { name: 'page 12', value: 1234 },
    ],
  },
  {
    name: 'folder 2',
    id: 'f2',
    children: [
      { name: 'page 21', value: 'p21' },
      { name: 'page 22', value: 'p22' },
      {
        name: 'folder 21',
        id: 'f21',
        children: [
          { name: 'page 211', value: 'p211' },
          { name: 'page 212', value: 'p212' },
        ],
        selected: true,
      },
    ],
  },
];

storiesOf('2. Molecules|<gv-tree>', module)
  .addParameters({ notes })
  .add('Basics', withActions(() => {
    const treeMenu = document.createElement('gv-tree');
    treeMenu.items = menuItems;
    return treeMenu;
  }))
  .add('In documentation', withActions(() => {
    const container = document.createElement('div');
    container.innerHTML = `
        <div class="title">In Documentation</div>

        <div style="display:flex; flex-direction: row;">
          <div>
            <gv-tree></gv-tree>
          </div>
          <div id="content">

          </div>
        </div>

      `;

    container.querySelector('gv-tree').items = menuItems;
    container.addEventListener('gv-tree:select', (e) => {
      container.querySelector('#content').innerHTML = '<h1>Selected Page : ' + e.detail.name.toString() + '</h1>';
    });
    return container;
  }));
