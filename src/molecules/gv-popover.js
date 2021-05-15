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
import { createPopper } from '@popperjs/core';

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
      invoker: { property: false },
      tooltip: { property: false },
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
          width: auto;
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

        #tooltip {
          --bgc: var(--gv-popover--bgc, var(--gv-theme-neutral-color-lighter, #fafafa));
          color: var(--gv-popover--c, var(--gv-theme-font-color-dark, #262626));
          background-color: var(--bgc);
          border-radius: 4px;
          z-index: 1000;
          box-sizing: content-box;

          padding: var(--gv-popover--p, 0.5rem);
          display: none;
        }

        #tooltip[data-show] {
          display: block;
        }

        #arrow,
        #arrow::before {
          position: absolute;
          width: 12px;
          height: 12px;
          z-index: 101;
          background: inherit;
        }

        #arrow {
          visibility: hidden;
        }

        #arrow::before {
          visibility: visible;
          content: '';
          transform: rotate(45deg);
        }

        #tooltip[data-popper-placement^='top'] > #arrow {
          bottom: -4px;
        }

        #tooltip[data-popper-placement^='bottom'] > #arrow {
          top: -4px;
        }

        #tooltip[data-popper-placement^='left'] > #arrow {
          right: -4px;
        }

        #tooltip[data-popper-placement^='right'] > #arrow {
          left: -4px;
        }
      `,
    ];
  }

  constructor() {
    super();
  }

  hide() {
    this.tooltip.removeAttribute('data-show');
    this.popperInstance.update();
  }

  show() {
    this.tooltip.setAttribute('data-show', '');

    // We need to tell Popper to update the tooltip position
    // after we show the tooltip, otherwise it will be incorrect
    this.popperInstance.update();

    if (this.delay > 0) {
      setTimeout(() => this.hide(), this.delay);
    }
  }

  firstUpdated() {
    this.invoker = this.shadowRoot.getElementById('invoker');
    this.tooltip = this.shadowRoot.getElementById('tooltip');

    this.popperInstance = createPopper(this.invoker, this.tooltip, {
      placement: this.position || 'auto',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 10],
          },
        },
      ],
    });

    const showEvents = this.event ? [this.event] : ['mouseenter', 'focus'];
    const hideEvents = this.event ? [] : ['mouseleave', 'blur'];

    showEvents.forEach((event) => {
      this.invoker.addEventListener(event, (e) => {
        this.isPopoverVisible = true;
        this.show();
      });
      this.tooltip.addEventListener(event, (e) => {
        this.isPopoverVisible = true;
        this.show();
      });
    });

    hideEvents.forEach((event) => {
      this.invoker.addEventListener(event, (e) => {
        this.isPopoverVisible = false;

        setTimeout(() => {
          if (!this.isPopoverVisible) {
            //  this.hide();
          }
        }, 50);
      });
    });
  }

  render() {
    return html`
      <div id="invoker" aria-describedby="tooltip">
        <slot></slot>
        <div id="tooltip" role="tooltip" class="popover">
          ${this.arrow ? html`<div id="arrow" data-popper-arrow></div>` : ''}
          <slot class="popover" name="popover"></slot>
        </div>
      </div>
    `;
  }
}

window.customElements.define('gv-popover', GvPopover);
