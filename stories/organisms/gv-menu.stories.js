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
import '../../src/organisms/gv-menu.js';
import notes from '../../.docs/gv-menu.md';
import { storiesOf } from '@storybook/html';
import { withCustomEventActions } from '../lib/event-action.js';

const withActions = withCustomEventActions('gv-nav-link:click', 'gv-input:input');

storiesOf('Components.Organisms', module)
  .addParameters({ notes })
  .add('<gv-menu>', withActions(() => {

    const menu = document.createElement('gv-menu');
    menu.routes = [
      { path: '#', title: 'All', active: true, icon: 'home:flower#2' },
      { path: '#', title: Promise.resolve('Categories'), icon: 'layout:layout-arrange' },
    ];
    menu.searchTitle = 'Rechercher une API, une APP...';
    return menu;
  }));
