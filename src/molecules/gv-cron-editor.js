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
import '../atoms/gv-date-picker';
import '../organisms/gv-tabs';
import '../atoms/gv-input';
import '../atoms/gv-tag';
import { css, LitElement, html } from 'lit-element';
import { skeleton } from '../styles/skeleton';
import { InputElement } from '../mixins/input-element';
import { set } from 'object-path';
import { repeat } from 'lit-html/directives/repeat';
import { withResizeObserver } from '../mixins/with-resize-observer';
import { isValidCron } from '../lib/cron-expression';
import { dispatchCustomEvent } from '../lib/events';

/**
 * Cron editor component
 *
 * ## Details
 *
 * @fires gv-cron-editor:input - input events with the `value` on `detail`
 *
 * @attr {String} label - cron editor label
 * @attr {String} value - cron expression
 * @attr {String} mode - the opened mode (if have value, the export mode will be open)
 *
 * @attr {Boolean} [clipboard=false]- true if field has clipboard button
 * @attr {Boolean} [autofocus=false] - true to put the focus on the input
 * @attr {Boolean} [readonly=false] - true if field is readonly mode
 */
export class GvCronEditor extends withResizeObserver(InputElement(LitElement)) {
  static get properties() {
    return {
      ...super.properties,
      mode: { type: String },
      _value: { type: String, attribute: false },
      _currentDocumentationId: { type: String, attribute: false },
      _small: { type: Boolean },
      _truncateTabs: { type: Boolean },
    };
  }

  constructor() {
    super();
    this._value = '';
    this.readonly = false;
    this.autofocus = false;
    this.clipboard = false;
    this._modes = ['seconds', 'minutes', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'pro'];
    this._timeRange = [...Array(60).keys()];
    this._days = [
      { value: 'MON', label: 'Monday' },
      { value: 'TUE', label: 'Tuesday' },
      { value: 'WED', label: 'Wednesday' },
      { value: 'THU', label: 'Thursday' },
      { value: 'FRI', label: 'Friday' },
      { value: 'SAT', label: 'Saturday' },
      { value: 'SUN', label: 'Sunday' },
    ];
    this._months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    this.mode = 'pro';
    this._state = {
      seconds: {
        seconds: 0,
      },
      minutes: {
        minutes: 0,
        seconds: 0,
      },
      hourly: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
      daily: {
        days: 1,
        time: 0,
        weekdays: false,
      },
      weekly: {
        days: [],
        time: 0,
      },
      monthly: {
        day: 1,
        month: 1,
        time: 0,
      },
      yearly: {
        day: 1,
        month: 1,
        time: 0,
      },
      pro: {
        value: '',
      },
    };

    this._docs = [
      { id: 'second', label: 'Second' },
      { id: 'minute', label: 'Minute' },
      { id: 'hour', label: 'Hour' },
      { id: 'day-month', label: 'Day (month)' },
      { id: 'month', label: 'Month' },
      { id: 'day-week', label: 'Day (week)' },
    ];

    this._currentDocumentationId = this._docs[0].id;
    this._handleChange = this._onChange.bind(this);
    this._small = false;
  }

  onResize({ width }) {
    this._truncateTabs = width < 750;
    this._small = width < 449;
  }

  set value(value) {
    if (isValidCron(value, { seconds: true, alias: true })) {
      this._value = value;
      if (this._state.pro.value === '') {
        this._state.pro.value = value;
      }
    }
  }

  get value() {
    if (this.mode === 'pro') {
      return this._state.pro.value;
    }
    return this._value;
  }

  async firstUpdated() {
    // Give the browser a chance to paint
    // eslint-disable-next-line promise/param-names
    await new Promise((r) => setTimeout(r, 0));

    this.shadowRoot.querySelectorAll('gv-input, gv-date-picker, gv-checkbox, gv-select').forEach((element) => {
      element.addEventListener(`${element.tagName.toLowerCase()}:input`, this._handleChange);
    });
  }

  _onOpenDocumentation(docId) {
    this._currentDocumentationId = docId;
  }

