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
import '../atoms/gv-image';
import '../atoms/gv-button';
import '../molecules/gv-metrics';
import '../molecules/gv-rating';
import '../atoms/gv-state';
import '../atoms/gv-tag';
import picture from '../../assets/images/api-full.png';
import { card } from '../styles/card';
import { truncate } from '../lib/utils';
import { ApiElement } from '../mixins/api-element';
import { i18n } from '../lib/i18n';

/**
 * Api Full Card component
 *
 * @attr {Promise<Api>} api - An Api.
 * @attr {Promise<ApiMetrics>} metrics - An Api.
 *
 * @cssprop {String} --gv-card-api-full--bgc - set the background color.
 */
export class GvCardApiFull extends ApiElement {

  static get styles () {
    return [
      card,
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
              --gv-icon--w: 65px;
              --gv-icon--h: 65px;
              --gv-icon--c: #777;
              min-width: 400px;
              width: 444px;
              max-width: 444px;
              max-height: 281px;
              line-height: 22px;
              font-size: 14px;
          }

          .card {
              display: flex;
              flex-direction: column;
              height: 250px;
              border-radius: 4px;
              background-color: var(--gv-card-api-full--bgc, white);
              color: #262626;
              padding: 16px;
              --gc-icon--c: red
          }

          .card > div {
              display: flex;
          }

          .image {
              min-height: 65px;
              min-width: 0;
              position: relative;
              padding-top: 0.2rem;
          }

          .title {
              line-height: 22px;
              font-size: 16px;
              text-transform: capitalize;
              font-weight: bold;
          }

          .content {
              flex: 1;
              padding: 10px;
          }

          .version {
              color: #D9D9D9;
              padding: 10px 8px;
              font-size: 12px;
          }

          .description {
              padding: 0 16px;
              margin: 6px 0;
              flex: 1;
              flex-grow: 1;
              max-height: 150px;
              overflow: hidden;
              text-overflow: ellipsis;
          }

          .error .description {
              justify-content: center;
          }

          .infos {
              display: flex;
              justify-content: space-evenly;
              border-bottom: 1px solid #D9D9D9;
              padding: 8px;
              margin: 8px;
          }

          .skeleton .infos {
              border-bottom: none;
          }

          .info {
              flex: 1 1 0%;
          }
          .labels {
              padding: 0 16px;
          }

          .skeleton {
              background-color: #aaa;
              border-color: #777;
              color: transparent;
              transition: 0.5s;
          }

          .error .labels, .error .infos, .error .states {
              visibility: hidden;
          }

      `,
    ];
  }

  constructor () {
    super();
    this.limit = 150;
  }

  getDefaultPicture () {
    return picture;
  }

  _renderInfoRating () {
    const rating = this._getRating();
    if (rating) {
      return html`<gv-rating .skeleton="${this._skeleton}" .average="${rating.average}" .count="${rating.count}"></gv-rating>`;
    }
    return html`<div class="info"></div>`;
  }

  _renderMetrics () {
    if (this.metrics) {
      const container = document.createElement('gv-metrics');
      container.metrics = this.metrics;
      container.className = 'info';
      return container;
    }
    else {
      return html`<div class="info"></div>`;
    }
  }

  render () {
    return html`<div class="${classMap({ error: this._error || this._empty, card: true })}" title="${this._getTitle()}">
        <div class="${classMap({ skeleton: this._skeleton })}">
            <div class="${classMap({ image: true })}">${this._renderImage()}</div>
            <div class="content">
                <div class="${classMap({ title: true })}">${this._getTitle()}</div>
                <div class="states">
                ${this._renderStates()}
                </div>
            </div>
            <div class="version"><span class="${classMap({ skeleton: this._skeleton })}">${this._getVersion()}</span></div>
        </div>
        <div class="${classMap({ skeleton: this._skeleton, description: true })}">
            ${truncate(this._error ? i18n('gv-card-api-full.error') : this._empty ? i18n('gv-card-api-full.empty') : this._getDescription(), this.limit)}
        </div>
        <span class="${classMap({ skeleton: this._skeleton })}">
          <div class="infos">
            ${this._renderMetrics()}
            ${this._renderInfoRating()}
          </div>
          <div class="labels">
            ${this._renderLabels()}
          </div>
        </span>
</div>`;
  }

}

window.customElements.define('gv-card-api-full', GvCardApiFull);
