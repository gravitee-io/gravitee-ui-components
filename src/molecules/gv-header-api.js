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
import { css } from 'lit-element';
import { html } from 'lit-html';
import { skeleton } from '../styles';
import '../atoms/gv-image';
import '../atoms/gv-button';
import { ApiElement } from '../mixins/api-element';
import { i18n } from '../lib/i18n.js';
import { isSameRoutes } from '../lib/utils';
import { repeat } from 'lit-html/directives/repeat';
import { until } from 'lit-html/directives/until';
import { dispatchCustomEvent } from '../lib/events';
import { classMap } from 'lit-html/directives/class-map';
import { withResizeObserver } from '../mixins/with-resize-observer';

/**
 * Api Header component
 *
 * @attr {Promise<Api>} api - An Api.
 * @attr {Promise<Array>} breadcrumbs - definition of routes in order [{ path: String, title: String }]
 * @attr {Boolean} canSubscribe - for display actions (default: false)
 *
 * @cssprop {String} [--gv-header-api--bgc=#D5FDCB] - set the background color.
 * @cssprop {String} [--gv-header-api--pl=4rem] - set the padding left
 * @cssprop {String} [--gv-header-api--pr=4rem] - set the padding right
 * @cssprop {String} [--gv-header-api--c=#262626] - set the color
 */
export class GvHeaderApi extends withResizeObserver(ApiElement) {

  static get properties () {
    return {
      breadcrumbs: { type: Array },
      _breadcrumbs: { type: Array, attribute: false },
      canSubscribe: { type: Boolean, attribute: 'can-subscribe' },
    };
  }

  static get styles () {
    return [
      skeleton,
      // language=CSS
      css`
          :host {
              --gv-image--w: 125px;
              --gv-image--h: 125px;
              --gv-button--fz: 16px;
              --gv-button--p: 10px 24px;
              --gv-nav-link--bgc: transparent;
              --gv-nav-link-active-bgc: transparent;
              --c: var(--gv-header-api--c, #262626);
              --gv-nav-link--c: var(--c);
              --gv-nav-link-active--c: var(--c);
              --gv-nav-link-a--ph: 5px;
              --gv-nav-link--td: underline;
              --bg: var(--gv-header-api--bgc, #D5FDCB);
              box-sizing: border-box;
              display: block;
          }

          :host([w-lt-768]) {
              --gv-image--w: 64px;
              --gv-image--h: 64px;
              --gv-button--fz: 12px;
          }

          :host([w-lt-768]) .header__top nav {
              margin-top: 0;
          }

          :host([w-lt-580]) {
              --gv-button--p: 3px 9px;
              --gv-nav-link-a--ph: 0px;
          }

          :host([w-lt-580]) .header__top {
              min-height: 0;
          }

          :host([w-lt-580]) .actions {
              display: flex;
              flex-direction: column;
          }

          :host([w-lt-580]) .version {
              font-size: 11px;
              line-height: 13px;
          }

          :host([w-lt-580]) .image gv-image {
              top: -5px;
          }

          :host([w-lt-580]) h1 {
              font-size: 18px;
              line-height: 21px;
          }

          .header {
              display: flex;
              max-height: 175px;
              background-color: var(--bg);
              flex-direction: column;
              padding-left: var(--gv-header-api--pl, 4rem);
              padding-right: var(--gv-header-api--pr, 4rem);
              color: var(--c)
          }

          .header__top {
              min-height: 100px;
          }

          .header__top nav {
              margin-top: 10px;
          }

          .header__bottom {
              display: flex;
          }

          .title {
              flex: 1;
              margin-left: 1rem;
          }

          .image {
              position: relative;
          }

          gv-nav-link:last-child {
              --gv-nav-link--td: none;
          }

          gv-nav-link::after {
              content: '>';
              color: #000000;
              align-self: center;
          }

          gv-nav-link:last-child::after {
              content: '';
          }

          .image gv-image {
              top: -15px;
          }

          .error {
              text-align: center;
              margin-right: 125px;
          }

          .version {
              letter-spacing: 0.05em;
              opacity: 0.5;
              font-size: 16px;
              line-height: 21px;
              font-weight: 500;
          }

          h1 {
              margin: 0;
              font-size: 26px;
              font-weight: 500;
              line-height: 34px;
              letter-spacing: 0.05em;
          }

          .header.skeleton {
              min-height: 200px;
          }

          .skeleton gv-button {
              visibility: hidden;
          }

      `,
    ];
  }

  constructor () {
    super();
    this.breakpoints = {
      width: [580, 768],
    };
    this._breadcrumbs = [];
    this.canSubscribe = false;
  }

  set breadcrumbs (candidate) {
    if (candidate) {
      Promise.resolve(candidate).then((candidates) => {
        if (candidates) {
          Promise.all(candidates).then((futureRoutes) => {
            if (!isSameRoutes(this._breadcrumbs, futureRoutes)) {
              this._breadcrumbs = futureRoutes.filter((r) => r != null);
            }
          });
        }
        else {
          this._breadcrumbs = null;
        }
      });
    }
    else {
      this._breadcrumbs = null;
    }
  }

  _getLink (route, index) {
    return Promise.resolve(route).then((_route) => {

      const title = index === this._breadcrumbs.length - 1 ? this._getTitle() : _route.title;

      return html`
            <gv-nav-link
            @gv-nav-link:click=${this._onClick}
            .active="${_route.active}"
            .icon="${_route.icon}"
            .path="${_route.path}"
            .title="${title}"
            .help="${until(_route.help, null)}"></gv-nav-link>`;
    }).catch(() => {
      delete this._routes[index];
    });
  }

  _renderBreadcrumbs () {
    return html`<nav>${repeat(this._breadcrumbs, (route) => route, (route, index) =>
      until(this._getLink(route, index), html`<gv-nav-link skeleton></gv-nav-link>`)
    )}</nav>`;
  }

  _onSubscribe (e) {
    e.stopPropagation();
    dispatchCustomEvent(this, 'subscribe', this._api);
  }

  render () {
    return html`
      <div class="${classMap({ header: true, skeleton: this._skeleton })}">
        <div class="header__top">${this._renderBreadcrumbs()}</div>
        <div class="header__bottom">
            <div class="image">${this._renderImage()}</div>
            <div class="title">
                ${(!(this._error || this._empty)) ? html`<div class="version">${this._getVersion()}</div>` : ''}
                ${(this._error || this._empty) ? html`
                    <div><div class="error">${this._error ? i18n('gv-header-api.error') : i18n('gv-header-api.empty')}</div>
                 </div>` : html`<h1>${this._getTitle()}</h1>`}
            </div>
            ${!(this._error || this._empty) && this.canSubscribe ? html`<div class="actions">
                <gv-button primary @click="${this._onSubscribe}">${i18n('gv-header-api.subscribe')}</gv-button>
            </div>` : ``}
        </div>
     </div>
    `;
  }

}

window.customElements.define('gv-header-api', GvHeaderApi);
