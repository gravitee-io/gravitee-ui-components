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
import '../../src/atoms/gv-icon.js';
import notes from '../../.docs/gv-icon.md';
import { storiesOf } from '@storybook/html';
import { generateIcons } from '../lib/icons.generated';

import { select, text, color } from '@storybook/addon-knobs';

storiesOf('1. Atoms|<gv-icon>', module)
  .addParameters({ notes })
  .add('Basics', () => {

    const container = document.createElement('div');
    container.innerHTML = generateIcons();
    const categories = ['All'];
    container.querySelectorAll('.title').forEach((title) => categories.push(title.innerText));

    const category = select('Category', categories, categories[0]);
    const icon = text('Icon', '');

    if (category || icon) {
      container.querySelectorAll('[data-shape]').forEach((e) => {
        const { dataset: { shape } } = e;
        const hasCategory = (category !== categories[0] && !shape.startsWith(category));
        const hasIcon = icon && !shape.includes(icon);
        if (hasCategory || hasIcon) {
          e.classList.add('hide');
        }
      });
    }
    const iconColor = color('--gv--icon-c', '');
    const size = text('--gv-icon--s', '64px');

    container.style = [
      { value: iconColor, prop: '--gv-icon--c' },
      { value: size, prop: '--gv-icon--s' },
    ]
      .filter(({ value }) => value)
      .map(({ value, prop }) => `${prop}:${value}`)
      .join(';');

    return container;
  });
