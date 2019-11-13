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

storiesOf('1. Atoms|<gv-card-category>', module)
  .add('Basics', () => {
    const limit = number('Limit size for description', '');

    const cards = [
      {
        title: 'Title',
      },
      {
        title: 'Truncated description if > 4 lines (Default)',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        title: 'Title + description + description limit',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        limit: limit || 50,
      },
    ];

    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title">Cards</div>
      `;

    cards.forEach((card) => {
      const gvCardCategory = document.createElement('gv-card-category');
      gvCardCategory.title = card.title;
      gvCardCategory.description = card.description;
      gvCardCategory.limit = card.limit;
      container.appendChild(gvCardCategory);
    });

    const cardCategoryBackgroundColor = color('--gv-card-category--bgc', '');
    const cardCategoryFontColor = color('--gv-card-category--c', '');

    container.style = [
      { value: cardCategoryBackgroundColor, prop: '--gv-card-category--bgc' },
      { value: cardCategoryFontColor, prop: '--gv-card-category--c' },
    ]
      .filter(({ value }) => value)
      .map(({ value, prop }) => `${prop}:${value}`)
      .join(';');

    return container;

  }, { notes });
