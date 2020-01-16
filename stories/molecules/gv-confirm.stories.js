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
import '../../src/atoms/gv-button';
import '../../src/molecules/gv-confirm';
import notes from '../../.docs/gv-confirm.md';
import { storiesOf } from '@storybook/html';
import { withActions } from '@storybook/addon-actions';

const eventNames = ['gv-confirm:cancel', 'gv-confirm:ok'];

storiesOf('2. Molecules|<gv-confirm>', module)
  .addParameters({ notes })
  .add('Basics', () => withActions(...eventNames)(() => {

    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title">Basics</div>
      <gv-confirm message="Are you sure ?">
        <gv-button>Simple</gv-button>
      </gv-confirm>
      
      <gv-confirm message="Are you agree to delete this comment ?" okLabel="I agree" cancelLabel="Not agree">
        <gv-button outlined>Custom labels</gv-button>
      </gv-confirm>
      
      <gv-confirm icon="food:pizza" message="Are we going to eat pizza tomorrow?" okLabel="Awesome" cancelLabel="Sorry, I prefer the pasta">
        <gv-button outlined>Custom icon</gv-button>
      </gv-confirm>
    `;

    return container;
  }));
