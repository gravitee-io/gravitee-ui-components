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
import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat';
import '../../atoms/gv-link';
import { until } from 'lit/directives/until';
import { isSameRoutes } from '../../lib/utils';
import { dispatchCustomEvent } from '../../lib/events';
import { classMap } from 'lit/directives/class-map';

/**
 * A main nav
 *
 * ## Details
 * * has @theme facet
 *
 * @fires gv-nav:click - Custom event when nav item is clicked
 *
 * @attr {Array<{active: Boolean, icon: String, path: String, title: Promise<String>, target: String}>} routes - definition of routes
 */
export class GvNav extends LitElement {
  static get properties() {
    return {
      routes: { type: Array },
      _routes: { type: Array },
      small: { type: Boolean },
      _compact: { type: Boolean, attribute: false },
      vertical: { type: Boolean, reflect: true },
    };
  }

  static get styles() {
    return [
      // language=CSS
      css`
        nav {
          position: relative;
          transition: all 150ms ease-in-out;
        }

        gv-link {
          --gv-link--ta: end;
        }

        .vertical {
          display: flex;
          flex-direction: column;
        }

        .vertical gv-link {
          width: 100%;
        }

        .compact {
          --gv-link-a--ph: 10px;
        }

        #shadowLink {
          position: absolute;
          display: inline-flex;
          opacity: 0.5;
          top: 0;
          left: 0;
          transition: transform 250ms ease-in-out, width 250ms;
        }
      `,
    ];
  }

  _onClick(event) {
    event.stopPropagation();
    const { detail } = event;
    const { title, target } = detail;
    if (target === '_blank') {
      dispatchCustomEvent(this, 'click', detail);
    } else {
      if (!this._isLocked) {
        this._isLocked = true;
        let nextIndex = 0;
        this._routes.forEach((route, index) => {
          if (route.title === title) {
            route.active = true;
            nextIndex = index;
          } else {
            delete route.active;
          }
          return route;
        });

        const activeLink = this.shadowRoot.querySelector('gv-link[active]');
        const nextLink = this.shadowRoot.querySelectorAll('gv-link')[nextIndex];
        if (activeLink) {
          const shadowLink = activeLink.cloneNode(true);
          const { height, width } = activeLink.getBoundingClientRect();

          shadowLink.id = 'shadowLink';
          shadowLink.style.top = `${activeLink.offsetTop}px`;
          shadowLink.style.left = `${activeLink.offsetLeft}px`;
          shadowLink.style.width = `${width}px`;
          shadowLink.style.height = `${height}px`;

          activeLink.removeAttribute('active');
          activeLink.style.height = `${height}px`;

          this.shadowRoot.querySelector('nav').prepend(shadowLink);
          const left = nextLink.offsetLeft - activeLink.offsetLeft;
          const top = nextLink.offsetTop - activeLink.offsetTop;

          shadowLink.style.transform = `translate(${left}px,${top}px)`;

          setTimeout(() => {
            nextLink.setAttribute('active', true);
            this.shadowRoot.querySelector('nav').removeChild(shadowLink);
            this._isLocked = false;
            dispatchCustomEvent(this, 'click', detail);
          }, 250);
        } else {
          nextLink.setAttribute('active', true);
          this._isLocked = false;
          dispatchCustomEvent(this, 'click', detail);
        }
      }
    }
  }

  constructor() {
    super();
    /** @protected */
    this._routes = [];
    this.vertical = false;
  }

  set routes(routes) {
    if (routes) {
      Promise.resolve(routes).then((_routes) => {
        if (!isSameRoutes(this._routes, _routes)) {
          this._routes = _routes;
        }
      });
    }
  }

  _getLink(route, index) {
    return Promise.resolve(route)
      .then((_route) => {
        return html` <gv-link
          @gv-link:click=${this._onClick}
          .active="${_route.active}"
          .icon="${_route.icon}"
          .path="${_route.path}"
          .target="${_route.target}"
          ?small="${this.small}"
          .title="${_route.title}"
          .help="${until(_route.help, null)}"
          ?vertical="${this.vertical}"
        ></gv-link>`;
      })
      .catch(() => {
        delete this._routes[index];
      });
  }

  updated(_changedProperties) {
    if (_changedProperties.has('_routes')) {
      this._compact = this._routes && this._routes.length > 5;
    }
  }

  render() {
    if (this._routes) {
      return html`<nav class="${classMap({ compact: this._compact, vertical: this.vertical })}">
        ${repeat(
          this._routes,
          (route) => route,
          (route, index) => until(this._getLink(route, index), html`<gv-link skeleton .vertical="${this.vertical}"></gv-link>`),
        )}
      </nav>`;
    }
    return html``;
  }
}

window.customElements.define('gv-nav', GvNav);
