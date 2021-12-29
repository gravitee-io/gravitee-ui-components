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
import { css, html, LitElement } from 'lit';
import '../../atoms/gv-button';
import '../../atoms/gv-tag';
import { repeat } from 'lit/directives/repeat';
import { classMap } from 'lit/directives/class-map';
import { i18n } from '../../lib/i18n';
import { withSkeletonAttribute } from '../../mixins/with-skeleton-attribute';

/**
 * Stats component
 *
 * ## Details
 * * has @theme facet
 *
 * @attr {Object} stats - The stats (count by key). Key can be: count, min, max, avg, sum, rps, rpm or rph.
 * @attr {Array<any>} options - The list of options to display.
 */
export class GvStats extends withSkeletonAttribute(LitElement) {
  static get properties() {
    return {
      stats: { type: Object },
      options: { type: Array },
    };
  }

  static get styles() {
    return [
      ...super.styles,
      // language=CSS
      css`
        .stats {
          align-content: center;
          justify-content: center;
          display: flex;
          flex-wrap: wrap;
          height: 100%;
        }

        .stats-container {
          border: 1px solid;
          border-radius: 8px;
          margin: 15px;
          padding: 15px;
        }

        .stats-value {
          font-size: 30px;
          text-align: center;
        }

        .stats-label {
          font-size: 15px;
          text-align: center;
        }
      `,
    ];
  }

  constructor() {
    super();
    this._skeletonAttribute = 'stats';
  }

  _getStat(option) {
    if (!this.stats) {
      return '<div></div>';
    }
    let value = Math.round(this.stats[option.key]);
    if (isNaN(value)) {
      value = 0;
    }
    if (value === 0 && option.fallback) {
      const fallback = option.fallback.find((fallback) => Math.round(this.stats[fallback.key]) > 0);
      if (fallback) {
        option.key = fallback.key;
        option.label = fallback.label;
        value = Math.round(this.stats[option.key]);
      }
    }

    return html`
      <div class="stats-container" style="color: ${option.color}">
        <div class="stats-value">${value}${option.unit}</div>
        <div class="stats-label">${option.label || option.key}</div>
      </div>
    `;
  }

  render() {
    if (this._error) {
      return html`<div class="error">${i18n('gv-stats.error')}</div>`;
    }
    if (this._empty) {
      return html`<div class="empty">${i18n('gv-stats.empty')}</div>`;
    }
    return html`<div class="${classMap({ stats: true, skeleton: this._skeleton })}">
      ${repeat(
        this.options,
        (option) => option,
        (option) => this._getStat(option),
      )}
    </div> `;
  }
}

window.customElements.define('gv-stats', GvStats);
