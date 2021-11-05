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

export function InputElement(ParentClass) {
  /**
   * @mixinClass
   */
  return class extends ParentClass {
    static get properties() {
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
        description: { type: String },
        autofocus: { type: Boolean },
        invalid: { type: Boolean, reflect: true },
        valid: { type: Boolean, reflect: true },
      };
    }

    static get styles() {
      return [
        // language=CSS
        css`
          :host {
            box-sizing: border-box;
            margin: 0.2rem;
            display: block;
          }

          :host([invalid]) :not(.clipboard) input,
          :host([invalid]) :not(.clipboard) ::slotted(.input),
          :host([invalid]) :not(.clipboard) .box-icon-left,
          :host([invalid]) :not(.clipboard) textarea,
          :host([invalid]) :not(.clipboard) select {
            box-shadow: inset 3px 0 0 var(--gv-input-invalid--bxshc, var(--gv-theme-color-error, #da1a1b));
          }

          :host([readonly]) :not(.clipboard) input,
          :host([readonly]) :not(.clipboard) ::slotted(.input),
          :host([readonly]) .textarea :host([readonly]) :not(.clipboard) select {
            border-left: 1px solid var(--gv-input--bdc, var(--gv-theme-neutral-color-dark, #d9d9d9));
          }

          :host([readonly]) input::placeholder {
            color: transparent;
          }
        `,
      ];
    }

    constructor() {
      super();
      this._id = `gv-input-${new Date().getTime()}`;
      this.valid = true;
      this.invalid = false;
    }

    updateState(value) {
      if (this.required && !this.readonly) {
        this.setValidity(value == null || value.length === 0 || (typeof value === 'string' && value.trim() === ''), 'field is required');
      } else {
        this.setValidity();
      }
    }

    setValidity(isInvalid = false, violation = '') {
      const element = this.getInputElement();
      if (element) {
        if (isInvalid) {
          if (violation == null || violation.trim() === '') {
            violation = 'field is not valid';
          }
          element.setCustomValidity(violation);
        } else {
          element.setCustomValidity('');
        }
      }
      this.invalid = isInvalid;
      this.valid = !this.invalid;
    }

    firstUpdated() {
      if (this.autofocus) {
        const input = this.getInputElement();
        if (input != null) {
          this.getInputElement().focus();
        }
      }
      this.updateState(this.value);
    }

    updated(changedProperties) {
      if (changedProperties.has('value')) {
        this.updateState(this.value);
      }
    }

    getInputElement() {
      return this.shadowRoot.querySelector('input');
    }

    get offsetHeight() {
      if (this.description != null) {
        const element = this.shadowRoot.querySelector('.description');
        if (element != null) {
          return super.offsetHeight - element.offsetHeight;
        }
      }
      return super.offsetHeight;
    }

    renderLabel() {
      if (this.label) {
        return html`<label for=${this.id} title="${this.label}">${this.label}</label>`;
      }
      return '';
    }
  };
}
