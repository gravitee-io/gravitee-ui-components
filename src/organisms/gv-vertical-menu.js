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
import { css, html, LitElement } from 'lit-element';
import '../molecules/gv-nav';
import '../atoms/gv-image';
import { isSameRoutes } from '../lib/utils';

/**
 * A vertical menu
 *
 * @fires gv-link:click - Custom event when link click
 *
 * @attr {Array} routes - definition of routes [{active: Boolean, icon: String, path: String, title: Promise<String>]
 *
 */
export class GvVerticalMenu extends LitElement {
  static get properties() {
    return {
      /** @required **/
      routes: { type: Array },
      _routes: { type: Array, attribute: false },
      logo: { type: String },
    };
  }

  static get styles() {
    return [
      // language=css
      css`
        :host {
          --gv-link--c: var(--gv-menu--c, var(--gv-theme-font-color-light, #ffffff));
          --gv-link-active--c: var(--gv-menu--c, var(--gv-theme-font-color-light, #ffffff));
          --gv-link--bgc: var(--gv-menu-link--bgc, transparent);
          --gv-link-active--bgc: var(--gv-menu-link-active--bgc, transparent);
          --gv-link-active--bdw: var(--gv-menu-link-active--bdw, 0 0 0 4px);
          --gv-link-active--bdc: var(--gv-menu-link-active--bdc, var(--gv-theme-color-light, #86c3d0));
          --gv-link-active--bds: var(--gv-menu-link-active--bds, solid);
          --pr: var(--gv-theme-layout--pr, 4rem);
          --pl: var(--gv-theme-layout--pl, 4rem);
          box-sizing: border-box;
          display: block;
          font-size: var(--gv-theme-font-size-s, 16px);
          width: var(--gv-theme-layout-menu-w, 200px);
        }

        .menu-container {
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          background-color: var(--gv-menu--bgc, var(--gv-theme-color-dark, #28444f));
          color: var(--gv-menu--c, var(--gv-theme-font-color-light, #ffffff));
        }

        gv-image {
          height: 200px;
          width: 200px;
        }

        gv-nav {
          transition: width 250ms ease-in-out;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          line-height: 20px;
          vertical-align: middle;
          width: 100%;
          font-size: 16px;
        }
      `,
    ];
  }

  constructor() {
    super();
    /** @protected */
    this._routes = [];
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

  render() {
    return html`
      <div class="menu-container">
        ${this.logo ? html`<gv-image .src="${this.logo}"></gv-image>` : ''}
        <div class="nav-container">
          <gv-nav .routes="${this._routes}" vertical></gv-nav>
        </div>
      </div>
    `;
  }
}

window.customElements.define('gv-vertical-menu', GvVerticalMenu);
