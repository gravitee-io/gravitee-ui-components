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
import { classMap } from 'lit-html/directives/class-map.js';
import { LitElement, html, css } from 'lit-element';
import { skeleton } from '../styles';
import '../atoms/gv-icon';

/**
 * A button
 *
 * ## Details
 *
 * * attributes `primary` define the mode of the button and are exclusive.
 * * You can only set one mode at a time.
 * * When you don't use any of these values, the mode defaults to `default`.
 *
 * @fires click - Native click event from inner button element
 *
 * @slot - The content of the button (text or HTML)
 *
 * @attr {Boolean} primary - set button UI mode to primary
 * @attr {Boolean} disabled - same as native button element `disabled` attribute
 * @attr {Boolean} outlined - set button UI as outlined (white background instead of filled color)
 * @attr {Boolean} skeleton - enable skeleton screen UI pattern (loading hint)
 *
 * @cssprop {String} --gv-button([-primary])--bgc - set the background color of button.
 * @cssprop {String} --gv-button--p - set the padding.
 * @cssprop {String} --gv-button--fz - set the font-size
 * @cssprop {String} --gv-icon--c - set the color of icon
 */
export class GvButton extends LitElement {

  static get properties () {
    return {
      disabled: { type: Boolean },
      primary: { type: Boolean },
      outlined: { type: Boolean },
      skeleton: { type: Boolean },
      icon: { type: String },
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
              margin: 0.2rem;
              vertical-align: middle;
              --gv-icon--h: 24px;
              --gv-icon--w: 24px;
          }

          /* RESET */
          button {
              background: #fff;
              border: 1px solid #000;
              display: block;
              font-size: var(--gv-button--fz, 14px);
              font-family: inherit;
              margin: 0;
              padding: 0;
          }

          /* BASE */
          button {
              border-radius: 0.15rem;
              cursor: pointer;
              min-height: 2rem;
              padding: var(--gv-button--p, 0rem 0.5rem);
              text-transform: uppercase;
              -moz-user-select: none;
              -webkit-user-select: none;
              -ms-user-select: none;
              user-select: none;
              width: 100%;
          }

          /* COLORS */
          button.default {
              --c: var(--gv-button--bgc, #333);
          }

          button.primary {
              --c: var(--gv-button-primary--bgc, #555);
          }

          /* MODES */
          button {
              background-color: var(--c);
              border-color: var(--c);
              color: #fff;
          }

          button.outlined {
              background-color: #fff;
              color: var(--c);
          }

          /* special case: we want to keep simple buttons subtle */
          button.simple {
              border-color: #aaa;
          }

          /* STATES */
          button:enabled:focus {
              box-shadow: 0 0 0 .2em rgba(50, 115, 220, .25);
              outline: 0;
          }

          button:enabled:hover {
              box-shadow: 0 1px 3px #888;
          }

          button:enabled:active {
              box-shadow: none;
              outline: 0;
          }

          button:disabled {
              cursor: default;
              opacity: .5;
          }

          button.skeleton {
              background-color: #aaa;
              border-color: #777;
              color: transparent;
          }

          button.skeleton > gv-icon {
              opacity: 0;
          }

          /* TRANSITIONS */
          button {
              box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
              transition: all 75ms ease-in-out;
          }

          /* We can do this because we set a visible focus state */
          button::-moz-focus-inner {
              border: 0;
          }

          button.icon > * {
              vertical-align: middle;
          }

          button.icon {
              display: flex;
              align-items: center;
          }

          button slot {
              flex: 1;
              white-space: nowrap;
              display: inline;
          }

          button.icon .fake-icon {
              max-width: var(--gv-icon--w);
              width: 100%;
          }

      `,
    ];
  }

  _onClick () {
    const form = this.closest('form');
    if (form) {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
  }

  render () {
    const modes = {
      primary: this.primary,
      skeleton: this.skeleton,
      default: !this.primary,
      outlined: this.outlined,
      icon: !!this.icon,
    };

    return html`<button
        type="button"
      class=${classMap(modes)}
      .disabled=${this.disabled || this.skeleton}
      @click="${this._onClick}">
      ${this.icon ? html`<gv-icon shape="${this.icon}"></gv-icon>` : ''}
      <slot></slot>
      ${this.icon ? html`<div class="fake-icon"></div>` : ''}
    </button>`;
  }

}

window.customElements.define('gv-button', GvButton);
