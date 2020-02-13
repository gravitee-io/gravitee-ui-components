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
import { css, html, LitElement } from 'lit-element';
import { skeleton } from '../styles/skeleton';
import '../atoms/gv-image';
import '../atoms/gv-button';
import '../atoms/gv-tag';
import { i18n } from '../lib/i18n';
import { isSameRoutes } from '../lib/utils';
import { repeat } from 'lit-html/directives/repeat';
import { until } from 'lit-html/directives/until';
import { dispatchCustomEvent } from '../lib/events';
import { classMap } from 'lit-html/directives/class-map';
import { withResizeObserver } from '../mixins/with-resize-observer';
import { ItemResource } from '../mixins/item-resource';

/**
 * Header component
 *
 * @attr {Promise<any>} item - An item
 * @attr {Promise<Array<{ path: String, title: String }>>} breadcrumbs - definition of routes in order
 * @attr {Boolean} canSubscribe - for display actions (default: false)
 *
 * @cssprop {Color} [--gv-header--bgc=var(--gv-theme-color-light, #D5FDCB)] - Background color.
 * @cssprop {Color} [--gv-header--c=var(--gv-theme-font-color-dark, #262626)] - Color
 * @cssprop {Length} [--gv-header-image--h=125px] - Image height
 * @cssprop {Length} [--gv-header-image--w=125px] - Image width
 * @cssprop {Length} [--gv-header--h=150px] - Height
 *
 * @cssprop {Length} [--gv-header-button--p=10px 24px] - Button adding
 * @cssprop {Length} [--gv-header-button--fz=var(--gv-theme-font-size-l, 16px)] - Button font size
 *
 */
export class GvHeader extends withResizeObserver(ItemResource(LitElement)) {

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
          --img-w: var(--gv-header-image--w, 125px);
          --img-h: var(--gv-header-image--h, 125px);
          --gv-button--fz: var(--gv-header-button--fz, var(--gv-theme-font-size-l, 16px));
          --gv-button--p: var(--gv-header-button--p, 10px 24px);
          --gv-link--bgc: transparent;
          --gv-link-active-bgc: transparent;
          --c: var(--gv-header--c, var(--gv-theme-font-color-dark, #262626));
          --gv-link--c: var(--c);
          --gv-link-active--c: var(--c);
          --gv-link-a--ph: 5px;
          --gv-link--td: underline;
          --bgc: var(--gv-header--bgc, var(--gv-theme-color-light, #D5FDCB));
          --h: var(--gv-header--h, 150px);
          box-sizing: border-box;
          display: block;
        }

        gv-image {
          height: var(--img-h);
          width: var(--img-w);
          --gv-image--of: contain;
        }

        :host([w-lt-768]) {
          --img--w: calc(var(--img-w) / 2);
          --img--h: calc(var(--img-h) / 2);
          --gv-button--fz: var(--gv-theme-font-size-s, 12px);
          font-size: var(--gv-theme-font-size-s, 12px);
        }

        :host([w-lt-768]) .header__top nav {
          margin-top: 0;
        }

        :host([w-lt-580]) {
          --gv-button--p: 3px 9px;
          --gv-link-a--ph: 0px;
          --h: 115px;
        }

        :host([w-lt-580]) .header__top {
          min-height: 0;
        }

        :host([w-lt-580]) .actions {
          display: flex;
          flex-direction: column;
        }

        :host([w-lt-580]) .version {
          font-size: var(--gv-theme-font-size-s, 12px);
          line-height: var(--gv-theme-font-size-s, 12px);
        }

        :host([w-lt-580]) .image gv-image {
          top: -5px;
        }

        :host([w-lt-580]) h1 {
          font-size: calc(var(--gv-theme-font-size-xl, 26px) - 4px);
          line-height: calc(var(--gv-theme-font-size-xl, 26px) - 4px);
        }

        :host([w-lt-400]) h1 {
          font-size: calc(var(--gv-theme-font-size-xl, 26px) - 8px);
        }

        .header {
          display: flex;
          height: var(--h);
          background-color: var(--bgc);
          flex-direction: column;
          padding-left: var(--gv-theme-layout--pl, 4rem);
          padding-right: var(--gv-theme-layout--pr, 4rem);
          color: var(--c);
          transition: height 1s ease;
        }

        .header__top {
          min-height: 80px;
          display: flex;
        }

        .header__top nav {
          margin-top: 10px;
          flex: 1;
        }

        .header__bottom {
          display: flex;
        }

        .title {
          flex: 1;
          margin: 0.5rem 0 0 1rem;
        }

        .image {
          position: relative;
        }

        gv-link:last-child {
          --gv-link--td: none;
        }

        gv-link::after {
          content: '>';
          color: var(--gv-theme-font-color-dark, #262626);
          align-self: center;
        }

        gv-link:last-child::after {
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
          font-size: var(--gv-theme-font-size-l, 16px);
          line-height: var(--gv-theme-font-size-l, 16px);
          font-weight: 500;
        }

        h1 {
          margin: 0;
          font-size: var(--gv-theme-font-size-xl, 26px);
          font-weight: 500;
          line-height: var(--gv-theme-font-size-xl, 26px);
          letter-spacing: 0.05em;
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
      width: [400, 580, 768],
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
            <gv-link
            @gv-link:click=${this._onClick}
            .active="${_route.active}"
            .icon="${_route.icon}"
            .path="${_route.path}"
            .title="${title}"
            .help="${until(_route.help, null)}"></gv-link>`;
    }).catch(() => {
      delete this._routes[index];
    });
  }

  _renderBreadcrumbs () {
    return html`<nav>${repeat(this._breadcrumbs, (route) => route, (route, index) =>
      until(this._getLink(route, index), html`<gv-link skeleton></gv-link>`)
    )}</nav>`;
  }

  _onSubscribe (e) {
    e.stopPropagation();
    dispatchCustomEvent(this, 'subscribe', this._item);
  }

  render () {
    return html`
      <div class="${classMap({ header: true, skeleton: this._skeleton })}">
        <div class="header__top">${(!(this._error || this._empty)) ? this._renderBreadcrumbs() : ''}</div>
        <div class="header__bottom">
            <div class="image">${this._renderImage()}</div>
            <div class="title">
                ${(!(this._error || this._empty)) ? html`<div class="version">${this._getVersion()}</div>` : ''}
                ${(this._error || this._empty) ? html`
                    <div><div class="error">${this._error ? i18n('gv-header.error') : i18n('gv-header.empty')}</div>
                 </div>` : html`<h1>${this._getTitle()}</h1>`}
            </div>
            ${!(this._error || this._empty) && this.canSubscribe ? html`<div class="actions">
                <gv-button primary @click="${this._onSubscribe}">${i18n('gv-header.subscribe')}</gv-button>
            </div>` : ``}
        </div>
     </div>
    `;
  }

}

window.customElements.define('gv-header', GvHeader);
