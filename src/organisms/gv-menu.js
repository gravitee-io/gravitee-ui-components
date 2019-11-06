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
import { ifDefined } from 'lit-html/directives/if-defined';

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
 */
export class GvMenu extends LitElement {

  static get properties () {
    return {
      routes: { type: Array, attribute: false },
      searchTitle: { type: String },
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
          }

          div {
              background-color: var(--gv-menu--bgc, #193E34);
              color: var(--gv-menu--c, #FFF);
              display: table;
              width: 100%;
          }

          gv-nav, gv-input {
              display: table-cell;
              line-height: 60px;
              vertical-align: middle;
          }

          gv-nav {
              padding-left: 4rem;
          }
        
          gv-input {
              width: 23rem;
              padding-right: 4rem;
          }
      `,
    ];
  }

  render () {
    const mainNav = document.createElement('gv-nav');
    mainNav.routes = this.routes;
    return html`
      <div>
        ${mainNav}
        <gv-input 
        type="text" 
        placeholder="${ifDefined(this.searchTitle)}" 
        title="${ifDefined(this.searchTitle)}"
        icon="general:search"></gv-input>
      </div>
    `;
  }

}

window.customElements.define('gv-menu', GvMenu);
