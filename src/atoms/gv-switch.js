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
import { skeleton } from '../styles/skeleton';
import { dispatchCustomEvent } from '../lib/events';

/**
 * A wrapper of a <switch> component.
 *
 * ## Details
 * * has @theme facet
 *
 * @fires gv-switch:input - mirrors native input events with the `value` on `detail`
 *
 * @attr {Boolean} disabled - same as native switch element `disabled` attribute
 * @attr {Boolean} skeleton - enable skeleton screen UI pattern (loading hint)
 * @attr {Boolean|String} value - true if the switch is checked, false otherwise
 * @attr {String} label - label of the switch
 * @attr {String} description - description of the switch
 * @attr {Boolean} checked - same as native switch element `checked` attribute
 * @attr {Boolean} readonly - true if readonly
 *
 * @cssprop {Color} [--gv-switch-on--bgc=var(--gv-theme-color, #5a7684)] - On background color
 * @cssprop {Color} [--gv-switch-off--bgc=var(--gv-theme-neutral-color-dark, #bfbfbf)] - Off background color
 * @cssprop {Color} [--gv-switch--bgc=var(--gv-theme-neutral-color-lightest, #ffffff)] - Switch background color
 * @cssprop {String} [--gv-switch--ta=left] - Switch label text alignment
 */
export class GvSwitch extends LitElement {
  static get properties() {
    return {
      disabled: { type: Boolean, reflect: true },
      skeleton: { type: Boolean },
      value: { type: String, reflect: true },
      label: { type: String },
      description: { type: String },
      small: { type: Boolean, reflect: true },
      checked: { type: Boolean, reflect: true },
      readonly: { type: Boolean, reflect: true },
    };
  }

  static get styles() {
    return [
      skeleton,
      // language=CSS
      css`
        :host {
          --off-bgc: var(--gv-switch-off--bgc, var(--gv-theme-neutral-color-dark, #bfbfbf));
          --on-bgc: var(--gv-switch-on--bgc, var(--gv-theme-color, #5a7684));
          box-sizing: border-box;
          margin: 0.2rem;
        }

        .container {
          display: flex;
        }

        .labels {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          margin-right: 0.4rem;
          box-sizing: border-box;
          text-align: var(--gv-switch--ta, left);
        }

        .switch-title {
          font-weight: 600;
        }

        .switch-description {
          opacity: 0.6;
        }

        .switch-container {
          display: flex;
          align-items: center;
        }

        .switch {
          position: relative;
          width: 40px;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          border-radius: 16px;
        }

        :host([small]) .switch {
          width: 25px;
        }

        :host([small]) .switch-label:before {
          width: 10px;
          border-radius: 10px;
          right: 10px;
        }

        :host([small]) .switch-label {
          height: 10px;
          line-height: 10px;
          border-radius: 10px;
        }

        :host([small]) .switch-title {
          font-weight: 400;
          font-size: 11px;
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
          background-color: var(--off-bgc);
          transition: background-color 0.3s ease-in;
        }

        .switch-label:before {
          content: '';
          display: block;
          width: 16px;
          margin: 0;
          background: var(--gv-switch--bgc, var(--gv-theme-neutral-color-lightest, #ffffff));
          position: absolute;
          top: 0;
          bottom: 0;
          right: 20px;
          border: 2px solid var(--off-bgc);
          border-radius: 16px;
          transition: all 0.3s ease-in 0s;
        }

        :host([checked]) .switch-label {
          background-color: var(--on-bgc);
        }

        :host([checked]) .switch-label,
        :host([checked]) .switch-label:before {
          border-color: var(--on-bgc);
        }

        :host([checked]) .switch-label:before {
          right: 0;
        }

        :host([disabled]) .switch-label,
        :host([readonly]) .switch-label {
          cursor: default;
        }

        :host([disabled]) .switch-label {
          opacity: 0.5;
        }
      `,
    ];
  }

  constructor() {
    super();
    this._id = 'gv-id';
    this.checked = false;
  }

  _onInput() {
    if (!(this.disabled || this.skeleton || this.readonly)) {
      this.value = !this.checked;
      dispatchCustomEvent(this, 'input', this.value);
    }
  }

  updated(_changedProperties) {
    super.updated(_changedProperties);
    if (_changedProperties.has('value')) {
      if (this.value != null && this.value.toString() === 'true') {
        this.checked = true;
      } else {
        this.checked = false;
      }
    }
  }

  render() {
    const classes = {
      skeleton: this.skeleton,
      disabled: this.disabled,
      small: this.small,
      switch: true,
    };

    return html`
      <div class="container">
        ${this.label || this.description
          ? html`<div class="${classMap({ labels: true, skeleton: this.skeleton })}">
              ${this.label ? html`<label class="switch-title">${this.label}</label>` : ''}
              ${this.description ? html`<label class="switch-description" .innerHTML="${this.description}"></label>` : ''}
            </div>`
          : ''}
        <div class="switch-container">
          <div class=${classMap(classes)}>
            <input
              id=${this._id}
              type="checkbox"
              .title=${ifDefined(this.label || this.description)}
              ?disabled=${this.disabled || this.skeleton}
              ?readonly="${this.readonly}"
              ?checked=${this.checked}
              @input=${this._onInput}
            />
            <label class="switch-label" for="${this._id}"></label>
          </div>
        </div>
      </div>
    `;
  }
}

window.customElements.define('gv-switch', GvSwitch);
