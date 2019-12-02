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
import '../../src/atoms/gv-card-category.js';
import notes from '../../.docs/gv-card-category.md';
import { storiesOf } from '@storybook/html';
import { color, number } from '@storybook/addon-knobs';
import { delay } from '../lib/delay';

const cards = [
  {
    name: 'Title',
  },
  {
    name: 'Truncated description if > 4 lines (Default)',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    name: 'Title + description + description limit',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
];

storiesOf('1. Atoms|<gv-card-category>', module)
  .addParameters({ notes })
  .add('Basics', () => {
    const limit = number('Limit size for description', '250');

    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title">Basics</div>
      `;

    cards.forEach((category) => {
      const gvCardCategory = document.createElement('gv-card-category');
      gvCardCategory.category = Promise.resolve(category);
      gvCardCategory.limit = limit;
      container.appendChild(gvCardCategory);
    });

    const bgc = color('--gv-card-category--bgc', '');
    const c = color('--gv-card-category--c', '');
    const h = color('--gv-card-category--h', '');

    container.style = [
      { value: bgc, prop: '--gv-card-category--bgc' },
      { value: c, prop: '--gv-card-category--c' },
      { value: h, prop: '--gv-card-category--h' },
    ]
      .filter(({ value }) => value)
      .map(({ value, prop }) => `${prop}:${value}`)
      .join(';');

    return container;

  })
  .add('Skeleton & Delay', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title">Skeleton & Delay</div>
      <gv-card-category></gv-card-category>
     <gv-card-category id="delay"></gv-card-category>
      `;

    container.querySelector('#delay').category = Promise.resolve(cards[2]).then(delay(2000));
    return container;
  })
  .add('Errors', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title">Reject promise</div>
     <gv-card-category id="error"></gv-card-category>
      `;

    container.querySelector('#error').category = Promise.reject(new Error());
    return container;
  });
