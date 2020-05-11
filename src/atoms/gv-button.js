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
import '../atoms/gv-icon';
import { ifDefined } from 'lit-html/directives/if-defined';
import { dispatchCustomEvent } from '../lib/events';

/**
 * A button
 *
 * ## Details
 *
 * * attributes `primary` define the mode of the button and are exclusive.
 * * You can only set one mode at a time.
 * * When you don't use any of these values, the mode defaults to `default`.
 *
 * @fires gv-button:click - Click event from inner button element
 *
 * @slot - The content of the button (text or HTML)
 *
 * @attr {String} type - the type of the button
 * @attr {Boolean} primary - set button UI mode to primary
 * @attr {Boolean} danger - set button UI mode to danger
 * @attr {Boolean} disabled - same as native button element `disabled` attribute
 * @attr {Boolean} outlined - set button UI as outlined (white background instead of filled color)
 * @attr {Boolean} link - set button UI mode to link
 * @attr {String} href - If is defined gv-button will be rendered as a <a> with `href`
 * @attr {Boolean} skeleton - enable skeleton screen UI pattern (loading hint)
 * @attr {String} icon - display an icon on the button
 * @attr {Boolean} icon-right - if icon should be at right
 * @attr {String} title - title of button
 * @attr {Boolean} loading - true to display a loading icon
 * @attr {String} provider - Provider name (github, oidc, graviteeio_am, google)
 *
 * @cssprop {Color} [--gv-button--bgc=var(--gv-theme-color-dark, #28444F)] - Background color
 * @cssprop {Color} [--gv-button--c=var(--gv-theme-font-color-light, #FFFFFF)] - Color
 * @cssprop {Color} [--gv-button-primary--c=var(--gv-theme-font-color-light, #FFFFFF)] - Primary color
 * @cssprop {Color} [--gv-button-primary--bgc=var(--gv-theme-color, #5A7684)] - Primary background color
 * @cssprop {Color} [--gv-button-danger--c=var(--gv-theme-font-color-light, #FFFFFF)] - Danger color
 * @cssprop {Color} [--gv-button-danger--bgc=var(--gv-theme-danger-color, #FF5722)] - Danger background color
 * @cssprop {Length} [--gv-button--p=7px 14px] - Padding
 * @cssprop {Length} [--gv-button--fz=var(--gv-theme-font-size-m, 14px)] - Font size
 * @cssprop {Length} [--gv-button--bdrs=0.15rem] - Border radius
 */
export class GvButton extends LitElement {

  static get properties () {
    return {
      type: { type: String },
      danger: { type: Boolean },
      disabled: { type: Boolean },
      primary: { type: Boolean },
      outlined: { type: Boolean },
      link: { type: Boolean },
      href: { type: String },
      skeleton: { type: Boolean },
      icon: { type: String },
      iconRight: { type: String, attribute: 'icon-right' },
      loading: { type: Boolean },
      title: { type: String, reflect: true },
      provider: { type: String },
    };
  }

