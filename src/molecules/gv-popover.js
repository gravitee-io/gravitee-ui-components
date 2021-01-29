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
import { css, LitElement } from 'lit-element';
import { html } from 'lit-html';
import { classMap } from 'lit-html/directives/class-map';

/**
 * Popover component
 *
 * ## Details
 * * has @theme facet
 *
 * @attr {String} event - the event that triggers the opening.
 * @attr {String} delay - the time before closing, useful for a click event
 * @attr {String} arrow - if need arrow
 * @attr {String} small - Small popover
 * @attr {String} medium - Medium popover
 * @attr {String} large - Large popover
 * @attr {String} width - The width of popover
 * @attr {String} position - The position top, right, bottom or left
 * @attr {Boolean} auto - to let the component choose the position
 *
 * @cssprop {Color} [--gv-popover--bgc=var(--gv-theme-neutral-color-lighter, #fafafa)] - Background color
 * @cssprop {Color} [--gv-popover--c=var(--gv-theme-font-color-dark, #262626)] - Color
 * @cssprop {Color} [--gv-popover--bdc=var(--gv-theme-neutral-color, #f5f5f5)] - Border color
 * @cssprop {Length} [--gv-popover--p=0.5rem] - Padding
 */
export class GvPopover extends LitElement {
  static get properties() {
    return {
      event: { type: String },
      delay: { type: Number },
      arrow: { type: Boolean, reflect: true },
      small: { type: Boolean, reflect: true },
      medium: { type: Boolean, reflect: true },
      large: { type: Boolean, reflect: true },
      width: { type: String },
      position: { type: String, reflect: true },
      auto: { type: Boolean },
      _opened: { type: Boolean, attribute: false },
    };
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          cursor: pointer;
          box-sizing: border-box;
          display: inline-block;
          position: relative;
        }

