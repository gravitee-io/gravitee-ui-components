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
import { classMap } from 'lit-html/directives/class-map';
import { ApiElement } from '../mixins/api-element';

/**
 * Api Row component
 *
 * @attr {Promise<Api>} api - An Api.
 *
 * @cssprop {String} --gv-row-api--bgc - set the background color.
 * @cssprop {String} --gv-row-api-hover--bgc - set the background color when hover.
 */
export class GvRowApi extends ApiElement {

  static get styles () {
    return [
      skeleton,
      // language=CSS
      css`
          :host {
              box-sizing: border-box;
              --hover-bgc: var(--gv-row-api-hover--bgc, #D5FDCB);
              cursor: pointer;
          }

          .row:hover {
              background-color: var(--hover-bgc);
          }

          .row {
              display: flex;
              background-color: var(--gv-row-api--bgc, white);
              align-items: center;
              padding: 8px;
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
              max-width: 25px;
          }

          .row  .description {
              background: #FAFAFA;
              border-radius: 2px;
              font-size: 14px;
              padding: 8px;
              flex: 6;
          }

          .row  .meta {
              display: flex;
              flex-direction: column;
          }

          .row .meta__owner {
              --gv-icon--c: #D9D9D9;
              --gv-icon--h: 14px;
              --gv-icon--w: 13px;
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

      `,
    ];
  }

  render () {
    return html`
        <div class="row">
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
      </div>
    `;
  }

}

window.customElements.define('gv-row-api', GvRowApi);
