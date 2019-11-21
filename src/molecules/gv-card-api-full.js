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
import '../atoms/gv-state'
import '../atoms/gv-tag'
import _picture from '../../assets/images/api-full.png';
import { repeat } from 'lit-html/directives/repeat';
import { card } from '../styles/card';
import { truncate } from '../lib/utils';

/**
 * Api Full Card component
 *
 * @attr {String} title - API title.
 * @attr {String} description - API descriptions.
 * @attr {Number} limit - number of characters that can be display in the description. (default: 150 characters)
 * @attr {String} picture - Image source file.
 * @attr {String} altPicture - Image alternative text.
 * @attr {Array} states - Array of states (Show <gv-state> component)
 * @attr {Array} labels - Array of labels (Show <gv-label> component)
 * @attr {String} version - API version
 * @attr {String} subscribers - All subscribers
 * @attr {String} hits - All hits
 * @attr {String} health - health
 * @attr {average, count} rating - Rating object (Show <gv-rating> component)
 *
 * @cssprop {String} --gv-card-api-full--bgc - set the background color.
 */
export class GvCardApiFull extends LitElement {

  static get properties () {
    return {
      description: { type: String },
      descriptionMaxSize: { type: Number },
      title: { type: String },
      picture: { type: String },
      altPicture: { type: String },
      states: { type: Array },
      labels: { type: Array },
      version: { type: String },
      subscribers: { type: String },
      hits: { type: String },
      health: { type: String },
      rating: { type: Object },
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
              --gv-icon--c: #777;
              width: 444px;
              max-height: 281px;
              line-height: 22px;
              font-size: 14px;
          }

          .card {
              display: flex;
              flex-direction: column;
              max-width: 444px;;
              height: 250px;
              border-radius: 4px;
              background-color: var(--gv-card-api-full--bgc, white);
              color: #262626;
              padding: 16px;
              --gc-icon--c: red
          }

          .card > div {
              display: flex;
          }

          .image {
              min-height: 65px;
              min-width: 0;
              position: relative;
              padding-top: 0.2rem;
          }

          .title {
              line-height: 22px;
              font-size: 16px;
              text-transform: capitalize;
              font-weight: bold;
          }

          .content {
              flex: 1;
              padding: 10px;
          }

          .version {
              color: #D9D9D9;
              padding: 10px 8px;
              font-size: 12px;
          }

          .description {
              padding: 0 16px;
              margin: 6px 0;
              flex: 1;
              flex-grow: 1;
              max-height: 150px;
              overflow: hidden;
              text-overflow: ellipsis;
          }

          .error .description {
              justify-content: center;
          }

          .infos {
              display: flex;
              border-bottom: 1px solid #D9D9D9;
              padding: 8px;
              margin: 8px;
          }

          .info {
              flex: 1;
              --gv-icon--w: 24px;
              --gv-icon--h: 24px;
              --gv-icon--c: var(--gv-theme-color);
              display: flex;
              justify-content: space-evenly;
          }

          .icon {
              align-self: center;
          }

          .labels {
              padding: 0 16px;
          }

          .info-title {
              font-size: 14px;
              line-height: 16px;
              align-self: center;
          }

          .info-subtitle {
              font-size: 8px;
              line-height: 10px;
              opacity: 0.5;
          }

          .skeleton {
              background-color: #aaa;
              border-color: #777;
              color: transparent;
              transition: 0.5s;
          }

          .error .labels, .error .infos, .error .states {
              visibility: hidden;
          }

      `,
    ];
  }

  constructor () {
    super();
    this.picture = _picture;
    this.altPicture = 'Card image';
    this.states = [];
    this.labels = [];
    this.limit = 150;
    this._forceSkeleton = false;
    this._skeleton = true;
    this._image = new Promise((resolve) => (this.imageResolver = resolve));
    this._error = false;
  }

  async performUpdate () {
    Promise.all([this.title, this._image]).catch(() => {
      this._error = true;
      this.description = 'Sorry, an error has occurred ;(';
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
      return html`<gv-icon ?skeleton="${this._skeleton}" shape="design:image"></gv-icon>`;
    }
    return html`<gv-image ?skeleton="${this._skeleton}" src="${this.picture}" alt="${until(this.altPicture, '')}" @gv-image:loaded="${this._onImageLoaded()}"></gv-image>`;
  }

  _renderInfo (data, icon, name) {
    return html`<div class="info">
                ${data ? html`<div class="icon"><gv-icon shape="${icon}"></gv-icon></div>
                <div><div class="info-title">${data}</div><div class="info-subtitle">${name}</div></div>` : ''}`;
  }

  _renderInfoRating () {
    if (this.rating) {
      return html`<gv-rating .skeleton="${this._skeleton}" .average="${this.rating.average}" .count="${this.rating.count}"></gv-rating>`;
    }
    return html`<div class="info"></div>`;
  }

  render () {
    return html`<div class="${classMap({ error: this._error, card: true })}" title="${until(this.title, '')}"> 
        <div>
            <div class="${classMap({ skeleton: this._skeleton, image: true })}">${this._renderImage()}</div>
            <div class="content">
                <div class="${classMap({ skeleton: this._skeleton, title: true })}">${until(this.title, '')}</div>
                <div class="states">
                ${repeat(this.states, (state) => state, (state) => html`
                    <gv-state ?skeleton="${this._skeleton}" 
                    ?major="${state.major === true}" 
                    ?minor="${state.minor === true}">${state.value}</gv-state>
                `)}
                </div>
            </div>
            <div class="version"><span class="${classMap({ skeleton: this._skeleton })}">${until(this.version, '')}</span></div>  
        </div>
        <div class="${classMap({ skeleton: this._skeleton, description: true })}">${until(truncate(this.description, this.limit), '')}</div>   
        <div class="${classMap({ skeleton: this._skeleton, infos: true })}">
           ${this._renderInfo(this.subscribers, 'communication:group', 'Subscribers')}
           ${this._renderInfo(this.hits, 'general:cursor', 'Hits')}
           ${this._renderInfo(this.health, 'general:heart', 'Health')}
           ${this._renderInfoRating()}
        </div>   
        <div class="labels">
           ${repeat(this.labels, (label) => label, ({ value, major, minor }) => html`
                    <gv-tag ?skeleton="${this._skeleton}" 
                    ?major="${major === true}" 
                    ?minor="${minor === true}">${value}</gv-tag>
                `)}
        </div>
</div>`;
  }

}

window.customElements.define('gv-card-api-full', GvCardApiFull);
