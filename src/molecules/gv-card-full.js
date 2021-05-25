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
import { skeleton } from '../styles/skeleton';
import { classMap } from 'lit/directives/class-map';
import '../atoms/gv-image';
import '../atoms/gv-button';
import '../molecules/gv-metrics';
import '../molecules/gv-rating';
import '../atoms/gv-state';
import '../atoms/gv-tag';
import { truncate } from '../lib/utils';
import { i18n } from '../lib/i18n';
import { ItemResource } from '../mixins/item-resource';
import { dispatchCustomEvent } from '../lib/events';
import { getVersion, getTitle, getDescription, getOwner } from '../lib/item';

/**
 * Full Card component
 *
 * ## Details
 * * has @theme facet
 *
 * @fires gv-card-full:click - Custom click event
 * @fires gv-tag:click - Custom click event on card labels
 *
 * @attr {Promise<Object>} item - An item.
 * @attr {Promise<Metrics>} metrics - A Metrics.
 *
 * @cssprop {Color} [--gv-card-full--bgc=var(--gv-theme-neutral-color-lightest, #ffffff)] - Background color
 * @cssprop {Length} [--gv-card-full-image--h=65px] - Image height
 * @cssprop {Length} [--gv-card-full-image--w=110px] - Image width
 */
export class GvCardFull extends ItemResource(LitElement) {
  static get properties() {
    return {
      metrics: { type: Object },
    };
  }

  static get styles() {
    return [
      ...super.styles,
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          display: inline-block;
          margin: 0.2rem;

          vertical-align: middle;
          width: 100%;
          max-height: 281px;
          line-height: 22px;
          font-size: var(--gv-theme-font-size-m, 14px);
        }

        gv-identity-picture {
          height: var(--gv-card-full-image--h, 65px);
          width: var(--gv-card-full-image--w, 110px);
          --gv-image--of: contain;
        }

        .card {
          display: flex;
          flex-direction: column;
          height: 250px;
          border-radius: 4px;
          background-color: var(--gv-card-full--bgc, var(--gv-theme-neutral-color-lightest, #ffffff));
          color: var(--gv-theme-font-color-dark, #262626);
          padding: 16px;
          box-shadow: 0 0 0 1px var(--gv-theme-neutral-color, #f5f5f5), 0 1px 3px var(--gv-theme-neutral-color-dark, #bfbfbf);
          transition: transform 0.3s;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -14px var(--gv-theme-neutral-color-dark, #bfbfbf);
          cursor: pointer;
        }

        .card > div {
          display: flex;
        }

        .image {
          min-height: 65px;
          min-width: 0;
          position: relative;
          padding-top: 0.2rem;
        }

        .title {
          line-height: 22px;
          font-size: var(--gv-theme-font-size-l, 16px);
          text-transform: capitalize;
          font-weight: bold;
          padding-bottom: 5px;
        }

        .owner {
          --gv-icon--c: var(--gv-theme-neutral-color-dark, #bfbfbf);
          --gv-icon--s: 16px;
          color: var(--gv-theme-neutral-color-dark, #bfbfbf);
          display: flex;
          padding-bottom: 2px;
          line-height: initial;
        }

        .content {
          flex: 1;
          padding: 0 10px 10px 10px;
        }

        .version {
          color: var(--gv-theme-neutral-color-dark, #d9d9d9);
          padding: 10px 8px;
          font-size: var(--gv-theme-font-size-s, 12px);
        }

        .description {
          padding: 0 16px;
          margin: 6px 0;
          flex: 1;
          flex-grow: 1;
          max-height: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .infos {
          display: flex;
          border-bottom: 1px solid var(--gv-theme-neutral-color-dark, #d9d9d9);
          padding: 0.5rem 0;
          justify-content: flex-end;
        }

        gv-metrics {
          display: flex;
          height: 100%;
          justify-content: flex-end;
          align-items: stretch;
        }

        .skeleton .infos {
          border-bottom: none;
        }

        .labels {
          padding: 0 16px;
        }

        .error .labels,
        .error .infos,
        .error .states {
          visibility: hidden;
        }
      `,
      skeleton,
    ];
  }

  constructor() {
    super();
    this.limit = 150;
  }

  _onClick(e) {
    if (!this._empty && !this._error && !this._skeleton && !e.target.tagName.toLowerCase().startsWith('gv-metrics')) {
      dispatchCustomEvent(this, 'click', this._item);
    }
  }

  render() {
    const title = getTitle(this._item);
    const owner = getOwner(this._item);
    const classes = { error: this._error || this._empty, card: true };
    return html`<div class="${classMap(classes)}" title="${title}" @click="${this._onClick}">
      <div class="${classMap({ skeleton: this._skeleton })}">
        <div class="${classMap({ image: true })}">${this._renderImage()}</div>
        <div class="content">
          <div class="${classMap({ title: true })}">${title}</div>
          ${owner != null && owner.trim().length > 0
            ? html`<div class="owner"><gv-icon shape="general:user" size="8px"></gv-icon>${owner}</div>`
            : ''}
          <div class="states">${this._renderStates()}</div>
        </div>
        <div class="version"><span class="${classMap({ skeleton: this._skeleton })}">${getVersion(this._item)}</span></div>
      </div>
      <div class="${classMap({ skeleton: this._skeleton, description: true })}">
        ${truncate(
          this._error ? i18n('gv-card-full.error') : this._empty ? i18n('gv-card-full.empty') : getDescription(this._item),
          this.limit,
        )}
      </div>
      <span class="${classMap({ skeleton: this._skeleton })}">
        <div class="infos">${this._renderMetricsWithRating()}</div>

        <div class="labels">${this._renderLabels(true)}</div>
      </span>
    </div>`;
  }
}

window.customElements.define('gv-card-full', GvCardFull);
