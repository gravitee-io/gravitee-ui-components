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
import { css, LitElement } from 'lit';
import { html } from 'lit-html';

/**
 * Code hint component
 */
export class GvCodeHint extends LitElement {
  render() {
    return html`<slot></slot>`;
  }

  updated(_changedProperties) {
    super.updated(_changedProperties);
    if (this.firstElementChild != null) {
      const elementNodeListOf = this.firstElementChild.querySelectorAll('.CodeMirror-hint');
      elementNodeListOf.forEach((e) => {
        e.style = 'padding: 4px;border-radius: 2px;white-space: pre;cursor: pointer;';
        if (e.classList.contains('CodeMirror-hint-active')) {
          e.style.backgroundColor = 'var(--gv-theme-color, #5a7684)';
          e.style.color = 'white';
        }
      });
    }
  }

  static get styles() {
    return [
      // language=CSS
      css`
        ::slotted(.CodeMirror-hints) {
          position: absolute;
          z-index: 80;
          overflow: hidden;
          list-style: none;
          margin: 0;
          padding: 2px;
          -webkit-box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.2);
          -moz-box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.2);
          box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.2);
          border-radius: 3px;
          border: 1px solid silver;
          background: white;
          font-family: monospace;
          max-height: 20em;
          overflow-y: auto;
        }
      `,
    ];
  }
}

window.customElements.define('gv-code-hint', GvCodeHint);
