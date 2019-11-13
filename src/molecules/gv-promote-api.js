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
import defaultSrc from '../../assets/images/promote-api.png';
import { dispatchCustomEvent } from '../lib/events';

/**
 * Promote Api component
 *
 * @fires gv-promote-api:click - When click on button for view API
 *
 * @attr {String} alt - Image alternative text.
 * @attr {String} description - Promoted API description.
 * @attr {String} src - Image source file.
 * @attr {String} title - Promoted API title.
 *
 * @cssprop {String} --gv-promote-api-image--bgc - set the background color of image.
 * @cssprop {String} --gv-promote-api--bgc - set the background color.
 */
export class GvPromoteApi extends LitElement {

  static get properties () {
    return {
      description: { type: String },
      title: { type: String },
      src: { type: String },
      alt: { type: String },
      _skeleton: { type: Boolean },
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
              width: 100%;
          }

          .container {
              display: flex;
          }

          .container > div {
              max-width: 450px;
              max-height: 450px;
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
              line-height: 32px;
              font-size: 24px;
              text-transform: capitalize;
          }

          .content {
              flex: 1;
              padding: 50px 70px;
              background-color: var(--gv-promote-api--bgc, white);
              color: #262626;
              line-height: 24px;
              font-size: 16px;
              border-radius: 0 4px 4px 0;
          }

          .description {
              margin: 24px 0px;
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
    this.src = defaultSrc;
    this.alt = 'Promote API image';
    this._skeleton = true;
    this._skeletonTitle = new Array(8).join('x ');
    this._skeletonDescription = new Array(120).join('x ');
    this._image = new Promise((resolve) => (this.imageResolver = resolve));
  }

  async performUpdate () {
    Promise.all([this.title, this.description, this._image]).then(() => (this._skeleton = false));
    super.performUpdate();
  }

  _onImageLoaded () {
    this.imageResolver();
  }

  _renderImage () {
    return html`<gv-image src="${this.src}" alt="${this.alt}" @gv-image:loaded="${this._onImageLoaded()}"></gv-image>`;
  }

  _renderDescription () {
    if (this._skeleton) {
      return html`${this._skeletonDescription}`;
    }
    return html`${until(this.description, '')}`;
  }

  _renderTitle () {
    if (this._skeleton) {
      return this._skeletonTitle;
    }
    return html`${until(this.title, '')}`;
  }

  _onClick () {
    dispatchCustomEvent(this, 'click');
  }

  render () {
    return html`<div class="container"> 
    <div class=${classMap({ skeleton: this._skeleton, image: true })}>${this._renderImage()}</div>
    <div class="content">
        <h2 class=${classMap({ skeleton: this._skeleton, title: true })}>${this._renderTitle()}</h2>
        <p class=${classMap({ skeleton: this._skeleton, description: true })}>${this._renderDescription()}</p>
        <gv-button @click="${this._onClick}" .skeleton=${this._skeleton} style="--gv-button--p:19px 80px;--gv-button--fz:16px;">VIEW API</gv-button>
    </div>
</div>`;
  }

}

window.customElements.define('gv-promote-api', GvPromoteApi);
