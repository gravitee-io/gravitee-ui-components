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
import './gv-date-picker-calendar';
import { classMap } from 'lit-html/directives/class-map';
import format from 'date-fns/esm/format';
import parse from 'date-fns/esm/parse';
import subMonths from 'date-fns/esm/subMonths';
import getMonth from 'date-fns/esm/getMonth';
import getYear from 'date-fns/esm/getYear';
import { getLanguage, i18n } from '../lib/i18n';
import enUS from 'date-fns/locale/en-US';
import { until } from 'lit-html/directives/until';
import { dispatchCustomEvent } from '../lib/events';

const locales = { en: enUS };

/**
 * Date Picker
 *
 * @attr {Number} dateFrom - date form (Format is Unix timestamp)
 * @attr {Number} dateTo - date to (Format is Unix timestamp)
 * @attr {Boolean} range - if has range picker
 * @attr {Boolean} time - if has time picker
 * @attr {Number} min - min date  (Format is Unix timestamp)
 * @attr {Number} max - max date  (Format is Unix timestamp)
 * @attr {String} format - date format
 *
 * @cssprop {Color} [--gv-date-picker-hover--bgc=var(--gv-theme-color-light, #D5FDCB)] - Hover background color
 * @cssprop {Color} [--gv-date-picker-hover--c=var(--gv-theme-font-color-dark, #262626)] - Hover color
 * @cssprop {Color} [--gv-date-picker-selected--bgc=var(--gv-theme-color, #009B5B)] - Selected background color
 * @cssprop {Color} [--gv-date-picker-selected--c=var(--gv-theme-font-color-light, #FFFFFF)] - Selected color
 */
export class GvDatePicker extends LitElement {

  static get properties () {
    return {
      range: { type: Boolean },
      label: { type: String },
      time: { type: Boolean },
      dateFrom: { type: String, attribute: 'from', reflect: true },
      dateTo: { type: String, attribute: 'to', reflect: true },
      min: { type: Number },
      max: { type: Number },
      disabledDates: { type: Array },
      format: { type: String },
      _hoveredDate: { type: String, attribute: false },
      _open: { type: Boolean, attribute: false },
      _month: { type: String, attribute: false },
      _year: { type: String, attribute: false },
      _monthPlus: { type: String, attribute: false },
      _yearPlus: { type: Number, attribute: false },
      _mode: { type: String, attribute: false },
    };
  }

  static get styles () {
    return [
      // language=CSS
      css`
          :host {
              box-sizing: border-box;
              display: inline-block;
              margin: 0.2rem;
              --gv-input-icon--bgc: transparent;
              --gv-icon--c: var(--gv-theme-neutral-color-darker);
              --gv-icon--s: 20px;
              --date-picker-hover--bgc: var(--gv-date-picker-hover--bgc, var(--gv-theme-color-light, #D5FDCB));
              --date-picker-hover--c: var(--gv-date-picker-hover--c, var(--gv-theme-font-color-dark, #262626));
              --date-picker-selected--bgc: var(--gv-date-picker-selected--bgc, var(--gv-theme-color, #009B5B));
              --date-picker-selected--c: var(--gv-date-picker-selected--c, var(--gv-theme-font-color-light, #FFFFFF));
          }

          .box {
              display: inline-block;
              position: relative;
          }

          gv-input {
              width: 150px;
              --gv-icon--s: 16px;
          }

          .time gv-input {
              width: 205px
          }

          .range gv-input {
              --gv-input--bds: none;
              --gv-input--bdw: 0;
              margin: 0;
          }

          .time .range-input gv-input {
              width: 150px;
          }

          .range-input gv-input {
              width: 120px;
          }

          .range.hasFrom.open gv-input:first-of-type, .range.hasFrom.open .box-icon:first-of-type {
              border-bottom: 1px solid var(--gv-date-picker-selected--bgc, var(--gv-theme-color, #009B5B));
          }

          .range.hasTo.open gv-input:last-of-type, .range.hasTo.open .box-icon:not(.box-icon-calendar) {
              border-bottom: 1px solid var(--gv-date-picker-selected--bgc, var(--gv-theme-color, #009B5B));
          }

          .range-input {
              position: relative;
              z-index: 10;
              border: var(--gv-input--bdw, 1px) var(--gv-input--bds, solid) var(--gv-input--bdc, var(--gv-theme-neutral-color-dark, #D9D9D9));
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
              --gv-icon--s: 16px;
              padding: 0 6px;
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
              background-color: var(--gv-theme-neutral-color-lightest, #FFFFFF);
              color: var(--gv-theme-font-color, #262626);
              margin: 0.2rem;
              position: absolute;
              box-shadow: 0 0 0 1px var(--gv-theme-neutral-color, #F5F5F5), 0 1px 3px var(--gv-theme-neutral-color-dark, #BFBFBF);
              border-radius: 2px;
              display: flex;
              cursor: pointer;
              left: 0;
              visibility: hidden;
              opacity: 0;
              -webkit-transform: -webkit-translateY(-2em);
              transform: translateY(-2em);
              -webkit-transition: -webkit-transform 150ms ease-in-out, opacity 150ms ease-in-out;
              -moz-transition: all 150ms ease-in-out;
              -ms-transition: all 150ms ease-in-out;
              -o-transition: all 150ms ease-in-out;
              overflow: auto;
          }

      `,
    ];
  }

