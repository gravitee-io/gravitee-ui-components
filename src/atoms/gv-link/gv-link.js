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
import { LitElement, html, css } from 'lit';
import { skeleton } from '../../styles/skeleton';
import { link } from '../../styles/link';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { until } from 'lit/directives/until.js';
import { dispatchCustomEvent } from '../../lib/events';
import '../gv-icon';
import { ifDefined } from 'lit/directives/if-defined.js';

/**
 * A link
 *
 * ## Details
 * * has @theme facet
 *
 * @fires gv-link:click - Custom click event from inner link element
 *
 * @slot - The content of the link (text or HTML)
 *
 * @attr {Boolean} active - set if link is active
 * @attr {String} path - link path
 * @attr {String} title - link title
 * @attr {String} target - link target
 * @attr {String} help - help text left between parentheses
 *
 * @cssprop {Length} [--gv-link-a--pv=15px] - Vertical padding for the inner <a> tag
 * @cssprop {Length} [--gv-link-a--ph=15px] - Horizontal padding for the inner <a> tag
 * @cssprop {Color} [--gv-link--c=var(--gv-theme-font-color-dark, #262626)] - Color
 * @cssprop {Color} [--gv-link-active--c=var(--gv-theme-font-color-light, #ffffff)] - Active color
 * @cssprop {Color} [--gv-link--bgc=transparent] - Background color
 * @cssprop {Color} [--gv-link-active--bgc=var(--gv-theme-color-dark, #28444f)] - Active background color
 * @cssprop {Color} [--gv-link-active--bdc=none] - Active border color
 * @cssprop {String} [--gv-link-active--bds=none] - Active border style
 * @cssprop {Length} [--gv-link-active--bdw=none] - Active border width
 * @cssprop {String} [--gv-link--ta=center] - Text align
 * @cssprop {String} [--gv-link--td=none] - Text decoration
 * @cssprop {String} [--gv-link--tsh=none]- Text shadow
 * @cssprop {Length} [--gv-link-icon--s=24px] - Height and icon width
 */
export class GvLink extends LitElement {
  static get properties() {
    return {
      active: { type: Boolean, reflect: true },
      icon: { type: String },
      path: { type: String },
      title: { type: String },
      target: { type: String },
      _title: { type: String, attribute: false },
      help: { type: String },
      skeleton: { type: Boolean },
      small: { type: Boolean },
    };
  }

  static get styles() {
    return [
      link,
      // language=css
      css`
        :host {
          display: inline-flex;
          vertical-align: middle;
          --gv-icon--s: var(--gv-link-icon--s, 24px);
          --link-active--c: var(--gv-link-active--c, var(--gv-theme-font-color-light, #ffffff));
          --link--c: var(--gv-link--c, var(--gv-theme-font-color-dark, #262626));
          --pv: var(--gv-link-a--pv, 15px);
          --ph: var(--gv-link-a--ph, 15px);
        }

        *,
        *:before,
        *:after {
          box-sizing: border-box;
        }

        a {
          opacity: 1;
          padding: var(--pv) var(--ph);
          color: var(--link--c);
          background-color: var(--gv-link--bgc, transparent);
          width: 100%;
          display: inline-flex;
          align-content: center;
          text-align: var(--gv-link--ta, center);
          text-shadow: var(--gv-link--tsh, none);
          border-color: var(--gv-link--bgc, transparent);
          border-style: var(--gv-link-active--bds, none);
          border-width: var(--gv-link-active--bdw, none);
        }

        a > * {
          align-self: center;
        }

        .active {
          color: var(--link-active--c);
          background-color: var(--gv-link-active--bgc, var(--gv-theme-color-dark, #28444f));
          border-color: var(--gv-link-active--bdc, none);
        }

        .link.active:hover {
          opacity: 1;
        }

        a span,
        a gv-icon {
          align-self: center;
        }

        a span {
          flex: 1;
          align-self: center;
          white-space: nowrap;
          margin: 0.3rem 0.5rem;
          text-decoration: var(--gv-link--td, none);
          text-overflow: ellipsis;
          overflow: hidden;
        }

        a.small span {
          margin: 0.3rem 0;
          width: 0;
          visibility: hidden;
        }

        .help {
          margin: 0 0.2rem;
          opacity: 0.5;
          font-size: var(--gv-theme-font-size-xs, 10px);
        }

        .help::before {
          content: '(';
        }

        .help::after {
          content: ')';
        }

        .skeleton {
          min-width: 100px;
          margin: 0 0.2rem;
          opacity: 0.5;
        }
      `,
      skeleton,
    ];
  }

  async _onClick(e) {
    e.preventDefault();
    dispatchCustomEvent(this, 'click', {
      active: this.active,
      icon: this.icon,
      path: this.path,
      title: this._title,
      target: this.target,
    });
  }

  set title(value) {
    Promise.resolve(value)
      .then((title) => {
        this._title = title;
      })
      .catch((e) => {});
  }

  render() {
    const classes = {
      active: this.active,
      link: true,
      skeleton: this.skeleton,
      small: this.small,
    };
    const iconStyle = this.active
      ? { '--gv-icon--c': 'var(--link-active--c)', '--gv-icon-opacity--c': 'var(--link-active--c)' }
      : { '--gv-icon--c': 'var(--link--c)', '--gv-icon-opacity--c': 'var(--link--c)' };
    return html`
      <a
        @click=${this._onClick}
        class="${classMap(classes)}"
        .href="${ifDefined(this.path)}"
        .target="${ifDefined(this.target)}"
        ?title="${until(this._title, '')}"
      >
        ${this.icon ? html`<gv-icon shape=${this.icon} style=${styleMap(iconStyle)}></gv-icon>` : ''}
        <span>${until(this._title, '')}${this.help ? html`<span class="help">${until(this.help, '')}</span>` : ''}</span>
      </a>
    `;
  }
}

window.customElements.define('gv-link', GvLink);
