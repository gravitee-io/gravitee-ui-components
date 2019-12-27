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
import { until } from 'lit-html/directives/until';
import { i18n } from '../lib/i18n';

/**
 * Connected Applications component
 *
 * @attr {Promise<Array<{picture: string, name: string, description: string}>>} items - a list of item.
 * @attr {String} title - title of the list.
 *
 * @cssprop {String} [--gv-list--bgc=white] - set the background color.
 *
 */
export class GvList extends LitElement {

  static get properties () {
    return {
      items: { type: Object },
      _items: { type: Object, attribute: false },
      _skeleton: { type: Boolean, attribute: false },
      _error: { type: Boolean, attribute: false },
      _empty: { type: Boolean, attribute: false },
    };
  }

  static get styles () {
    return [
      skeleton,
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          display: inline-block;
          width: 280px;
          border-radius: 4px;
          background-color: var(--gv-list--bgc, white);
          --gv-image--w: 40px;
          --gv-image--h: 40px;
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
          color: #BFBFBF;
          font-weight: 600;
          font-size: 12px;
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
          font-size: 14px;
          line-height: 22px;
          opacity: 0.5;
        }

        .item__description gv-tag {
          opacity: 1;
        }

        .skeleton {
          background-color: #aaa;
          border-color: #777;
          color: transparent;
          transition: 0.5s;
        }

        gv-tag {
          text-transform: uppercase;
        }
      `,
    ];
  }

  constructor () {
    super();
    this._skeleton = true;
    this._error = false;
    this._empty = false;
  }

  set items (items) {
    Promise.resolve(items)
      .then((items) => {
        if (items) {
          this._skeleton = false;
          this._empty = Object.keys(items).length === 0;
          this._items = items;
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

  getDefaultPicture () {
    return import('../../assets/images/promote-api.png').then((picture) => picture.default);
  }

  _renderImage (picture, name) {
    if (picture) {
      return html`<gv-image src="${picture}" alt="${name}">`;
    }
    else {
      return html`<gv-image src="${until(this.getDefaultPicture())}" alt="${name}">`;
    }
  }

  _renderAccepted (subscriptions) {
    const accepted = subscriptions.filter((sub) => sub.status.toUpperCase() === 'ACCEPTED');

    if (accepted.length > 0) {
      const title = accepted.length === 1 ? i18n('gv-list.acceptedSubscription') : i18n('gv-list.acceptedSubscriptions');
      return html`
        <gv-tag title="${accepted.length} ${title}" icon="general:thunder-move">
         ${i18n('gv-list.accepted')}
        </gv-tag>`;
    }
    return '';
  }

  _renderPaused (subscriptions) {
    const paused = subscriptions.filter((sub) => sub.status.toUpperCase() === 'PAUSED');

    if (paused.length > 0) {
      const title = paused.length === 1 ? i18n('gv-list.pausedSubscription') : i18n('gv-list.pausedSubscriptions');
      return html`
        <gv-tag title="${paused.length} ${title}" icon="media:pause">
         ${i18n('gv-list.paused')}
        </gv-tag>`;
    }
    return '';
  }

  _renderPending (subscriptions) {
    const pending = subscriptions.filter((sub) => sub.status.toUpperCase() === 'PENDING');
    if (pending.length > 0) {
      const title = pending.length === 1 ? i18n('gv-list.pendingSubscription') : i18n('gv-list.pendingSubscriptions');
      return html`
        <gv-tag title="${pending.length} ${title}" minor icon="home:timer">
          ${i18n('gv-list.pending')}
        </gv-tag>`;
    }
    return '';
  }

  _renderItem ({ picture, name, description, subscriptions }) {
    return html`
      <div class="item__image">${this._renderImage(picture, name)}</div>
      <div class="item__content">
        <h4 class="item__title">${name}</h4>
        <div class="item__description">${description}</div>
        ${(subscriptions && subscriptions.length > 0) ? html`
            <span class="subscriptions">
                ${this._renderAccepted(subscriptions)}
                ${this._renderPending(subscriptions)}
                ${this._renderPaused(subscriptions)}
            </span>
        ` : ``}
      </div>
      `;
  }

  _renderItems () {
    return html`
      <ul class="list">
        <h4 class="${classMap({ skeleton: this._skeleton })}">
          ${this.title
      ? this.title
      : this._skeleton
        ? 'skeleton'
        : ''
    }
          ${this._items && this._items.length > 0 ? html`<span>(${this._items.length})</span>` : ''}
        </h4>
        ${this._items ? repeat(this._items, (item) => item, (item) => html`<li class="item">${this._renderItem(item)}</li>`) : ''}
      </ul>
    `;
  }

  render () {
    return html`
      <div>
        ${this._error
      ? html`<ul class="list"><h4>${i18n('gv-list.error')}</h4></ul>`
      : this._empty
        ? ''
        : this._renderItems()
    }
      </div>
      `;
  }

}

window.customElements.define('gv-list', GvList);