  constructor () {
    super();
    this._id = 'gv-id';
    this.range = false;
    this.time = false;
    this.format = 'dd/MM/yyyy';
    this.timeFormat = 'HH:mm';
    this.handleClick = this._onClick.bind(this);
    this.handleDocumentClick = this._onDocumentClick.bind(this);
    this.disabledDates = [];
  }

  connectedCallback () {
    super.connectedCallback();
    this.addEventListener('click', this.handleClick);
    document.addEventListener('click', this.handleDocumentClick);
    this.getLocale().then((locale) => {
      this._year = format(new Date().getTime(), 'yyyy', { locale });
      this._month = format(new Date().getTime(), 'MM', { locale });
    });
  }

  disconnectedCallback () {
    this.removeEventListener('click', this.handleClick);
    document.removeEventListener('click', this.handleDocumentClick);
    super.disconnectedCallback();
  }

  _onClick (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  _onDocumentClick (e) {
    this._open = false;
    this.performUpdate();
  }

  _onFocus () {
    this._open = true;
    if (this.time && this.range) {
      this.dateTo = null;
    }
  }

  _onIconClick () {
    this.dateFrom = '';
    this.dateTo = '';
  }

  async getLocale () {
    const lang = getLanguage();
    if (!locales[lang]) {
      try {
        const locale = await import(`date-fns/locale/${lang}/index.js`);
        locales[lang] = locale.default;
      } catch (e) {
        console.error(`[Error] cannot load locale ${lang}`, e);
      }
    }
    return locales[lang];
  }

  get dateFromPlaceholder () {
    if (this.range) {
      return i18n('gv-date-picker.startDate');
    }
    return this.getFormat();
  }

  get dateToPlaceholder () {
    if (this.range) {
      return i18n('gv-date-picker.endDate');
    }
    return this.getFormat();
  }

  get icon () {
    return this.dateFrom != null || this.dateTo != null ? 'code:error' : 'general:calendar';
  }

  get hasContent () {
    return this.dateFrom != null || this.dateTo != null;
  }

  _onClear () {
    this.dateFrom = null;
    this.dateTo = null;
  }

  render () {
    const classes = {
      box: true,
      open: this._open,
      range: this.range,
      time: this.time,
      hasFrom: this.hasFrom(),
      hasTo: this.hasTo(),
    };

    return html`
    <div class="${classMap(classes)}">
        ${this.range ? html`
        ${this.label ? html`<label for=${this._id} title="${this.label}">${this.label}</label>` : ''}
        <div class="range-input">
        <div class="box-icon box-icon-calendar"><gv-icon shape=general:calendar></gv-icon></div>
        <gv-input 
        id="${this._id}"
        @focus="${this._onFocus}" 
        @blur="${this._onBlurForm}"
        @gv-input:submit="${this._onBlurForm}"
        .value="${until(this.getFormattedDate(this.dateFrom))}"
        .placeholder="${this.dateFromPlaceholder}"
        ></gv-input>
        <div class="box-icon"><gv-icon shape="navigation:arrow-right"></gv-icon></div>
        <gv-input 
        .placeholder="${this.dateToPlaceholder}"
        @focus="${this._onFocus}" 
        @blur="${this._onBlurTo}"
        @gv-input:submit="${this._onBlurTo}"
        .value="${until(this.getFormattedDate(this.dateTo))}"></gv-input>
        <div class="box-icon box-icon-clear">${this.hasContent ? html`<gv-icon class="link" @click=${this._onClear} shape=code:error></gv-icon>` : ''}</div>
        `
      : html`
        <gv-input 
        id="${this._id}"
        icon="general:calendar" 
        clearable
        .label="${this.label}"
        @focus="${this._onFocus}" 
        @blur="${this._onBlurForm}"
         @gv-input:submit="${this._onBlurForm}"
        .placeholder="${this.dateToPlaceholder}"
        .value="${until(this.getFormattedDate(this.dateFrom))}"></gv-input></div>
        `}
        
        <span class="calendar">
       
        ${this.range ? html`
         ${this.hasFrom() ? html`<gv-date-picker-calendar
              .disabledDates="${this.disabledDates}"
              .min="${this.min}"
              .max="${this.max}"
              ?time="${this.time}"
              ?prev="${true}"
              ?next="${this.time}"
              ?range="${this.range && !this.time}"
              .month="${this._month}"
              .year="${this._year}"
              .hoveredDate="${this._hoveredDate}"
              .dateTo="${this.dateTo}"
              .dateFrom="${this.dateFrom}"
              .locale="${until(this.getLocale())}"
              @gv-date-picker-calendar:month-mode="${this._onMonthMode.bind(this, 'from')}"
              @gv-date-picker-calendar:year-mode="${this._onYearMode.bind(this, 'from')}"
              @gv-date-picker-calendar:month-changed="${this._onMonthChanged}"
              @gv-date-picker-calendar:year-changed="${this._onYearChanged}"
              @hovered-date-changed="${this.hoveredDateChanged}"
              @date-to-changed="${this.dateToChanged}"
              @date-from-changed="${this.dateFromChanged}">
            </gv-date-picker-calendar>` : ''}
        ${this.hasTo() ? html`<gv-date-picker-calendar
            .disabledDates="${this.disabledDates}"
            .min="${this.min}"
            .max="${this.max}"
             ?time="${this.time}"
            ?prev="${this.time}"
            ?next="${true}"
            ?range="${this.range && !this.time}"
            .month="${this._monthPlus}"
            .year="${this._yearPlus}"
            .hoveredDate="${this._hoveredDate}"
            .dateTo="${this.dateTo}"
            .dateFrom="${this.dateFrom}"
            .locale="${until(this.getLocale())}"
            @gv-date-picker-calendar:month-mode="${this._onMonthMode.bind(this, 'to')}"
            @gv-date-picker-calendar:year-mode="${this._onYearMode.bind(this, 'to')}"
            @gv-date-picker-calendar:month-changed="${this._onMonthChanged}"
            @gv-date-picker-calendar:year-changed="${this._onYearChanged}"
            @hovered-date-changed="${this.hoveredDateChanged}"
            @date-to-changed="${this.dateToChanged}"
            @date-from-changed="${this.dateFromChanged}">
          </gv-date-picker-calendar>` : ''}
        ` : html`
          <gv-date-picker-calendar
              .disabledDates="${this.disabledDates}"
              .min="${this.min}"
              .max="${this.max}"
              ?time="${this.time}"
              ?prev="${true}"
              ?next="${true}"
              ?range="${this.range}"
              .month="${this._month}"
              .year="${this._year}"
              .hoveredDate="${this._hoveredDate}"
              .dateTo="${this.dateTo}"
              .dateFrom="${this.dateFrom}"
              .locale="${until(this.getLocale())}"
              @hovered-date-changed="${this.hoveredDateChanged}"
              @date-to-changed="${this.dateToChanged}"
              @date-from-changed="${this.dateFromChanged}">
            </gv-date-picker-calendar>
        `}
        </span>
    </div>`;
  }

  hasFrom () {
    return this._mode == null || this._mode === 'from';
  }

  hasTo () {
    return this._mode == null || this._mode === 'to';
  }

  firstUpdated () {
    if (this.time && this.range) {
      this._mode = 'from';
    }
  }

  monthChanged (month, year) {
    if (year && month) {
      const add = (this.time && this.range) ? 0 : 1;
      const monthPlus = `0${((month % 12) + add)}`;
      this._monthPlus = monthPlus.substring(monthPlus.length - 2);
      if (this._monthPlus === '01') {
        this._yearPlus = parseInt(year, 10) + add;
      }
      else {
        this._yearPlus = parseInt(year, 10);
      }
    }
  }

  updated (properties) {
    if (properties.has('_month') || properties.has('_year')) {
      setTimeout(() => {
        this.monthChanged(this._month, this._year);
      }, 0);
    }
  }

  async _onMonthChanged ({ detail }) {
    if (this._mode === 'to') {
      let dateFn = parse(`${detail.month}/${detail.year}`, 'MM/yyyy', new Date());
      dateFn = subMonths(dateFn, 1);
      const locale = await this.getLocale();
      this._month = format(dateFn, 'MM', { locale });
      this._year = format(dateFn, 'yyyy', { locale });
      if (this.dateFrom > dateFn.getTime() / 1000) {
        this.dateFrom = null;
      }
    }
    else {
      this._month = detail.month;
      this._year = detail.year;
      this._hoveredDate = null;
    }
    if (!(this.range && this.time)) {
      this._mode = null;
    }
  }

  _onYearChanged ({ detail }) {
    this._year = detail.year;
  }

  _onMonthMode (mode, { detail }) {
    this._month = detail.month;
    this._year = detail.year;

    if (detail.mode) {
      this._mode = mode;
    }
    else {
      this._mode = null;
    }
  }

  _onYearMode (mode, { detail }) {
    this._month = detail.month;
    this._year = detail.year;
    if (detail.mode) {
      this._mode = mode;
    }
    else {
      this._mode = null;
    }
  }

  _onBlurForm ({ target }) {
    const value = target.value;
    if (value) {
      const date = this.parseValue(value);
      if (date && !isNaN(date)) {
        this._month = getMonth(date) + 1;
        this._year = getYear(date);
        this.dateFrom = date.getTime() / 1000;
      }
    }
  }

  _onBlurTo ({ target }) {
    const value = target.value;
    if (value) {
      const date = this.parseValue(value);
      if (date && !isNaN(date)) {
        this._month = getMonth(date) + 1;
        this._year = getYear(date);
        this.dateTo = date.getTime() / 1000;
      }
    }
  }

  hoveredDateChanged ({ detail }) {
    this._hoveredDate = detail.value;
  }

  dateFromChanged ({ detail }) {
    if (this.time && this.range) {
      if (this._mode === 'from') {
        this.dateFrom = detail.value;
        const inputs = this.shadowRoot.querySelectorAll('.range-input gv-input');
        inputs[inputs.length - 1].focus();
        this._mode = 'to';
      }
      else {
        this.dateTo = detail.value;
        this._mode = 'from';
        this._open = false;
        if (this.dateTo < this.dateFrom) {
          const tmp = this.dateTo;
          this.dateTo = this.dateFrom;
          this.dateFrom = tmp;
        }
      }
    }
    else if (!this.range) {
      this.dateFrom = detail.value;
      this._open = false;
    }
    else {
      this.dateFrom = detail.value;
    }
    dispatchCustomEvent(this, 'date-from', { value: this.dateFrom });
  }

  dateToChanged ({ detail }) {
    this.dateTo = detail.value;
    if (this.dateTo) {
      this._open = false;
      dispatchCustomEvent(this, 'date-to', { value: this.dateTo });
    }
  }

  getFormat () {
    return this.time ? `${this.format} ${this.timeFormat}` : this.format;
  }

  async getFormattedDate (date) {
    if (date) {
      const locale = await this.getLocale();
      return format(new Date(date * 1000), this.getFormat(), locale);
    }
    return '';
  }

  parseValue (value) {
    if (value) {
      return parse(value, this.getFormat(), new Date());
    }
    return '';
  }

}

window.customElements.define('gv-date-picker', GvDatePicker);
