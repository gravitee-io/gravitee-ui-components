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
import './gv-user-menu';
import bigImage from '../../../assets/images/gravitee-logo-cyan.svg';
import avatarSrc from '../../../assets/images/avatar.png';
import { makeStory, storyWait } from '../../../testing/lib/make-story';

const routes = [
  { path: 'https://gravitee.io', title: 'External link', icon: 'communication:share', separator: true, target: '_blank' },
  { path: '#', title: 'My account', icon: 'general:user' },
  { path: '#', title: 'My apis', icon: 'cooking:cooking-book' },
  { path: '#', title: 'My very long category that breaks the menu', icon: 'cooking:cooking-book' },
  { path: '#', title: 'My apps', icon: 'cooking:bowl' },
  { path: '#', title: Promise.resolve('logout'), icon: 'home:door-open', separator: true },
];

export default {
  title: 'Organisms/gv-user-menu',
  component: 'gv-user-menu',
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
  items: [{ routes, username, innerHTML: '<gv-identity-picture rounded></gv-identity-picture>' }],
  simulations: [
    storyWait(0, ([component]) => {
      component.firstElementChild.display_name = username;
      component.firstElementChild.type = 'USER';
    }),
  ],
});

export const withPicture = makeStory(conf, {
  items: [{ routes, username, innerHTML: '<gv-identity-picture rounded></gv-identity-picture>' }],
  simulations: [
    storyWait(0, ([component]) => {
      component.firstElementChild.display_name = 'Gravatar';
      component.firstElementChild.picture = avatarSrc;
      component.firstElementChild.type = 'USER';
    }),
  ],
});

export const withLargePicture = makeStory(conf, {
  items: [{ routes, username, innerHTML: '<gv-identity-picture rounded></gv-identity-picture>' }],
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

const routesWithGroups = [
  { path: '/settings/me', title: 'Your profile', icon: 'general:user', separator: true },
  {
    title: 'Accounts',
    routes: [
      { path: '/accounts/1/organizations', title: 'Account 1', icon: 'home:building', active: true },
      { path: '/accounts/2/organizations', title: 'Account 2', icon: 'home:building', active: false },
      { path: '/accounts/3/organizations', title: 'Account 3', icon: 'home:building', active: false },
    ],
    class: 'account',
    separator: true,
  },
  { path: '/settings/accounts', title: 'General settings', icon: 'general:settings#2', separator: true },
  { path: '/logout', title: 'Logout', icon: 'home:door-open', separator: true },
];

export const withRouteGroups = makeStory(conf, {
  items: [{ routes: routesWithGroups, username, innerHTML: '<gv-identity-picture rounded></gv-identity-picture>' }],
  simulations: [
    storyWait(0, ([component]) => {
      component.firstElementChild.display_name = 'Gravatar';
      component.firstElementChild.picture = avatarSrc;
      component.firstElementChild.type = 'USER';
    }),
  ],
});
