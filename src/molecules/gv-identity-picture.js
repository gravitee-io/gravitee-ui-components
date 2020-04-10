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
import { styleMap } from 'lit-html/directives/style-map';

/**
 * Identity picture component
 *
 * @attr {String} picture - the picture
 * @attr {String} display_name - the display_name of the picture
 * @attr {Boolean} notification - true to display a notification info
 *
 * @cssprop {Color} [--gv-identity-picture-notification--bgc=var(--gv-theme-color, #009B5B)] - Notification background color
 */
export class GvIdentityPicture extends LitElement {

  static get properties () {
    return {
      picture: { type: String },
      display_name: { type: String },
      _error: { type: Boolean, attribute: false },
      notification: { type: Boolean },
    };
  }

  static get styles () {
    return [
      skeleton,
      // language=CSS
      css`
        :host {
          display: block;
          position: relative;
        }

        div {
          text-align: center;
        }

        gv-image, svg {
          width: 100%;
          height: 100%;
          --gv-image--of: contain;
        }

        .notification {
          position: absolute;
          width: 8px;
          height: 8px;
          background-clip: padding-box;
          border-radius: 50%;
          background-color: var(--gv-identity-picture-notification--bgc, var(--gv-theme-color, #009B5B));
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
      if (this.notification) {
        const notification = document.createElement('span');
        notification.className = 'notification';
        notification.style.left = width;
        container.appendChild(notification);
      }
      return html`${container}`;
    }

    return html`
      <gv-image src="${this.picture}"
        alt="${this.display_name}"
        title="${this.display_name}"
        @error="${this._onError}"
        @gv-image:loaded="${this._onLoaded}"></gv-image>
        ${this.notification ? html`<span class="notification" style="${styleMap({ left: width })}"></span>` : ''}
    `;
  }
}

window.customElements.define('gv-identity-picture', GvIdentityPicture);
