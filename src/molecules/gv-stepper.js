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
import { repeat } from 'lit-html/directives/repeat';
import { classMap } from 'lit-html/directives/class-map';
import { link } from '../styles';
import { dispatchCustomEvent } from '../lib/events';
import { i18n } from '../lib/i18n';

/**
 * Stepper component
 *
 * @fires gv-stepper:change - when step change
 *
 * @attr {Number} current - The current selected step
 * @attr {Array} steps - Array of step {title: string, description: string, validate: boolean}
 *
 * @cssprop {String} --gv-stepper-validate--bgc - set validate background color.
 * @cssprop {String} --gv-stepper-passed--bdc - set passed border color.
 * @cssprop {String} --gv-stepper--bgc - set background color.
 * @cssprop {String} --gv-stepper--bdc - set border color.
 * @cssprop {String} --gv-stepper--c - set color for text.
 * @cssprop {String} --gv-stepper-passed--c - set passed color for text.
 */
export class GvStepper extends LitElement {

  static get properties () {
    return {
      current: { type: Number, reflect: true },
      steps: { type: Array },
      _error: { type: Boolean },
    };
  }

  static get styles () {
    return [
      link,
      // language=CSS
      css`
          :host {
              box-sizing: border-box;
              --passed--bgc: var(--gv-stepper-validate--bgc, #009B5B);
              --passed--bdc: var(--gv-stepper-passed--bdc, #D5FDCB);
              --bdc: var(--gv-stepper--bdc, #BFBFBF);
              --bgc: var(--gv-stepper--bgc, #BFBFBF);
              --passed--c: var(--gv-stepper-passed--c, #595959);
              --c: var(--gv-stepper--c, #BFBFBF);
          }

          .stepper {
              display: flex;
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
          }

          .round {
              width: 6px;
              height: 6px;
              border-radius: 50%;
              margin: 2px 7px 2px 7px;
          }

          .border {
              margin-top: 4px;
              width: 100px;
              height: 2px;
              clear: both;
          }

          .round {
              background-color: var(--bgc);
          }

          .border {
              background-color: var(--bdc);
              margin-bottom: 5px;
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
              font-size: 16px;
              color: var(--c);
          }

          .passed .content {
              color: var(--passed--c);
          }

          .title {
              font-weight: bold;
          }

          .description {
              font-size: 14px;
          }

          .error {
              text-align: center;
          }

          .circle {
              border: 1px solid var(--passed--bgc);
              margin-top: -12px;
              border-radius: 50%;
          }

          gv-icon {
              --gv-icon--c: var(--passed--bgc);
              --gv-icon--w: 32px;
              --gv-icon--h: 32px;
          }
      `,
    ];
  }

  constructor () {
    super();
    this.current = 0;
    this._steps = [];
    this._error = false;
    this._empty = true;
  }

  _onClick (index) {
    this.current = index + 1;
    dispatchCustomEvent(this, 'change', { current: this.current });
  }

  async performUpdate () {
    await Promise.all([this.steps, this.current])
      .then(([steps, current]) => {
        this._steps = steps.map((step, _index) => {
          step.passed = step.validate === true || (current > 0 && _index + 1 <= current);
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

  _getIcon (step) {
    if (step.validate) {
      return html`<div class="circle"><gv-icon shape="code:check"></gv-icon></div>`;
    }
    return html`<div class="round"></div>`;
  }

  _getStep (step, index) {
    const classes = {
      passed: step.passed,
      validate: step.validate,
      step: true,
      first: index === 0,
      end: index === this._steps.length - 1,
    };
    return html`
      <div class="${classMap(classes)}" @click="${this._onClick.bind(this, index)}">
        <div class="graph"> 
             <div class="border"></div>
             ${this._getIcon(step)}
             <div class="border"></div>
        </div>
        <div class="content link">
             <div class="title">${step.title}</div>
             <div class="description">${step.description}</div>
        </div>
      </div>
    `;
  }

  render () {
    if (this._error) {
      return html`<div class="error">${i18n('gv-stepper.error')}</div>`;
    }
    if (this._empty) {
      return html`<div></div>`;
    }
    return html`<div class="stepper">
      ${repeat(this._steps, (step) => step, (step, index) =>
      this._getStep(step, index)
    )}
      </div>
    `;
  }

}

window.customElements.define('gv-stepper', GvStepper);
