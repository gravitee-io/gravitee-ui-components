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
import { LitElement, html, css } from 'lit';
import { dispatchCustomEvent } from '../../lib/events';
import { classMap } from 'lit/directives/class-map';
import { ifDefined } from 'lit/directives/if-defined';
import { skeleton } from '../../styles/skeleton';

/**
 * An image
 *
 * ## Details
 * * has @theme facet
 *
 * @fires gv-image:loaded - When image is loaded
 *
 * @attr {String} src - Source of img
 * @attr {String} alt - Alternative text of img
 * @attr {Boolean} skeleton - enable skeleton screen UI pattern (loading hint)
 *
 * @cssprop {String} [--gv-image--of=cover] - set the object-fit of image
 */
export class GvImage extends LitElement {
  static get properties() {
    return {
      src: { type: String },
      skeleton: { type: Boolean, reflect: true },
      alt: { type: String },
      _loaded: { type: Boolean, reflect: true },
      _error: { type: Boolean },
    };
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: inline-block;
          overflow: hidden;
        }

        .wrapper,
        img {
          height: 100%;
          width: 100%;
          transition: opacity 0.3s ease-in-out;
        }

        .wrapper {
          align-items: center;
          display: flex;
          justify-content: center;
          position: relative;
        }

        .wrapper.text:not('.skeleton') {
          background-color: var(--gv-theme-neutral-color);
        }

        img {
          display: block;
          object-fit: var(--gv-image--of, cover);
          object-position: center center;
          opacity: 0;
          position: absolute;
          top: 0;
          transition: opacity 150ms ease-in-out;
          left: 0;
        }

        .wrapper.loaded img {
          opacity: 1;
        }

        .error-msg {
          font-size: 0.9rem;
          overflow: hidden;
          padding: 0.25rem;
          text-align: center;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `,
      skeleton,
    ];
  }

  constructor() {
    super();
    this.skeleton = false;
    this._error = false;
    this._loaded = false;
  }

  set src(newVal) {
    const oldVal = this._src;
    this._src = newVal;
    this.requestUpdate('src', oldVal);
    this._error = false;
    this._loaded = false;
  }

  get src() {
    return this._src;
  }

  _onLoad(e) {
    this._loaded = true;
    this.skeleton = false;
    dispatchCustomEvent(this, 'loaded', { src: this.src, alt: this.alt });
  }

  _onError(e) {
    this._error = true;
    this.skeleton = false;
    this.dispatchEvent(new Event('error'), e);
  }

  render() {
    const displayText = this.src == null || this._error;
    return html`
      <div class="wrapper ${classMap({ skeleton: this.skeleton, loaded: this._loaded, text: displayText })}">
        <img src=${ifDefined(this.src)} @load=${this._onLoad} @error=${this._onError} alt="" />
        ${displayText ? html` <div class="error-msg">${this.alt}</div> ` : ''}
      </div>
    `;
  }
}

window.customElements.define('gv-image', GvImage);