  _onChange({ target, detail }) {
    if (target.id === 'cron-input' && this.mode !== 'pro') {
      this.mode = 'pro';
    }
    if (target.valid) {
      if (target.name == null) {
        throw new Error('Field target must have a name to update the state');
      }
      const tagName = target.tagName.toLowerCase();
      let value = detail;
      if (tagName === 'gv-date-picker') {
        value = new Date(detail);
      } else if (target.type === 'number') {
        value = Number(detail).valueOf();
      }
      set(this._state, target.name, value);
      this.generate();
      if (target.classList.contains('request-update')) {
        this.requestUpdate();
      }
    }
  }

  _onChangeTab(event) {
    event.preventDefault();
    event.stopPropagation();
    const {
      detail: { to },
    } = event;
    this.mode = to;
    this.generate();
    if (this.mode === 'pro') {
      this.shadowRoot.querySelector('#cron-input').focus();
    }
  }

  _getTimeExpression(date) {
    if (date) {
      return `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()}`;
    }
    return '* * *';
  }

  generate() {
    let tmpValue = '';
    switch (this.mode) {
      case 'seconds':
        if (this._state.seconds.seconds) {
          tmpValue = `*/${this._state.seconds.seconds} * * * * *`;
        } else {
          tmpValue = `* * * * * *`;
        }
        break;
      case 'minutes':
        if (this._state.minutes.minutes) {
          tmpValue = `${this._state.minutes.seconds} */${this._state.minutes.minutes} * * * *`;
        } else {
          tmpValue = `${this._state.minutes.seconds} * * * * *`;
        }
        break;
      case 'hourly':
        if (this._state.hourly.hours) {
          tmpValue = `${this._state.hourly.seconds} ${this._state.hourly.minutes} */${this._state.hourly.hours} * * *`;
        } else {
          tmpValue = `${this._state.minutes.seconds} ${this._state.hourly.minutes} * * * *`;
        }
        break;
      case 'daily':
        if (this._state.daily.weekdays === false) {
          tmpValue = `${this._getTimeExpression(this._state.daily.time)} ${this._state.daily.days} * *`;
        } else {
          tmpValue = `${this._getTimeExpression(this._state.daily.time)} * * MON-FRI`;
        }
        break;
      case 'weekly':
        if (this._state.weekly.days.length === 0) {
          tmpValue = `${this._getTimeExpression(this._state.weekly.time)} * * *`;
        } else {
          tmpValue = `${this._getTimeExpression(this._state.weekly.time)} * * ${this._state.weekly.days.join(',')}`;
        }
        break;
      case 'monthly':
        tmpValue = `${this._getTimeExpression(this._state.monthly.time)} ${this._state.monthly.day} ${this._state.monthly.month} *`;
        break;
      case 'yearly':
        tmpValue = `${this._getTimeExpression(this._state.yearly.time)} ${this._state.yearly.day} */${
          this._months.indexOf(this._state.yearly.month) + 1
        } *`;
        break;
      case 'pro':
        tmpValue = this._state.pro.value;
        break;
      default:
        throw new Error('Invalid cron active tab selection');
    }

    this.updateState(tmpValue);
    if (this.valid) {
      this._value = tmpValue;
      this.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      dispatchCustomEvent(this, 'input', this.value);
    }
  }

  updateState(value) {
    super.updateState(value);
    if (this.valid) {
      if (isValidCron(value, { seconds: true, alias: true })) {
        this.setValidity();
      } else {
        this.setValidity(true, 'field is not valid cron expression');
      }
    }
  }

  renderLabel() {
    if (this.label) {
      return html`<label for=${this.id} title="${this.label}">${this.label}</label>`;
    }
    return '';
  }

