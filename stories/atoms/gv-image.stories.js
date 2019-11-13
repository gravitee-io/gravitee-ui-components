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
import '../../src/atoms/gv-image.js';
import notes from '../../.docs/gv-image.md';
import { storiesOf } from '@storybook/html';
import { withCustomEventActions } from '../lib/event-action';
import '../../src/atoms/gv-icon';
import { text } from '@storybook/addon-knobs';

import logo from '../../assets/icons/gravitee/graviteeio.svg';
import logoImage from '../../assets/images/gravitee-logo-inline.png';

const withActions = withCustomEventActions('gv-image:loaded');

storiesOf('1. Atoms|<gv-image>', module)
  .addParameters({ notes })
  .add('Basics', withActions(() => {

    const container = document.createElement('div');
    container.innerHTML = `
<div class="title">Images</div>
<div style="display: flex">
<gv-image src="${logoImage}" alt="Gravitee.io"></gv-image>
<gv-image id="imgDelay" alt="Gravitee.io"</gv-image>
</div>

<div class="title">Errors</div>
<gv-image src="/fakeImage" alt="Fake Image"></gv-image>

`;
    const imgDelay = container.querySelector('#imgDelay');
    setTimeout(function () {
      imgDelay.src = logo;
    }, 3000);

    const height = text('--gv-image--h', '175px');
    const width = text('--gv-image--w', '175px');
    const border = text('--gv-image--bd', '');
    const borderRadius = text('--gv-image--bdrs', '');

    container.style = [
      { value: height, prop: '--gv-image--h' },
      { value: width, prop: '--gv-image--w' },
      { value: border, prop: '--gv-image--bd' },
      { value: borderRadius, prop: '--gv-image--bdrs' },
    ]
      .filter(({ value }) => value)
      .map(({ value, prop }) => `${prop}:${value}`)
      .join(';');

    return container;
  }));
