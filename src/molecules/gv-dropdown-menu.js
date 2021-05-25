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

/**
 * Dropdown menu
 *
 * @slot - The element which must be clicked to open the actions
 * @slot actions - Element that contains actions
 *
 * @attr {Boolean} open - true, if menu should be open
 * @attr {Boolean} right - true, if actions should at right of container when opened
 */
export class GvDropdownMenu extends LitElement {
  static get properties() {
    return {
      open: { type: Boolean, reflect: true },
      right: { type: Boolean, reflect: true },
    };
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          display: block;
        }

        .actions {
          position: absolute;
          background-color: white;
          transition: all 300ms ease-in-out;
          border-style: solid;
          border-color: #bfbfbf;
          border-width: var(--gv-dropdown-menu--bdw, 1px 1px 1px 1px);
          z-index: 201;
          padding: var(--gv-dropdown-menu--p, 0.5rem);
          visibility: hidden;
          opacity: 0;
          display: grid;
          grid-gap: var(--gv-dropdown-menu--gg, 0.2rem);
          bottom: 0;
          top: 0;
        }

        :host([open]) .actions {
          opacity: 1;
          visibility: visible;
          cursor: pointer;
        }

        :host([right]) .actions {
          right: 0px;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.open = false;
    this.right = false;
    this._handleDocumentClick = this._onDocumentClick.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    window.removeEventListener('click', this._handleDocumentClick);
    super.disconnectedCallback();
  }

  _onDocumentClick() {
    this.open = false;
    window.removeEventListener('click', this._handleDocumentClick);
  }

  toggle() {
    this.open = !this.open;
    setTimeout(() => {
      if (this.open) {
        window.addEventListener('click', this._handleDocumentClick);
      } else {
        window.removeEventListener('click', this._handleDocumentClick);
      }
    }, 0);
  }

  render() {
    return html`<div class="box">
      <slot @click="${this.toggle}"></slot>
      <div class="actions">
        <slot name="action" class="action"></slot>
      </div>
    </div>`;
  }
}

window.customElements.define('gv-dropdown-menu', GvDropdownMenu);
