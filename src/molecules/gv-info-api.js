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
import { link } from '../styles/link';
import { i18n } from '../lib/i18n';
import { repeat } from 'lit-html/directives/repeat';
import { classMap } from 'lit-html/directives/class-map';
import { ApiResource } from '../mixins/api-resource';

/**
 * Api Info component
 *
 * ## Types
 * * Api:  https://github.com/gravitee-io/gravitee-clients-sdk/blob/master/model/api.ts
 * * ApiMetrics:  https://github.com/gravitee-io/gravitee-clients-sdk/blob/master/model/apiMetrics.ts
 *
 * @attr {Api} api - An Api
 * @attr {ApiMetrics} metrics - An ApiMetrics.
 * @attr {Boolean} withDublinCore - If you want display title, description & image of an API.
 * @cssprop {Color} [--gv-info-api--bgc=white] - set the background color.
 *
 * @appliesMixin ApiResource
 */
export class GvInfoApi extends ApiResource(LitElement) {

  static get properties () {
    return {
      metrics: { type: Object },
      _metrics: { type: Object, attribute: false },
      withDublinCore: { type: Boolean, attribute: 'with-dc' },
    };
  }

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
          max-width: 280px;
          --gv-image--w: 32px;
          --gv-image--h: 32px;
          --gv-rating--s: 24px;
          font-size: 14px;
          line-height: 22px;
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

        .dc {
          margin: 6px 12px;
        }

        h4 {
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

        .info__miscellaneous_item span {
          padding: 1px 5px 1px 0;
          color: #8C8C8C;
        }

        .skeleton .info__miscellaneous_item span {
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

        .dc.skeleton {
          min-height: 150px;
        }

        .info.skeleton {
          min-height: 50px;
        }

        .figures {
          display: flex;
          flex-direction: column;
        }

        gv-tag, gv-label {
          cursor: pointer;
          font-size: 12px;
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

        .title {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .title h3 {
          flex: 1;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          word-break: break-all;
          margin: 0.2rem;
        }

        .title .version {
          font-size: 12px;
          line-height: 20px;
          color: #D9D9D9;
        }

        .description {
          background-color: #FAFAFA;
          border-radius: 2px;
          padding: 16px;
        }

      `,
    ];
  }

  constructor () {
    super();
    this.withDublinCore = false;
  }

  set metrics (metrics) {
    Promise.resolve(metrics)
      .then((metrics) => {
        if (metrics) {
          this._metrics = metrics;
        }
      });
  }

  _renderInfoRating () {
    const rating = this._getRating();
    if (rating) {
      return html`<gv-rating .skeleton="${this._skeleton}" .average="${rating.average}"></gv-rating>`;
    }
    return '';
  }

  _renderDescription () {
    if (this._getDescription()) {
      return html`<div class="description">
                    <h4>${i18n('gv-info-api.about')}</h4>
                    ${this._getDescription()}
                  </div>`;
    }
    return '';
  }

  render () {
    if (this._empty) {
      return html`
        <div class="infos">
          <div class="info">
            <span></span>
          </div>
        </div>
      `;
    }

    if (this._error) {
      return html`
        <div class="infos">
          <div class="info">
            <h4>${i18n('gv-info-api.error')}</h4>
          </div>
        </div>
      `;
    }

    const views = this._getViews();
    const labels = this._getLabels();
    return html`
      <div class="infos">

        ${this.withDublinCore === true
      ? html`
          <div class="${classMap({ dc: true, skeleton: this._skeleton })}">
            <div class="title">
                ${this._renderImage()}
               <h3>${this._getTitle()}</h3>
               <span class="version">${this._getVersion()}</span>
            </div>
            ${this._renderDescription()}
         </div>
      `
      : ''
    }

        ${this._skeleton || (views && views.length > 0)
      ? html`
              <div class="${classMap({ info: true, skeleton: this._skeleton })}">
                <h4>${i18n('gv-info-api.categories')}</h4>
                <span>${this._renderViews()}</span>
              </div>
            `
      : ''
    }
        ${this._skeleton || (labels && labels.length > 0)
      ? html`
              <div class="${classMap({ info: true, skeleton: this._skeleton })}">
                <h4>${i18n('gv-info-api.labels')}</h4>
                <span>${this._renderLabels()}</span>
              </div>
            `
      : ''
    }
        ${this._skeleton || this._getRating()
      ? html`
              <div class="${classMap({ info: true, skeleton: this._skeleton })}">
                <h4>${i18n('gv-info-api.ratings')}</h4>
                <span class="figures">${this._renderInfoRating()}</span>
              </div>
            `
      : ''
    }
        ${this._metrics && (this._metrics.subscribers || this._metrics.health || this._metrics.hits)
      ? html`
              <div class="${classMap({ info: true, skeleton: this._skeleton })}">
                <h4>${i18n('gv-info-api.metrics')}</h4>
                <gv-metrics .metrics="${this._metrics}"></gv-metrics>
              </div>
            `
      : ''
    }
        ${this.resources && this.resources.length > 0
      ? html`
              <div class="${classMap({ info: true, skeleton: this._skeleton })}">
                <h4>${i18n('gv-info-api.resources')}</h4>
                <span>
                  ${repeat(this.resources, (item) => item, (item) =>
        html`<div class="info__resources"><a class="link" href="#">${item}</a></div>`
      )}
                </span>
              </div>
            `
      : ''
    }
        ${this.miscellaneous && this.miscellaneous.length > 0
      ? html`
              <div class="${classMap({ info: true, skeleton: this._skeleton })}">
                <h4>${i18n('gv-info-api.moreInfo')}</h4>
                <span>
                  <ul class="info__miscellaneous">
                    ${repeat(this.miscellaneous, (item) =>
        html`<li class="info__miscellaneous_item"><span>${item.key}</span>${item.value}</li>`
      )}
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
