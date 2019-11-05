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
import { LitElement, html } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events';
import { repeat } from 'lit-html/directives/repeat';
import '../atoms/gv-nav-link';

/**
 * A main nav
 *
 * @fires gv-nav_change - Custom event when nav link change
 *
 * @attr {Array} routes - definition of routes [{path: String, selected: Boolean, title: String}]
 *
 */
export class GvNav extends LitElement {

  static get properties () {
    return {
      routes: { type: Array },
    };
  }

  _onClick ({ detail: { title } }) {
    this.routes = this.routes.map((route) => {
      return Promise.resolve(route).then((_route) => {
        if (_route.title === title) {
          _route.isActive = true;
          dispatchCustomEvent(this, 'change', _route);
        }
        else {
          delete _route.isActive;
        }
        return _route;
      });
    });
  }

  render () {

    return html`
        <nav>
          ${repeat(this.routes, (route) => route, (route) => html`
            <gv-nav-link 
            @gv-nav-link_click=${this._onClick} 
            .route="${route}"></gv-nav-link>
      `)}
        </nav>`;
  }

}

window.customElements.define('gv-nav', GvNav);
