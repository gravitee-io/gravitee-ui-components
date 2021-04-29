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
import { link } from '../styles/link';
import { classMap } from 'lit-html/directives/class-map';
import { dispatchCustomEvent } from '../lib/events';

/**
 * Expandable row
 *
 * @fires gv-expandable-row:toggle - When user toggle row
 *
 * @attr {Boolean} open - When true, opens details by default
 * @attr {String} icon - An optional icon to show open feature
 * @attr {String} icon-opened -  An optional icon to show close feature
 * @attr {Boolean} only-summary - When true, only summary is clickable for toggle row
 *
 * @cssprop {String} [--gv-row-expandable--bdb=var(--gv-row-expandable--bdb, thin solid var(--gv-theme-color, #5a7684)] - Border bottom
 */
export class GvRowExpandable extends LitElement {
  constructor() {
    super();
    this.open = false;
    this.icon = 'general:other#2';
    this.iconOpened = 'general:other#2';
    this.onlySummary = false;
  }

  static get properties() {
    return {
      open: { type: Boolean, reflect: true },
      icon: { type: String },
      iconOpened: { type: String, attribute: 'icon-opened' },
      onlySummary: { type: Boolean, attribute: 'only-summary' },
    };
  }

  static get styles() {
    return [
      link,
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
        }

        .box {
          padding: 0.2rem;
          line-height: 23px;
          border-bottom: var(--gv-row-expandable--bdb, thin solid var(--gv-theme-color, #5a7684));
        }

        .box.link:hover {
          background-color: var(--gv-theme-neutral-color, #f5f5f5);
        }

        :host([open]) .details {
          visibility: visible;
          opacity: 1;
          height: 100%;
        }

        .details {
          display: block;
          visibility: hidden;
          opacity: 0;
          -webkit-transition: -webkit-transform 150ms ease-in-out, opacity 150ms ease-in-out;
          -moz-transition: all 150ms ease-in-out;
          -ms-transition: all 150ms ease-in-out;
          -o-transition: all 150ms ease-in-out;
          height: 0px;
        }

        .summary {
          display: flex;
          flex-direction: row;
          align-content: center;
          justify-content: space-between;
        }

        .show-more {
          align-self: center;
          margin-left: 5px;
          --gv-icon--s: 16px;
        }
      `,
    ];
  }

  _onClick(event) {
    if (this.onlySummary) {
      const summary = this.shadowRoot.querySelector('.summary');
      if (!summary.contains(event.target)) {
        return;
      }
    }
    this.open = !this.open;
    dispatchCustomEvent(this, 'toggle', { open: this.open });
  }

  render() {
    const icon = this.open ? this.iconOpened : this.icon;
    return html`<div class="${classMap({ box: true, link: !this.onlySummary })}" @click=${this._onClick}>
      <div class="${classMap({ summary: true, link: this.onlySummary })}">
        <slot name="summary"></slot>

        <gv-icon shape="${icon}" class="show-more"></gv-icon>
      </div>
      <slot name="details" class="details"></slot>
    </div>`;
  }
}

window.customElements.define('gv-row-expandable', GvRowExpandable);
