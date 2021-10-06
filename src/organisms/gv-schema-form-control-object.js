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
import { css, html, LitElement } from 'lit-element';
import { isCodemirror } from '../lib/schema-form';
import { classMap } from 'lit-html/directives/class-map';
import { skeleton } from '../styles/skeleton';

/**
 * Schema form control object component
 */
export class GvSchemaFormControlObject extends LitElement {
  static get properties() {
    return {
      schema: { type: Object },
      value: { type: Object, reflect: true },
      id: { type: String, reflect: true },
      title: { type: String, reflect: true },
      errors: { type: Array },
      skeleton: { type: Boolean, reflect: true },
      readonly: { type: Boolean, reflect: true },
      disabled: { type: Boolean, reflect: true },
      required: { type: Boolean, reflect: true },
      hidden: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.value = [];
  }

  _renderPart(subKey) {
    const isRequired = this.required || (this.schema.required && this.schema.required.includes(subKey));
    const isDisabled = this.disabled || (this.schema.disabled && this.schema.disabled.includes(subKey));

    const fullKey = this.id != null ? `${this.id}.${subKey}` : subKey;
    const control = { ...this.schema.properties[subKey] };
    const value = this.value != null ? this.value[subKey] : null;
    return html`<gv-schema-form-control
      .id="${fullKey}"
      .control="${control}"
      .value="${value}"
      .skeleton="${this.skeleton}"
      ?required="${isRequired}"
      ?disabled="${isDisabled}"
      ?readonly="${this.readonly}"
      ?hidden="${this.hidden}"
      class="control"
    ></gv-schema-form-control>`;
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
    const keys = Object.keys(this.schema.properties);
    const classes = {
      'form__control-object': true,
      'form_control-inline': keys.length <= 2 && keys.find((key) => isCodemirror(this.schema.properties[key])) == null,
    };

    const titleClasses = {
      'form__control-group-title': true,
      skeleton: this.skeleton,
    };
    return html`<div class="${classMap(classes)}">
      ${this.title ? html`<div class="${classMap(titleClasses)}" title="${this.title}">${this.title}</div>` : ''}
      ${keys.map((key) => this._renderPart(key))}
    </div>`;
  }

  static get styles() {
    return [
      skeleton,
      // language=CSS
      css`
        .form__control-group-title {
          border-bottom: 1px solid #bfbfbf;
          padding: 0.5rem 0;
        }
      `,
    ];
  }
}

window.customElements.define('gv-schema-form-control-object', GvSchemaFormControlObject);
