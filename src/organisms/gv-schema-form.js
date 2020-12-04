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
import { LitElement, html, css } from 'lit-element';
import { get, set } from 'object-path';
import { dispatchCustomEvent } from '../lib/events';
import { deepClone } from '../lib/utils';
import { classMap } from 'lit-html/directives/class-map';
import { Validator } from 'jsonschema';
import './gv-schema-form-control';

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
 * @attr {Boolean} validate - to force validation on first render
 */
export class GvSchemaForm extends LitElement {

  static get properties () {
    return {
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
      validate: { type: Boolean },
      _touch: { type: Boolean },
    };
  }

  constructor () {
    super();
    this.hideDeprecated = false;
    this._values = {};
    this.submitLabel = 'Ok';
    this.hasHeader = false;
    this.hasFooter = false;
    this._touch = false;
    this._validator = new Validator();
    this.addEventListener('gv-schema-form-control:init', this._onInitControl.bind(this));
    this.addEventListener('gv-schema-form-control:change', this._onChange.bind(this));
    this.addEventListener('gv-schema-form-control:autocomplete-ready', this._onAutocompleteReady.bind(this));
  }

  set values (values) {
    if (values) {
      this._initialValues = { ...values };
    }
    else {
      this._initialValues = {};
    }
    this._values = deepClone(this._initialValues);
  }

  get values () {
    return this._values;
  }

  reset () {
    this._values = deepClone(this._initialValues);
    this._touch = false;
    this._setDirty(false);
  }

  _onReset () {
    this.reset();
    dispatchCustomEvent(this, 'reset');
  }

  _onSubmit () {
    this._initialValues = deepClone(this._values);
    this.dirty = false;
    this._touch = false;
    dispatchCustomEvent(this, 'submit', { values: this._values });
  }

  _setDirty (dirty = true) {
    setTimeout(() => (this.dirty = !!dirty), 0);
  }

  _setTouch (touch = true) {
    setTimeout(() => (this._touch = !!touch), 0);
  }

  confirm () {
    if (this._touch) {
      if (this._confirm && this._confirm.promise) {
        return this._confirm.promise;
      }
      const promise = new Promise((resolve, reject) => (this._confirm = { resolve, reject }));
      this._confirm.promise = promise;
      return promise;
    }
    return Promise.resolve();
  }

  _onConfirm () {
    const { resolve } = this._confirm;
    this._confirm = null;
    this._onReset();
    this.requestUpdate().then(() => {
      resolve();
    });
  }

  _onCancelConfirm () {
    this._values = deepClone(this._values);
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
    this._dispatchChange();
  }

  _dispatchChange () {
    clearTimeout(this._changeTimeout);
    this._changeTimeout = setTimeout(() => {
      dispatchCustomEvent(this, 'change', { target: this, values: this._values });
    });
  }

  _onInitControl ({ detail: { currentTarget, value, control } }) {
    if (control.type === 'integer' && value != null && ((value.trim && value.length > 0) || value.length > 0)) {
      value = parseInt(value, 10);
    }
    set(this._values, currentTarget.id, value);
  }

  _onChange ({ detail: { currentTarget, value, control } }) {
    this._setTouch(true);
    if (control.type === 'integer') {
      if (value != null && ((value.trim && value.length > 0) || value.length > 0)) {
        value = parseInt(value, 10);
      }
      else {
        value = 0;
      }
    }
    set(this._values, currentTarget.id, value);
    this._change();
  }

  _onAutocompleteReady (e) {
    e.stopPropagation();
    e.preventDefault();
    dispatchCustomEvent(this, e.detail.eventName, e.detail);
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
    const keys = this.schema.properties ? Object.keys(this.schema.properties) : [];

    return keys.map((key) => {
      const control = this.schema.properties[key];
      const isRequired = this.schema.required && this.schema.required.includes(key);
      const isDisabled = this.schema.disabled && this.schema.disabled.includes(key);
      const value = get(this._values, key);
      return html`<gv-schema-form-control .id="${key}" 
                                           .errors="${this.errors}"
                                           .control="${control}" 
                                           .value="${value}" 
                                           ?required="${isRequired}" 
                                           ?disabled="${isDisabled}"></gv-schema-form-control>`;

    });
  }

  getControls () {
    return Array.from(this.shadowRoot.querySelectorAll('gv-schema-form-control'));
  }

  getControl (id) {
    return this.shadowRoot.querySelector(`[id="${id}"]`);
  }

  canSubmit () {
    if (this.dirty) {
      const validatorResults = this._validator.validate(this._values, this.schema);
      if (validatorResults.valid) {
        this.errors = [];
      }
      else {
        this.errors = validatorResults.errors;
      }
      return validatorResults.valid;
    }
    return false;
  }

  _updateActions () {
    const submitBtn = this._getSubmitBtn();
    if (submitBtn != null) {
      if (this.canSubmit()) {
        this._getSubmitBtn().removeAttribute('disabled');
      }
      else {
        this._getSubmitBtn().setAttribute('disabled', true);
      }
    }
    const resetBtn = this._getResetBtn();
    if (resetBtn != null) {
      if (this.dirty) {
        resetBtn.removeAttribute('disabled');
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
    if (changedProperties.has('_touch') && changedProperties.size === 1) {
      return false;
    }
    if (changedProperties.has('errors')) {
      this.getControls().forEach((control) => {
        control.errors = this.errors;
      });
      return false;
    }
    return super.shouldUpdate(changedProperties);
  }

  async updated (changedProperties) {
    clearTimeout(this._updateActionsTimeout);
    this._updateActionsTimeout = setTimeout(() => this._updateActions(), 0);
  }

  // async _getUpdateComplete () {
  //   await super._getUpdateComplete();
  //   await Promise.all(this.getControls().map((e) => e.updateComplete));
  // }

  render () {
    return html`<form>
                  <div class="${classMap({ container: true, confirm: this._confirm })}">
                      ${this.hasHeader === true ? html`
                        <div class="header">
                          <div class="${classMap({ title: true, center: this.hasHeader && !this.hasFooter })}"><slot name="title"></slot></div>
                          <div class="left">
                            <slot name="header-left"></slot>
                          </div>
                          ${this.hasFooter === true ? '' : html`<div class="right">
                            <gv-button id="reset" outlined small @gv-button:click="${this._onReset}" icon="general:update" title="Reset"></gv-button>
                            <gv-button id="submit" small @gv-button:click="${this._onSubmit}" icon="code:check" .title="${this.submitLabel}"></gv-button>
                          </div> `}
                        </div>
                      ` : ''}
                    <div class="content">
                      ${this.schema != null ? this._renderPart() : html``}
                    </div>
                    ${this.hasFooter === true ? html`
                    <div class="footer">
                      <div class="left"></div>
                      <div class="right">
                        <gv-button id="reset" outlined @gv-button:click="${this._onReset}" icon="general:update" title="Reset">Reset</gv-button>
                        <gv-button id="submit" @gv-button:click="${this._onSubmit}" icon="code:check" .title="${this.submitLabel}">${this.submitLabel}</gv-button>
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

        .content > gv-schema-form-control {
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
          display: flex;
          justify-content: center;
          padding: 1rem;
          border-top: 1px solid #D9D9D9;
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
