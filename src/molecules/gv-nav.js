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
    };
  }

  async _onClick ({ detail: { title } }) {
    this.routes = await Promise.all(this.routes.map(async (route) => {
      route.title = await route.title;
      if (route.title === title) {
        route.active = true;
      }
      else {
        delete route.active;
      }
      return route;
    }));

  }

  render () {
    return html`
        <nav>
          ${repeat(this.routes, (route) => route, (route, index) => html`
            <gv-nav-link 
            @gv-nav-link:click=${this._onClick} 
            .active="${route.active}"
            .icon="${route.icon}"
            .path="${route.path}"
            .title="${route.title}"></gv-nav-link>
      `)}
        </nav>`;
  }

}

window.customElements.define('gv-nav', GvNav);
