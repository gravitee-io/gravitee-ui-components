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
import '../atoms/gv-link';
import { dispatchCustomEvent } from '../lib/events';
import { classMap } from 'lit-html/directives/class-map';

/**
 * A tree menu
 *
 * @fires gv-tree:select - Custom event from child components
 * @fires gv-tree:toggle - Custom event from child components
 *
 * @attr {Array} items - list of items and subitems to be displayed in the menu MenuItem: {name: String, value: any, children: Array<MenuItem>}
 * @attr {Boolean} closed - allows to close the menu
 * @attr {Object} selectedItem - the item selected
 *
 * @cssprop {Color} [--gv-tree--bgc=var(--gv-theme-neutral-color-lightest, #FFFFF)] - Background color
 * @cssprop {Color} [--gv-tree--c=var(--gv-theme-font-color-dark, #262626)] - Color
 * @cssprop {Color} [--gv-tree-active--bdc=var(--gv-theme-color, #009B5B)] - Active border
 * @cssprop {Color} [--gv-tree-active--bgc=var(--gv-theme-neutral-color, #F5F5F5)] - Active background color
 * @cssprop {Length} [--gv-tree-link-a--ph=10px] - Link horizontal padding
 * @cssprop {String} [--gv-tree-link--ta=left] - Text align
 * @cssprop {Length} [--gv-tree-icon--s=20px] - Height and icon width
 */
export class GvTree extends LitElement {

  static get properties () {
    return {
      items: { type: Array },
      closed: { type: Boolean, reflect: true },
      selectedItem: { type: Object },
    };
  }

  static get styles () {
    return [
      // language=css
      css`
          :host {
              --c: var(--gv-tree--c, var(--gv-theme-font-color-dark, #262626));
              --bgc: var(--gv-tree--bgc, var(--gv-theme-neutral-color-lightest, #FFFFF));
              --active-bdc: var(--gv-tree-active--bdc, var(--gv-theme-color, #009B5B));
              --active-bgc: var(--gv-tree-active--bgc, var(--gv-theme-neutral-color, #F5F5F5));
              --gv-icon--s: var(--gv-tree-icon--s, 20px);
              --gv-link-a--ph: var(--gv-tree-link-a--ph, 10px);
              --gv-link--ta: var(--gv-tree-link--ta, left);
              --gv-link--c: var(--c);
              --gv-icon--c: var(--c);
              background-color: var(--bgc);
              color: var(--c);
              display: flex;
              flex-direction: row;
              --gv-link-a--pv: 10px;
              height: 100%;
          }

          .tree {
              position: relative;
              width: 300px;
              padding-top: 10px;
              transition: all 350ms ease-in-out;
          }

          .tree.closed {
              width: 42px;
          }

          .main-tree-menu {
              flex: 1;
              user-select: none;
              overflow: auto;
              height: calc(100% - 20px);
          }

          .tree-menu {
              list-style: none;
              padding-left: 0;
          }

          .tree-menu__item {
              padding: 0 10px;
              position: relative;
          }

          .selected {
              background-color: var(--active-bgc);
              border-right-width: 3px;
              border-right-style: solid;
              border-right-color: var(--active-bdc);
          }

          .page:hover {
              background-color: var(--active-bgc);
          }

          .folder > ul {
              padding-left: 10px;
          }

          .folder > gv-link {
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

          gv-link {
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
    return html`<gv-link
                .title="${menuItem.name}"
                @gv-link:click=${this._onSelect.bind(this, menuItem)}>
                </gv-link>`;
  }

  _getMenuItemFolder (menuItem) {
    return html`
        <gv-link
        .title="${menuItem.name}"
        @gv-link:click=${this._onClick.bind(this, menuItem)}>
        </gv-link>
        <span class="${classMap({ closed: !menuItem.expanded })}">
         <gv-icon class="tree-arrow" shape="code:right-circle" @click=${() => this._onClick(menuItem)}></gv-icon>${this._getMenu(menuItem.children)}
        </span>`;
  }

  _getMenu (menuItems) {
    if (menuItems) {
      return html`<ul class="${classMap({
        'tree-menu': true,
        closed: this.closed,
      })}">${repeat(menuItems, (item) => this._getMenuItem(item))}</ul>`;
    }
    return '';
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
    dispatchCustomEvent(this, 'toggle', { closed: this.closed });
  }

  render () {
    const classes = {
      tree: true,
      closed: this.closed,
    };
    return html`
        <div class=${classMap(classes)}>
            <div class="switch"><gv-icon shape="${this.closed ? 'text:menu' : 'navigation:angle-double-left'}" @click=${this._toggleMenu}></gv-icon></div>
            ${html`<div class="main-tree-menu">${this._getMenu(this.items)}</div>`}
          
        </div>
          `;
  }
}

window.customElements.define('gv-tree', GvTree);
