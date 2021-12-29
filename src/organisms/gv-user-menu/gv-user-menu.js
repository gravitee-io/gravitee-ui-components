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
import { LitElement, html, css } from 'lit';
import '../../molecules/gv-nav';
import { repeat } from 'lit/directives/repeat';
import { classMap } from 'lit/directives/class-map';
import { isSameRoutes } from '../../lib/utils';

/**
 * User menu
 *
 * ## Details
 * * has @theme facet
 *
 * @fires gv-link:click - Custom event when nav link click
 *
 * @attr {Array} routes - definition of user routes [{icon: String, path: String, title: Promise<String>, active: Boolean, routes: Array<any>]
 * @attr {String} username - name of the user
 * @attr {String} avatar - url of the user avatar
 *
 * @cssprop {Color} [--gv-user-menu--c=var(--gv-theme-font-color-dark, #262626)] - Color
 * @cssprop {Color} [--gv-user-menu-hover--c=var(--gv-theme-color-dark, #28444f)] - Hover color
 * @cssprop {Color} [--gv-user-menu--bgc=transparent] - Background color
 * @cssprop {Color} [--gv-user-menu-list--bgc=var(--gv-theme-neutral-color-lightest, #ffffff)] - List background color
 * @cssprop {Color} [--gv-user-menu-hover--bgc=var(--gv-theme-color-light, #86c3d0)] - Hover background color
 * @cssprop {Color} [--gv-user-menu--bdc=lightgrey] - Border color
 * @cssprop {String} [--gv-user-menu--tsh=none] - Text shadow
 * @cssprop {Color} [--gv-user-menu-icon--c=var(--gv-theme-neutral-color-darkest, #000000)] - Icon color
 * @cssprop {Length} [--gv-user-menu-icon--s=16px] - Height and icon width
 * @cssprop {Length} [--gv-user-menu-link-a--ph=0px] - Link horizontal padding
 * @cssprop {String} [--gv-user-menu-link--ta=right] - Text align
 */
export class GvUserMenu extends LitElement {
  static get properties() {
    return {
      avatar: { type: String },
      routes: { type: Array },
      _routes: { type: Array, attribute: false },
      _isClosed: { type: Boolean, attribute: false },
      username: { type: String },
    };
  }

