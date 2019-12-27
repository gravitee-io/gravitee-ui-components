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
import '../../src/atoms/gv-image';
import notes from '../../.docs/gv-image.md';
import { storiesOf } from '@storybook/html';
import { withCustomEventActions } from '../lib/event-action';
import '../../src/atoms/gv-icon';
import { radios, text } from '@storybook/addon-knobs';

import logo from '../../assets/icons/gravitee/graviteeio.svg';
import logoImage from '../../assets/images/gravitee-logo-inline.png';
import { delay } from '../lib/delay';

const withActions = withCustomEventActions('gv-image:loaded');

storiesOf('1. Atoms|<gv-image>', module)
  .addParameters({ notes })
  .add('Basics', withActions(() => {

    const container = document.createElement('div');
    container.innerHTML = `
<div class="title">Basics</div>
<gv-image src="${logoImage}" alt="Gravitee.io"></gv-image>
<gv-image src="${logo}" alt="Gravitee.io"></gv-image>
`;

    const height = text('--gv-image--h', '275px');
    const width = text('--gv-image--w', '275px');
    const border = text('--gv-image--bd', '');
    const of = radios('--gv-image--of', ['fill', 'cover', 'contain', 'none', 'scale-down'], '');
    const borderRadius = text('--gv-image--bdrs', '');

    container.style = [
      { value: height, prop: '--gv-image--h' },
      { value: width, prop: '--gv-image--w' },
      { value: border, prop: '--gv-image--bd' },
      { value: of, prop: '--gv-image--of' },
      { value: borderRadius, prop: '--gv-image--bdrs' },
    ]
      .filter(({ value }) => value)
      .map(({ value, prop }) => `${prop}:${value}`)
      .join(';');

    return container;
  }))
  .add('Rounded', withActions(() => {

    const container = document.createElement('div');
    container.innerHTML = `
<div class="title">Basics</div>
<gv-image src="${logoImage}" alt="Gravitee.io"></gv-image>
<gv-image src="${logo}" alt="Gravitee.io"></gv-image>
`;

    const height = text('--gv-image--h', '275px');
    const width = text('--gv-image--w', '275px');
    const border = text('--gv-image--bd', '');
    const of = radios('--gv-image--of', ['fill', 'contain', 'cover', 'none', 'scale-down'], 'fill');
    const borderRadius = text('--gv-image--bdrs', '50%');

    container.style = [
      { value: height, prop: '--gv-image--h' },
      { value: width, prop: '--gv-image--w' },
      { value: border, prop: '--gv-image--bd' },
      { value: of, prop: '--gv-image--of' },
      { value: borderRadius, prop: '--gv-image--bdrs' },
    ]
      .filter(({ value }) => value)
      .map(({ value, prop }) => `${prop}:${value}`)
      .join(';');

    return container;
  }))
  .add('Skeleton / Delay', withActions(() => {

    const container = document.createElement('div');
    container.innerHTML = `

<div class="title">Skeleton</div>
<gv-image src="${logoImage}" alt="Gravitee.io" style="--gv-image--w: 175px;" skeleton></gv-image>
<gv-image src="${logo}" alt="Gravitee.io"  style="--gv-image--w: 175px;" skeleton></gv-image>

<div class="title">Delay</div>
<gv-image id="imgDelay" alt="Gravitee.io" style="--gv-image--w: 175px;--gv-image--h: 175px;"</gv-image>

`;
    const imgDelay = container.querySelector('#imgDelay');
    imgDelay.src = Promise.resolve(logo).then(delay(2500));
    return container;
  }))
  .add('Errors', withActions(() => {

    const container = document.createElement('div');
    container.innerHTML = `

<div class="title">Empty</div>
<gv-image></gv-image>
<gv-image src=""></gv-image>
<gv-image src="${logo}" style="--gv-image--w: 175px;--gv-image--h: 175px;"></gv-image>

<div class="title">Errors</div>
<gv-image src="/fakepath" alt="Gravitee.io"</gv-image>

`;
    return container;
  }));
