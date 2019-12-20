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
import { repeat } from 'lit-html/directives/repeat';
import '../atoms/gv-icon';
import { skeleton } from '../styles';
import { classMap } from 'lit-html/directives/class-map';
import { i18n } from '../lib/i18n';

const MAX_RATE = 5;

/**
 * Rating component
 *
 * @attr {Number} average - average of ratings between 1 and 5
 * @attr {String} count - total count for the average
 * @attr {Boolean} skeleton - skeleton mode
 *
 * @cssprop {String} [--gv-rating--c=#262626] - set the icon color.
 * @cssprop {String} [--gv-rating--s=13px] - set the icon size.
 */
export class GvRating extends LitElement {

  static get properties () {
    return {
      average: { type: Number },
      count: { type: String },
      skeleton: { type: Boolean },
      _average: { type: Number, attribute: false },
    };
  }

  static get styles () {
    return [
      skeleton,
      // language=CSS
      css`
          :host {
              --gv-icon--c: var(--gv-rating--c, #262626);
              --gv-icon--s: var(--gv-rating--s, 13px);
              font-size: 14px;
              cursor: pointer;
          }

          .content {
              justify-content: space-evenly;
              min-width: 110px;
              display: inline-flex;
              align-items: center;
          }
          
          .info-title{
              font-size: 14px;
              line-height: 16px;
              align-self: center;
          }

          .info-subtitle {
              font-size: 8px;
              line-height: 10px;
              opacity: 0.5;
          }

          .icon {
              display: inline-flex;
              align-self: center;
              margin-right: calc(var(--gv-rating--s, 13px)/4);
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
    this._average = 0;
    this.count = 0;
  }

  set average (value) {
    const _value = parseFloat(value);
    if (_value >= 0 && _value <= MAX_RATE) {
      this._average = _value;
    }
  }

  _getTitle () {
    return `${this._average}/${MAX_RATE}`;
  }

  render () {
    const trunc = this._average * 1;
    const stars = [];
    for (let star = 1; star <= MAX_RATE; star += 1) {
      if (trunc >= star) {
        stars.push('star');
      }
      else if (trunc >= star - 0.7) {
        stars.push('half-star');
      }
      else {
        stars.push('no-star');
      }
    }

    return html`
      <div class="${classMap({ skeleton: this.skeleton, content: true })}">
      <div class="icon" title="${this._getTitle()}">
        ${repeat(stars, (star) => star, (star) => html`
          <gv-icon shape="general:${star}"></gv-icon>
          
        `)}
      </div>
      <div>
        <div class="info-title">${this.count || this._getTitle()}</div>
        ${this.count ? html`<div class="info-subtitle">${i18n('gv-rating.notes')}</div>` : ''}
      </div>
      </div>
`;
  }

}

window.customElements.define('gv-rating', GvRating);
