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
import { dispatchCustomEvent } from '../lib/events';
import { repeat } from 'lit-html/directives/repeat';

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
      value: { type: String },
      label: { type: String },
      title: { type: String },
      name: { type: String },
      placeholder: { type: String },
      _isClosed: { type: Boolean, attribute: false },
    };
  }

  static get styles () {
    return [
      skeleton,
      // language=CSS
      css`
          :host {
              --bdc: var(--gv-select--bdc, lightgrey);
              --c: var(--gv-select--c, #262626);
              --bgc: var(--gv-select--bgc, #FFF);
              --hover-bgc: var(--gv-select-hover--bgc, grey);
              --selected-bgc: var(--gv-select-selected--bgc, grey);
          }
          
          div {
              position: relative;
              line-height: 0;
              user-select:none;
          }
          
          /* BASE */
          input {
              border: 1px solid #D9D9D9;
              box-sizing: border-box;
              border-radius: 4px;
              cursor: pointer;
              font-style: normal;
              font-weight: normal;
              outline: none;
              padding: 10px;
              width: 100%;
          }

          input:disabled {
              cursor: default;
              opacity: .5;
          }

          gv-icon {
              bottom: 0px;
              cursor: pointer;
              height: 14px;
              margin: 0;
              position: absolute;
              right: 10px;
              transform:rotate(180deg);
              width: 14px;
          }

          label {
              display: block;
              line-height: 15px;
              padding: 0.2rem 0;
          }

          label.required {
              padding-left: 0.6rem;
          }

          label abbr {
              position: absolute;
              left: 0;
              color: red;
              font-variant: none;
              text-decoration: none;
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
              box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);
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
              padding: 2px 20px;
              height: 30px;
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

    window.addEventListener('click', (e) => {
      if (e.target !== this) {
        this._isClosed = true;
      }
    });
  }

  _onClick (e) {
    e.preventDefault();
    this._isClosed = !this._isClosed;
  }

  _onSelect (e) {
    e.stopPropagation();
    this.value = e.target.slot;
    dispatchCustomEvent(this, 'select', this.value);
    this._isClosed = !this._isClosed;
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

  selectedLabel () {
    if (this.value) {
      const element = this.options.find((o) => this.value === o.value);
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
    if (!this.options) {
      this.options = [{ label: '', value: '' }];
    }

    return html`
      <div class="${classMap(classes)}" @click=${this._onClick}>
        <gv-icon shape="design:triangle"></gv-icon>
        <label>${this._renderLabel()}</label>
        <input
          id=${this._id}
          .type=${this._type}
          .name=${ifDefined(this.name)}
          .title=${ifDefined(this.title || this.label)}
          .required=${this.required}
          aria-required=${!!this.required}
          ?disabled=${this.disabled || this.skeleton}
          .placeholder=${ifDefined(this.placeholder)}
          .value=${ifDefined(this.selectedLabel())}
          readonly="readonly">
          <ul class="select__list">
            ${this.options && repeat(this.options, (option) => option, (option) => html`
              <li class="select__list__item ${this.value === option.value ? 'selected' : ''}" @click=${this._onSelect} slot="${option.value}">${option.label}</li>
            `)}
          </ul>
      </div>
    `;
  }
}

window.customElements.define('gv-select', GvSelect);
