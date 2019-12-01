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
import '../../src/organisms/gv-pagination.js';
import notes from '../../.docs/gv-pagination.md';
import { storiesOf } from '@storybook/html';
import { withCustomEventActions } from '../lib/event-action.js';

const withActions = withCustomEventActions('gv-pagination:paginate', 'gv-pagination:size');

function gen (pages) {
  const block = document.createElement('div');
  block.innerHTML = `<div class="title">${pages} pages</div>`;
  for (let i = 1; i <= pages; i++) {
    const pagination = document.createElement('gv-pagination');
    const data = { first: 1, last: 100, total: 100, current_page: i, total_pages: pages };
    pagination.data = data;
    block.appendChild(pagination);
  }
  return block;
}

storiesOf('3. Organisms|<gv-pagination>', module)
  .addParameters({ notes })
  .add('Basics', withActions(() => {
    const container = document.createElement('div');
    const small = gen(7);
    const large = gen(14);
    container.appendChild(small);
    container.appendChild(large);
    return container;
  }));
