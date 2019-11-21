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
import '../molecules/gv-rating';
import defaultSrc from '../../assets/images/promote-api.png';
import { dispatchCustomEvent } from '../lib/events';

/**
 * Promote Api component
 *
 * @fires gv-promote-api:click - When click on button for view API
 *
 * @attr {String} description - Promoted API description.
 * @attr {String} picture - Image source file.
 * @attr {String} altPicture - Image alternative text.
 * @attr {String} title - Promoted API title.
 * @attr {String} path - Path for view button. if no defined, there is no button
 * @attr {average, count} rating - Rating object (Show <gv-rating> component)
 *
 * @cssprop {String} --gv-promote-api-image--bgc - set the background color of image.
 * @cssprop {String} --gv-promote-api--bgc - set the background color.
 */
export class GvPromoteApi extends LitElement {

  static get properties () {
    return {
      description: { type: String },
      title: { type: String },
      picture: { type: String },
      altPicture: { type: String },
      skeleton: { type: Boolean },
      path: { type: String },
      rating: { type: Object },
      _picture: { type: String },
      _skeleton: { type: Boolean, attribute: false },
      _error: { type: Boolean, attribute: false },
    };
  }

  static get styles () {
    return [
      skeleton,
      // language=CSS
      css`
          :host {
              box-sizing: border-box;
              display: inline-block;
              margin: 0.2rem;
              vertical-align: middle;
              --gv-image--w: 300px;
              --gv-image--h: 300px;
          }

          .container {
              display: flex;
              min-height: 416px;
          }

          .container > div {
              width: 514px;
              max-height: 416px;
          }

          .image {
              background-color: var(--gv-promote-api-image--bgc, #D5FDCB);
              min-height: 0;
              min-width: 0;
              display: flex;
              flex: 1;
              align-items: center;
              justify-content: center;
              border-radius: 4px 0 0 4px;
          }

          .title {
              font-size: 24px;
              text-transform: capitalize;
              min-height: 32px;
          }

          .content {
              flex: 1;
              padding: 50px 70px;
              background-color: var(--gv-promote-api--bgc, white);
              color: #262626;
              font-size: 16px;
              line-height: 24px;
              border-radius: 0 4px 4px 0;
              display: flex;
              flex-direction: column;
              max-width: 374px;
          }

          .description {
              margin: 24px 0px;
              flex-grow: 1;
          }

          .skeleton gv-image {
              display: none;
          }

          .skeleton {
              background-color: #aaa;
              border-color: #777;
              color: transparent;
              transition: 0.5s;
          }
      `,
    ];
  }

  constructor () {
    super();
    this.picture = defaultSrc;
    this.altPicture = 'Promote API image';
    this._forceSkeleton = false;
    this._skeleton = true;
    this._error = false;
    this._image = new Promise((resolve) => (this.imageResolver = resolve));
  }

  async performUpdate () {
    Promise.all([this.title, this.description, this._image])
      .catch(() => (this._error = true))
      .finally(() => {
        this._error = this.title == null;
        this._skeleton = this._forceSkeleton;
      });
    super.performUpdate();
  }

  set skeleton (value) {
    this._forceSkeleton = value;
    this._skeleton = value;
  }

  set picture (value) {
    if (value) {
      this._picture = value;
    }
  }

  _onImageLoaded () {
    this.imageResolver();
  }

  _renderImage () {
    return html`<gv-image ?skeleton=${this._skeleton}  src="${this._picture}" alt="${this.altPicture}" @gv-image:loaded="${this._onImageLoaded()}"></gv-image>`;
  }

  _renderDescription () {
    return html`${until(this.description, '')}`;
  }

  _renderTitle () {
    return html`${until(this.title, '')}`;
  }

  _onClick () {
    dispatchCustomEvent(this, 'click', { path: this.path });
  }

  _renderInfoRating () {
    if (this.rating) {
      return html`<gv-rating .skeleton="${this._skeleton}" .average="${this.rating.average}" .count="${this.rating.count}"></gv-rating>`;
    }
    return html`<div class="info"></div>`;
  }

  render () {
    return html`<div class="container"> 
    <div class="image">${this._renderImage()}</div>
    <div class="content">
    ${this._error && !this._skeleton ? html`<p class="description">An error has occured.</p>` : html`
        <h2 class=${classMap({ skeleton: this._skeleton, title: true })}>${this._renderTitle()} ${this._renderInfoRating()}</h2>
       
        <p class=${classMap({ skeleton: this._skeleton, description: true })}>${this._renderDescription()}</p>
        ${this.path ? html`<gv-button ?skeleton=${this._skeleton} 
@click="${this._onClick}" 
.skeleton=${this._skeleton} 
style="--gv-button--p:19px 80px;--gv-button--fz:16px;">VIEW API</gv-button>` : ''}
    `}
    </div>
</div>`;
  }

}

window.customElements.define('gv-promote-api', GvPromoteApi);
