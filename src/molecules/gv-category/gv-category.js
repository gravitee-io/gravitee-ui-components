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
import { truncate } from '../../lib/utils';
import { classMap } from 'lit/directives/class-map.js';
import { dispatchCustomEvent } from '../../lib/events';
import { i18n } from '../../lib/i18n';
import { withSkeletonAttribute } from '../../mixins/with-skeleton-attribute';

/**
 * A card used to display a category
 *
 * ## Details
 * * has @theme facet
 *
 * @fires gv-category:click - Custom click event
 *
 * @attr {Promise<{name, description, _links: { picture }, total_apis}>} category - A category object
 * @attr {Length} limit - number of characters that can be display in the description. If _description_ is greater, it will be truncated.
 *
 * @cssprop {Color} [--gv-category--bgc=var(--gv-theme-neutral-color-lightest, #ffffff)] - Background color
 * @cssprop {Color} [--gv-category--c=var(--gv-theme-font-color-dark, #262626)] - Color
 * @cssprop {Length} [--gv-category--h=200px] - Height
 */
export class GvCategory extends withSkeletonAttribute(LitElement) {
  static get properties() {
    return {
      category: { type: Object },
      limit: { type: Number },
      _category: { type: Object, attribute: false },
    };
  }

  static get styles() {
    return [
      ...super.styles,
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          display: inline-block;
          margin: 0.2rem;
          vertical-align: middle;
          min-width: 415px;
        }

        .card {
          background-color: var(--gv-category--bgc, var(--gv-theme-neutral-color-lightest, #ffffff));
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          height: var(--gv-category--h, 200px);
          padding: 2rem;
          box-shadow: 0 0 0 1px var(--gv-theme-neutral-color-dark, #bfbfbf), 0 1px 3px var(--gv-theme-neutral-color-dark, #bfbfbf);
          transition: all 0.3s;
          position: relative;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -14px var(--gv-theme-neutral-color, #f5f5f5);
          cursor: pointer;
        }

        .box {
          display: flex;
        }

        .title {
          flex: 1;
          align-self: center;
        }

        .title span {
          font-size: var(--gv-theme-font-size-s);
          font-weight: 600;
          line-height: var(--gv-theme-font-size-s);
          margin-left: 8px;
          opacity: 0.7;
        }

        gv-identity-picture {
          height: 80px;
          width: 80px;
          margin: 0.5rem 1rem 0.5rem 0;
        }

        .title {
          color: var(--gv-category--c, var(--gv-theme-font-color-dark, #262626));
          font-size: var(--gv-theme-font-size-xxl, 30px);
          font-style: normal;
          font-weight: 600;
          line-height: calc(var(--gv-theme-font-size-xxl, 30px) + 6px);
        }

        .description {
          color: var(--gv-category--c, var(--gv-theme-font-color-dark, #262626));
          font-size: var(--gv-theme-font-size-l, 16px);
          font-style: normal;
          font-weight: normal;
          line-height: 24px;
          opacity: 0.7;

          /** text-overflow **/
          max-height: 150px;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `,
    ];
  }

  constructor() {
    super();
    this._skeletonAttribute = 'category';
  }

  _get(property) {
    if (this._category) {
      return this._category[property];
    }
    return '';
  }

  _onClick() {
    dispatchCustomEvent(this, 'click', this._category);
  }

  render() {
    const total = this._get('total_apis');
    return html`<div
      @click=${this._onClick}
      class="${classMap({ card: true, skeleton: this._skeleton, empty: this._error || this._empty })}"
    >
      ${this._error || this._empty
        ? html`
            <div class="${classMap({ skeleton: this._skeleton })}">
              <span>${this._error ? i18n('gv-category.error') : i18n('gv-category.empty')}</span>
            </div>
          `
        : html` <div class="box">
              <gv-identity-picture
                .skeleton="${this._skeleton}"
                display_name="${this._get('name')}"
                picture="${this._get('_links') ? this._get('_links').picture : ''}"
              ></gv-identity-picture>
              <div class="title">${this._get('name')}${total ? html`<span>(${total})</span>` : ''}</div>
            </div>

            <div class="description">${truncate(this._get('description'), this.limit)}</div>`}
    </div> `;
  }
}

window.customElements.define('gv-category', GvCategory);
