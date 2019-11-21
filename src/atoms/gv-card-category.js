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
import { card } from '../styles/card';
import { truncate } from '../lib/utils';

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
      card,
      // language=CSS
      css`
          :host {
              box-sizing: border-box;
              display: inline-block;
              margin: 0 24px 24px 0;
              vertical-align: middle;
          }

          .card {
              background-color: var(--gv-card-category--bgc, white);
              border-radius: 4px;
              display: flex;
              flex-direction: column;
              height: 228px;
              justify-content: flex-end;
              width: 364px;
              padding: 0 40px;
          }

          .card__title {
              color: var(--gv-card-category--c, var(--gv-theme-color-dark, black));
              font-size: 30px;
              font-style: normal;
              font-weight: 600;
              line-height: 38px;
          }

          .card__description {
              color: var(--gv-card-category--c, var(--gv-theme-color-dark, black));
              font-size: 16px;
              font-style: normal;
              font-weight: normal;
              line-height: 24px;
              margin-bottom: 32px;
              opacity: 0.5;

              /** text-overflow **/
              max-height: 150px;
              display: -webkit-box;
              -webkit-line-clamp: 4;
              -webkit-box-orient: vertical;
              overflow: hidden;
          }
      `,
    ];
  }

  render () {
    return html`
      <div class="card">
        <div class="card__title">${this.title}</div>
        <div class="card__description">${truncate(this.description, this.limit)}</div>
      </div>
    `;
  }

}

window.customElements.define('gv-card-category', GvCardCategory);
