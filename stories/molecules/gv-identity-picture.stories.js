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
import logo from '../../assets/images/logo.png';
import bigImage from '../../assets/images/gravitee-logo-inline.png';
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
      height: 100px;
      width: 100px;
    }
  `,
};

export const identicon = makeStory(conf, {
  items: [{ display_name: 'Jean Jean' }],
});

export const picture = makeStory(conf, {
  items: [{ display_name: 'Gravatar', picture: bigImage }],
});

export const identiconRounded = makeStory(conf, {
  items: [{ display_name: 'Jean Jean', rounded: true }],
});

export const pictureRounded = makeStory(conf, {
  items: [{ display_name: 'Gravatar', picture: bigImage, rounded: true }],
});

export const identiconNotification = makeStory(conf, {
  items: [{ display_name: 'Jean Jean', notification: true, rounded: true }],
});

export const pictureNotification = makeStory(conf, {
  items: [{ display_name: 'Gravatar', picture: logo, notification: true, rounded: true }],
});
