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
 * @attr {String} type - type of the input, can be text (Default), password, email, search or number
 * @attr {Boolean} large - for a large input
 * @attr {Boolean} medium - for a medium input (Default)
 * @attr {Boolean} small - for a small input
 * @attr {String} icon - icon of the input
 * @attr {String} icon-left - icon of the input to display at left
 * @attr {Boolean} loading - true to display a loading icon
 * @attr {Boolean} autofocus - true to put the focus on the input
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
      iconLeft: { type: String, attribute: 'icon-left' },
      loading: { type: Boolean },
      min: { type: Number },
      max: { type: Number },
      autofocus: { type: Boolean },
    };
  }

  static get styles () {
    return [
      skeleton,
      input,
      // language=CSS
      css`

          gv-icon.medium {
              --gv-icon--s: 25px;
          }

          gv-icon.small {
              --gv-icon--s: 19px;
          }
          gv-icon.search {
              cursor: pointer;
          }

          gv-icon.search:hover {
              box-shadow: 0 1px 3px #888;
          }

          .loading {
              animation: spinner 1.6s linear infinite;
          }

          @keyframes spinner {
              to {transform: rotate(360deg);}
          }
      `,
    ];
  }

  constructor () {
    super();
    this._id = 'gv-id';
    this._type = 'text';
    this._showPassword = false;
  }

  firstUpdated (changedProperties) {
    if (this.autofocus) {
      this.shadowRoot.querySelector('input').focus();
    }
  }

  _onInput (e) {
    this.value = e.target.value;
    dispatchCustomEvent(this, 'input', this.value);
  }

  _onKeyUp (e) {
    if (e.keyCode === 13) {
      const form = this.closest('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
      dispatchCustomEvent(this, 'submit', this.value);
    }
  }

  set type (value) {
    if (['text', 'password', 'email', 'search', 'number'].includes(value)) {
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
      const form = this.closest('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
      dispatchCustomEvent(this, 'submit', this.value);
    }
  }

  _renderIcon () {
    const iconStyle = {
      position: 'absolute',
      bottom: '1px',
      left: this.iconLeft ? '1px' : 'default',
      right: this.iconLeft ? 'default' : '1px',
      padding: this.large ? '5px' : (this.small ? '2px' : '6px'),
      borderRadius: '0 3px 3px 0',
      backgroundColor: 'rgba(25, 62, 52, 0.1)',
    };

    const classes = {
      small: this.small,
      medium: (this.medium || (!this.large && !this.small)),
      search: this._type === 'search',
    };

    if (!this.loading && (this.icon || this.iconLeft)) {
      return html`<gv-icon class="${classMap(classes)}" style="${styleMap(iconStyle)}" shape="${this.icon || this.iconLeft}" @click="${this._onIconClick}"></gv-icon>`;
    }
    return '';
  }

  _renderLoadingIcon () {
    const iconStyle = {
      position: 'absolute',
      bottom: '1px',
      left: this.iconLeft ? '1px' : 'default',
      right: this.iconLeft ? 'default' : '1px',
      padding: this.large ? '5px' : (this.small ? '2px' : '6px'),
      borderRadius: '0 3px 3px 0',
    };

    const classes = {
      small: this.small,
      medium: (this.medium || (!this.large && !this.small)),
      loading: this.loading,
    };

    if (this.loading) {
      return html`<gv-icon class="${classMap(classes)}" style="${styleMap(iconStyle)}" shape="navigation:waiting"></gv-icon>`;
    }
    return '';
  }

  _renderPasswordIcon () {
    const iconStyle = {
      position: 'absolute',
      bottom: '1px',
      right: this.icon ? '40px' : '1px',
      padding: this.large ? '5px' : (this.small ? '2px' : '6px'),
      cursor: 'pointer',
    };

    const classes = {
      small: this.small,
      medium: (this.medium || (!this.large && !this.small)),
      search: this._type === 'search',
    };

    if (!this.disabled) {
      if (this._type === 'password' || (this._type === 'text' && this._showPassword)) {
        return html`<gv-icon class="${classMap(classes)}" style="${styleMap(iconStyle)}" shape="${this._showPassword ? 'general:visible' : 'general:hidden'}" @click="${this._onPasswordIconClick}"></gv-icon>`;
      }
    }
    return '';
  }

  _onPasswordIconClick () {
    this._showPassword = !this._showPassword;
    this._type = this._showPassword ? 'text' : 'password';
    this.requestUpdate();
  }

  render () {
    const classes = {
      skeleton: this.skeleton,
      large: this.large,
      medium: (this.medium || (!this.large && !this.small)),
      small: this.small,
      icon: !!this.icon,
      'icon-left': !!this.iconLeft,
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
            .min="${ifDefined(this.min)}"
            .max="${ifDefined(this.max)}"
            class=${classMap(classes)}
            @input=${this._onInput}
            @keyup="${this._onKeyUp}">
            ${this._renderIcon()}
            ${this._renderLoadingIcon()}
            ${this._renderPasswordIcon()}
        </div>
    `;
  }

}

window.customElements.define('gv-input', GvInput);
