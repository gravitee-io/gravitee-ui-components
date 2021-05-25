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
import { css, html, LitElement } from 'lit';

import { dispatchCustomEvent } from '../lib/events';
import { classMap } from 'lit/directives/class-map';
import { skeleton } from '../styles/skeleton';

/**
 * Schema form array component
 *
 */
export class GvSchemaFormArray extends LitElement {
  static get properties() {
    return {
      schema: { type: Object },
      value: { type: Array },
      id: { type: String, reflect: true },
      title: { type: String, reflect: true },
      skeleton: { type: Boolean, reflect: true },
      errors: { type: Array },
      readonly: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.value = [];
  }

  _onNew() {
    const newValue = this.schema.type === 'object' ? {} : '';
    this.value = [...this.value, newValue];
    dispatchCustomEvent(this, 'input', this.value);
  }

  _onRemove(index) {
    this.value.splice(index, 1, null);
    this.value = this.value.filter((e) => e != null);
    dispatchCustomEvent(this, 'input', this.value);
  }

  _renderValue(value, index) {
    const isRequired = this.schema.required;
    const isDisabled = this.schema.disabled;
    const id = `${this.id}.${index}`;
    const control = { ...this.schema, title: null };
    return html`<div class="form__item" @mouseleave="${this._onMouseLeave}">
      <div class="${classMap({ 'form__item-label': true, skeleton: this.skeleton })}">
        <label>${this.schema.title}</label>
        ${this.readonly !== true
          ? html`<gv-button
              link
              small
              @gv-button:click="${this._onRemove.bind(this, index)}"
              icon="general:close"
              title="Remove"
            ></gv-button>`
          : ''}
      </div>
      <gv-schema-form-control
        .id="${id}"
        .skeleton="${this.skeleton}"
        .control="${control}"
        .value="${value}"
        ?required="${isRequired}"
        ?disabled="${isDisabled}"
        ?readonly="${this.readonly}"
      ></gv-schema-form-control>
    </div> `;
  }

  _onMouseLeave() {
    const select = this.shadowRoot.querySelectorAll(`gv-select`);
    select.forEach((s) => s.close());
  }

  getControls() {
    return [
      ...Array.from(this.shadowRoot.querySelectorAll('gv-schema-form-control')),
      ...Array.from(this.shadowRoot.querySelectorAll('gv-schema-form-control-array')),
      ...Array.from(this.shadowRoot.querySelectorAll('gv-schema-form-control-object')),
    ];
  }

  getControl(id) {
    return this.shadowRoot.querySelector(`[id="${id}"]`);
  }

  async _getUpdateComplete() {
    await super._getUpdateComplete();
    await Promise.all(this.getControls().map((e) => e.updateComplete));
  }

  shouldUpdate(changedProperties) {
    if (changedProperties.has('errors')) {
      this.getControls().forEach((control) => {
        control.errors = this.errors;
      });
    }
    return super.shouldUpdate(changedProperties);
  }

  render() {
    if (this.schema == null) {
      return html``;
    }
    return html`<div class="form__control-array">
      <div class="form__item-group" id="${this.id}">
        <div class="${classMap({ 'form__item-group-header': true, skeleton: this.skeleton })}">
          <label><span>${this.title || this.id}</span><span class="form__item-length">(${this.value.length})</span></label>
          ${this.readonly !== true
            ? html`<gv-button outlined small icon="code:plus" @gv-button:click="${this._onNew}">New ${this.schema.title}</gv-button>`
            : ''}
        </div>
        ${this.value != null && Array.isArray(this.value) ? this.value.map((value, index) => this._renderValue(value, index)) : ''}
      </div>
    </div>`;
  }

  static get styles() {
    return [
      skeleton,
      // language=CSS
      css`
        .form__item-length {
          font-size: 12px;
          color: #bfbfbf;
          margin: 0 0.2rem;
        }

        .form__item-group {
          position: relative;
          transition: all 0.3s ease-in-out;
        }

        .form__item-group:hover {
          background-color: #efefef;
        }

        .form__item-group-header:before,
        .form__item-group-header:after {
          content: '';
          position: absolute;
          bottom: 0;
          height: calc(100% - 35px);
          border-left: 3px dotted #d9d9d9;
        }

        .form__item-group-required > .form__item-group-header:before,
        .form__item-group-required > .form__item-group-header:after {
          border-color: var(--gv-theme-color-error-dark, #d32f2f);
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
          transition: all 0.3s ease-in-out;
          background-color: white;
        }

        .form__item-group-header label {
          flex: 1;
          margin: 0;
        }

        .form__item-group-header,
        .form__item-group {
          border-bottom: 1px solid #d9d9d9;
        }

        .form__item {
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          margin: 0.5rem;
          background-color: white;
          transition: all 0.3s ease-in-out;
          z-index: 50;
        }

        .form__item:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -10px #bfbfbf;
          z-index: 60;
        }

        .form__item-label {
          font-style: italic;
          display: flex;
          flex-direction: row;
          border-bottom: 1px solid #d9d9d9;
          padding: 0.5rem;
        }

        .form__item-label > label {
          flex: 1;
        }

        .form__item .form_control-inline > * {
          margin-left: 0;
        }

        .form__item .form_control-inline > *:first-child {
          margin-left: 0.5rem;
        }
      `,
    ];
  }
}

window.customElements.define('gv-schema-form-array', GvSchemaFormArray);
