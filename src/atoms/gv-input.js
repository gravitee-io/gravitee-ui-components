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
import { styleMap } from 'lit-html/directives/style-map';

import { LitElement, html, css } from 'lit-element';
import { skeleton } from '../styles/skeleton.js';
import { input } from '../styles/input.js';
import { dispatchCustomEvent } from '../lib/events';

/**
 *
 * @fires gv-input:input - mirrors native input events with the `value` on `detail`
 *
 * @attr {Boolean} disabled - same as native input element `disabled` attribute
 * @attr {Boolean} required - same as native input element `required` attribute
 * @attr {Boolean} skeleton - enable skeleton screen UI pattern (loading hint)
 * @attr {String} value - the value of the input
 * @attr {String} label - label of the input
 * @attr {String} title - title of the input
 * @attr {String} name - name of the input
 * @attr {String} placeholder - an example value to display in the input when empty
 * @attr {String} type - type of the input, can be text (Default), password, email or search
 * @attr {Boolean} large - for a large input
 * @attr {Boolean} medium - for a medium input (Default)
 * @attr {Boolean} small - for a small input
 * @attr {String} icon - icon of the input
 *
 */

export class GvInput extends LitElement {

  static get properties () {
    return {
      disabled: { type: Boolean },
      required: { type: Boolean },
      skeleton: { type: Boolean },
      value: { type: String },
      label: { type: String },
      title: { type: String },
      name: { type: String },
      placeholder: { type: String },
      type: { type: String },
      large: { type: Boolean },
      medium: { type: Boolean },
      small: { type: Boolean },
      icon: { type: String },
    };
  }

  static get styles () {
    return [
      skeleton,
      input,
      // language=CSS
      css`

          gv-icon.medium {
              --gv-icon--h: 25px;
              --gv-icon--w: 25px;
          }

          gv-icon.small {
              --gv-icon--h: 19px;
              --gv-icon--w: 19px;
          }
          gv-icon.search {
              cursor: pointer;
          }
          
          gv-icon.search:hover {
              box-shadow: 0 1px 3px #888;
          }
      `,
    ];
  }

  constructor () {
    super();
    this._id = 'gv-id';
    this._type = 'text';
  }

  focus () {
    this.shadowRoot.querySelector('input').focus();
  }

  _onInput (e) {
    this.value = e.target.value;
    dispatchCustomEvent(this, 'input', this.value);
  }

  _onKeyUp (e, a) {
    if (e.keyCode === 13) {
      const form = this.closest('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
      dispatchCustomEvent(this, 'submit', this.value);
    }
  }

  set type (value) {
    if (['text', 'password', 'email', 'search'].includes(value)) {
      this._type = value;
    }

    if (this._type === 'search' && this.icon == null) {
      this.icon = 'general:search';
    }
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

  _onIconClick () {
    if (this._type === 'search') {
      dispatchCustomEvent(this, 'input', this.value);
    }
  }

  _renderIcon () {
    if (this.icon) {
      const iconStyle = {
        position: 'absolute',
        bottom: '1px',
        right: '1px',
        padding: this.large ? '5px' : (this.small ? '2px' : '6px'),
        borderRadius: '0 3px 3px 0',
        backgroundColor: 'rgba(25, 62, 52, 0.1)',
      };

      const classes = {
        small: this.small,
        medium: (this.medium || (!this.large && !this.small)),
        search: this._type === 'search',
      };

      return html`<gv-icon class="${classMap(classes)}" style="${styleMap(iconStyle)}" shape="${this.icon}" @click="${this._onIconClick}"></gv-icon>`;
    }
    return '';
  }

  render () {

    const classes = {
      skeleton: this.skeleton,
      large: this.large,
      medium: (this.medium || (!this.large && !this.small)),
      small: this.small,
      icon: !!this.icon,
    };

    return html`
      <div>
          ${this._renderLabel()}
          <input
            id=${this._id}
            .type=${this._type}
            .name=${ifDefined(this.name)}
            .title=${ifDefined(this.title || this.label)}
            .required=${this.required}
            aria-required=${!!this.required}
            .aria-label="${ifDefined(this.label)}"
            ?disabled=${this.disabled || this.skeleton}
            .placeholder=${ifDefined(this.placeholder)}
            .value=${ifDefined(this.value)}
            class=${classMap(classes)}
            @input=${this._onInput}
            @keyup="${this._onKeyUp}">
            ${this._renderIcon()}
        </div>
    `;
  }

}

window.customElements.define('gv-input', GvInput);
