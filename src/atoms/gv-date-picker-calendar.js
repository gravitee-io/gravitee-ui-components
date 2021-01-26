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
import './gv-date-picker-cell';
import {
  addDays,
  addMonths,
  addYears,
  endOfMonth,
  format,
  getDay,
  getMonth,
  getYear,
  isAfter,
  isBefore,
  parse,
  setHours,
  setMinutes,
  startOfDay,
  subMonths,
  subYears,
} from 'date-fns';
import { classMap } from 'lit-html/directives/class-map';
import { dispatchCustomEvent } from '../lib/events';
import { i18n } from '../lib/i18n';
import { LitElement, css } from 'lit-element';
import { html } from 'lit-html';

import { until } from 'lit-html/directives/until';

/**
 * Date Picker Calendar
 *
 * ## Details
 * * has @theme facet
 *
 * @fires gv-date-picker-cell:select - Custom event when user select cell
 * @fires gv-date-picker-cell:hover - Custom event when user hover cell
 *
 * @attr {Number} dateFrom - unix date form
 * @attr {Number} dateTo - unix date to
 * @attr {Array} disabledDates - array of disabled date
 * @attr {Number} hoveredDate - unix hovered date
 * @attr {Number} min - unix min date
 * @attr {Number} max - unix max date
 * @attr {Object} locale - date-fns locale object
 *
 * @cssprop {Color} [--gv-date-picker-hover--bgc=var(--gv-theme-color-light, #86c3d0)] - Hover background color
 * @cssprop {Color} [--gv-date-picker-hover--c=var(--gv-theme-font-color-dark, #262626)] - Hover color
 * @cssprop {Color} [--gv-date-picker-selected--bgc=var(--gv-theme-color, #5A7684)] - Selected background color
 * @cssprop {Color} [--gv-date-picker-selected--c=var(--gv-theme-font-color-light, #FFFFFF)] - Selected color
 */
export class GvDatePickerCalendar extends LitElement {

