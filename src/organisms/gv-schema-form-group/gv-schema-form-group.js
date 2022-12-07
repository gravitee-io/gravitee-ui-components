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
import { LitElement, html, css } from 'lit';
import { get, set, del } from 'object-path';
import { dispatchCustomEvent } from '../../lib/events';
import { deepClone, deepEqual } from '../../lib/utils';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { Validator } from 'jsonschema';
import { empty } from '../../styles/empty';
import '../gv-schema-form-control';

/**
 * Schema form group component
 * Create a form (without submit and cancel button) with a schema and work with Angular
 *
 * @fires gv-schema-form-group:error - event when user touch invalid form
 * @fires gv-schema-form-group:change - event when when form change
 *
 * @attr {Object} schema - the schema form configuration
 * @attr {Object} value - the value of fields
 * @attr {Object} errors - the map of errors by input key
 * @attr {Boolean} validate - to force validation on first render
 * @attr {Boolean} readonly - true if readonly
 * @attr {Boolean} scrollable - useful for making content scrollable with fixed headers / footers
 *
 * @cssprop {Color} [--gv-schema-form-group--bgc=#ffffff] - Background color
 * @cssprop {Length} [--gv-schema-form-group-control--m=0.4rem] - Control margin
 */
export class GvSchemaFormGroup extends LitElement {
  static get properties() {
    return {
      schema: { type: Object },
      errors: { type: Object },
      value: { type: Object },
      _confirm: { type: Object },
      _value: { type: Object, attribute: false },
      dirty: { type: Boolean, reflect: true },
      hideDeprecated: { type: Boolean, attribute: 'hide-deprecated' },
      _validatorResults: { type: Object },
      skeleton: { type: Boolean, reflect: true },
      _touch: { type: Boolean },
      readonly: { type: Boolean, reflect: true },
      scrollable: { type: Boolean, reflect: true },
      groups: { type: Array },
    };
  }

  constructor() {
    super();
    this.hideDeprecated = false;
    this._value = {};
    this._touch = false;
    this._validator = new Validator();
    this._validatorResults = {};
    this._ignoreProperties = [];
    this._dynamicControls = [];
    this._dynamicAttributes = ['disabled', 'required', 'hidden'];
    this.groups = null;
    this.addEventListener('gv-schema-form-control:default-value', this._onDefaultValue.bind(this));
    this.addEventListener('gv-schema-form-control:change', this._onChange.bind(this));
    this.addEventListener('gv-schema-form-control:control-ready', this._onControlReady.bind(this));
  }

  set value(value) {
    if (!deepEqual(this._value, value)) {
      if (value) {
        this._initialValue = { ...value };
      } else {
        this._initialValue = {};
      }
      this._value = deepClone(this._initialValue);
    }
  }

  get value() {
    return this._value;
  }

  reset(value = null) {
    this._value = deepClone(value || this._initialValue);
    this._touch = false;
    this._setDirty(false);
    this.getControls().forEach((s) => {
      s.requestUpdate();
    });
  }

  _onReset() {
    this.reset();
    dispatchCustomEvent(this, 'reset');
  }

  requestValidation() {
    clearTimeout(this._validateTimeout);
    this._validateTimeout = setTimeout(() => {
      this.validate();
    }, 350);
  }

  _setDirty(dirty = true) {
    this.dirty = !!dirty;
  }

  _setTouch(touch = true) {
    this._touch = !!touch;
  }

  confirm(force = false) {
    if (this.isTouch() || force) {
      if (this._confirm && this._confirm.promise) {
        return this._confirm.promise;
      }
      const promise = new Promise((resolve, reject) => (this._confirm = { resolve, reject }));
      this._confirm.promise = promise;
      return promise;
    }
    return Promise.resolve();
  }

  _onConfirmReset() {
    const { resolve } = this._confirm;
    this._confirm = null;
    this._onReset();
    this.requestUpdate();
    this.updateComplete.then(() => {
      resolve(this);
    });
  }

  _onConfirmEdit() {
    this._confirm.reject(this);
    this._confirm = null;
    this._updateChildren();
  }

