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
import '../atoms/gv-select';

/**
 * A pagination
 *
 * @fires gv-pagination:paginate - Custom event with pagination link
 * @fires gv-pagination:size - Custom event with selected size
 *
 * @attr {Array<String>} sizes - definition of sizes
 * @attr {String} size - selected size
 * @attr {Object} data - Pagination information {first, last, total}
 * @attr {Object} links - Pagination links {first, prev, next, last}
 *
 */
export class GvPagination extends LitElement {

  static get properties () {
    return {
      sizes: { type: Array },
      size: { type: String },
      data: { type: Object },
      links: { type: Object },
    };
  }

  static get styles () {
    return [
      // language=css
      css`
          .pagination {
              font-size: 10px;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              margin: 0.2rem;
          }

          gv-button {
              --gv-icon--h: 20px;
              --gv-icon--w: 20px;
          }

          gv-select {
              width: 50px;
          }
      `,
    ];
  }

  constructor () {
    super();
    this.sizes = [];
    this.data = {};
    this.links = {};
  }

  _onSelectSize (e) {
    dispatchCustomEvent(this, 'size', { size: e.target.value });
  }

  _toFirst () {
    dispatchCustomEvent(this, 'paginate', { link: this.links.first });
  }

  _toPrev () {
    dispatchCustomEvent(this, 'paginate', { link: this.links.prev });
  }

  _toNext () {
    dispatchCustomEvent(this, 'paginate', { link: this.links.next });
  }

  _toLast () {
    dispatchCustomEvent(this, 'paginate', { link: this.links.last });
  }

  _hasData () {
    return this.data && this.data.first != null && this.data.last != null && this.data.total != null;
  }

  _hasSizes () {
    return this.sizes && this.sizes.length > 0;
  }

  _hasLinks () {
    return this.links && (this.links.first != null || this.links.prev != null || this.links.next != null || this.links.last != null);
  }

  render () {
    return html`
     <div class="pagination">
          ${this._hasSizes() ? html`<label>Rows per page</label>
          <gv-select .options="${this.sizes}" .value="${this.size}" small @input="${this._onSelectSize}"></gv-select>` : ''}
          ${this._hasData() ? html`<span> ${this.data.first} - ${this.data.last} of ${this.data.total} </span>` : ''}
          ${this._hasLinks() ? html`<div>
            <gv-button outlined icon="navigation:arrow-to-left" 
                        @click="${this._toFirst}"
                       .disabled="${!this.links.first}"></gv-button>
            <gv-button outlined icon="navigation:arrow-left"
                        @click="${this._toPrev}"
                       .disabled="${!this.links.prev}"></gv-button>
            <gv-button outlined icon="navigation:arrow-right"  
                        @click="${this._toNext}"
                       .disabled="${!this.links.next}"></gv-button>
            <gv-button outlined icon="navigation:arrow-to-right" 
                        @click="${this._toLast}"
                       .disabled="${!this.links.last}"></gv-button>
          </div>` : ''}
        </div>
    `;
  }

}

window.customElements.define('gv-pagination', GvPagination);
