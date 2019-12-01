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
 * A Tag
 *
 * @fires click - Native click event
 *
 * @slot - The content of the tag (text or HTML)
 *
 * @attr {String} icon - name of shape
 * @attr {Boolean} major - set tag UI as major
 * @attr {Boolean} minor - set tag UI as minor
 * @attr {Boolean} skeleton -  enable skeleton screen UI pattern (loading hint)
 *
 * @cssprop {String} --gv-tag--bdr - set the border radius.
 * @cssprop {String} --gv-tag([-major|-minor]?)--bgc - set the background color.
 * @cssprop {String} --gv-tag([-major|-minor]?)--bdc - set the border color.
 * @cssprop {String} --gv-tag([-major|-minor]?)--bds - set the border style.
 * @cssprop {String} --gv-tag([-major|-minor]?)--bdw - set the border width.
 * @cssprop {String} --gv-tag([-major|-minor]?)--c - set the color.
 */
export class GvTag extends LitElement {

  static get properties () {
    return {
      icon: { type: String },
      major: { type: Boolean },
      minor: { type: Boolean },
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
              --gv-icon--h: 18px;
              --gv-icon--w: 18px;
          }

          div.default {
              --bgc: var(--gv-tag--bgc, #F5F5F5);
              --bdc: var(--gv-tag--bdc, #D9D9D9);
              --bds: var(--gv-tag--bds, solid);
              --bdw: var(--gv-tag--bdw, 1px);
              --c: var(--gv-tag--c, #595959)
          }

          div.major {
              --bgc: var(--gv-tag-major--bg-color, #009B5B);
              --bdc: var(--gv-tag-major--bdc, #009B5B);
              --bds: var(--gv-tag-major--bds, solid);
              --bdw: var(--gv-tag-major--bdw, 1px);
              --c: var(--gv-tag-major--c, #FFF);
          }

          div.minor {
              --bgc: var(--gv-tag-minor--bg-color, #FFF);
              --bdc: var(--gv-tag-minor--bdc, #D9D9D9);
              --bds: var(--gv-tag-minor--bds, dashed);
              --bdw: var(--gv-tag-minor--bdw, 1px);
              --c: var(--gv-tag-minor--c, #595959)
          }

          div {
              background-color: var(--bgc);
              border-color: var(--bdc);
              border-radius: var(--gv-tag--bdr, 4px);
              border-style: var(--bds);
              border-width: var(--bdw);
              color: var(--c);

              font-size: 12px;
              line-height: 20px;
              padding: 1px 8px;
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
    };

    return html`
      <div class=${classMap(modes)}>
         ${this.icon ? html`<gv-icon shape="${this.icon}"></gv-icon>` : ''}
        <slot></slot>
      </div>
    `;
  }

}

window.customElements.define('gv-tag', GvTag);
