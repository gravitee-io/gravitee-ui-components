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
import { dispatchCustomEvent } from '../lib/events';
import '../atoms/gv-button';
import { i18n } from '../lib/i18n';

/**
 * A pagination
 *
 * ## Details
 * * has @theme facet
 *
 * @fires gv-pagination:paginate - Custom event with pagination link
 *
 * @attr {Object} data - Pagination information {first, last, total, current_page}
 * @attr {Boolean} hide-empty - hide component if no page or no data.
 * @attr {Boolean} widget - display widget pagination (with arrows).
 * @attr {Boolean} disabled - same as native button element `disabled` attribute
 *
 * @cssprop {Length} [--gv-pagination--fz=var(--gv-theme-font-size-s, 12px)] - Font size
 * @cssprop {Length} [--gv-pagination-icon--s=18px] - Height and icon width
 */
export class GvPagination extends LitElement {

  static get properties () {
    return {
      data: { type: Object },
      hideEmpty: { type: Boolean, attribute: 'hide-empty' },
      widget: { type: Boolean },
      disabled: { type: Boolean },
      _first: { type: Number },
      _last: { type: Number },
      _current: { type: Number },
      _total: { type: Number },
    };
  }

  static get styles () {
    return [
      // language=css
      css`
          .pagination {
              --font-size: var(--gv-pagination--fz, var(--gv-theme-font-size-s, 12px));
              font-size: var(--fz);
              --gv-button--fz: var(--fz);
              display: flex;
              align-items: center;
          }

          gv-button {
              --gv-icon--s: var(--gv-pagination-icon--s, 18px);
              min-width: 29px;
          }

          gv-input {
              width: 50px;
          }
      `,
    ];
  }

  constructor () {
    super();
    this.hideEmpty = false;
    this.hasInput = false;
    this.max = 10;
    this.center = this.max / 2 - 1;
    this.sizes = [];
    this.links = {};
  }

  set data (data) {
    if (data) {
      this._last = data.last;
      this._current = parseInt(data.current_page);
      this._pages = data.total_pages;
      if (this._pages < this.max) {
        this.max = this._pages;
      }
    }
  }

  _goToPage (page) {
    this._current = parseInt(page);
    dispatchCustomEvent(this, 'paginate', { page: page });
  }

  _onSubmit (e) {
    const page = e.target.value;
    this._goToPage(page);
  }

  _onClickToSearch () {
    const page = this.shadowRoot.querySelector('gv-input').value;
    if (page) {
      this._goToPage(page);
    }
  }

  _renderPagination () {
    const pagination = [];
    for (let i = 0; i < this._pages; i++) {
      pagination.push(i + 1);
    }

    let left = pagination.slice(0, this._current - 1);
    let right = pagination.slice(this._current);

    if (pagination.length > this.max) {
      const dL = left.length;
      let removeL = dL - this.center - 1;
      let addRight = this.max - this._current > this.center ? this.max - this._current : this.center;
      if (removeL > 0) {
        addRight = this.center;
        const diff = this._last - this._current - addRight;
        if (diff < 0) {
          removeL += diff;
        }
        left = left.slice(removeL);
      }
      right = right.slice(0, addRight);
    }
    const leftP = left.map((i) => html`<gv-button small outlined @click="${this._goToPage.bind(this, i)}">${i}</gv-button>`);
    const rightP = right.map((i) => html`<gv-button small outlined @click="${this._goToPage.bind(this, i)}">${i}</gv-button>`);

    leftP.unshift(html`<gv-button small .disabled="${this.disabled || leftP.length === 0}" outlined @click="${leftP.length === 0 ? () => {} : this._goToPage.bind(this, this._current - 1)}">${this.widget ? html`<gv-icon shape="navigation:angle-left" title="${i18n('gv-pagination.previous')}"></gv-icon>` : i18n('gv-pagination.previous')}</gv-button>`);
    rightP.push(html`<gv-button small .disabled="${this.disabled || rightP.length === 0}" outlined @click="${rightP.length === 0 ? () => {} : this._goToPage.bind(this, this._current + 1)}">${this.widget ? html`<gv-icon shape="navigation:angle-right" title="${i18n('gv-pagination.next')}"></gv-icon>` : i18n('gv-pagination.next')}</gv-button>`);
    return html`${this.widget ? leftP.slice(0, 1) : leftP} ${html`<gv-button .disabled="${this.disabled}" small primary>${this.widget ? this._current + ' / ' + pagination.length : this._current}</gv-button>`} ${this.widget ? rightP.slice(rightP.length - 1, rightP.length) : rightP}`;
  }

  _hasData () {
    return this._pages && this._last && this._current;
  }

  _hideEmpty () {
    return this._hasData() && this.hideEmpty && this._pages < 2;
  }

  render () {
    if (this._hasData() && !this._hideEmpty()) {
      return html`<div class="pagination">
          ${this.hasInput ? html`<gv-input class="goto" @gv-input:submit="${this._onSubmit}" type="number" min="1" max="${this._pages}" placeholder="Page" small></gv-input>
          <gv-button small outlined @click="${this._onClickToSearch}" icon="general:search"></gv-button>` : ''}
          ${this._renderPagination()}
        </div> `;
    }
    return html``;
  }

}

window.customElements.define('gv-pagination', GvPagination);
