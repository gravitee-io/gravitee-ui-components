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
import { repeat } from 'lit-html/directives/repeat';
import { withResizeObserver } from '../mixins/with-resize-observer';
import './gv-category';
import { classMap } from 'lit-html/directives/class-map';
import { i18n } from '../lib/i18n';
import './gv-card-full';

/**
 * List of cards
 */
export class GvCardList extends withResizeObserver(LitElement) {

  static get properties () {
    return {
      items: { type: Array },
      _items: { type: Array, attribute: false },
      _skeleton: { type: Boolean, attribute: false },
      _error: { type: Boolean, attribute: false },
    };
  }

  constructor () {
    super();
    this.breakpoints = {
      width: [845, 1270],
    };
    this._items = [];
    this._skeleton = false;
    this._error = false;
    this._empty = true;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          display: block;
        }

        .container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-gap: 0.5rem;
        }

        .container.error {
          display: block;
          text-align: center;
        }

        :host([w-lt-1270]) .container {
          grid-template-columns: repeat(2, 1fr);
        }

        :host([w-lt-845]) .container {
          display: flex;
          flex-direction: column;
        }

        :host([w-lt-845]) .container > .item {
          flex: 0 1 auto;
        }

        .item {
          opacity: 0;
          transition: opacity 100ms ease-in-out;
        }

        .item.show {
          opacity: 1;
        }

      `,
    ];
  }

  set items (value) {
    this._skeleton = true;
    Promise.resolve(value)
      .then((value) => {
        if (value) {
          this._skeleton = false;
          this._items = value;
        }
        else {
          this._skeleton = true;
        }
      })
      .catch(() => {
        this._skeleton = false;
        this._error = true;
      });
  }

  renderItem (item, index) {
    return html`<gv-card-full class="item" .item="${item && item.item ? item.item : null}" .metrics="${item && item.item ? item.metrics : null}"> </gv-card-full>`;
  }

  render () {
    return html`<div class="${classMap({ container: true, error: this._error })}">
                 ${this._error ? html`<div>${i18n('gv-card-list.error')}</div>`
      : repeat(this._items, (item) => item, (item, index) =>
        this.renderItem(item, index),
      )}
      </div>
        `;
  }

  updated () {
    if (this._items.length > 0) {
      const items = this.shadowRoot.querySelectorAll('.item');
      items.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('show');
        }, index * 100);
      });
    }
  }

}

window.customElements.define('gv-card-list', GvCardList);
