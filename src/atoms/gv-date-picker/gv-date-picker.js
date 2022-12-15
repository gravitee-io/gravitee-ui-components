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
import '../gv-date-picker-calendar';
import enUS from 'date-fns/locale/en-US';
import { format, getMonth, getYear, parse } from 'date-fns';
import { classMap } from 'lit/directives/class-map.js';
import { css, LitElement, html } from 'lit';
import { getLanguage, i18n } from '../../lib/i18n';

import { isInvalid } from '../../lib/date';
import { until } from 'lit/directives/until.js';
import { dispatchCustomEvent } from '../../lib/events';

const locales = { en: enUS };

/**
 * Date Picker
 *
 * ## Details
 * * has @theme facet
 *
 * @attr {Number|Array} value - if range picker, value is an array of timestamp else is a timestamp
 * @attr {Boolean} range - if has range picker
 * @attr {Boolean} time - if has time picker
 * @attr {String} name - name of the input
 * @attr {Boolean} strict - in completion of time if just have time picker
 * @attr {Number} min - min timestamp
 * @attr {Number} max - max timestamp
 * @attr {Number} distanceFromNow - The distance timestamp relative to the current date. If configured, the min / max will be updated every minute.
 * @attr {String} format - date format
 * @attr {Boolean} valid - if value is valid
 * @attr {Boolean} invalid - if value is invalid
 * @attr {Boolean} small - for a small input
 *
 * @cssprop {Color} [--gv-date-picker-hover--bgc=var(--gv-theme-color-light, #86c3d0)] - Hover background color
 * @cssprop {Color} [--gv-date-picker-hover--c=var(--gv-theme-font-color-dark, #262626)] - Hover color
 * @cssprop {Color} [--gv-date-picker-selected--bgc=var(--gv-theme-color, #5a7684)] - Selected background color
 * @cssprop {Color} [--gv-date-picker-selected--c=var(--gv-theme-font-color-light, #ffffff)] - Selected color
 */
