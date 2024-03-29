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
import { css, html, LitElement } from 'lit';
import { skeleton } from '../../styles/skeleton';
import { link } from '../../styles/link';
import { classMap } from 'lit/directives/class-map.js';
import { i18n } from '../../lib/i18n';
import { ItemResource } from '../../mixins/item-resource';
import { withResizeObserver } from '../../mixins/with-resize-observer';
import { getOwner, getTitle, getDescription, getVersion } from '../../lib/item';

/**
 * Row component
 *
 * ## Details
 * * has @theme facet
 *
 * @attr {Promise<any>} item - An item.
 * @attr {Boolean} small - When true, not display labels
 *
 * @cssprop {Color} [--gv-row-hover--bgc=var(--gv-theme-neutral-color-lighter, #fafafa)] - Hoover background color
 * @cssprop {Length} [--gv-row-hover--trf-ty=0px] - Hoover transform translateY
 * @cssprop {Length} [--gv-row-image--h=35px] - Image height
 * @cssprop {Length} [--gv-row-image--w=35px] - Image width
 *
 */
export class GvRow extends withResizeObserver(ItemResource(LitElement)) {
  static get styles() {
    return [
      ...super.styles,
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          cursor: pointer;
          --hover-bgc: var(--gv-row-hover--bgc, var(--gv-theme-neutral-color-lighter, #fafafa));
          --trf-ty: var(--gv-row-hover--trf-ty, 0px);
          display: block;
        }

        :host([_invisible]) {
          display: none;
        }

        .row {
          padding: 12px;
        }

        .row:hover {
          -webkit-transform: -webkit-translateY(var(--trf-ty));
          transform: translateY(var(--trf-ty));
          background-color: var(--hover-bgc);
        }

        .row:not(.error) {
          display: grid;
          grid-template-columns: calc(var(--gv-row-image--w, 35px) + 5px) auto fit-content(20%);
          grid-gap: 10px;
          align-items: center;
        }

        :host([w-lt-450]) .meta {
          display: none;
        }

        .row .name {
          margin-right: 15px;
        }

        .row .name,
        .row .meta__owner {
          margin-bottom: 5px;
        }

        .row .version {
          color: var(--gv-theme-neutral-color-dark, #d9d9d9);
        }

        .row .description {
          --lh: 1.4rem;
          --max-lines: 2;
          max-height: calc(var(--lh) * var(--max-lines));
          line-height: var(--lh);
          overflow: hidden;
          text-overflow: ellipsis;
          text-after-overflow: '...';
        }

        .row .description * {
          display: contents;
          font-size: var(--gv-theme-font-size-m, 14px);
        }

        .row .meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .row .meta__owner {
          --gv-icon--c: var(--gv-theme-neutral-color-dark, #d9d9d9);
          --gv-icon--s: 16px;
          color: var(--gv-theme-neutral-color-dark, #d9d9d9);
          display: flex;
        }

        .row .meta__tags {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
        }

        .skeleton {
          transition: 0.5s;
          min-height: 30px;
          align-self: start;
        }

        .error {
          cursor: default;
          text-align: center;
        }

        gv-identity-picture {
          height: var(--gv-row-image--h, 35px);
          width: var(--gv-row-image--w, 35px);
          border-radius: 20px;
          --gv-image--of: contain;
          align-self: baseline;
        }

        h3 {
          margin: 0;
        }

        .row > .group {
          display: flex;
          flex-direction: column;
          margin: 0 5px;
          width: 100%;
          flex: 1;
        }

        .title {
          display: flex;
          flex-direction: row;
        }
      `,
      link,
      skeleton,
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      /** @required */
      small: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.breakpoints = {
      width: [450],
    };
    this.small = false;
  }

  render() {
    const classes = {
      row: true,
      link: true,
      error: !this._skeleton && (this._error || this._empty),
    };
    const owner = getOwner(this._item);
    return html`
      <div class=${classMap(classes)}>
        ${!this._skeleton && (this._error || this._empty)
          ? html`<div class="message">${this._error ? i18n('gv-row.error') : i18n('gv-row.empty')}</div>`
          : html`
              <div class="${classMap({ skeleton: this._skeleton })}">${this._renderImage()}</div>
              <div class="${classMap({ group: true, skeleton: this._skeleton })}">
                <div class="title">
                  <h3 class="name">${getTitle(this._item)}</h3>
                  <div class="version">${getVersion(this._item)}</div>
                </div>
                <div class="description" .innerHTML="${getDescription(this._item)}"></div>
              </div>
              <div class="${classMap({ meta: true, skeleton: this._skeleton })}">
                <div class="meta__owner">
                  ${owner != null && owner.trim().length > 0 ? html`<gv-icon shape="general:user" size="8px"></gv-icon>${owner}` : ''}
                </div>
                ${this.small !== true ? html`<div class="meta__tags">${this._renderLabels()}</div>` : ''}
              </div>
            `}
      </div>
    `;
  }
}

window.customElements.define('gv-row', GvRow);
