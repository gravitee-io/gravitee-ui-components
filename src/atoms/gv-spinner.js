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
 * Spinner component
 *
 * ## Details
 * @cssprop {Image} [--gv-theme-loader=var(--gv-theme-loader, url('images/gravitee-loader.gif'))] - Spinner image
 */
export class GvSpinner extends LitElement {

  static get styles () {
    return [
      // language=css
      css`
        :host {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          top: 0;
        }

        .spinner {
          display: flex;
          margin: 0 auto;
          position: relative;
          height: 100%;
          width: 100%;
          background-image: var(--gv-theme-loader, url('images/gravitee-loader.gif'));
          background-size: 200px;
          background-repeat: no-repeat;
          background-position: center center;
        }
      `,
    ];
  }

  render () {
    return html`<div class="spinner"></div>`;
  }
}

window.customElements.define('gv-spinner', GvSpinner);
