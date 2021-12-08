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
import { classMap } from 'lit/directives/class-map';
import { ifDefined } from 'lit/directives/if-defined';
import { repeat } from 'lit/directives/repeat';

import { LitElement, html, css } from 'lit';
import { skeleton } from '../styles/skeleton';
import { link } from '../styles/link';
import { input } from '../styles/input';
import { dispatchCustomEvent } from '../lib/events';
import { InputElement } from '../mixins/input-element';
import { i18n } from '../lib/i18n';

/**
 * A select native component.
 *
 * @fires gv-select:select - Event when user select a value (deprecated, use gv-select:input)
 * @fires gv-select:input - Event when user select a value
 *
 * @attr {Boolean} disabled - same as native select element `disabled` attribute
 * @attr {Boolean} required - same as native select element `required` attribute
 * @attr {Boolean} skeleton - enable skeleton screen UI pattern (loading hint)
 * @attr {Array} options - the options of the select
 * @attr {String | Array} value - the value of the select
 * @attr {String} label - label of the select
 * @attr {String} title - title of the select
 * @attr {String} name - name of the select
 * @attr {String} placeholder - an example value to display in the select when empty
 * @attr {String} description - a description
 * @attr {Boolean} multiple - enable multiple selection
 *
 * @cssprop {Color} [--gv-select--bgc=var(--gv-theme-neutral-color-lightest, #ffffff)] - Background color
 * @cssprop {Color} [--gv-select--bdc=var(--gv-theme-neutral-color-dark, #d9d9d9)] - Border color
 * @cssprop {Color} [--gv-select--c=var(--gv-theme-font-color-dark, #262626)] - Color
 * @cssprop {Color} [--gv-select-hover--bgc=var(--gv-theme-color-light, #86c3d0)] - Hover background color
 * @cssprop {Color} [--gv-select-selected--bgc=var(--gv-theme-neutral-color-light, #efefef)] - Selected background color
 */
export class GvSelectNative extends InputElement(LitElement) {
  static get properties() {
    return {
      ...super.properties,
      options: { type: Array },
      _options: { type: Array, attribute: false },
      large: { type: Boolean },
      medium: { type: Boolean },
      small: { type: Boolean },
      value: { type: String | Array },
      _value: { type: String | Array, attribute: false },
      label: { type: String },
      title: { type: String },
      name: { type: String },
      placeholder: { type: String },
      description: { type: String },
      multiple: { type: Boolean, reflect: true },
    };
  }

