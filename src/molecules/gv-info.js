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
import { dispatchCustomEvent } from '../lib/events';
import '../atoms/gv-image';
import '../atoms/gv-button';
import { link } from '../styles/link';
import { i18n, getLanguage } from '../lib/i18n';
import { repeat } from 'lit-html/directives/repeat';
import { classMap } from 'lit-html/directives/class-map';
import { ItemResource } from '../mixins/item-resource';
import { getDescription, getLabels, getViews, getTitle, getVersion, getRating } from '../lib/item';

/**
 * Info component
 *
 * ## Types
 * * Item:
 *  - https://github.com/gravitee-io/gravitee-clients-sdk/blob/master/model/api.ts
 *  - https://github.com/gravitee-io/gravitee-clients-sdk/blob/master/model/application.ts
 * * ApiMetrics:  https://github.com/gravitee-io/gravitee-clients-sdk/blob/master/model/apiMetrics.ts
 *
 * @fires gv-info:rating - When user click to readonly rating
 * @attr {any} item - An item
 * @attr {ApiMetrics} metrics - An ApiMetrics.
 * @attr {any} miscellaneous - Miscellaneous data with a key, value and date (optional: short, long, relative).
 * @attr {String} title - Title to display.
 * @attr {Boolean} withDublinCore - If you want display title, description & image of an item
 *
 * @cssprop {Color} [--gv-info--bgc=var(--gv-theme-neutral-color-lightest, #FFFFFF)] - Background color
 * @cssprop {Length} [--gv-info-rating--s=24px] - Height and rating width
 * @cssprop {Length} [--gv-info-image--h=32px] - Image height
 * @cssprop {Length} [--gv-info-image--w=32px] - Image width
 *
 * @appliesMixin ItemResource
 */
export class GvInfo extends ItemResource(LitElement) {

  static get properties () {
    return {
      resources: { type: Object },
      metrics: { type: Object },
      _metrics: { type: Object, attribute: false },
      miscellaneous: { type: Object },
      title: { type: String },
      withDublinCore: { type: Boolean, attribute: 'with-dc' },
    };
  }

