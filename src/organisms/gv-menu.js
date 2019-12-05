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
import { isSameRoutes } from '../lib/utils';
import { classMap } from 'lit-html/directives/class-map';

/**
 * A menu
 *
 * @fires gv-nav-link:click - Custom event when nav link click
 *
 * @attr {Array} routes - definition of routes [{active: Boolean, icon: String, path: String, title: Promise<String>]
 * @attr {String} searchTitle - text use for title and placeholder of input
 *
 * @cssprop {String} --gv-menu--c - set the color.
 * @cssprop {String} --gv-menu--bgc - set the background color.
 * @cssprop {String} --gv-menu-link-active--bdb - set the border of active link.
 * @cssprop {String} --gv-menu--pl - set the padding left
 * @cssprop {String} --gv-menu--pr - set the padding right
 */
export class GvMenu extends LitElement {

  static get properties () {
    return {
      routes: { type: Array },
      searchTitle: { type: String },
      _small: { type: Boolean, attribute: false },
      _routes: { type: Array, attribute: false },
      hasFocus: { type: Boolean, attribute: false },
      _hasHeader: { type: Boolean, attribute: false },
    };
  }

  static get styles () {
    return [
      // language=css
      css`
          :host {
              --gv-nav-link--c: var(--gv-menu--c, #FFF);
              --gv-nav-link-active--c: var(--gv-menu--c, #FFF);
              --gv-nav-link--bgc: var(--gv-menu--bgc, #193E34);
              --gv-nav-link-active--bgc: var(--gv-menu--bgc, #193E34);
              --gv-nav-link-active--bdb: var(--gv-menu-link-active--bdb, 2px solid #D5FDCB);
              --width: var(--gv-nav--w, 70%)
          }

          div {
              background-color: var(--gv-menu--bgc, #193E34);
              color: var(--gv-menu--c, #FFF);
              display: table;
              width: 100%;
          }

          gv-nav, slot[name="right"] {
              display: table-cell;
              line-height: 50px;
              vertical-align: middle;
          }

          @keyframes slide {
              from {
                  width: 70%
              }

              to {
                  width: 50%;
              }
          }

          .has-focus gv-nav {
              animation: slide 0.5s;
              width: 50%;
          }

          .small gv-nav {
              width: 50%;
          }
          
          .has-header .nav-container {
              padding-left: 10rem;
              --gv-nav-link-a--pv: 0;
          }

          gv-nav {
              padding-left: var(--gv-menu--pl, 4rem);
              width: var(--width)
          }


          slot[name="right"] {
              padding-right: var(--gv-menu--pr, 4rem);
          }

      `,
    ];
  }

  set routes (candidate) {
    if (candidate) {
      Promise.resolve(candidate).then((candidates) => {
        if (candidates) {
          Promise.all(candidates).then((futureRoutes) => {
            if (!isSameRoutes(this._routes, futureRoutes)) {
              this._routes = futureRoutes;
            }
          });
        }
        else {
          this._routes = null;
        }
      });
    }
    else {
      this._routes = null;
    }
  }

  set small (small) {
    this._small = small;
    this.hasFocus = false;
    this._unbindInput();
  }

  _onClick (e) {
    if (!this._small) {
      if (this.input == null) {
        if (e.target && e.target.tagName.toLowerCase() === 'gv-input') {
          this._focusHandler = this._onFocusInput.bind(this);
          this._blurHandler = this._onBlurInput.bind(this);
          e.target.addEventListener('focus', this._focusHandler);
          e.target.addEventListener('blur', this._blurHandler);
          this.hasFocus = true;
          this.input = e.target;
        }
      }
      else {
        this.hasFocus = true;
      }
    }
  }

  _onFocusInput () {
    this.hasFocus = true;
    this.isSubmit = false;
  }

  _onBlurInput () {
    setTimeout(() => {
      this.hasFocus = false;
    }, 200);
  }

  _unbindInput () {
    if (this.input) {
      this.input.removeEventListener('focus', this._focusHandler);
      this.input.removeEventListener('blur', this._blurHandler);
      this.hasFocus = false;
      this.input = null;
    }
  }

  disconnectedCallback () {
    this._unbindInput();
    super.disconnectedCallback();
  }

  render () {
    if (this._routes) {
      this._hasHeader = false;
      for (const child of this.childNodes) {
        if (child.localName === 'gv-header-api') {
          this._hasHeader = true;
          break;
        }
      }

      const mainNav = document.createElement('gv-nav');
      mainNav.routes = this._routes;
      mainNav.small = this._small || this.hasFocus;
      return html`
      <div class="${classMap({ 'has-header': this._hasHeader })}">
        <slot id="header" name="header"></slot>
        <div class="${classMap({ small: this._small, 'has-focus': this.hasFocus })}">
        <div class="nav-container">${mainNav}</div>
        <slot name="right" @click="${this._onClick}"></slot>
        </div>
      </div>
    `;
    }
    return html``;
  }

}

window.customElements.define('gv-menu', GvMenu);
