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
import '../atoms/gv-icon';

/**
 * Input message component
 *
 * @attr {String} level - level of message ['info', 'error', 'warning']
 */
export class GvInputMessage extends LitElement {
  static get properties() {
    return {
      level: { type: String },
      _level: { type: String, attribute: false },
    };
  }

  constructor() {
    super();
    this._level = 'warning';
  }

  set level(level) {
    if (['error', 'info', 'warning'].includes(level)) {
      this._level = level;
    }
  }

  render() {
    return html`<div class="box"><gv-icon class="${this._level}" shape="code:${this._level}"></gv-icon><slot></slot></div>`;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          display: block;
          margin: 0.2rem;
        }

        .box {
          display: flex;
          align-items: center;
          white-space: normal;
        }

        gv-icon {
          margin: 0 0.2rem;
          --gv-icon--s: 24px;
        }

        gv-icon.warning {
          --gv-icon-opacity--c: var(--gv-theme-color-warning, #ff9800);
        }

        gv-icon.error {
          --gv-icon-opacity--c: var(--gv-theme-color-error, #f44336);
        }

        gv-icon.info {
          --gv-icon-opacity--c: var(--gv-theme-color-info, #2196f3);
        }
      `,
    ];
  }
}

window.customElements.define('gv-input-message', GvInputMessage);