  _dispatchChange() {
    clearTimeout(this._changeTimeout);
    this._changeTimeout = setTimeout(() => {
      dispatchCustomEvent(this, 'change', { target: this, value: this._value, validation: this._validatorResults });
    }, 50);
  }

  _onDefaultValue({ detail: { currentTarget, value, control } }) {
    if (control.type === 'integer' && value != null && ((value.trim && value.length > 0) || value.length > 0)) {
      value = parseInt(value, 10);
    }
    set(this._value, currentTarget.id, value);
  }

  _onChange({ detail: { currentTarget, value, control } }) {
    this._setTouch(true);
    if (control.type === 'integer') {
      if (typeof value === 'string' && value.trim().length === 0) {
        value = null;
      } else {
        const intValue = Number(value).valueOf();
        if (!isNaN(intValue)) {
          value = intValue;
        } else {
          value = null;
        }
      }
    } else if (control.type === 'array' && value.length === 0) {
      // For an array of complex objects it's possible that the sub objects have required fields,
      // the null allows validation
      value = control.enum || control.items.enum ? [] : null;
    } else if (control.type === 'string' && value.trim().length === 0 && !control.enum) {
      value = null;
    } else if (control.type === 'object') {
      if (Object.keys(value).length === 0) {
        value = null;
      }
    }
    if (value == null) {
      del(this._value, currentTarget.id);
    } else {
      set(this._value, currentTarget.id, value);
    }

    this._updateDynamicControls();
    this.validate();
    this.dirty = true;
    this._dispatchChange();
  }

  _onControlReady(e) {
    e.stopPropagation();
    e.preventDefault();
    const controlElement = e.detail.control;
    const control = controlElement.control;
    if (control['x-schema-form']) {
      if (control['x-schema-form'].event) {
        const event = control['x-schema-form'].event;
        dispatchCustomEvent(this, event.name, { ...event, ...e.detail });
      } else if (this._hasCondition(control)) {
        this._dynamicControls.push(controlElement);
        this._updateDynamicControl(controlElement);
      }
    }
  }

  _updateDynamicControls() {
    this._ignoreProperties = [];
    this._dynamicControls.forEach((controlElement) => {
      this._updateDynamicControl(controlElement);
    });
  }

  _updateDynamicControl(controlElement) {
    const control = controlElement.control;
    if (control['x-schema-form']) {
      this._dynamicAttributes.forEach((attribute) => {
        const is = this._evaluateCondition(control, attribute);
        if (is) {
          controlElement.setAttribute(attribute, '');
          if (attribute === 'hidden') {
            this._ignoreProperties.push(controlElement.id);
          }
        } else {
          controlElement.removeAttribute(attribute);
        }
      });
    }
    return null;
  }

  async performUpdate() {
    await Promise.all(this.getControls().map((e) => e.updateComplete));
    this.getControls().forEach((s) => {
      s.requestUpdate();
    });
    super.performUpdate();
  }

  _renderControl(key) {
    // This is require to clean cache of <gv-schema-form-control>
    const control = { ...this.schema.properties[key] };
    const isRequired = (this.schema.required && this.schema.required.includes(key)) || this._evaluateCondition(control, 'required');
    const isDisabled = (this.schema.disabled && this.schema.disabled.includes(key)) || this._evaluateCondition(control, 'disabled');
    const isHidden = this._evaluateCondition(control, 'hidden');
    if (isHidden) {
      this._ignoreProperties.push(key);
    }
    const isReadonly = this.readonly || control.readOnly === true;
    const isWriteOnly = control.writeOnly === true;
    const value = get(this._value, key);
    return html`<gv-schema-form-control
      .id="${key}"
      .errors="${this.errors}"
      .control="${control}"
      .skeleton="${this.skeleton}"
      .value="${value}"
      ?readonly="${isReadonly}"
      ?writeonly="${isWriteOnly}"
      ?required="${isRequired}"
      ?disabled="${isDisabled}"
      ?hidden="${isHidden}"
    ></gv-schema-form-control>`;
  }

  _hasCondition(control) {
    if (control['x-schema-form']) {
      return this._dynamicAttributes.find((condition) => control['x-schema-form'][condition] != null) != null;
    }
    return false;
  }

