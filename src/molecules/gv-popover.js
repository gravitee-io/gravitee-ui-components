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
import { zoom } from '../styles/zoom';

/**
 * Popover component
 *
 * @attr {String} event - the event that triggers the opening.
 * @cssprop {Color} [--gv-popover--bgc=var(--gv-theme-neutral-color-lighter, #FAFAFA)] - Background color
 * @cssprop {Color} [--gv-popover--bdc=var(--gv-theme-neutral-color, #F5F5F5)] - Border color
 * @cssprop {Length} [--gv-popover--maw=350px] - Max width
 */
export class GvPopover extends LitElement {

  static get properties () {
    return {
      event: { type: String },
      _opened: { type: Boolean, attribute: false },
    };
  };

  static get styles () {
    return [
      zoom,
      // language=CSS
      css`
        :host {
          cursor: pointer;
          box-sizing: border-box;
          display: inline-block;
        }

        .popover {
          --bgc: var(--gv-popover--bgc, var(--gv-theme-neutral-color-lighter, #FAFAFA));
          --maw: var(--gv-popover--maw, 350px);
          position: absolute;
          top: 0;
          left: 0;
          background-color: var(--bgc);
          padding: 1rem;
          border-radius: 4px;
          box-shadow: 0 0 0 1px var(--gv-theme-neutral-color, #F5F5F5), 0 1px 3px var(--gv-theme-neutral-color-dark, #BFBFBF);
          z-index: 1000;
          display: none;
          max-width: var(--maw);
        }

        ::slotted(*) {
          display: inline-block;
        }

        .open .popover {
          display: block;
          animation: zoomIn 0.1s ease-in;
          opacity: 1;
        }

        .close .popover {
          animation: zoomOut 0.2s ease-out;
        }

        .triangle {
          width: 25px;
          height: 25px;
          z-index: 101;
          position: absolute;
          overflow: hidden;

        }

        .triangle:after {
          content: "";
          position: absolute;
          width: 12px;
          height: 12px;
          background: var(--bgc);
          transform: rotate(45deg);
          top: 19px;
          left: 6px;
          border: 1px solid var(--gv-popover--bdc, var(--gv-theme-neutral-color, #F5F5F5));
        }
      `,
    ];
  }

  constructor () {
    super();
    this.event = 'mouseover';
    this._closeHandler = this._close.bind(this);
  }

  _open (e) {
    if (this.event === 'click') {
      window.removeEventListener(this.event, this._closeHandler);
    }
    this._opened = true;
    if (this.event === 'click') {
      setTimeout(() => (window.addEventListener(this.event, this._closeHandler)));
    }
  }

  _close (e) {
    if (this._opened && (e.target !== this.firstElementChild || this.event !== 'click')) {
      const openElement = this.shadowRoot.querySelector('.open');
      openElement.classList.add('close');
      setTimeout(() => {
        openElement.classList.remove('close');
        this._opened = false;
      }, 200);
    }
  }

  render () {
    const classes = { open: this._opened };
    return html`
      <div class="${classMap(classes)}">
         <slot></slot>
         <div class="popover">
          <div class="triangle"></div>
          ${this.renderContent()}
        </div>
     </div>`;
  }

  renderContent () {
    return html`<slot name="popover"></slot>`;
  }

  firstUpdated (_changedProperties) {
    setTimeout(() => {
      this.firstElementChild.addEventListener(this.event, this._open.bind(this));
      if (this.event.startsWith('mouse')) {
        this.firstElementChild.addEventListener('mouseout', this._close.bind(this));
      }
    });
  }

  _getContentSize () {
    const popover = this.shadowRoot.querySelector('.popover');
    return {
      width: popover.offsetWidth,
      height: popover.offsetHeight,
    };
  };

  _getPositionPadding () {
    return 10;
  }

  _getCenterPosition () {
    return {
      x: this.target.x + this.target.width / 2 + window.scrollX,
      y: this.target.y + this.target.height / 2 + window.scrollY,
    };
  }

  _updatePosition () {
    const popover = this.shadowRoot.querySelector('.popover');
    if (popover) {
      this.target = this.firstElementChild.getBoundingClientRect();
      const below = this._hasSpaceBelow() || !this._hasSpaceAbove();
      const center = this._getCenterPosition();
      const padding = this._getPositionPadding();

      const halfSize = {
        width: this._getContentSize().width / 2,
        height: this._getContentSize().height / 2,
      };
      const triangle = this.shadowRoot.querySelector('.triangle');
      let triangleTop = -this._getTriangleWidth();
      let heightOffset = (this.target.height / 2) + padding;
      if (!below) {
        heightOffset = halfSize.height * 2;
        triangleTop = halfSize.height * 2 - this._getTriangleWidth();
        triangle.style.setProperty('transform', 'rotate(180deg)');
      }
      else {
        triangle.style.setProperty('transform', 'none');
      }

      const coords = {
        x: Math.max(0,
          this._getMaxX() - halfSize.width < center.x
            ? this._getMaxX() - halfSize.width * 2 - this._getPositionPadding() : center.x - halfSize.width),
        y: center.y + (below ? heightOffset : -heightOffset),
      };

      triangle.style.setProperty('left', `${center.x - this._getTriangleWidth() / 2 - coords.x}px`);
      triangle.style.setProperty('top', `${triangleTop}px`);

      popover.style.setProperty('left', `${coords.x}px`);
      popover.style.setProperty('top', `${coords.y}px`);
      popover.style.visibility = 'visible';
    }

  }

  _getMaxX () {
    return window.innerWidth - this._getPositionPadding();
  }

  _getMaxY () {
    return window.innerHeight - this._getPositionPadding();
  }

  _hasSpaceBelow () {
    const y = this.target.y
      + this.target.height
      + this._getContentSize().height
      + this._getPositionPadding();

    return y <= this._getMaxY();
  }

  _hasSpaceAbove () {
    const y = this.target.y
      - this._getContentSize().height
      - this._getPositionPadding();

    return y >= this._getPositionPadding();
  }

  updated () {
    if (this.firstElementChild) {
      this._updatePosition();
    }
  }

  _getTriangleWidth () {
    return 25;
  }
}

window.customElements.define('gv-popover', GvPopover);
