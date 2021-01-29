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
import { css, LitElement, html } from 'lit-element';
import { skeleton } from '../styles/skeleton';
import { classMap } from 'lit-html/directives/class-map';
import '../atoms/gv-image';
import '../atoms/gv-button';
import { i18n } from '../lib/i18n';
import { ItemResource } from '../mixins/item-resource';
import { getVersion, getTitle } from '../lib/item';

/**
 * Card component
 *
 * ## Details
 * * has @theme facet
 *
 * @attr {Promise<any>} item - An item.
 *
 * @cssprop {Color} [--gv-card--bgc=var(--gv-theme-neutral-color-lightest, #ffffff)] - Background color
 */
export class GvCard extends ItemResource(LitElement) {
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
          width: 144px;
          max-height: 144px;
        }

        gv-identity-picture {
          width: 65px;
          height: 65px;
          --gv-image--of: contain;
        }

        .card {
          position: relative;
          display: flex;
          flex-direction: column;
          max-width: 144px;
          min-height: 144px;
          border-radius: 2px;
          background-color: var(--gv-card--bgc, var(--gv-theme-neutral-color-lightest, #ffffff));
          color: var(--gv-theme-font-color-dark, #262626);
          box-shadow: 0 0 0 1px var(--gv-theme-neutral-color, #f5f5f5), 0 1px 3px var(--gv-theme-neutral-color-dark, #bfbfbf);
          transition: all 0.3s;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 20px -10px var(--gv-theme-neutral-color-dark, #bfbfbf);
          cursor: pointer;
        }

        .content > div {
          display: flex;
          justify-content: center;
          margin-bottom: 0.2rem;
        }

        .image {
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: center;
          position: relative;
          padding-top: 0.2rem;
        }

        .title {
          line-height: 22px;
          font-size: var(--gv-theme-font-size-s, 12px);
          text-transform: capitalize;
          font-weight: bold;
          white-space: nowrap;
          overflow: hidden;
        }

        .content {
          flex: 1;
          padding: 6px 16px 12px;
        }

        .version {
          color: var(--gv-theme-neutral-color-dark, #d9d9d9);
          top: 0.4rem;
          right: 0.4rem;
          position: absolute;
        }
      `,
      skeleton,
    ];
  }

  render() {
    const title = getTitle(this._item);
    return html`<div class="card" title="${title}">
      <span class="${classMap({ skeleton: this._skeleton, version: true })}">${getVersion(this._item)}</span>
      <div class="${classMap({ image: true, skeleton: this._skeleton })}">${this._renderImage()}</div>

      <div class="${classMap({ content: true, empty: this._error || this._empty })}">
        ${this._error || this._empty
          ? html` <span>${this._error ? i18n('gv-card.error') : i18n('gv-card.empty')}</span> `
          : html` <div class="${classMap({ skeleton: this._skeleton })}">
                <span class="title">${title}</span>
              </div>
              <div>${this._renderStates()}</div>`}
      </div>
    </div>`;
  }
}

window.customElements.define('gv-card', GvCard);
