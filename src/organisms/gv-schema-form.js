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
import { css, LitElement, html } from 'lit-element';
import { get, set, del, empty, push } from 'object-path';

import '../atoms/gv-input';
import '../atoms/gv-select';
import '../atoms/gv-switch';
import '../molecules/gv-code';
import '../atoms/gv-autocomplete';
import { dispatchCustomEvent } from '../lib/events';
import { deepClone, flatObject } from '../lib/utils';
import { classMap } from 'lit-html/directives/class-map';

/**
 * Schema form component
 *
 * @fires gv-schema-form:submit - event when user submit form
 * @fires gv-schema-form:change - event when when form change
 * @fires gv-schema-form:cancel - event when user cancel form
 *
 * @attr {Object} schema - the schema form configuration
 * @attr {Object} values - the values of fields
 * @attr {Object} errors - the map of errors by input key
 */
export class GvSchemaForm extends LitElement {

  static get properties () {
    return {
      title: { type: String },
      icon: { type: String },
      schema: { type: Object },
      errors: { type: Object },
      values: { type: Object },
      submitLabel: { type: String },
      hasFooter: { type: Boolean, attribute: 'has-footer' },
      hasHeader: { type: Boolean, attribute: 'has-header' },
      _confirm: { type: Object },
      _values: { type: Object, attribute: false },
      dirty: { type: Boolean, reflect: true },
      hideDeprecated: { type: Boolean, attribute: 'hide-deprecated' },
    };
  }

  constructor () {
    super();
    this.hideDeprecated = true;
    this._values = {};
    this.submitLabel = 'Ok';
    this.hasHeader = false;
    this.hasFooter = false;
  }

  set values (values) {
    if (values) {
      this._initialValues = { ...values };
      this._formPart = null;
      this.reset();
    }
  }

  get values () {
    return this._values;
  }

  reset () {
    this._formPart = null;
    this._values = deepClone(this._initialValues);
    this._setDirty(false);
  }

  _onSubmit () {
    this._initialValues = deepClone(this._values);
    this.dirty = false;
    dispatchCustomEvent(this, 'submit', { values: this._values });
  }

  _setDirty (dirty = true) {
    setTimeout(() => (this.dirty = !!dirty), 0);
  }

  confirm () {
    if (this._confirm && this._confirm.promise) {
      return this._confirm.promise;
    }
    const promise = new Promise((resolve, reject) => (this._confirm = { resolve, reject }));
    this._confirm.promise = promise;
    return promise;
  }

  _onConfirm () {
    this.reset();
    this._confirm.resolve();
    this._confirm = null;
  }

  _onCancelConfirm () {
    this._confirm.reject();
    this._confirm = null;
  }

  _getSubmitBtn () {
    return this.shadowRoot.querySelector('#submit');
  }

  _getResetBtn () {
    return this.shadowRoot.querySelector('#reset');
  }

  _change () {
    this.dirty = true;
    this._updateActions();
    dispatchCustomEvent(this, 'change', { values: this._values });
  }

  _onChange (key, e) {
    set(this._values, key, e.detail);
    this._change();
  }

  _isCodemirror (control) {
    return control['x-schema-form'] && control['x-schema-form'].type === 'codemirror';
  }

  _isAutocomplete (control) {
    return control['x-schema-form'] && control['x-schema-form'].event != null;
  }

  _getElementName (control) {
    if (control.enum && !this._isAutocomplete(control)) {
      return 'gv-select';
    }
    else if (control.type === 'array') {
      return 'gv-button';
    }
    else if (control.type === 'boolean') {
      return 'gv-switch';
    }
    else if (this._isCodemirror(control)) {
      return 'gv-code';
    }
    return 'gv-input';
  }

  _onRemoveItem (containerId) {
    // Update id's
    const container = this.getElement(containerId);
    let nextContainer = container.nextSibling;
    while (nextContainer) {
      const splittedId = nextContainer.id.split('.');
      const index = parseInt(splittedId[splittedId.length - 1]);
      nextContainer.querySelectorAll('.control')
        .forEach((element) => {
          const splitedId = element.id.split('.');
          const indexOfIndex = splitedId.indexOf(index.toString());
          splitedId[indexOfIndex] = index - 1;
          element.id = splitedId.join('.');
        });
      nextContainer = nextContainer.nextSibling;
    }
    container.remove();
    // Empty value before delete, important for array or object...
    empty(this._values, containerId);
    del(this._values, containerId);
    this._change();
  }

