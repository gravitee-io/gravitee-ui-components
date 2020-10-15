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
import { css, html } from 'lit-element';

export function InputElement (ParentClass) {

  /**
   * @mixinClass
   */
  return class extends ParentClass {

    static get properties () {
      return {
        disabled: { type: Boolean, reflect: true },
        required: { type: Boolean, reflect: true },
        readonly: { type: Boolean, reflect: true },
        skeleton: { type: Boolean },
        value: { type: String, reflect: true },
        label: { type: String },
        title: { type: String },
        name: { type: String },
        placeholder: { type: String },
        autofocus: { type: Boolean },
        invalid: { type: Boolean, reflect: true },
        valid: { type: Boolean, reflect: true },
      };
    }

    static get styles () {
      return [
        // language=CSS
        css`
            :host {
                box-sizing: border-box;
                margin: 0.2rem;
                display: block;
            }

            :host([invalid]) :not(.clipboard) input, :host([invalid]) :not(.clipboard) .box-icon-left, :host([invalid]) :not(.clipboard) textarea {
                border-left: 3px solid #a94442;
            }

            :host([valid]) :not(.clipboard) input, :host([valid]) :not(.clipboard) .box-icon-left, :host([valid]) :not(.clipboard) textarea {
                border-left: 3px solid var(--gv-theme-color, #5A7684);
            }

            :host([readonly]) :not(.clipboard) input, :host([readonly]) .box-icon-left, :host([readonly]) .textarea {
              border: none;
              border-radius: 0;
              letter-spacing: 0.05rem;
              opacity: 0.7;
              font-weight: 500;
              cursor: text;
            }


            :host([readonly]) input::placeholder {
              color: transparent;
            }

            :host([readonly]) :not(.clipboard) label {
                display: none;
            }
        `,
      ];
    }

    constructor () {
      super();
      this._id = `gv-input-${new Date().getTime()}`;
    }

    updateState (value) {
      if (this.required && !this.readonly) {
        this.invalid = value == null || (typeof value === 'string' && value.trim() === '');
        this.valid = !this.invalid;
      }
    }

    firstUpdated (changedProperties) {
      if (this.autofocus) {
        this.getInputElement().focus();
      }
      this.updateState(this.value);
    }

    updated (changedProperties) {
      if (changedProperties.has('value')) {
        this.updateState(this.value);
      }
    }

    getInputElement () {
      return this.shadowRoot.querySelector('input');
    }

    renderLabel () {
      if (this.label) {
        return html`<label for=${this.id} title="${this.label}">${this.label}</label>
        `;
      }
      return '';
    }

  };

}
