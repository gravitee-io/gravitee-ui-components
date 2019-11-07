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

/**
 * A card used to display a category
 * 
 * @attr {String} src - src of the image.
 * @attr {String} title - title of the card.
 * @attr {String} description - description of the card.
 * @attr {Number} limit - number of characters that can be display in the description. If _description_ is greater, it will be truncated.
 *
 * @cssprop {String} --gv-card-category--bgc - set the background color of card.
 * @cssprop {String} --gv-card-category--c - set the color of text.
 *
*/

export class GvCardCategory extends LitElement {

  static get properties () {
    return {
      src: { type: String },
      title: { type: String },
      description: { type: String },
      limit: { type: Number },
    };
  }

  static get styles () {
    return [
      // language=CSS
      css`        
      :host {
        box-sizing: border-box;
        display: inline-block;
        margin: 0.2rem;
        vertical-align: middle;
      }

      .card {
        background-color: var(--gv-card-category--bgc, white);
        border-radius: 4px;
        box-shadow: 0 20px 40px -14px rgba(0,0,0,0.25);
        display: flex;
        flex-direction: column;
        align-content: flex-end;
        overflow: hidden;
        height: 100%;
        padding-top: 5px;
      }

      .card__description {
        margin: 0 0 27px 40px;
        color: var(--gv-card-category--c, black);
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 24px;
        opacity: 0.5;
      }

      .card__header {
        display: flex;
        flex: 1 1 auto;
        flex-direction: row;
        margin: 1rem 1rem 0 0;
      }

      .card__title {
        color: var(--gv-card--c, black);
        font-style: normal;
        font-weight: 600;
        font-size: 30px;
        line-height: 38px;
        margin: 0 40px;
      }

      .card__container__image {
        padding-bottom: 5px;
        margin: auto;
      }

      .card__image {
        background-color: white;
        background-repeat: no-repeat;
        background-size: 96px;
        border-radius: 4px;
        background-position: center center;
        height: 96px;
        width: 96px;
        filter: contrast(50%);
        transition: filter 0.5s cubic-bezier(.43,.41,.22,.91);;
      }

      .card:hover .card__image {
        filter: contrast(100%);
      }

      `,
    ];
  }

  _renderPhoto () {
    return this.src ? html`<div class="card__container__image"><div class="card__image" style="background-image: url('${this.src}');"></div></div>` : '';
  }

  _renderDescription () {
    let shortenedDescription = this.description;
    if (this.limit && shortenedDescription.length > this.limit) {
      shortenedDescription = shortenedDescription.substring(0, this.limit) + '...';
    }
    return html`<div class="card__description">${shortenedDescription}</div>`;
  }

  render () {
    return html`
      <div class="card">

        ${this._renderPhoto()}
        <div class="card__title">${this.title}</div>
        ${this._renderDescription()}
        
      </div>
    `;
  }

}

window.customElements.define('gv-card-category', GvCardCategory);
