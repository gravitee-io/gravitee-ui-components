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
import { link } from '../styles/link';
import './gv-icon';

/**
 * A Tag
 *
 * @fires click - Native click event
 *
 * @slot - The content of the tag (text or HTML)
 *
 * @attr {String} icon - name of shape
 * @attr {String} icon-right - name of shape
 * @attr {Boolean} major - set tag UI as major
 * @attr {Boolean} minor - set tag UI as minor
 * @attr {Boolean} skeleton -  enable skeleton screen UI pattern (loading hint)
 * @attr {Boolean} clickable - If true, tag has link style
 *
 * @cssprop {Length} [--gv-tag--bdr=4px] - Border radius
 * @cssprop {String} [--gv-tag--bsw=none] - Box shadow
 *
 * @cssprop {Color} [--gv-tag--bgc=var(--gv-theme-neutral-color-lighter, #FAFAFA)] - Background color
 * @cssprop {Color} [--gv-tag-major--bgc=var(--gv-theme-color, #5A7684)] - Major background color
 * @cssprop {Color} [--gv-tag-minor--bgc=var(--gv-theme-neutral-color-lightest, #FFFFFF)] - Minor background color
 *
 * @cssprop {Color} [--gv-tag--bdc=var(--gv-theme-neutral-color-dark, #D9D9D9)] - Border color
 * @cssprop {Color} [--gv-tag-major--bdc=var(--gv-theme-color, #5A7684)] - Major border color
 * @cssprop {Color} [--gv-tag-minor--bdc=var(--gv-theme-neutral-color-dark, #D9D9D9)] - Minor border color

 * @cssprop {String} [--gv-tag--bds=solid] - Border style
 * @cssprop {String} [--gv-tag-major--bds=solid] - Major border style
 * @cssprop {String} [--gv-tag-minor--bds=dashed] - Minor border style
 *
 * @cssprop {Length} [--gv-tag--bdw=1px] - Border width
 * @cssprop {Length} [--gv-tag-major--bdw=1px] - Major border width
 * @cssprop {Length} [--gv-tag-minor--bdw=1px] - Minor border width
 *
 * @cssprop {Color} [--gv-tag--c=var(--gv-theme-font-color-dark, #262626)] - Color
 * @cssprop {Color} [--gv-tag-major--c=var(--gv-theme-font-color-light, #FFFFFF)] - Major color
 * @cssprop {Color} [--gv-tag-minor--c=var(--gv-theme-font-color-dark, #262626)] - Minor color
 * @cssprop {Length} [--gv-tag-icon--s=18px] - Height and icon width
 */
export class GvTag extends LitElement {

  static get properties () {
    return {
      icon: { type: String },
      iconRight: { type: String, attribute: 'icon-right' },
      major: { type: Boolean },
      minor: { type: Boolean },
      skeleton: { type: Boolean },
      clickable: { type: Boolean },
    };
  }

  static get styles () {
    return [
      skeleton,
      link,
      // language=CSS
      css`
          :host {
              box-sizing: border-box;
              display: inline-block;
              margin: 0.2rem;
              vertical-align: middle;
          }

          div.default {
              --bgc: var(--gv-tag--bgc, var(--gv-theme-neutral-color-lighter, #FAFAFA));
              --bdc: var(--gv-tag--bdc, var(--gv-theme-neutral-color-dark, #D9D9D9));
              --bds: var(--gv-tag--bds, solid);
              --bdw: var(--gv-tag--bdw, 1px);
              --c: var(--gv-tag--c, var(--gv-theme-font-color-dark, #262626));
          }

          div.major {
              --bgc: var(--gv-tag-major--bgc, var(--gv-theme-color, #5A7684));
              --bdc: var(--gv-tag-major--bdc, var(--gv-theme-color, #5A7684));
              --bds: var(--gv-tag-major--bds, solid);
              --bdw: var(--gv-tag-major--bdw, 1px);
              --c: var(--gv-tag-major--c, var(--gv-theme-font-color-light, #FFFFFF));
          }

          div.minor {
              --bgc: var(--gv-tag-minor--bgc, var(--gv-theme-neutral-color-lightest, #FFFFFF));
              --bdc: var(--gv-tag-minor--bdc, var(--gv-theme-neutral-color-dark, #D9D9D9));
              --bds: var(--gv-tag-minor--bds, dashed);
              --bdw: var(--gv-tag-minor--bdw, 1px);
              --c: var(--gv-tag-minor--c, var(--gv-theme-font-color-dark, #262626))
          }

          div {
              background-color: var(--bgc);
              border-color: var(--bdc);
              border-radius: var(--gv-tag--bdr, 4px);
              border-style: var(--bds);
              border-width: var(--bdw);
              box-shadow: var(--gv-tag--bsw, none);
              color: var(--c);

              font-size: var(--gv-theme-font-size-s, 12px);
              line-height: 20px;
              padding: 1px 8px;
              --gv-icon--s: var(--gv-tag-icon--s, 18px);
              --gv-icon--c: var(--c);
          }

          div > * {
              vertical-align: middle;
              display: inline-flex;
          }
      `,
    ];
  }

  render () {

    const modes = {
      default: !this.major && !this.minor,
      major: this.major,
      minor: this.minor && !this.major,
      skeleton: this.skeleton,
      link: this.clickable,
    };

    return html`
      <div class=${classMap(modes)}>
         ${this.icon ? html`<gv-icon shape="${this.icon}"></gv-icon>` : ''}
        <slot></slot>
        ${this.iconRight ? html`<gv-icon shape="${this.iconRight}"></gv-icon>` : ''}
      </div>
    `;
  }

}

window.customElements.define('gv-tag', GvTag);
