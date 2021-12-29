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
import { link } from '../../styles/link';
import { classMap } from 'lit/directives/class-map';
import { dispatchCustomEvent } from '../../lib/events';

/**
 * Expandable component
 *
 * @fires gv-expandable:toggle - When user toggle
 *
 * @attr {Boolean} open - When true, opens details by default
 * @attr {String} icon - An icon to show open feature
 * @attr {String} icon-opened -  An icon to show close feature
 * @attr {Boolean} clickable - When true, details is clickable like summary
 *
 * @cssprop {String} [--gv-expandable--bdb=var(--gv-expandable--bdb, thin solid var(--gv-theme-color, #5a7684)] - Border bottom
 */
export class GvExpandable extends LitElement {
  constructor() {
    super();
    this.open = false;
    this.icon = 'navigation:angle-left';
    this.iconOpened = 'navigation:angle-down';
    this.clickable = false;
  }

  static get properties() {
    return {
      open: { type: Boolean, reflect: true },
      icon: { type: String },
      iconOpened: { type: String, attribute: 'icon-opened' },
      clickable: { type: Boolean },
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
          border-bottom: var(--gv-expandable--bdb, thin solid var(--gv-theme-color, #5a7684));
        }

        :host([open]) .details {
          visibility: visible;
          opacity: 1;
          height: auto;
          overflow: visible;
        }

        .details {
          display: block;
          overflow: hidden;
          opacity: 0;
          visibility: hidden;
          transition: all 150ms ease-in-out;
          height: 0;
        }

        .summary {
          display: flex;
          flex-direction: row;
          align-content: center;
          justify-content: space-between;
        }

        .expand {
          align-self: center;
          margin-left: 5px;
          --gv-icon--s: 16px;
        }
      `,
    ];
  }

  _onClick(event) {
    if (!this.clickable) {
      const summary = this.shadowRoot.querySelector('.summary');
      if (!summary.contains(event.target) && event.target.slot !== 'summary') {
        return;
      }
    }
    this.open = !this.open;
    dispatchCustomEvent(this, 'toggle', { open: this.open });
  }

  render() {
    const icon = this.open ? this.iconOpened : this.icon;
    return html`<div class="${classMap({ box: true, link: this.clickable })}" @click=${this._onClick}>
      <div class="${classMap({ summary: true, link: !this.clickable })}">
        <slot name="summary"></slot>

        <gv-icon shape="${icon}" class="expand"></gv-icon>
      </div>
      <slot name="details" class="details"></slot>
    </div>`;
  }
}

window.customElements.define('gv-expandable', GvExpandable);
