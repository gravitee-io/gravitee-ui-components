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

import { LitElement, html, css } from 'lit';
import { skeleton } from '../styles/skeleton';
import { input } from '../styles/input';
import { link } from '../styles/link';
import { dispatchCustomEvent } from '../lib/events';
import './gv-icon';
import '../molecules/gv-popover';
import { i18n } from '../lib/i18n';
import { InputElement } from '../mixins/input-element';
import { shapeClipboard, shapeCopied } from '../styles/shapes';

/**
 *
 * ## Details
 * * has @theme facet
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
 * @attr {String} description - a description
 * @attr {String} type - type of the input, can be text (Default), password, email, search, number, url.
 * @attr {Boolean} clipboard - for readonly input with clipboard
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
 * @attr {Boolean} [no-submit=false] - If true, input cannot dispatch native submit event on enter key press to closest form
 * @attr {String} [pattern=null] - Pattern for input validation. If type is url, default pattern is ^(http|https)://
 *
 * @cssprop {String} [--gv-input--bdc=var(--gv-theme-neutral-color, #F5F5F5)] - Border color
 * @cssprop {Color} [--gv-input--bds=solid] - Border style
 * @cssprop {Color} [--gv-input-icon--bgc=var(--gv-theme-neutral-color, #F5F5F5)] - Icon background color
 */
