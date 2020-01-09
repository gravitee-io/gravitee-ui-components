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

/**
 * Card component
 *
 * @attr {Promise<any>} item - An item.
 *
 * @cssprop {String} [--gv-card--bgc=white] - set the background color.
 */
export class GvCard extends ItemResource(LitElement) {

  static get styles () {
    return [
      skeleton,
      // language=CSS
      css`
          :host {
              box-sizing: border-box;
              display: inline-block;
              margin: 0.2rem;
              vertical-align: middle;
              --gv-image--w: 110px;
              --gv-image--h: 65px;
              --gv-icon--s: 65px;
              width: 144px;
              max-height: 144px;
          }

          .card {
              position: relative;
              display: flex;
              flex-direction: column;
              max-width: 144px;
              min-height: 144px;
              border-radius: 2px;
              background-color: var(--gv-card--bgc, white);
              color: #262626;
              box-shadow: 0 0 0 1px rgba(208, 216, 223, 1), 0 1px 3px rgba(0,0,0,.15);
              transition: all .3s;
          }

          .card:hover {
              transform: translateY(-4px);
              box-shadow: 0 10px 20px -10px rgba(0,0,0,0.25);
              cursor: pointer;
          }

          .content > div {
              display: flex;
              justify-content: center;
              margin-bottom: 0.2rem;
          }

          .image {
              min-height: 65px;
              min-width: 0;
              display: flex;
              flex: 1;
              align-items: center;
              justify-content: center;
              position: relative;
              padding-top: 0.2rem;
          }

          .title {
              line-height: 22px;
              font-size: 12px;
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
              color: #D9D9D9;
              top: 0.4rem;
              right: 0.4rem;
              position: absolute;
          }

          .skeleton {
              background-color: #aaa;
              border-color: #777;
              color: transparent;
              transition: 0.5s;
          }

          .error {
              text-align: center;
              font-size: 10px;
          }
      `,
    ];
  }

  render () {
    return html`<div class="card" title="${this._getTitle()}">
    <span class="${classMap({ skeleton: this._skeleton, version: true })}" >${this._getVersion()}</span>
    <div class="${classMap({ skeleton: this._skeleton, image: true })}">${this._renderImage()}</div>

    <div class="content">
        ${(this._error || this._empty) ? html`
        <div class="${classMap({ skeleton: this._skeleton })}">
            <span class="error">${this._error ? i18n('gv-card.error') : i18n('gv-card.empty')}</span>
        </div>
        ` : html`
        <div class="${classMap({ skeleton: this._skeleton })}">
            <span class="title">${this._getTitle()}</span>
        </div>
        <div>${this._renderStates()}</div>`
        }
    </div>
</div>`;
  }

}

window.customElements.define('gv-card', GvCard);
