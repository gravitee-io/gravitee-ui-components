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
import { canInline, canGrid } from '../../lib/schema-form';
import { classMap } from 'lit/directives/class-map.js';
import { skeleton } from '../../styles/skeleton';
import '../../molecules/gv-expandable';
import { UpdateAfterBrowser } from '../../mixins/update-after-browser';

/**
 * Schema form control object component
 */
export class GvSchemaFormControlObject extends UpdateAfterBrowser(LitElement) {
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
    const keys = Object.keys(this.schema.properties || {});
    const isGrid = canGrid(this.schema);
    const classes = {
      'form_control-inline': canInline(this.schema),
      'form_control-grid': isGrid,
      'form_control-grid-odd': isGrid && keys.length % 2 !== 0,
    };

    const titleClasses = {
      'form__control-group-title': true,
      skeleton: this.skeleton,
    };

    const details = keys.map((key) => this._renderPart(key));

    if (this.title) {
      const open = this.schema['x-schema-form'] == null || this.schema['x-schema-form'].open !== false;
      return html`<gv-expandable ?open="${open}">
        <div slot="summary" class="${classMap(titleClasses)}" title="${this.title}">${this.title}</div>
        <div slot="details" class="${classMap(classes)}">${details}</div>
      </gv-expandable>`;
    } else {
      return html`<div class="${classMap(classes)}">${details}</div>`;
    }
  }

  static get styles() {
    return [
      skeleton,
      // language=CSS
      css`
        .form__control-group-title {
          padding: 0.5rem 0;
        }

        .form_control-inline,
        .form_control-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
        }

        .form_control-grid-odd *:first-child {
          grid-column: 1 / 3;
        }

        .form_control-inline > * {
          --gv-schema-form-control--m: 0 0.2rem 0 0;
          overflow: auto;
        }

        .form_control-inline > *:last-child {
          --gv-schema-form-control--m: 0 0 0 0.2rem;
        }
      `,
    ];
  }
}

window.customElements.define('gv-schema-form-control-object', GvSchemaFormControlObject);
