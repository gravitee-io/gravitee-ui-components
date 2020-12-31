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
import { css, LitElement } from 'lit-element';
import { html } from 'lit-html';
import { dispatchCustomEvent } from '../lib/events';
import '../atoms/gv-input';
import '../atoms/gv-input-message';
import '../atoms/gv-select';
import '../atoms/gv-switch';
import '../molecules/gv-code';
import '../molecules/gv-expression-language';
import '../atoms/gv-autocomplete';
import '../organisms/gv-schema-form-array';
import '../organisms/gv-schema-form-control-object';
import { isCodemirror } from '../lib/schema-form';

export class GvSchemaFormControl extends LitElement {

  static get properties () {
    return {
      type: { type: String },
      id: { type: String, reflect: true },
      name: { type: String, reflect: true },
      required: { type: Boolean, reflect: true },
      disabled: { type: Boolean, reflect: true },
      title: { type: String, reflect: true },
      pattern: { type: String },
      control: { type: Object },
      errors: { type: Array },
      value: { type: Object, reflect: true },
      skeleton: { type: Boolean, reflect: true },
    };
  }

  isExpressionLanguage () {
    return this.control['x-schema-form'] && this.control['x-schema-form']['expression-language'] != null;
  }

  isPassword () {
    return this.control['x-schema-form'] && this.control['x-schema-form'].type != null && this.control['x-schema-form'].type === 'password';
  }

  isCodemirror () {
    return isCodemirror(this.control);
  }

  isAutocomplete () {
    return this.control['x-schema-form'] && this.control['x-schema-form'].event != null;
  }

  getElementName () {
    if (this.control.type === 'object') {
      return 'gv-schema-form-control-object';
    }
    if ((this.control.enum || (this.control.items && this.control.items.enum)) && !this.isAutocomplete()) {
      return 'gv-select';
    }
    else if (this.isComplexArray()) {
      return 'gv-schema-form-array';
    }
    else if (this.control.type === 'array') {
      return 'gv-button';
    }
    else if (this.control.type === 'boolean') {
      return 'gv-switch';
    }
    else if (this.isExpressionLanguage()) {
      return 'gv-expression-language';
    }
    else if (this.isCodemirror()) {
      return 'gv-code';
    }
    return 'gv-input';
  }

  isComplexArray () {
    return this.control.type === 'array' && !this.control.items.enum;
  }

  _renderControl () {
    const elementName = this.getElementName();
    const element = document.createElement(elementName);
    element.skeleton = this.skeleton;
    element.id = this.id;
    element.name = this.id;
    element.classList.add('form__control');

    if (this.value != null) {
      this._setValue(element);
    }
    if (this.value == null && this.control.default != null) {
      this.value = this.control.default;
      dispatchCustomEvent(this, 'default-value', { value: this.value, currentTarget: element, control: this.control });
    }
    if (this.value != null) {
      this._setValue(element);
    }

    if (this.control.type === 'object') {
      element.schema = this.control;
    }
    else if (this.isComplexArray()) {
      element.schema = this.control.items;
    }
    if (this.required != null) {
      element.required = this.required;
    }
    if (this.disabled != null) {
      element.disabled = this.disabled;
    }
    if (this.control.title) {
      element.label = this.control.title;
      element.title = this.control.title;
    }
    else {
      const tmp = this.id.split('.');
      const title = tmp[tmp.length - 1];
      if (isNaN(parseInt(title, 10))) {
        element.label = title;
        element.title = title;
      }
    }

    if (this.control.pattern) {
      element.pattern = this.control.pattern;
    }

    if (this.control.type === 'integer') {
      element.type = 'number';
    }

    if (this.control.enum || (this.control.items && this.control.items.enum)) {
      if (this.control['x-schema-form'] && this.control['x-schema-form'].titleMap) {
        element.options = this.control.enum.map((value) => ({
          value,
          label: this.control['x-schema-form'].titleMap[value] || value,
        }));
      }
      else {
        element.options = this.control.enum || this.control.items.enum;
      }
      if (this.control.type === 'array') {
        element.multiple = true;
      }
    }
    else if (this.isCodemirror()) {
      element.options = this.control['x-schema-form'].codemirrorOptions;
      if (this.control.default != null && element.options.value == null) {
        element.options.value = this.control.default;
      }
      if (this.control.description != null) {
        element.options.placeholder = this.control.description;
      }
    }
    else if (this.isExpressionLanguage()) {
      element.options = {};
      element.rows = 1;
      if (this.control.description != null) {
        element.options.placeholder = this.control.description;
      }
    }
    else if (this.isPassword()) {
      element.type = 'password';
    }

    if (this.control.description) {
      if (this.control.type === 'boolean') {
        element.description = this.control.description;
      }
      else {
        element.placeholder = this.control.description;
      }
    }

    element.addEventListener(`${elementName}:input`, this._onInput.bind(this));

    if (this.isAutocomplete()) {
      const autocomplete = document.createElement('gv-autocomplete');
      autocomplete.minChars = 0;
      autocomplete.filter = true;
      element.clearable = true;
      autocomplete.id = this.id;
      autocomplete.appendChild(element);
      autocomplete.addEventListener(`gv-autocomplete:select`, this._onInput.bind(this));
      const name = this.control['x-schema-form'].event.name;
      element.addEventListener(`gv-input:clear`, this._onInput.bind(this));
      dispatchCustomEvent(this, 'autocomplete-ready', {
        ...this.control['x-schema-form'].event,
        currentTarget: autocomplete,
        eventName: name,
        control: this.control,
      });
      return autocomplete;
    }
    else {
      return element;
    }

  }