  static get properties () {
    return {
      dateFrom: { type: Number },
      dateTo: { type: Number },
      disabledDates: { type: Array },
      hoveredDate: { type: Number },
      locale: { type: Object },
      max: { type: Number },
      min: { type: Number },
      month: { type: String },
      monthMode: { type: Boolean },
      next: { type: Boolean },
      prev: { type: Boolean },
      range: { type: Boolean },
      time: { type: Boolean },
      small: { type: Boolean, reflect: true },
      strict: { type: Boolean },
      year: { type: String },
      yearMode: { type: Boolean },

      _dayNamesOfWeek: { type: Array, attribute: false },
      _dimensions: { type: Array, attribute: false },
      _hasGoToday: { type: Boolean, attribute: false },
      _hour: { type: Number, attribute: false },
      _minute: { type: Number, attribute: false },
      _second: { type: Number, attribute: false },
      _monthsList: { type: Array, attribute: false },
      _locale: { type: Object, attribute: false },
      _from: { type: Number, attribute: false },
      _to: { type: Number, attribute: false },
    };
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        :host > div {
          overflow: hidden;
        }

        .nav, .foot, .nav-times {
          display: flex;
          padding: 0.5rem;
          height: 30px;
        }

        .nav .current, .foot {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .monthName, .day {
          text-transform: capitalize;
        }

        .foot-time {
          justify-content: flex-end;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          padding: 0.5rem 0.5rem 0 0.5rem;
        }

        .calendar-grid-large {
          grid-template-columns: repeat(3, 1fr);
        }

        .header, .content {
          display: grid;
          grid-template-columns: repeat(2, auto);
        }

        gv-date-picker-cell {
          height: 32px;
        }

        .calendar-grid-large gv-date-picker-cell {
          height: 48px;
        }

        .calendar-grid, .foot, .time {
          border-top: 1px solid var(--gv-theme-neutral-color-dark);
        }

        .nav-times {
          justify-content: center;
          align-items: center;
        }

        .nav-times, .time {
          border-left: 1px solid var(--gv-theme-neutral-color-dark);
        }

        .day {
          height: 32px;
          width: 33px;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 12px;
        }

        :host([small]) .day {
          height: 25px;
          width: 26px;
        }

        .box-col, .times {
          display: flex;
        }

        .box-col {
          flex-direction: column;
        }

        .box-col:first-of-type {
          width: 260px;
        }

        :host([small]) .box-col:first-of-type {
          width: 195px;
        }

        .box {
          display: flex;
        }

        .times {
          max-height: 235px;
          flex-direction: row;
        }

        .time {
          overflow-x: auto;
          min-width: 50px;
          width: 100%;
        }

        .time > div {
          height: 32px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        :host([small]) .time > div {
          height: 25px;
        }

        .time > div:hover {
          background: var(--gv-date-picker-hover--bgc, var(--gv-theme-color-light, #86c3d0));
          color: var(--gv-date-picker-hover--c, var(--gv-theme-font-color-dark, #262626));
        }

        .time > div.selected {
          background: var(--gv-date-picker-selected--bgc, var(--gv-theme-color, #5A7684));
          color: var(--gv-date-picker-selected--c, var(--gv-theme-font-color-light, #FFFFFF));
        }

        .time > div.disabled {
          opacity: 0.4;
        }

      `];
  }

  constructor () {
    super();
    this._dayNamesOfWeek = [];
    this._monthsList = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    this.range = false;
    this.currentDate = parseInt(format(startOfDay(Date.now()), 't'), 10);
    this._hasGoToday = true;

    this._hours = this.computeArrayOfTime(24);
    this._minutes = this.computeArrayOfTime(60);
    this._seconds = this.computeArrayOfTime(60);
  }

  set dateFrom (value) {
    this._from = value;
    if (this.time && this._from) {
      const date = new Date(this._from * 1000);
      this._hour = format(date, 'HH');
      this._minute = format(date, 'mm');
      if (this.isStrictTime()) {
        this._second = format(date, 'ss');
      }
    }
  }

  set dateTo (value) {
    this._to = value;
  }

  computeArrayOfTime (size) {
    return new Array(size).fill('').map((a, i) => {
      let time = i.toString();
      if (time.length === 1) {
        time = `0${time}`;
      }
      return time;
    });
  }

  _renderPreviousNav () {
    if (this.prev || this.monthMode || this.yearMode) {
      return html`
      <gv-button link icon="navigation:angle-double-left" @click="${this._onPrevYear}" ?small="${this.small}"></gv-button>
      ${this.monthMode || this.yearMode ? '' : html`<gv-button link icon="navigation:angle-left" ?small="${this.small}" @click="${this._onPrevMonth}"></gv-button>`}
    `;
    }
    return '';
  }

  _renderCurrentNav () {
    return html`
      <div class="current">
         ${this.yearMode ? '' : html`<gv-button link @click="${this._onSelectMonth}" ?small="${this.small}"><span class="monthName">${until(this.computeName(this.month, this.year))}</span></gv-button>`}
        <gv-button ?small="${this.small}" link @click="${this._onSelectYear}">${this.computeCurrentYearName()}</gv-button>
      </div>
    `;
  }

  _renderNextNav () {
    if (this.next || this.monthMode || this.yearMode) {
      return html`
      ${this.monthMode || this.yearMode ? '' : html`<gv-button link icon="navigation:angle-right" ?small="${this.small}" @click="${this._onNextMonth}"></gv-button>`}
      <gv-button ?small="${this.small}" link icon="navigation:angle-double-right" @click="${this._onNextYear}"></gv-button>
    `;
    }

  }

  _renderDays () {
    return html`
    ${this._dayNamesOfWeek && this._dayNamesOfWeek.map((dayNameOfWeek) => html`<div class="day">${dayNameOfWeek}</div>`)}
    ${this._dimensions && this._dimensions.map((dimension) => html`${dimension && dimension.map((data) => html`
        <div>
        ${data ? html`
          <gv-date-picker-cell
            .disabledDates="${this.disabledDates}"
            .min="${this.monthMode || this.yearMode ? null : this.min}"
            .max="${this.monthMode || this.yearMode ? null : this.max}"
            .month="${this.month}"
            .hoveredDate="${this.hoveredDate}"
            .dateTo="${this._to}"
            .dateFrom="${this._from}"
            .data="${data}"
            .time="${this.time}"
            ?isCurrent="${this.isCurrentDate(data)}"
            @gv-date-picker-cell:hover="${this._onHover}"
            @gv-date-picker-cell:select="${this._onSelect}"></gv-date-picker-cell>
        ` : null}
      </div>`)}`,
    )}`;
  }

  isStrictTime () {
    return this.time === true && this.strict === true;
  }

  render () {
    const classes = {
      'calendar-grid': true,
      'calendar-grid-large': this.monthMode || this.yearMode,
    };
    return html`
    <div class="box">
      ${this.isStrictTime() ? '' : html`<div class="box-col">
            <div class="nav">
            ${this._renderPreviousNav()}
            ${this._renderCurrentNav()}
            ${this._renderNextNav()}
         </div>
          <div class="${classMap(classes)}">
              ${this._renderDays()}
         </div>
      </div>`}
      ${this.time && !this.monthMode && !this.yearMode ? html`<div class="box-col">
         ${this.isStrictTime() ? '' : html`<div class="nav-times">${this.getTime()}</div>`}
         <div class="times">
              <div class="time">${this._hours && this._hours.map((val) =>
      html`<div @click="${this._onSelectHour.bind(this, val)}" class="${classMap({
        hour: true,
        selected: this._hour === val,
        disabled: this.isHoursDisabled(val),
      })}">${val}</div>`)}</div>
              <div class="time">${this._minutes && this._minutes.map((val) =>
      html`<div @click="${this._onSelectMinute.bind(this, val)}" class="${classMap({
        minute: true,
        selected: this._minute === val,
        disabled: this.isMinutesDisabled(val),
      })}">${val}</div>`)}</div>
              
          ${this.isStrictTime() ? html`<div class="time">${this._seconds && this._seconds.map((val) =>
      html`<div @click="${this._onSelectSecond.bind(this, val)}" class="${classMap({
        second: true,
        selected: this._second === val,
        disabled: this.isSecondsDisabled(val),
      })}">${val}</div>`)}</div>` : ''}
         </div>
      </div>` : ''}
    </div>
   ${this.hasGoToday() ? html`
    <div class="foot">
        <gv-button link @click=${this.goToday}>${i18n('gv-date-picker.today')}</gv-button>
    </div>` : ''}
   ${this.time && !this.monthMode && !this.yearMode ? html`
    <div class="foot foot-time">
    <gv-button primary outlined small
    @click=${this._onNow}>${this.isStrictTime() ? i18n('gv-date-picker.currentTime') : i18n('gv-date-picker.now')}</gv-button>
    <gv-button primary small
    @click=${this._onDateTimeSelected}
    .disabled="${this.disableValidation === true}">${i18n('gv-date-picker.ok')}</gv-button></div>` : ''}
`;
  }

  isMinutesDisabled (value) {
    if (this._from && this._hour != null) {
      const selectedDate = new Date(this._from * 1000);
      selectedDate.setHours(parseInt(this._hour, 10), parseInt(value, 10), 0, 0);
      if (this.min) {
        const minDate = new Date(this.min * 1000);
        if (isBefore(selectedDate, minDate)) {
          return true;
        }
      }

      if (this.max) {
        const maxDate = new Date(this.max * 1000);
        if (isAfter(selectedDate, maxDate)) {
          return true;
        }
      }
    }
    return false;
  }

  isSecondsDisabled (value) {
    if (this._from && this._hour != null) {
      const selectedDate = new Date(this._from * 1000);
      selectedDate.setHours(parseInt(this._hour, 10), parseInt(value, 10), 0, 0);
      if (this.min) {
        const minDate = new Date(this.min * 1000);
        if (isBefore(selectedDate, minDate)) {
          return true;
        }
      }

      if (this.max) {
        const maxDate = new Date(this.max * 1000);
        if (isAfter(selectedDate, maxDate)) {
          return true;
        }
      }
    }
    return false;
  }

  isHoursDisabled (value) {
    if (this._from) {
      const selectedDate = new Date(this._from * 1000);
      selectedDate.setHours(parseInt(value, 10));
      if (this.min) {
        const minDate = new Date(this.min * 1000);
        minDate.setMinutes(0, 0, 0);
        if (selectedDate.getTime() < minDate.getTime()) {
          return true;
        }
      }

      if (this.max) {
        const maxDate = new Date(this.max * 1000);
        if (selectedDate.getTime() > maxDate.getTime()) {
          return true;
        }
      }
    }
    return false;
  }

  _updateTime () {
    setTimeout(() => {
      if (!this._hour || this.isHoursDisabled(this._hour)) {
        const hour = this.shadowRoot.querySelector('.hour:not(.disabled)');
        if (hour) {
          this._hour = hour.textContent;
        }
      }
    }, 0);

    setTimeout(() => {
      if (!this._minute || this.isMinutesDisabled(this._minute)) {
        const minute = this.shadowRoot.querySelector('.minute:not(.disabled)');
        if (minute) {
          this._minute = minute.textContent;
        }
      }
    }, 0);

    if (this.isStrictTime()) {
      setTimeout(() => {
        if (!this._second || this.isSecondsDisabled(this._second)) {
          const second = this.shadowRoot.querySelector('.second:not(.disabled)');
          if (second) {
            this._second = second.textContent;
          }
        }
      }, 0);
    }
  }

  getTime () {
    if (this._hour && this._minute) {
      return `${this._hour}:${this._minute}`;
    }
    return '';
  }

  isCurrentDate (data) {
    if (this.yearMode) {
      return getYear(data.date * 1000) === getYear(this.currentDate * 1000);
    }
    else if (this.monthMode) {
      return getMonth(data.date * 1000) === getMonth(this.currentDate * 1000);
    }
    return data.date === this.currentDate;
  }

  updated (properties) {
    if (properties.has('year')) {
      this.dispatchEvent(new CustomEvent('year-changed', { detail: { value: this.year } }));
    }
    if (properties.has('locale') || properties.has('year') || properties.has('month') || properties.has('monthMode') || properties.has('yearMode')) {
      this.yearAndMonthChanged(this.year, this.month);
    }

    if (properties.has('_hour') || properties.has('_minute')) {
      this.shadowRoot.querySelectorAll('.selected').forEach((time) => {
        time.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      });
    }
  }

  _updateDays () {
    const dayNames = [];
    for (let i = 0; i < 7; i += 1) {
      dayNames.push(this.locale.localize.day(i, { width: 'short' }));
    }
    const firstDayOfWeek = this.locale.options.weekStartsOn;
    const tmp = dayNames.slice().splice(0, firstDayOfWeek);
    this._dayNamesOfWeek = dayNames
      .slice()
      .splice(firstDayOfWeek, dayNames.length)
      .concat(tmp);
  }

  yearAndMonthChanged (year, month) {
    if (year && month && this.locale) {
      if (this.yearMode) {
        this._dayNamesOfWeek = [];
        const cols = [null];
        const { start, end } = this.getYearInterval(year);
        for (let c = start; c < end; c++) {
          const startDateString = `01/${month}/${c}`;
          const startDateFn = parse(startDateString, 'dd/MM/yyyy', new Date(), { awareOfUnicodeTokens: true });
          cols.push({
            hover: false,
            date: parseInt(format(startDateFn, 't'), 10),
            title: this.computeName(month, c, 'yyyy'),
          });
        }
        cols.push(null);
        this._dimensions = [cols];
      }
      else if (this.monthMode) {
        this._dayNamesOfWeek = [];
        this._dimensions = [this._monthsList.map((month) => {
          const startDateString = `01/${month}/${year}`;
          const startDateFn = parse(startDateString, 'dd/MM/yyyy', new Date(), { awareOfUnicodeTokens: true });
          return {
            hover: false,
            date: parseInt(format(startDateFn, 't'), 10),
            title: this.computeName(month, this.year, 'MMM'),
          };
        })];
      }
      else {
        this._updateDays();
        let monthMinus = month;
        monthMinus = monthMinus.substring(monthMinus.length - 2);
        let startDateString = `01/${monthMinus}/${year}`;
        let startDateFn = parse(startDateString, 'dd/MM/yyyy', new Date(), { awareOfUnicodeTokens: true });
        const endDateFn = endOfMonth(startDateFn);
        const endDateString = format(endDateFn, 'dd/MM/yyyy', { awareOfUnicodeTokens: true });

        const firstDayOfWeek = this.locale.options.weekStartsOn;
        const rows = [];
        let columns = [];

        const lastDayOfWeek = 6;

        while (startDateString !== endDateString) {
          let dayNumberFn = getDay(startDateFn) - firstDayOfWeek;
          if (dayNumberFn < 0) {
            dayNumberFn = 6;
          }

          const columnFn = {
            hover: false,
            date: parseInt(format(startDateFn, 't'), 10),
            title: parseInt(format(startDateFn, 'd', { awareOfUnicodeTokens: true }), 10),
          };
          columns.push(columnFn);

          if (dayNumberFn === lastDayOfWeek) {
            for (let i = columns.length; i < lastDayOfWeek + 1; i += 1) {
              columns.unshift(0);
            }
            rows.push(columns.slice());
            columns = [];
          }

          startDateFn = addDays(startDateFn, 1);
          startDateString = format(startDateFn, 'dd/MM/yyyy', { awareOfUnicodeTokens: true });

          if (startDateString === endDateString) {
            const endColumnFn = {
              hover: false,
              date: parseInt(format(startDateFn, 't'), 10),
              title: parseInt(format(startDateFn, 'd', { awareOfUnicodeTokens: true }), 10),
            };
            columns.push(endColumnFn);
            for (let i = columns.length; i <= lastDayOfWeek; i += 1) {
              columns.push(0);
            }
            rows.push(columns.slice());
            columns = [];
          }
        }
        this._dimensions = rows;
      }
    }
  }

  getYearInterval (year = this.year) {
    let start = parseInt(year, 10);
    while (start % 10 !== 0) {
      start--;
    }
    return { start, end: start + 10 };
  }

  computeName (month, year, _format = 'MMMM') {
    if (month && year) {
      const dateFn = parse(`${month}/${year}`, 'MM/yyyy', new Date());
      return format(dateFn, _format, { locale: this.locale });
    }
    return '';
  }

  computeCurrentYearName () {
    if (this.yearMode) {
      const { start, end } = this.getYearInterval();
      return `${start}-${end - 1}`;
    }
    return this.year;
  }

  _onSelectHour (value) {
    this._hour = value;
    this._updateTime();
  }

  _onSelectMinute (value) {
    this._minute = value;
    this._updateTime();
  }

  _onSelectSecond (value) {
    this._second = value;
    this._updateTime();
  }

  _onSelectMonth () {
    if (this.monthMode) {
      this._from = this._dateFrom;
    }
    else {
      this._dateFrom = this._from;
      this._from = null;
    }
    this.yearMode = false;
    this.monthMode = !this.monthMode;
    this.yearAndMonthChanged(this.year, this.month);
    dispatchCustomEvent(this, 'month-mode', { mode: this.monthMode, month: this.month, year: this.year });
  }

  _onSelectYear () {
    if (this.yearMode) {
      this._from = this._dateFrom;
    }
    else {
      this._dateFrom = this._from;
      this._from = null;
    }
    this.monthMode = false;
    this.yearMode = !this.yearMode;
    this.yearAndMonthChanged(this.year, this.month);
    dispatchCustomEvent(this, 'year-mode', { mode: this.yearMode, month: this.month, year: this.year });
  }

  get datetimeSelected () {
    let selectedDate = new Date(this._from * 1000);
    selectedDate = setHours(selectedDate, parseInt(this._hour ? this._hour : 0, 10));
    selectedDate = setMinutes(selectedDate, parseInt(this._minute ? this._minute : 0, 10));
    return selectedDate.getTime() / 1000;
  }

  _onDateTimeSelected () {
    this.value = this.datetimeSelected;
    this.dispatchEvent(new CustomEvent('date-from-changed', { detail: { value: this.value } }));
  }

  _onNow () {
    const now = new Date();
    if (!this.isStrictTime()) {
      now.setSeconds(0, 0);
    }
    this._from = now.getTime() / 1000;
    this.month = format(now, 'MM');
    this.year = format(now, 'yyyy');
    this._hour = format(now, 'HH');
    this._minute = format(now, 'mm');
    if (this.isStrictTime()) {
      this._second = format(now, 'mm');
    }
    this.dispatchEvent(new CustomEvent('date-from-changed', { detail: { value: this._from } }));
  }

  get disableValidation () {
    const date = this.datetimeSelected;
    if (date) {
      if (this.min && date < this.min) {
        return true;
      }
      if (this.max && date > this.max) {
        return true;
      }
    }
    return false;
  }

  _onSelect ({ detail }) {
    const { date } = detail;
    if (this.yearMode) {
      this.yearMode = false;
      this.monthMode = true;
      this._from = this._dateFrom;
      const selectedDate = new Date(date * 1000);
      this.year = format(selectedDate, 'yyyy');
      dispatchCustomEvent(this, 'year-changed', { year: this.year });
    }
    else if (this.monthMode) {
      this.monthMode = false;
      this._from = this._dateFrom;
      const selectedDate = new Date(date * 1000);
      this.month = format(selectedDate, 'MM');
      this.year = format(selectedDate, 'yyyy');
      dispatchCustomEvent(this, 'month-changed', { month: this.month, year: this.year });
    }
    else if (this.time) {
      this._from = date;
      this._updateTime();
    }
    else if (this.range) {
      if (this._from && this._to) {
        this._from = date;
        this._to = null;
        this.hoveredDate = undefined;
        this.dispatchEvent(new CustomEvent('hovered-date-changed', { detail: { value: this.hoveredDate } }));
      }
      else if (!this._from || (this._from && date < this._from)) {
        this._from = date;
      }
      else if (!this._to || (this._to && date > this._to)) {
        this._to = date;
      }
      this.dispatchEvent(new CustomEvent('date-from-changed', { detail: { value: this._from } }));
      this.dispatchEvent(new CustomEvent('date-to-changed', { detail: { value: this._to } }));
    }
    else {
      this._from = date;
      this.dispatchEvent(new CustomEvent('date-from-changed', { detail: { value: this._from } }));
    }
  }

  _onHover (event) {
    if (this.range) {
      this.hoveredDate = event.detail.date;
      this.dispatchEvent(new CustomEvent('hovered-date-changed', { detail: { value: this.hoveredDate } }));
    }
  }

  _onNextMonth () {
    const month = parse(this.month, 'MM', new Date());
    const monthPlusDate = addMonths(month, 1);
    const monthPlusString = format(monthPlusDate, 'MM', { locale: this.locale });

    this.month = monthPlusString;
    if (this.month === '01') {
      const year = parse(this.year, 'yyyy', new Date());
      const yearPlusDate = addYears(year, 1);
      const yearPlusString = format(yearPlusDate, 'yyyy', { locale: this.locale });
      this.year = yearPlusString;
    }
  }

  _onPrevMonth () {
    const month = parse(this.month, 'MM', new Date());
    const monthMinusDate = subMonths(month, 1);
    const monthMinusString = format(monthMinusDate, 'MM', { locale: this.locale });

    this.month = monthMinusString;
    if (this.month === '12') {
      const year = parse(this.year, 'yyyy', new Date());
      const yearMinusDate = subYears(year, 1);
      const yearMinusString = format(yearMinusDate, 'yyyy', { locale: this.locale });
      this.year = yearMinusString;
    }
  }

  _onNextYear () {
    if (this.yearMode) {
      this.year = parseInt(this.year, 10) + 10;
    }
    const year = parse(this.year, 'yyyy', new Date());
    const yearPlusDate = addYears(year, 1);
    const yearPlusString = format(yearPlusDate, 'yyyy', { locale: this.locale });
    this.year = yearPlusString;
  }

  _onPrevYear () {
    if (this.yearMode) {
      this.year = parseInt(this.year, 10) - 10;
    }
    const year = parse(this.year, 'yyyy', new Date());
    const yearMinusDate = subYears(year, 1);
    const yearMinusString = format(yearMinusDate, 'yyyy', { locale: this.locale });
    this.year = yearMinusString;
  }

  goToday () {
    this.month = `0${getMonth(new Date()) + 1}`.slice(-2);
    this.year = getYear(new Date());
    this._onSelect({ detail: { date: new Date().getTime() / 1000 } });
  }

  hasGoToday () {
    return !this.range && !this.time && !this.monthMode && !this.yearMode && this._hasGoToday;
  }

}

window.customElements.define('gv-date-picker-calendar', GvDatePickerCalendar);
