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
import '../../src/molecules/gv-identity-picture';
import notes from '../../.docs/gv-identity-picture.md';
import picture from '../../assets/images/logo.png';
import { makeStory } from '../lib/make-story';

export default {
  title: 'Molecules|gv-identity-picture',
  component: 'gv-identity-picture',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-identity-picture',
  css: `
    gv-identity-picture {
      height: 40px;
      width: 40px;
    }
  `,
};
export const withPicture = makeStory(conf, {
  items: [{ display_name: 'Gravatar', picture }],
});

export const withoutPicture = makeStory(conf, {
  items: [{ display_name: 'Jean Jean' }],
});

export const withPictureAndNotif = makeStory(conf, {
  items: [{ display_name: 'Gravatar', picture, notification: true }],
});

export const withoutPictureAndNotif = makeStory(conf, {
  items: [{ display_name: 'Jean Jean', notification: true }],
});