        .popover {
          --bgc: var(--gv-popover--bgc, var(--gv-theme-neutral-color-lighter, #fafafa));
          color: var(--gv-popover--c, var(--gv-theme-font-color-dark, #262626));
          position: absolute;
          background-color: var(--bgc);
          padding: var(--gv-popover--p, 0.5rem);
          border-radius: 4px;
          z-index: 1000;
          margin: 0 auto;
          text-align: center;
          width: auto;
          box-sizing: content-box;
        }

        :host([position='bottom']) .popover {
          top: calc(100% + 0.4rem);
          transform: translateX(-50%);
          left: 50%;
          box-shadow: 1px 0 0 0 var(--gv-theme-neutral-color, #f5f5f5), 0 2px 3px var(--gv-theme-neutral-color-dark, #bfbfbf);
        }

        :host([position='bottom'][arrow]) .popover {
          top: calc(100% + 0.4rem + 10px);
        }

        :host([position='bottom'][arrow]) .arrow {
          top: calc(100% - 8px);
          transform: translateX(-50%);
          left: 50%;
        }

        :host([position='top']) .popover {
          bottom: calc(100% + 0.4rem);
          transform: translateX(-50%);
          left: 50%;
          box-shadow: 1px 0 0 0 var(--gv-theme-neutral-color, #f5f5f5), 0 -2px 3px var(--gv-theme-neutral-color-dark, #bfbfbf);
        }

        :host([position='top'][arrow]) .popover {
          bottom: calc(100% + 0.4rem + 10px);
        }

        :host([position='top'][arrow]) .arrow {
          bottom: calc(100% - 8px);
          transform: translateX(-50%) rotate(180deg);
          left: 50%;
        }

        :host([position='left']) .popover {
          top: 50%;
          transform: translateY(-50%);
          right: calc(100% + 0.4rem);
          box-shadow: -1px 0 0 0 var(--gv-theme-neutral-color, #f5f5f5), -1px 2px 3px var(--gv-theme-neutral-color-dark, #bfbfbf);
        }

        :host([position='left'][arrow]) .popover {
          right: calc(100% + 0.4rem + 10px);
        }

        :host([position='left'][arrow]) .arrow {
          top: 50%;
          transform: translateY(-50%) rotate(90deg);
          right: calc(100% - 8px);
        }

        :host([position='right']) .popover {
          top: 50%;
          transform: translateY(-50%);
          left: calc(100% + 0.4rem);
          box-shadow: 1px 0 0 1px var(--gv-theme-neutral-color, #f5f5f5), 1px 1px 1px var(--gv-theme-neutral-color-dark, #bfbfbf);
        }

        :host([position='right'][arrow]) .popover {
          left: calc(100% + 0.4rem + 10px);
        }

        :host([position='right'][arrow]) .arrow {
          left: calc(100% - 8px);
          top: 50%;
          transform: translateY(-50%) rotate(-90deg);
        }

        .inline .popover {
          white-space: nowrap;
        }

        :host([small]) .popover {
          width: 200px;
        }

        :host([medium]) .popover {
          width: 350px;
        }

        :host([large]) .popover {
          width: 500px;
        }

        .content {
          width: 100%;
        }

        .popover,
        .arrow {
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease-in-out;
        }

        .open .popover,
        .open .arrow {
          display: block;
          opacity: 1;
          visibility: visible;
        }

        .close .popover,
        .close .arrow {
        }

        .arrow {
          width: 25px;
          height: 25px;
          z-index: 101;
          position: absolute;
          overflow: hidden;
        }

        .arrow:after {
          content: '';
          position: absolute;
          width: 12px;
          height: 12px;
          background: var(--gv-popover--bgc, var(--gv-theme-neutral-color-lighter, #fafafa));
          transform: rotate(45deg);
          top: 19px;
          left: 6px;
          border: 1px solid var(--gv-popover--bdc, var(--gv-theme-neutral-color, #f5f5f5));
        }
      `,
    ];
  }

  constructor() {
    super();
    this.event = 'mouseover';
    this._closeHandler = this._close.bind(this);
    this.delay = 0;
    this.arrow = false;
    this.position = 'bottom';
    this.auto = false;
  }

  _open(e) {
    if (this.event === 'click') {
      window.removeEventListener(this.event, this._closeHandler);
    }
    this._opened = true;
    if (this.event === 'click') {
      setTimeout(() => window.addEventListener(this.event, this._closeHandler));
    }

    if (this.delay > 0) {
      setTimeout(() => this._close({}), this.delay);
    }
  }

  close() {
    this._close({});
  }

  _close(e) {
    if (this._opened && (e.target !== this.firstElementChild || this.event !== 'click')) {
      const openElement = this.shadowRoot.querySelector('.open');
      openElement.classList.add('close');
      setTimeout(() => {
        openElement.classList.remove('close');
        this._opened = false;
      }, 200);
    }
  }

  render() {
    const inline = this.width == null && !this.small && !this.medium && !this.large;
    const classes = { open: this._opened, content: true, inline };
    return html` <div class="${classMap(classes)}">
      <slot></slot>
      ${this.arrow ? html`<div class="arrow"></div>` : ''}
      <div class="popover">${this.renderContent()}</div>
    </div>`;
  }

  renderContent() {
    return html`<slot name="popover"></slot>`;
  }

  firstUpdated(_changedProperties) {
    setTimeout(() => {
      this.addEventListener(this.event, this._open.bind(this));
      if (this.event.startsWith('mouse') && this.delay === 0) {
        this.addEventListener('mouseleave', this._close.bind(this));
      }
    });
  }

  _getContentSize() {
    const popover = this.shadowRoot.querySelector('.popover');
    return {
      width: popover.offsetWidth,
      height: popover.offsetHeight,
    };
  }

  _getPositionPadding() {
    return 10;
  }

  _getCenterPosition() {
    return {
      x: this.target.x + this.target.width / 2 + window.scrollX,
      y: this.target.y + this.target.height / 2 + window.scrollY,
    };
  }

  _updatePosition() {
    if (this.position != null && this.auto) {
      const popover = this.shadowRoot.querySelector('.popover');
      if (popover) {
        this.target = this.firstElementChild.getBoundingClientRect();
        if (
          (this.position === 'top' && !this._hasTopSpace()) ||
          (this.position === 'bottom' && !this._hasBottomSpace()) ||
          (this.position === 'left' && !this._hasLeftSpace()) ||
          (this.position === 'right' && !this._hasRightSpace())
        ) {
          const index = [this._hasTopSpace(), this._hasRightSpace(), this._hasBottomSpace(), this._hasLeftSpace()].indexOf(true);
          if (index > -1) {
            this.position = ['top', 'right', 'bottom', 'left'][index];
          }
        }
      }
    }
  }

  _getMaxX() {
    return window.innerWidth - this._getPositionPadding();
  }

  _getMaxY() {
    return window.innerHeight - this._getPositionPadding();
  }

  _hasBottomSpace() {
    const y = this.target.y + this.target.height + this._getContentSize().height + this._getPositionPadding();

    return y <= this._getMaxY();
  }

  _hasRightSpace() {
    const y = this.target.x + this.target.width + this._getContentSize().width + this._getPositionPadding();

    return y <= this._getMaxX();
  }

  _hasTopSpace() {
    const y = this.target.y - this._getContentSize().height - this._getPositionPadding();

    return y >= this._getPositionPadding();
  }

  _hasLeftSpace() {
    const y = this.target.x - this._getContentSize().width - this._getPositionPadding();

    return y >= this._getPositionPadding();
  }

  updated(props) {
    if (props.has('width')) {
      this.shadowRoot.querySelector('.popover').style.setProperty('width', this.width);
    }
    this._updatePosition();
  }
}

window.customElements.define('gv-popover', GvPopover);
