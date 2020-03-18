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
import { skeleton } from '../styles/skeleton';
import { classMap } from 'lit-html/directives/class-map';
import { repeat } from 'lit-html/directives/repeat';
import { dispatchCustomEvent } from '../lib/events';
import { i18n, getLanguage } from '../lib/i18n';
import { until } from 'lit-html/directives/until';
import { styleMap } from 'lit-html/directives/style-map';
import { withResizeObserver } from '../mixins/with-resize-observer';

/**
 * Table component
 *
 * @fires gv-table:select - when table row is selected
 * @fires gv-table:mouseenter - when the pointer is entering on a table row
 * @fires gv-table:mouseleave - when the pointer is leaving a table row
 *
 * @attr {Array<any>} items - A list of items to display
 * @attr {String} title - A title to display
 * @attr {String} order - If defined, the table will be ordered by the field. Start with '-' to sort in desc
 * @attr {Array<any>} options - The list of options to display
 * @attr {Boolean} noheader - Used to hide the table header
 * @attr {Boolean} nosort - Used to disable the click on header to sort
 * @attr {String} rowsheight - The height of the table rows
 * @attr {String} emptymessage - The empty message to display
 * @attr {String} format - A function to format table headers
 *
 * @cssprop {Color} [--gv-table-selected--bgc=var(--gv-theme-color, #009B5B)] - Selected background color
 * @cssprop {Color} [--gv-table-hover--bgc=var(--gv-theme-neutral-color-lighter, #FAFAFA)] - Row background color on hover
 * @cssprop {Color} [--gv-table--bgc=var(--gv-theme-neutral-color-lightest, #FFFFFF)] - Background color
 * @cssprop {Color} [--gv-table--bdc=var(--gv-theme-neutral-color-dark, #D9D9D9)] - Border color
 *
 */
export class GvTable extends withResizeObserver(LitElement) {

  static get properties () {
    return {
      items: { type: Array },
      title: { type: String },
      order: { type: String },
      options: { type: Array },
      noheader: { type: Boolean },
      nosort: { type: Boolean },
      rowsheight: { type: String },
      emptymessage: { type: String },
      format: { type: Function },
      _items: { type: Array, attribute: false },
      _selectedItem: { type: Object, attribute: false },
      _skeleton: { type: Boolean, attribute: false },
      _error: { type: Boolean, attribute: false },
      _empty: { type: Boolean, attribute: false },
      _itemsProvider: { type: Array, attribute: false },
      _page: { type: Number, attribute: false },
    };
  }

  static get styles () {
    return [
      skeleton,
      // language=CSS
      css`
          :host {
              --selected--bgc: var(--gv-table-selected--bgc, var(--gv-theme-color, #009B5B));
              --hover-bgc: var(--gv-table-hover--bgc, var(--gv-theme-neutral-color-lighter, #FAFAFA));
              --bgc: var(--gv-table--bgc, var(--gv-theme-neutral-color-lightest, #FFFFFF));
              --bdc: var(--gv-table--bdc, var(--gv-theme-neutral-color-dark, #D9D9D9));
              display: block;
              height: 100%;
          }

          .table {
              background-color: var(--bgc);
              display: flex;
              flex-direction: column;
              height: 100%;
          }

          .rows {
              user-select: none;
              -ms-overflow-style: none;
              scrollbar-width: none;
              flex: 1;
              overflow: auto;
              height: 100%;
          }

          .rows::-webkit-scrollbar {
              display: none;
          }

          .row {
              cursor: pointer;
          }

          :host([w-lt-768]) .row {
              height: 70px;
          }

          :host([w-lt-580]) .row {
              height: 60px;
          }

          :host([w-lt-400]) .row {
              height: 50px;
          }

          .widget {
              height: 30px !important;
              text-align: right;
          }

          .widget div:first-child {
              text-align: left;
          }

          .row.widget {
              box-shadow: 0 5px 3px -6px var(--bdc) !important;
          }

          .theader {
              background-color: #FAFAFA;
              font-weight: bold;
          }

          .row, .theader {
              align-items: center;
              align-content: center;
              border-right: solid thick transparent;
              display: grid;
              grid-auto-rows: minmax(80px, auto);
              grid-gap: 10px;
              padding: 0 10px;
          }

          .row:not(:last-child) {
              box-shadow: 0 24px 3px -24px var(--bdc);
          }

          .row:hover, .row.selected {
              background-color: var(--hover-bgc);
          }

          .row.selected {
              border-color: var(--selected--bgc);
              box-sizing: border-box;
          }

          .header {
              border-bottom: 1px solid var(--bdc);
              padding: 30px;
          }

          .header span {
              color: var(--gv-theme-neutral-color-dark, #BFBFBF);
              font-weight: 600;
              font-size: var(--gv-theme-font-size-s, 12px);
              line-height: 20px;
              margin-left: 8px;
          }

          .header h2 {
              margin: 0;
              text-transform: uppercase;
          }

          .image {
              width: 50px;
          }

          gv-image {
              height: 35px;
              width: 35px;
              --gv-image--of: contain;
              padding-left: 20px;
          }

          gv-icon {
              transform: rotate(0deg);
              --gv-icon--s: 18px;
          }

          gv-icon.desc {
              transform: rotate(180deg);
          }

          .empty, .error {
              align-items: center;
              display: grid;
              font-weight: 600;
              font-size: var(--gv-theme-font-size-xl, 26px);
              text-align: center;
              color: var(--gv-theme-color-dark, #193E34);
              opacity: 0.5;
              padding: 41px;
          }

          gv-pagination {
              align-self: flex-end;
          }
      `,
    ];
  }

