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
import { css, LitElement, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { withResizeObserver } from '../../mixins/with-resize-observer';
import { i18n } from '../../lib/i18n';
import '../gv-card-full';

/**
 * List of cards
 *
 * ## Details
 * * has @theme facet
 */
export class GvCardList extends withResizeObserver(LitElement) {
  static get properties() {
    return {
      items: { type: Array },
    };
  }

  constructor() {
    super();
    this.breakpoints = {
      width: [845, 1270],
    };
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-gap: 0.5rem;
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

  renderItem(item, index) {
    const _item = item && item.item ? item.item : null;
    const _metrics = item && item.metrics ? item.metrics : null;
    return html`<gv-card-full class="item" .item="${_item}" .metrics="${_metrics}"> </gv-card-full>`;
  }

  render() {
    if (this._error) {
      return html`<div>${i18n('gv-card-list.error')}</div>`;
    }

    if (this.items) {
      return html`${repeat(
        this.items,
        (item) => item,
        (item, index) => this.renderItem(item, index),
      )}`;
    }
    return '';
  }

  updated(changedProperties) {
    if (changedProperties.has('items')) {
      if (this.items && this.items.length > 0) {
        const items = this.shadowRoot.querySelectorAll('.item');
        items.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('show');
          }, index * 100);
        });
      }
    }
  }
}

window.customElements.define('gv-card-list', GvCardList);
