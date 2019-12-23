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
import '../../src/molecules/gv-nav.js';
import notes from '../../.docs/gv-nav.md';
import { storiesOf } from '@storybook/html';
import { withCustomEventActions } from '../lib/event-action.js';
import { delay } from '../lib/delay';

const withActions = withCustomEventActions('gv-link:click');

storiesOf('2. Molecules|<gv-nav>', module)
  .addParameters({ notes })
  .add('Basics', withActions(() => {

    const nav = document.createElement('gv-nav');
    nav.routes = [
      { path: '', title: 'Dashboard' },
      { path: '', title: 'Catalogue', active: true },
      { path: '', title: 'Mes applications' },
    ];
    return nav;
  }))
  .add('Delay', withActions(() => {

    const nav = document.createElement('gv-nav');
    nav.routes = [
      Promise.resolve({ path: '', title: 'Dashboard' }).then(delay(4000)),
      Promise.resolve({ path: '', title: 'Catalogue', active: true }).then(delay(2000)),
      Promise.resolve({ path: '', title: 'Mes applications' }),
    ];
    return nav;
  }));
