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
import { skeleton } from '../styles/skeleton.js';
import { until } from 'lit-html/directives/until';

/**
 * Spinner component
 *
 * @attr {String} src - Source of spinner img
 *
 * @cssprop {String} [--gv-spinner--h=auto] - set the height of image
 * @cssprop {String} [--gv-spinner--w=auto] - set the width of image
 */
export class GvSpinner extends LitElement {

  static get properties () {
    return {
      src: { type: String },
    };
  }

  static get styles () {
    return [
      skeleton,
      // language=css
      css`
        :host {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          top: 0;
        }

        img {
          display: flex;
          margin: 0 auto;
          position: relative;
          top: 40%;
          height: var(--gv-spinner--h, auto);
          width: var(--gv-spinner--w, auto);
        }
      `,
    ];
  }

  render () {
    return this.src ? html`<img src="${until(this.src, '')}">` : '';
  }
}

window.customElements.define('gv-spinner', GvSpinner);
