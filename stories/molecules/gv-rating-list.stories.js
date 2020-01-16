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
import '../../src/molecules/gv-rating-list.js';
import notes from '../../.docs/gv-rating-list.md';
import { storiesOf } from '@storybook/html';
import { withActions } from '@storybook/addon-actions';

const eventNames = ['gv-rating-list:answer', 'gv-rating-list:delete', 'gv-rating-list:delete-answer', 'gv-rating-list:update'];
const title = 'Top API !';
const comment = 'Hinc ille commotus ut iniusta perferens et indigna pra custodiam protectoribus mandaverat fidis quo con perto Montius tunc Hinc ille commotus ut iniusta perferens et indigna pra custodiam.';
const author = { id: 1, display_name: 'Jean Christophe' };
const date = new Date();
const answers = [{ author, comment: 'Awesome !', date }, { author, comment, date }];

const ratings = [
  { author, value: '4', comment, date, title },
  { author, value: '2', comment, date, title, answers },
  { author, value: '3', comment, date, title },
  { author, value: '5', comment, date, title },
  { author, value: '5', comment, date, title },
];

storiesOf('2. Molecules|<gv-rating-list>', module)
  .addParameters({ notes })
  .add('Read', () => withActions(...eventNames)(() => {

    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title">permissions = {}</div>
      <gv-rating-list></gv-rating-list>
    `;
    container.querySelectorAll('gv-rating-list').forEach((element) => {
      element.ratings = ratings;
      element.user = author;
    });
    return container;
  }))
  .add('Edit', () => withActions(...eventNames)(() => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title">permissions = {RATING = ['U', 'D']}</div>
      <gv-rating-list></gv-rating-list>
    `;
    container.querySelectorAll('gv-rating-list').forEach((element) => {
      element.ratings = ratings;
      element.user = author;
      element.permissions = { RATING: ['U', 'D'] };
    });
    return container;
  }))
  .add('Answer', () => withActions(...eventNames)(() => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title">permissions = {RATING_ANSWER = ['C']}</div>
      <gv-rating-list></gv-rating-list>
    `;
    container.querySelectorAll('gv-rating-list').forEach((element) => {
      element.ratings = ratings;
      element.user = author;
      element.permissions = { RATING_ANSWER: ['C', 'D'] };
    });
    return container;
  }));
