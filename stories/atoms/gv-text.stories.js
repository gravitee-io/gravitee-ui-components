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
import '../../src/atoms/gv-text.js';
import notes from '../../.docs/gv-text.md';
import { storiesOf } from '@storybook/html';
import { text } from '@storybook/addon-knobs';
import { updateTextAttributes } from '../lib/update-attributes';
import { withCustomEventActions } from '../lib/event-action';

const withActions = withCustomEventActions('gv-text:text');

storiesOf('1. Atoms|<gv-text>', module)
  .addParameters({ notes })
  .add('Basics', withActions(() => {

    const label = text('Label', '');
    const rows = text('Rows', '');

    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title">Default without options</div>
      <gv-text></gv-text>
      
      <div class="title">Default with label</div>
      <gv-text 
        label="Votre demande" 
        placeholder="Expliquer votre demande...">
      </gv-text>
      
      <div class="title">Required with label</div>
      <gv-text 
        label="Votre demande" 
        placeholder="Expliquer votre demande..."
        required>
      </gv-text>
      
      <div class="title">Disabled with label</div>
      <gv-text 
        label="Votre demande" 
        placeholder="Expliquer votre demande..."
        disabled>
      </gv-text>
      
      <div class="title">Sekeleton with label</div>
      <gv-text 
        label="Votre demande" 
        placeholder="Expliquer votre demande..."
        skeleton>
      </gv-text>
    `;

    const nodeSelect = container.querySelectorAll('gv-text');
    if (label) {
      updateTextAttributes(nodeSelect, 'label', label);
    }
    if (rows) {
      updateTextAttributes(nodeSelect, 'rows', rows);
    }

    return container;
  }));
