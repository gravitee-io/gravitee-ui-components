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
import '../../src/molecules/gv-rating.js';
import notes from '../../.docs/gv-rating.md';
import { storiesOf } from '@storybook/html';
import { color, text } from '@storybook/addon-knobs';

storiesOf('2. Molecules|<gv-rating>', module)
  .addParameters({ notes })
  .add('Basics', () => {

    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title">Empty</div>
      <gv-rating></gv-rating>
      
      <div class="title">Basics</div>
      <gv-rating average="3"></gv-rating>
      <gv-rating average="3.2"></gv-rating>
      <gv-rating average="3.3"></gv-rating>
      <gv-rating average="4.5"></gv-rating>
      
      <div class="title">Count</div>
      <gv-rating average="3" count="345"></gv-rating>
      
      <div class="title">Skeleton</div>
      <gv-rating average="3" count="345" skeleton></gv-rating>
      
      <div class="title">Errors</div>
      <gv-rating average="-1"></gv-rating>
      <gv-rating average="6"></gv-rating>
    `;

    const iconColor = color('--gv-rating--c', '');
    const iconSize = text('--gv-rating--s', '13px');

    container.style = [
      { value: iconColor, prop: '--gv-rating--c' },
      { value: iconSize, prop: '--gv-rating--s' },
    ]
      .filter(({ value }) => value)
      .map(({ value, prop }) => `${prop}:${value}`)
      .join(';');

    return container;
  });
