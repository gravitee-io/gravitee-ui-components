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
import { LitElement, html, css } from 'lit-element';
import { skeleton } from '../styles/skeleton';
import { link } from '../styles/link.js';
import { classMap } from 'lit-html/directives/class-map';
import { styleMap } from 'lit-html/directives/style-map';
import { until } from 'lit-html/directives/until';
import { dispatchCustomEvent } from '../lib/events';
import './gv-icon';
/**
 * A link
 *
 * @fires gv-link:click - Custom click event from inner link element
 *
 * @slot - The content of the link (text or HTML)
 *
 * @attr {Boolean} active - set if link is active
 * @attr {String} path - link path
 * @attr {String} title - link title
 * @attr {String} help - help text left between parentheses
 *
 * @cssprop {String} [--gv-link-a--pv=15px] - set the vertical padding for the inner <a> tag. (Default: 1rem)
 * @cssprop {String} [--gv-link-a--ph=15px] - set the horizontal padding for the inner <a> tag. (Default: 1rem)
 * @cssprop {String} [--gv-link--c=#262626] - set the color of link.
 * @cssprop {String} [--gv-link-active--c=#FAFAFA] - set the color of active link.
 * @cssprop {String} [--gv-link--bgc=transparent] - set the background color of link.
 * @cssprop {String} [--gv-link-active--bgc=#193E34] - set the background color of active link.
 * @cssprop {String} [--gv-link-active--bdb=none] - set the border bottom of active link. (Default: none)
 * @cssprop {String} [--gv-link--ta=center] - set the text align (Default: center)
 * @cssprop {String} [--gv-link--td=none] - set the text decoration (Default: none)
 * @cssprop {String} [--gv-link--tsh=none]- set the text shadow (Default: none)
 */
export class GvLink extends LitElement {

  static get properties () {
    return {
      active: { type: Boolean, reflect: true },
      icon: { type: String },
      path: { type: String },
      title: { type: String },
      _title: { type: String, attribute: false },
      help: { type: String },
      skeleton: { type: Boolean },
      small: { type: Boolean },
    };
  }

  static get styles () {
    return [
      skeleton,
      link,
      // language=css
      css`
          :host {
              box-sizing: border-box;
              display: inline-flex;
              vertical-align: middle;
              --gv-icon--s: 24px;
              --link-active--c: var(--gv-link-active--c, #FAFAFA);
              --link--c: var(--gv-link--c, #262626);
          }

          a {
            opacity: 1;
            padding: var(--gv-link-a--pv, 15px) var(--gv-link-a--ph, 15px);
            color: var(--link--c);
            background-color: var(--gv-link--bgc, transparent);
            width: 100%;
            display: inline-flex;
            align-content: center;
            text-align: var(--gv-link--ta, center);
            text-shadow: var(--gv-link--tsh, none);
          }

          a > * {
              flex: 1;
              align-self: center;
          }

          .active {
              color: var(--link-active--c);
              background-color: var(--gv-link-active--bgc, #193E34);
              border-bottom: var(--gv-link-active--bdb, none);
          }

          .link.active:hover {
            opacity: 1;
          }

          a span, a gv-icon {
              align-self: center;
          }

          a span {
              flex: 1;
              align-self: center;
              white-space: nowrap;
              margin: 0.3rem 0.5rem;
              text-decoration: var(--gv-link--td, none);
          }

          a.small span {
              margin: 0.3rem 0;
              width: 0;
              visibility: hidden;
          }

          .help {
              margin: 0 0.2rem;
              opacity: 0.5;
              font-size: 10px;
          }

          .help::before {
              content: '('
          }

          .help::after {
              content: ')'
          }

          .skeleton {
              background-color: #aaa;
              border-color: #777;
              color: transparent;
              transition: 0.5s;
              min-width: 100px;
              margin: 0 0.2rem;
              opacity: 0.5;
          }
      `,
    ];
  }

  async _onClick (e) {
    e.preventDefault();
    dispatchCustomEvent(this, 'click', {
      active: this.active,
      icon: this.icon,
      path: this.path,
      title: this._title,
    });
  }

  set title (value) {
    Promise.resolve(value).then((title) => {
      this._title = title;
    }).catch((e) => {});
  }

  render () {
    const classes = {
      active: this.active, link: true, skeleton: this.skeleton, small: this.small,
    };
    const iconStyle = this.active ? { '--gv-icon--c': 'var(--link-active--c)' } : { '--gv-icon--c': 'var(--link--c)' };
    return html`
      <a @click=${this._onClick}
      class="${classMap(classes)}"
      ?href="${this.path}"
      ?title="${until(this._title, '')}">
        ${this.icon ? html`<gv-icon shape=${this.icon} style=${styleMap(iconStyle)}></gv-icon>` : ''}
        <span>${until(this._title, '')}${this.help ? html`<span class="help">${until(this.help, '')}</span>` : ''}</span>
      </a>
    `;
  }
}

window.customElements.define('gv-link', GvLink);
