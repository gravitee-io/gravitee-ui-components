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
 * @fires gv-nav-link:click - Custom event when nav link click
 *
 * @attr {Array} routes - definition of routes [{active: Boolean, icon: String, path: String, title: Promise<String>]
 *
 * @cssprop {String} [--gv-menu--c=#FFF] - set the color.
 * @cssprop {String} [--gv-menu--bgc=#193E34] - set the background color.
 * @cssprop {String} [--gv-menu-link-active--bdb=3px solid #D5FDCB] - set the border of active link.
 * @cssprop {String} [--gv-menu--pl=4rem] - set the padding left
 * @cssprop {String} [--gv-menu--pr=4rem] - set the padding right
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
              --gv-nav-link--c: var(--gv-menu--c, #FFF);
              --gv-nav-link-active--c: var(--gv-menu--c, #FFF);
              --gv-nav-link--bgc: transparent;
              --gv-nav-link-active--bgc: transparent;
              --gv-nav-link-active--bdb: var(--gv-menu-link-active--bdb, 3px solid #D5FDCB);
              --pr: var(--gv-menu--pr, 4rem);
              --pl: var(--gv-menu--pl, 4rem);
              --gv-header-api--pr: var(--pr);
              --gv-header-api--pl: var(--pl);
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
              --gv-nav-link-a--pv: 0;
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
          }

          :host([w-lt-380]) slot[name="right"]  {
              padding-right: 0;
          }

          :host > div {
              background-color: var(--gv-menu--bgc, #193E34);
              color: var(--gv-menu--c, #FFF);
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
              --gv-nav-link-a--pv: 0;
          }

          slot[name="right"] {
              display: flex;
              padding-right: var(--pr);
              justify-content: flex-end;
          }

          gv-nav {
              padding-left: var(--pl);
              flex: 4;
          }

          .right {
              flex: 3;
          }

          .right ::slotted(*) {
              align-self: flex-end;
              transition: width 0.5s ease;
              width: 70%;
          }

          .right:focus-within ::slotted(*) {
              animation: slide 0.5s;
              transition: width 0.5s ease-in-out;
              width: 100%;
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
            <div class="right"><slot name="right"></slot></div>
        </div>
      </div>    
    `;
  }

  updated (changedProperties) {
    super.updated(changedProperties);
    let _header = false;
    for (const node of this.childNodes) {
      if (node.nodeType === 1) {
        const child = node.nodeName.toLowerCase() === 'gv-header-api' ? node : node.querySelector('gv-header-api');
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