  static get styles () {
    return [
      link,
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          display: inline-block;
          width: 280px;
          max-width: 280px;
          --gv-rating--s: var(--gv-info-rating--s, 24px);
          font-size: var(--gv-theme-font-size-m, 14px);
          line-height: 22px;
        }

        gv-identity-picture {
          height: var(--gv-info-image--h, 32px);
          width: var(--gv-info-image--w, 32px);
        }
        .infos {
          display: flex;
          flex-direction: column;
          border-radius: 4px;
          background-color: var(--gv-info--bgc, var(--gv-theme-neutral-color-lightest, #FFFFFF));
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
          color: var(--gv-theme-neutral-color-dark, #BFBFBF);
          filter: contrast(0);
        }

        .skeleton .info__miscellaneous_item span {
          color: transparent;
        }

        .skeleton {
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
          font-size: var(--gv-theme-font-size-s, 12px);
        }

        gv-metrics {
          display: grid;
          grid-gap: 0.5rem;
        }

        gv-tag:hover {
          --gv-tag--bsw: 0 1px 3px var(--gv-theme-neutral-color-dark, #BFBFBF);
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
          font-size: var(--gv-theme-font-size-s, 12px);
          line-height: 20px;
          color: var(--gv-theme-neutral-color-dark, #D9D9D9);
        }

        .description {
          background-color: var(--gv-theme-neutral-color-lighter, #FAFAFA);
          border-radius: 2px;
          padding: 16px;
        }

        gv-rating {
          cursor: pointer;
        }
      `,
      skeleton,
    ];
  }

  constructor () {
    super();
    this.withDublinCore = false;
    this._empty = false;
  }

  set metrics (metrics) {
    Promise.resolve(metrics)
      .then((metrics) => {
        if (metrics) {
          this._metrics = metrics;
        }
      });
  }

  _onClickRating () {
    dispatchCustomEvent(this, 'rating');
  }

  _renderInfoRating () {
    const rating = getRating(this._item);
    if (rating) {
      return html`
    ${rating.count ? '' : html`<span>${i18n('gv-info.beFirstToRate')}</span>`}
<gv-rating @click="${this._onClickRating}" readonly
.skeleton="${this._skeleton}"
.count="${rating.count}"
.value="${rating.average}"></gv-rating>`;
    }
    return '';
  }

  async _onClick (resourceItem, e) {
    e.preventDefault();
    dispatchCustomEvent(this, 'click-resource', {
      path: resourceItem.path,
      title: resourceItem.title,
      target: resourceItem.target,
    });
  }

  _renderDescription () {
    const description = getDescription(this._item);
    if (description && description.trim() !== '') {
      return html`<div class="description">
                    <h4>${i18n('gv-info.about')}</h4>
                    ${description}
                  </div>`;
    }
    return '';
  }

  _renderMiscellaneous (item) {
    return html`<span>${item.key}</span>
      ${!item.date ? item.value : ''}
      ${item.date ? item.date === 'relative' ? html`<gv-relative-time datetime="${item.value}" noFuture></gv-relative-time>`
      : (item.date === 'short' ? item.value.toLocaleDateString(getLanguage()) : item.value.toLocaleString(getLanguage())) : ''}`;
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
            <h4>${i18n('gv-info.error')}</h4>
          </div>
        </div>
      `;
    }

    const views = getViews(this._item);
    const labels = getLabels(this._item);
    return html`
      <div class="infos">

        ${this.withDublinCore === true
      ? html`
          <div class="${classMap({ dc: true, skeleton: this._skeleton })}">
            <div class="title">
                ${this._renderImage()}
               <h3>${getTitle(this._item)}</h3>
               <span class="version">${getVersion(this._item)}</span>
            </div>
            ${this._renderDescription()}
         </div>
      `
      : ''
    }

        ${this._skeleton || (this._item && this._item.entrypoints && this._item.entrypoints.length > 0)
      ? html`
          <div class="${classMap({ info: true, skeleton: this._skeleton })}">
            <h4>${i18n('gv-info.entrypoints')}</h4>
            ${repeat(this._item.entrypoints, (e) => html`<div><a class="link" href="${e}" target="_blank">${e}</a></div>`)}
          </div>
        `
      : ''
    }

        ${this._skeleton || (views && views.length > 0)
      ? html`
              <div class="${classMap({ info: true, skeleton: this._skeleton })}">
                <h4>${i18n('gv-info.categories')}</h4>
                <span>${this._renderViews()}</span>
              </div>
            `
      : ''
    }
        ${this._skeleton || (labels && labels.length > 0)
      ? html`
              <div class="${classMap({ info: true, skeleton: this._skeleton })}">
                <h4>${i18n('gv-info.labels')}</h4>
                <span>${this._renderLabels()}</span>
              </div>
            `
      : ''
    }
        ${this._skeleton || getRating(this._item)
      ? html`
              <div class="${classMap({ info: true, skeleton: this._skeleton })}">
                <h4>${i18n('gv-info.ratings')}</h4>
                <span class="figures">${this._renderInfoRating()}</span>
              </div>
            `
      : ''
    }
        ${this._metrics && (this._metrics.subscribers || this._metrics.health || this._metrics.hits)
      ? html`
              <div class="${classMap({ info: true, skeleton: this._skeleton })}">
                <h4>${i18n('gv-info.metrics')}</h4>
                <gv-metrics .metrics="${this._metrics}"></gv-metrics>
              </div>
            `
      : ''
    }
        ${this.resources && this.resources.length > 0
      ? html`
              <div class="${classMap({ info: true, skeleton: this._skeleton })}">
                <h4>${i18n('gv-info.resources')}</h4>
                <span>
                  ${repeat(this.resources, (item) => item, (item) => html`
                    <div class="info__resources">
                      <a class="link" href="${item.path}" target="${item.target}" @click=${this._onClick.bind(this, item)}>${item.title}</a>
                    </div>`,
      )}
                </span>
              </div>
            `
      : ''
    }
        ${this.miscellaneous && this.miscellaneous.length > 0
      ? html`
              <div class="${classMap({ info: true, skeleton: this._skeleton })}">
                <h4>${this.title || i18n('gv-info.moreInfo')}</h4>
                <span>
                  <ul class="info__miscellaneous">
                    ${repeat(this.miscellaneous, (item) =>
                      html`<li class="info__miscellaneous_item">
                            ${item.type ? html`<gv-input type=${item.type} value=${item.value}></gv-input>` : this._renderMiscellaneous(item)}
                        </li>`,
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

window.customElements.define('gv-info', GvInfo);
