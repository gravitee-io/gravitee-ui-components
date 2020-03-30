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
import { link } from '../styles/link';
import { dispatchCustomEvent } from '../lib/events';
import './gv-icon';
import { i18n } from '../lib/i18n';
import { InputElement } from '../mixins/input-element';

/**
 *
 * @fires gv-input:input - mirrors native input events with the `value` on `detail`
 * @fires gv-input:clear - event when user clear a clearable input
 *
 * @attr {Boolean} disabled - same as native input element `disabled` attribute
 * @attr {Boolean} required - same as native input element `required` attribute
 * @attr {Boolean} skeleton - enable skeleton screen UI pattern (loading hint)
 * @attr {String} value - the value of the input
 * @attr {String} label - label of the input
 * @attr {String} title - title of the input
 * @attr {String} name - name of the input
 * @attr {String} placeholder - an example value to display in the input when empty
 * @attr {String} type - type of the input, can be text (Default), password, email, search, number, url or clipboard.
 * @attr {Boolean} large - for a large input
 * @attr {Boolean} medium - for a medium input (Default)
 * @attr {Boolean} small - for a small input
 * @attr {String} icon - icon of the input
 * @attr {String} icon-left - icon of the input to display at left
 * @attr {Boolean} valid - if value is valid
 * @attr {Boolean} invalid - if value is invalid
 * @attr {Boolean} [loading=false] - true to display a loading icon
 * @attr {Boolean} [autofocus=false] - true to put the focus on the input
 * @attr {Boolean} [readonly=false] - true if field is readonly mode
 * @attr {String} [autocomplete='off'] - standard autocomplete attribute
 * @attr {Boolean} [clickable=false] - If true, icon has link style
 * @attr {Boolean} [clearable=false] - If true, input can be clear with button
 * @attr {String} [pattern=null] - Pattern for input validation. If type is url, default pattern is ^(http|https)://
 *
 * @cssprop {String} [--gv-input--bdc=var(--gv-theme-neutral-color, #F5F5F5)] - Border color
 * @cssprop {Color} [--gv-input--bds=solid] - Border style
 * @cssprop {Color} [--gv-input-icon--bgc=var(--gv-theme-neutral-color, #F5F5F5)] - Icon background color
 */
export class GvInput extends InputElement(LitElement) {

  static get properties () {
    return {
      ...super.properties,
      type: { type: String },
      large: { type: Boolean },
      medium: { type: Boolean },
      small: { type: Boolean },
      icon: { type: String },
      iconLeft: { type: String, attribute: 'icon-left' },
      loading: { type: Boolean },
      min: { type: Number },
      max: { type: Number },
      autocomplete: { type: String },
      clickable: { type: Boolean },
      clearable: { type: Boolean },
      pattern: { type: String },
      _pattern: { type: String, attribute: false },
      _type: { type: String, attribute: false },
    };
  }

  static get styles () {
    return [
      ...super.styles,
      skeleton,
      input,
      link,
      // language=CSS
      css`
          .clickable {
              cursor: pointer;
          }

          .clickable:hover {
              box-shadow: 0 1px 3px var(--gv-theme-neutral-color-dark, #BFBFBF);
          }

          .copied {
              --gv-icon--c: var(--gv-theme-color, #009B5B);
          }

          .loading {
              animation: spinner 1.6s linear infinite;
          }

          gv-icon.loading {
              background-color: transparent;
          }

          @keyframes spinner {
              to {
                  transform: rotate(360deg);
              }
          }

          input.clipboard:read-only,
          input.clipboard:-moz-read-only {
              cursor: copy;
          }

          input.clipboard:read-only:hover {
              cursor: not-allowed;
          }

      `,
    ];
  }

  static get shapeClipboard () {
    return 'general:clipboard';
  }

  static get shapeCopied () {
    return 'communication:clipboard-check';
  }

  static get shapeSearch () {
    return 'general:search';
  }

  static get shapeClear () {
    return 'code:error';
  }

  static get shapeInvisible () {
    return 'general:invisible';
  }

  static get shapeVisible () {
    return 'general:visible';
  }

  constructor () {
    super();
    this._type = 'text';
    this._showPassword = false;
    this.value = '';
    this.autocomplete = 'off';
  }

  reset () {
    this.value = '';
    this.getInputElement().blur();
  }

  focus () {
    this.getInputElement().focus();
  }

  firstUpdated (changedProperties) {
    super.firstUpdated(changedProperties);
    const clickableIcon = this.shadowRoot.querySelector('gv-icon.link');
    if (clickableIcon) {
      clickableIcon.addEventListener('click', this._onIconClick.bind(this));
    }
    if (this.hasClipboard) {
      this.getInputElement().addEventListener('click', (e) => this.copy(this.value));
    }
  }

  updateState () {
    clearTimeout(this._stateTimer);
    this._stateTimer = setTimeout(() => {
      super.updateState();
      if (this._regexPattern) {
        if (this.value != null && this.value.trim() !== '') {
          const valid = this.value.match(this._regexPattern);
          this.invalid = !valid;
          this.valid = valid;
        }
        else if (!this.required) {
          this.invalid = false;
          this.valid = false;
        }
      }
    }, 200);
  }

  _onInput (e) {
    this.value = e.target.value;
    dispatchCustomEvent(this, 'input', this.value);
    this.updateState();
  }

