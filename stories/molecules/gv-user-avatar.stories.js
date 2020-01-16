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
import '../../src/molecules/gv-user-avatar.js';
import { storiesOf } from '@storybook/html';
import notes from '../../.docs/gv-user-avatar.md';
import avatar from '../../assets/images/logo.png';
storiesOf('2. Molecules|<gv-user-avatar>', module)
  .addParameters({ notes })
  .add('Basics', () => {

    const user = { display_name: 'Gravatar', avatar };
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title">When picture is defined</div>
      <gv-user-avatar class="simple"></gv-user-avatar>

      <div class="title">When picture is undefined</div>
      <gv-user-avatar class="generated"></gv-user-avatar>

       <div class="title">Custom size</div>
       <gv-user-avatar class="simple" size="150"></gv-user-avatar>
        <gv-user-avatar class="generated" size="150"></gv-user-avatar>

    `;

    container.querySelectorAll('.simple')
      .forEach((avatar, index) => (avatar.user = user));
    container.querySelectorAll('.generated')
      .forEach((avatar, index) => (avatar.user = { display_name: `Jean ${index} ` }));
    return container;
  });
