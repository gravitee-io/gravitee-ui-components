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
import { truncate } from '../lib/utils';
import { classMap } from 'lit-html/directives/class-map';
import { skeleton } from '../styles/skeleton';
import { dispatchCustomEvent } from '../lib/events';
import { i18n } from '../lib/i18n';

/**
 * A card used to display a category
 *
 * @fires gv-category:click - Custom click event
 *
 * @attr {Promise<{name, description, _links: { picture }}>} category - A category object
 * @attr {Length} limit - number of characters that can be display in the description. If _description_ is greater, it will be truncated.
 *
 * @cssprop {Color} [--gv-category--bgc=var(--gv-theme-neutral-color-lightest, #FFFFFF)] - Background color
 * @cssprop {Color} [--gv-category--c=var(--gv-theme-font-color-dark, #262626)] - Color
 * @cssprop {Length} [--gv-category--h=228px] - Height
 */
export class GvCategory extends LitElement {

  static get properties () {
    return {
      category: { type: Object },
      limit: { type: Number },
      _category: { type: Object, attribute: false },
      _skeleton: { type: Boolean, attribute: false },
      _empty: { type: Boolean, attribute: false },
      _error: { type: Boolean, attribute: false },
    };
  }

  static get styles () {
    return [
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
          background-color: var(--gv-category--bgc, var(--gv-theme-neutral-color-lightest, #FFFFFF));
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          height: var(--gv-category--h, 228px);
          justify-content: flex-end;
          padding: 0 40px;
          box-shadow: 0 0 0 1px var(--gv-theme-neutral-color-dark, #BFBFBF), 0 1px 3px var(--gv-theme-neutral-color-dark, #BFBFBF);
          transition: all .3s;
          position: relative;
        }

        .card.empty {
          justify-content: center;
          align-items: center;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -14px var(--gv-theme-neutral-color, #F5F5F5);
          cursor: pointer;
        }

        .picture {
          align-self: flex-end;
        }

        .picture gv-identity-picture{
          height: 80px;
          width: 80px;
        }

        .title {
          color: var(--gv-category--c, var(--gv-theme-font-color-dark, #262626));
          font-size: var(--gv-theme-font-size-xxl, 30px);
          font-style: normal;
          font-weight: 600;
          line-height: 38px;
        }

        .description {
          color: var(--gv-category--c, var(--gv-theme-font-color-dark, #262626));
          font-size: var(--gv-theme-font-size-l, 16px);
          font-style: normal;
          font-weight: normal;
          line-height: 24px;
          margin-bottom: 32px;
          opacity: 0.5;

          /** text-overflow **/
          max-height: 150px;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `,
      skeleton,
    ];
  }

  constructor () {
    super();
    this._skeleton = false;
    this._error = false;
    this._empty = true;
  }

  set category (category) {
    this._skeleton = true;
    Promise.resolve(category)
      .then((category) => {
        if (category) {
          this._empty = Object.keys(category).length === 0;
          this._skeleton = false;
          this._category = category;
        }
        else {
          this._skeleton = true;
        }
      }).catch(() => {
        this._error = true;
        this._skeleton = false;
      });
  }

  _get (property) {
    if (this._category) {
      return this._category[property];
    }
    return '';
  }

  _onClick () {
    dispatchCustomEvent(this, 'click', this._category);
  }

  render () {
    return html`<div @click=${this._onClick} class="${classMap({ card: true, skeleton: this._skeleton, empty: this._error || this._empty })}">

          ${(this._error || this._empty) ? html`
        <div class="${classMap({ skeleton: this._skeleton })}">
            <span class="error">${this._error ? i18n('gv-category.error') : i18n('gv-category.empty')}</span>
        </div>
        ` : html`
        <div class="picture">
        <gv-identity-picture display_name="${this._get('name')}" 
            picture="${this._get('_links') ? this._get('_links').picture : ''}"></gv-identity-picture>
        </div>
        <div class="title">${this._get('name')}</div>
        <div class="description">${truncate(this._get('description'), this.limit)}</div>`}
      </div>
    `;
  }

}

window.customElements.define('gv-category', GvCategory);
