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
import { classMap } from 'lit-html/directives/class-map';
import { LitElement, html, css } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events';
import '../atoms/gv-icon';

/**
 * Message component
 *
 * ## Details
 * * has @theme facet
 *
 * @fires gv-message:close - Click event from inner button element
 *
 * @slot - The content of the button (text or HTML)
 *
 * @attr {String} type - type of the message. Can be default, success, error, warning or info.
 * @attr {boolean} closable - determines if the message can be hidden.
 *
 * @cssprop {Color} [--gv-message-success--bgc=var(--gv-theme-color-light, #86c3d0)] - Success background color
 * @cssprop {Color} [--gv-message-success--c=var(--gv-theme-color-darker, #383E3F)] - Success color
 * @cssprop {Color} [--gv-message-info--c=#00529B] - Info color
 * @cssprop {Color} [--gv-message-info--bgc=#BDE5F8] - Info background color
 * @cssprop {Color} [--gv-message-warn--c=#9F6000] - Warning color
 * @cssprop {Color} [--gv-message-warn--bgc=#FEEFB3] - Warning background color
 * @cssprop {Color} [--gv-message-error--c=#820014] - Error color
 * @cssprop {Color} [--gv-message-error--bgc=#FFCCC7] - Error background color
*/
export class GvMessage extends LitElement {

  static get properties () {
    return {
      type: { type: String },
      closable: { type: Boolean },
      _close: { type: Boolean, attribute: false },
    };
  }

  static get styles () {
    return [
      // language=CSS
      css`
          :host {
            display: block;
            vertical-align: middle;
          }

          .box {
            display: flex;
            align-items: center;
            font-style: normal;
            font-weight: normal;
            line-height: normal;
            padding: 12px 0px;
            text-align: center;
            width: 100%;
          }

          .info {
            background-color: var(--gv-message-info--bgc, #BDE5F8);
            color: var(--gv-message-info--c, #00529B);
            --gv-icon--c: var(--gv-message-info--c, #00529B);
          }

          .success {
            background-color: var(--gv-message-success--bgc, var(--gv-theme-color-light, #86c3d0));
            color: var(--gv-message-success--c, var(--gv-theme-color-darker, #383E3F));
            --gv-icon--c: var(--gv-message-success--c, var(--gv-theme-color-darker, #383E3F));
          }

          .warning {
            background-color: var(--gv-message-warn--bgc, #FEEFB3);
            color: var(--gv-message-warn--c, #9F6000);
            --gv-icon--c: var(--gv-message-warn--c, #9F6000);
          }

          .error {
            background-color: var(--gv-message-error--bgc, #FFCCC7);
            color: var(--gv-message-error--c, #820014);
            --gv-icon--c: var(--gv-message-error--c, #820014);
          }

          .close {
            transition: opacity 250ms ease-in-out;
            opacity: 0;
          }

          gv-icon {
            --gv-icon--s: 24px;
            margin-right: 12px;
          }

          gv-icon:hover {
            cursor: pointer;
          }
          .content {
            flex: 1 1 auto;
            margin-left: 12px
          }

      `,
    ];
  }

  _onClick () {
    this._close = true;
    setTimeout(() => {
      dispatchCustomEvent(this, 'close');
    }, 250);

  }

  render () {
    const modes = {
      box: true,
      simple: (!this.type || (this.type !== 'info' && this.type !== 'success' && this.type !== 'error' && this.type !== 'warning')),
      info: (this.type === 'info'),
      warning: (this.type === 'warning'),
      success: (this.type === 'success'),
      error: (this.type === 'error'),
      close: this._close,
    };
    return html`
      <div class=${classMap(modes)}>
        <div class="content">
          <slot></slot>
        </div>
        ${this.closable ? html`<gv-icon shape="general:close" @click="${this._onClick}"></gv-icon>` : ''}
      </div>
    `;
  }
}

window.customElements.define('gv-message', GvMessage);
