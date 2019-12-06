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
import { repeat } from 'lit-html/directives/repeat';
import '../atoms/gv-button';
import '../atoms/gv-icon';
import '../atoms/gv-nav-link';
import { dispatchCustomEvent } from '../lib/events';
import { classMap } from 'lit-html/directives/class-map';
/**
 * A tree menu
 *
 * @fires gv-tree-menu:select - Custom event from child components
 *
 * @attr {Array} items - list of items and subitems to be displayed in the menu MenuItem: {name: String, value: any, children: Array<MenuItem>}
 * @attr {Boolean} closed - allows to close the menu
 * @attr {Object} selectedItem - the item selected
 *
 */
export class GvTree extends LitElement {

  static get properties () {
    return {
      items: { type: Array },
      closed: { type: Boolean },
      selectedItem: { type: Object },
    };
  }

  static get styles () {
    return [
      // language=css
      css`
          :host {
            --c: var(--gv-tree-menu--c, #262626);
            --bgc: var(--gv-tree-menu--bgc, #FFF);
            --active-bdl: var(--gv-tree-menu-active--bdl);
            --active-bgc: var(--gv-tree-menu-active--bgc, lightgrey);
            --hover-bgc: var(--gv-tree-menu-hover--bgc, grey);
            --gv-icon--h: 20px;
            --gv-icon--w: 20px;
            --gv-nav-link-a--ph: 0;
            --gv-nav-link--ta: left;

            background-color: var(--bgc);
            color: var(--c);
            display: flex;
            flex-direction: row;
            margin: 0 50px;
            border-radius: 5px;
            height: 100%;
          }

          .switch {
            max-width: 40px;
          }

          .tree {
            position: relative;
            min-width: 300px;
            padding-top: 20px;
            box-shadow: 15px 0 15px -5px hsla(0,0%,78.4%,.3);
            overflow: scroll;
          }

          .tree.closed {
            min-width: 42px;
          }

          .main-tree-menu {
            flex: 1;
            user-select: none;
          }

          .tree-menu {
            list-style: none;
            padding-left: 10px;
          }

          .tree-menu.closed {
            display: none;
          }

          .tree-menu__item {
            margin: 2px;
            position: relative;
          }

          .selected {
            background-color: var(--active-bgc);
            border: var(--active-bdl);
          }

          .page:hover {
            background-color: var(--hover-bgc);
          }

          .folder {
            margin-top: 10px;
          }

          .folder > ul{
            margin-left: 10px;
          }

          .folder > gv-nav-link {
            font-weight: bold;
          }

          .tree-arrow {
            transform: rotate(90deg);
            position: absolute;
            right: 10px;
            top: 15px;
            opacity: 0.5;
            cursor: pointer;
          }

          .closed {
            transform: rotate(0deg);
            transition: all 1s ease-in-out;
          }

          .switch {
            cursor: pointer;
            opacity: 0.5;
            position: absolute;
            right: 10px;
            top: 10px;
          }

          gv-nav-link {
            width: 100%;
          }
      `,
    ];
  }

  constructor () {
    super();
    this.closed = false;
  }

  _onSelect (menuItem, e) {
    e.stopPropagation();
    this.selectedItem = menuItem;
    dispatchCustomEvent(this, 'select', menuItem);
  }

  _onClick (menuItem, e) {
    if (e) {
      e.stopPropagation();
    }
    menuItem.expanded = !menuItem.expanded;
    super.performUpdate();
  }

  _getMenuItemPage (menuItem) {
    return html`<gv-nav-link
                .title="${menuItem.name}"
                @gv-nav-link:click=${this._onSelect.bind(this, menuItem)}>
                </gv-nav-link>`;
  }

  _getMenuItemFolder (menuItem) {
    return html`
        <gv-nav-link
        .title="${menuItem.name}"
        @gv-nav-link:click=${this._onClick.bind(this, menuItem)}>
        </gv-nav-link>
        ${menuItem.expanded
          ? html`<gv-icon class="tree-arrow" shape="code:right-circle" @click=${() => this._onClick(menuItem)}></gv-icon>${this._getMenu(menuItem.children)}`
          : html`<gv-icon class="tree-arrow closed" shape="code:right-circle" @click=${() => this._onClick(menuItem)}></gv-icon>`
        }
    `;
  }

  _getMenu (menuItems) {
    return html`<ul class="${classMap({ 'tree-menu': true, closed: this.closed })}">${repeat(menuItems, (item) => this._getMenuItem(item))}</ul>`;
  }

  _getMenuItem (menuItem) {
    return html`
          ${(menuItem.children && menuItem.children.length > 0)
            ? html`<li class="tree-menu__item folder">${this._getMenuItemFolder(menuItem)}</li>`
            : html`<li class="tree-menu__item page ${menuItem === this.selectedItem ? 'selected' : ''}">${this._getMenuItemPage(menuItem)}</li>`
          }`;
  }

  _toggleMenu () {
    this.closed = !this.closed;
  }

  render () {
    const classes = {
      tree: true,
      closed: this.closed,
    };
    return html`
        <div class=${classMap(classes)}>
          ${html`<div class="main-tree-menu">${this._getMenu(this.items)}</div>`}
          <gv-icon shape="${this.closed ? 'text:menu' : 'navigation:angle-double-left'}" @click=${this._toggleMenu} class="switch"></gv-icon>
        </div>
          `;
  }
}

window.customElements.define('gv-tree', GvTree);
