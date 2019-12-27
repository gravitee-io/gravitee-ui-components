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
import { classMap } from 'lit-html/directives/class-map';
import { i18n } from '../lib/i18n';
import { ApiResource } from '../mixins/api-resource';

/**
 * Api Row component
 *
 * @attr {Promise<Api>} api - An Api.
 *
 * @cssprop {String} [--gv-row-api--bgc=white] - set the background color.
 * @cssprop {String} [--gv-row-api-hover--bgc=#FAFAFA] - set the background color when hover.
 */
export class GvRowApi extends ApiResource(LitElement) {

  static get styles () {
    return [
      skeleton,
      // language=CSS
      css`
          :host {
              box-sizing: border-box;
              --hover-bgc: var(--gv-row-api-hover--bgc, #FAFAFA);
              cursor: pointer;
          }

          .row:hover {
              transform: translateY(-2px);
              background-color: var(--hover-bgc);
          }

          .row, .row.error:hover {
              display: flex;
              background-color: var(--gv-row-api--bgc, white);
              align-items: center;
              padding: 8px;
              transition: all .3s;
          }

          .row > div {
              margin: 12px;
              flex: 1;
          }

          .row .picture {
              max-width: 40px;
              max-height: 40px;
              border-radius: 20px;
          }

          .row  .name {
              min-width: 300px;
          }

          .row .version {
              color: #D9D9D9;
              max-width: 50px;
          }

          .row .description {
              border-radius: 2px;
              font-size: 14px;
              padding: 8px;
              flex: 6;
          }

          .row .meta {
              display: flex;
              flex-direction: column;
          }

          .row .meta__owner {
              --gv-icon--c: #D9D9D9;
              --gv-icon--s: 14px;
              color: #D9D9D9;
          }

          .row  .meta__tags {
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
          }

          .skeleton {
              background-color: #aaa;
              border-color: #777;
              color: transparent;
              transition: 0.5s;
              min-height: 35px;
          }

          .error {
            cursor: default;
          }

          gv-image {
            --gv-image--h: 35px;
            --gv-image--w: 35px;
          }
      `,
    ];
  }

  render () {
    const classes = {
      row: true,
      error: this._error || this._empty,
    };

    return html`
        <div class=${classMap(classes)}>
            ${(this._error || this._empty) ? html`<div class="${classMap({ description: true })}">${this._error ? i18n('gv-row-api.error') : i18n('gv-row-api.empty')}</div>` : html`
            <div class="${classMap({ picture: true, skeleton: this._skeleton })}">${this._renderImage()}</div>
            <div class="${classMap({ name: true, skeleton: this._skeleton })}"><h4 class="title">${this._getTitle()}</h4></div>
            <div class="${classMap({ version: true, skeleton: this._skeleton })}">${this._getVersion()}</div>
            <div class="${classMap({ description: true, skeleton: this._skeleton })}">${this._getDescription()}</div>

            <div class="${classMap({ meta: true, skeleton: this._skeleton })}">
              <div class="meta__owner">
                <gv-icon shape="general:user" size="8px"></gv-icon>${this._getOwner()}</div>
              <div class="meta__tags">${this._renderLabels()}</div>
            </div>
          </div>
          `}
      </div>
    `;
  }

}

window.customElements.define('gv-row-api', GvRowApi);