  constructor () {
    super();
    this.breakpoints = {
      width: [400, 580, 768],
    };
    this._empty = false;
    this.order = '';
    this._selectedItem = '';
    // to display skeleton
    this.options = { data: [{ field: '' }] };
    this._items = [{}, {}];
    this.addEventListener('gv-pagination:paginate', (e) => {
      this._page = e.detail.page;
      const startPage = (this._page - 1) * this.options.paging;
      this._items = this._itemsProvider.slice(startPage, startPage + this.options.paging);
    });
  }

  set items (items) {
    this._skeleton = true;
    Promise.resolve(items)
      .then((items) => {
        if (items) {
          if (Array.isArray(items)) {
            this._items = items;
          }
          else {
            this._items = items;
            this._items = [];
            this.options.data[0].field = 'key';
            this.options.data[1].field = 'value';
            let total;
            if (this.options.percent) {
              this.options.data[2].field = 'percent';
              const values = Object.values(items.values);
              if (values && values.length) {
                total = values.reduce((p, n) => p + n);
              }
            }
            this._widget = true;
            Object.keys(items.values).forEach((key) => {
              const item = { key: items.metadata[key].name, value: items.values[key] };
              if (this.options.percent) {
                item.percent = parseFloat(item.value / total * 100).toFixed(2) + '%';
              }
              this._items.push(item);
            });
          }

          this._itemsProvider = this._items.slice();
          if (this.options.paging) {
            this._items = this._items.splice(0, this.options.paging);
          }
          this._empty = this._items.length === 0;
          this._skeleton = false;
        }
      })
      .catch(() => {
        this._error = true;
        this._skeleton = false;
        this._items = [];
      });
  }

  _onSortChanged (field, e) {
    if (e) {
      e.preventDefault();
    }
    if (this._items) {
      if (this.order) {
        const desc = this.order.startsWith('-');
        const previousOrder = desc ? this.order.substring(1) : this.order;
        const value = field || previousOrder;
        if (field) {
          this.order = previousOrder === value ? (desc ? value : '-' + value) : value;
        }
        this._items = this._items.sort((item, item2) => {
          const itemData = this._getDataFromField(item, value) ? this._getDataFromField(item, value).toLowerCase() : '';
          const itemData2 = this._getDataFromField(item2, value) ? this._getDataFromField(item2, value).toLowerCase() : '';
          if (this.order.startsWith('-')) {
            return itemData2.localeCompare(itemData);
          }
          else {
            return itemData.localeCompare(itemData2);
          }
        });
      }
      else {
        this._items = this._items;
      }
    }
  }

  _onSelect (item) {
    if (this.options.selectable && !this._skeleton) {
      const currentItem = JSON.stringify(item);
      if (this.options.selectable === 'multi') {
        if (this._selectedItem && this._selectedItem.includes(currentItem)) {
          this._selectedItem = this._selectedItem.replace(currentItem, '');
        }
        else {
          this._selectedItem += currentItem;
        }
      }
      else {
        if (this._selectedItem === item) {
          this._selectedItem = undefined;
        }
        else {
          this._selectedItem = currentItem;
        }
      }
      dispatchCustomEvent(this, 'select', this._selectedItem);
    }
  }

  _onMouseEnter (item) {
    if (!this._selectedItem && !this._skeleton) {
      dispatchCustomEvent(this, 'mouseenter', { item });
    }
  }

  _onMouseLeave () {
    if (!this._selectedItem && !this._skeleton) {
      dispatchCustomEvent(this, 'mouseleave');
    }
  }

