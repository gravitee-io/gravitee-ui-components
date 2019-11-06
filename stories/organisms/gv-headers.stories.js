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
import '../../src/organisms/gv-header.js';
import notes from '../../.docs/gv-header.md';
import { storiesOf } from '@storybook/html';
import { withCustomEventActions } from '../lib/event-action.js';

const withActions = withCustomEventActions('gv-nav-link:click');

storiesOf('Components.Organisms', module)
  .add('<gv-header>', withActions(() => {

    const header = document.createElement('gv-header');
    header.routes = [
      { path: '#', title: 'Dashboard' },
      { path: '#', title: 'Catalogue', active: true },
      { path: '#', title: Promise.resolve('Mes applications') },
    ];
    header.logoTitle = 'Gravitee.io components';
    header.logoImg = 'https://avatars3.githubusercontent.com/u/12655666?s=280&amp;v=4';
    return header;
  }, { notes }));