export class GvInput extends InputElement(LitElement) {
  static get properties() {
    return {
      ...super.properties,
      type: { type: String, reflect: true },
      large: { type: Boolean },
      medium: { type: Boolean },
      small: { type: Boolean },
      icon: { type: String },
      iconLeft: { type: String, attribute: 'icon-left' },
      loading: { type: Boolean },
      min: { type: Number },
      max: { type: Number },
      autocomplete: { type: String },
      clipboard: { type: Boolean },
      clickable: { type: Boolean },
      clearable: { type: Boolean },
      noSubmit: { type: Boolean, attribute: 'no-submit' },
      pattern: { type: String, reflect: true },
      description: { type: String },
      _type: { type: String, attribute: false },
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
        .clickable input,
        .clickable ::slotted(input) {
          cursor: pointer;
        }

        .clickable input:hover,
        .clickable ::slotted(input:hover) {
          box-shadow: 0 1px 3px var(--gv-theme-neutral-color-dark, #bfbfbf);
        }

        gv-icon {
          --gv-icon--s: 22px;
        }

        .box-icon.copied gv-icon {
          --gv-icon--c: #339900;
        }

        div.box-icon gv-icon.loading,
        .loading ::slotted(input) {
          animation: spinner 1.6s linear infinite;
          --gv-icon--s: 20px;
        }

        .loading.small gv-icon {
          --gv-icon--s: 18px;
        }

        @keyframes spinner {
          to {
            transform: rotate(360deg);
          }
        }

        .clipboard input,
        .clipboard ::slotted(input) {
          cursor: copy;
        }

        .clipboard input:read-only:hover,
        .clipboard ::slotted(input:read-only:hover) {
          cursor: not-allowed;
        }

        .clipboard__popover {
          --gv-popover--bgc: var(--gv-theme-color-darker, #383e3f);
          --gv-popover--c: var(--gv-theme-font-color-light, #ffffff);
          --gv-popover--p: 0rem 0.4rem 0rem 0.2rem;
          font-size: 11px;
        }

        .clipboard__popover-content {
          display: flex;
          justify-content: center;
          align-items: center;
          --gv-icon--c: var(--gv-theme-font-color-light, #ffffff);
        }
      `,
    ];
  }

  static get shapeSearch() {
    return 'general:search';
  }

  static get shapeClear() {
    return 'code:error';
  }

  static get shapeInvisible() {
    return 'general:invisible';
  }

  static get shapeVisible() {
    return 'general:visible';
  }

  constructor() {
    super();
    this._type = 'text';
    this._showPassword = false;
    this.value = '';
    this.autocomplete = 'off';
    this.noSubmit = false;
  }

  reset() {
    this.value = '';
    this.getInputElement().blur();
  }

  focus() {
    this.getInputElement().focus();
  }

  getInputElement() {
    return this._input || super.getInputElement();
  }

  updated(changedProperties) {
    if (changedProperties.has('_type')) {
      this.getInputElement().type = this._type;
    }

    if (changedProperties.has('autocomplete')) {
      this.getInputElement().autocomplete = this.autocomplete;
    }

    if (changedProperties.has('name') && this.name != null) {
      this.getInputElement().name = this.name;
    }

    if (changedProperties.has('required')) {
      this.getInputElement().required = this.required;
      this.getInputElement()['aria-required'] = !!this.required;
      if (this.value == null || this.value.trim() === '') {
        this.invalid = true;
      }
    }

    if (this.readonly) {
      this.getInputElement().setAttribute('readonly', true);
    } else {
      this.getInputElement().removeAttribute('readonly');
    }

    if (changedProperties.has('label') || changedProperties.has('title')) {
      const title = this.title || this.label;
      if (title != null) {
        this.getInputElement().title = title;
      }
    }

    if (changedProperties.has('label') && this.label) {
      this.getInputElement()['aria-label'] = this.label;
    }

    if (changedProperties.has('pattern')) {
      this.getInputElement().pattern = this.pattern;
      this._regexPattern = new RegExp(this.pattern);
    }

    if (changedProperties.has('disabled') || changedProperties.has('skeleton')) {
      this.getInputElement().disabled = this.disabled || this.skeleton;
    }

    if (changedProperties.has('placeholder') && this.placeholder != null) {
      this.getInputElement().placeholder = this.placeholder;
    }

    if (changedProperties.has('value')) {
      this.getInputElement().value = this.value;
      this.updateState(this.value);
    }

    if (changedProperties.has('min') && this.min != null) {
      this.getInputElement().min = this.min;
    }

    if (changedProperties.has('max') && this.max != null) {
      this.getInputElement().max = this.max;
    }
  }

  _setClipboardIcon(shape) {
    if (this.icon != null && this.icon !== shapeCopied && this.icon !== shapeClipboard) {
      this.iconLeft = shape;
    } else {
      this.icon = shape;
    }
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);

    const defaultInputElement = this.getInputElement();
    for (const node of this.childNodes) {
      if (node.nodeType === 1) {
        const child = node.nodeName.toLowerCase() === 'input' ? node : node.querySelector('input');
        if (child) {
          this._input = child;
          break;
        }
      }
    }
    if (this._input) {
      defaultInputElement.remove();
    }

    if (this.clipboard) {
      import('clipboard-copy').then(
        (mod) =>
          (this.copy = () => {
            const copy = mod.default;
            copy(this.value);
            this._copied = true;
            this._setClipboardIcon(shapeCopied);
            setTimeout(() => {
              this._copied = false;
              this._setClipboardIcon(shapeClipboard);
            }, 1000);
          }),
      );
      this._setClipboardIcon(shapeClipboard);

      setTimeout(() => {
        const clipboardPopover = this.shadowRoot.querySelector('.clipboard__popover');
        if (this.readonly) {
          this.getInputElement().addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            clipboardPopover.click();
          });
        }
        clipboardPopover.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.copy(this.value);
        });
      }, 0);
    } else {
      const clickableIcon = this.shadowRoot.querySelector('gv-icon.link');
      if (clickableIcon) {
        clickableIcon.addEventListener('click', this._onIconClick.bind(this));
      }
    }

    this.getInputElement().id = this._id;
    this.getInputElement().addEventListener('input', this._onInput.bind(this));
    this.getInputElement().addEventListener('keyup', this._onKeyUp.bind(this));
    this.getInputElement().addEventListener('keypress', this._onKeyPress.bind(this));
  }

  updateState(value) {
    super.updateState(value);
    if (this.valid === true && !this.readonly) {
      if (this._regexPattern) {
        if (value != null && value.trim() !== '') {
          const valid = value.match(this._regexPattern);
          this.setValidity(valid == null, `field not respect the pattern ${this._regexPattern}`);
        }
      } else if (this._type === 'number' && value != null && (typeof value === 'number' || value.trim() !== '')) {
        const _value = Number(value).valueOf();
        if (isNaN(_value)) {
          this.setValidity(true, `field is not number`);
        } else if (this.min != null && this.min > _value) {
          this.setValidity(true, `field is < ${this.min}`);
        } else if (this.max != null && this.max < _value) {
          this.setValidity(true, `field is > ${this.max}`);
        } else {
          this.setValidity(false);
        }
      }
    }
  }

  _onInput(e) {
    this.updateState(e.target.value);
    this.value = e.target.value;
    dispatchCustomEvent(this, 'input', this.value);
  }

  _onKeyPress(e) {
    if (this._type === 'number') {
      let key;
      if (e.type === 'paste') {
        key = e.clipboardData.getData('text/plain');
      } else {
        key = String.fromCharCode(e.keyCode);
      }

      let regex = /[0-9]/;
      if (this.min == null || this.min < 0) {
        regex = /[0-9-]/;
      }
      if (!regex.test(key)) {
        e.preventDefault();
      }
    }
  }

  _onKeyUp(e) {
    if (e.keyCode === 13) {
      if (!this.noSubmit) {
        const form = this.closest('form');
        if (form) {
          form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }
      }
      dispatchCustomEvent(this, 'submit', this.value);
    }
  }

  get isClearable() {
    return this.clearable && !this.disabled && !this.readonly && !this.loading && this.value != null && this.value !== '';
  }

  set type(value) {
    if (['text', 'password', 'email', 'search', 'number', 'url'].includes(value)) {
      this._type = value;
    }
    if (this._type === 'url') {
      this.pattern = '(https?://.w*)(:\\d*)?\\/?(.*)';
    }

    if (this._type === 'email') {
      this.pattern =
        /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    }

    if (this._type === 'search' && this.icon == null && this.iconLeft == null) {
      this.icon = GvInput.shapeSearch;
      this.clearable = true;
    }

    if (this._type === 'password') {
      this.icon = GvInput.shapeSearch;
    }
  }

  get type() {
    return this._type;
  }

  _onIconClick() {
    dispatchCustomEvent(this, 'icon-click', this.value);
    dispatchCustomEvent(this, 'submit', this.value);
  }

  _onIconVisibleClick(e) {
    if (this.isPassword) {
      e.preventDefault();
      e.stopPropagation();
      this._showPassword = !this._showPassword;
      this._type = this._showPassword ? 'text' : 'password';
    }
  }

  get isPassword() {
    return !this.disabled && (this._type === 'password' || (this._type === 'text' && this._showPassword));
  }

  get hasClickableIcon() {
    return !this.disabled && !this.readonly && (this.clickable || this._type === 'search' || this.clipboard);
  }

  get hasClipboard() {
    return !this.disabled && this.clipboard;
  }

  clear() {
    this.focus();
    this.value = '';
    dispatchCustomEvent(this, 'clear', this.value);
  }

  _renderClearIcon() {
    if (this.isClearable) {
      return html`<div class="box-icon box-icon-clear">
        <gv-icon class="link" shape="code:error" title="${i18n('gv-input.clear')}" @click="${this.clear}"></gv-icon>
      </div>`;
    }
    return '';
  }

  _shapePassword() {
    return this._showPassword ? 'general:visible' : 'general:hidden';
  }

  _renderPasswordIcon() {
    if (this.isPassword) {
      const shape = this._shapePassword();
      const title = this._showPassword ? 'Show' : 'Hide';
      return html`<div class="box-icon">
        <gv-icon class="link" shape="${shape}" title="${title}" @click="${this._onIconVisibleClick}"></gv-icon>
      </div>`;
    }
    return '';
  }

  get hasBackground() {
    return !this.loading;
  }

  _renderIcon() {
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
      } else if (this.hasClipboard) {
        title = i18n('gv-input.copy');
        return html`<div class="${classMap(classes)}">
          <gv-popover class="clipboard__popover" event="click" delay="750" .arrow="${false}">
            <gv-icon class="${classMap(iconClasses)}" shape="${shape}" title="${title}"></gv-icon>
            <div slot="popover" class="clipboard__popover-content">
              <gv-icon shape="code:check"></gv-icon>
              <div>Copied</div>
            </div>
          </gv-popover>
        </div>`;
      } else if (this.placeholder) {
        title = this.placeholder;
      }
      return html`<div class="${classMap(classes)}">
        <gv-icon class="${classMap(iconClasses)}" shape="${shape}" title="${title}"></gv-icon>
      </div>`;
    }
    return '';
  }

  render() {
    const classes = {
      'box-input': true,
      skeleton: this.skeleton,
      large: this.large,
      medium: this.medium || (!this.large && !this.small),
      small: this.small,
      icon: !!this.icon && !this.clearable,
      clearable: this.clearable,
      'icon-left': !!this.iconLeft || (!!this.icon && this.clearable),
      clipboard: this.hasClipboard,
      required: this.required,
    };

    return html`
      <div class="${classMap(classes)}">
        ${this.renderLabel()}
        <input />
        <slot></slot>
        ${this._renderClearIcon()} ${this._renderIcon()} ${this._renderPasswordIcon()}
      </div>
      ${this.description != null ? html`<div class="description" .innerHTML="${this.description}"></div>` : ''}
    `;
  }
}

window.customElements.define('gv-input', GvInput);
