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

import { css, LitElement, html } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
import '../atoms/gv-icon';
import { skeleton } from '../styles/skeleton';
import { classMap } from 'lit-html/directives/class-map';
import { i18n } from '../lib/i18n';

const MAX_RATE = 5;

/**
 * Rating component
 *
 * @attr {Number} value - average of ratings between 1 and 5
 * @attr {String} count - total count for the average
 * @attr {Boolean} skeleton - skeleton mode
 * @attr {Boolean} readonly - readonly mode
 * @attr {Boolean} with-description - if true, show rate description on hover
 *
 * @cssprop {Color} [--gv-rating--c=#009B5B] - set the icon color.
 * @cssprop {Length} [--gv-rating--s=13px] - set the icon size.
 */
export class GvRating extends LitElement {

  static get properties () {
    return {
      value: { type: Number, reflect: true },
      count: { type: String },
      skeleton: { type: Boolean },
      readonly: { type: Boolean },
      _candidate: { type: Number, attribute: false },
      withDescription: { type: Boolean, attribute: 'with-description' },
    };
  }

  static get styles () {
    return [
      skeleton,
      // language=CSS
      css`
        :host {
          --gv-icon--c: var(--gv-rating--c, #009B5B);
          --gv-icon--s: var(--gv-rating--s, 13px);

          font-size: 14px;
          cursor: default;
        }

        .content, .rate {
          justify-content: space-evenly;
          display: inline-flex;
          align-items: center;
        }

        .info-title {
          font-size: 14px;
          line-height: 16px;
          align-self: center;
          min-width: 35px;
          text-align: center;
        }

        .info-subtitle {
          font-size: 8px;
          line-height: 10px;
          opacity: 0.5;
          text-align: center;
        }

        .icon {
          display: inline-flex;
          align-self: center;
          margin-right: calc(var(--gv-rating--s, 13px) / 4);
        }

        .skeleton {
          background-color: #aaa;
          border-color: #777;
          color: transparent;
          transition: 0.5s;
        }

        .edit {
          cursor: pointer;
        }

        .edit gv-icon:hover {
          transform: translateY(-0.5px);
        }

        gv-input {
          flex: 1;
        }

        .icon {
          min-height: 30px;
        }

        .description {
          min-width: 100px;
          line-height: calc(var(--gv-rating--s, 13px) + 4px);
          margin: auto 4px;
        }

      `,
    ];
  }

  constructor () {
    super();
    this.value = 0;
    this.count = 0;
    this.readonly = false;
    this._candidate = -1;
    this.isSelected = false;
  }

  _getTitle () {
    return `${this._getAverage()}/${MAX_RATE}`;
  }

  _onMouseEnter (index) {
    this._candidate = index + 1;
    if (this.withDescription) {
      switch (this._candidate) {
        case 1:
          this.description = i18n('gv-rating.description-1');
          break;
        case 2:
          this.description = i18n('gv-rating.description-2');
          break;
        case 3:
          this.description = i18n('gv-rating.description-3');
          break;
        case 4:
          this.description = i18n('gv-rating.description-4');
          break;
        case 5:
          this.description = i18n('gv-rating.description-5');
          break;
      }

    }
  }

  _onMouseOut () {
    this._candidate = -1;
    if (this.withDescription && !this.isSelected) {
      this.description = null;
    }
  }

  _onClick (index) {
    this._candidate = -1;
    this.isSelected = true;
    this.value = index + 1;
    this.dispatchEvent(new Event('input'), { bubbles: true, cancelable: true });
  }

  _getAverage () {
    const _value = parseFloat(this.value);
    if (_value >= 0 && _value <= MAX_RATE) {
      return _value;
    }
    return 0;
  }

  _renderStar (star, index) {
    if (this.readonly) {
      return html`<gv-icon shape="general:${star}"></gv-icon>`;
    }
    else {
      return html`<gv-icon @mouseenter=${this._onMouseEnter.bind(this, index)} @click=${this._onClick.bind(this, index)} shape="general:${star}"></gv-icon>`;
    }
  }

  render () {
    const average = this._getAverage();
    let trunc = average * 1;

    if (!this.readonly) {
      trunc = this._candidate > -1 ? this._candidate : average;
    }

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
      <div class="${classMap({ skeleton: this.skeleton, edit: !this.readonly, content: true })}">
      <div class="${classMap({ content: true })}">
        <div class="${classMap({ rate: true })}">
        <div class="icon" title="${this._getTitle()}">
          ${this.withDescription ? html`<div class="description">${this.description}</div>` : ''}
          ${repeat(stars, (star) => star, (star, index) => html`
            ${this._renderStar(star, index)}
          `)}
        </div>
        ${this.count ? html`<div>
          <div class="info-title">${this.count || ''}</div>
          <div class="info-subtitle">${this._getCountTitle()}</div>
        </div>` : ''}
        </div>
      </div>
      </div>
`;
  }

  firstUpdated () {
    if (!this.readonly) {
      this.shadowRoot.querySelector('.edit').addEventListener('mouseout', this._onMouseOut.bind(this));
    }
  }

  _getCountTitle () {
    if (this.count) {
      if (this.count > 1) {
        return i18n('gv-rating.notes');
      }
      return i18n('gv-rating.note');
    }
    return '';
  }
}

window.customElements.define('gv-rating', GvRating);
