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
import { css, LitElement, html } from 'lit';
import '../atoms/gv-button';
import { repeat } from 'lit/directives/repeat';
import { classMap } from 'lit/directives/class-map';
import { dispatchCustomEvent } from '../lib/events';
import { ifDefined } from 'lit/directives/if-defined';
import { styleMap } from 'lit/directives/style-map';

/**
 * Option component
 *
 * ## Details
 * * has @theme facet
 *
 * @attr {Array<{id, title, icon?, active?, description?, label?}>} options - An array of options.
 * @attr {String|Array} value - Selected value id, array with multiple option ids.
 * @attr {Boolean} multiple - If true, can choose several option
 * @attr {Boolean} reverse - If true, title and description are reversed.
 * @attr {Boolean} small - If true, use small button for options
 * @attr {Boolean} outlined - If true, use outlined button for options
 *
 * @cssprop {Color} [--gv-option--bgc=var(--gv-theme-neutral-color-dark, #bfbfbf)] - Background color
 * @cssprop {Length} [--gv-option--bdrs=0.15rem] - Border radius
 * @cssprop {Length} [--gv-option-button--maw=200px] - Button max width
 * @cssprop {Length} [--gv-option-icon--s=64px] - Icon size
 */
export class GvOption extends LitElement {
  static get properties() {
    return {
      options: { type: Array },
      _options: { type: Array, attribute: false },
      _hasDescription: { type: Array, attribute: false },
      value: { type: String, reflect: true },
      multiple: { type: Boolean },
      reverse: { type: Boolean },
      small: { type: Boolean },
      outlined: { type: Boolean },
      disabled: { type: Boolean, reflect: true },
    };
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          display: inline-block;
          --gv-button--p: 5px;
          margin: 0.2rem;
          --bdrs: var(--gv-option--bdrs, 0.15rem);
          --maw: var(--gv-option-button--maw, 200px);
        }

        .box.description {
          display: grid;
          grid-gap: 0.5rem;
        }

        gv-button {
          margin: 0;
        }

        gv-button.description {
          flex: 1 1 var(--maw);
          max-width: var(--maw);
        }

        gv-button:not(.description) {
          margin: 0;
          --gv-button--bdrs: 0;
          --gv-button--bgc: var(--gv-option--bgc, var(--gv-theme-neutral-color-dark, #bfbfbf));
        }

        gv-button:not(.description).entry {
          --gv-button--bdrs: var(--bdrs) 0 0 var(--bdrs);
        }

        gv-button:not(.description).exit {
          --gv-button--bdrs: 0 var(--bdrs) var(--bdrs) 0;
        }

        .content {
          white-space: pre-line;
          --gv-icon--s: var(--gv-option-icon--s, 64px);
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          text-transform: none;
        }

        gv-image {
          height: 64px;
          width: 64px;
          --gv-image--of: fill;
          display: inline-flex;
        }

        .reverse .content {
          flex-direction: column-reverse;
        }

        .title {
          font-size: var(--gv-theme-font-size-l, 18px);
          font-weight: bold;
          margin: 0.5rem 0;
        }

        gv-button.description {
          margin: 0.5rem;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.multiple = false;
    this.reverse = false;
  }

  _onClick(option) {
    this.setValue(option);
    dispatchCustomEvent(this, 'select', option);
    this.dispatchEvent(new Event('input'), { bubbles: true, cancelable: true });
  }

  async performUpdate() {
    this.shadowRoot.querySelectorAll('gv-button').forEach((btn) => btn.performUpdate());
    return super.performUpdate();
  }

  setValue(option) {
    if (option) {
      if (this.multiple) {
        if (this.value.includes(option.id)) {
          this.value = this.value.filter((optId) => {
            return optId !== option.id;
          });
        } else {
          this.value = [...this.value, option.id];
        }
      } else {
        this.value = option.id;
      }
    }
  }

  set options(options) {
    if (options) {
      Promise.all(options).then((_options) => {
        this._options = _options;
        this._hasDescription = this._options.find((opt) => opt.description != null) != null;
      });
    }
  }

  isActive(option) {
    if (this.value) {
      if (this.multiple) {
        return this.value.includes(option.id);
      } else {
        return this.value === option.id;
      }
    }
    return false;
  }

  _renderOption(option, index) {
    const isActive = this.isActive(option);
    const outlined = this.outlined || (!isActive && this._hasDescription);
    return html`<gv-button
      .icon=${ifDefined(!this._hasDescription ? option.icon : null)}
      .iconRight=${ifDefined(!option.icon && option.iconRight ? option.iconRight : null)}
      .title="${ifDefined(option.title)}"
      .primary="${isActive}"
      .small="${this.small}"
      .disabled="${option.disabled || this.disabled}"
      @click="${this._onClick.bind(this, option)}"
      .outlined="${outlined}"
      class="${classMap({
        active: isActive,
        entry: index === 0,
        exit: index === this._options.length - 1,
        description: option.description != null,
      })}"
    >
      ${!this._hasDescription
        ? option.title != null
          ? option.label || option.title
          : ''
        : html`<div class="content">
            ${option.icon
              ? html`<gv-icon shape="${option.icon}"></gv-icon>`
              : option.image
              ? html`<gv-image src="${option.image}"></gv-image>`
              : ''}
            <div class="title">${option.title}</div>
            <div class="description-content" .innerHTML="${option.description}"></div>
          </div>`}
    </gv-button>`;
  }

  render() {
    if (this._options) {
      const classes = {
        box: true,
        description: this._hasDescription,
        reverse: this.reverse,
      };
      return html`<div
        class="${classMap(classes)}"
        style="${styleMap({ 'grid-template-columns': `repeat(${this._options.length}, auto)` })}"
      >
        ${repeat(
          this._options,
          (option) => option,
          (option, index) => html`${this._renderOption(option, index)}`,
        )}
      </div>`;
    }
    return html``;
  }
}

window.customElements.define('gv-option', GvOption);
