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
import { LitElement, html, css } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { dispatchCustomEvent } from '../lib/events';
import { startOfDay } from 'date-fns';
import { until } from 'lit-html/directives/until';
import { isInvalid } from '../lib/date';

/**
 * Date Picker Cell
 *
 * ## Details
 * * has @theme facet
 *
 * @fires gv-date-picker-cell:select - Custom event when user select cell
 * @fires gv-date-picker-cell:hover - Custom event when user hover cell
 *
 * @attr {Object.<{date:Number,title:String}>} data - data to display
 * @attr {Boolean} selected - if data is selected
 * @attr {Boolean} hovered - if data is hovered
 * @attr {Boolean} disabled - if data is disabled
 * @attr {Boolean} isCurrent - if data is current date
 * @attr {Number} dateFrom - unix date form
 * @attr {Number} dateTo - unix date to
 * @attr {Number} hoveredDate - unix hovered date
 * @attr {Number} min - unix min date
 * @attr {Number} max - unix max date
 * @attr {Array} disabledDates - array of disabled date
 *
 * @cssprop {Color} [--gv-date-picker-hover--bgc=var(--gv-theme-color-light, #86c3d0)] - Hover background color
 * @cssprop {Color} [--gv-date-picker-hover--c=var(--gv-theme-font-color-dark, #262626)] - Hover color
 * @cssprop {Color} [--gv-date-picker-selected--bgc=var(--gv-theme-color, #5a7684)] - Selected background color
 * @cssprop {Color} [--gv-date-picker-selected--c=var(--gv-theme-font-color-light, #ffffff)] - Selected color
 */
export class GvDatePickerCell extends LitElement {
  static get properties() {
    return {
      data: { type: Object },
      selected: { type: Boolean },
      hovered: { type: Boolean },
      dateTo: { type: Number },
      dateFrom: { type: Number },
      month: { type: String },
      hoveredDate: { type: Number },
      min: { type: Number },
      max: { type: Number },
      disabled: { type: Boolean },
      isCurrent: { type: Boolean },
      time: { type: Boolean },
      disabledDate: { type: Array },
    };
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        .cell {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .cell:not(.disabled):not(.selected):hover {
          background: var(--gv-date-picker-hover--bgc, var(--gv-theme-color-light, #86c3d0));
          color: var(--gv-date-picker-hover--c, var(--gv-theme-font-color-dark, #262626));
          cursor: pointer;
          opacity: 1;
        }

        .cell.hovered {
          opacity: 0.5;
        }

        .cell.current {
          font-weight: bold;
          background: var(--gv-theme-neutral-color, #f5f5f5);
        }

        .cell.hovered,
        .cell.selected {
          background: var(--gv-date-picker-selected--bgc, var(--gv-theme-color, #5a7684));
          color: var(--gv-date-picker-selected--c, var(--gv-theme-font-color-light, #ffffff));
        }

        .cell.disabled {
          opacity: 0.4;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.selected = false;
    this.hovered = false;
    this.isCurrent = false;
    this.disabledDates = [];
  }

  render() {
    const disabled = this.isDisabled();
    const classes = {
      cell: true,
      current: this.isCurrent,
      selected: this.selected,
      hovered: this.hovered,
      disabled,
    };

    return html`
      <div @click="${disabled ? null : this._onClick}" @mouseover="${this._onMouseOver}" class="${classMap(classes)}">
        <div>${until(this.data ? this.data.title : null)}</div>
      </div>
    `;
  }

  updated(properties) {
    if (properties.has('dateFrom') || properties.has('dateTo') || properties.has('hoveredDate') || properties.has('data')) {
      this.dateChanged(this.dateFrom, this.dateTo, this.hoveredDate, this.data);
    }
  }

  isSelected(parsedDateFrom, parsedDateTo, data) {
    return (
      (parsedDateTo && startOfDay(parsedDateTo * 1000).getTime() / 1000 === data.date) ||
      (parsedDateFrom && startOfDay(parsedDateFrom * 1000).getTime() / 1000 === data.date)
    );
  }

  dateChanged(dateFrom, dateTo, hoveredDate, data) {
    this.selected = false;
    this.hovered = false;
    const parsedDateFrom = parseInt(dateFrom, 10);
    const parsedDateTo = parseInt(dateTo, 10);
    if (data || hoveredDate) {
      this.selected = this.isSelected(parsedDateFrom, parsedDateTo, data);
      if (
        ((hoveredDate === data.date || data.date < hoveredDate) &&
          data.date > parsedDateFrom &&
          !parsedDateTo &&
          !Number.isNaN(parsedDateFrom) &&
          parsedDateFrom !== undefined &&
          !this.selected) ||
        (data.date > parsedDateFrom && data.date < parsedDateTo)
      ) {
        this.hovered = true;
      }
    }
  }

  _onClick() {
    dispatchCustomEvent(this, 'select', { date: this.data.date });
  }

  _onMouseOver() {
    dispatchCustomEvent(this, 'hover', { date: this.data.date });
  }

  isDisabled() {
    if (this.data && this.data.date) {
      return isInvalid(this.data.date, this.min, this.max, true, this.disabledDates);
    }
    return false;
  }
}

window.customElements.define('gv-date-picker-cell', GvDatePickerCell);
