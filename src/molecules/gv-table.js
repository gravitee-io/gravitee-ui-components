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
import { empty } from '../styles/empty';
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
import '../organisms/gv-pagination';

/**
 * Table component
 *
 * ## Details
 * * has @theme facet
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
 * @attr {Function} format - A function to format table headers and string cells
 * @attr {Function} compareFn - A function to define how to sort. Default function will sort selected field ignoring case
 * @attr {Array<any>} selected - A list of selected ids of the items displayed
 * @attr {String} total - Total of data displayed on the table (useful with in case of pagination)
 * @attr {Boolean} skeleton - Force gv-table to be in skeleton mode
 *
 * @cssprop {Color} [--gv-table-selected--bgc=var(--gv-theme-color, #5A7684)] - Selected background color
 * @cssprop {Color} [--gv-table-hover--bgc=var(--gv-theme-neutral-color-lighter, #FAFAFA)] - Row background color on hover
 * @cssprop {Color} [--gv-table--bgc=var(--gv-theme-neutral-color-lightest, #FFFFFF)] - Background color
 * @cssprop {Color} [--gv-table--bdc=var(--gv-theme-neutral-color-dark, #D9D9D9)] - Border color
 * @cssprop {String} [--gv-table-header--fz=var(--gv-theme-font-size-l, 20px)] - Title font size
 * @cssprop {Length} [--gv-table-header--p=2rem 4rem] - Title padding
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
      compareFn: { type: Function },
      selected: { type: Array, reflect: true },
      total: { type: String },
      skeleton: { type: Boolean },
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
      empty,
      // language=CSS
      css`
        :host {
          --selected--bgc: var(--gv-table-selected--bgc, var(--gv-theme-color, #5A7684));
          --hover-bgc: var(--gv-table-hover--bgc, var(--gv-theme-neutral-color-lighter, #FAFAFA));
          --bgc: var(--gv-table--bgc, var(--gv-theme-neutral-color-lightest, #FFFFFF));
          --bdc: var(--gv-table--bdc, var(--gv-theme-neutral-color-dark, #D9D9D9));
          display: block;
          height: 100%;
          margin: 0.2rem;
          box-sizing: border-box;
        }

        .table {
          background-color: var(--bgc);
          flex-direction: column;
          height: 100%;
          display: flex;
          width: 100%;
        }

        .rows {
          -ms-overflow-style: none;
          scrollbar-width: none;
          flex: 1;
          height: 100%;
          transition: height 250ms ease-in-out;
        }

        .rows::-webkit-scrollbar {
          display: none;
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
          padding: 0 0.2rem;
        }

        .row, .theader {
          align-items: center;
          align-content: center;
          border-right: solid thick transparent;
          display: grid;
        }

        div {
          box-sizing: border-box;
        }

        .cell {
          height: 100%;
          display: flex;
          align-items: center;
          margin: 0.2rem;
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
          padding: var(--gv-table-header--p, 2rem 4rem);
        }

        .title {
          margin: 0;
          text-transform: uppercase;
          font-size: var(--gv-table-header--fz, var(--gv-theme-font-size-l, 20px));
          line-height: var(--gv-table-header--fz, var(--gv-theme-font-size-l, 20px));
          opacity: 0.6;
        }

        .title span {
          font-weight: 600;
          font-size: var(--gv-theme-font-size-s);
          line-height: var(--gv-theme-font-size-s);
          margin-left: 8px;
          opacity: 0.7;
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

        gv-pagination {
          align-self: flex-end;
        }

        .cell > *:not(gv-tag) {
          margin: auto;
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
    this.compareFn = (item, item2, value) => {
      const itemData = this._getDataFromField(item, value) && this._getDataFromField(item, value).toLowerCase ? this._getDataFromField(item, value).toLowerCase() : '';
      const itemData2 = this._getDataFromField(item2, value) && this._getDataFromField(item2, value).toLowerCase ? this._getDataFromField(item2, value).toLowerCase() : '';
      if (this.order.startsWith('-')) {
        return itemData2.localeCompare(itemData);
      }
      else {
        return itemData.localeCompare(itemData2);
      }
    };
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
            item._id = (item.id == null ? index : item.id);
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
      this._itemsProvider = this._itemsProvider.sort((item, item2) => this.compareFn(item, item2, value));
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
    return item.id == null ? item._id : item.id;
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
        .filter((item) => this.selected && this.selected.includes(this._getItemId(item)));
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
      const style = {
        ...styleGridColumns,
        ...{
          height: this.rowheight,
          'grid-auto-rows': this.rowheight ? null : 'minmax(80px, auto)',
        },
      };

      return html`
        <div class=${classMap({ theader: true })} style=${styleMap(style)}>
          ${this.options && this.options.data && (this._items && this._items.length) ? repeat(this.options.data, (option) => option, (option) => {
        const orderValue = (this.order && this.order.startsWith('-')) ? this.order.substring(1) : this.order;
        const label = this.format && option.label ? this.format(option.label) : option.label;
        const style = typeof option.headerStyle === 'function' ? option.headerStyle(label) : option.headerStyle;
        return html`
                <div style="${(style || '')}">${this.order && !this.nosort ? html`
                   <gv-button link @click="${this._onSortChanged.bind(this, option.field || option.tag)}">${until(label)}</gv-button>
                      ${orderValue === option.tag || (orderValue === option.field && option.type !== 'image') ? html`
                        <gv-icon class=${classMap({ desc: this.order.startsWith('-') })} shape="design:triangle"></gv-icon>` : ''}
                    </a>` : until(label)}
                </div>`;
      }) : ''}
        </div>`;
    }
  }

  _renderIcon (item, itemIndex, option) {
    const icon = typeof option.icon === 'function' ? option.icon(item) : option.icon;
    const iconTitle = typeof option.iconTitle === 'function' ? option.iconTitle(item) : option.iconTitle;
    if (icon) {
      return html` <gv-icon shape="${icon}" title="${iconTitle}"></gv-icon>`;
    }
    return '';
  }

  _renderComponent (item, itemIndex, option, value, type) {
    if (option.condition && !option.condition(item)) {
      return '';
    }
    const element = document.createElement(type);
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
            const optionConfirm = typeof option.confirm === 'function' ? option.confirm(item) : option.confirm;
            if (optionConfirm == null) {
              setTimeout(() => {
                option.attributes[attribute](item, e, element);
              }, 0);
            }
          });
        }
        else if (typeof option.attributes[attribute] === 'function') {
          const value = option.attributes[attribute](item);
          if (value != null) {
            element[attribute] = value;
          }
        }
        else {
          if (this.format && typeof option.attributes[attribute] === 'string') {
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

    const optionConfirm = typeof option.confirm === 'function' ? option.confirm(item) : option.confirm;

    if (optionConfirm) {
      const confirm = document.createElement('gv-confirm');
      if (this.format) {
        this.format(optionConfirm.msg).then((t) => (confirm.message = t));
      }
      else {
        confirm.message = optionConfirm.msg;
      }
      if (optionConfirm.danger) {
        confirm.danger = true;
      }
      confirm.addEventListener('click', (e) => e.stopPropagation());
      confirm.addEventListener('gv-confirm:ok', (e) => {
        e.stopPropagation();
        option.attributes.onClick(item, e, element);
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
        let alt = '';
        if (option.alt) {
          if (typeof option.alt === 'function') {
            alt = option.alt(item);
          }
          else {
            alt = this._getDataFromField(item, option.alt);
          }
        }
        return this._renderImage(value, alt);
      }
      else if (typeof option.type === 'function') {
        return this._renderComponent(item, itemIndex, option, value, option.type(item));
      }
      else if (option.type.startsWith('gv-')) {
        return this._renderComponent(item, itemIndex, option, value, option.type);
      }
    }
    return until(value);
  }

  _isSelected (item) {
    return this.selected && this.selected.includes(this._getItemId(item));
  }

  _renderRows (styleGridColumns) {
    return html`
      <div class="rows"
        style=${styleMap({ height: this.rowsheight, 'user-select': this.options.selectable ? 'none' : '' })}
        @mouseleave="${this._onMouseLeave.bind(this)}">
        ${(this._items && this._items.length) ? repeat(this._items, (item) => item, (item, itemIndex) => {
      return html`
          <div class=${classMap({
        row: true,
        skeleton: this._skeleton,
        selected: this._isSelected(item),
      })} style=${styleMap({
        ...styleGridColumns,
        ...{
          height: this.rowheight,
          'grid-auto-rows': this.rowheight ? null : 'minmax(80px, auto)',
          cursor: this.options.selectable ? 'pointer' : '',
          'border-color': (this.options.selectable && this._isSelected(item)) ? 'var(--selected--bgc)' : '',
        },
      })}
            @click="${this._onSelect.bind(this, item)}"
            @mouseenter="${this._onMouseEnter.bind(this, item)}">
            ${this.options && this.options.data ? repeat(this.options.data, (option) => option, (option) => {
        const style = typeof option.style === 'function' ? option.style(item) : option.style;
        return html`<div class="cell" style="${ifDefined(style)}">${this._renderCell(option, item, itemIndex)}${this._renderTag(option, item)}${option.icon ? this._renderIcon(item, itemIndex, option) : ''}</div>
              `;
      }) : ''}
          </div>
        </div>`;
    }) : ''}
    </div>`;
  }

  _renderItems () {
    let widthTemplate = this.options.data.map((o) => {
      if (o.width) {
        return o.width;
      }
      else if (o.type === 'image') {
        return '80px';
      }
      else if (o.type === 'icon') {
        return '40px';
      }
      return null;
    });
    const fixedData = widthTemplate.filter((width) => width !== null);
    const fixedWidth = fixedData.reduce((acc, width) => {
      return acc + parseInt(width.replace('px', ''), 10);
    }, 0);

    widthTemplate = widthTemplate.map((width) => {
      if (width == null) {
        return `calc((100% - ${fixedWidth}px) / ${this.options.data.length - fixedData.length})`;
      }
      return width;
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
      let tag;
      if (typeof option.tag === 'function') {
        tag = option.tag(item);
      }
      else {
        tag = option.format ? option.format(this._getDataFromField(item, option.tag)) : this._getDataFromField(item, option.tag);
      }
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

  updated (props) {
    this._onSortChanged();
  }

  render () {
    if (this._error) {
      return html`<div class="error">${i18n('gv-table.error')}</div>`;
    }

    const classes = {
      table: true,
      skeleton: this._skeleton || this.skeleton,
    };

    const emptyStyle = {
      height: this.rowsheight ? this.rowsheight : '',
    };

    return html`
      <div class=${classMap(classes)} style="${styleMap({ display: this.rowsheight ? 'block' : 'flex' })}">
        ${this.title ? html`
          <div class="header"><h3 class="title">${this.title} ${!this._empty ? html`<span>(${this.total || (this._items && this._items.length)})</span>` : ''}</h3></div>`
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
