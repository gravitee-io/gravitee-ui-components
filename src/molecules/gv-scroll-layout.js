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
import { classMap } from 'lit-html/directives/class-map';
import { skeleton } from '../styles/skeleton';

/**
 * Scroll layout component
 *
 * ## Details
 * * has @theme facet
 *
 */
export class GvScrollLayout extends LitElement {
  static get properties() {
    return {
      skeleton: { type: Boolean },
    };
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          position: relative;
        }

        .container {
          display: flex;
          flex-direction: column;

          /* for Firefox */
          min-height: 0;
          height: 100%;
        }

        .header,
        .content {
          background-color: var(--bgc);
        }

        .header {
          display: flex;
          border-bottom: 1px solid #d9d9d9;
          box-sizing: border-box;
          min-height: 45px;
          --gv-icon--s: 26px;
          align-items: center;
          padding: 0 1rem;
          position: relative;
        }

        .header .left,
        .header .right {
          display: flex;
          flex: 1;
          z-index: 10;
          align-items: center;
        }

        .header .right {
          justify-content: flex-end;
        }

        .header .title {
          color: #28444f;
          font-size: 18px;
          display: flex;
          width: 100%;
          align-items: center;
        }

        .content {
          box-sizing: border-box;
          align-self: center;
          width: 100%;
          overflow: auto;
          max-width: 100%;
          padding: 0px 0.5rem;

          /* for Firefox */
          min-height: 0;
        }

        .content.empty {
          display: none;
        }
      `,
      skeleton,
    ];
  }

  render() {
    return html`
      <div class="container">
        <div class="header">
          <div class="left">
            <slot name="header-left"></slot>
          </div>
          <div class="header-title">
            <slot name="header-title"></slot>
          </div>
          <div class="right">
            <slot name="header-right"></slot>
          </div>
        </div>

        <div class="${classMap({ content: true, empty: this.skeleton })}"><slot name="content"></slot></div>
      </div>
    `;
  }
}

window.customElements.define('gv-scroll-layout', GvScrollLayout);
