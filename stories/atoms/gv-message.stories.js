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
import '../../src/atoms/gv-message.js';
import notes from '../../.docs/gv-message.md';
import { storiesOf } from '@storybook/html';

storiesOf('1. Atoms|<gv-message>', module)
  .add('Basics', () => {
    return `
      <div class="title">Info</div>
      <div style="height: 20px">
          <gv-message type="info">The cake is a lie</gv-message>
      </div>
      
      <div class="title">Success</div>
      <div style="height: 20px">
        <gv-message type="success">Yeah, piece of cake!</gv-message>
      </div>
      
      <div class="title">Warning</div>
      <div style="height: 20px">
        <gv-message type="warning">Attention please</gv-message>
      </div>
      
      <div class="title">Error</div>
      <div style="height: 20px">
        <gv-message type="error">Never gonna give you up</gv-message>
      </div>
    `;
  }, { notes });
