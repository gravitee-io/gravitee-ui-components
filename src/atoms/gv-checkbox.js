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

/**
 *
 * A wrapper of a <checkbox> component.
 *
 * @attr {Boolean} disabled - same as native checkbox element `disabled` attribute
 * @attr {Boolean} skeleton - enable skeleton screen UI pattern (loading hint)
 * @attr {Boolean} value - true if the checkbox is checked, false otherwise
 * @attr {String} label - label of the checkbox
 * @attr {String} title - title of the checkbox
 * @attr {String} name - name of the checkbox
 *
 */
export class GvCheckbox extends LitElement {

  static get properties () {
    return {
      disabled: { type: Boolean },
      skeleton: { type: Boolean },
      value: { type: Boolean },
      label: { type: String },
      title: { type: String },
      name: { type: String },
    };
  }

  static get styles () {
    return [
      skeleton,
      // language=CSS
      css`
          div {
              position: relative;
              line-height: 0;
          }
          
          /* BASE */
          input {
              border: 1px solid #D9D9D9;
              box-sizing: border-box;
              border-radius: 4px;
              outline: none;
              padding: 10px;
              cursor: pointer;
          }

          input:disabled {
              cursor: default;
              opacity: .5;
          }

          label {
              line-height: 15px;
              padding: 0.2rem 0;
              cursor: pointer;
          }

          label.disabled, label.skeleton {
              cursor: default;
          }

          label abbr {
              position: absolute;
              left: 0;
              color: red;
              font-variant: none;
              checkbox-decoration: none;
          }
      `,
    ];
  }

  constructor () {
    super();
    this._id = 'gv-id';
    this._type = 'checkbox';
    this.value = false;
  }

  _renderLabel () {
    if (this.label) {
      return html`<label for=${this.id} class="${classMap({ disabled: this.disabled, skeleton: this.skeleton })}" title="${this.label}">
        ${this.label}
        </label>
        `;
    }
    return '';
  }

  _onInput () {
    if (!(this.disabled || this.skeleton)) {
      this.value = !this.value;
    }
  }

  _onClick () {
    this._onInput();
    this.dispatchEvent(new Event('input', {}));
  }

  render () {
    const classes = {
      skeleton: this.skeleton,
      disabled: this.disabled,
    };

    return html`
      <div>
        <input
          id=${this._id}
          .type=${this._type}
          .name=${ifDefined(this.name)}
          .title=${ifDefined(this.title || this.label)}
          ?disabled=${this.disabled || this.skeleton}
          .checked=${this.value}
          value=${this.value}
          @input=${this._onInput}>
          <label class=${classMap(classes)} for="${this._id}" @click=${this._onClick}>
          ${this._renderLabel()}
        </label>
      </div>
    `;
  }
}

window.customElements.define('gv-checkbox', GvCheckbox);