  render() {
    return html`<div>
      ${this.renderLabel()}
      <div class="box">
        <gv-tabs
          .value="${this.mode}"
          .options="${this._modes}"
          .disabled="${this.disabled}"
          ?small="${this._small}"
          ?truncate="${this._truncateTabs}"
          @gv-tabs:change="${this._onChangeTab.bind(this)}"
        >
          <div slot="title" class="generated-expression">
            <gv-input
              name="pro.value"
              .autofocus="${this.autofocus}"
              .value="${this.value}"
              id="cron-input"
              placeholder="* */30 * * * * (Every 30 min)"
            ></gv-input>
          </div>

          <div slot="content" id="seconds" class="tab-content">
            <span>Every</span>
            <gv-input small type="number" min="0" name="seconds.seconds" .value="${this._state.seconds.seconds}"></gv-input>
            <span>second(s)</span>
          </div>

          <div slot="content" id="minutes" class="tab-content">
            <span>Every</span>
            <gv-input small type="number" min="0" name="minutes.minutes" .value="${this._state.minutes.minutes}"></gv-input>
            <span>minute(s) on second</span>
            <gv-input small type="number" min="0" max="59" name="minutes.seconds" .value="${this._state.minutes.seconds}"></gv-input>
          </div>

          <div slot="content" id="hourly" class="tab-content">
            <span>Every</span>
            <gv-input small type="number" min="0" name="hourly.hours" .value="${this._state.hourly.hours}"></gv-input>
            <span>hour(s) on minute</span>
            <gv-input small type="number" min="0" max="59" name="hourly.minutes" .value="${this._state.hourly.minutes}"></gv-input>
            <span>and second</span>
            <gv-input small type="number" min="0" max="59" name="hourly.seconds" .value="${this._state.hourly.seconds}"></gv-input>
          </div>

          <div slot="content" id="daily" class="tab-content">
            <span>Every</span>
            <gv-input
              small
              type="number"
              min="1"
              max="31"
              name="daily.days"
              ?disabled="${this._state.daily.weekdays}"
              .value="${this._state.daily.days}"
            ></gv-input>
            <span class="line">
              day(s)
              <gv-checkbox
                class="request-update"
                label="of week"
                name="daily.weekdays"
                ?checked="${this._state.daily.weekdays}"
              ></gv-checkbox>
              at</span
            >
            <gv-date-picker small time strict name="daily.time" .value="${this._state.daily.time}"></gv-date-picker>
          </div>

          <div slot="content" id="weekly" class="tab-content tab-content_weekly">
            <span>Every</span>
            <gv-select small multiple name="weekly.days" .options="${this._days}" .value="${this._state.weekly.days}"></gv-select>
            <span>day(s) at</span>
            <gv-date-picker small time strict name="weekly.time" .value="${this._state.weekly.time}"></gv-date-picker>
          </div>

          <div slot="content" id="monthly" class="tab-content">
            <span>On</span>
            <gv-input
              small
              type="number"
              min="1"
              max="31"
              name="monthly.day"
              class="request-update"
              .value="${this._state.monthly.day}"
            ></gv-input>
            <span><sup>${this._getDaySuffix(this._state.monthly.day)}</sup> day of every</span>
            <gv-input small type="number" min="1" max="12" name="monthly.month" .value="${this._state.monthly.month}"></gv-input>
            <span>month(s) at</span>
            <gv-date-picker small time strict name="monthly.time" .value="${this._state.monthly.time}"></gv-date-picker>
          </div>

          <div slot="content" id="yearly" class="tab-content">
            <span>Every</span>
            <gv-select small name="yearly.month" .options="${this._months}" .value="${this._state.yearly.month}"></gv-select>
            <span>on the</span>
            <gv-input
              small
              type="number"
              min="1"
              max="31"
              name="yearly.day"
              class="request-update"
              .value="${this._state.yearly.day}"
            ></gv-input>
            <span><sup>${this._getDaySuffix(this._state.yearly.day)}</sup> day</span>
            <gv-date-picker small time strict name="yearly.time" .value="${this._state.yearly.time}"></gv-date-picker>
          </div>

          <div slot="content" id="pro" class="tab-content tab-content_pro">
            <div>
              ${repeat(
                this._docs,
                (doc) => doc.id,
                (doc) => {
                  const isCurrent = doc.id === this._currentDocumentationId;
                  return html`<gv-tag
                    @gv-tag:click="${this._onOpenDocumentation.bind(this, doc.id)}"
                    ?clickable="${!isCurrent}"
                    ?major="${isCurrent}"
                    ?minor="${!isCurrent}"
                    >${doc.label}</gv-tag
                  >`;
                },
              )}
            </div>
            <ul>
              <li>
                <small>Allowed characters: <code>${this.allowedChar}</code></small>
              </li>
              <li>
                <small>Allowed values: <code>${this.allowedValues}</code></small>
              </li>
            </ul>
            <ul class="help">
              <li>
                <small><code>*</code>: for each unit (0, 1, 2, 3...)</small>
              </li>
              <li>
                <small><code>5,8</code>: units 5 and 8</small>
              </li>
              <li>
                <small><code>2-5</code>: units from 2 to 5 (2, 3, 4, 5)</small>
              </li>
              <li>
                <small><code>*/3</code>: every 3 units (0, 3, 6, 9...)</small>
              </li>
              <li>
                <small><code>10-20/3</code>: every 3 units, between the tenth and the twentieth (10, 13, 16, 19)</small>
              </li>
            </ul>
          </div>
        </gv-tabs>
      </div>
    </div>`;
  }

