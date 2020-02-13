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
import '../../src/molecules/gv-rating-list';
import notes from '../../.docs/gv-rating-list.md';
import { makeStory } from '../lib/make-story';

const title = 'Top API !';
const comment
  = 'Hinc ille commotus ut iniusta perferens et indigna pra custodiam protectoribus mandaverat fidis quo con perto Montius tunc Hinc ille commotus ut iniusta perferens et indigna pra custodiam.';
const author = { id: 1, display_name: 'Jean Christophe' };
const date = new Date();
const answers = [
  { author, comment: 'Awesome !', date },
  { author, comment, date },
];

const ratings = [
  { author, value: '4', comment, date, title },
  { author, value: '2', comment, date, title, answers },
  { author, value: '3', comment, date, title },
  { author, value: '5', comment, date, title },
  { author, value: '5', comment, date, title },
];

export default {
  title: 'Molecules|gv-rating-list',
  component: 'gv-rating-list',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-rating-list',
};

export const Reader = makeStory(conf, {
  items: [{ ratings, user: author }],
});

export const Edit = makeStory(conf, {
  items: [{ ratings, user: author, permissions: { RATING: ['U', 'D'] } }],
});

export const Answer = makeStory(conf, {
  items: [{ ratings, user: author, permissions: { RATING_ANSWER: ['C', 'D'] } }],
});
