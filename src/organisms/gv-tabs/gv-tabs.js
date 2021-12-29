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
import '../../molecules/gv-option';
import { dispatchCustomEvent } from '../../lib/events';

/**
 * Tabs component
 *
 * * ## Details
 * * This component use gv-option component to generate tabs.
 *
 * @attr {Array<id: string | {id, title?, icon?, active?, description?, label?}>} options - An array of options for gv-option sub component
 * @slot content - List of elements for tabs content. Should have an id related to options.
 *
 * @attr {String} value - the opened tab id
 * @attr {Boolean} disabled - true if disabled
 * @attr {Boolean} small - true if you want display tabs below of title
 * @attr {Boolean} truncate - true if you want truncate tabs title
 * @attr {Function} validator - a function that's calls when user change tab, this is useful to validate tab change.
 *
 * @cssprop {Length} [--gv-tabs-options--m=0] - Tabs options margin
 */
export class GvTabs extends LitElement {
  static get properties() {
    return {
      options: { type: Array },
      _options: { type: Array, attribute: false },
      value: { type: String, reflect: true },
      validator: { type: Function },
      disabled: { type: Boolean },
      small: { type: Boolean },
      truncate: { type: Boolean },
    };
  }

  static get styles() {
    return [
      // language=css
      css`
        :host {
          box-sizing: border-box;
        }

        ::slotted([slot='content']) {
          opacity: 0;
          box-sizing: border-box;
          transition: opacity 350ms ease-in-out;
          visibility: hidden;
          position: absolute;
          left: -9999px;
          top: -9999px;
        }

        ::slotted([slot='content'].current) {
          opacity: 1;
          visibility: visible;
          position: relative;
          left: auto;
          top: auto;
        }

        .header {
          display: flex;
          border-bottom: 1px solid #d9d9d9;
          box-sizing: border-box;
        }

        .title {
          flex: 1;
          display: flex;
          align-items: center;
        }

        .actions {
          display: flex;
          align-items: center;
        }

        .tabs {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          --gv-option--bdrs: 0;
        }

        :host([small]) .tabs {
          flex-direction: column;
        }

        :host([small]) gv-option {
          align-self: flex-end;
        }

        gv-option {
          margin: var(--gv-tabs-options--m, 0);
        }

        ::slotted(gv-button) {
          padding-bottom: 2px;
        }
      `,
    ];
  }

  _getContent() {
    const content = this.shadowRoot.querySelector('slot[name="content"]');
    return content.assignedNodes();
  }

  firstUpdated() {
    if (this.value == null && this.options != null && this.options.length > 0) {
      this.value = this.options[0].id;
    }
  }

  set options(options) {
    if (options && Array.isArray(options)) {
      this._options = options.map((option) => {
        if (typeof option === 'string') {
          return { id: option, title: option };
        } else if (typeof option === 'object' && option.title == null) {
          return { id: option.id, title: option.id };
        }
        return option;
      });
    }
  }

  get options() {
    return this._options;
  }

  updated() {
    const content = this._getContent();
    content.forEach((c) => c.classList.remove('current'));
    if (this.value) {
      const target = this.querySelector(`#${this.value}`);
      if (target) {
        target.classList.add('current');
      }
    } else {
      content[0].classList.add('current');
    }
  }

  _changeTab(from, content, value) {
    from.classList.remove('current');
    content.classList.add('current');
    this.value = value;
    dispatchCustomEvent(this, 'change', { value, from: from.id, to: content.id });
  }

  _onClick({ detail }) {
    if (!this.disabled) {
      const from = this._getContent().find((e) => e.classList.contains('current'));
      const content = this.querySelector(`#${detail.id}`);
      this.shadowRoot.querySelector('gv-option').value = from.id;
      if (this.validator) {
        this.validator({ from: from.id, to: content.id })
          .then(() => {
            this._changeTab(from, content, detail.id);
          })
          .catch(() => {});
      } else {
        this._changeTab(from, content, detail.id);
      }
    }
  }

  get _contextualOptions() {
    if (this.truncate) {
      return this.options.map((option) => {
        if (this.value !== option.id) {
          const label = option.label || option.title;
          return { ...option, label: label.substring(0, 1) };
        }
        return option;
      });
    }
    return this.options;
  }

  render() {
    return html`<div>
      <div class="header">
        <div class="tabs">
          <slot name="title" class="title"></slot>
          <gv-option small .options="${this._contextualOptions}" @gv-option:select="${this._onClick}" .value="${this.value}"></gv-option>
        </div>
      </div>
      <slot name="content"></slot>
    </div>`;
  }
}

window.customElements.define('gv-tabs', GvTabs);
