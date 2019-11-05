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

const withActions = withCustomEventActions('gv-nav_change');

storiesOf('Components.Molecules', module)
  .add('<gv-nav>', withActions(() => {

    const nav = document.createElement('gv-nav');
    nav.routes = [
      { path: '#', title: 'Dashboard' },
      { path: '#', title: 'Catalogue', isActive: true },
      { path: '#', title: 'Mes applications' },
    ];
    return nav;
  }, { notes }));
