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
import { css, LitElement, html } from 'lit';
import { dispatchCustomEvent } from '../../lib/events';
import '../../atoms/gv-input';
import '../../atoms/gv-input-message';
import '../../atoms/gv-text';
import '../../atoms/gv-select';
import '../../atoms/gv-select-native';
import '../../atoms/gv-switch';
import '../../molecules/gv-code';
import '../../molecules/gv-expression-language';
import '../../molecules/gv-cron-editor';
import '../../atoms/gv-autocomplete';
import '../../organisms/gv-schema-form-array';
import '../../organisms/gv-schema-form-control-object';
import { isCodemirror, isObject, isComplexArray } from '../../lib/schema-form';
import { UpdateAfterBrowser } from '../../mixins/update-after-browser';

export class GvSchemaFormControl extends UpdateAfterBrowser(LitElement) {
  static get properties() {
    return {
      type: { type: String },
      id: { type: String, reflect: true },
      name: { type: String, reflect: true },
      required: { type: Boolean, reflect: true },
      disabled: { type: Boolean, reflect: true },
      readonly: { type: Boolean, reflect: true },
      title: { type: String, reflect: true },
      pattern: { type: String },
      control: { type: Object },
      errors: { type: Array },
      value: { type: Object, reflect: true },
      skeleton: { type: Boolean, reflect: true },
      hidden: { type: Boolean, reflect: true },
      writeOnly: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    // When form has errors, the control is not update to conserve the error state.
    // This list is used to force the update of properties even in error case.
    this._observedProperties = ['disabled', 'readonly', 'required'];
  }

  isExpressionLanguage() {
    return this.control['x-schema-form'] && this.control['x-schema-form']['expression-language'] != null;
  }

  isCronExpression() {
    return this.control['x-schema-form'] && this.control['x-schema-form']['cron-expression'] === true;
  }

  isPassword() {
    return (
      this.control.writeOnly === true ||
      (this.control['x-schema-form'] && this.control['x-schema-form'].type != null && this.control['x-schema-form'].type === 'password')
    );
  }

  getPlaceholder() {
    return this.control['x-schema-form'] && this.control['x-schema-form'].placeholder ? this.control['x-schema-form'].placeholder : null;
  }

  isCodemirror() {
    return isCodemirror(this.control);
  }

  isObject() {
    return isObject(this.control);
  }

  isAutocomplete() {
    return this.control['x-schema-form'] && this.control['x-schema-form'].event != null && this.control.type === 'string';
  }

  isText() {
    return this.control['x-schema-form'] && this.control['x-schema-form'].type === 'text' && this.control.type === 'string';
  }

  getElementName() {
    if (this.isObject()) {
      return 'gv-schema-form-control-object';
    }
    if ((this.control.enum || (this.control.items && this.control.items.enum)) && !this.isAutocomplete()) {
      if (this.control.type === 'array') {
        return 'gv-select';
      }
      return 'gv-select-native';
    } else if (isComplexArray(this.control)) {
      return 'gv-schema-form-array';
    } else if (this.control.type === 'array') {
      return 'gv-button';
    } else if (this.control.type === 'boolean') {
      return 'gv-switch';
    } else if (this.isExpressionLanguage()) {
      return 'gv-expression-language';
    } else if (this.isCodemirror()) {
      return 'gv-code';
    } else if (this.isCronExpression()) {
      return 'gv-cron-editor';
    } else if (this.isText()) {
      return 'gv-text';
    }

    return 'gv-input';
  }

  _updateProperties(element) {
    if (element != null) {
      this._observedProperties.forEach((property) => {
        if (this[property] != null) {
          element[property] = this[property];
        }
      });
    }
  }

  firstUpdated() {
    // Need to update properties after the browser has rendered the element once
    // and so the sub elements. Otherwise, the "state" (disabled, readonly,
    // required) is not forwarded to the sub elements.
    this._updateProperties(this.getControl());
  }

  _renderControl() {
    const elementName = this.getElementName();
    const element = document.createElement(elementName);
    element.id = this.id;
    element.name = this.id;
    element.skeleton = this.skeleton;
    element.classList.add('form__control');
    if (this.value == null && this.control.default != null) {
      this.value = this.control.default;
      dispatchCustomEvent(this, 'default-value', { value: this.value, currentTarget: element, control: this.control });
    }
    if (this.value != null) {
      this._setValue(element);
    }

    if (this.control.type === 'object') {
      element.schema = this.control;
    } else if (isComplexArray(this.control)) {
      element.schema = this.control.items;
    }

    this._updateProperties(element);

    if (this.control.title) {
      element.label = this.control.title;
      element.title = this.control.title;
    } else {
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

    if (this.isText()) {
      element.rows = 3;
      element.autosize = true;
      element.placeholder = this.control.description;
    }

    const placeholder = this.getPlaceholder();

    if (this.control.enum || (this.control.items && this.control.items.enum)) {
      const options = this.control.enum || this.control.items.enum;
      if (this.control['x-schema-form'] && this.control['x-schema-form'].titleMap) {
        element.options = options.map((value) => ({
          value,
          label: this.control['x-schema-form'].titleMap[value] || value,
        }));
      } else {
        element.options = options;
      }
      if (this.control.type === 'array') {
        element.multiple = true;
      }
    } else if (this.isCodemirror()) {
      element.options = this.control['x-schema-form'].codemirrorOptions;
      if (this.control.default != null && element.options.value == null) {
        element.options.value = this.control.default;
      }
    } else if (this.isExpressionLanguage()) {
      element.options = {};
      element.rows = 1;
    } else if (this.isPassword()) {
      element.type = 'password';
    }

    if (this.control.description || this.control.gioConfig?.banner) {
      element.description = this.control.gioConfig?.banner?.text ?? this.control.description;
    }

    if (placeholder != null) {
      if (this.isExpressionLanguage() || this.isCodemirror()) {
        element.options.placeholder = placeholder;
      } else {
        element.placeholder = placeholder;
      }
    }

    element.addEventListener(`${elementName}:input`, this._onInput.bind(this));
    element.addEventListener(`${elementName}:submit`, this._onSubmit.bind(this));

    let currentTarget;
    if (this.isAutocomplete()) {
      const autocomplete = document.createElement('gv-autocomplete');
      autocomplete.minChars = 0;
      autocomplete.filter = true;
      element.clearable = true;
      autocomplete.id = this.id;
      autocomplete.appendChild(element);
      autocomplete.addEventListener(`gv-autocomplete:select`, this._onInput.bind(this));
      element.addEventListener(`gv-input:clear`, this._onInput.bind(this));
      currentTarget = autocomplete;
    } else {
      currentTarget = element;
    }
    if (this.control['x-schema-form'] != null) {
      dispatchCustomEvent(this, 'control-ready', {
        currentTarget,
        control: this,
      });
    }
    return currentTarget;
  }

  _onSubmit(e) {
    e.preventDefault();
    const form = this.closest('form');
    if (form) {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
  }

  _onInput(e) {
    e.preventDefault();
    e.stopPropagation();
    let value;
    if (e.target.tagName === 'GV-AUTOCOMPLETE') {
      value = e.detail.value;
    } else {
      value = e.detail;
    }
    dispatchCustomEvent(this, 'change', { value, currentTarget: e.target, control: this.control });
  }

  getControls() {
    return [
      ...Array.from(this.shadowRoot.querySelectorAll('gv-schema-form-control')),
      ...Array.from(this.shadowRoot.querySelectorAll('gv-schema-form-control-array')),
      ...Array.from(this.shadowRoot.querySelectorAll('gv-schema-form-control-object')),
    ];
  }

  getControl(id) {
    if (id == null) {
      id = this.id;
    }
    return this.shadowRoot.querySelector(`[id="${id}"]`);
  }

  _setValue(controlElement) {
    if (this.value != null && controlElement != null) {
      if (this.control.type === 'boolean' || this.control.type === 'array' || this.control.type === 'object') {
        controlElement.value = this.value;
      } else {
        controlElement.value = this.value.toString ? this.value.toString() : this.value;
      }
    }
    return controlElement;
  }

  async updated(changedProperties) {
    if (changedProperties.has('value')) {
      Promise.all(this.getControls().map((control) => control.updateComplete)).then(() => {
        this._setValue(this.getControl());
      });
    }
  }

  async getUpdateComplete() {
    await super.getUpdateComplete();
    await Promise.all(this.getControls().map((e) => e.updateComplete));
  }

  formatErrorMessage(error) {
    let title;
    if (this.control.properties != null && this.control.properties[error.argument] != null) {
      title = this.control.properties[error.argument].title;
    } else {
      title = this.control.title;
    }
    if (title) {
      return `<span>${error.message.replace(error.argument, title)}</span>`;
    }
    return `<span>${error.message}</span>`;
  }

  shouldUpdate(changedProperties) {
    if (this._observedProperties.find((property) => changedProperties.has(property)) != null) {
      this._updateProperties(this.getControl());
    }

    if (changedProperties.has('errors') && this.errors != null) {
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
          message.innerHTML = this.formatErrorMessage(error);
          message.level = 'warn';
          errorContainer.appendChild(message);
        }
      });
      return false;
    }
    return super.shouldUpdate(changedProperties);
  }

