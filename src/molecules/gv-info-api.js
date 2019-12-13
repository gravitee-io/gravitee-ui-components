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
import { link } from '../styles/link';
import { ApiElement } from '../mixins/api-element';
import { i18n } from '../lib/i18n.js';
import { repeat } from 'lit-html/directives/repeat';
import { classMap } from 'lit-html/directives/class-map';

/**
 * Api Info component
 *
 * @attr {Promise<Api>} api - An Api.
 * @attr {Promise<ApiMetrics>} metrics - An Api.
 *
 * @cssprop {String} [--gv-info-api--bgc=white] - set the background color.
 */
export class GvInfoApi extends ApiElement {

  static get styles () {
    return [
      link,
      skeleton,
      // language=CSS
      css`
          :host {
              box-sizing: border-box;
              display: inline-block;
              width: 280px;
          }

          .infos {
              display: flex;
              flex-direction: column;
              border-radius: 4px;
              background-color: var(--gv-info-api--bgc, white);
              padding: 12px 0;
          }

          .info {
              margin: 12px 24px;
          }

          .info h4 {
              margin: 0 0 8px 0;
          }

          .info__miscellaneous {
              list-style: none;
              padding: 0;
          }

          .info__resources, .info__miscellaneous_item {
            padding: 1px 0;
            line-height: 22px;
            vertical-align: middle;
          }

          .info__miscellaneous_item span{
            padding: 1px 5px 1px 0;
            color: #8C8C8C;
          }

          .skeleton .info__miscellaneous_item span{
            color: transparent;
          }

          .skeleton {
              background-color: #aaa;
              border-color: #777;
              color: transparent;
              transition: 0.5s;
              display: block;
              padding: 15px;
          }

          .skeleton a {
              visibility: hidden;
          }

          .figures {
              display: flex;
              flex-direction: column;
          }
          gv-tag {
              cursor: pointer;
          }
          gv-metrics {
              margin-top: 10px;
          }

          gv-tag:hover {
              --gv-tag--bsw: 0 1px 3px #888;
          }

          gv-tag:active {
              --gv-tag--bsw: none;
          }
      `,
    ];
  }

  set metrics (metrics) {
    Promise.resolve(metrics)
      .then((metrics) => {
        if (metrics) {
          this._metrics = metrics;
        }
      });
  }

  render () {
    const views = this._getViews();
    const labels = this._getLabels();
    if (this._empty) {
      return html`
        <div class="infos">
          <div class="info">
            <span class="${classMap({ skeleton: this._skeleton })}"></span>
          </div>
        </div>
      `;
    }

    if (this._error) {
      return html`
        <div class="infos">
          <div class="info">
            <h4 class="title">${i18n('gv-info-api.error')}</h4>
          </div>
        </div>
      `;
    }

    return html`
      <div class="infos">
        
        ${views && views.length > 0
          ? html`
              <div class="info">
                <h4>${i18n('gv-info-api.categories')}</h4>
                <span class="${classMap({ skeleton: this._skeleton })}">
                  ${this._renderViews()}
                </span>
              </div>
            `
          : ''
        }
        ${labels && labels.length > 0
          ? html`
              <div class="info">
                <h4>${i18n('gv-info-api.labels')}</h4>
                <span class="${classMap({ skeleton: this._skeleton })}">
                  ${this._renderLabels()}
                </span>
              </div>
            `
          : ''
        }
        ${this._getRating()
          ? html`
              <div class="info">
                <h4>${i18n('gv-info-api.ratings')}</h4>
                <span class="${classMap({ skeleton: this._skeleton, figures: true })}">
                  ${this._renderInfoRating()}
                </span>
              </div>
            `
          : ''
        }
        ${this._metrics && (this._metrics.subscribers || this._metrics.health || this._metrics.hits)
          ? html`
              <div class="info">
                <h4>${i18n('gv-info-api.metrics')}</h4>
                <gv-metrics .metrics="${this._metrics}"></gv-metrics>
              </div>
            `
          : ''
        }
        ${this.resources && this.resources.length > 0
          ? html`
              <div class="info">
                <h4>${i18n('gv-info-api.resources')}</h4>
                <span class="${classMap({ skeleton: this._skeleton })}">
                  ${repeat(this.resources, (item) => item, (item) => html`<div class="info__resources"><a class="link" href="#">${item}</a></div>`)}
                </span>
              </div>
            `
          : ''
        }
        ${this.miscellaneous && this.miscellaneous.length > 0
          ? html`
              <div class="info">
                <h4>${i18n('gv-info-api.moreInfo')}</h4>
                <span class="${classMap({ skeleton: this._skeleton })}">
                  <ul class="info__miscellaneous">
                    ${repeat(this.miscellaneous, (item) => html`<li class="info__miscellaneous_item"><span>${item.key}</span>${item.value}</li>`)}
                  </ul>
                </span>
              </div>
            `
          : ''
        }
      </div>
      `;
  }

}

window.customElements.define('gv-info-api', GvInfoApi);