  _evaluateCondition(control, conditionKey) {
    if (control['x-schema-form'] == null || control['x-schema-form'][conditionKey] == null) {
      return false;
    }
    const condition = control['x-schema-form'][conditionKey];
    if (typeof condition === 'boolean') {
      return condition;
    }
    if (!Array.isArray(condition)) {
      // condition isn't an array, ignore the condition
      console.warn(`'${conditionKey}' attribute of 'x-schema-form' should be an array`);
      return false;
    }

    let result = true;
    for (const operation of condition) {
      // operation only have one operator with a single object containing operand value
      const operator = Object.keys(operation)[0];

      switch (operator) {
        case '$neq':
          result = result && this._evaluateNotEqualsCondition(control, operation);
          break;
        case '$eq':
          result = result && this._evaluateEqualsCondition(control, operation);
          break;
        case '$nodef':
          result = result && this._evaluateNotDefCondition(control, operation);
          break;
        case '$def':
          result = result && this._evaluateDefCondition(control, operation);
          break;
        default:
          console.warn(`Unsupported operator '${operator}' on disable condition`);
          result = false;
          break;
      }
    }

    return result;
  }

  _evaluateNotEqualsCondition(control, condition) {
    return !this._evaluateEqualsCondition(control, condition);
  }

  _evaluateEqualsCondition(control, condition) {
    const operator = Object.keys(condition)[0];
    const operands = condition[operator];
    const modelAttributes = Object.keys(operands);
    return modelAttributes
      .map((modelAttribute) => {
        const testValue = operands[modelAttribute];
        let value = get(this._value, modelAttribute);
        if (value == null && control.type === 'string') {
          value = '';
        }
        if (Array.isArray(testValue)) {
          return testValue.includes(value);
        }
        return value === testValue;
      })
      .reduce((acc, current) => acc || current);
  }

  _evaluateNotDefCondition(control, condition) {
    const operator = Object.keys(condition)[0];
    const modelAttribute = condition[operator];
    return get(this._value, modelAttribute) === undefined || get(this._value, modelAttribute) === null;
  }

  _evaluateDefCondition(control, condition) {
    return !this._evaluateNotDefCondition(control, condition);
  }

  _renderPart() {
    if (this._confirm) {
      return html`<div class="confirm-box">
        <div class="error">The configuration is not valid and cannot be saved.</div>
        <div class="confirm-box_actions">
          <gv-button @gv-button:click="${this._onConfirmReset}" outlined icon="general:update" danger>Lose changes</gv-button>
          <gv-button @gv-button:click="${this._onConfirmEdit}" icon="design:edit">Edit</gv-button>
        </div>
      </div>`;
    }
    const keys = this.schema.properties ? Object.keys(this.schema.properties) : [];
    this._ignoreProperties = [];

    if (this.groups) {
      // Remove undefined group items
      const groupsCleaned = this.groups.reduce((prev, group) => {
        const itemsExistingInSchemaKeys = keys.filter((key) => [...(group.items || [])].includes(key));
        prev.push({
          ...group,
          items: itemsExistingInSchemaKeys || [],
        });
        return prev;
      }, []);

      // Add non grouped items inside default group
      const defaultGroup = groupsCleaned.find((g) => g.default) || { default: true, items: [] };
      const zipGroupedItems = groupsCleaned.reduce((prev, group) => [...prev, ...group.items], []);
      defaultGroup.items = keys.filter((key) => !zipGroupedItems.includes(key));

      return repeat(
        groupsCleaned,
        (group) =>
          html`${group.name
            ? html`<h2 class="group-title">${group.name}</h2>
                ${repeat(group.items, (key) => this._renderControl(key))}`
            : repeat(group.items, (key) => this._renderControl(key))} `,
      );
    }

    return html`${repeat([1], () =>
      repeat(
        keys,
        (key) => key,
        (key) => this._renderControl(key),
      ),
    )}`;
  }

  getControls() {
    return Array.from(this.shadowRoot.querySelectorAll('gv-schema-form-control'));
  }

  getControl(id) {
    return this.shadowRoot.querySelector(`[id="${id}"]`);
  }

