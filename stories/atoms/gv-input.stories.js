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
import '../../src/atoms/gv-input.js';
import notes from '../../.docs/gv-input.md';
import { storiesOf } from '@storybook/html';
import { withActions } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { updateBooleanAttributes, updateTextAttributes } from '../lib/update-attributes';

const eventNames = ['click gv-input'];

storiesOf('Components.Atoms', module)
  .addParameters({ notes })
  .add('<gv-input>', () => withActions(...eventNames)(() => {

    const label = text('Label', '');
    const disabled = boolean('Disabled', false);
    const skeleton = boolean('Skeleton', false);
    const required = boolean('Required', false);

    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title">Size</div>
      <gv-input placeholder="Default size"></gv-input>
      <gv-input large placeholder="Large size"></gv-input>
      <gv-input small placeholder="Small size" ></gv-input>
      
      <div class="title">Type</div>
      <gv-input type="text" placeholder="Text"></gv-input>
      <gv-input type="password" placeholder="Password..."></gv-input>
      <gv-input type="email" placeholder="Email..."></gv-input>
    `;

    const nodeList = container.querySelectorAll('gv-input');
    updateBooleanAttributes(nodeList, 'disabled', disabled);
    updateBooleanAttributes(nodeList, 'skeleton', skeleton);
    updateBooleanAttributes(nodeList, 'required', required);
    updateTextAttributes(nodeList, 'label', label);

    return container;
  }));
