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
import { classMap } from 'lit-html/directives/class-map.js';
import { LitElement, html, css } from 'lit-element';
import { skeleton } from '../styles/skeleton';
import './gv-icon';

/**
 * A Metric
 *
 * @attr {String} icon - name of shape
 * @attr {String} name - the name of the metric
 * @attr {String} value - the value of the metric
 * @attr {Boolean} skeleton - enable skeleton screen UI pattern (loading hint)
 *
 * @cssprop {Color} [--gv-metric--c=#009B5B] - set the icon color.
 */
export class GvMetric extends LitElement {

  static get properties () {
    return {
      icon: { type: String },
      name: { type: String },
      value: { type: String },
      skeleton: { type: Boolean },
    };
  }

  static get styles () {
    return [
      skeleton,
      // language=CSS
      css`
          .metric {
              --gv-icon--s: 24px;
              --gv-icon--c: var(--gv-metric--c, #009B5B);
              display: inline-flex;
              min-width: 75px;
          }

          .icon {
              align-self: center;
              margin-right: 4px;
          }

          div {
              display: block;
          }

          .metric-value {
              font-size: 14px;
              line-height: 16px;
              align-self: center;
          }

          .metric-name {
              font-size: 8px;
              line-height: 10px;
              opacity: 0.5;
          }

          .skeleton {
              background-color: #aaa;
              border-color: #777;
              color: transparent;
              transition: 0.5s;
          }
      `,
    ];
  }

  render () {

    const modes = {
      skeleton: this.skeleton,
      metric: true,
    };

    return html`
      <div class=${classMap(modes)}>
        ${this.value
          ? html`
            <div class="icon">
              <gv-icon shape="${this.icon}"></gv-icon>
            </div>
            <div>
              <div class="metric-value">${this.value}</div>
              <div class="metric-name">${this.name}</div>
            </div>
            `
          : ''
        }
      </div>
    `;
  }

}

window.customElements.define('gv-metric', GvMetric);
