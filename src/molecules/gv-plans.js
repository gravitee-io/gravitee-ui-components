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
import { css, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events';
import { getCssVar, hexToRGB } from '../lib/style';
import { html } from 'lit-html';
import { i18n } from '../lib/i18n';
import { link } from '../styles/link';
import { repeat } from 'lit-html/directives/repeat';
import { skeleton } from '../styles/skeleton';
import { empty } from '../styles/empty';
import { styleMap } from 'lit-html/directives/style-map';
import './../atoms/gv-icon';

/**
 * Plans
 *
 * ## Details
 * * has @theme facet
 *
 * @fires input - Native input event when plan change
 * @fires gv-plans:redirect - Event when user click to redirect link when plans are empty
 *
 * @attr {Array} plans - Plans list
 * @attr {Number} current - The current plan index
 * @attr {String} value - The current plan id
 * @attr {Boolean} skeleton - enable skeleton screen UI pattern (loading hint)
 *
 * @cssprop {Color} [--gv-plans--bgc=var(--gv-theme-color, #5a7684)] - Background color
 * @cssprop {Color} [--gv-plans-font--c=var(--gv-theme-font-color-light, #ffffff)] - Font color
 * @cssprop {Color} [--gv-plans-characteristic--bgc=var(--gv-theme-color-light, #86c3d0)] - Characteristic background color
 * @cssprop {Color} [--gv-plans-characteristics--bdc=var(--gv-theme-neutral-color, #f5f5f5)] - Characteristics border color
 * @cssprop {Length} [--gv-plans-icon--s=24px] - Height and icon width
 */
export class GvPlans extends LitElement {
  static get properties() {
    return {
      /**
       * This List of Plan
       * @type Object https://github.com/gravitee-io/gravitee-clients-sdk/blob/master/model/plan.ts
       * @attr
       * @required
       */
      plans: { type: Array },
      current: { type: Number },
      value: { type: String, reflect: true },
      skeleton: { type: Boolean },
      size: { type: Number },
      _empty: { type: Boolean },
      _plans: { type: Array },
    };
  }

  static get styles() {
    return [
      empty,
      link,
      // language=css
      css`
        :host {
          display: block;
          box-sizing: border-box;
          margin: 0.2rem;
          --bgc: var(--gv-plans--bgc, var(--gv-theme-color, #5a7684));
          --fc: var(--gv-plans-font--c, var(--gv-theme-font-color-light, #ffffff));
          --gv-icon--c: var(--bgc);
        }

        .plans {
          display: flex;
          list-style-type: none;
          border-radius: 2px;
          padding: 0;
          margin: 0;
          height: 80px;
        }

        .plan {
          flex: 1;
          padding: 16px;
          line-height: 24px;
          cursor: pointer;
        }

        .plan.active {
          background-color: var(--bgc);
          color: var(--fc);
          transition: all 0.2s ease-in;
        }

        .name {
          font-size: var(--gv-theme-font-size-l, 16px);
          font-weight: bold;
        }

        .description {
          font-size: var(--gv-theme-font-size-s, 12px);
          --lh: var(--gv-theme-font-size-s, 12px);
          line-height: var(--lh);
          --max-lines: 2;
          max-height: calc(var(--lh) * var(--max-lines));
          overflow: hidden;
        }

        .selectors {
          display: flex;
        }

        .selector {
          position: relative;
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .active .triangle {
          width: 0;
          height: 0;
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          border-top: 9px solid var(--bgc);
        }

        .characteristics {
          margin-top: 34px;
          border: 1px solid var(--gv-plans-characteristics--bdc, var(--gv-theme-neutral-color, #f5f5f5));
          border-radius: 4px;
          display: flex;
          padding: 34px;
          text-align: center;
          justify-content: center;
          user-select: none;
        }

        .characteristic {
          font-size: var(--gv-theme-font-size-m, 14px);
          line-height: 22px;
          font-weight: bold;
          flex: 1;
          margin: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .circle {
          background-color: var(--gv-plans-characteristic--bgc, var(--gv-theme-color-light, #86c3d0));
          border-radius: 50%;
          width: 32px;
          height: 32px;
          margin: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        gv-icon {
          --gv-icon--s: var(--gv-plans-icon--s, 24px);
        }

        .skeleton {
          min-height: 400px;
          margin: 0 0.2rem;
          opacity: 0.5;
        }

        .link {
          text-decoration: underline;
        }

        .pagination {
          display: flex;
          height: 0;
        }
      `,
      skeleton,
    ];
  }

  constructor() {
    super();
    this.current = 1;
    this.size = 4;
    this._plans = [];
    this._empty = true;
  }

  get _characteristics() {
    if (this._plans.length >= this.current) {
      const plan = this._plans[this.current - 1];
      if (plan.characteristics && plan.characteristics.length > 0) {
        return plan.characteristics;
      }

      let characteristics = [];

      if (plan.validation) {
        switch (plan.validation.toUpperCase()) {
          case 'AUTO':
            characteristics.push(i18n('gv-plans.validation.auto'));
            break;
          case 'MANUAL':
            characteristics.push(i18n('gv-plans.validation.manual'));
            break;
        }
      }

      if (plan.security) {
        switch (plan.security.toUpperCase()) {
          case 'API_KEY':
            characteristics.push(i18n('gv-plans.security.apiKey'));
            break;
          case 'JWT':
            characteristics.push(i18n('gv-plans.security.jwt'));
            break;
          case 'OAUTH2':
            characteristics.push(i18n('gv-plans.security.oauth2'));
            break;
          case 'KEY_LESS':
            characteristics = [];
            characteristics.push(i18n('gv-plans.security.keyLess'));
            break;
        }
      }

      if (characteristics.length === 0) {
        characteristics.push(i18n('gv-plans.characteristics.empty'));
      }

      return characteristics;
    }
    return [];
  }

  set plans(plans) {
    this.skeleton = true;
    Promise.resolve(plans)
      .then((plans) => {
        if (plans) {
          this._empty = plans.length === 0;
          this._plans = plans;
          if (!this._empty) {
            const activePlan = this._plans.find((p) => p.active);
            if (activePlan == null) {
              this._plans[0].active = true;
              this.value = this._plans[0].id;
            } else {
              this.value = activePlan.id;
            }
          }
          this.skeleton = false;
        }
      })
      .catch((e) => {
        this._error = true;
        this._plans = [];
        this.skeleton = false;
      });
  }

  to(plan) {
    if (plan) {
      this.value = plan.id;
      this._plans = this._plans.map((p, index) => {
        if (JSON.stringify(p) === JSON.stringify(plan)) {
          p.active = true;
          this.current = index + 1;
        } else {
          p.active = false;
        }
        return p;
      });
      this.dispatchEvent(new Event('input'), { bubbles: true, cancelable: true });
    }
  }

  _getPlanTitle(plan) {
    let title = plan.name;
    if (plan.description) {
      title += `: ${plan.description}`;
    }
    return title;
  }

  _onRedirect() {
    dispatchCustomEvent(this, 'redirect');
  }

  get hasPagination() {
    return this.size < this._plans.length;
  }

  get hasLeft() {
    return this.hasPagination && this.current > 1;
  }

  get hasRight() {
    return this.hasPagination && this.current < this._plans.length;
  }

  get plans() {
    if (this.hasPagination) {
      const left = this._plans.slice(0, this.current);
      const right = this._plans.slice(this.current);
      const plans = [left.pop()];

      new Array(this.size - 1).fill('').forEach((e, i) => {
        if ((i % 2 === 0 && left.length > 0) || right.length === 0) {
          const a = left.pop();
          plans.unshift(a);
        } else if (right.length > 0) {
          const b = right.shift();
          plans.push(b);
        }
      });
      return plans;
    }
    return this._plans;
  }

  _renderHeader(plans) {
    return plans.map((plan, index) => {
      return html`<li
        @click="${this.to.bind(this, plan)}"
        title="${this._getPlanTitle(plan)}"
        class="${classMap({
          plan: true,
          active: plan.active,
        })}"
      >
        <div class="name">${plan.name}</div>
        <div class="description">${plan.description}</div>
      </li>`;
    });
  }

  _renderTriangles(plans) {
    return plans.map((plan, index) => {
      return html`<div
        class="${classMap({
          selector: true,
          active: plan.active,
        })}"
      >
        <div class="triangle"></div>
      </div>`;
    });
  }

  _renderPagination() {
    if (this.hasPagination) {
      return html` <div class="pagination">
        ${!this.hasLeft ? '' : html`<gv-icon @click="${this.toLeft}" shape="navigation:angle-left" class="link"></gv-icon>`}
        <div style="flex: 1;"></div>
        ${!this.hasRight ? '' : html`<gv-icon @click="${this.toRight}" shape="navigation:angle-right" class="link"></gv-icon>`}
      </div>`;
    }
    return '';
  }

  render() {
    const bgc = getCssVar(this, '--gv-plans--bgc', '#5A7684');
    const { r, g, b } = hexToRGB(bgc);
    const style = {
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.1)`,
      color: `rgba(${r}, ${g}, ${b}, 0.5)`,
    };

    if (!this.skeleton) {
      if (this._error) {
        return html`<div class="error">
          <p>${i18n('gv-plans.error')}</p>
        </div>`;
      } else if (this._empty) {
        return html` <div class="empty">
          <p>${i18n('gv-plans.empty.title')}</p>
          <a class="link" @click="${this._onRedirect}">${i18n('gv-plans.empty.redirect')}</a>
        </div>`;
      }
    }

    const classes = { skeleton: this.skeleton };
    const currentPlans = this.plans;
    return html`<div class="${classMap(classes)}">
      <ul class="plans" style="${styleMap(style)}">
        ${this._renderHeader(currentPlans)}
      </ul>
      <div class="selectors">${this._renderTriangles(currentPlans)}</div>
      ${this._renderPagination()}
      ${!this.skeleton
        ? html`<div class="characteristics">
            ${repeat(
              this._characteristics,
              (characteristic) => characteristic,
              (characteristic, index) =>
                html`<div class="characteristic">
                  <div class="circle"><gv-icon shape="home:flower#2"></gv-icon></div>
                  <div>${characteristic}</div>
                </div>`,
            )}
          </div>`
        : ''}
    </div> `;
  }

  toLeft() {
    this.to(this._plans[this.current - 2]);
  }

  toRight() {
    this.to(this._plans[this.current]);
  }
}

window.customElements.define('gv-plans', GvPlans);
