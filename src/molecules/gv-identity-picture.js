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
import jdenticon from 'jdenticon';
import { skeleton } from '../styles/skeleton';

/**
 * Identity picture component
 *
 * @attr {String} picture - the picture
 * @attr {String} display_name - the display_name of the picture
 *
 */
export class GvIdentityPicture extends LitElement {

  static get properties () {
    return {
      picture: { type: String },
      display_name: { type: String },
      _error: { type: Boolean, attribute: false },
    };
  }

  static get styles () {
    return [
      skeleton,
      // language=CSS
      css`
          :host {
            display: block;
          }
          div {
            text-align: center;
          }
      `,
    ];
  }

  _onError () {
    this._error = true;
    this.performUpdate();
  }

  _toNumber (size) {
    return parseInt(size.replace('px', ''), 10);
  }

  render () {
    const { width, height } = window.getComputedStyle(this);
    if (this._error) {
      const container = document.createElement('div');
      container.title = this.display_name;
      container.innerHTML = jdenticon.toSvg(this.display_name, Math.min(this._toNumber(width), this._toNumber(height)), { backColor: '#FFFFFF' });
      return html`${container}`;
    }

    const style = `width:${width}; height:${height}; border-radius: 50%; --gv-image--of: contain;`;

    return html`
      <gv-image src="${this.picture}"
        alt="${this.display_name}"
        title="${this.display_name}"
        style="${style}" @error="${this._onError}"></gv-image>
    `;
  }
}

window.customElements.define('gv-identity-picture', GvIdentityPicture);
