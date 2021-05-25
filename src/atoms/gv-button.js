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
import { classMap } from 'lit/directives/class-map';
import { LitElement, html, css } from 'lit';
import { skeleton } from '../styles/skeleton';
import { link } from '../styles/link';
import '../atoms/gv-icon';
import { ifDefined } from 'lit/directives/if-defined';
import { dispatchCustomEvent } from '../lib/events';

/**
 * A button
 *
 * ## Details
 *
 * * attributes `primary` define the mode of the button and are exclusive.
 * * You can only set one mode at a time.
 * * When you don't use any of these values, the mode defaults to `default`.
 * * has @theme facet
 *
 * @fires gv-button:click - Click event from inner button element
 *
 * @slot - The content of the button (text or HTML)
 *
 * @attr {Enum{button|submit}} type - the type of the button
 * @attr {Boolean} primary - set button UI mode to primary
 * @attr {Boolean} danger - set button UI mode to danger
 * @attr {Boolean} disabled - same as native button element `disabled` attribute
 * @attr {Boolean} outlined - set button UI as outlined (white background instead of filled color)
 * @attr {Boolean} link - set button UI mode to link
 * @attr {String} href - If is defined gv-button will be rendered as a <a> with `href`
 * @attr {Boolean} skeleton - enable skeleton screen UI pattern (loading hint)
 * @attr {String} icon - display an icon on the left side of the button
 * @attr {String} icon-right - display an icon on the right side of the button
 * @attr {String} title - title of button
 * @attr {Boolean} loading - true to display a loading icon
 * @attr {String} provider - Provider name (github, oidc, graviteeio_am, google)
 * @attr {Boolean} small - for a small input
 * @attr {Number} tabindex - tabindex of button
 *
 * @cssprop {Color} [--gv-button--bgc=var(--gv-theme-color-dark, #28444f)] - Background color
 * @cssprop {Color} [--gv-button--c=var(--gv-theme-font-color-light, #ffffff)] - Color
 * @cssprop {Color} [--gv-button-primary--c=var(--gv-theme-font-color-light, #ffffff)] - Primary color
 * @cssprop {Color} [--gv-button-primary--bgc=var(--gv-theme-color, #5a7684)] - Primary background color
 * @cssprop {Color} [--gv-button-danger--c=var(--gv-theme-font-color-light, #ffffff)] - Danger color
 * @cssprop {Color} [--gv-button-danger--bgc=var(--gv-theme-color-danger, #ff5722)] - Danger background color
 * @cssprop {Color} [--gv-button-oidc--bgc=#000000] - OIDC Social Provider button background color
 * @cssprop {Color} [--gv-button-graviteeio_am--bgc=#86c3d0] - Gravitee.io AM Social Provider button background color
 * @cssprop {Length} [--gv-button--p=7px 14px] - Padding
 * @cssprop {Length} [--gv-button--fz=var(--gv-theme-font-size-m, 14px)] - Font size
 * @cssprop {Length} [--gv-button--bdrs=0.15rem] - Border radius
 */