  _onAddItem (key, index, control, parent, isInit, value) {
    if (key == null || index == null) {
      const msg = 'Cannot add item without key and index';
      throw new Error(msg);
    }
    const container = document.createElement('div');
    container.className = 'form__item';

    container.id = `${key}.${index}`;

    const labelContainer = document.createElement('div');
    labelContainer.className = 'form__control form__control-label form__item-label';
    const label = document.createElement('label');
    label.innerHTML = control.items.title || `${name} item`;

    const closeItemBtn = document.createElement('gv-button');
    closeItemBtn.icon = 'general:close';
    closeItemBtn.link = true;
    closeItemBtn.title = `Remove from ${name}`;
    closeItemBtn.addEventListener('gv-button:click', this._onRemoveItem.bind(this, container.id));
    labelContainer.append(label);
    labelContainer.append(closeItemBtn);
    container.append(labelContainer);

    const isRequired = control.items.required;
    const isDisabled = control.items.disabled;
    const element = this._renderControl({
      ...control.items,
      title: null,
    }, value, isRequired, isDisabled, null, container.id);
    container.appendChild(element);
    parent.appendChild(container);
    if (isInit === false) {
      push(this._values, key, control.items.type === 'object' ? {} : '');
      this._change();
    }
  }

  _renderControl (control, value = null, isRequired = false, isDisabled = false, error = null, key, groupContainer = null) {
    if (this.hideDeprecated === true && control.deprecated === 'true') {
      return null;
    }
    const container = document.createElement('div');
    const controlType = control.enum ? 'enum' : control.type;
    container.className = `form__control form__control-${controlType}`;
    if (control.type === 'object') {
      if (control.title) {
        const title = document.createElement('div');
        title.innerHTML = control.title;
        title.title = control.title;
        title.className = 'form__control-group-title';
        container.appendChild(title);
      }
      const keys = Object.keys(control.properties);
      if (keys.length <= 2 && keys.find((key) => this._isCodemirror(control.properties[key])) == null) {
        container.classList.add('form_control-inline');
      }
      keys.forEach((subKey) => {
        const isRequired = control.required && control.required.includes(subKey);
        const isDisabled = control.disabled && control.disabled.includes(subKey);

        const fullKey = key != null ? `${key}.${subKey}` : subKey;
        const error = this.errors && this.errors[key] ? this.errors[key] : null;
        return this._renderControl(control.properties[subKey], value != null ? value[subKey] : null, isRequired, isDisabled, error, fullKey, container);
      });
    }
    else if (!control.enum && control.type === 'array') {
      const row = document.createElement('div');
      row.classList.add('form__item-group-header');
      const label = document.createElement('label');
      label.innerHTML = control.title || '';
      row.appendChild(label);
      const btn = document.createElement('gv-button');
      btn.icon = 'code:plus';
      btn.innerHTML = 'Add';
      btn.title = `Add to ${key}`;
      btn.outlined = true;
      btn.small = true;
      btn.addEventListener('gv-button:click', () => {
        const index = container.querySelectorAll('.form__item').length;
        this._onAddItem(key, index, control, container);
      });
      row.appendChild(btn);
      container.appendChild(row);
      container.classList.add('form__item-group');
      container.id = key;
    }
    else {
      if (value == null) {
        value = get(this._values, key);
        if (value == null && control.default != null) {
          value = control.default;
          set(this._values, key, value);
          dispatchCustomEvent(this, 'change', { values: this._values });
        }
      }
      const elementName = this._getElementName(control);
      const element = document.createElement(elementName);
      element.id = key;
      element.name = key;
      element.classList.add('control');

      if (isRequired) {
        element.required = isRequired;
      }
      if (isDisabled) {
        element.disabled = isDisabled;
      }
      if (control.title) {
        element.label = control.title;
        element.title = control.title;
      }

      if (control.pattern) {
        element.pattern = control.pattern;
      }

      if (control.type === 'integer') {
        element.type = 'number';
      }

      if (control.enum) {
        element.options = control.enum;
        if (control.type === 'array') {
          element.multiple = true;
        }
      }
      else if (this._isCodemirror(control)) {
        element.options = control['x-schema-form'].codemirrorOptions;
        if (control.default != null && element.options.value == null) {
          element.options.value = control.default;
        }
        if (control.description != null) {
          element.options.placeholder = control.description;
        }
      }

      if (this._isAutocomplete(control)) {
        const name = control['x-schema-form'].event.name;
        const autocomplete = document.createElement('gv-autocomplete');
        autocomplete.minChars = 0;
        autocomplete.filter = true;
        element.clearable = true;
        autocomplete.appendChild(element);
        dispatchCustomEvent(this, name, { element: autocomplete, ...control['x-schema-form'].event });
        container.appendChild(autocomplete);
        autocomplete.addEventListener('gv-autocomplete:select', this._onChange.bind(this, key));
      }
      else {
        container.appendChild(element);
      }

      if (control.enum) {
        if (control.type === 'array') {
          const all = document.createElement('gv-button');
          all.innerHTML = 'clear';
          all.outlined = true;
          container.appendChild(all);
          all.checked = value && value.length === control.enum.length;
          all.addEventListener('gv-button:click', (e) => {
            element.value = [];
            dispatchCustomEvent(element, 'input', element.value);
          });
        }
      }

      if (control.description) {
        if (control.type === 'boolean') {
          element.description = control.description;
        }
        else {
          element.placeholder = control.description;
        }
      }

      if (error) {
        const err = document.createElement('div');
        err.className = 'form__control-error';
        err.innerHTML = error;
        container.appendChild(err);
      }

      if (value != null) {
        setTimeout(() => {
          if (control.type === 'boolean') {
            element.value = value;
          }
          else {
            element.value = value.toString ? value.toString() : value;
          }

        }, 0);
      }
      element.addEventListener(`${elementName}:input`, this._onChange.bind(this, key));

    }

    if (groupContainer) {
      groupContainer.appendChild(container);
      return groupContainer;
    }

    return container;
  }

