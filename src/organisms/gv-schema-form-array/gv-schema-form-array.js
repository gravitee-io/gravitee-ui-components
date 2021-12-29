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
import { canInline } from '../../lib/schema-form';
import { dispatchCustomEvent } from '../../lib/events';
import { classMap } from 'lit/directives/class-map';
import { skeleton } from '../../styles/skeleton';
import { UpdateAfterBrowser } from '../../mixins/update-after-browser';

/**
 * Schema form array component
 *
 */
export class GvSchemaFormArray extends UpdateAfterBrowser(LitElement) {
  static get properties() {
    return {
      schema: { type: Object },
      value: { type: Array },
      id: { type: String, reflect: true },
      title: { type: String, reflect: true },
      description: { type: String },
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
    const isInline = canInline(this.schema);
    const classes = {
      form__item: true,
      form__item_cards: !isInline,
    };
    return html`<div class="${classMap(classes)}" @mouseleave="${this._onMouseLeave}">
      ${!isInline
        ? html`<div class="${classMap({ 'form__item-label': true, skeleton: this.skeleton })}">
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
          </div>`
        : ''}
      <div class="form__item_entry">
        <gv-schema-form-control
          .id="${id}"
          .skeleton="${this.skeleton}"
          .control="${control}"
          .value="${value}"
          ?required="${isRequired}"
          ?disabled="${isDisabled}"
          ?readonly="${this.readonly}"
          compact
        ></gv-schema-form-control>
        ${!isInline
          ? ''
          : html`<gv-button
              link
              small
              @gv-button:click="${this._onRemove.bind(this, index)}"
              icon="general:close"
              title="Remove"
            ></gv-button>`}
      </div>
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

  async getUpdateComplete() {
    await super.getUpdateComplete();
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
    const open = this.schema['x-schema-form'] == null || this.schema['x-schema-form'].open !== false;
    return html`<gv-expandable class="form__control-array" ?open="${open}">
      <div slot="summary" class="form__item-group-header">
        <div class="form__item-group-title">
          <label><span>${this.title || this.id}</span><span class="form__item-length">(${this.value.length})</span></label>
          ${this.description ? html`<div class="description">${this.description}</div>` : ''}
        </div>
        ${this.readonly !== true
          ? html`<gv-button outlined small icon="code:plus" @gv-button:click="${this._onNew}">New ${this.schema.title}</gv-button>`
          : ''}
      </div>
      <div class="form__item-group" id="${this.id}" slot="details">
        ${this.value != null && Array.isArray(this.value) ? this.value.map((value, index) => this._renderValue(value, index)) : ''}
      </div>
    </gv-expandable>`;
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

        .form__item_cards form__item-group:hover {
          background-color: #efefef;
        }

        .form__item-group-header {
          display: flex;
          flex: 1;
          align-items: center;
          transition: all 0.3s ease-in-out;
          background-color: var(--gv-schema-form--bgc, #ffffff);
        }

        .form__item-group-header label {
          flex: 1;
          margin: 0;
        }

        .form__item-group-title {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .description {
          opacity: 0.6;
          font-size: var(--gv-theme-font-size-s, 12px);
        }

        .form__item_cards {
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          margin: 0.5rem;
          background-color: white;
          transition: all 0.3s ease-in-out;
          z-index: 50;
        }

        .form__item_cards:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -10px #bfbfbf;
          z-index: 60;
        }

        .form__item_entry {
          display: flex;
        }

        .form__item_entry gv-schema-form-control {
          flex: 1;
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
