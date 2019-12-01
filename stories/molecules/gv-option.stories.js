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
import { storiesOf } from '@storybook/html';
import notes from '../../.docs/gv-option.md';
import '../../src/molecules/gv-option';
import { withActions } from '@storybook/addon-actions';
import { color } from '@storybook/addon-knobs';

const eventNames = ['gv-option:select'];

storiesOf('2. Molecules|<gv-option>', module)
  .addParameters({ notes })
  .add('Basics', () => withActions(...eventNames)(() => {

    const container = document.createElement('div');

    container.innerHTML = `
    <div class="title">Basics</div>
    <gv-option></gv-option>
    `;
    container.querySelector('gv-option').options = [
      { id: 'sun', title: 'Sun glasses', icon: 'clothers:sun-glasses' },
      { id: 'cap', title: 'Cap', icon: 'clothers:cap' },
      { id: 'shorts', title: 'Shorts', icon: 'clothers:shorts' },
    ];

    const bgColor = color('--gv-option--bgc', '');

    container.style = [
      { value: bgColor, prop: '--gv-option--bgc' }]
      .filter(({ value }) => value)
      .map(({ value, prop }) => `${prop}:${value}`)
      .join(';');

    return container;
  }));
