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
import { getLanguage, getAvailableLanguages } from '../lib/i18n';
import { LitElement } from 'lit-element';
import { until } from 'lit-html/directives/until';
import { html } from 'lit-html';
import { shouldPolyfill as shouldPolyfillIntlRelativeTimeFormat } from '@formatjs/intl-relativetimeformat/should-polyfill';

const options = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  timeZoneName: 'short',
};

const UNITS = [
  { unit: 'year', duration: 1000 * 60 * 60 * 24 * 365.25 },
  { unit: 'month', duration: 1000 * 60 * 60 * 24 * (365.25 / 12) },
  { unit: 'week', duration: 1000 * 60 * 60 * 24 * 7 },
  { unit: 'day', duration: 1000 * 60 * 60 * 24 },
  { unit: 'hour', duration: 1000 * 60 * 60 },
  { unit: 'minute', duration: 1000 * 60 },
  { unit: 'second', duration: 1000 },
];

/**
 * Component to display a localized humanized relative date (ex: "two minutes ago").
 *
 * ## Details
 * * has @theme facet
 *
 * @prop {String|Number} datetime - Date as ISO string or timestamp.
 * @prop {Boolean} noFuture - Whether a date in future is allowed or not (useful when not sync).
 */
export class GvRelativeTime extends LitElement {
  static get properties() {
    return {
      datetime: { type: String },
      title: { type: String, reflect: true },
      noFuture: { type: Boolean },
      _relativeTime: { type: String, attribute: false },
      _updateIntervalId: { type: String, attribute: false },
    };
  }

  constructor() {
    super();
    this._formatter = null;
  }

  async getFormatter() {
    if (this._formatter == null) {
      if (!shouldPolyfillIntlRelativeTimeFormat()) {
        this._formatter = Intl.RelativeTimeFormat;
        return this._formatter;
      } else {
        // Load the needed polyfills 1st BEFORE loading data
        return import('@formatjs/intl-locale/polyfill')
          .then(() => import('@formatjs/intl-relativetimeformat/polyfill'))
          .then(() =>
            Promise.all([
              ...Object.values(getAvailableLanguages()).map((_lang) => {
                return import(`@formatjs/intl-relativetimeformat/locale-data/${_lang}`);
              }),
            ]),
          )
          .then(() => {
            this._formatter = Intl.RelativeTimeFormat;
            return this._formatter;
          })
          .catch((err) => {
            console.error(err);
            throw new Error('Cannot load @formatjs/intl polyfills');
          });
      }
    } else {
      return this._formatter;
    }
  }

  set datetime(value) {
    value = this.noFuture ? this._formatDateInThePast(value) : value;
    const dtf = new Intl.DateTimeFormat(getLanguage(), options);
    this.title = dtf.format(new Date(value));
    this._datetime = value;
  }

  _formatDateInThePast(date) {
    // to avoid to have date in the future in case of desynchronization between browser and server
    if (date) {
      const now = new Date();
      if (now.getTime() < new Date(date).getTime()) {
        date = now;
      }
    }
    return date;
  }

  async _format(dateStr, lang) {
    const Formatter = await this.getFormatter();
    const format = (value, unit) => {
      if (!isNaN(value)) {
        return new Formatter(lang, { numeric: 'auto' }).format(-value, unit);
      }
    };
    const now = new Date().getTime();
    const diff = now - new Date(dateStr).getTime();

    for (const { unit, duration } of UNITS) {
      const value = diff / duration;
      const roundedValue = Math.round(value);
      if (Math.abs(value) >= 1) {
        return format(roundedValue, unit);
      }
    }
    return format(Math.round(diff / 1000), 'second');
  }

  connectedCallback() {
    if (this.updateIntervalId == null) {
      setTimeout(() => {
        this.performUpdate();
      });
      this.updateIntervalId = setInterval(() => {
        this.performUpdate();
      }, 10 * 1000);
    }
  }

  disconnectedCallback() {
    clearInterval(this.updateIntervalId);
    this.updateIntervalId = null;
  }

  render() {
    return html`<span title="${this.title}">${until(this._format(this._datetime, getLanguage()))}</span>`;
  }
}

window.customElements.define('gv-relative-time', GvRelativeTime);
