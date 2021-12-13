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
import { skeleton } from '../styles/skeleton';

/**
 * Scroll layout component
 *
 * ## Details
 * * has @theme facet
 *
 */
export class GvScrollLayout extends LitElement {
  static get properties() {
    return {
      skeleton: { type: Boolean },
    };
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }
      `,
      skeleton,
    ];
  }

  render() {
    return html`<div class="scroll-layout">Hello there !</div>`;
  }
}

window.customElements.define('gv-scroll-layout', GvScrollLayout);
