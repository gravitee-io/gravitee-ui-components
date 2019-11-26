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

storiesOf('3. Organisms|<gv-pagination>', module)
  .addParameters({ notes })
  .add('Basics', withActions(() => {

    const container = document.createElement('div');

    container.innerHTML = `
    <div class="title">Basics</div>
    <gv-pagination id="basic"></gv-pagination>
    
    <div class="title">Empty</div>
    <gv-pagination></gv-pagination>
    
    <div class="title">Without data</div>
    <gv-pagination id="nodata"></gv-pagination>
    
    <div class="title">Without sizes</div>
    <gv-pagination id="nosize"></gv-pagination>
    
    `;
    const basic = container.querySelector('#basic');
    basic.links = { first: '/first', prev: '/prev', next: '/next', last: '/last' };
    basic.data = { first: 1, last: 10, total: 100 };
    basic.sizes = ['5', '10', '15', '20'];

    const nodata = container.querySelector('#nodata');
    nodata.links = { first: '/first', prev: '/prev', next: '', last: '' };
    nodata.sizes = ['5', '10', '15', '20'];

    const nosize = container.querySelector('#nosize');
    nosize.links = { first: '', prev: '', next: '/next', last: '/last' };
    return container;
  }));
