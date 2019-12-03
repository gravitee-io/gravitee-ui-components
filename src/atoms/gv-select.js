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
import { skeleton } from '../styles/skeleton.js';
import { input } from '../styles/input.js';
import { repeat } from 'lit-html/directives/repeat';
import { styleMap } from 'lit-html/directives/style-map';

/**
 *
 * A select component.
 *
 * @attr {Boolean} disabled - same as native select element `disabled` attribute
 * @attr {Boolean} required - same as native select element `required` attribute
 * @attr {Boolean} skeleton - enable skeleton screen UI pattern (loading hint)
 * @attr {String} options - the options of the select
 * @attr {String} value - the value of the select
 * @attr {String} label - label of the select
 * @attr {String} title - title of the select
 * @attr {String} name - name of the select
 * @attr {String} placeholder - an example value to display in the select when empty
 *
 */

export class GvSelect extends LitElement {

  static get properties () {
    return {
      disabled: { type: Boolean },
      required: { type: Boolean },
      skeleton: { type: Boolean },
      options: { type: Array },
      _options: { type: Array, attribute: false },
      value: { type: String },
      label: { type: String },
      title: { type: String },
      name: { type: String },
      large: { type: Boolean },
      medium: { type: Boolean },
      small: { type: Boolean },
      placeholder: { type: String },
      _isClosed: { type: Boolean, attribute: false },
    };
  }

  static get styles () {
    return [
      skeleton,
      input,
      // language=CSS
      css`
          :host {
              --bdc: var(--gv-select--bdc, lightgrey);
              --c: var(--gv-select--c, #262626);
              --bgc: var(--gv-select--bgc, #FFF);
              --hover-bgc: var(--gv-select-hover--bgc, grey);
              --selected-bgc: var(--gv-select-selected--bgc, grey);
          }

          div, input {
              user-select: none;
              cursor: pointer;
              text-transform: capitalize;
          }

          gv-icon {
              transform: rotate(180deg);
              --gv-icon--h: 19px;
              --gv-icon--w: 19px;
          }

          gv-icon.medium {
              --gv-icon--h: 14px;
              --gv-icon--w: 14px;
          }

          gv-icon.small {
              --gv-icon--h: 11px;
              --gv-icon--w: 11px;
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
              border-radius: 4px;
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

          .large .select__list__item {
              padding: var(--input-large--p);
              font-size: var(--input-large--fz);
              height: var(--input-large--h);
          }

          .medium .select__list__item {
              padding: var(--input-medium--p);
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
      `,
    ];
  }

  constructor () {
    super();
    this._id = 'gv-id';
    this._type = 'text';
    this._isClosed = true;
    this._options = [{ label: '', value: '' }];

    window.addEventListener('click', (e) => {
      this._isClosed = true;
    });
  }

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

  _onSelect (e) {
    e.stopPropagation();
    this.value = e.target.dataset.value;
    this._isClosed = !this._isClosed;
    this.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
  }

  _renderRequired () {
    if (this.required) {
      return html`<abbr title="(required)" aria-hidden="true">*</abbr>`;
    }
    return '';
  }

  _renderLabel () {
    if (this.label) {
      return html`<label for=${this.id} class="${classMap({ required: this.required })}" title="${this.label}">
        ${this._renderRequired()}${this.label}
        </label>
        `;
    }
    return '';
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
      const element = this._options.find((o) => this.value === o.value);
      if (element) {
        return element.label;
      }
    }
    return '';
  }

  render () {
    const classes = {
      skeleton: this.skeleton,
      closed: this._isClosed,
    };

    const inputClasses = {
      large: this.large,
      medium: (this.medium || (!this.large && !this.small)),
      small: this.small,
      icon: true,
    };
    return html`
      <div class="${classMap(classes)}">
        ${this._renderLabel()}
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
            <li class="${classMap({ select__list__item: true, selected: this.value === option.value })}"
            @click=${this._onSelect} data-value="${option.value}">${option.label}</li>
          `)}
        </ul>
      </div>
    `;
  }
}

window.customElements.define('gv-select', GvSelect);
