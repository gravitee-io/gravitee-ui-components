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
import { classMap } from 'lit-html/directives/class-map';
import { ifDefined } from 'lit-html/directives/if-defined';

import { LitElement, html, css } from 'lit-element';
import { skeleton } from '../styles/skeleton.js';
import { dispatchCustomEvent } from '../lib/events';

/**
 *
 * A wrapper of a <switch> component.
 *
 * @fires gv-switch:input - mirrors native input events with the `value` on `detail`
 *
 * @attr {Boolean} disabled - same as native switch element `disabled` attribute
 * @attr {Boolean} skeleton - enable skeleton screen UI pattern (loading hint)
 * @attr {Boolean} value - true if the switch is checked, false otherwise
 * @attr {String} label - label of the switch
 * @attr {String} description - description of the switch
 *
 */
export class GvSwitch extends LitElement {

  static get properties () {
    return {
      disabled: { type: Boolean },
      skeleton: { type: Boolean },
      value: { type: Boolean },
      label: { type: String },
      description: { type: String },
    };
  }

  static get styles () {
    return [
      skeleton,
      // language=CSS
      css`
        .container {
          display: flex;
          height: 30px;
        }

        .labels {
          display: grid;
          margin-right: 30px;
        }

        .switch-title {
          font-weight: 600;
        }

        .switch-description {
          color: #8C8C8C;
        }

        .switch-container {
          display: flex;
          align-items: center;
        }

        .switch {
          position: relative;
          width: 40px;
          -webkit-user-select:none; -moz-user-select:none; -ms-user-select: none;
        }

        .switch input {
          display: none;
        }

        .switch-label {
          display: block;
          overflow: hidden;
          cursor: pointer;
          height: 16px;
          padding: 0;
          line-height: 16px;
          border: 2px solid transparent;
          border-radius: 16px;
          background-color: #BFBFBF;
          transition: background-color 0.3s ease-in;
        }

        .switch-label:before {
          content: "";
          display: block;
          width: 16px;
          margin: 0;
          background: #FFFFFF;
          position: absolute;
          top: 0;
          bottom: 0;
          right: 20px;
          border: 2px solid #BFBFBF;
          border-radius: 16px;
          transition: all 0.3s ease-in 0s;
        }

        .switch input:checked + .switch-label {
          background-color: #009B5B;
        }

        .switch input:checked + .switch-label, .switch input:checked + .switch-label:before {
          border-color: #009B5B;
        }

        .switch input:checked + .switch-label:before {
          right: 0;
        }

        .switch input:disabled + .switch-label {
          cursor: default;
          opacity: .5;
        }
      `,
    ];
  }

  constructor () {
    super();
    this._id = 'gv-id';
    this.value = true;
  }

  _onInput () {
    if (!(this.disabled || this.skeleton)) {
      this.value = !this.value;
      dispatchCustomEvent(this, 'input', this.value);
    }
  }

  render () {
    const classes = {
      skeleton: this.skeleton,
      disabled: this.disabled,
      switch: true,
    };

    return html`
    <div class="container">
      <div class=${classMap({ labels: this.label && this.description })}>
        <label class="switch-title">${this.label}</label>
        <label class="switch-description">${this.description}</label>
      </div>
      <div class="switch-container">
        <div class=${classMap(classes)}>
          <input
            id=${this._id}
            type="checkbox"
            .title=${ifDefined(this.label || this.description)}
            ?disabled=${this.disabled || this.skeleton}
            .checked=${this.value}
            value=${this.value}
            @input=${this._onInput}>
          <label class="switch-label" for="${this._id}"></label>
        </div>
      </div>
    </div>
    `;
  }
}

window.customElements.define('gv-switch', GvSwitch);
