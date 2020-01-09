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
import { skeleton } from '../styles/skeleton.js';
import { classMap } from 'lit-html/directives/class-map';
import '../atoms/gv-image.js';
import '../atoms/gv-button.js';
import '../molecules/gv-metrics.js';
import '../molecules/gv-rating.js';
import '../atoms/gv-state.js';
import '../atoms/gv-tag.js';
import { truncate } from '../lib/utils.js';
import { i18n } from '../lib/i18n.js';
import { ItemResource } from '../mixins/item-resource.js';

/**
 * Full Card component
 *
 * @attr {Promise<Object>} item - An item.
 * @attr {Promise<Metrics>} metrics - A Metrics.
 *
 * @cssprop {String} [--gv-card-full--bgc=white] - set the background color.
 */
export class GvCardFull extends ItemResource(LitElement) {

  static get properties () {
    return {
      metrics: { type: Object },
    };
  }

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
          --gv-icon--c: #777;
          min-width: 415px;
          max-height: 281px;
          line-height: 22px;
          font-size: 14px;
        }

        .card {
          display: flex;
          flex-direction: column;
          height: 250px;
          border-radius: 4px;
          background-color: var(--gv-card-full--bgc, white);
          color: #262626;
          padding: 16px;
          --gc-icon--c: red
          box-shadow: 0 0 0 1px rgba(208, 216, 223, 1), 0 1px 3px rgba(0, 0, 0, .15);
          transition: all .3s;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -14px rgba(0, 0, 0, 0.25);
          cursor: pointer;
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
    return import('../../assets/images/api-full.png');
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
            ${truncate(this._error ? i18n('gv-card-full.error') : this._empty ? i18n('gv-card-full.empty') : this._getDescription(), this.limit)}
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

window.customElements.define('gv-card-full', GvCardFull);