  _renderPart () {
    if (this._confirm) {
      return html`<div class="confirm-box">
                  <div>The configuration has not been saved and will be lost, are you sure to leave?</div>
                  <div class="confirm-box_actions">
                      <gv-button outlined @gv-button:click="${this._onCancelConfirm}">Cancel</gv-button>
                      <gv-button @gv-button:click="${this._onConfirm}">Ok</gv-button>  
                  </div>
               </div>`;
    }

    if (this._formPart == null) {
      const keys = this.schema.properties ? Object.keys(this.schema.properties) : [];
      return keys.map((key) => {
        const control = this.schema.properties[key];
        const isRequired = this.schema.required && this.schema.required.includes(key);
        const isDisabled = this.schema.disabled && this.schema.disabled.includes(key);
        const error = this.errors && this.errors[key];
        return this._renderControl(control, null, isRequired, isDisabled, error, key);
      });
    }
    return this._formPart;
  }

  getElements () {
    return Array.from(this.shadowRoot.querySelectorAll('.control'));
  }

  getElement (id) {
    return this.shadowRoot.querySelector(`[id="${id}"]`);
  }

  _findOptionalInvalid () {
    return this.getElements().find((element) => {
      if (element.updateState) {
        element.updateState(element.value);
      }
      return element.invalid === true;
    });
  }

  canSubmit () {
    if (this.dirty && (this.errors == null || this.errors.length === 0)) {
      return this._findOptionalInvalid() == null;
    }
    return false;
  }

  _updateActions () {
    const submitBtn = this._getSubmitBtn();
    if (submitBtn != null) {
      if (this.canSubmit()) {
        this._getSubmitBtn().removeAttribute('disabled', true);
      }
      else {
        this._getSubmitBtn().setAttribute('disabled', true);
      }
    }
    const resetBtn = this._getResetBtn();
    if (resetBtn != null) {
      if (this.dirty) {
        resetBtn.removeAttribute('disabled', true);
      }
      else {
        resetBtn.setAttribute('disabled', true);
      }
    }
  }

  shouldUpdate (changedProperties) {
    if (changedProperties.has('dirty') && changedProperties.size === 1) {
      setTimeout(() => this._updateActions(), 0);
      return false;
    }
    return super.shouldUpdate(changedProperties);
  }

  async updated (changedProperties) {
    if (changedProperties.has('_values')) {
      this._updateElementsWithValues();
    }
  }

  async _getUpdateComplete () {
    await super._getUpdateComplete();
    await Promise.all(this.getElements().map((e) => e.updateComplete));
  }

  _updateElementsWithValues () {
    Object.keys(flatObject(this._values)).forEach((key) => {
      const element = this.getElement(key);
      if (element) {
        const value = get(this._values, key);
        if (element.tagName.toLowerCase() === 'div') {
          if (value) {
            const control = get(this.schema.properties, key);
            value.forEach((v, index) => {
              this._onAddItem(key, index, control, element, true, v);
            });
          }
        }
        else {
          element.value = value;
        }

      }
    });
  }

