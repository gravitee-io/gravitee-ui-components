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
import { link } from '../styles/link';
import { classMap } from 'lit-html/directives/class-map';
import { repeat } from 'lit-html/directives/repeat';
import { dispatchCustomEvent } from '../lib/events';
import { getLanguage, i18n } from '../lib/i18n';
import { until } from 'lit-html/directives/until';
import { styleMap } from 'lit-html/directives/style-map';
import { withResizeObserver } from '../mixins/with-resize-observer';
import { ifDefined } from 'lit-html/directives/if-defined';
import '../atoms/gv-image';

/**
 * Table component
 *
 * @fires gv-table:select - when table row is selected
 * @fires gv-table:mouseenter - when the pointer is entering on a table row
 * @fires gv-table:mouseleave - when the pointer is leaving a table row
 * @fires gv-table:sort - when the order is changed
 *
 * @attr {Array<any>} items - A list of items to display
 * @attr {String} title - A title to display
 * @attr {String} order - If defined, the table will be ordered by the field. Start with '-' to sort in desc
 * @attr {Array<any>} options - The list of options to display
 * @attr {Boolean} noheader - Used to hide the table header
 * @attr {Boolean} nosort - Used to disable the click on header to sort
 * @attr {String} rowsheight - The height of the table rows
 * @attr {String} rowheight - The height of the table single row
 * @attr {String} emptymessage - The empty message to display
 * @attr {String} format - A function to format table headers
 * @attr {Array<any>} selected - A list of selected ids of the items displayed
 *
 * @cssprop {Color} [--gv-table-selected--bgc=var(--gv-theme-color, #009B5B)] - Selected background color
 * @cssprop {Color} [--gv-table-hover--bgc=var(--gv-theme-neutral-color-lighter, #FAFAFA)] - Row background color on hover
 * @cssprop {Color} [--gv-table--bgc=var(--gv-theme-neutral-color-lightest, #FFFFFF)] - Background color
 * @cssprop {Color} [--gv-table--bdc=var(--gv-theme-neutral-color-dark, #D9D9D9)] - Border color
 * @cssprop {String} [--gv-table-header--fz=var(--gv-theme-font-size-xl, 26px)] - Title font size
 * @cssprop {Length} [--gv-table-header--p=30px] - Title padding
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
      rowheight: { type: String },
      emptymessage: { type: String },
      format: { type: Function },
      selected: { type: Array, reflect: true },
      _items: { type: Array, attribute: false },
      _skeleton: { type: Boolean, attribute: false },
      _error: { type: Boolean, attribute: false },
      _empty: { type: Boolean, attribute: false },
      _itemsProvider: { type: Array, attribute: false },
      _page: { type: Number, attribute: false },
    };
  }

  static get styles () {
    return [
      link,
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
              margin: 0.2rem;
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

          .theader {
              background-color: var(--gv-theme-neutral-color-lighter);
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
              box-shadow: 0 5px 3px -6px var(--bdc);
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
              padding: var(--gv-table-header--p, 30px);
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
              font-size: var(--gv-table-header--fz, var(--gv-theme-font-size-xl, 26px));
              line-height: 20px;
          }

          gv-identity-picture {
              height: 35px;
              width: 35px;
              --gv-image--of: contain;
              margin-left: 20px;
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

          .cell {
          }

          .cell > *:not(gv-tag):not(gv-identity-picture) {
              width: 100%;
          }
      `,
    ];
  }

  constructor () {
    super();
    this._id = new Date().getTime();
    this.breakpoints = {
      width: [400, 580, 768],
    };
    this._empty = false;
    this.order = '';
    this._page = 1;
    this._itemsProvider = [];
    this.selected = [];
    this.addEventListener('gv-pagination:paginate', (e) => {
      this._page = e.detail.page;
    });
  }

  set items (items) {
    this._skeleton = true;
    Promise.resolve(items)
      .then((items) => {
        if (items) {
          this._itemsProvider = items.map((item, index) => {
            item._id = item.id || index;
            return item;
          });
          this._onSortChanged();
          this._empty = this._itemsProvider.length === 0;
          this._skeleton = false;
        }
      })
      .catch((e) => {
        console.error(e);
        this._error = true;
        this._skeleton = false;
        this._itemsProvider = [];
      });
  }

  _onSortChanged (field, e) {
    if (e) {
      e.preventDefault();
    }
    if (this._itemsProvider && this.order) {
      const desc = this.order.startsWith('-');
      const previousOrder = desc ? this.order.substring(1) : this.order;
      const value = field || previousOrder;
      if (field) {
        this.order = previousOrder === value ? (desc ? value : '-' + value) : value;
      }
      this._itemsProvider = this._itemsProvider.sort((item, item2) => {
        const itemData = this._getDataFromField(item, value) && this._getDataFromField(item, value).toLowerCase ? this._getDataFromField(item, value).toLowerCase() : '';
        const itemData2 = this._getDataFromField(item2, value) && this._getDataFromField(item2, value).toLowerCase ? this._getDataFromField(item2, value).toLowerCase() : '';
        if (this.order.startsWith('-')) {
          return itemData2.localeCompare(itemData);
        }
        else {
          return itemData.localeCompare(itemData2);
        }
      });
      if (field) {
        dispatchCustomEvent(this, 'sort', { order: this.order });
      }
    }
  }

  get _items () {
    if (this._itemsProvider) {
      if (this.options && this.options.paging && this.options.paging < this._itemsProvider.length) {
        const index = (this._page - 1) * this.options.paging;
        return [...this._itemsProvider].splice(index, this.options.paging);
      }
      return this._itemsProvider;
    }
    return [];
  }

  _getItemId (item) {
    return item.id || item._id;
  }

  _onSelect (item) {
    if (!this._skeleton) {
      if (this.options.selectable) {
        const itemId = this._getItemId(item);
        if (this._isSelected(item)) {
          this.selected = this.selected.filter((id) => itemId !== id);
        }
        else if (this.options.selectable === 'multi') {
          this.selected = [...this.selected, itemId];
        }
        else {
          this.selected = [itemId];
        }
        dispatchCustomEvent(this, 'select', { items: this.selectedItems, options: this.options });
      }
      else {
        dispatchCustomEvent(this, 'select', { items: [item] });
      }
    }
  }

  get selectedItems () {
    if (this.selected && this._itemsProvider) {
      return this._itemsProvider
        .filter((item) => this.selected.includes(this._getItemId(item)));
    }
    return [];
  }

  _onMouseEnter (item) {
    if (!(this.selected && this.selected.length > 0) && !this._skeleton) {
      dispatchCustomEvent(this, 'mouseenter', { item });
    }
  }

  _onMouseLeave () {
    if (!(this.selected && this.selected.length > 0) && !this._skeleton) {
      dispatchCustomEvent(this, 'mouseleave');
    }
  }

  _renderHeader (styleGridColumns) {
    if (this.noheader) {
      return '';
    }
    else {

      const style = { ...styleGridColumns, ...{ height: this.rowheight } };

      return html`
        <div class=${classMap({ theader: true })} style=${styleMap(style)}>
          ${this.options && this.options.data && (this._items && this._items.length) ? repeat(this.options.data, (option) => option, (option) => {
        const orderValue = (this.order && this.order.startsWith('-')) ? this.order.substring(1) : this.order;
        const label = this.format && option.label ? this.format(option.label) : option.label;
        const style = typeof option.headerStyle === 'function' ? option.headerStyle(label) : option.headerStyle;
        return html`
                <div style="${'display: flex;' + (style || '')}">${this.order && !this.nosort ? html`
                   <gv-button link @click="${this._onSortChanged.bind(this, option.field || option.tag)}">${until(label)}</gv-button>
                      ${orderValue === (option.field || option.tag) ? html`
                        <gv-icon class=${classMap({ desc: this.order.startsWith('-') })} shape="design:triangle"></gv-icon>` : ''}
                    </a>` : until(label)}
                </div>`;
      }) : ''}
        </div>`;
    }
  }

  _renderIcon (item, itemIndex, option) {
    const icon = typeof option.icon === 'function' ? option.icon(item) : option.icon;
    return html` <gv-icon shape="${icon}"></gv-icon>`;
  }

  _renderComponent (item, itemIndex, option, value) {
    if (option.condition && !option.condition(item)) {
      return '';
    }
    const element = document.createElement(option.type);
    element.value = value;
    if (option.attributes) {
      Object.keys(option.attributes).forEach((attribute) => {
        if (attribute.startsWith('on')) {
          const event = attribute.replace('on', '').toLowerCase();
          if (event === 'click') {
            element.classList.add('link');
          }
          element.addEventListener(event, (e) => {
            e.stopPropagation();
            if (!option.confirmMessage) {
              option.attributes[attribute](item, e);
            }
          });
        }
        else if (typeof option.attributes[attribute] === 'function') {
          element[attribute] = option.attributes[attribute](item);
        }
        else {
          if (this.format) {
            this.format(option.attributes[attribute]).then((t) => {
              element[attribute] = t;
            });
          }
          else {
            element[attribute] = option.attributes[attribute];
          }
        }
      });
    }
    element.addEventListener('input', (event) => {
      this._items[itemIndex][option.field] = event.target.value;
    });
    if (option.confirmMessage) {
      const confirm = document.createElement('gv-confirm');
      if (this.format) {
        this.format(option.confirmMessage).then((t) => {
          confirm.message = t;
        });
      }
      else {
        confirm.message = option.confirmMessage;
      }
      confirm.addEventListener('click', (e) => e.stopPropagation());
      confirm.addEventListener('gv-confirm:ok', (e) => {
        e.stopPropagation();
        option.attributes.onClick(item, e);
      });
      confirm.appendChild(element);
      return confirm;
    }
    return element;
  }

  _renderCell (option, item, itemIndex) {
    let value = option.field ? this._getDataFromField(item, option.field) : '';
    if (option.type === 'date' && value) {
      value = new Date(value).toLocaleDateString(getLanguage());
    }
    else if (option.type === 'datetime' && value) {
      value = new Date(value).toLocaleString(getLanguage());
    }
    else if (option.type === 'time' && value) {
      value = new Date(value).toLocaleTimeString(getLanguage());
    }
    if (option.format) {
      value = option.format(value);
    }
    if (option.type) {
      if (option.type === 'image') {
        const alt = option.alt ? this._getDataFromField(item, option.alt) : '';
        return this._renderImage(value, alt);
      }
      else if (option.type === 'icon') {
        return this._renderIcon(item, itemIndex, option);
      }
      else if (option.type.startsWith('gv-')) {
        return this._renderComponent(item, itemIndex, option, value);
      }
    }
    return until(value);
  }

  _isSelected (item) {
    if (this.selected && this.selected.includes(this._getItemId(item))) {
      return true;
    }
    return false;
  }

  _renderRows (styleGridColumns) {
    return html`
      <div class="rows" style=${this.rowsheight ? ('flex: auto; height: ' + this.rowsheight) : ''} @mouseleave="${this._onMouseLeave.bind(this)}">
        ${(this._items && this._items.length) ? repeat(this._items, (item) => item, (item, itemIndex) => {
      return html`
          <div class=${classMap({
        row: true,
        skeleton: this._skeleton,
        selected: this._isSelected(item),
      })} style=${styleMap({ ...styleGridColumns, ...{ height: this.rowheight } })}
            @click="${this._onSelect.bind(this, item)}"
            @mouseenter="${this._onMouseEnter.bind(this, item)}">
            ${this.options && this.options.data ? repeat(this.options.data, (option) => option, (option) => {
        const style = typeof option.style === 'function' ? option.style(item) : option.style;
        return html`<div class="cell" style="${ifDefined(style)}">${this._renderCell(option, item, itemIndex)}${this._renderTag(option, item)}</div>
              `;
      }) : ''}
          </div>
        </div>`;
    }) : ''}
    </div>`;
  }

  _renderItems () {
    const widthTemplate = this.options.data.map((o) => {
      if (o.width) {
        return o.width;
      }
      else if (o.type === 'image') {
        return '80px';
      }
      else if (o.icon) {
        return '40px';
      }
      return '1fr';
    });

    const styleGridColumns = { 'grid-template-columns': widthTemplate.join(' ') };
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
        current_page: this._page,
        total_pages: this._itemsProvider.length / this.options.paging,
      };
      return html`<gv-pagination .data="${paginationData}" widget="true"></gv-pagination>`;
    }
  }

  _getDataFromField (item, field) {
    if (typeof field === 'function') {
      return field(item);
    }
    else {
      return field.split('.').reduce((p, c) => p && p[c], item);
    }
  }

  _renderTag (option, item) {
    if (option.tag) {
      const tag = option.format ? option.format(this._getDataFromField(item, option.tag)) : this._getDataFromField(item, option.tag);
      if (tag) {
        return html` <gv-tag ?skeleton="${this._skeleton}">${tag}</gv-tag>`;
      }
    }
    return '';
  }

  _onImageLoaded () {
    this._skeleton = false;
  }

  _renderImage (picture, alt) {
    return html`<gv-identity-picture .picture="${picture}" .display_name="${alt}"></gv-identity-picture>`;
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
          <div class="header"><h2>${this.title} ${!this._empty ? html`<span>(${this._items && this._items.length})</span>` : ''}</h2></div>`
      : ''}
        ${!this._empty && this.options && this.options.data ? this._renderItems() : html`
            <div class="empty" style="${styleMap(emptyStyle)}">
                ${this.emptymessage ? this.emptymessage : i18n('gv-table.empty')}
            </div>`}
      </div>
    `;
  }
}

window.customElements.define('gv-table', GvTable);