  static get styles () {
    return [
      link,
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          display: inline-block;
          margin: 0.2rem;
          vertical-align: middle;
          --gv-icon--s: 23px;
          --github--c: #444;
          --google--c: #4285F4;
          --oidc--c: #000000;
          --gravitee--c: #86c3d0;
          outline: none;
        }

        .github {
          --gv-button--bgc: var(--github--c);
        }

        .google {
          --gv-button--bgc: var(--google--c);
        }

        .oidc {
          --gv-button--bgc: var(--oidc--c);
          --gv-button-icon--c: #fff;
        }

        .oidc.outlined {
          --gv-button-icon--c: var(--oidc--c);
        }

        .graviteeio_am {
          --gv-button--bgc: var(--gravitee--c);
        }

        /* RESET */
        .button {
          background: #fff;
          border: 1px solid #000;
          display: block;
          font-size: var(--gv-button--fz, var(--gv-theme-font-size-m, 14px));
          margin: 0;
          padding: 0;
          height: 100%;
          text-decoration: none;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          text-align: center;
        }

        /* BASE */
        .button:not(.link) {
          border-radius: var(--gv-button--bdrs, 0.15rem);
          cursor: pointer;
          min-height: 39px;
          min-width: 39px;
          padding: var(--gv-button--p, 7px 14px);
          text-transform: uppercase;
          user-select: none;
          width: 100%;
        }

        /* COLORS */
        .default {
          --c: var(--gv-button--c, var(--gv-theme-font-color-light, #FFFFFF));
          --bgc: var(--gv-button--bgc, var(--gv-theme-color-dark, #28444F));
          --gv-icon--c: var(--gv-button--c, var(--gv-theme-font-color-light, #FFFFFF))
        }

        .primary {
          --c: var(--gv-button-primary--c, var(--gv-theme-font-color-light, #FFFFFF));
          --bgc: var(--gv-button-primary--bgc, var(--gv-theme-color, #5A7684));
          --gv-icon--c: var(--gv-button-primary--c, var(--gv-theme-font-color-light, #FFFFFF));
          font-weight: 500;
        }

        .danger {
          --c: var(--gv-button-danger--c, var(--gv-theme-font-color-light, #FFFFFF));
          --bgc: var(--gv-button-danger--bgc, var(--gv-theme-danger-color, #FF5722));
          --gv-icon--c: var(--gv-button-danger--c, var(--gv-theme-font-color-light, #FFFFFF));
        }

        /* MODES */
        .button {
          background-color: var(--bgc);
          border-color: var(--bgc);
          color: var(--c);
          position: relative;
        }

        .outlined {
          background-color: var(--c);
          color: var(--bgc);
          --gv-icon--c: var(--bgc);
        }

        /* STATES */
        .button:focus, .button:active {
          outline: none;
        }
        
        .button:not(.link):not(.disabled):focus {
          box-shadow: 0 0 0 .1em rgba(50, 115, 220, .25);
        }

        .button:not(.link):not(.disabled):hover {
          box-shadow: 0 1px 3px var(--gv-theme-color-darker, #383E3F);
        }

        .button:active {
          box-shadow: none;
        }

        .button.disabled {
          cursor: default;
          opacity: .5;
        }

        .button.skeleton > gv-icon {
          opacity: 0;
        }

        /* TRANSITIONS */
        .button {
          box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          transition: all 75ms ease-in-out;
        }

        /* We can do this because we set a visible focus state */
        .button::-moz-focus-inner {
          border: 0;
        }

        .button.icon > * {
          vertical-align: middle;
        }

        .button.icon {
          display: flex;
          align-items: center;
        }

        .button slot {
          flex: 1;
          white-space: nowrap;
          display: inline;
        }

        .button.icon slot {
          padding-left: 21px;
        }


        .button.iconRight slot {
          padding-left: 0;
          padding-right: 21px;
        }

        .button.iconRight slot {
          direction: rtl;
        }

        gv-icon {
          left: 7px;
          position: absolute;
        }

        .button.iconRight gv-icon {
          left: unset;
          right: 7px;
        }

        .loading gv-icon {
          animation: spinner 1.6s linear infinite;
          --gv-icon--s: 20px;
        }

        @keyframes spinner {
          to {
            transform: rotate(360deg);
          }
        }

        .link {
          border: 0;
          cursor: pointer;
          text-decoration: underline;
          outline: 0;
        }
      `,
      skeleton,
    ];
  }

  _onClick (e) {
    if (this.href) {
      e.preventDefault();
    }
    if (!this.disabled && !this.loading && !this.skeleton) {
      const form = this.closest('form');
      if (form && this.type === 'submit') {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
      dispatchCustomEvent(this, 'click');
    }
  }

  async performUpdate () {
    super.performUpdate();
    const icon = this.shadowRoot.querySelector('gv-icon');
    if (icon) {
      icon.performUpdate();
    }
  }

  render () {
    const classes = {
      button: true,
      primary: this.primary && !this.danger,
      danger: this.danger,
      skeleton: this.skeleton && !this.link,
      default: !this.primary && !this.danger && !this.link,
      outlined: this.outlined,
      icon: this.icon || this.iconRight,
      iconRight: this.iconRight,
      loading: this.loading && !this.link,
      link: this.link && !this.primary && !this.danger,
      disabled: this.disabled,
    };

    if (this.provider) {
      classes[this.provider] = true;
      this.icon = `thirdparty:${this.provider}`;
      classes.icon = true;
    }

    if (this.href) {
      return html`<a
          .href="${this.href}"
          .title="${ifDefined(this.title)}"
          class=${classMap(classes)}
          @click="${this._onClick}">
          ${this._getIconLeft()}
          <slot></slot>
          ${this._getIconRight()}
        </a>`;
    }
    else {
      return html`<button
          type=${this.type || 'button'}
          .title="${ifDefined(this.title)}"
        class=${classMap(classes)}
        .disabled=${this.disabled || this.skeleton}
        @click="${this._onClick}">
        ${this._getIconLeft()}
        <slot></slot>
        ${this._getIconRight()}
      </button>`;
    }
  }

  _getIconRight () {
    if (this.iconRight) {
      if (this.loading && !this.icon && !this.link) {
        return html`<gv-icon shape="navigation:waiting" .title="${ifDefined(this.title)}"></gv-icon>`;
      }
      return html`<gv-icon shape="${this.iconRight}" .title="${ifDefined(this.title)}"></gv-icon>`;
    }
    return '';
  }

  _getIconLeft () {
    if (this.icon) {
      if (this.loading && !this.link) {
        return html`<gv-icon shape="navigation:waiting" .title="${ifDefined(this.title)}"></gv-icon>`;
      }
      return html`<gv-icon shape="${this.icon}" .title="${ifDefined(this.title)}"></gv-icon>`;
    }
    return '';
  }
}

window.customElements.define('gv-button', GvButton);