  _getErrors() {
    return (this._validatorResults.errors || []).filter((error) => {
      let id = `${error.property.replace('instance.', '')}`;
      if (!Array.isArray(error.argument)) {
        id = `${id}.${error.argument}`;
      }

      const errorKey = `x-schema-form.errors.${id}.${error.name}`;
      const errorMessage = get(this.schema, errorKey);
      if (errorMessage) {
        error.message = errorMessage;
      }
      return !this._ignoreProperties.includes(id);
    });
  }

  validate() {
    if (this.schema) {
      // Additional properties should not block the validation of the form
      this._validatorResults = this._validator.validate(this._value, { ...this.schema, additionalProperties: {} });
      this.errors = this._getErrors();
    } else {
      this._validatorResults = {};
    }

    dispatchCustomEvent(this, 'error', this._validatorResults.valid ? null : this._validatorResults.errors);
  }

  isValid() {
    if (this._validatorResults.valid) {
      return true;
    }
    return this._getErrors().length === 0;
  }

  isTouch() {
    return this._touch || this.dirty;
  }

  _updateChildren(withValidation) {
    if (withValidation) {
      this._validatorResults = {};
      this.errors = null;
      this.requestValidation();
    }
  }

  firstUpdated() {
    this.validate();
  }

  async updated(changedProperties) {
    if (changedProperties.has('_value')) {
      this.getControls().forEach((control) => {
        control.value = get(this._value, control.id);
      });
    }
    this._updateChildren(changedProperties.has('_value') || changedProperties.has('schema'));
  }

  async getUpdateComplete() {
    const result = await super.getUpdateComplete();
    await Promise.all(this.getControls().map((e) => e.updateComplete));
    return result;
  }

  render() {
    return html`
      <div class="${classMap({ container: true, confirm: this._confirm })}">
        <div class="content">${this.schema != null ? this._renderPart() : html``}</div>
      </div>
    `;
  }

  static get styles() {
    return [
      empty,
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          margin: 0.2rem;
          --bgc: var(--gv-schema-form--bgc, #ffffff);
        }

        form {
          display: flex;
          flex-direction: column;
        }

        form.scrollable {
          position: absolute;
          width: 100%;
          top: 0;
          bottom: 0;
          left: 0;
        }

        .container {
          flex-grow: 1;

          background-color: var(--bgc);
          display: flex;
          flex-direction: column;

          /* for Firefox */
          min-height: 0;
        }

        .header,
        .footer,
        .content {
          background-color: var(--bgc);
        }

        .content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          align-self: center;
          width: 100%;

          /* for Firefox */
          min-height: 0;

          /* add padding when save bar is open */
          padding-bottom: var(--gv-policy-studio--pb);
        }

        .content > gv-schema-form-control {
          align-self: center;
          width: 100%;
        }

        form.scrollable .content {
          overflow: auto;
        }

        form.scrollable .content > gv-schema-form-control,
        form.scrollable .content > .group-title {
          max-width: 775px;
          width: 95%;
        }

        .header,
        .footer {
          display: flex;
          box-sizing: border-box;
          min-height: 45px;
          --gv-icon--s: 26px;
          --gv-icon--c: #bfbfbf;
          align-items: center;
          padding: 0 0.5rem;
          position: relative;
        }

        .header {
          border-bottom: 1px solid #d9d9d9;
        }

        .footer {
          display: flex;
          justify-content: space-between;
          padding: 1rem;
          border-top: 1px solid #d9d9d9;
        }

        form.scrollable .footer {
          justify-content: center;
        }

        .footer .left,
        .footer .right {
          max-width: 400px;
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
          color: #28444f;
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

        .confirm .header .left,
        .confirm .header .right,
        .confirm .footer .left,
        .confirm .footer .right {
          display: none;
        }

        .group-title {
          align-self: center;
          width: 100%;
          color: var(--gv-theme-font-color-dark);
          font-size: 21px;
          font-weight: 600;
          padding-bottom: 0.3em;
          border-bottom: 1px solid var(--gv-theme-font-color-dark);
          margin-top: 24px;
          margin-bottom: 16px;
        }
      `,
    ];
  }
}

window.customElements.define('gv-schema-form-group', GvSchemaFormGroup);
