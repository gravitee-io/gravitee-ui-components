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

            :host([invalid]) input, :host([invalid]) .box-icon-left, :host([invalid]) textarea {
                border-left: 3px solid #a94442;
            }

            :host([valid]) input, :host([valid]) .box-icon-left, :host([valid]) textarea {
                border-left: 3px solid var(--gv-theme-color, #009B5B);
            }
        `,
      ];
    }

    constructor () {
      super();
      this._id = 'gv-id';
    }

    updateState () {
      if (this.required) {
        this.invalid = this.value == null || this.value.trim() === '';
        this.valid = !(this.value == null || this.value.trim() === '');
      }
    }

    firstUpdated (changedProperties) {
      if (this.autofocus) {
        this.getInputElement().focus();
      }
      this.updateState();
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
