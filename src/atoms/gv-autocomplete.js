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
import { css, LitElement, unsafeCSS, html } from 'lit';
import { dispatchCustomEvent } from '../lib/events';
import { repeat } from 'lit/directives/repeat';
import { classMap } from 'lit/directives/class-map';
import { styleMap } from 'lit/directives/style-map';

const ENTER_KEY_CODE = 13;
const DOWN_ARROW_KEY_CODE = 40;
const UP_ARROW_KEY_CODE = 38;
const ESCAPE_KEY_CODE = 27;

/**
 * Autocomplete input wrapper
 *
 * ## Details
 * * has @theme facet
 *
 * @fires gv-autocomplete:search - Custom event when user search value
 * @fires gv-autocomplete:select - Custom event when user select value
 * @fires gv-autocomplete:opened - Custom event after opened autocomplete
 *
 * @slot style - The options style
 * @slot input - The input to wrap
 * @slot noOption - What should be shown when there is no options to display
 *
 * @attr {Array.<{value: String, innerHTML?: String}>} options - the options for search
 * @attr {String} value - selected value
 * @attr {String} style - css if you want custom options rendered
 * @attr {Number} minChars - minimum of characters for launch search and show results
 * @attr {Number} size - results size to show before user must scroll
 * @attr {Boolean|Function(value,option)} filter - If true, filter options by input, if function, filter options against it. The function will
 * receive two arguments, inputValue and option, if the function returns true, the option will be included
 * in the filtered set; Otherwise, it will be excluded.
 * the option will be included in the filtered set; Otherwise, it will be excluded.
 *
 * @cssprop {Color} [--gv-autocomplete-hover--bgc=var(--gv-theme-neutral-color-lighter, #fafafa)] - Hover background color
 * @cssprop {Color} [--gv-autocomplete--bgc=var(--gv-theme-neutral-color-lightest, #ffffff)] - Background color
 * @cssprop {Color} [--gv-autocomplete--c=var(--gv-theme-font-color, #262626)] - Color
 */
export class GvAutocomplete extends LitElement {
  static get properties() {
    return {
      options: { type: Array, reflect: true },
      value: { type: String, reflect: true },
      style: { type: String },
      minChars: { type: Number },
      filter: { type: Boolean | Function },
      size: { type: Number },
      _options: { type: Array, attribute: false },
      _forceOpen: { type: Boolean, attribute: false },
    };
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          display: inline-block;
          width: 100%;
        }

        ::slotted(*) {
          width: 100%;
        }

        .container {
          position: relative;
        }

        .container .options.open {
          display: block;
          visibility: visible;
          opacity: 1;
          -webkit-transform: -webkit-translateY(0%);
          transform: translateY(0%);
          z-index: 100;
        }

