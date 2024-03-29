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
import './gv-rating-list';
import { makeStory } from '../../../testing/lib/make-story';
import avatar from '../../../assets/images/avatar.png';
import { deepClone } from '../../lib/utils';
import { wait } from '../../../testing/lib/sequence';

const title = 'Top API !';
const comment =
  'Hinc ille commotus ut iniusta perferens et indigna pra custodiam protectoribus mandaverat fidis quo con perto Montius tunc Hinc ille commotus ut iniusta perferens et indigna pra custodiam.';
const admin = { id: 0, display_name: 'Administrator', _links: { avatar } };
const author = { id: 1, display_name: 'Jean Christophe' };
const date = new Date('2018-08-08');
const dateInTheFutur = new Date(new Date().getTime() + 1000 * 60 * 60);
const answers = [
  { author, comment: 'Awesome !', date: dateInTheFutur },
  { author, comment, date },
];

const ratings = [
  { id: 1, author: admin, value: '4', comment, date, title },
  { id: 2, author, value: '2', comment, date, title, answers },
  { id: 3, author: admin, value: '3', comment, date, title },
  { id: 4, author, value: '5', comment, date, title },
  { id: 5, author, value: '5', comment, date, title },
];

export default {
  title: 'Molecules/gv-rating-list',
  component: 'gv-rating-list',
};

const conf = {
  component: 'gv-rating-list',
  css: `
    gv-rating-list {
        display: inline-block;
       max-width: 80%;
    }
  `,
};

export const Readonly = makeStory(conf, {
  items: [{ ratings: deepClone(ratings), user: author }],
});

export const Empty = makeStory(conf, {
  items: [{ ratings: [], user: author }],
});

export const UpdateRating = makeStory(conf, {
  items: [{ ratings: deepClone(ratings), user: author, permissions: { update: [1, 3, 5] } }],
  docs: `
    \`permissions.update\` properties supports booleans or arrays of rating identifier
    In this case, \`update = [1, 3, 5]\`, we cannot update the rating of the second and fourth element.
  `,
});

export const DeleteRating = makeStory(conf, {
  items: [{ ratings: deepClone(ratings), user: author, permissions: { delete: [2, 3, 4] } }],
  docs: `
    \`permissions.update\` properties supports booleans or arrays of rating identifier
    In this case, \`update = [2, 3, 4]\`, we cannot delete the rating of the first and last element.
  `,
});

export const AddAnswer = makeStory(conf, {
  items: [{ ratings: deepClone(ratings), user: author, permissions: { addAnswer: true } }],
  play: async ({ component }) => {
    // First, click on button to open the textarea
    component.shadowRoot.querySelector('a').click();
    await wait(100);

    // Find the textarea and simulate some inputs
    const textArea = component.shadowRoot.querySelector('gv-text').shadowRoot.querySelector('textarea');
    textArea.focus();
    textArea.value = 'Awesome !';
    // Trigger an input event to trigger the validation + button state update
    textArea.dispatchEvent(
      new Event('input', {
        bubbles: true,
        composed: true,
      }),
    );

    await component.requestUpdate();
  },
});

export const DeleteAnswer = makeStory(conf, {
  items: [{ ratings: deepClone(ratings), user: author, permissions: { deleteAnswer: true } }],
});

export const Everything = makeStory(conf, {
  items: [{ ratings: deepClone(ratings), user: author, permissions: { update: true, delete: true, addAnswer: true, deleteAnswer: true } }],
});
