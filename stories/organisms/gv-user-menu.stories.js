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
import '../../src/organisms/gv-user-menu';
import notes from '../../.docs/gv-user-menu.md';
import bigImage from '../../assets/images/gravitee-logo.png';
import avatarSrc from '../../assets/images/logo.png';
import { makeStory, storyWait } from '../lib/make-story';

const routes = [
  { path: 'https://gravitee.io', title: 'External link', icon: 'communication:share', separator: true, target: '_blank' },
  { path: '#', title: 'My account', icon: 'general:user' },
  { path: '#', title: 'My apis', icon: 'cooking:cooking-book' },
  { path: '#', title: 'My apps', icon: 'cooking:bowl' },
  { path: '#', title: Promise.resolve('logout'), icon: 'home:door-open', separator: true },
];

export default {
  title: 'Organisms|gv-user-menu',
  component: 'gv-user-menu',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-user-menu',
  css: `
    :host {
      height: 300px;
    }
  `,
};

const username = 'Richard T.';
export const Basics = makeStory(conf, {
  items: [
    { routes, username, innerHTML: '<gv-identity-picture rounded></gv-identity-picture>' },
  ],
  simulations: [
    storyWait(0, ([component]) => {
      component.firstElementChild.display_name = username;
      component.firstElementChild.type = 'USER';
    }),
  ],
});

export const withPicture = makeStory(conf, {
  items: [
    { routes, username, innerHTML: '<gv-identity-picture rounded></gv-identity-picture>' },
  ],
  simulations: [
    storyWait(0, ([component]) => {
      component.firstElementChild.display_name = 'Gravatar';
      component.firstElementChild.picture = avatarSrc;
      component.firstElementChild.type = 'USER';
    }),
  ],
});

export const withLargePicture = makeStory(conf, {
  items: [
    { routes, username, innerHTML: '<gv-identity-picture rounded></gv-identity-picture>' },
  ],
  simulations: [
    storyWait(0, ([component]) => {
      component.firstElementChild.display_name = 'Gravatar';
      component.firstElementChild.picture = bigImage;
      component.firstElementChild.type = 'USER';
    }),
  ],
});

export const withoutUser = makeStory(conf, {
  items: [{ routes: [{ path: '#', title: 'Log in' }] }],
});
