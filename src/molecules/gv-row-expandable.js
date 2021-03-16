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
import { css, html, LitElement } from 'lit-element';

/**
 * Expandable row
 *
 * @attr {Boolean} open - When true, opens details by default
 *
 */
export class GvRowExpandable extends LitElement {
  constructor() {
    super();
    this.open = false;
  }

  static get properties() {
    return {
      open: { type: 'boolean' },
    };
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
        }

        .row {
          padding: 0.2rem;
          cursor: pointer;
          line-height: 23px;
          border-bottom: thin solid var(--gv-theme-color, #5a7684);
        }

        .row:hover {
          background-color: var(--gv-theme-neutral-color, #f5f5f5);
        }

        .closed {
          display: none;
        }

        .opened {
          display: block;
        }

        .summary {
          display: flex;
          flex-direction: row;
          align-content: center;
          justify-content: space-between;
        }

        .show-more {
          align-self: center;
          margin-left: 5px;
          --gv-icon--s: 16px;
          background-color: var(--gv-theme-neutral-color-light, #efefef);
        }

        .show-more:hover {
          background-color: var(--gv-theme-neutral-color-dark, #d9d9d9);
        }
      `,
    ];
  }

  _onClick() {
    this.open = !this.open;
  }

  render() {
    const toggleCss = this.open ? 'opened' : 'closed';

    return html`<div class="row" @click=${this._onClick}>
      <div class="summary">
        <slot name="summary"></slot>

        <gv-icon shape="general:other#2" class="show-more"></gv-icon>
      </div>
      <slot name="details" class="details ${toggleCss}"></slot>
    </div>`;
  }
}

window.customElements.define('gv-row-expandable', GvRowExpandable);