  static get styles() {
    return [
      ...super.styles,
      skeleton,
      input,
      link,
      // language=CSS
      css`
        .box {
          --bdc: var(--gv-select--bdc, var(--gv-theme-neutral-color-dark, #d9d9d9));
          --c: var(--gv-select--c, var(--gv-theme-font-color-dark, #262626));
          --bgc: var(--gv-select--bgc, var(--gv-theme-neutral-color-lightest, #ffffff));
          --bgc-list: var(--gv-select--list-bgc, var(--gv-select--bgc, var(--gv-theme-neutral-color-lightest, #ffffff)));
          --hover-bgc: var(--gv-select-hover--bgc, var(--gv-theme-color-light, #86c3d0));
          --selected-bgc: var(--gv-select-selected--bgc, var(--gv-theme-neutral-color-light, #efefef));
          position: relative;
          color: var(--c);
        }

        :host([readonly]) div,
        :host([readonly]) input,
        :host([readonly]) input:read-only:hover {
          user-select: auto;
          cursor: text;
        }

        input:read-only:hover {
          cursor: pointer;
        }

        label {
          color: var(--c);
        }

        select,
        .multiple .input {
          background-image: linear-gradient(45deg, transparent 50%, var(--c) 50%), linear-gradient(135deg, var(--c) 50%, transparent 50%),
            linear-gradient(to right, #ccc, #ccc);
          background-position: calc(100% - 17px) calc(1em + 2px), calc(100% - 12px) calc(1em + 2px), calc(100% - 2.5em) 0.5em;
          background-size: 5px 5px, 5px 5px, 1px 1.5em;
          background-repeat: no-repeat;
          -webkit-appearance: none;
          appearance: none;
          background-color: var(--bgc);
        }

        .multiple .input {
          padding-right: 35px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        .multiple gv-icon {
          display: none;
        }

        .multiple.not-empty :not(.show) .input {
          background-image: none, linear-gradient(155deg, var(--c) 0%, transparent 0%), linear-gradient(to right, #ccc, #ccc);
        }
        .multiple.not-empty gv-icon {
          display: block;
        }

        .small .multiple .input {
          padding-right: 30px;
        }

        .small select,
        .small.multiple .input {
          background-position: calc(100% - 16px) calc(0.8em), calc(100% - 11px) calc(0.8em), calc(100% - 2.5em) 0.5em;
          background-size: 5px 5px, 5px 5px, 1px 1em;
        }

        .multiple select {
          opacity: 0;
          position: absolute;
          left: 0;
          top: 0;
          max-height: var(--input-medium--h);
        }

        .multiple .show {
          min-height: 75px;
        }

        .multiple .show select {
          opacity: 1;
          z-index: 1000;
          max-height: 300px;
        }

        gv-icon {
          --gv-icon--s: 19px;
        }

        .medium gv-icon {
          --gv-icon--s: 14px;
        }

        .small gv-icon {
          --gv-icon--s: 11px;
        }
      `,
    ];
  }

  constructor() {
    super();
    this._options = [{ label: '', value: '', disabled: false, title: null }];
  }

  getInputElement() {
    return this.shadowRoot.querySelector('select');
  }

