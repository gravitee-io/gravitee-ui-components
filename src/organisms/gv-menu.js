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
import { withResizeObserver } from '../mixins/with-resize-observer';

/**
 * A menu
 *
 * @fires gv-link:click - Custom event when link click
 *
 * @attr {Array} routes - definition of routes [{active: Boolean, icon: String, path: String, title: Promise<String>]
 *
 * @cssprop {Color} [--gv-menu--c=var(--gv-theme-font-color-light, #FFFFFF)] - Color
 * @cssprop {Color} [--gv-menu--bgc=var(--gv-theme-color-dark, #193E34)] - Background color.
 * @cssprop {Color} [--gv-menu-link-active--bdbc=var(--gv-theme-color-light, #D5FDCB)] - Border bottom color of active link.
 * @cssprop {String} [--gv-menu-link-active--bdbs=solid] - Border bottom style of active link.
 * @cssprop {Length} [--gv-menu-link-active--bdbw=3px] - Border bottom width of active link.
 * @cssprop {Color} [--gv-menu-link-active--bgc=transparent] - Active background color
 * @cssprop {Color} [--gv-menu-link--bgc=transparent] - Background color
 * @cssprop {Length} [--gv-menu-link-a--pv=0] - Link vertical padding
 */
export class GvMenu extends withResizeObserver(LitElement) {

  static get properties () {
    return {
      /** @required **/
      routes: { type: Array },
      _small: { type: Boolean, attribute: false },
      _routes: { type: Array, attribute: false },
      _hasHeader: { type: Boolean, attribute: false },
    };
  }

  static get styles () {
    return [
      // language=css
      css`
          :host {
              --gv-link--c: var(--gv-menu--c, var(--gv-theme-font-color-light, #FFFFFF));
              --gv-link-active--c: var(--gv-menu--c, var(--gv-theme-font-color-light, #FFFFFF));
              --gv-link--bgc: var(--gv-menu-link--bgc, transparent);
              --gv-link-active--bgc: var(--gv-menu-link-active--bgc, transparent);
              --gv-link-active--bdbc: var(--gv-menu-link-active--bdbc, var(--gv-theme-color-light, #D5FDCB));
              --gv-link-active--bdbs: var(--gv-menu-link-active--bdbs, solid);
              --gv-link-active--bdbw: var(--gv-menu-link-active--bdbw, 3px);
              --pr: var(--gv-theme-layout--pr, 4rem);
              --pl: var(--gv-theme-layout--pl, 4rem);
              box-sizing: border-box;
              display: block;
          }

          :host([w-lt-1024]) {
              --pr: 5px;
              --pl: 5px;
          }

          :host([w-lt-768]) .nav-container {
              width: 100%;
              padding-left: var(--pl);
              --gv-link-a--pv: var(--gv-menu-link-a--pv, 0);
          }

          :host([w-lt-580]) .nav-container {
              flex: auto;
              padding-left: 0;
          }

          :host([w-lt-580]) gv-nav {
              flex: auto;
          }

          :host([w-lt-580]) .right {
              flex: auto;
          }

          :host([w-lt-380]) .nav-container {
            display: flex;
            flex-direction: column-reverse;
          }

          :host([w-lt-380]) gv-nav {
              align-self: flex-start;
              flex: 1;
          }

          :host([w-lt-380]) .right {
              align-self: flex-end;
              flex: 1;
              width: 100%;
              padding-right: 0;
          }

          :host > div {
              background-color: var(--gv-menu--bgc, var(--gv-theme-color-dark, #193E34));
              color: var(--gv-menu--c, var(--gv-theme-font-color-light, #FFFFFF));
          }

          gv-nav {
              display: table-cell;
              line-height: 50px;
              vertical-align: middle;
          }

          .nav-container {
              display: flex;
              align-items: center;
          }

          .has-header .nav-container {
              width: calc(100% - 10rem);
              padding-left: 10rem;
              --gv-link-a--pv: 0;
          }

          .right {
              display: flex;
              padding-right: var(--pr);
              justify-content: flex-end;
              flex: 3;
          }

          gv-nav {
              padding-left: var(--pl);
              flex: 4;
          }

          .right ::slotted(*) {
              align-self: flex-end;
          }

          .right ::slotted([slot="input"]) {
              transition: width 0.5s ease;
              width: 70%;
          }

          .right:focus-within ::slotted([slot="input"]) {
              animation: slide 0.5s;
              transition: width 0.5s ease-in-out;
              width: 100%;
          }

          .right ::slotted([slot="button"]) {
              --gv-button--p: 7px 16px;
              --gv-button--fz: 15px;
          }

      `,
    ];
  }

  constructor () {
    super();
    /** @protected */
    this._routes = [];
    this.breakpoints = {
      // ceiled width with 275px tiles and 1rem (16px) gap
      width: [380, 580, 768, 1024],
    };
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
          this._routes = [];
        }
      });
    }
    else {
      this._routes = [];
    }
  }

  onResize ({ width }) {
    if (width <= 1024) {
      this._small = true;
    }
    else {
      this._small = false;
    }
  }

  render () {
    return html`
      <div class="${classMap({ 'has-header': this._hasHeader })}">
        <slot name="header"></slot>
        <div class="nav-container">
            <gv-nav .routes="${this._routes}" ?small="${this._small}"></gv-nav>
            <div class="right"><slot name="input"></slot><slot name="button"></slot></div>
        </div>
      </div>
    `;
  }

  updated (changedProperties) {
    super.updated(changedProperties);
    let _header = false;
    for (const node of this.childNodes) {
      if (node.nodeType === 1) {
        const child = node.nodeName.toLowerCase() === 'gv-header' ? node : node.querySelector('gv-header');
        if (child) {
          _header = true;
          break;
        }
      }
    }
    this._hasHeader = _header;
  }

}

window.customElements.define('gv-menu', GvMenu);
