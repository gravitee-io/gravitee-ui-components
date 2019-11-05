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
import { link } from '../styles';
import { dispatchCustomEvent } from '../lib/events';

/**
 * A nav link
 *
 * @fires gv-nav-link:click - Custom click event from inner link element
 *
 * @slot - The content of the link (text or HTML)
 *
 * @attr {Object} route - Simple object with {title: String, path: String, isActive: Boolean}
 *
 * @cssprop {String} --gv-nav-link([-active])--c - set the color of link.
 * @cssprop {String} --gv-nav-link([-active])--bgc - set the background color of link.
 */
export class GvNavLink extends LitElement {

  static get properties () {
    return {
      route: { type: Object },
      _currentRoute: { type: Array, attribute: false },
    };
  }

  static get styles () {
    return [
      link,
      // language=css
      css`
          a {
              opacity: 1;
              padding: 1rem 2rem;
              color: var(--gv-nav-link--c, #333);
              display: inline-block;
              background-color: var(--gv-nav-link--bgc, transparent);
              text-align: center;
          }

          .active {
              color: var(--gv-nav-link-active--c, #fff);
              background-color: var(--gv-nav-link-active--bgc, #333)
          }
      `,
    ];
  }

  constructor () {
    super();
    this._currentRoute = {};
  }

  set route (route) {
    if (route) {
      Promise.resolve(route)
        .then((value) => {
          this._currentRoute = value;
        })
        .catch((e) => {
          console.trace('Cannot get route', e);
        });
    }
  }

  get route () {
    return this.route;
  }

  _onClick (e) {
    e.preventDefault();
    dispatchCustomEvent(this, 'click', this._currentRoute);
  }

  render () {
    return html`
      <a @click=${this._onClick} 
      class="${this._currentRoute.isActive ? 'active ' : ''}link" 
      href="${this._currentRoute.path}" 
      title="${this._currentRoute.title}">
${this._currentRoute.title}
      </a>
    `;
  }

}

window.customElements.define('gv-nav-link', GvNavLink);
