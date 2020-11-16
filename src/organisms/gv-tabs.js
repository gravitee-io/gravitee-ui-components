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
import { css, LitElement } from 'lit-element';
import { html } from 'lit-html';
import '../molecules/gv-option';
import { dispatchCustomEvent } from '../lib/events';

/**
 * Tabs component
 *
 * @slot title - The title of tabs (appears on each tabs)
 * @slot tabs - List of elements for tabs. Should have an href attribute with id of linked content
 * @slot content - Lis of elements for tabs content. Should have an id
 *
 * @attr {String} open - the opened tab selector like #myTab
 */
export class GvTabs extends LitElement {

  static get properties () {
    return {
      options: { type: Array },
      value: { type: String, reflect: true },
      validator: { type: Function },
    };
  }

  static get styles () {
    return [
      // language=css
      css`
        :host {
          box-sizing: border-box;
        }

        ::slotted([slot="content"]) {
          opacity: 0;
          box-sizing: border-box;
          transition: opacity 350ms ease-in-out;
          visibility: hidden;
          position: absolute;
          left: -9999px;
          top: -9999px;
        }

        ::slotted([slot="content"].current) {
          opacity: 1;
          visibility: visible;
          position: relative;
          left: auto;
          top: auto;
        }

        .header {
          display: flex;
          border-bottom: 1px solid #D9D9D9;
          box-sizing: border-box;
        }

        .title {
          margin: 0 1rem;
          color: #262626;
          font-size: 18px;
          display: flex;
          align-items: center;
          flex: 1;
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

        gv-option {
          margin: 0;
        }

        ::slotted(gv-button) {
          padding-bottom: 2px;
        }

      `,
    ];
  }

  _getContent () {
    const content = this.shadowRoot.querySelector('slot[name="content"]');
    return content.assignedNodes();
  }

  firstUpdated () {
    if (this.value == null && this.options != null && this.options.length > 0) {
      this.value = this.options[0].id;
    }
  }

  updated () {
    const content = this._getContent();
    content.forEach((c) => c.classList.remove('current'));
    if (this.value) {
      const target = this.querySelector(`#${this.value}`);
      if (target) {
        target.classList.add('current');
      }
    }
    else {
      content[0].classList.add('current');
    }
  }

  _onClick ({ detail }) {
    const from = this._getContent().find((e) => e.classList.contains('current'));
    const content = this.querySelector(`#${detail.id}`);
    if (this.validator) {
      this.shadowRoot.querySelector('gv-option').value = from.id;
      this.validator({ from: from.id, to: content.id })
        .then(() => {
          from.classList.remove('current');
          content.classList.add('current');
          this.value = detail.id;
          dispatchCustomEvent(this, 'change', { value: detail.id, from: from.id, to: content.id });
        })
        .catch(() => {
          this.shadowRoot.querySelector('gv-option').value = from.id;
        });
    }
    else {
      dispatchCustomEvent(this, 'change', { value: detail.id, from: from.id, to: content.id });
    }

  }

  render () {
    return html`<div>
                  <div class="header">
                    <div class="tabs">
                      <gv-option small .options="${this.options}" @gv-option:select="${this._onClick}" .value="${this.value}"></gv-option>
                    </div>
                  </div>
                  <slot name="content"></slot>
                </div>`;
  }

}

window.customElements.define('gv-tabs', GvTabs);