export class GvDatePicker extends LitElement {
  static get properties() {
    return {
      range: { type: Boolean },
      label: { type: String },
      name: { type: String },
      time: { type: Boolean },
      strict: { type: Boolean },
      small: { type: Boolean },
      value: { type: Array, reflect: true },
      min: { type: Number },
      max: { type: Number },
      distanceFromNow: { type: Number },
      disabledDates: { type: Array },
      format: { type: String },
      invalid: { type: Boolean, reflect: true },
      valid: { type: Boolean, reflect: true },
      _hoveredDate: { type: String, attribute: false },
      _open: { type: Boolean, attribute: false },
      _month: { type: String, attribute: false },
      _year: { type: String, attribute: false },
      _monthPlus: { type: String, attribute: false },
      _yearPlus: { type: Number, attribute: false },
      _mode: { type: String, attribute: false },
      _from: { type: Number, attribute: false },
      _to: { type: Number, attribute: false },
      _min: { type: Number, attribute: false },
      _max: { type: Number, attribute: false },
      _distance: { type: Number, attribute: false },
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
          --gv-input-icon--bgc: transparent;
          --gv-icon--s: 22px;
          --date-picker-hover--bgc: var(--gv-date-picker-hover--bgc, var(--gv-theme-color-light, #86c3d0));
          --date-picker-hover--c: var(--gv-date-picker-hover--c, var(--gv-theme-font-color-dark, #262626));
          --date-picker-selected--bgc: var(--gv-date-picker-selected--bgc, var(--gv-theme-color, #5a7684));
          --date-picker-selected--c: var(--gv-date-picker-selected--c, var(--gv-theme-font-color-light, #ffffff));
          font-size: var(--gv-theme-font-size-m, 14px);
        }

        :host([small]) {
          font-size: var(--gv-theme-font-size-s, 12px);
        }

        .box {
          display: inline-block;
          width: 100%;
        }

        gv-input {
          width: 160px;
          margin: 0;
        }

        .time gv-input {
          width: 205px;
        }

        :not(.range) gv-input {
          width: 100%;
        }

        .range gv-input {
          --gv-input--bds: none;
          --gv-input--bdw: 0;
        }

        .time .range-input gv-input {
          width: 150px;
        }

        .range-input gv-input {
          width: 120px;
        }

        .range.hasFrom.open gv-input:first-of-type,
        .range.hasFrom.open .box-icon:first-of-type {
          border-bottom: 1px solid var(--gv-date-picker-selected--bgc, var(--gv-theme-color, #5a7684));
        }

        .range.hasTo.open gv-input:last-of-type,
        .range.hasTo.open .box-icon:not(.box-icon-calendar) {
          border-bottom: 1px solid var(--gv-date-picker-selected--bgc, var(--gv-theme-color, #5a7684));
        }

        .range-input {
          position: relative;
          z-index: 10;
          border: var(--gv-input--bdw, 1px) var(--gv-input--bds, solid) var(--gv-input--bdc, var(--gv-theme-neutral-color-dark, #d9d9d9));
          border-radius: 4px;
          margin: 0.2rem;
          display: flex;
        }

        .box-icon {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .box-icon-calendar {
          padding: 0 6px;
        }

        .box-icon-arrow,
        .box-icon-calendar {
        }

        .box-icon-clear {
          --gv-icon--s: 16px;
          padding-right: 6px;
          width: 22px;
        }

        .box-icon-clear gv-icon {
          cursor: pointer;
        }

        .box.open .calendar {
          visibility: visible;
          opacity: 1;
          -webkit-transform: -webkit-translateY(0%);
          transform: translateY(0%);
          z-index: 100;
        }

        .calendar {
          background-color: var(--gv-theme-neutral-color-lightest, #ffffff);
          color: var(--gv-theme-font-color, #262626);
          margin: 0.2rem;
          position: absolute;
          box-shadow: 0 0 0 1px var(--gv-theme-neutral-color, #f5f5f5), 0 1px 3px var(--gv-theme-neutral-color-dark, #bfbfbf);
          border-radius: 2px;
          display: flex;
          cursor: pointer;
          visibility: hidden;
          opacity: 0;
          -webkit-transform: -webkit-translateY(-2em);
          transform: translateY(-2em);
          -webkit-transition: -webkit-transform 150ms ease-in-out, opacity 150ms ease-in-out;
          -moz-transition: all 150ms ease-in-out;
          -ms-transition: all 150ms ease-in-out;
          -o-transition: all 150ms ease-in-out;
          overflow: auto;
          position: absolute;
        }

        :host([invalid]) .range-input {
          border-left: 5px solid #a94442;
          padding-left: 0;
        }

        :host([invalid]) .box-icon-calendar {
          padding-left: 2px;
        }
      `,
    ];
  }

  constructor() {
    super();
    this._id = 'gv-id';
    this.strict = false;
    this.range = false;
    this.time = false;
    this.format = 'dd/MM/yyyy';
    const format = i18n('gv-date-picker.format');
    if (format !== 'unknown') {
      this.format = format;
    }
    this.timeFormat = 'HH:mm';
    this.strictTimeFormat = 'HH:mm:ss';
    this.handleClick = this._onClick.bind(this);
    this.handleDocumentClick = this._onDocumentClick.bind(this);
    this.disabledDates = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.handleClick);
    document.addEventListener('click', this.handleDocumentClick);
    this.getLocale().then((locale) => {
      this._year = format(new Date().getTime(), 'yyyy', { locale });
      this._month = format(new Date().getTime(), 'MM', { locale });
    });
  }

  disconnectedCallback() {
    clearInterval(this._distanceTimer);
    this.removeEventListener('click', this.handleClick);
    document.removeEventListener('click', this.handleDocumentClick);
    super.disconnectedCallback();
  }

  set min(value) {
    this._min = parseInt(value / 1000, 10);
  }

  set max(value) {
    this._max = parseInt(value / 1000, 10);
  }

  set distanceFromNow(value) {
    this._distance = value;
    this._max = parseInt(Date.now() / 1000, 10);
    this._min = parseInt((Date.now() - value) / 1000, 10);
    if (this._from && this._from < this._min) {
      this._from = this._min;
    }
  }

  _onClick(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  _onDocumentClick(e) {
    this._open = false;
    this.performUpdate();
  }

  _onFocus(mode) {
    this._open = true;
    if (this.time && this.range) {
      this._mode = mode;
    }
    this.performUpdate();
  }

  async getLocale() {
    const lang = getLanguage();
    if (!lang) {
      return locales.en;
    }
    if (!locales[lang]) {
      try {
        const locale = await import(
          // TODO: complete or improve the solution when managing a larger set of languages
          /* webpackInclude: /(en|fr|cs)\/index\.js$/ */
          /* webpackMode: "lazy-once" */
          /* webpackChunkName: "date-fns-locale" */
          `date-fns/locale/${lang}/index.js`
        );
        locales[lang] = locale.default;
      } catch (e) {
        console.error(`[Error] cannot load locale ${lang}`, e);
      }
    }
    return locales[lang];
  }

  get dateFromPlaceholder() {
    if (this.range && this.time && this.strict) {
      return i18n('gv-date-picker.startTime');
    }
    if (this.range) {
      return i18n('gv-date-picker.startDate');
    }
    return this.getFormat();
  }

  get dateToPlaceholder() {
    if (this.range && this.time && this.strict) {
      return i18n('gv-date-picker.endTime');
    }
    if (this.range) {
      return i18n('gv-date-picker.endDate');
    }
    return this.getFormat();
  }

  get icon() {
    return this._from != null || this._to != null ? 'code:error' : 'general:calendar';
  }

  get hasContent() {
    return this._from != null || this._to != null;
  }

  _onClear() {
    this.invalid = false;
    this.value = null;
    this.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    dispatchCustomEvent(this, 'input', this.value);
  }

  render() {
    const classes = {
      box: true,
      open: this._open,
      range: this.range,
      time: this.time,
      hasFrom: this.hasFrom(),
      hasTo: this.hasTo(),
    };

    return html` <div class="${classMap(classes)}">
      ${this.range
        ? html`
            ${this.label ? html`<label for=${this._id} title="${this.label}">${this.label}</label>` : ''}
            <div class="range-input">
              <div class="box-icon box-icon-calendar"><gv-icon shape="general:calendar"></gv-icon></div>
              <gv-input
                id="${this._id}"
                ?small="${this.small}"
                ?disabled="${this.disabled}"
                @focus="${this._onFocus.bind(this, 'from')}"
                @blur="${this._onBlurForm}"
                @gv-input:submit="${this._onBlurForm}"
                .value="${until(this.getFormattedDate(this._from))}"
                .placeholder="${this.dateFromPlaceholder}"
              ></gv-input>
              <div class="box-icon box-icon-arrow"><gv-icon shape="navigation:arrow-right"></gv-icon></div>
              <gv-input
                .placeholder="${this.dateToPlaceholder}"
                ?small="${this.small}"
                ?disabled="${this.disabled}"
                @focus="${this._onFocus.bind(this, 'to')}"
                @blur="${this._onBlurTo}"
                @gv-input:submit="${this._onBlurTo}"
                .value="${until(this.getFormattedDate(this._to))}"
              ></gv-input>
              <div class="box-icon box-icon-clear">
                ${this.hasContent ? html`<gv-icon class="link" @click=${this._onClear} shape="code:error"></gv-icon>` : ''}
              </div>
            </div>
          `
        : html`
        <gv-input
        id="${this._id}"
        icon="${this.time && this.strict ? 'home:timer' : 'general:calendar'}"
        ?small="${this.small}"
        ?disabled="${this.disabled}"
        clearable
        .label="${this.label}"
        @focus="${this._onFocus.bind(this, null)}"
        @blur="${this._onBlurForm}"
        ?invalid="${this.invalid}"
         @gv-input:submit="${this._onBlurForm}"
         @gv-input:clear="${this._onClear}"
        .placeholder="${this.dateToPlaceholder}"
        .value="${until(this.getFormattedDate(this._from))}"></gv-input></div>
        `}

      <span class="calendar">
        ${this.range
          ? html`
              ${this.hasFrom()
                ? html`<gv-date-picker-calendar
                    .disabledDates="${this.disabledDates}"
                    .min="${this._min}"
                    .max="${this._max}"
                    ?time="${this.time}"
                    ?strict="${this.strict}"
                    ?small="${this.small}"
                    ?prev="${true}"
                    ?next="${this.time}"
                    ?range="${this.range && !this.time}"
                    .month="${this._month}"
                    .year="${this._year}"
                    .hoveredDate="${this._hoveredDate}"
                    .dateTo="${this._to}"
                    .dateFrom="${this._from}"
                    .locale="${until(this.getLocale())}"
                    @gv-date-picker-calendar:month-mode="${this._onMonthMode}"
                    @gv-date-picker-calendar:year-mode="${this._onYearMode}"
                    @gv-date-picker-calendar:month-changed="${this._onMonthChanged}"
                    @gv-date-picker-calendar:year-changed="${this._onYearChanged}"
                    @hovered-date-changed="${this.hoveredDateChanged}"
                    @date-to-changed="${this.dateToChanged}"
                    @date-from-changed="${this.dateFromChanged}"
                  >
                  </gv-date-picker-calendar>`
                : ''}
              ${this.hasTo()
                ? html`<gv-date-picker-calendar
                    .disabledDates="${this.disabledDates}"
                    .min="${this._min}"
                    .max="${this._max}"
                    ?time="${this.time}"
                    ?strict="${this.strict}"
                    ?small="${this.small}"
                    ?prev="${this.time}"
                    ?next="${true}"
                    ?range="${this.range && !this.time}"
                    .month="${this._monthPlus}"
                    .year="${this._yearPlus}"
                    .hoveredDate="${this._hoveredDate}"
                    .dateTo="${this._to}"
                    .dateFrom="${this._from}"
                    .locale="${until(this.getLocale())}"
                    @gv-date-picker-calendar:month-mode="${this._onMonthMode}"
                    @gv-date-picker-calendar:year-mode="${this._onYearMode}"
                    @gv-date-picker-calendar:month-changed="${this._onMonthChanged}"
                    @gv-date-picker-calendar:year-changed="${this._onYearChanged}"
                    @hovered-date-changed="${this.hoveredDateChanged}"
                    @date-to-changed="${this.dateToChanged}"
                    @date-from-changed="${this.dateFromChanged}"
                  >
                  </gv-date-picker-calendar>`
                : ''}
            `
          : html`
              <gv-date-picker-calendar
                .disabledDates="${this.disabledDates}"
                .min="${this._min}"
                .max="${this._max}"
                ?time="${this.time}"
                ?small="${this.small}"
                ?strict="${this.strict}"
                ?prev="${true}"
                ?next="${true}"
                ?range="${this.range}"
                .month="${this._month}"
                .year="${this._year}"
                .hoveredDate="${this._hoveredDate}"
                .dateTo="${this._to}"
                .dateFrom="${this._from}"
                .locale="${until(this.getLocale())}"
                @hovered-date-changed="${this.hoveredDateChanged}"
                @date-to-changed="${this.dateToChanged}"
                @date-from-changed="${this.dateFromChanged}"
              >
              </gv-date-picker-calendar>
            `}
      </span>
    </div>`;
  }

  hasFrom() {
    return this._mode == null || this._mode === 'from';
  }

  hasTo() {
    return this._mode == null || this._mode === 'to';
  }

  firstUpdated() {
    if (this.time && this.range) {
      this._mode = 'from';
    }

    if (this._distance) {
      this._distanceTimer = setInterval(() => {
        this.distanceFromNow = this._distance;
      }, 30000);
    }
  }

  monthChanged(month, year) {
    if (year && month) {
      this._yearPlus = parseInt(year, 10);
      if (this.time && this.range) {
        this._monthPlus = month;
      } else {
        const monthPlus = `0${(month % 12) + 1}`;
        this._monthPlus = monthPlus.substring(monthPlus.length - 2);
        if (this._monthPlus === '01') {
          this._yearPlus += 1;
        }
      }
    }
  }

  updated(properties) {
    if (properties.has('_month') || properties.has('_year')) {
      this.monthChanged(this._month, this._year);
    }
    if (properties.has('value')) {
      if (this.value == null || (this.value.filter && this.value.filter((v) => v != null).length === 0)) {
        this._from = null;
        this._to = null;
      } else {
        if (this.range) {
          this._from = this.value && this.value.length > 0 ? this.value[0] / 1000 : null;
          this._to = this.value && this.value.length > 1 ? this.value[1] / 1000 : null;
        } else {
          this._from = this.value / 1000;
        }
      }
    }
  }

  _onMonthChanged({ detail }) {
    this._month = detail.month;
    this._year = detail.year;
    this._hoveredDate = null;
    if (!(this.range && this.time)) {
      this._mode = null;
    }
  }

  _onYearChanged({ detail }) {
    this._year = detail.year;
  }

  _onMonthMode({ detail }) {
    if (this.time && this.range) {
      this._month = detail.month;
      this._year = detail.year;
    }
  }

  _onYearMode({ detail }) {
    if (this.time && this.range) {
      this._month = detail.month;
      this._year = detail.year;
    }
  }

  _onBlurForm({ target }) {
    const value = target.value;
    if (value) {
      const date = this.parseValue(value);
      if (date && !isNaN(date)) {
        this._month = (getMonth(date) + 1).toString();
        this._year = getYear(date).toString();
        this._from = date.getTime() / 1000;
        this.invalid = isInvalid(this._from, this._min, this._max, !this.time);
      }
    }
  }

  _onBlurTo({ target }) {
    const value = target.value;
    if (value) {
      const date = this.parseValue(value);
      if (date && !isNaN(date)) {
        this._month = (getMonth(date) + 1).toString();
        this._year = getYear(date).toString();
        this._to = date.getTime() / 1000;
        this.invalid = isInvalid(this._to, this._min, this._max, !this.time);
      }
    }
  }

  hoveredDateChanged({ detail }) {
    this._hoveredDate = detail.value;
  }

  dateFromChanged({ detail }) {
    if (this.time && this.range) {
      if (this._mode === 'from') {
        this._from = detail.value;
        const inputs = this.shadowRoot.querySelectorAll('.range-input gv-input');
        inputs[inputs.length - 1].focus();
        setTimeout(() => (this._mode = 'to'), 0);
      } else {
        this._to = detail.value;
        this._open = false;
        if (this._to < this._from) {
          const tmp = this._to;
          this._to = this._from;
          this._from = tmp;
        }
      }
    } else if (!this.range) {
      this._from = detail.value;
      this._open = false;
    } else {
      this._from = detail.value;
    }
    if (this._distance) {
      this.distanceFromNow = this._distance;
    }

    if (this.range) {
      this.value = [this._from * 1000, this._to * 1000];
      this.invalid =
        isInvalid(this._to, this._min, this._max, !this.time) ||
        isInvalid(this._from, this._min, this._max, !this.time) ||
        this._to === this._form;
    } else {
      this.value = this._from * 1000;
      this.invalid = isInvalid(this._from, this._min, this._max, !this.time);
    }
    this.valid = !this.invalid;

    this.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    dispatchCustomEvent(this, 'input', this.value);
  }

  dateToChanged({ detail }) {
    if (this._distance) {
      this.distanceFromNow = this._distance;
    }
    this._to = detail.value;
    if (this._to) {
      this._open = false;
      this.value = [this._from * 1000, this._to * 1000];
      this.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      dispatchCustomEvent(this, 'input', this.value);
    }
  }

  getFormat() {
    if (this.time && this.strict) {
      return this.strictTimeFormat;
    }
    return this.time ? `${this.format} ${this.timeFormat}` : this.format;
  }

  async getFormattedDate(date) {
    if (date) {
      const locale = await this.getLocale();
      return format(new Date(date * 1000), this.getFormat(), locale);
    }
    return '';
  }

  parseValue(value) {
    if (value) {
      return parse(value, this.getFormat(), new Date());
    }
    return '';
  }
}

window.customElements.define('gv-date-picker', GvDatePicker);
