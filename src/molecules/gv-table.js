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

/**
 * Table component
 *
 * @fires gv-table:click - when table row is clicked
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
 * @attr {String} emptykey - The i18n key of the empty state
 * @attr {String} format - A function to format table headers
 *
 * @cssprop {Color} [--gv-table-selected--bgc=var(--gv-theme-color, #009B5B)] - Selected background color
 * @cssprop {Color} [--gv-table-hover--bgc=var(--gv-theme-neutral-color-lighter, #FAFAFA)] - Row background color on hover
 * @cssprop {Color} [--gv-table--bgc=var(--gv-theme-neutral-color-lightest, #FFFFFF)] - Background color
 * @cssprop {Color} [--gv-table--bdc=var(--gv-theme-neutral-color-dark, #D9D9D9)] - Border color
 *
 */
export class GvTable extends LitElement {

  static get properties () {
    return {
      items: { type: Array },
      title: { type: String },
      order: { type: String },
      options: { type: Array },
      noheader: { type: Boolean },
      nosort: { type: Boolean },
      rowsheight: { type: String },
      emptykey: { type: String },
      format: { type: Function },
      _items: { type: Array, attribute: false },
      _selectedItem: { type: Object },
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
          }

          .table {
            background-color: var(--bgc);
          }

          .rows {
            overflow: scroll;
            user-select: none;
          }

          .rows {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          .rows::-webkit-scrollbar {
            display: none;
          }

          .row {
            cursor: pointer;
          }

          .theader {
            font-weight: bold;
          }

          .row, .theader {
            align-items: center;
            border-right: solid thick transparent;
            display: grid;
            grid-auto-rows: minmax(80px, auto);
            grid-gap: 10px;
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

        .empty {
          align-items: center;
          display: grid;
          font-weight: 600;
          font-size: var(--gv-theme-font-size-xl, 26px);
          text-align: center;
          color: var(--gv-theme-color-dark, #193E34);
          opacity: 0.5;
          padding: 41px;
        }
      `,
    ];
  }

  constructor () {
    super();
    this._empty = true;
  }

  _onSortChanged (data, e) {
    if (e) {
      e.preventDefault();
    }
    if (this.items) {
      if (this.order) {
        const desc = this.order.startsWith('-');
        const previousOrder = desc ? this.order.substring(1) : this.order;
        const value = data || previousOrder;
        if (data) {
          this.order = previousOrder === value ? (desc ? value : '-' + value) : value;
        }
        this._items = this.items.sort((item, item2) => {
          const itemData = this._getData(item, value) ? this._getData(item, value).toLowerCase() : '';
          const itemData2 = this._getData(item2, value) ? this._getData(item2, value).toLowerCase() : '';
          if (this.order.startsWith('-')) {
            return itemData2.localeCompare(itemData);
          }
          else {
            return itemData.localeCompare(itemData2);
          }
        });
      }
      else {
        this._items = this.items;
      }
    }
  }

  _onClick (item) {
    if (this._selectedItem === item) {
      this._selectedItem = undefined;
    }
    else {
      this._selectedItem = item;
    }
    dispatchCustomEvent(this, 'click', { item });
  }

  _onMouseEnter (item) {
    if (!this._selectedItem) {
      dispatchCustomEvent(this, 'mouseenter', { item });
    }
  }

  _onMouseLeave () {
    if (!this._selectedItem) {
      dispatchCustomEvent(this, 'mouseleave');
    }
  }

  _renderHeader (styleGridColumns) {
    if (this.noheader) {
      return '';
    }
    else {
      return html`
        <div class="theader" style="${styleGridColumns}">
          ${this.options && (this._items && this._items.length) ? repeat(this.options, (option) => option, (option) => {
            const orderValue = (this.order && this.order.startsWith('-')) ? this.order.substring(1) : this.order;
            const label = this.format && option.label ? this.format(option.label) : option.label;
            return html`
                <div>${this.order && !this.nosort ? html`
                    <a href="" @click="${this._onSortChanged.bind(this, option.data)}">${until(label)}
                      ${orderValue === option.data ? html`
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
          <div class=${classMap({ row: true, selected: item === this._selectedItem })} style="${styleGridColumns}"
            @click="${this._onClick.bind(this, item)}" @mouseenter="${this._onMouseEnter.bind(this, item)}">
            ${this.options ? repeat(this.options, (option) => option, (option) => {
              let value = option.data ? this._getData(item, option.data) : '';
              if (option.type === 'date' && value) {
                value = new Date(value).toLocaleString(getLanguage());
              }
              if (option.format) {
                value = option.format('gv-table.' + value);
              }
              const alt = option.alt ? this._getData(item, option.alt) : '';
              const tag = option.tag ? this._getData(item, option.tag) : '';
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
    const styleGridColumns = `grid-template-columns: repeat(${this.options && this.options.length}, 1fr)`;
    return html`
      ${this._renderHeader(styleGridColumns)}
      ${this._renderRows(styleGridColumns)}
    `;
  }

  _getData (item, data) {
    return data.split('.').reduce((p, c) => p && p[c], item);
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
    const classes = {
      table: true,
      skeleton: this._skeleton,
    };
    const hasData = this._items && this._items.length;

    const emptyStyle = {
      height: this.rowsheight ? this.rowsheight : '',
    };

    return html`
      <div class=${classMap(classes)}>
        <div class="header"><h2>${this.title} ${hasData ? html`<span>(${this.items.length})</span>` : ''}</h2></div>
        ${hasData ? this._renderItems() : html`
            <div class="empty" style="${styleMap(emptyStyle)}">
                ${this.emptykey ? i18n(this.emptykey) : i18n('gv-table.empty')}
            </div>`}
      </div>
    `;
  }
}

window.customElements.define('gv-table', GvTable);
