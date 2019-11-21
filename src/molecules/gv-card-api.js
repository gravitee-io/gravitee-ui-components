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
import { until } from 'lit-html/directives/until';
import { skeleton } from '../styles';
import { classMap } from 'lit-html/directives/class-map';
import '../atoms/gv-image';
import '../atoms/gv-button';
import _picture from '../../assets/images/promote-api.png';
import { repeat } from 'lit-html/directives/repeat';
import { card } from '../styles/card';

/**
 * Api Card component
 *
 * @attr {String} title - API title.
 * @attr {String} picture - Image source file.
 * @attr {String} altPicture - Image alternative text.
 * @attr {Array} states - Array of states (Show <gv-state> component)
 * @attr {String} version - API version
 *
 * @cssprop {String} --gv-card-api--bgc - set the background color.
 */
export class GvCardApi extends LitElement {

  static get properties () {
    return {
      title: { type: String },
      picture: { type: String },
      altPicture: { type: String },
      states: { type: Array },
      version: { type: String },
      skeleton: { type: Boolean },
      _skeleton: { type: Boolean, attribute: false },
      _error: { type: Boolean, attribute: false },
    };
  }

  static get styles () {
    return [
      card,
      skeleton,
      // language=CSS
      css`
          :host {
              box-sizing: border-box;
              display: inline-block;
              margin: 0.2rem;
              vertical-align: middle;
              --gv-image--w: 110px;
              --gv-image--h: 65px;
              --gv-icon--w: 65px;
              --gv-icon--h: 65px;
              width: 144px;
              max-height: 144px;
          }

          .card {
              position: relative;
              display: flex;
              flex-direction: column;
              max-width: 144px;
              min-height: 144px;
              border-radius: 2px;
              background-color: var(--gv-card-api--bgc, white);
              color: #262626;
          }

          .content > div {
              display: flex;
              justify-content: center;
              margin-bottom: 0.2rem;
          }

          .image {
              min-height: 65px;
              min-width: 0;
              display: flex;
              flex: 1;
              align-items: center;
              justify-content: center;
              position: relative;
              padding-top: 0.2rem;
          }

          .title {
              line-height: 22px;
              font-size: 12px;
              text-transform: capitalize;
              font-weight: bold;
              white-space: nowrap;
              overflow: hidden;
          }

          .content {
              flex: 1;
              padding: 6px 16px 12px;
          }

          .version {
              color: #D9D9D9;
              top: 0.4rem;
              right: 0.4rem;
              position: absolute;
          }

          .skeleton {
              background-color: #aaa;
              border-color: #777;
              color: transparent;
              transition: 0.5s;
          }

          .error {
              text-align: center;
              font-size: 10px;
          }
      `,
    ];
  }

  constructor () {
    super();
    this.picture = _picture;
    this.altPicture = 'Card image';
    this.states = [];
    this._forceSkeleton = false;
    this._skeleton = true;
    this._image = new Promise((resolve) => (this.imageResolver = resolve));
    this._error = false;
  }

  async performUpdate () {
    Promise.all([this.title, this._image]).catch(() => {
      this._error = true;
    })
      .finally(() => (this._skeleton = this._forceSkeleton));
    super.performUpdate();
  }

  set skeleton (value) {
    this._forceSkeleton = value;
    this._skeleton = value;
  }

  _onImageLoaded () {
    this.imageResolver();
  }

  _renderImage () {
    if (this._error) {
      return html`<gv-icon shape="design:image"></gv-icon>`;
    }
    return html`<gv-image ?skeleton="${this._skeleton}" src="${this.picture}" alt="${until(this.altPicture, '')}" @gv-image:loaded="${this._onImageLoaded()}"></gv-image>`;
  }

  render () {
    return html`<div class="card" title="${until(this.title, '')}"> 
    <span class="${classMap({ skeleton: this._skeleton, version: true })}" >${until(this.version, '')}</span>   
    <div class="${classMap({ skeleton: this._skeleton, image: true })}">${this._renderImage()}</div>
    
    <div class="content">
        ${this._error ? html`  
        <div class="${classMap({ skeleton: this._skeleton })}">
            <span class="error">An error has occurred</span>
        </div>
        ` : html`
        <div class="${classMap({ skeleton: this._skeleton })}">
            <span class="title">${until(this.title, '')}</span>
        </div>
        <div>
           ${repeat(this.states, (state) => state, ({ value, major, minor }) => html`
                 <gv-state ?skeleton="${this._skeleton}" 
                    ?major="${major === true}" 
                    ?minor="${minor === true}">${value}</gv-state> 
        `)}
        </div>`}
    </div>
</div>`;
  }

}

window.customElements.define('gv-card-api', GvCardApi);