  async firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    // Give the browser a chance to paint
    await new Promise((resolve) => setTimeout(resolve, 0));
    const input = this.getInputElement();
    if (input) {
      input.addEventListener('input', this._onInput.bind(this));
      if (this.multiple) {
        input.addEventListener('mousedown', this._onEnter.bind(this));
        input.addEventListener('focus', this._onEnter.bind(this));
        input.addEventListener('mouseleave', this._onLeave.bind(this));
        input.addEventListener('blur', this._onLeave.bind(this));
      }
    }
  }

  set value(value) {
    if (this.multiple) {
      if (value == null) {
        this._value = null;
        this.updateState(this._value);
      }
      if (Array.isArray(value)) {
        this._value = value;
        this.updateState(this._value);
      }
    } else {
      this._value = value;
      this.updateState(this._value);
    }
  }

  get value() {
    return this._value;
  }

  updateState(value) {
    super.updateState(value);
    if (value && this._options && this.valid) {
      if (this.multiple) {
        if (this.required) {
          this.setValidity(value.length === 0, 'field is required');
        }
        if (value.length > 0 && this.valid) {
          const possibleValues = this._options.map((o) => o.value);
          this.setValidity(!value.some((v) => possibleValues.includes(v)), 'value is not included in the possible values');
        }
      } else {
        this.setValidity(
          this.required && this._options.find((option) => option.value === value) == null,
          'value is not included in the possible values',
        );
      }
      this.invalid = !this.valid;
    }
  }

  _onEnter(e) {
    const input = this.getInputElement();
    if (!input.parentNode.classList.contains('show')) {
      e.stopPropagation();
      e.preventDefault();
      input.parentNode.classList.add('show');
    }
  }

  _onLeave() {
    this.getInputElement().parentNode.classList.remove('show');
  }

  _onInput(e) {
    e.stopPropagation();
    if (this.multiple) {
      const options = this.getInputElement().querySelectorAll('option:checked');
      this.value = Array.from(options).map((o) => o.value);
    } else {
      this.value = e.target.value;
    }
    this.updateState(this.value);
    dispatchCustomEvent(this, 'select', this.value);
    dispatchCustomEvent(this, 'input', this.value);
    this.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
  }

  _onClear() {
    Array.from(this.getInputElement().querySelectorAll('option:checked')).forEach((option) => option.removeAttribute('checked'));
    this.value = [];
    dispatchCustomEvent(this, 'select', this.value);
    dispatchCustomEvent(this, 'input', this.value);
    this.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
  }

  set options(options) {
    if (options) {
      this._options = options.map((option) => {
        if (typeof option !== 'object') {
          return { value: option, label: option };
        } else if (!option.label) {
          return { value: option.value, label: option.value };
        }
        return option;
      });
    }
  }

  selectedLabel() {
    if (this.value != null) {
      const elements = this._options.filter((o) => this.isSelected(o));
      if (elements) {
        return elements.map((e) => e.label).join(', ');
      }
    }
    return '';
  }

  renderSelect() {
    const selectedLabel = this.selectedLabel();
    if (this.readonly) {
      return html`
        <input
          id=${this._id}
          type="text"
          .name=${ifDefined(this.name)}
          .title=${ifDefined(selectedLabel || this.title || this.label)}
          .required=${this.required}
          aria-required=${!!this.required}
          .placeholder=${ifDefined(this.placeholder)}
          .value=${selectedLabel}
          readonly="readonly"
        />
      `;
    } else if (this.multiple) {
      const height = this._options ? this._options.length * (this.small ? 20 : 25) : 50;
      return html`
        <input
          class="input"
          type="text"
          .name=${ifDefined(this.name)}
          .title=${ifDefined(selectedLabel || this.title || this.label)}
          .required=${this.required}
          aria-required=${!!this.required}
          .placeholder=${ifDefined(this.placeholder)}
          .value=${selectedLabel}
          readonly="readonly"
        />
        <select
          class="input"
          id=${this._id}
          .name=${ifDefined(this.name)}
          .title=${ifDefined(selectedLabel || this.title || this.label)}
          .required=${this.required}
          aria-required=${!!this.required}
          ?disabled=${this.disabled || this.skeleton}
          .placeholder=${ifDefined(this.placeholder)}
          multiple
          .size="${this._options.length}"
          style="height: ${height}px"
        >
          ${this._options &&
          repeat(
            this._options,
            (option) => option,
            (option) => html` <option value="${option.value || ''}" ?selected="${this.isSelected(option)}">${option.label}</option> `,
          )}
        </select>
        <div class="box-icon box-icon-clear">
          <gv-icon class="link" shape="code:error" title="${i18n('gv-input.clear')}" @click="${this._onClear}"></gv-icon>
        </div>
      `;
    } else {
      return html`<select
        class="input"
        id=${this._id}
        .name=${ifDefined(this.name)}
        .title=${ifDefined(selectedLabel || this.title || this.label)}
        .required=${this.required}
        aria-required=${!!this.required}
        ?disabled=${this.disabled || this.skeleton}
        .placeholder=${ifDefined(this.placeholder)}
      >
        ${this._options &&
        repeat(
          this._options,
          (option) => option,
          (option) => html` <option value="${option.value || ''}" ?selected="${this.isSelected(option)}">${option.label}</option>`,
        )}
      </select>`;
    }
  }

  render() {
    const classes = {
      box: true,
      large: this.large,
      medium: this.medium || (!this.large && !this.small),
      small: this.small,
      skeleton: this.skeleton,
      required: this.required,
      multiple: this.multiple,
      'not-empty': this._options && this.multiple && this.value && this.value.length > 0,
    };

    return html`
      <div class="${classMap(classes)}">
        <div class="box-input">${this.renderLabel()} ${this.renderSelect()}</div>
      </div>
      ${this.description != null ? html`<div class="description" .innerHTML="${this.description}"></div>` : ''}
    `;
  }

  isSelected(option) {
    return this.multiple ? this.value && this.value.includes(option.value) : '' + this.value === '' + option.value;
  }
}

window.customElements.define('gv-select-native', GvSelectNative);