        .options {
          background-color: var(--gv-autocomplete--bgc, var(--gv-theme-neutral-color-lightest, #ffffff));
          color: var(--gv-autocomplete--c, var(--gv-theme-font-color, #262626));
          margin: 0.2rem;
          position: absolute;
          box-shadow: 0 0 0 1px var(--gv-theme-neutral-color, #f5f5f5), 0 1px 3px var(--gv-theme-neutral-color-dark, #bfbfbf);
          border-radius: 2px;
          display: block;
          width: 100%;
          cursor: pointer;
          left: 0;
          right: 0;
          visibility: hidden;
          opacity: 0;
          -webkit-transform: -webkit-translateY(-2em);
          transform: translateY(-2em);
          -webkit-transition: -webkit-transform 150ms ease-in-out, opacity 150ms ease-in-out;
          -moz-transition: all 150ms ease-in-out;
          -ms-transition: all 150ms ease-in-out;
          -o-transition: all 150ms ease-in-out;
          overflow: auto;
        }

        .option {
          padding: 0.2rem;
          min-height: 30px;
          word-break: break-all;
        }

        .option.match ~ .option.match {
          background-color: transparent;
        }

        .option:hover,
        .option.hover,
        .keyboard .option.hover:hover {
          background-color: var(--gv-autocomplete-hover--bgc, var(--gv-theme-neutral-color-lighter, #fafafa));
        }

        .keyboard .option:hover {
          background-color: transparent;
        }

        .show {
          display: block;
        }

        .hide {
          display: none;
        }
      `,
    ];
  }

  constructor() {
    super();
    this._options = [];
    this._candidateIndex = -1;
    this.minChars = 1;
    this.value = '';
    this.style = '';
    this.filter = false;
    this.size = 5;
    this._handleOpened = this._onOpened.bind(this);
  }

  set options(options) {
    this._options = options;
  }

  get options() {
    return this._options;
  }

  reset() {
    this._getInput().reset();
    this._options = [];
  }

  _getFilteredOptions() {
    if (this.filter && this.value && this.value.length >= this.minChars && this.value !== '*') {
      if (typeof this.filter === 'function') {
        return this._options.filter((option) => {
          return this.filter(this.value, option);
        });
      } else {
        return this._options.filter((option) => {
          return option.value.indexOf(this.value) !== -1;
        });
      }
    } else {
      return this._options;
    }
  }

  _onInput(event) {
    clearTimeout(this._cancellableTimeout);
    this.value = event.target.value;
    if (this.value != null && this.value.trim().length >= this.minChars) {
      this._cancellableTimeout = setTimeout(() => {
        this._open();
        dispatchCustomEvent(this, 'search', this.value);
      }, 200);
    } else {
      this.options = [];
    }
  }

  _onSelect(value, option) {
    if (option == null) {
      option = this._options.find((option) => {
        return option.value === value;
      });
    }
    this.value = this._getInput().value = value;
    this._close();
    dispatchCustomEvent(this, 'select', option);
  }

  _onMouseOver() {
    this.shadowRoot.firstElementChild.classList.remove('keyboard');
    this._clearHover();
    this._shouldSelect = true;
  }

  _onMouseLeave() {
    this._shouldSelect = false;
  }

  _renderOption(option) {
    if (option.element) {
      return option.element;
    }
    if (option.innerHTML) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = option.innerHTML;
      return wrapper;
    }
    return option.value;
  }

  _renderStyle() {
    if (this.style) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = unsafeCSS(this.style);
      return wrapper;
    }
    return '';
  }

  _hasNoOptionSlot() {
    for (const node of this.childNodes) {
      if (node.slot === 'noOption') {
        return true;
      }
    }
    return false;
  }

  render() {
    const options = this._getFilteredOptions();
    let open = false;

    if (options && options.length > 0 && this._forceOpen) {
      open = this.minChars === 0 || this.value.trim().length >= this.minChars;
    }

    const input = this._getInput();
    let top = 0;
    if (input != null) {
      top = input.offsetHeight;
    }

    const classes = {
      options: true,
      open,
    };

    return html` <div class="container">
      ${this._renderStyle()}
      <slot></slot>
      ${this._hasNoOptionSlot() && this._forceOpen
        ? html`<div class="options open" style="${styleMap({ top: `${top}px` })}">
            <slot name="noOption" class="${!options || options.length === 0 ? 'show' : 'hide'}"></slot>
          </div>`
        : ''}
      <div class="${classMap(classes)}" @mouseleave="${this._onMouseLeave}" style="${styleMap({ top: `${top}px` })}">
        ${repeat(
          options,
          (option) => option,
          (option, index) => html`
            <div
              class="${classMap({ option: true })}"
              data-value="${option.value}"
              @mouseover="${() => this._onMouseOver(option, index)}"
              @click="${() => this._onSelect(option.value, option)}"
            >
              ${this._renderOption(option)}
            </div>
          `,
        )}
      </div>
    </div>`;
  }

  _clearHover() {
    this.shadowRoot.querySelectorAll('.option.hover').forEach((o) => o.classList.remove('hover'));
  }

  _updateHover() {
    this._clearHover();
    if (this._candidateIndex > -1) {
      this.shadowRoot.firstElementChild.classList.add('keyboard');
      const candidate = this.shadowRoot.querySelectorAll('.option')[this._candidateIndex];
      if (candidate) {
        const options = this.shadowRoot.querySelector('.options');
        const { top, left } = candidate.getBoundingClientRect();
        const container = options.getBoundingClientRect();
        const scrollLeft = left - container.left;
        const scrollTop = top - container.top;
        options.scrollTo(scrollLeft, scrollTop);
        candidate.classList.add('hover');
      }
    }
  }

  _onKeydown(e) {
    switch (e.keyCode) {
      case ENTER_KEY_CODE: {
        const options = this.shadowRoot.querySelectorAll('.option');
        const candidate = options[this._candidateIndex];
        if (candidate) {
          e.preventDefault();
          e.stopPropagation();
          this._candidateIndex = -1;
          this._onSelect(candidate.getAttribute('data-value'));
          this._updateHover();
        }
        this._close();
        break;
      }

      case DOWN_ARROW_KEY_CODE: {
        if (this._candidateIndex < this.shadowRoot.querySelectorAll('.option').length - 1) {
          e.preventDefault();
          e.stopPropagation();
          this._candidateIndex += 1;
          this._updateHover();
        }
        break;
      }

      case UP_ARROW_KEY_CODE: {
        if (this._candidateIndex > 0) {
          e.preventDefault();
          e.stopPropagation();
          this._candidateIndex -= 1;
          this._updateHover();
        }
        break;
      }

      case ESCAPE_KEY_CODE: {
        e.preventDefault();
        e.stopPropagation();
        this._candidateIndex = -1;
        this._updateHover();
        break;
      }
      default:
        this.value = this._getInput().value;
        this._candidateIndex = -1;
        this._updateHover();
    }
  }

  _open() {
    this._forceOpen = true;
    dispatchCustomEvent(this, 'opened', { target: this });
  }

  _close() {
    this._forceOpen = false;
  }

  _onFocus() {
    this._open();
  }

  _onBlur() {
    // Important when using custom HTML in options
    if (this._shouldSelect === false) {
      this._close();
    }
  }

  _getInput() {
    for (const node of this.childNodes) {
      if (node.slot === 'input') {
        return node;
      }
    }
    return this.firstElementChild;
  }

  _onClear(event) {
    this.value = event.target.value;
  }

  updated() {
    setTimeout(() => {
      const firstOption = this.shadowRoot.querySelector('.option');
      if (firstOption) {
        const maxHeight = firstOption.clientHeight * parseInt(this.size, 10);
        const options = this.shadowRoot.querySelector('.options');
        options.style.maxHeight = `${maxHeight}px`;
        options.scrollTo(0, 0);
      }
    }, 0);
  }

  firstUpdated() {
    this._handlers = {
      input: this._onInput.bind(this),
      focus: this._onFocus.bind(this),
      blur: this._onBlur.bind(this),
      keydown: this._onKeydown.bind(this),
      clear: this._onClear.bind(this),
    };
    this.shadowRoot.addEventListener('input', this._handlers.input);
    this.shadowRoot.addEventListener('keydown', this._handlers.keydown);
    const input = this._getInput();
    input.addEventListener('focus', this._handlers.focus);
    input.addEventListener('blur', this._handlers.blur);
    input.addEventListener('gv-input:clear', this._handlers.clear);
    if (input.tagName.toLowerCase() === 'gv-input') {
      input.setAttribute('no-submit', true);
    }
  }

  _onOpened({ detail }) {
    if (detail.target !== this) {
      this._close();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('gv-autocomplete:opened', this._handleOpened);
  }

  disconnectedCallback() {
    if (this._handlers) {
      this.shadowRoot.removeEventListener('input', this._handlers.input);
      this.shadowRoot.removeEventListener('keydown', this._handlers.keydown);
      const input = this._getInput();
      input.removeEventListener('focus', this._handlers.focus);
      input.removeEventListener('blur', this._handlers.blur);
      input.removeEventListener('gv-input:clear', this._handlers.clear);
    }
    window.removeEventListener('gv-autocomplete:open', this._handleOpened);
    super.disconnectedCallback();
  }
}

window.customElements.define('gv-autocomplete', GvAutocomplete);
