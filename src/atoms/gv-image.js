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
import { skeleton } from '../styles/skeleton';
import './gv-icon';
import { until } from 'lit-html/directives/until';

/**
 * An image
 *
 * @fires gv-image:loaded - When image is loaded
 *
 * @attr {String} src - Source of img
 * @attr {String} alt - Alternative text of img
 * @attr {Boolean} loaded - Indicate if img is loaded
 *
 * @cssprop {String} [--gv-image--h=128px] - set the height of image
 * @cssprop {String} [--gv-image--w=128px] - set the width of image
 * @cssprop {String} [--gv-image--bd=none] - set the border of image
 * @cssprop {String} [--gv-image--bdrs=none] - set the border radius of image
 * @cssprop {String} [--gv-image--of=contain] - set the object-fit of image
 */
export class GvImage extends LitElement {

  static get properties () {
    return {
      src: { type: String },
      alt: { type: String },
      loaded: { type: Boolean, reflect: true },
      skeleton: { type: Boolean },
      _skeleton: { type: Boolean, attribute: false },
      _error: { type: Boolean },
    };
  }

  static get styles () {
    return [
      skeleton,
      // language=CSS
      css`
          :host {
              --gv-icon--s: var(--gv-image--w, 128px);
              --icon--s: var(--gv-image--w, 128px);
              --gv-icon--c: #777;
              box-sizing: border-box;
              margin: 0.2rem;
              vertical-align: middle;
              position: relative;
              display: block;
              max-width: var(--gv-image--w, 100%);
              max-height: var(--gv-image--h, 100%);
          }

          :host([loaded]) div {
              width: var(--gv-image--w, 100%);
              height: var(--gv-image--h, 100%);
          }

          div {
              width: var(--gv-image--w, 128px);
              height: var(--gv-image--h, 128px);
              display: flex;
          }

          img {
              overflow: hidden;
              width: var(--gv-image--w, 100%);
              height: var(--gv-image--h, 100%);
          }

          .placeholder {
              max-width: var(--icon--s);
              max-height: var(--icon--s);
              align-self: center;
          }

          gv-icon {
              align-self: center;
          }

          img, .placeholder {
              transition: opacity 0.3s ease-in-out;
              object-fit: var(--gv-image--of, contain);
              border: var(--gv-image--bd, none);
              border-radius: var(--gv-image--bdrs, none);
          }

          .placeholder, :host([loaded]) img {
              opacity: 1;
          }

          img, :host([loaded]) .placeholder {
              opacity: 0;
          }

          :host([loaded]) .placeholder {
              visibility: hidden;
          }

          .skeleton {
              background-color: #aaa;
              border-color: #777;
              color: transparent;
              transition: 0.5s;
              opacity: 0.5;
          }

          .skeleton img {
              visibility: hidden;
          }


      `,
    ];
  }

  constructor () {
    super();
    this._forceSkeleton = false;
    this._skeleton = true;
    this._image = new Promise((resolve) => (this.imageResolver = resolve));
  }

  async performUpdate () {
    Promise.all([this.alt, this.src, this._image])
      .catch(() => (this._error = true))
      .finally(() => {
        this._skeleton = this._forceSkeleton;
      });
    super.performUpdate();
  }

  set skeleton (value) {
    this._forceSkeleton = value;
    this._skeleton = value;
  }

  _onError (e) {
    this.loaded = true;
    this.imageResolver();
    this.dispatchEvent(new Event('error'), e);
  }

  _onLoad () {
    this.loaded = true;
    this.imageResolver();
    dispatchCustomEvent(this, 'loaded', { src: this.src, alt: this.alt });
  }

  render () {
    return html`<div>
       ${this.src && this.alt
      ? html`<img src="${until(this.src, '')}" alt="${until(this.alt, '')}" @load="${this._onLoad}" @error="${this._onError}">`
      : html`<div class="placeholder"><gv-icon shape="design:image"></gv-icon></div>`}
    </div>`;
  }
}

window.customElements.define('gv-image', GvImage);
