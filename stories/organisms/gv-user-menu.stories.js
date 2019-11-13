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
import '../../src/organisms/gv-user-menu.js';
import notes from '../../.docs/gv-user-menu.md';
import { storiesOf } from '@storybook/html';
import { withCustomEventActions } from '../lib/event-action.js';
import { color, text } from '@storybook/addon-knobs';
import bigImage from '../../assets/images/gravitee-logo-darker.png';
const withActions = withCustomEventActions('gv-nav-link:click', 'click');
const routes = [
  { path: '#', title: 'My account', icon: 'general:user' },
  { path: '#', title: 'My apis', icon: 'cooking:cooking-book' },
  { path: '#', title: 'My apps', icon: 'cooking:bowl' },
  { path: '#', title: Promise.resolve('logout'), icon: 'home:door-open', separator: true },
];

const avatarSrc = 'http://picsum.photos/48';
storiesOf('3. Organisms|<gv-user-menu>', module)
  .addParameters({ notes })
  .add('Basics', withActions(() => {

    const username = text('username', 'Richard T.');
    const backgroundColor = color('--gv-user-menu--bgc', '');
    const hoverBackgroundColor = color('--gv-user-menu-hover--bgc', '');
    const fontColor = color('--gv-user-menu--c', '');
    const hoverFontColor = color('--gv-user-menu-hover--c', '');
    const borderColor = color('--gv-user-menu--bdc', '');

    const container = document.createElement('div');

    const themeMenuTitle = document.createElement('div');
    themeMenuTitle.className = 'title';
    themeMenuTitle.innerHTML = 'Theme menu';

    const themeMenu = document.createElement('gv-user-menu');
    themeMenu.routes = routes;
    themeMenu.username = username;

    const themeMenuAvatar = document.createElement('img');
    themeMenuAvatar.alt = username;
    themeMenuAvatar.src = avatarSrc;
    themeMenu.appendChild(themeMenuAvatar);

    themeMenu.style = [
      { value: backgroundColor, prop: '--gv-user-menu--bgc' },
      { value: hoverBackgroundColor, prop: '--gv-user-menu-hover--bgc' },
      { value: fontColor, prop: '--gv-user-menu--c' },
      { value: hoverFontColor, prop: '--gv-user-menu-hover--c' },
      { value: borderColor, prop: '--gv-user-menu--bdc' },
    ]
      .filter(({ value }) => value)
      .map(({ value, prop }) => `${prop}:${value}`)
      .join(';');

    container.appendChild(themeMenuTitle);
    container.appendChild(themeMenu);

    return container;
  }))
  .add('In header', withActions(() => {

    const container = document.createElement('div');
    container.innerHTML = `
        <div class="title">In Header</div>
        
        <div style="display: table; border: 1px solid; #262626">
            <div style="display: table-cell; width: 10%">
            </div>
            <div style="display: table-cell; width: 60%">
              <p> H E A D E R</p>
            </div>
            <div style="display: table-cell; width: 30%">
               <gv-user-menu username="Jean C.">
                    <img src="${bigImage}" />
               </gv-user-menu>
            </div>
         
      </div>
      `;

    container.querySelector('gv-user-menu').routes = routes;

    return container;
  }));
