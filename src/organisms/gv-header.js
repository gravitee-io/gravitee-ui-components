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
import { link } from '../styles/link';
import '../molecules/gv-nav';

/**
 * A header
 *
 * @fires gv-nav_change - Custom event when nav link change
 *
 * @attr {String} logoHref - href of logo link
 * @attr {String} logoImg - source of image
 * @attr {String} logoImgAlt - alt text of image
 * @attr {String} logoTitle - title of logo link
 * @attr {Array} routes - definition of routes [{path: String, isActive: Boolean, title: String}]
 *
 */
export class GvHeader extends LitElement {

  static get properties () {
    return {
      logoHref: { type: String },
      logoImg: { type: String },
      logoImgAlt: { type: String },
      logoTitle: { type: String },
      routes: { type: Array },
    };
  }

  static get styles () {
    return [
      link,
      // language=css
      css`
          header {
              display: table;
              padding: 1rem 4rem;
              width: 100%;
          }

          .logo {
              display: table-cell;
              vertical-align: middle;
              width: 20%;
          }

          .logo img {
              height: 3rem;
              width: 3rem;
              display: inline-block;
              max-width: 100%;
              border-style: none;
          }

          gv-nav {
              display: table-cell;
              vertical-align: middle;
              width: 80%;
          }
      `,
    ];
  }

  constructor () {
    super();
    this.logoImgAlt = this.logoTitle;
    this.logoHref = '';
  }

  render () {

    const mainNav = document.createElement('gv-nav');
    mainNav.routes = this.routes;

    return html`
      <header>
        
        <a href="${this.logoHref}" target="_blank" class="logo link" title="${this.logoTitle}">
             <img src="${this.logoImg}" alt="${this.logoImgAlt}">
        </a>
        
        ${mainNav}
    
      </header>
    `;
  }

}

window.customElements.define('gv-header', GvHeader);
