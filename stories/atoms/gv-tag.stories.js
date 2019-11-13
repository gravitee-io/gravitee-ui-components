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
import '../../src/atoms/gv-tag.js';
import notes from '../../.docs/gv-tag.md';
import { storiesOf } from '@storybook/html';
import { text } from '@storybook/addon-knobs';
import { withActions } from '@storybook/addon-actions';

const eventNames = ['click gv-tag'];

storiesOf('1. Atoms |<gv-tag>', module)
  .addParameters({ notes })
  .add('Basics', () => withActions(...eventNames)(() => {

    const label = text('Tag label', '');

    return `
      <div class="title">Default</div>
      <gv-tag>${label || 'Productivity'}</gv-tag>
      <gv-tag>${label || 'User Experience'}</gv-tag>
      <gv-tag skeleton>${label || 'UX'}</gv-tag>
      <gv-tag icon="communication:add-user">${label || 'Add user'}</gv-tag>
      
      <div class="title">Major</div>
      <gv-tag major minor>${label || 'Design System'}</gv-tag>
      <gv-tag major>${label || 'UX'}</gv-tag>
      <gv-tag major skeleton>${label || 'UX'}</gv-tag>
      <gv-tag major icon="communication:shield-user"  style="--gv-icon:#fff">${label || 'Administrator'}</gv-tag>
      
      <div class="title">Minor</div>
      <gv-tag minor>${label || 'UI'}</gv-tag>
      <gv-tag minor>${label || 'Awesome'}</gv-tag>
      <gv-tag minor skeleton>${label || 'UX'}</gv-tag>
      <gv-tag minor icon="communication:thumbtack">${label || 'Pin'}</gv-tag>
    `;
  }));
