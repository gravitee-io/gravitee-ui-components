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
import '../atoms/gv-metric';
import { i18n } from '../lib/i18n';
import { withSkeletonAttribute } from '../mixins/with-skeleton-attribute';
import { classMap } from 'lit-html/directives/class-map';

/**
 * Api metrics information component
 *
 * @attr {Promise<ApiMetrics>} metrics - Metrics of an API.
 * @attr {RatingSummary} rating - Ratings of an API.
 */
export class GvMetrics extends withSkeletonAttribute(LitElement) {

  static get properties () {
    return {
      metrics: { type: Object },
      _metrics: { type: Object, attribute: false },
    };
  }

  static get styles () {
    return [
      ...super.styles,
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          margin: 0.2rem;
          width: 100%;
          height: 100%;
          min-height: 25px;
          min-width: 25px;
        }

        div {
          display: flex;
          width: 100%;
        }

        div > * {
          flex: 1 1 auto;
        }
      `,
    ];
  }

  constructor () {
    super();
    this._skeletonAttribute = 'metrics';
    this.skeleton = false;
    this._error = false;
    this._empty = false;
  }

  _getSubscribers () {
    if (this._metrics) {
      return this._metrics.subscribers;
    }
    return null;
  }

  _getHits () {
    if (this._metrics) {
      return this._metrics.hits;
    }
    return null;
  }

  _getHealth () {
    if (this._metrics) {
      return !isNaN(this._metrics.health)
        ? Intl.NumberFormat.call(this, navigator.language, {
          style: 'percent',
          maximumFractionDigits: 2,
        }).format(this._metrics.health)
        : ''
      ;
    }
    return null;
  }

  _renderMetric (icon, name, value) {
    return (value || this._skeleton)
      ? html`<gv-metric .skeleton="${this._skeleton}" icon="${icon}" name="${name}" value="${value}"></gv-metric>`
      : html``;
  }

  render () {

    if (this._error) {
      return html`<div class="error">${i18n('gv-metrics.error')}</div>`;
    }

    return html`
        <div class="${classMap({ skeleton: this._skeleton })}">
            ${this._renderMetric('communication:group', i18n('gv-metrics.subscribers', { count: this._getSubscribers() }), this._getSubscribers())}
            ${this._renderMetric('general:cursor', i18n('gv-metrics.hits', { count: this._getHits() }), this._getHits())}
            ${this._renderMetric('general:heart', i18n('gv-metrics.health'), this._getHealth())}
            <slot></slot>
        </div>
    `;
  }

}

window.customElements.define('gv-metrics', GvMetrics);