  render() {
    return html`
      ${this._renderControl()}
      <div class="form__control-error" id="${this.id + '-error'}"></div>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          margin: var(--gv-schema-form-control--m, 0.4rem);
          display: block;
        }

        :host([hidden]) {
          visibility: hidden;
          height: 0;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        .form__control-description,
        .form__control-error {
          font-size: 12px;
        }

        .form__control-description {
          opacity: 0.8;
        }

        .form__control-label {
          display: flex;
          flex-direction: row;
          border-bottom: 1px solid #d9d9d9;
        }

        label {
          margin: 0.2rem;
        }

        .form__control-label label {
          flex: 1;
          text-transform: capitalize;
        }

        .form__control-array,
        .form__control-object {
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

        gv-select,
        gv-select-native,
        gv-input,
        gv-code,
        gv-switch,
        gv-expression-language {
          width: 100%;
          margin: 0.2rem 0;
        }

        gv-select:hover,
        gv-select-native:hover,
        gv-autocomplete:hover {
          z-index: 70;
        }

        .error {
          color: var(--gv-theme-color-error, #f44336);
        }

        .warning {
          color: var(--gv-theme-color-warning, #ff9800);
        }
      `,
    ];
  }
}

window.customElements.define('gv-schema-form-control', GvSchemaFormControl);
