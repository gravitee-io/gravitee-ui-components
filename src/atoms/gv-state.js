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
 * @fires click - Native click event
 *
 * @slot - The content of the state (text or HTML)
 *
 * @attr {Boolean} major - enable major mode
 * @attr {Boolean} skeleton -  enable skeleton screen UI pattern (loading hint)
 *
 * @cssprop {Length} [--gv-state--bdr=17px] - Border radius
 * @cssprop {Color} [--gv-state--bgc=#F0F5FF] - Background color
 * @cssprop {Color} [--gv-state--c=#597EF7] - Color
 * @cssprop {Color} [--gv-state-major--bgc=var(--gv-theme-color-light, #D5FDCB)] - Major background color
 * @cssprop {Color} [--gv-state-major--c=var(--gv-theme-color, #009B5B)] - Major color
 */
export class GvState extends LitElement {

  static get properties () {
    return {
      default: { type: Boolean },
      major: { type: Boolean },
      skeleton: { type: Boolean },
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
          }

          div.default {
              --bgc: var(--gv-state--bgc, #F0F5FF);
              --c: var(--gv-state--c, #597EF7)
          }

          div.major {
              --bgc: var(--gv-state-major--bgc, var(--gv-theme-color-light, #D5FDCB));
              --c: var(--gv-state-major--c, var(--gv-theme-color, #009B5B));
          }

          div {
              background-color: var(--bgc);
              border-radius: var(--gv-state--bdr, 17px);
              color: var(--c);

              font-size: var(--gv-theme-font-size-xs, 10px);
              font-weight: bold;
              text-transform: uppercase;
              line-height: 20px;
              padding: 0 8px;
          }
      `,
    ];
  }

  render () {

    const modes = {
      default: !this.major,
      major: this.major,
      skeleton: this.skeleton,
    };

    return html`
      <div class=${classMap(modes)}>
        <slot></slot>
      </div>
    `;
  }

}

window.customElements.define('gv-state', GvState);
