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
import { skeleton } from '../styles/skeleton';

/**
 * A State
 *
 * ## Details
 * * has @theme facet
 *
 * @fires click - Native click event
 *
 * @slot - The content of the state (text or HTML)
 *
 * @attr {Boolean} error - enable error mode
 * @attr {Boolean} major - enable major mode
 * @attr {Boolean} success - enable success mode
 * @attr {Boolean} warn - enable warn mode
 * @attr {Boolean} skeleton -  enable skeleton screen UI pattern (loading hint)
 *
 * @cssprop {Length} [--gv-state--bdr=17px] - Border radius
 * @cssprop {Length} [--gv-state--fz=var(--gv-theme-font-size-s, 12px)] - Font size
 * @cssprop {Length} [--gv-state--p=4px 8px] - Padding
 * @cssprop {Color} [--gv-state--bgc=#f0f5ff] - Background color
 * @cssprop {Color} [--gv-state--c=#597ef7] - Color
 * @cssprop {Color} [--gv-state-major--bgc=var(--gv-theme-color-light, #d5fdcb)] - Major background color
 * @cssprop {Color} [--gv-state-major--c=var(--gv-theme-color, #009b5b)] - Major color
 */
export class GvState extends LitElement {
  static get properties() {
    return {
      default: { type: Boolean },
      error: { type: Boolean },
      major: { type: Boolean },
      skeleton: { type: Boolean },
      success: { type: Boolean },
      warn: { type: Boolean },
    };
  }

  static get styles() {
    return [
      skeleton,
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          display: inline-block;
          margin: 0.2rem;
          vertical-align: middle;
        }

        div.default {
          --bgc: var(--gv-state--bgc, #f0f5ff);
          --c: var(--gv-state--c, #597ef7);
        }

        div.error {
          --bgc: var(--gv-theme-color-error-light, #e57373);
          --c: var(--gv-theme-neutral-color-lightest, #ffffff);
        }

        div.major {
          --bgc: var(--gv-state-major--bgc, var(--gv-theme-color-light, #d5fdcb));
          --c: var(--gv-state-major--c, var(--gv-theme-color, #009b5b));
        }

        div.success {
          --bgc: var(--gv-theme-color-success-light, #81c784);
          --c: var(--gv-theme-neutral-color-lightest, #ffffff);
        }

        div.warn {
          --bgc: var(--gv-theme-color-warning-light, #ffb74d);
          --c: var(--gv-theme-neutral-color-lightest, #ffffff);
        }

        div {
          background-color: var(--bgc);
          border-radius: var(--gv-state--bdr, 17px);
          color: var(--c);

          --fz: var(--gv-state--fz, var(--gv-theme-font-size-s, 12px));
          font-size: var(--fz);

          font-weight: bold;
          text-transform: uppercase;
          line-height: var(--fz);
          padding: var(--gv-state--p, 4px 8px);
        }
      `,
    ];
  }

  render() {
    const modes = {
      default: !this.major && !this.error && !this.success && !this.warn,
      error: this.error,
      major: this.major,
      skeleton: this.skeleton,
      success: this.success,
      warn: this.warn,
    };

    return html`
      <div class=${classMap(modes)}>
        <slot></slot>
      </div>
    `;
  }
}

window.customElements.define('gv-state', GvState);
