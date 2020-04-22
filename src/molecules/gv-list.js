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
import { css, html, LitElement } from 'lit-element';
import { skeleton } from '../styles/skeleton';
import { repeat } from 'lit-html/directives/repeat';
import { classMap } from 'lit-html/directives/class-map';
import { i18n } from '../lib/i18n';
import { link } from '../styles/link';
import '../molecules/gv-identity-picture';
import { dispatchCustomEvent } from '../lib/events';
import { getApplicationTypeIcon } from '../lib/theme';

/**
 * Connected Applications component
 *
 * @fires gv-list:click - Click event from an element of the list
 *
 * @attr {Promise<Array<{Object}>>} items - a list of item.
 * @attr {String} title - title of the list.
 * @attr {Boolean} clickable - true if gv-list element can be clickable.
 *
 * @cssprop {Color} [--gv-list--bgc=var(--gv-theme-neutral-color-lightest, #FFFFFF)] - Background color
 * @cssprop {Length} [--gv-list-icon--s=20px] - Height and icon width
 * @cssprop {Length} [--gv-list-image--h=40px] - Image height
 * @cssprop {Length} [--gv-list-image--w=40px] - Image width
 */
export class GvList extends LitElement {

  static get properties () {
    return {
      items: { type: Object },
      title: { type: String },
      clickable: { type: Boolean },
      _items: { type: Object, attribute: false },
      _skeleton: { type: Boolean, attribute: false },
      _error: { type: Boolean, attribute: false },
      _empty: { type: Boolean, attribute: false },
    };
  }

  static get styles () {
    return [
      link,
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          display: inline-block;
          width: 280px;
          border-radius: 4px;
          background-color: var(--gv-list--bgc, var(--gv-theme-neutral-color-lightest, #FFFFFF));
          --gv-icon--s: var(--gv-list-icon--s, 20px);
        }

        gv-identity-picture {
          width: var(--gv-list-image--w, 40px);
          height: var(--gv-list-image--h, 40px);
        }

        .list {
          list-style: none;
          margin: 24px 0;
          padding: 0 24px;
        }

        .list h4 {
          margin: 0 0 8px 0;
        }

        .list h4 span {
          color: var(--gv-theme-neutral-color-dark, #BFBFBF);
          font-weight: 600;
          font-size: var(--gv-theme-font-size-s, 12px);
          line-height: 20px;
          margin-left: 8px;
        }

        .item {
          display: flex;
          margin: 24px 0;
        }

        .item__image {
          align-self: center;
          margin-right: 4px;
        }

        .item__content {
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
        }

        .item__title {
          margin: 0;
        }

        .item__description {
          font-size: var(--gv-theme-font-size-m, 14px);
          line-height: 22px;
          opacity: 0.5;

          display: -webkit-box;
          max-width: 200px;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .scrollable-container {
          max-height: 400px;
          overflow: auto;
        }
      `,
      skeleton,
    ];
  }

  constructor () {
    super();
    this._skeleton = false;
    this._error = false;
    this._empty = true;
  }

  set items (items) {
    this._skeleton = true;
    Promise.resolve(items)
      .then((items) => {
        if (items) {
          this._items = items;
          this._skeleton = false;
          this._empty = Object.keys(items).length === 0;
        }
        else {
          this._skeleton = true;
          this._error = false;
          this._empty = false;
        }
      }).catch(() => {
        this._error = true;
        this._skeleton = false;
      });
  }

  _getPicture (item) {
    if (item) {
      if (item.picture) {
        return item.picture;
      }
      else if (item._links && item._links.picture) {
        return item._links.picture;
      }
    }
    return null;
  }

  _getVersion (item) {
    if (item) {
      if (item.version) {
        return item.version;
      }
      else if (item.applicationType) {
        const icon = getApplicationTypeIcon(item.applicationType);
        return html`<gv-icon shape="${icon}"></gv-icon>`;
      }
    }
    return null;
  }

  _getPictureDisplayName (item) {
    if (item) {
      if (item.version) {
        return `${this._getTitle(item)}  ${item.version}`;
      }
      else if (item.applicationType) {
        return `${this._getTitle(item)}  ${item.applicationType}`;
      }
    }
    return this._getTitle();
  }

  _getTitle (item) {
    if (item) {
      return item.name;
    }
    return '';
  }

  _onClick (item) {
    dispatchCustomEvent(this, 'click', item);
  }

  _renderImage (item) {
    return html`<gv-identity-picture .picture="${this._getPicture(item)}" .display_name="${this._getPictureDisplayName(item)}"></gv-identity-picture>`;
  }

  _renderStatus (subscriptions) {
    if (subscriptions) {
      const paused = subscriptions.filter((sub) => sub.status.toUpperCase() === 'PAUSED');
      if (paused.length > 0) {
        return html`
        <gv-icon title="${i18n('gv-list.paused')}" shape="media:pause"></gv-icon>`;
      }
      const pending = subscriptions.filter((sub) => sub.status.toUpperCase() === 'PENDING');
      if (pending.length > 0) {
        return html`
        <gv-icon title="${i18n('gv-list.pending')}" shape="home:timer"></gv-icon>`;
      }
    }
    return '';
  }

  _renderItem (item) {
    if (item) {
      return html`
      <div class="item__image">${this._renderImage(item.item)}</div>
      <div class="item__content">
        <h4 class="item__title">${this._renderStatus(item.subscriptions)}${item.item.name} <span>${this._getVersion(item.item)}</span></h4>
        <div class="item__description">${item.item.description}</div>
      </div>
      `;
    }
    return html`<p>xxxx-xxxx-xxxx-xxxx</p>`;
  }

  _renderItems () {
    if (this._empty && !this._skeleton) {
      return '';
    }
    if (this._skeleton) {
      return html`
      <ul class="list">
        <h4 class="skeleton">xxxx-xxxx-xxxx-xxxx</h4>
        <div class="scrollable-container">
            <li class="item skeleton">${this._renderItem()}</li>
            <li class="item skeleton">${this._renderItem()}</li>
        </div>
      </ul>
    `;
    }
    return html`
      <ul class="list">
        <h4>
          ${this.title ? this.title : ''}
          ${this._items && this._items.length > 0 ? html`<span>(${this._items.length})</span>` : ''}
        </h4>
        <div class="scrollable-container">
        ${this._items
          ? repeat(this._items, (item) => item, (item) => {
              if (this.clickable) {
                return html`<li class="${classMap({ item: true, link: true })}" @click="${this._onClick.bind(this, item)}">${this._renderItem(item)}</li>`;
              }
              else {
                return html`<li class="${classMap({ item: true })}">${this._renderItem(item)}</li>`;
              }
            })
          : ''
        }
        </div>
      </ul>
    `;
  }

  render () {
    return html`
      <div>
        ${this._error ? html`<ul class="list"><h4>${i18n('gv-list.error')}</h4></ul>` : this._renderItems()}
      </div>
      `;
  }

}

window.customElements.define('gv-list', GvList);
