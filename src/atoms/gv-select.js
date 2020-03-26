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
import { classMap } from 'lit-html/directives/class-map';
import { ifDefined } from 'lit-html/directives/if-defined';

import { LitElement, html, css } from 'lit-element';
import { skeleton } from '../styles/skeleton';
import { input } from '../styles/input';
import { repeat } from 'lit-html/directives/repeat';
import { styleMap } from 'lit-html/directives/style-map';
import './gv-icon';
import { dispatchCustomEvent } from '../lib/events';
import { InputElement } from '../mixins/input-element';

/**
 *
 * A select component.
 *
 * @fires gv-select:select - Event when user select a value
 *
 * @attr {Boolean} disabled - same as native select element `disabled` attribute
 * @attr {Boolean} required - same as native select element `required` attribute
 * @attr {Boolean} skeleton - enable skeleton screen UI pattern (loading hint)
 * @attr {String} options - the options of the select
 * @attr {String | Array} value - the value of the select
 * @attr {String} label - label of the select
 * @attr {String} title - title of the select
 * @attr {String} name - name of the select
 * @attr {String} placeholder - an example value to display in the select when empty
 * @attr {Boolean} multiple - enable multiple selection
 *
 * @cssprop {Color} [--gv-select--bgc=var(--gv-theme-neutral-color-lightest, #FFFFFF)] - Background color
 * @cssprop {Color} [--gv-select--bdc=var(--gv-theme-neutral-color, #F5F5F5)] - Border color
 * @cssprop {Color} [--gv-select--c=var(--gv-theme-font-color-dark, #262626)] - Color
 * @cssprop {Color} [--gv-select-hover--bgc=var(--gv-theme-color-light, #D5FDCB)] - Hover background color
 * @cssprop {Color} [--gv-select-selected--bgc=var(--gv-theme-neutral-color-light, #EFEFEF)] - Selected background color
 */
export class GvSelect extends InputElement(LitElement) {

  static get properties () {
    return {
      options: { type: Array },
      _options: { type: Array, attribute: false },
      large: { type: Boolean },
      medium: { type: Boolean },
      small: { type: Boolean },
      value: { type: String | Array },
      label: { type: String },
      title: { type: String },
      name: { type: String },
      placeholder: { type: String },
      multiple: { type: Boolean },
      _isClosed: { type: Boolean, attribute: false },
    };
  }

  static get styles () {
    return [
      ...super.styles,
      skeleton,
      input,
      // language=CSS
      css`
          :host {
              --bdc: var(--gv-select--bdc, var(--gv-theme-neutral-color, #F5F5F5));
              --c: var(--gv-select--c, var(--gv-theme-font-color-dark, #262626));
              --bgc: var(--gv-select--bgc, var(--gv-theme-neutral-color-lightest, #FFFFFF));
              --hover-bgc: var(--gv-select-hover--bgc, var(--gv-theme-color-light, #D5FDCB));
              --selected-bgc: var(--gv-select-selected--bgc, var(--gv-theme-neutral-color-lighter, #FAFAFA));
              color: var(--c);
            display: block;
          }

          div, input {
              user-select: none;
              cursor: pointer;
          }

          input:read-only:hover {
              cursor: pointer;
          }

          gv-icon {
              transform: rotate(180deg);
              --gv-icon--s: 19px;
          }

          gv-icon.medium {
              --gv-icon--s: 14px;
          }

          gv-icon.small {
              --gv-icon--s: 11px;
          }

          .closed .select__list {
              display: none;
              opacity: 0;
              transform: translateY(-2em);
              z-index: -1;
          }

          .select__list {
              list-style: none;
              position: absolute;
              background-color: var(--bgc);
              list-style: none;
              padding: 0;
              transition: all 0.3s ease 0s;
              margin: 0;
              width: 100%;
              cursor: pointer;
              z-index: 100;
              box-shadow: 0 2px 4px -1px rgba(0, 0, 0, .2), 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12);
              max-height: 340px;
              overflow: auto;
          }

          .select__list .selected {
              background-color: var(--selected-bgc);
          }

          .select__list__item {
              border-left: 1px solid var(--bdc);
              display: flex;
              align-items: center;
              transition: all 0.5s ease;

              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
          }

          .select__list__item.disabled {
              opacity: .5;
          }

          .select__list__item.disabled:hover {
              cursor: not-allowed;
          }

          .large .select__list__item {
              padding: var(--input-large--p);
              font-size: var(--input-large--fz);
              height: var(--input-large--h);
          }

          .medium .select__list__item {
              padding: 0 5px;
              font-size: var(--input-medium--fz);
              height: var(--input-medium--h);
          }

          .small .select__list__item {
              padding: var(--input-small--p);
              font-size: var(--input-small--fz);
              height: var(--input-small--h);
          }

          .select__list__item:hover {
              background-color: var(--hover-bgc);
              border-left: 1px dotted var(--bdc);
          }

          input.medium.icon, input.large.icon, input.small.icon {
              padding-right: 0px;
          }
      `,
    ];
  }

