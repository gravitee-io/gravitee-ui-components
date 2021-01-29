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
import { css, html, LitElement } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
import { classMap } from 'lit-html/directives/class-map';
import { link } from '../styles/link';
import { dispatchCustomEvent } from '../lib/events';
import { i18n } from '../lib/i18n';

/**
 * Stepper component
 *
 * ## Details
 * * has @theme facet
 *
 * @fires gv-stepper:change - when step change
 *
 * @attr {Length} current - The current selected step
 * @attr {Array} steps - Array of step {title: string, description: string, valid: boolean, invalid: boolean}
 * @attr {Boolean} [disabled=false] - Indicate if stepper is disabled
 *
 * @cssprop {Color} [--gv-stepper-valid--bgc=var(--gv-theme-color, #5a7684)] - Valid background color
 * @cssprop {Color} [--gv-stepper-passed--bdc=var(--gv-theme-color-light, #86c3d0)] - Passed border color
 * @cssprop {Color} [--gv-stepper--bgc=var(--gv-theme-neutral-color-dark, #bfbfbf)] - Background color
 * @cssprop {Color} [--gv-stepper--bdc=var(--gv-theme-neutral-color-dark, #bfbfbf)] - Border color
 * @cssprop {Color} [--gv-stepper--c=var(--gv-theme-neutral-color-dark, #bfbfbf)] - Color
 * @cssprop {Color} [--gv-stepper-passed--c=#595959] - Passed color
 * @cssprop {Length} [--gv-stepper-icon--s=32px] - Height and icon width
 */
export class GvStepper extends LitElement {
  static get properties() {
    return {
      current: { type: Number, reflect: true },
      steps: { type: Array },
      disabled: { type: Boolean },
      _error: { type: Boolean },
    };
  }

  static get styles() {
    return [
      link,
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          --passed--bgc: var(--gv-stepper-valid--bgc, var(--gv-theme-color, #5a7684));
          --passed--bdc: var(--gv-stepper-passed--bdc, var(--gv-theme-color-light, #86c3d0));
          --bdc: var(--gv-stepper--bdc, var(--gv-theme-neutral-color-dark, #bfbfbf));
          --bgc: var(--gv-stepper--bgc, var(--gv-theme-neutral-color-dark, #bfbfbf));
          --passed--c: var(--gv-stepper-passed--c, #595959);
          --c: var(--gv-stepper--c, var(--gv-theme-neutral-color-dark, #bfbfbf));
        }

        .stepper {
          display: flex;
          justify-content: center;
        }

        .disabled .step {
          cursor: not-allowed;
        }

        .step {
          display: flex;
          flex-direction: column;
          cursor: pointer;
        }

        .graph {
          display: flex;
          flex-direction: row;
          min-height: 22px;
          min-width: 250px;
        }

        .round {
          min-width: 6px;
          width: 6px;
          min-height: 6px;
          height: 6px;
          border-radius: 50%;
          margin: 2px 7px 2px 7px;
        }

        .border {
          margin-top: 4px;
          min-width: 100px;
          width: 100%;
          height: 2px;
          clear: both;
        }

        .round {
          background-color: var(--bgc);
          transition: all 0.2s ease-in;
        }

        .border {
          background-color: var(--bdc);
          margin-bottom: 5px;
          transition: all 0.2s ease-in;
        }

        .passed .round {
          background-color: var(--passed--bgc);
        }

        .passed .border {
          background-color: var(--passed--bdc);
        }

        .passed .round {
          height: 10px;
          width: 10px;
          min-height: 10px;
          min-width: 10px;
          margin: 0 5px 0 5px;
        }

        .first .border:first-of-type {
          visibility: hidden;
        }

        .end .border:last-of-type {
          visibility: hidden;
        }

        .content {
          display: flex;
          flex-direction: column;
          align-items: center;

          padding: 5px;
          line-height: 24px;
          font-size: var(--gv-theme-font-size-l, 16px);
          color: var(--c);
        }

        .passed .content {
          color: var(--passed--c);
        }

        .title {
          font-weight: bold;
        }

        .description {
          font-size: var(--gv-theme-font-size-m, 14px);
        }

        .error {
          text-align: center;
        }

        .circle {
          border: 1px solid var(--passed--bgc);
          margin-top: -12px;
          border-radius: 50%;
          animation: validate 0.2s ease-in;
        }

        .invalid.circle {
        }

        gv-icon {
          --gv-icon--c: var(--passed--bgc);
          --gv-icon--s: var(--gv-stepper-icon--s, 32px);
        }

        .invalid gv-icon {
          --gv-icon--c: var(--gv-theme-color-danger);
        }

        @keyframes validate {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `,
    ];
  }

  constructor() {
    super();
    this.current = 0;
    this._steps = [];
    this._error = false;
    this._empty = true;
  }

  _onClick(index) {
    if (this.disabled !== true) {
      this.current = index + 1;
      dispatchCustomEvent(this, 'change', { current: this.current });
    }
  }

  async performUpdate() {
    await Promise.all([this.steps, this.current])
      .then(([steps, current]) => {
        this._steps = steps.map((step, _index) => {
          step.passed = step.valid === true || (current > 0 && _index + 1 <= current);
          return step;
        });
        this._error = false;
        this._empty = !(this._steps && this._steps.length > 0);
      })
      .catch(() => {
        this._error = true;
        this._empty = false;
      });
    super.performUpdate();
  }

  _getIcon(step) {
    if (step.invalid) {
      return html`<div class="circle invalid"><gv-icon shape="code:error"></gv-icon></div>`;
    }
    if (step.valid) {
      return html`<div class="circle"><gv-icon shape="code:check"></gv-icon></div>`;
    }
    return html`<div class="round"></div>`;
  }

  _getStep(step, index) {
    const classes = {
      passed: step.passed,
      valid: step.valid,
      step: true,
      first: index === 0,
      end: index === this._steps.length - 1,
    };

    const contentClasses = {
      content: true,
      link: !this.disabled,
    };
    return html`
      <div class="${classMap(classes)}" @click="${this._onClick.bind(this, index)}" title="${step.title}">
        <div class="graph">
          <div class="border"></div>
          ${this._getIcon(step)}
          <div class="border"></div>
        </div>
        <div class="${classMap(contentClasses)}">
          <div class="title">${step.title}</div>
          <div class="description">${step.description}</div>
        </div>
      </div>
    `;
  }

  render() {
    if (this._error) {
      return html`<div class="error">${i18n('gv-stepper.error')}</div>`;
    }
    if (this._empty) {
      return html`<div></div>`;
    }
    const classes = { stepper: true, disabled: this.disabled };
    return html`<div class="${classMap(classes)}">
      ${repeat(
        this._steps,
        (step) => step,
        (step, index) => this._getStep(step, index),
      )}
    </div> `;
  }
}

window.customElements.define('gv-stepper', GvStepper);
