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
import { css } from 'lit-element';
import '../atoms/gv-button';
import '../atoms/gv-icon';
import { i18n } from '../lib/i18n';
import { html } from 'lit-html';
import { GvPopover } from './gv-popover';
import { dispatchCustomEvent } from '../lib/events';

/**
 * Confirm component
 * @extends GvPopover
 *
 * @attr {String} event - the event that triggers the opening
 * @attr {String} okLabel - the label of ok btn
 * @attr {String} cancelLabel - the label of cancel btn
 * @attr {String} icon - the icon before message
 * @attr {String} message - the message
 *
 * @cssprop {Color} [--gv-confirm--bgc=var(--gv-theme-neutral-color-lighter, #FAFAFA)] - Background color
 * @cssprop {Length} [--gv-confirm--maw=250px] - Max width
 */
export class GvConfirm extends GvPopover {

  static get properties () {
    return {
      /**
       * @default i18n: gv-confirm.cancel
       */
      cancelLabel: { type: String },
      /**
       * @default i18n: gv-confirm.ok
       */
      okLabel: { type: String },
      message: { type: String },
      icon: { type: String },
      danger: { type: Boolean, reflect: true },
    };
  };

  static get styles () {
    return [
      GvPopover.styles,
      // language=CSS
      css`
          :host {
              --gv-icon--s: 24px;
          }

          :host([danger]) .message gv-icon {
              --gv-icon--c: var(--gv-theme-color-danger, #FF5722);
          }

          .popover {
              --bgc: var(--gv-confirm--bgc, var(--gv-theme-neutral-color-lighter, #FAFAFA));
              --maw: var(--gv-confirm--maw, 250px);
          }

          .message {
              display: flex;
              align-items: center;
              margin: 1rem 0.5rem;
          }

          .message gv-icon {
              margin-right: 0.5rem;
          }

          .text {
              text-align: center;
              line-height: 24px;
              width: 100%;
          }

          .actions {
              text-align: right;
          }
      `,
    ];
  }

  constructor () {
    super();
    this.event = 'click';
    this.icon = 'code:info';
    this.cancelLabel = i18n('gv-confirm.cancel');
    this.okLabel = i18n('gv-confirm.ok');
  }

  _onCancel () {
    this._opened = false;
    dispatchCustomEvent(this, 'cancel');
  }

  _onOk () {
    this._opened = false;
    dispatchCustomEvent(this, 'ok');
  }

  renderContent () {
    return html`
          <div class="message">${this.icon ? html`<gv-icon shape="${this.icon}"></gv-icon>` : ''}<div class="text" .innerHTML="${this.message}"></div></div>
          <div class="actions">
            <gv-button primary outlined @click="${this._onCancel}">${this.cancelLabel}</gv-button>
            <gv-button primary @click="${this._onOk}">${this.okLabel}</gv-button>
          </div>
       `;
  }

  firstUpdated (changedProperties) {
    super.firstUpdated(changedProperties);
    if (this.danger) {
      this.shadowRoot.querySelectorAll('gv-button').forEach((btn) => (btn.setAttribute('danger', '')));
    }
  }

}

window.customElements.define('gv-confirm', GvConfirm);
