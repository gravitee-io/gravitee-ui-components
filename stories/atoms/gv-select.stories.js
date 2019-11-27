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
import { withActions } from '@storybook/addon-actions';

const eventNames = ['input gv-select'];

storiesOf('1. Atoms|<gv-select>', module)
  .addParameters({ notes })
  .add('Basics', () => withActions(...eventNames)(() => {

    const label = text('Label', '');

    const container = document.createElement('div');
    const options = [
      { label: 'Application 1', value: '1' },
      { label: 'Application 2', value: '2' },
      { label: 'Application 3', value: '3' },
      { value: '4' },
      'Application 5',
    ];
    container.innerHTML = `
      <div class="title">Default without options</div>
      <gv-select></gv-select>
      <gv-select small></gv-select>
      <gv-select large></gv-select>
      
      <div class="title">Default with label</div>
      <gv-select 
        label="Associer une application" 
        placeholder="Trouver une application"></gv-select>
        <gv-select 
        label="Associer une application" 
        placeholder="Trouver une application" small></gv-select>
        <gv-select 
        label="Associer une application" 
        placeholder="Trouver une application" large>
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

    const selectList = container.querySelectorAll('gv-select');
    if (label) {
      updateTextAttributes(selectList, 'label', label);
    }

    const selectListWithData = Array.prototype.slice.call(selectList, 3);

    selectListWithData.forEach((e, i) => {
      if (i === selectListWithData.length) {
        const opts = [];
        for (let j = 0; j < 100; j++) {
          opts[j] = { label: `Application ${j}`, value: `${j}` };
        }
        e.options = opts;
      }
      else {
        e.options = options;
      }
    });

    return container;
  }))
  .add('In column', () => withActions(...eventNames)(() => {
    const container = document.createElement('div');
    container.innerHTML = `<div class="title">Column with a fixed width </div>
    <div style ="display: flex; flex-direction: column; max-width: 30rem;">
       <gv-select 
        label="Associer une application" 
        placeholder="Trouver une application"></gv-select>
    </div>`;

    container.querySelector('gv-select').options = [
      { label: 'Iam aliis imaginarius nec praestituto quid exsertantis defensi agenda aulaeum.', value: '1' },
      { label: 'Application 2', value: '2' },
      { label: 'Application 3', value: '3' },
    ];

    return container;
  }));