  render () {
    if (this.schema == null) {
      return html``;
    }
    return html`<form>
                  <div class="${classMap({ container: true, confirm: this._confirm })}">
                      ${this.hasHeader === true ? html`
                        <div class="header">
                          <div class="${classMap({ title: true, center: this.hasHeader && !this.hasFooter })}"><slot name="title"></slot></div>
                          <div class="left">
                            <slot name="header-left"></slot>
                          </div>
                          ${this.hasFooter === true ? '' : html`<div class="right">
                            <gv-button id="reset" outlined small @gv-button:click="${this.reset}" disabled icon="general:update" title="Reset"></gv-button>
                            <gv-button id="submit" small @gv-button:click="${this._onSubmit}" disabled icon="code:check" .title="${this.submitLabel}"></gv-button>
                          </div> `}
                        </div>
                      ` : ''}
                    <div class="content">
                      ${this._renderPart()}
                    </div>
                    ${this.hasFooter === true ? html`
                    <div class="footer">
                      <div class="left"></div>
                      <div class="right">
                        <gv-button id="reset" outlined @gv-button:click="${this.reset}" disabled icon="general:update" title="Reset">Reset</gv-button>
                        <gv-button id="submit" @gv-button:click="${this._onSubmit}" disabled icon="code:check" .title="${this.submitLabel}">${this.submitLabel}</gv-button>
                      </div>
                    </div>
                    ` : ''}
                  </div>
                </form>`;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          margin: 0.2rem;
        }

        .form__control-description, .form__control-error {
          font-size: 12px;
          margin: 0 0.5rem;
        }

        .form__control-error {
          color: red;
        }

        .form__item-group {
          padding: 0 0 0.3rem 0;
          position: relative;
          transition: all .3s ease-in-out;
        }

        .form__item-group:hover {
          background-color: #EFEFEF;
        }

        .form__item-group-header:before,
        .form__item-group-header:after {
          content: "";
          position: absolute;
          bottom: 0;
          height: calc(100% - 35px);
          border-left: 3px dotted #D9D9D9;
        }

        .form__item-group-header:before {
          left: 0;
        }

        .form__item-group-header:after {
          right: 0;
        }

        .form__item-group-header {
          display: flex;
          padding-bottom: 0.2rem;
          margin-bottom: 0.2rem;
          align-items: center;
          transition: all .3s ease-in-out;
          background-color: white;
        }

        .form__item-group-header label {
          flex: 1;
          margin: 0;
        }

        .form__item-group-header,
        .form__item-group {
          border-bottom: 1px solid #D9D9D9;
        }

        .form__item {
          border: 1px solid #D9D9D9;
          border-radius: 4px;
          margin: 0.3rem 0.6rem;
          background-color: white;
          transition: all .3s ease-in-out;
          z-index: 500;
        }

        .form__item:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -10px #BFBFBF;
        }

        .form__item-label {
          font-style: italic;
        }

        .form__control {
          margin: 0.5rem;
          display: flex;
        }

        .form__control-label {
          display: flex;
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
          align-items: flex-end;
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

        .form__item .form_control-inline > * {
          margin-left: 0;
        }

        .form__item .form_control-inline > *:first-child {
          margin-left: 0.5rem;
        }

        gv-select, gv-input, gv-code, gv-switch {
          width: 100%;
          margin: 0.2rem 0;
        }

        .form__control-group-title {
          border-bottom: 1px solid #BFBFBF;
          padding: 0.5rem;
        }

        form {
          position: absolute;
          display: flex;
          flex-direction: column;
          width: 100%;
          top: 0;
          bottom: 0;
          left: 0;
        }

        .container {
          flex-grow: 1;

          background-color: #FAFAFA;
          display: flex;
          flex-direction: column;

          /* for Firefox */
          min-height: 0;
        }

        .header,
        .footer,
        .content {
          background-color: #FFFFFF;
        }

        .content {
          flex-grow: 1;

          overflow: auto;

          display: flex;
          flex-direction: column;

          align-self: center;
          width: 100%;

          /* for Firefox */
          min-height: 0;
        }

        .content > .form__control {
          max-width: 775px;
          align-self: center;
          width: 95%;
        }

        .header,
        .footer {
          display: flex;
          box-sizing: border-box;
          min-height: 45px;
          --gv-icon--s: 26px;
          --gv-icon--c: #BFBFBF;
          align-items: center;
          padding: 0 .5rem;
          position: relative;
        }

        .header {
          border-bottom: 1px solid #D9D9D9;
        }

        .footer {
          padding: 1rem;
          border-top: 1px solid #D9D9D9;
        }

        .header .left,
        .footer .left,
        .header .right,
        .footer .right {
          display: flex;
          flex: 1;
          z-index: 10;
          align-items: center;
        }

        .header .right,
        .footer .right {
          justify-content: flex-end;
        }

        .header .title {
          color: #28444F;
          font-size: 18px;
          display: flex;
          width: 100%;
          align-items: center;
        }

        .header .title.center {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          justify-content: center;
        }

        .confirm-box {
          height: 100%;
          padding: 1rem;
          font-style: italic;
          display: flex;
          flex-direction: column;

          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .confirm-box_actions {
          padding: 1rem 0;
        }

        .confirm .header .left, .confirm .header .right,
        .confirm .footer .left, .confirm .footer .right {
          display: none;
        }
      `,
    ];
  }

}

window.customElements.define('gv-schema-form', GvSchemaForm);
