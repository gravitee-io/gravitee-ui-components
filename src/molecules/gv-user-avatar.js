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
 * User avatar component
 *
 * @attr {String} avatar - the avatar (if not defined the user avatar is loaded)
 * @attr {Object<{display_name, avatar}>} user - a user
 * @attr {Length} size - Size of image
 *
 */
export class GvUserAvatar extends LitElement {

  static get properties () {
    return {
      user: { type: Object },
      avatar: { type: String },
      size: { type: Number },
      _error: { type: Boolean, attribute: false },
    };
  }

  static get styles () {
    return [
      skeleton,
      // language=CSS
      css`
          div {
            display: inline-block;
          }
      `,
    ];
  }

  constructor () {
    super();
    this.size = 40;
  }

  _onError () {
    this._error = true;
    this.performUpdate();
  }

  getDisplayName () {
    if (this.user) {
      return this.user.display_name;
    }
    return '';
  }

  getUserPicture () {
    if (this.user) {
      return this.avatar ? this.avatar : (this.user._links ? this.user._links.avatar : null);
    }
    return null;
  }

  getDefaultPicture () {
    return jdenticon.toSvg(this.getDisplayName(), this.size);
  }

  render () {
    if (this.user) {
      if (this._error && !this.avatar) {
        const container = document.createElement('div');
        container.title = this.getDisplayName();
        container.innerHTML = this.getDefaultPicture();
        return html`${container}`;
      }

      const style = `width:${this.size}px; height:${this.size}px; border-radius: 50%; --gv-image--of: contain;`;

      return html`
        <gv-image src="${this.getUserPicture()}"
          alt="${this.getDisplayName()}"
          title="${this.getDisplayName()}"
          style="${style}" @error="${this._onError}"></gv-image>
      `;
    }
  }
}

window.customElements.define('gv-user-avatar', GvUserAvatar);