  get allowedValues() {
    if (this.mode === 'pro') {
      switch (this._currentDocumentationId) {
        case 'hour':
          return '0-23';
        case 'day-month':
          return '1-31';
        case 'month':
          return '1-12 or JAN-DEC';
        case 'day-week':
          return '1-7 or SUN-SAT';
        default:
          return '0-59';
      }
    }
    return '';
  }

  get allowedChar() {
    if (this.mode === 'pro') {
      return ',-*/';
    }
    return '';
  }

  _getDaySuffix(day = 1) {
    if (day) {
      if (day.toString().endsWith('1')) {
        return 'st';
      } else if (day.toString().endsWith('2')) {
        return 'nd';
      } else if (day.toString().endsWith('3')) {
        return 'rd';
      }
      return 'th';
    }
    return '';
  }

  static get styles() {
    return [
      skeleton,
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          display: block;
          margin: 0.2rem;
        }

        :host([invalid]) .box {
          border-left-color: var(--gv-theme-color-error-dark, #d32f2f);
          border-left-width: 3px;
        }

        .box {
          border: 1px solid var(--gv-theme-neutral-color-dark, #bfbfbf);
          border-radius: 4px;
        }

        .generated-expression {
          display: flex;
          align-items: center;
          flex: 1;
        }

        .generated-expression > span,
        .generated-expression > code {
          margin: 0.4rem;
        }

        .generated-expression gv-input,
        .generated-expression code {
          --input-small--fz: 16px;
          font-size: 16px;
        }

        .generated-expression gv-input {
          --gv-input--bdc: transparent;
          margin: 0;
          min-width: 190px;
        }

        .tab-content {
          display: flex;
          align-items: center;
          background-color: var(--gv-theme-neutral-color, #f5f5f5);
          font-style: italic;
          font-size: var(--gv-theme-font-size-s, 12px);
          padding: 0.2rem;
        }

        .tab-content > * {
          margin: 0.2rem;
        }

        .tab-content gv-input[type='number'] {
          width: 50px;
        }

        .tab-content_weekly gv-select {
          width: auto;
        }

        .tab-content_pro code {
          font-size: 14px;
          font-weight: bold;
          font-style: normal;
        }

        .tab-content_pro {
          display: flex;
          flex-direction: column;
          align-items: normal;
          --gv-icon--s: 18px;
          padding: 0.2rem;
        }

        .tab-content_pro > * {
          margin: 0.2rem;
        }

        .tab-content_pro small,
        .tab-content_pro gv-icon {
          margin: 0 0.2rem;
        }

        gv-tabs {
          --gv-tabs-options--m: auto 0.2rem auto 0;
        }

        gv-tabs[small] {
          --gv-tabs-options--m: auto 0;
        }

        gv-tabs[small] .tab-content {
          padding: 0;
        }

        .line {
          display: flex;
          align-items: center;
          margin: 0;
        }

        .line > * {
          margin: 0 0.3rem;
        }

        gv-checkbox {
          text-decoration: line-through;
          font-weight: normal;
        }

        gv-checkbox[checked] {
          text-decoration: none;
        }

        sup {
          display: inline-block;
          width: 16px;
          font-size: var(--gv-theme-font-size-s, 12px);
        }

        ul {
          list-style: none;
          margin: 0.5rem 1rem;
          padding: 0;
        }

        ul.help {
          padding-left: 0.2rem;
          margin-left: 0.4rem;
          border-left: 2px dotted var(--gv-theme-neutral-color-dark, #bfbfbf);
        }

        small {
          font-size: var(--gv-theme-font-size-s, 12px);
        }
      `,
    ];
  }
}

window.customElements.define('gv-cron-editor', GvCronEditor);
