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
import { link } from '../styles';
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
 * @attr {String} path - link title
 * @attr {Promise<String>} title - link title
 *
 * @cssprop {String} --gv-nav-link-a--ph - set the horizontal padding for the inner <a> tag. (Default: 2rem)
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
      title: { type: Promise },
    };
  }

  static get styles () {
    return [
      link,
      // language=css
      css`
          :host {
              box-sizing: border-box;
              display: inline-flex;
              margin: 0.2rem;
              vertical-align: middle;
              --gv-icon--h: 24px;
              --gv-icon--w: 24px;
          }

          a {
              opacity: 1;
              padding: 1rem var(--gv-nav-link-a--ph, 1rem);
              color: var(--gv-nav-link--c, #333);
              background-color: var(--gv-nav-link--bgc, transparent);
              width: 100%;
              display: inline-flex;
              align-content: center;
              text-align: var(--gv-nav-link--ta, center);
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

          a div, a svg {
              display: inline;
              align-self: center;
          }

          a div {
              flex: 1;
              align-self: center;
              white-space: nowrap;
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
      title: await Promise.resolve(this.title),
    });
  }

  render () {
    const classes = {
      active: this.active, link: true,
    };
    const iconStyle = this.active ? { '--gv-icon--c': 'var(--gv-nav-link-active--c)' } : { '--gv-icon--c': 'var(--gv-nav-link--c)' };
    return html`
      <a @click=${this._onClick} 
      class="${classMap(classes)}" 
      ?href="${this.path}" 
      ?title="${until(this.title, '')}">
        ${this.icon ? html`<gv-icon shape=${this.icon} style=${styleMap(iconStyle)}></gv-icon>` : ''}
        <div>${until(this.title, '')}</div>
      </a>
    `;
  }
}

window.customElements.define('gv-nav-link', GvNavLink);
