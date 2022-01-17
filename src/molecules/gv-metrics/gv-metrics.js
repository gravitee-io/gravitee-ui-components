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
import { css, LitElement, html } from 'lit';
import '../../atoms/gv-metric';
import { i18n } from '../../lib/i18n';
import { link } from '../../styles/link';
import { withSkeletonAttribute } from '../../mixins/with-skeleton-attribute';
import { classMap } from 'lit/directives/class-map.js';
import { dispatchCustomEvent } from '../../lib/events';
import { ifDefined } from 'lit/directives/if-defined.js';

/**
 * Metrics information component
 *
 * ## Details
 * * has @theme facet
 * * attributes `metrics` should be an array of Object {value, clickable}, or an array of values, or a mix.
 *
 * @fires gv-metrics:click - Click event from metric if is clickable
 *
 * @attr {Promise<{ hits: value, health: {value, clickable}, subscribers: {value, clickable?, title?} }>} metrics - Metrics.
 * @attr {RatingSummary} rating - Ratings of an API.
 */
export class GvMetrics extends withSkeletonAttribute(LitElement) {
  static get properties() {
    return {
      metrics: { type: Object },
      _metrics: { type: Object, attribute: false },
    };
  }

  static get styles() {
    return [
      ...super.styles,
      link,
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          margin: 0.2rem;
          width: 100%;
          height: 100%;
          min-height: 25px;
          min-width: 25px;
          display: flex;
          width: 100%;
        }

        :host > * {
          flex: 1 1 auto;
        }
      `,
    ];
  }

  constructor() {
    super();
    this._skeletonAttribute = 'metrics';
    this.skeleton = false;
    this._error = false;
    this._empty = false;
  }

  _isClickable(metricName) {
    if (this._metrics && typeof this._metrics[metricName] === 'object') {
      return this._metrics[metricName].clickable;
    }
    return false;
  }

  _getValue(metric) {
    if (typeof metric === 'object') {
      return metric.value;
    }
    return metric;
  }

  _getSubscribers() {
    if (this._metrics) {
      return this._getValue(this._metrics.subscribers);
    }
    return null;
  }

  _getHits() {
    if (this._metrics) {
      return this._getValue(this._metrics.hits);
    }
    return null;
  }

  _getHealth() {
    if (this._metrics) {
      const health = this._getValue(this._metrics.health);
      return !isNaN(health)
        ? Intl.NumberFormat.call(this, navigator.language, {
            style: 'percent',
            maximumFractionDigits: 2,
          }).format(health)
        : '';
    }
    return null;
  }

  _getTitle(metricName) {
    if (this._metrics && typeof this._metrics[metricName] === 'object') {
      return this._metrics[metricName].title;
    }
    return null;
  }

  _onClick(key) {
    dispatchCustomEvent(this, 'click', { key });
  }

  _renderMetric(key, icon, name, value) {
    const clickable = this._isClickable(key);
    return value || this._skeleton
      ? html`<gv-metric
          @click="${clickable ? this._onClick.bind(this, key) : null}"
          .skeleton="${this._skeleton}"
          icon="${icon}"
          name="${name}"
          value="${value}"
          class="${classMap({ link: clickable })}"
          title="${ifDefined(this._getTitle(key))}"
        ></gv-metric>`
      : html``;
  }

  render() {
    if (this._error) {
      return html`<div class="error">${i18n('gv-metrics.error')}</div>`;
    }

    const subscribers = this._getSubscribers();
    const hits = this._getHits();
    const health = this._getHealth();

    return html`
      ${this._renderMetric('subscribers', 'communication:group', i18n('gv-metrics.subscribers', { count: subscribers }), subscribers)}
      ${this._renderMetric('hits', 'general:cursor', i18n('gv-metrics.hits', { count: hits }), hits)}
      ${this._renderMetric('health', 'general:heart', i18n('gv-metrics.health'), health)}
      <slot></slot>
    `;
  }
}

window.customElements.define('gv-metrics', GvMetrics);