  _onInput (e) {
    e.preventDefault();
    e.stopPropagation();
    let value = null;
    if (e.target.tagName === 'GV-AUTOCOMPLETE') {
      value = e.detail.value;
    }
    else {
      value = e.detail;
    }
    dispatchCustomEvent(this, 'change', { value, currentTarget: e.target, control: this.control });
  }

  getControls () {
    return [
      ...Array.from(this.shadowRoot.querySelectorAll('gv-schema-form-control')),
      ...Array.from(this.shadowRoot.querySelectorAll('gv-schema-form-control-array')),
      ...Array.from(this.shadowRoot.querySelectorAll('gv-schema-form-control-object')),
    ];
  }

  getControl (id) {
    if (id == null) {
      id = this.id;
    }
    return this.shadowRoot.querySelector(`[id="${id}"]`);
  }

  _setValue (controlElement) {
    if (this.value != null && controlElement != null) {
      if (this.control.type === 'boolean' || this.control.type === 'array' || this.control.type === 'object') {
        controlElement.value = this.value;
      }
      else {
        controlElement.value = this.value.toString ? this.value.toString() : this.value;
      }
    }
    return controlElement;
  }

  async updated (changedProperties) {
    if (changedProperties.has('value')) {
      Promise.all(this.getControls().map((control) => control.updateComplete)).then(() => {
        this._setValue(this.getControl());
      });
    }
  }

  async _getUpdateComplete () {
    await super._getUpdateComplete();
    await Promise.all(this.getControls().map((e) => e.updateComplete));
  }

  shouldUpdate (changedProperties) {
    if (changedProperties.has('errors')) {
      // Set errors to complex controls
      this.getControls().forEach((control) => {
        control.errors = this.errors;
      });

      // Find simple controls and append error message
      const errorContainer = this.shadowRoot.querySelectorAll('.form__control-error');
      errorContainer.forEach((container) => (container.innerHTML = ''));
      this.errors.forEach((error) => {
        const key = error.property === 'instance' ? error.argument : error.property.replace('instance.', '');
        const errorContainer = this.shadowRoot.querySelector(`[id="${key}-error"]`);
        if (errorContainer) {
          const message = document.createElement('gv-input-message');
          message.innerHTML = error.message;
          message.level = 'warn';
          errorContainer.appendChild(message);
        }
      });
      return false;
    }
    return super.shouldUpdate(changedProperties);
  }

  render () {
    return html`
        ${this._renderControl()}
        <div class="form__control-error" id="${this.id + '-error'}"></div>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`

        :host {
          box-sizing: border-box;
          margin: 0.4rem;
          display: block;
        }

        .form__control-description, .form__control-error {
          font-size: 12px;
        }

        .form__control-description {
          margin: 0 0.5rem;
        }

        .form__control-label {
          display: flex;
          flex-direction: row;
          border-bottom: 1px solid #D9D9D9;
        }

        label {
          margin: 0.2rem;
        }

        .form__control-label label {
          flex: 1;
          text-transform: capitalize;
        }

        .form__control-array, .form__control-object {
          display: flex;
          flex-direction: column;
        }

        .form__control-enum {
          display: flex;
          /*align-items: flex-end;*/
        }

        .form__control-array gv-button {
          align-self: flex-end;
        }

        .form__control {
          position: relative;
        }

        .form_control-inline {
          display: flex;
          flex-direction: row;
          margin: 0;
        }

        .form_control-inline > * {
          flex: 1;
        }

        .content > .form_control-inline > * {
          margin-left: 0;
        }

        .content > .form_control-inline > *:last-child {
          margin-right: 0;
        }

        gv-select, gv-input, gv-code, gv-switch, gv-expression-language {
          width: 100%;
          margin: 0.2rem 0;
        }

        gv-select:hover, gv-autocomplete:hover {
          z-index: 70;
        }
      `,
    ];
  }

}

window.customElements.define('gv-schema-form-control', GvSchemaFormControl);
