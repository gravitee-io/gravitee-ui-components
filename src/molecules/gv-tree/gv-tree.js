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
import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import '../../atoms/gv-button';
import '../../atoms/gv-icon';
import { dispatchCustomEvent } from '../../lib/events';
import { classMap } from 'lit/directives/class-map.js';

/**
 * A tree menu
 *
 * ## Details
 * * has @theme facet
 *
 * @fires gv-tree:select - Custom event from child components
 * @fires gv-tree:toggle - Custom event from child components
 *
 * @attr {Array} items - list of items and subitems to be displayed in the menu MenuItem: {name: String, value: any, children: Array<MenuItem>}
 * @attr {Boolean} closed - allows to close the menu
 * @attr {String} closedTooltip - tooltip shown when closed and hovering over icon
 * @attr {Object} selectedItem - the item selected
 *
 * @cssprop {Color} [--gv-tree--bgc=var(--gv-theme-neutral-color-lightest, #ffffff)] - Background color
 * @cssprop {Color} [--gv-tree--c=var(--gv-theme-font-color-dark, #262626)] - Color
 * @cssprop {Color} [--gv-tree-active--bdc=var(--gv-theme-color, #5a7684)] - Active border
 * @cssprop {Color} [--gv-tree-active--bgc=var(--gv-theme-neutral-color-dark, #d9d9d9)] - Active background color
 * @cssprop {Length} [--gv-tree-icon--s=20px] - Height and icon width
 */
export class GvTree extends LitElement {
  static get properties() {
    return {
      items: { type: Array },
      closed: { type: Boolean, reflect: true },
      closedTooltip: { type: String },
      selectedItem: { type: Object },
    };
  }

  static get styles() {
    return [
      // language=css
      css`
        :host {
          --c: var(--gv-tree--c, var(--gv-theme-font-color-dark, #262626));
          --bgc: var(--gv-tree--bgc, var(--gv-theme-neutral-color-lightest, #ffffff));
          --active-bdc: var(--gv-tree-active--bdc, var(--gv-theme-color, #5a7684));
          --active-bgc: var(--gv-tree-active--bgc, var(--gv-theme-neutral-color-dark, #d9d9d9));
          --gv-icon--s: var(--gv-tree-icon--s, 20px);
          --gv-icon--c: var(--c);
          background-color: var(--bgc);
          color: var(--c);
          display: flex;
          flex-direction: row;
          height: 100%;
        }

        .tree {
          padding-top: 10px;
          transition: all 350ms ease-in-out;
          width: 300px;
        }

        .tree.closed {
          width: 42px;
        }

        .main-tree-menu {
          user-select: none;
          overflow-y: auto;
          overflow-x: hidden;
          height: calc(100% - 20px);
          direction: rtl;
        }

        .main-tree-menu > ul {
          position: relative;
          padding-right: 0.5em;
        }

        ul {
          display: block;
          line-height: 1.5em;
          text-align: left;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        ul li {
          display: block;
          padding: 0.5em 0 0.5em 1em;
        }

        ul li ul {
          margin-bottom: -0.5em;
          margin-top: 0.5em;
        }

        ul li:hover:not(.folder):not(.selected) > label::before {
          border-right-width: 4px;
          border-right-style: solid;
          border-right-color: var(--active-bgc);
          box-sizing: border-box;
        }

        ul label {
          cursor: pointer;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          direction: ltr;
        }

        ul label::before {
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          content: '';
          height: 3em;
          left: 0;
          position: absolute;
          right: 0;
        }

        .selected > label::before {
          border-right-width: 4px;
          border-right-style: solid;
          border-right-color: var(--active-bdc);
          box-sizing: border-box;
        }

        ul label:hover,
        .selected > label {
          font-style: italic;
          text-decoration: underline;
        }

        .folder > label:hover,
        .folder > label {
          font-weight: bold;
          font-style: normal;
          text-decoration: none;
        }

        ul label:hover,
        .folder > label:hover {
          opacity: 0.8;
        }

        .tree-arrow {
          transform: rotate(90deg);
          cursor: pointer;
          opacity: 0.5;
          width: 20px;
          height: 20px;
        }

        .closed .tree-arrow {
          transform: rotate(0deg);
        }

        .closed .tree-menu {
          height: 0;
          transition: height 0.8s;
          display: none;
        }

        .switch {
          cursor: pointer;
          opacity: 0.7;
          position: sticky;
          margin: 0 11px 0 11px;
          display: flex;
          justify-content: flex-end;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.closed = true;
    this.closedTooltip = 'Expand';
  }

  _onSelect(menuItem, e) {
    e.stopPropagation();
    this.selectedItem = menuItem;
    dispatchCustomEvent(this, 'select', menuItem);
  }

  _onClick(menuItem, e) {
    if (e) {
      e.stopPropagation();
    }
    menuItem.expanded = !menuItem.expanded;
    this.requestUpdate();
  }

  _getMenuItemPage(menuItem) {
    return html`<label @click=${this._onSelect.bind(this, menuItem)}> ${menuItem.name} </label>`;
  }

  _getMenuItemFolder(menuItem) {
    return html` <label @click=${this._onClick.bind(this, menuItem)} class="${classMap({ closed: !menuItem.expanded })}">
        ${menuItem.name}
        <gv-icon class="tree-arrow" shape="code:right-circle"></gv-icon>
      </label>
      <span class="${classMap({ closed: !menuItem.expanded })}"> ${this._getMenu(menuItem.children)} </span>`;
  }

  _getMenu(menuItems) {
    if (menuItems) {
      return html`<ul
        class="${classMap({
          'tree-menu': true,
          closed: this.closed,
        })}"
      >
        ${repeat(menuItems, (item) => this._getMenuItem(item))}
      </ul>`;
    }
    return '';
  }

  _getMenuItem(menuItem) {
    return html` ${menuItem.children && menuItem.children.length > 0
      ? html`<li class="tree-menu__item folder">${this._getMenuItemFolder(menuItem)}</li>`
      : html`<li class="tree-menu__item page ${menuItem === this.selectedItem ? 'selected' : ''}">
          ${this._getMenuItemPage(menuItem)}
        </li>`}`;
  }

  _toggleMenu() {
    this.closed = !this.closed;
    dispatchCustomEvent(this, 'toggle', { closed: this.closed });
  }

  _getIcon() {
    const innerContent = this.closed
      ? html`<gv-popover position="right">
          <gv-icon shape="text:menu" @click=${this._toggleMenu}></gv-icon>
          <div slot="popover">${this.closedTooltip}</div>
        </gv-popover>`
      : html` <gv-icon shape="navigation:angle-double-left" @click=${this._toggleMenu}></gv-icon>`;
    return html`<div class="switch">${innerContent}</div>`;
  }

  render() {
    const classes = {
      tree: true,
      closed: this.closed,
    };
    return html`
      <div class=${classMap(classes)}>${this._getIcon()} ${html`<div class="main-tree-menu">${this._getMenu(this.items)}</div>`}</div>
    `;
  }
}

window.customElements.define('gv-tree', GvTree);
