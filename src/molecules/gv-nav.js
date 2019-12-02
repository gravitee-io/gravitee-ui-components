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
import { repeat } from 'lit-html/directives/repeat';
import '../atoms/gv-nav-link';
import { until } from 'lit-html/directives/until';

/**
 * A main nav
 *
 * @fires gv-nav-link:click - Custom event from child components
 *
 * @attr {Array} routes - definition of routes [{active: Boolean, icon: String, path: String, title: Promise<String>}]
 *
 */
export class GvNav extends LitElement {

  static get properties () {
    return {
      routes: { type: Array },
      _routes: { type: Array },
      small: { type: Boolean },
    };
  }

  _onClick ({ detail: { title } }) {
    this._routes = this._routes.map((route) => {
      if (route.title === title) {
        route.active = true;
      }
      else {
        delete route.active;
      }
      return route;
    });
  }

  set routes (routes) {
    if (routes) {
      Promise.resolve(routes).then((_routes) => {
        this._routes = _routes;
      });
    }
  }

  _getLink (route, index) {
    return Promise.resolve(route).then((_route) => {
      return html`
            <gv-nav-link 
            @gv-nav-link:click=${this._onClick} 
            .active="${_route.active}"
            .icon="${_route.icon}"
            .path="${_route.path}"
            ?small="${this.small}"
            .title="${_route.title}"
            .help="${until(_route.help, null)}"></gv-nav-link>`;
    }).catch(() => {
      delete this._routes[index];
    });
  }

  render () {
    if (this._routes) {
      return html`<nav>${repeat(this._routes, (route) => route, (route, index) =>
        until(this._getLink(route, index), html`<gv-nav-link skeleton></gv-nav-link>`)
      )}</nav>`;
    }
    return html``;
  }

}

window.customElements.define('gv-nav', GvNav);
