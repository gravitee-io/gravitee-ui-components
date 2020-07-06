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
 * ## Details
 * * has @theme facet
 *
 * @fires gv-checkbox:input - mirrors native input events with the `value` on `detail`
 * @fires input - native input event
 * @fires change - native change event
 *
 * @attr {Boolean} disabled - same as native checkbox element `disabled` attribute
 * @attr {Boolean} skeleton - enable skeleton screen UI pattern (loading hint)
 * @attr {String} value - The string to use as the value of the checkbox when submitting the form, if the checkbox is currently toggled on
 * @attr {Boolean} checked - true if the checkbox is checked, false otherwise
 * @attr {String} label - label of the checkbox
 * @attr {String} title - title of the checkbox
 *
 * @cssprop {Color} [--gv-checkbox--bgc=var(--gv-theme-color, #5A7684)] - Checked background color
 */
export class GvCheckbox extends LitElement {

  static get properties () {
    return {
      disabled: { type: Boolean },
      skeleton: { type: Boolean },
      value: { type: String, reflect: true },
      checked: { type: Boolean, reflect: true },
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

        .required > label::after {
          content: '*';
          color: var(--gv-theme-color-danger);
        }

        gv-icon {
          position: absolute;
        }

        gv-icon.checked {
          --gv-icon--s: 20px;
          background-color: var(--gv-checkbox--bgc, var(--gv-theme-color, #5A7684));
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
    this.checked = false;
    this.value = 'off';
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
      this.checked = !this.checked;
      // Must dispatch events after all properties are updated
      setTimeout(() => {
        dispatchCustomEvent(this, 'input', this.checked);
        this.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        this.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
      }, 0);
    }
  }

  updated (properties) {
    if (properties.has('checked') && (this.value === 'off' || this.value === 'on')) {
      this.value = this.checked ? 'on' : 'off';
    }
  }

  render () {
    const classes = {
      skeleton: this.skeleton,
      disabled: this.disabled,
      required: this.required,
      container: true,
    };
    return html`
      <div class=${classMap(classes)}>
        <gv-icon shape="design:border" @click=${this._onInput}></gv-icon>
        <gv-icon style="display: none;" @click=${this._onInput}
            class=${classMap({ checked: this.checked })} shape="code:check"></gv-icon>
        <label @click=${this._onInput}>${this._renderLabel()}</label>
      </div>
    `;
  }
}

window.customElements.define('gv-checkbox', GvCheckbox);