  static get styles() {
    return [
      // language=css
      css`
        :host {
          --bdc: var(--gv-user-menu--bdc, lightgrey);
          --c: var(--gv-user-menu--c, var(--gv-theme-font-color-dark, #262626));
          --bgc: var(--gv-user-menu--bgc, transparent);
          --list-bgc: var(--gv-user-menu-list--bgc, var(--gv-theme-neutral-color-lightest, #ffffff));
          --hover-bgc: var(--gv-user-menu-hover--bgc, var(--gv-theme-color-light, #86c3d0));
          --gv-link-active--c: var(--gv-user-menu-hover--c, var(--gv-theme-color-dark, #28444f));
          --gv-icon--c: var(--gv-user-menu-icon--c, var(--gv-theme-neutral-color-darkest, #000000));
          --gv-icon--s: var(--gv-user-menu-icon--s, 16px);
          --gv-link-a--ph: var(--gv-user-menu-link-a--ph, 0px);
          --gv-link--ta: var(--gv-user-menu-link--ta, right);
          user-select: none;
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
          border-left: 1px solid var(--bdc);
          color: var(--c);
          cursor: pointer;
          line-height: 40px;
          padding: 8px 24px;
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          min-width: 175px;
          text-shadow: var(--gv-user-menu--tsh, none);
        }

        ::slotted(*) {
          height: 40px;
          width: 40px;
        }

        .user-menu__title.no-user {
          padding: 5px 24px;
        }

        .user-menu__title gv-link {
          --gv-link-a--ph: 0;
          --gv-link-a--pv: 0;
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
          background-color: var(--list-bgc);
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

        .user-menu__list__item:last-child {
          border-bottom: 1px solid var(--bdc);
        }

        .user-menu__list__item:hover {
          background-color: var(--hover-bgc);
          border-left: 1px dotted var(--bdc);
          font-weight: 500;
        }

        gv-link {
          margin: 0px;
          display: flex;
          width: 100%;
        }

        .separator {
          border-top: 1px solid var(--bdc);
        }

        .active {
          background-color: var(--gv-theme-neutral-color-dark, #d9d9d9);
          font-weight: bold;
        }

        /** for animations */
        .user-menu__list {
          visibility: visible;
          opacity: 1;
          transform: translateY(0%);
          z-index: 100;
          transition-delay: 0s, 0s, 0.2s;
        }

        .user-menu__list__group {
          border-top: 1px solid var(--bdc);
          background-color: var(--gv-theme-neutral-color-light, #efefef);
          padding-left: 0;
        }

        .user-menu__list__group__title {
          font-size: small;
          color: var(--gv-theme-color-darker, #383e3f);
          border-left: 1px solid var(--bdc);
          padding-left: 10px;
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

  constructor() {
    super();
    this._isClosed = true;
  }

  _onClick(e) {
    e.preventDefault();
    this._isClosed = !this._isClosed;
  }

  _onMouseLeave() {
    this._isClosed = true;
  }

  _onSelect() {
    this._isClosed = true;
  }

  _hasOneItem() {
    return this.username == null && this._routes && this._routes.length === 1;
  }

  set routes(candidate) {
    if (candidate) {
      Promise.resolve(candidate).then((candidates) => {
        if (candidates) {
          Promise.all(candidates).then((futureRoutes) => {
            if (!isSameRoutes(this._routes, futureRoutes)) {
              this._routes = futureRoutes.filter((r) => r != null);
            }
          });
        } else {
          this._routes = null;
        }
      });
    } else {
      this._routes = null;
    }
  }

  _renderFirstItem() {
    if (this._routes) {
      if (this.username) {
        return html`<li class="user-menu__title" @click=${this._onClick}>
          <div>
            <slot></slot>
          </div>
          <span>${this.username}</span>
          <gv-icon shape="design:triangle"></gv-icon>
        </li>`;
      } else if (this._hasOneItem()) {
        const firstItem = this._routes[0];
        return html`<li class="user-menu__title no-user" @click=${this._onClick}>
          <gv-link .icon="${firstItem.icon}" .path="${firstItem.path}" .title="${firstItem.title}" @click=${this._onSelect}></gv-link>
        </li>`;
      }
    }
    return html``;
  }

  render() {
    const classes = { closed: this._isClosed };
    if (this._routes) {
      return html`
        <nav class="${classMap(classes)}">
          <ul class="user-menu" @mouseleave=${this._onMouseLeave}>
            ${this._renderFirstItem()}

            <li class="user-menu__content">
              <ul class="user-menu__list">
                ${repeat(
                  this._routes,
                  (route) => route,
                  (route, index) => html` ${this._hasOneItem() ? html`` : this._renderItem(route)} `,
                )}
              </ul>
            </li>
          </ul>
        </nav>
      `;
    }
    return html``;
  }

  _renderItem(route) {
    if (route.routes) {
      return html`<ul class="user-menu__list__group">
        <span class="user-menu__list__group__title">${route.title}</span>
        ${repeat(
          route.routes,
          (childRoute) => childRoute,
          (childRoute, index) => html` ${this._renderItem(childRoute)} `,
        )}
      </ul>`;
    } else {
      return html`<li
        class="user-menu__list__item ${route.separator ? 'separator' : ''} ${route.active ? 'active' : ''}"
        style="${route.style}"
      >
        <gv-link
          .icon="${route.icon}"
          .path="${route.path}"
          .title="${route.title}"
          .target="${route.target}"
          @click=${this._onSelect}
        ></gv-link>
      </li>`;
    }
  }
}

window.customElements.define('gv-user-menu', GvUserMenu);
