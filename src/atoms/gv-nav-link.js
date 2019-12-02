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
import { link, skeleton } from '../styles';
import { classMap } from 'lit-html/directives/class-map';
import { styleMap } from 'lit-html/directives/style-map';
import { until } from 'lit-html/directives/until';
import { dispatchCustomEvent } from '../lib/events';

/**
 * A nav link
 *
 * @fires gv-nav-link:click - Custom click event from inner link element
 *
 * @slot - The content of the link (text or HTML)
 *
 * @attr {Boolean} active - set if link is active
 * @attr {String} path - link path
 * @attr {String} title - link title
 * @attr {String} help - help text left between parentheses
 *
 * @cssprop {String} --gv-nav-link-a--pv - set the vertical padding for the inner <a> tag. (Default: 1rem)
 * @cssprop {String} --gv-nav-link-a--ph - set the horizontal padding for the inner <a> tag. (Default: 1rem)
 * @cssprop {String} --gv-nav-link([-active]?)--c - set the color of link.
 * @cssprop {String} --gv-nav-link([-active]?)--bgc - set the background color of link.
 * @cssprop {String} --gv-nav-link-active--bdb - set the border bottom of active link. (Default: none)
 * @cssprop {String} --gv-nav-link--ta - set the text align (Default: center)
 */
export class GvNavLink extends LitElement {

  static get properties () {
    return {
      active: { type: Boolean },
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
              --gv-icon--h: 24px;
              --gv-icon--w: 24px;
          }

          a {
              opacity: 1;
              padding: var(--gv-nav-link-a--pv, 15px) var(--gv-nav-link-a--ph, 15px);
              color: var(--gv-nav-link--c, #333);
              background-color: var(--gv-nav-link--bgc, transparent);
              width: 100%;
              display: inline-flex;
              align-content: center;
              text-align: var(--gv-nav-link--ta, center);
              text-transform: capitalize;
          }

          a > * {
              flex: 1;
              align-self: center;
          }

          .active {
              color: var(--gv-nav-link-active--c, #fff);
              background-color: var(--gv-nav-link-active--bgc, #333);
              border-bottom: var(--gv-nav-link-active--bdb, none);
          }

          a span, a gv-icon {
              align-self: center;
          }

          a span {
              flex: 1;
              align-self: center;
              white-space: nowrap;
              margin: 0.3rem 0.5rem;
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
    const iconStyle = this.active ? { '--gv-icon--c': 'var(--gv-nav-link-active--c)' } : { '--gv-icon--c': 'var(--gv-nav-link--c)' };
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

window.customElements.define('gv-nav-link', GvNavLink);
