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
import '../../src/atoms/gv-checkbox.js';
import notes from '../../.docs/gv-checkbox.md';
import { storiesOf } from '@storybook/html';
import { text } from '@storybook/addon-knobs';
import { updateTextAttributes } from '../lib/update-attributes';
import { withCustomEventActions } from '../lib/event-action';

const withActions = withCustomEventActions('gv-checkbox:checkbox');

storiesOf('1. Atoms|<gv-checkbox>', module)
  .addParameters({ notes })
  .add('Basics', withActions(() => {

    const label = text('Label', '');

    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title">Default without options</div>
      <gv-checkbox></gv-checkbox>
      
      <div class="title">Default with label</div>
      <gv-checkbox 
        label="Recevoir une copie par e-mail">
      </gv-checkbox>
      
      <div class="title">Disabled with label</div>
      <gv-checkbox 
        label="Recevoir une copie par e-mail"
        disabled>
      </gv-checkbox>
      
      <div class="title">Sekeleton with label</div>
      <gv-checkbox 
        label="Recevoir une copie par e-mail"
        skeleton>
      </gv-checkbox>
    `;

    const nodeSelect = container.querySelectorAll('gv-checkbox');
    if (label) {
      updateTextAttributes(nodeSelect, 'label', label);
    }

    return container;
  }));