  _onKeyUp (e) {
    if (e.keyCode === 13) {
      // this.updateState();
      const form = this.closest('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
      dispatchCustomEvent(this, 'submit', this.value);
    }
  }

  get isClearable () {
    return this.clearable && !this.disabled && !this.readonly && !this.loading && this.value != null && this.value !== '';
  }

  set type (value) {
    if (['text', 'password', 'email', 'search', 'number', 'url'].includes(value)) {
      this._type = value;
    }
    if (this._type === 'url') {
      this.pattern = '^(http|https)://';
    }

    if (this._type === 'search' && this.icon == null && this.iconLeft == null) {
      this.icon = GvInput.shapeSearch;
      this.clearable = true;
    }

    if (this._type === 'password') {
      this.icon = GvInput.shapeSearch;
    }

    if (value === 'clipboard') {
      import('clipboard-copy').then((mod) => (this.copy = () => {
        const copy = mod.default;
        copy(this.value);
        this._copied = true;
        this.icon = GvInput.shapeCopied;
        setTimeout(() => {
          this._copied = false;
          this.icon = GvInput.shapeClipboard;
        }, 1000);
      }));
      this.readonly = true;
      this._hasClipboard = true;
      this.icon = GvInput.shapeClipboard;
      this._type = 'text';
    }
  }

  _onIconClick () {
    if (this._type === 'search') {
      this.value = '';
      dispatchCustomEvent(this, 'input', this.value);
    }
    else if (this.hasClipboard) {
      this.copy(this.value);
    }
    else {
      dispatchCustomEvent(this, 'icon-click', this.value);
      dispatchCustomEvent(this, 'submit', this.value);
    }
  }

  _onIconVisibleClick () {
    if (this.isPassword) {
      this._showPassword = !this._showPassword;
      this._type = this._showPassword ? 'text' : 'password';
    }
  }

  get isPassword () {
    return !this.disabled && (this._type === 'password' || (this._type === 'text' && this._showPassword));
  }

  get hasClickableIcon () {
    return !this.disabled && (this.clickable || this._type === 'search' || this._hasClipboard);
  }

  get hasClipboard () {
    return !this.disabled && this._hasClipboard;
  }

  clear () {
    this.focus();
    this.value = null;
    dispatchCustomEvent(this, 'clear');
  }

  _renderClearIcon () {
    if (this.isClearable) {
      return html`<div class="box-icon box-icon-clear">
                    <gv-icon class="link" shape="code:error" title="${i18n('gv-input.clear')}" @click="${this.clear}"></gv-icon>
                  </div>`;
    }
    return '';
  }

  _renderPasswordIcon () {
    if (this.isPassword) {
      const shape = this._showPassword ? 'general:visible' : 'general:hidden';
      const title = this._showPassword ? 'Show' : 'Hide';
      return html`<div class="box-icon">
                    <gv-icon class="link" shape="${shape}" title="${title}" @click="${this._onIconVisibleClick}"></gv-icon>
                  </div>`;
    }
    return '';
  }

  get hasBackground () {
    return !(this.loading);
  }

  _renderIcon () {
    let shape = null;
    if ((!this.isPassword && this.icon) || this.iconLeft) {
      shape = (!this.isPassword && this.icon) || this.iconLeft;
    }
    if (this.loading) {
      shape = 'navigation:waiting';
    }

    if (shape) {
      const classes = {
        'box-icon': true,
        'box-icon-left': this.iconLeft != null || this.clearable,
        'box-icon-bgc': this.hasBackground,
        copied: this.hasClipboard && this._copied,
      };

      const iconClasses = {
        link: this.hasClickableIcon,
        loading: this.loading,
      };
      let title = '';
      if (this._type === 'search') {
        title = i18n('gv-input.search');
      }
      else if (this.hasClipboard) {
        title = i18n('gv-input.copy');
      }
      else if (this.placeholder) {
        title = this.placeholder;
      }
      return html`<div class="${classMap(classes)}">
                    <gv-icon class="${classMap(iconClasses)}" shape="${shape}" title="${title}"></gv-icon>
                  </div>`;
    }
    return '';
  }

  set pattern (value) {
    if (value) {
      this._regexPattern = new RegExp(value);
      this._pattern = value;
    }
    else {
      this._regexPattern = null;
      this._pattern = null;
    }
  }

  render () {
    const classes = {
      skeleton: this.skeleton,
      large: this.large,
      medium: (this.medium || (!this.large && !this.small)),
      small: this.small,
      icon: !!this.icon && !this.clearable,
      clearable: this.clearable,
      'icon-left': !!this.iconLeft || (!!this.icon && this.clearable),
      clipboard: this.hasClipboard,
      required: this.required,
    };

    return html`
      <div class="box-input">
          ${this.renderLabel()}
          <input
            id=${this._id}
            .autocomplete="${this.autocomplete}"
            .type=${this._type}
            .name=${ifDefined(this.name)}
            .title=${ifDefined(this.title || this.label)}
            ?required=${this.required}
            ?readonly="${this.readonly}"
            aria-required=${!!this.required}
            .aria-label="${ifDefined(this.label)}"
            .pattern="${ifDefined(this._pattern)}"
            ?disabled=${this.disabled || this.skeleton}
            .placeholder=${ifDefined(this.placeholder)}
            .value=${ifDefined(this.value)}
            .min="${ifDefined(this.min)}"
            .max="${ifDefined(this.max)}"
            class=${classMap(classes)}
            @input=${this._onInput}
            @keyup="${this._onKeyUp}">
            ${this._renderClearIcon()}
            ${this._renderIcon()}
            ${this._renderPasswordIcon()}
        </div>
    `;
  }

}

window.customElements.define('gv-input', GvInput);
