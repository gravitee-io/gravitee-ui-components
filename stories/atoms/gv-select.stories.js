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
import '../../src/atoms/gv-select.js';
import notes from '../../.docs/gv-select.md';
import { storiesOf } from '@storybook/html';
import { text } from '@storybook/addon-knobs';
import { updateTextAttributes } from '../lib/update-attributes';
import { withCustomEventActions } from '../lib/event-action';

const withActions = withCustomEventActions('gv-select:select');

storiesOf('1. Atoms|<gv-select>', module)
  .addParameters({ notes })
  .add('Basics', withActions(() => {

    const label = text('Label', '');

    const container = document.createElement('div');
    const options = [
      { label: 'Application 1', value: '1' },
      { label: 'Application 2', value: '2' },
      { label: 'Application 3', value: '3' },
      { label: 'Application 4', value: '4' },
      { label: 'Application 5', value: '5' },
    ];
    container.innerHTML = `
      <div class="title">Default without options</div>
      <gv-select></gv-select>
      
      <div class="title">Default with label</div>
      <gv-select 
        label="Associer une application" 
        placeholder="Trouver une application">
      </gv-select>
      
      <div class="title">Required with label</div>
      <gv-select 
        label="Associer une application" 
        placeholder="Trouver une application"
        required>
      </gv-select>
      
      <div class="title">Disabled with label</div>
      <gv-select 
        label="Associer une application" 
        placeholder="Trouver une application"
        disabled>
      </gv-select>
      
      <div class="title">Sekeleton with label</div>
      <gv-select 
        label="Associer une application" 
        placeholder="Trouver une application"
        skeleton>
      </gv-select>
      
      <div class="title">Hundred values</div>
      <gv-select 
        label="Associer une application" 
        placeholder="Trouver une application">
      </gv-select>
    `;

    const nodeSelect = container.querySelectorAll('gv-select');
    if (label) {
      updateTextAttributes(nodeSelect, 'label', label);
    }
    let i = 0;
    nodeSelect.forEach((e) => {
      if (i++ > 0) {
        if (i === nodeSelect.length) {
          e.options = [];
          for (let j = 0; j < 100; j++) {
            e.options[j] = { label: `Application ${j}`, value: `${j}` };
          }
        }
        else {
          e.options = options;
        }
      }
    });

    return container;
  }));
