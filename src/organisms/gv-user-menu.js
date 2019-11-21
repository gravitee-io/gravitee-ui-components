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
import { LitElement, html, css } from 'lit-element';
import '../molecules/gv-nav';
import { repeat } from 'lit-html/directives/repeat';
import { classMap } from 'lit-html/directives/class-map';

/**
 * A menu
 *
 * @fires gv-nav-link:click - Custom event when nav link click
 *
 * @attr {Array} routes - definition of user routes [{icon: String, path: String, title: Promise<String>]
 * @attr {String} username - name of the user
 * @attr {String} avatar - url of the user avatar
 *
 * @cssprop {String} --gv-user-menu([-hover]*)--c - set the color.
 * @cssprop {String} --gv-user-menu([-hover]*)--bgc - set the background color.
 * @cssprop {String} --gv-user-menu--bdc - set the border color.
 */
export class GvUserMenu extends LitElement {

  static get properties () {
    return {
      avatar: { type: String },
      routes: { type: Array, attribute: false },
      _isClosed: { type: Boolean, attribute: false },
      username: { type: String },
    };
  }

  static get styles () {
    return [
      // language=css
      css`
          :host {
              --bdc: var(--gv-user-menu--bdc, lightgrey);
              --c: var(--gv-user-menu--c, #262626);
              --bgc: var(--gv-user-menu--bgc, #FFF);
              --hover-bgc: var(--gv-user-menu-hover--bgc, grey);
              --gv-nav-link-active--c: var(--gv-user-menu-hover--c, white);
              --gv-icon--h: 16px;
              --gv-icon--w: 16px;
              --gv-nav-link-a--ph: 0;
              --gv-nav-link--ta: right;
          }

          .user-menu {
              list-style: none;
              margin: 0;
              padding: 0;
              display: inline-block;
              position: relative;
          }

          .user-menu__title {
              background-color: var(--bgc);
              color: var(--c);
              border-left: 1px solid var(--bdc);
              cursor: pointer;
              line-height: 40px;
              padding: 8px 24px;
              display: inline-flex;
              align-items: center;
              justify-content: space-between;
              min-width: 175px;
          }

          ::slotted(*) {
              display: inline-block;
              vertical-align: middle;
              max-height: 40px;
          }

          .user-menu__title span {
              flex: 1;
              text-align: center;
              margin: 0 0.4rem;
          }

          .user-menu__title > gv-icon {
              transition: all 0.3s ease 0s;
          }

          .user-menu__list {
              position: absolute;
              background-color: var(--bgc);
              list-style: none;
              padding: 0;
              transition: all 0.3s ease 0s;
              width: 100%;
          }

          .user-menu__list__item {
              border-left: 1px solid var(--bdc);
              display: flex;
              align-items: center;
              transition: all 0.5s ease;
              padding: 2px 30px;
          }

          .user-menu__list__item:hover {
              background-color: var(--hover-bgc);
              border-left: 1px dotted var(--bdc);
              font-weight: 500;
          }

          gv-nav-link {
              margin: 0px;
              display: flex;
              width: 100%;
          }

          .separator {
              border-top: 1px solid var(--bdc);
          }

          /** for animations */
          .user-menu__list {
              visibility: visible;
              opacity: 1;
              transform: translateY(0%);
              z-index: 100;
              transition-delay: 0s, 0s, 0.2s;
          }

          .closed .user-menu__list {
              visibility: hidden;
              opacity: 0;
              transform: translateY(-2em);
              z-index: -1;
          }

          gv-icon {
              transform: rotate(0deg);
          }

          .closed gv-icon {
              transform: rotate(-180deg);
          }
      `,
    ];
  }

  constructor () {
    super();
    this._isClosed = true;
  }

  _onClick (e) {
    e.preventDefault();
    this._isClosed = !this._isClosed;
  }

  _onMouseLeave () {
    this._isClosed = true;
  }

  _onSelect (e) {
    this._isClosed = true;
  }

  render () {
    const classes = { closed: this._isClosed };

    return html`
      <nav class="${classMap(classes)}">
        <ul class="user-menu" @mouseleave=${this._onMouseLeave}>
          <li class="user-menu__title" @click=${this._onClick} >
            <div class="user-menu__avatar">
               <slot></slot>
            </div>
         
            <span>${this.username}</span>
            <gv-icon shape="design:triangle"></gv-icon>
          </li>
          <li class="user-menu__content">
            <ul class="user-menu__list">
                ${repeat(this.routes, (route) => route, (route) => html`
                    <li class="user-menu__list__item ${route.separator ? 'separator' : ''}">
                      <gv-nav-link 
                        .icon="${route.icon}"
                        .path="${route.path}"
                        .title="${route.title}"
                         @click=${this._onSelect}
                      ></gv-nav-link>
                    </li>
                `)}
            </ul>
          </li>
        </ul>
      </nav>
    `;
  }

}

window.customElements.define('gv-user-menu', GvUserMenu);
