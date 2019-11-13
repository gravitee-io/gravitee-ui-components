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
import { LitElement, html, css } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events';
import { skeleton } from '../styles';
import '../atoms/gv-icon';

/**
 * An image
 *
 * @fires gv-image:loaded - When image is loaded
 *
 * @attr {String} src - Source of img
 * @attr {String} alt - Alternative text of img
 * @attr {Boolean} loaded - Indicate if img is loaded
 *
 * @cssprop {String} --gv-image--h - set the height of image
 * @cssprop {String} --gv-image--w - set the width of image
 * @cssprop {String} --gv-image--bd - set the border of image
 * @cssprop {String} --gv-image--bdrs - set the border radius of image
 * @cssprop {String} --gv-image--of - set the object-fit of image
 */
export class GvImage extends LitElement {

  static get properties () {
    return {
      src: { type: String },
      alt: { type: String },
      loaded: { type: Boolean, reflect: true },
    };
  }

  static get styles () {
    return [
      skeleton,
      // language=CSS
      css`
          :host {
              --gv-icon--w: var(--gv-image--w, 128);
              --gv-icon--h: var(--gv-image--h, 128);
              --gv-icon--c: #777;
              box-sizing: border-box;
              margin: 0.2rem;
              vertical-align: middle;
              position: relative;
              display: block;
          }

          img, .placeholder {
              transition: opacity 0.3s ease-in-out;
              object-fit: var(--gv-image--of, contain);
              border: var(--gv-image--bd, none);
              border-radius: var(--gv-image--bdrs, none);
          }

          :host([loaded]) img {
              overflow: hidden;
              width: var(--gv-image--w, 100%);
              height: var(--gv-image--h, 100%);
          }

          .placeholder, :host([loaded]) img {
              opacity: 1;
          }

          .placeholder {
              position: absolute;
              top: 0;
              left: 0;
          }

          img, :host([loaded]) .placeholder {
              opacity: 0;
          }

          :host([loaded]) .placeholder {
              visibility: hidden;
          }

          .skeleton {
              border-color: #777;
              color: #262626;
          }

      `,
    ];
  }

  _onLoad () {
    this.loaded = true;
    dispatchCustomEvent(this, 'loaded', { src: this.src, alt: this.alt });
  }

  _renderImage () {
    if (this.src) {
      return html`<img src="${this.src}" alt="${this.alt}" @load="${this._onLoad}" @error="${this._onLoad}">`;
    }
  }

  render () {
    return html`${this._renderImage()}<div class="placeholder skeleton"><gv-icon shape="design:image"></gv-icon></div>`;
  }

}

window.customElements.define('gv-image', GvImage);