  _renderHeader (styleGridColumns) {
    if (this.noheader) {
      return '';
    }
    else {
      return html`
        <div class=${classMap({ theader: true, widget: this._widget })} style="${styleGridColumns}">
          ${this.options && this.options.data && (this._items && this._items.length) ? repeat(this.options.data, (option) => option, (option) => {
        const orderValue = (this.order && this.order.startsWith('-')) ? this.order.substring(1) : this.order;
        const label = this.format && option.label ? this.format(option.label) : option.label;
        return html`
                <div>${this.order && !this.nosort ? html`
                   <gv-button link @click="${this._onSortChanged.bind(this, option.field)}">${until(label)}</gv-button>
                      ${orderValue === option.field ? html`
                        <gv-icon class=${classMap({ desc: this.order.startsWith('-') })} shape="design:triangle"></gv-icon>` : ''}
                    </a>` : until(label)}
                </div>`;
      }) : ''}
        </div>`;
    }
  }

  _renderRows (styleGridColumns) {
    return html`
      <div class="rows" style="${this.rowsheight ? 'height: ' + this.rowsheight : ''}" @mouseleave="${this._onMouseLeave.bind(this)}">
        ${(this._items && this._items.length) ? repeat(this._items, (item) => item, (item) => {
      return html`
          <div class=${classMap({
        row: true,
        widget: this._widget,
        skeleton: this._skeleton,
        selected: this._selectedItem.includes(JSON.stringify(item)),
      })} style="${styleGridColumns}"
            @click="${this._onSelect.bind(this, item)}" @mouseenter="${this._onMouseEnter.bind(this, item)}">
            ${this.options && this.options.data ? repeat(this.options.data, (option) => option, (option) => {
        let value = option.field ? this._getDataFromField(item, option.field) : '';
        if (option.type === 'date' && value) {
          value = new Date(value).toLocaleString(getLanguage());
        }
        if (option.format) {
          value = option.format('gv-table.' + value);
        }
        const alt = option.alt ? this._getDataFromField(item, option.alt) : '';
        const tag = option.tag ? this._getDataFromField(item, option.tag) : '';
        const image = option.type === 'image';
        return html`
                  <div class=${classMap({ image })}>
                    ${option.icon && option.icon(item) ? html`
                      <gv-icon shape="${option.icon(item)}" style="${option.style ? option.style(item) : ''}">
                      </gv-icon>` : ''}
                    ${image ? this._renderImage(until(value), alt) : until(value)}
                    ${tag ? this._renderTag(tag) : ''}
                  </div>
              `;
      }) : ''}
          </div>
        </div>`;
    }) : ''}
    </div>`;
  }

  _renderItems () {
    const styleGridColumns = `grid-template-columns: repeat(${(this.options && this.options.data && this.options.data.length) || 1}, 1fr)`;
    return html`
      ${this._renderHeader(styleGridColumns)}
      ${this._renderRows(styleGridColumns)}
      ${this._renderPagination()}
    `;
  }

  _renderPagination () {
    if (this.options && this.options.paging && this._itemsProvider) {
      const paginationData = {
        first: 1,
        last: this._itemsProvider.length / this.options.paging,
        total: this._itemsProvider.length,
        current_page: this._page || 1,
        total_pages: this._itemsProvider.length / this.options.paging,
      };
      return html`<gv-pagination .data="${paginationData}"></gv-pagination>`;
    }
  }

  _getDataFromField (item, field) {
    return field.split('.').reduce((p, c) => p && p[c], item);
  }

  _renderTag (tag) {
    return html` <gv-tag ?skeleton="${this._skeleton}">${tag}</gv-tag>`;
  }

  _onImageLoaded () {
    this._skeleton = false;
  }

  _renderImage (picture, alt) {
    return html`<gv-image src="${picture}" alt="${alt}" @load="${this._onImageLoaded}">`;
  }

  updated () {
    this._onSortChanged();
  }

  render () {
    if (this._error) {
      return html`<div class="error">${i18n('gv-table.error')}</div>`;
    }

    const classes = {
      table: true,
      skeleton: this._skeleton,
    };

    const emptyStyle = {
      height: this.rowsheight ? this.rowsheight : '',
    };

    return html`
      <div class=${classMap(classes)}>
        ${this.title ? html`
          <div class="header"><h2>${this.title} ${!this._empty ? html`<span>(${this._items.length})</span>` : ''}</h2></div>`
      : ''}
        ${!this._empty ? this._renderItems() : html`
            <div class="empty" style="${styleMap(emptyStyle)}">
                ${this.emptymessage ? this.emptymessage : i18n('gv-table.empty')}
            </div>`}
      </div>
    `;
  }
}

window.customElements.define('gv-table', GvTable);