export class GvButton extends LitElement {
  static get properties() {
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
      small: { type: Boolean },
      tabindex: { type: Number, reflect: true },
      _hasContent: { type: Boolean, attribute: false },
    };
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          display: inline-block;
          margin: 0.2rem;
          vertical-align: middle;
          --gv-icon--s: 23px;
          --github--c: #444;
          --google--c: #4285f4;
          --oidc--c: var(--gv-button-oidc--bgc, #000000);
          --gravitee--c: var(--gv-button-graviteeio_am--bgc, #86c3d0);
        }

        :host(:not([link])) {
          outline: 0;
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

        .button.graviteeio_am {
          --gv-button--bgc: var(--gravitee--c);
          color: #383e3f;
        }

        /* RESET */
        .button {
          background: #fff;
          border: 1px solid #000;
          font-size: var(--gv-button--fz, var(--gv-theme-font-size-m, 14px));
          margin: 0;
          padding: 0;
          height: 100%;
          text-decoration: none;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          outline: 0;
        }

        .button.small {
          --gv-icon--s: 16px;
        }

        .button.small:not(.link) {
          max-height: 25px;
          min-height: 25px;
          min-width: 25px;
          --gv-button--p: 1px 4px;
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

        .button.iconLeft:not(.noContent) slot {
          margin-left: 7px;
        }

        .button.iconRight:not(.noContent) slot {
          margin-right: 7px;
        }

        /* COLORS */
        .default {
          --c: var(--gv-button--c, var(--gv-theme-font-color-light, #ffffff));
          --bgc: var(--gv-button--bgc, var(--gv-theme-color-dark, #28444f));
          --icon--c: var(--gv-button--c, var(--gv-theme-font-color-light, #ffffff));
          --gv-icon--c: var(--icon--c);
          --gv-icon-opacity--c: var(--icon--c);
        }

        .primary {
          --c: var(--gv-button-primary--c, var(--gv-theme-font-color-light, #ffffff));
          --bgc: var(--gv-button-primary--bgc, var(--gv-theme-color, #5a7684));
          --icon--c: var(--gv-button-primary--c, var(--gv-theme-font-color-light, #ffffff));
          --gv-icon--c: var(--icon--c);
          --gv-icon-opacity--c: var(--icon--c);
          font-weight: 500;
        }

        .danger {
          --c: var(--gv-button-danger--c, var(--gv-theme-font-color-light, #ffffff));
          --bgc: var(--gv-button-danger--bgc, var(--gv-theme-color-danger, #ff5722));
          --icon--c: var(--gv-button-danger--c, var(--gv-theme-font-color-light, #ffffff));
          --gv-icon--c: var(--icon--c);
          --gv-icon-opacity--c: var(--icon--c);
        }

        /* MODES */
        :host([skeleton]) .button:not(.link) {
          border-color: var(--gv-theme-skeleton-color, #bfbfbf);
        }

        .button:not(.link) {
          background-color: var(--bgc);
          border-color: var(--bgc);
          color: var(--c);
        }

        .button.outlined {
          background-color: var(--c);
          color: var(--bgc);
          --gv-icon--c: var(--bgc);
          --gv-icon-opacity--c: var(--bgc);
        }

        :host(:focus) .button:not(.link):not(.disabled),
        :host(:hover) .button:not(.link):not(.disabled) {
          box-shadow: 0 1px 3px var(--gv-theme-color-darker, #383e3f);
        }

        :host(:active) .button {
          box-shadow: none;
        }

        .button.disabled {
          cursor: default;
          opacity: 0.5;
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

        .button slot {
          flex: 1;
          white-space: nowrap;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        }

        .button.noContent slot {
          display: none;
        }

        .loading gv-icon {
          animation: spinner 1.6s linear infinite;
          --gv-icon--s: 20px;
        }

        .loading.small gv-icon {
          --gv-icon--s: 18px;
        }

        @keyframes spinner {
          to {
            transform: rotate(360deg);
          }
        }

        .link {
          border: 0;
          cursor: pointer;
          background-color: transparent;
        }

        button.link {
          text-decoration: underline;
        }

        :host([skeleton]) .link {
          color: transparent;
        }
      `,
      skeleton,
      link,
    ];
  }

  constructor() {
    super();
    this.tabindex = 0;
    this.type = 'button';
    this.addEventListener('click', this._onClick.bind(this));
  }

  _onKeyDown(e) {
    if (e.keyCode === 32 || e.keyCode === 13) {
      e.preventDefault();
      this._onClick(e);
    }
  }

  _onClick(e) {
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

  async performUpdate() {
    super.performUpdate();
    const icon = this.shadowRoot.querySelector('gv-icon');
    if (icon) {
      icon.performUpdate();
    }
  }

  render() {
    const classes = {
      button: true,
      primary: this.primary && !this.danger,
      danger: this.danger,
      skeleton: this.skeleton && !this.link,
      default: !this.primary && !this.danger && !this.link,
      outlined: this.outlined,
      icon: this.icon || this.iconRight,
      iconLeft: this._hasIconLeft(),
      iconRight: this.iconRight,
      loading: this.loading && !this.link,
      link: this.link && !this.primary && !this.danger,
      disabled: this.disabled,
      small: this.small,
      noContent: !this._hasContent,
    };

    if (this.provider) {
      classes[this.provider] = true;
      this.icon = `thirdparty:${this.provider}`;
      classes.icon = true;
      classes.iconLeft = true;
    }

    if (this.href) {
      return html`<a tabindex="-1" .href="${this.href}" .title="${ifDefined(this.title)}" class=${classMap(classes)}>
        ${this._getIconLeft()}
        <slot></slot>
        ${this._getIconRight()}
      </a>`;
    } else {
      return html`<button
        tabindex="-1"
        type=${this.type || 'button'}
        .title="${ifDefined(this.title)}"
        class=${classMap(classes)}
        .disabled=${this.disabled || this.skeleton}
      >
        ${this._getIconLeft()}
        <slot></slot>
        ${this._getIconRight()}
      </button>`;
    }
  }

  _getIconRight() {
    if (this.iconRight) {
      if (this.loading && !this.icon && !this.link) {
        return html`<gv-icon shape="navigation:waiting" .title="${ifDefined(this.title)}"></gv-icon>`;
      }
      return html`<gv-icon shape="${this.iconRight}" .title="${ifDefined(this.title)}"></gv-icon>`;
    }
    return '';
  }

  _hasIconLeft() {
    return (this.icon || this.loading) && !this.iconRight;
  }

  _getIconLeft() {
    if (this._hasIconLeft()) {
      if (this.loading && !this.link) {
        return html`<gv-icon shape="navigation:waiting" .title="${ifDefined(this.title)}"></gv-icon>`;
      }
      return html`<gv-icon shape="${this.icon}" .title="${ifDefined(this.title)}"></gv-icon>`;
    }
    return '';
  }

  firstUpdated() {
    this.addEventListener('keydown', this._onKeyDown);
  }

  updated(_changedProperties) {
    super.updated(_changedProperties);
    const slot = this.shadowRoot.querySelector('slot');
    this._hasContent =
      slot
        .assignedNodes()
        .map((node) => node.textContent)
        .filter((text) => text.trim() !== '').length > 0;
  }
}

window.customElements.define('gv-button', GvButton);