  constructor () {
    super();
    this._type = 'text';
    this._isClosed = true;
    this._options = [{ label: '', value: '', disabled: false, title: null }];
    this.handleDocumentClick = this._onDocumentClick.bind(this);
  }

  connectedCallback () {
    super.connectedCallback();
    window.addEventListener('click', this.handleDocumentClick);
  }

  disconnectedCallback () {
    window.removeEventListener('click', this.handleDocumentClick);
    super.disconnectedCallback();
  }

  _onDocumentClick () {
    this._isClosed = true;
  };

  _onClick (e) {
    if (!this.disabled && !this.skeleton) {
      e.preventDefault();
      e.stopPropagation();
      if (this._isClosed) {
        this.dispatchEvent(new Event('click', { bubbles: true, cancelable: true, composed: true }));
      }
      this._isClosed = !this._isClosed;
    }
  }

  _onSelect (option, e) {
    e.stopPropagation();
    if (option.disabled !== true) {
      if (this.multiple) {
        if (!this.value) {
          this.value = [];
        }
        if (this.value.includes(e.target.dataset.value)) {
          const index = this.value.indexOf(e.target.dataset.value);
          if (index > -1) {
            this.value.splice(index, 1);
            this.value = [...this.value];
          }
        }
        else {
          this.value = [...this.value, e.target.dataset.value];
        }
      }
      else {
        if (this.value === e.target.dataset.value) {
          this.value = '';
        }
        else {
          this.value = e.target.dataset.value;
        }
        this._isClosed = !this._isClosed;
      }
      this.updateState();
      this.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      dispatchCustomEvent(this, 'select', this.value);
    }
  }

  _renderIcon () {
    const iconStyle = {
      position: 'absolute',
      bottom: '1px',
      right: '1px',
      padding: this.small ? '5px' : '11px',
      borderRadius: '3px 0 0 3px',
    };
    const classes = {
      small: this.small,
      medium: (this.medium || (!this.large && !this.small)),
    };
    return html`<gv-icon class="${classMap(classes)}" style="${styleMap(iconStyle)}" shape="design:triangle" @click=${this._onClick}></gv-icon>`;
  }

  set options (options) {
    if (options) {
      this._options = options.map((option) => {
        if (typeof option !== 'object') {
          return { value: option, label: option };
        }
        else if (!option.label) {
          return { value: option.value, label: option.value };
        }
        return option;
      });
    }
  }

  selectedLabel () {
    if (this.value) {
      const elements = this._options.filter((o) => this.isSelected(o));
      if (elements) {
        return elements.map((e) => e.label).join(', ');
      }
    }
    return '';
  }

  render () {
    const classes = {
      closed: this._isClosed,
    };

    const inputClasses = {
      large: this.large,
      medium: (this.medium || (!this.large && !this.small)),
      small: this.small,
      icon: true,
      skeleton: this.skeleton,
      required: this.required,
    };
    return html`
      <div class="${classMap(classes)}">
        ${this.renderLabel()}
        <input
          id=${this._id}
          class="${classMap(inputClasses)}"
          .type=${this._type}
          .name=${ifDefined(this.name)}
          .title=${ifDefined(this.title || this.label)}
          .required=${this.required}
          aria-required=${!!this.required}
          ?disabled=${this.disabled || this.skeleton}
          .placeholder=${ifDefined(this.placeholder)}
          .value=${ifDefined(this.selectedLabel())}
          @click=${this._onClick}
          readonly="readonly">
          ${this._renderIcon()}
        <ul class="${classMap(Object.assign({ select__list: true }, inputClasses))}">
          ${this._options && repeat(this._options, (option) => option, (option) => html`
            <li class="${classMap({
      select__list__item: true,
      selected: this.isSelected(option),
      disabled: option.disabled,
    })}"
            @click=${this._onSelect.bind(this, option)} data-value="${option.value}" .title="${ifDefined(option.title)}">${option.label}</li>
          `)}
        </ul>
      </div>
    `;
  }

  isSelected (option) {
    return this.multiple ? (this.value && this.value.includes(option.value)) : this.value === option.value;
  }
}

window.customElements.define('gv-select', GvSelect);
