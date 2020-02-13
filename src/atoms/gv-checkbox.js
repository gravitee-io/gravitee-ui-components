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

import { LitElement, html, css } from 'lit-element';
import { skeleton } from '../styles/skeleton';
import { dispatchCustomEvent } from '../lib/events';

/**
 * A wrapper of a <checkbox> component.
 *
 * @fires gv-checkbox:input - mirrors native input events with the `value` on `detail`
 *
 * @attr {Boolean} disabled - same as native checkbox element `disabled` attribute
 * @attr {Boolean} skeleton - enable skeleton screen UI pattern (loading hint)
 * @attr {Boolean} value - true if the checkbox is checked, false otherwise
 * @attr {String} label - label of the checkbox
 * @attr {String} title - title of the checkbox
 *
 * @cssprop {Color} [--gv-checkbox--bgc=var(--gv-theme-color, #009B5B)] - Checked background color
 */
export class GvCheckbox extends LitElement {

  static get properties () {
    return {
      disabled: { type: Boolean },
      skeleton: { type: Boolean },
      value: { type: Boolean },
      label: { type: String },
      title: { type: String },
    };
  }

  static get styles () {
    return [
      skeleton,
      // language=CSS
      css`
        :host {
          cursor: pointer;
          --gv-icon--c: var(--gv-theme-neutral-color-dark, #D9D9D9);
          --gv-icon--s: 30px;
        }

        .container {
          position: relative;
          height: 30px;
        }

        /* BASE */
        input {
          border: 1px solid var(--gv-theme-neutral-color-dark, #D9D9D9);
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
          cursor: pointer;
          font-weight: 600;
          font-size: var(--gv-theme-font-size-m, 14px);
          line-height: 29px;
          padding-left: 15px;
        }

        gv-icon {
          position: absolute;
        }

        gv-icon.checked {
          --gv-icon--s: 20px;
          background-color: var(--gv-checkbox--bgc, var(--gv-theme-color, #009B5B));
          display: inherit !important;
          margin: 5px;
          border-radius: 4px;
          height: 20px;
        }

        gv-icon:disabled {
          cursor: default;
          opacity: .5;
        }

        .disabled, .skeleton {
          cursor: default;
        }

        label abbr {
          position: absolute;
          left: 0;
          color: red;
          font-variant: none;
        }
      `,
    ];
  }

  constructor () {
    super();
    this._type = 'checkbox';
    this.value = false;
  }

  _renderLabel () {
    if (this.label) {
      return html`<label class="${classMap({
        disabled: this.disabled,
        skeleton: this.skeleton,
        'checkbox-label': true,
      })}" title="${this.label}">
        ${this.label}
        </label>
        `;
    }
    return '';
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
      container: true,
    };
    return html`
      <div class=${classMap(classes)}>
        <gv-icon shape="design:border" @click=${this._onInput}></gv-icon>
        <gv-icon style="display: none;" @click=${this._onInput}
            class=${classMap({ checked: this.value })} shape="code:check"></gv-icon>
        <label @click=${this._onInput}>${this._renderLabel()}</label>
      </div>
    `;
  }
}

window.customElements.define('gv-checkbox', GvCheckbox);
