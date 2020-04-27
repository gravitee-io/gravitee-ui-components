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
import { html } from 'lit-html';
import { skeleton } from '../styles/skeleton';
import { css } from 'lit-element';
import { i18n } from '../lib/i18n';
import Highcharts from 'highcharts';
import Highmaps from 'highcharts/highmaps';
import { cache } from 'lit-html/directives/cache';

/**
 * This is a mixin for ChartElement
 * @mixinFunction
 */
export function ChartElement (ParentClass) {

  /**
   * @mixinClass
   */
  return class extends ParentClass {

    static get properties () {
      return {
        /** @required */
        series: { type: Array },
        options: { type: Array },
        _additionalOptions: { type: Object, attribute: false },
        _series: { type: Array, attribute: false },
        _skeleton: { type: Boolean, attribute: false },
        _error: { type: Boolean, attribute: false },
        _empty: { type: Boolean, attribute: false },
      };
    }

    static get styles () {
      return [
        skeleton,
        // language=CSS
        css`
          .error {
            align-items: center;
            display: flex;
            height: 100%;
            justify-content: center;
          }

          .tooltip {
             display: grid;
           }

          .tooltip-2 {
            grid-template-columns: repeat(2, 1fr);
          }

          .tooltip-3 {
            grid-template-columns: repeat(3, 1fr);
          }

          .tooltip-4 {
            grid-template-columns: repeat(4, 1fr);
          }

          .tooltip-5 {
            grid-template-columns: repeat(5, 1fr);
          }

          .empty, .error {
            align-items: center;
            display: grid;
            font-weight: 600;
            font-size: var(--gv-theme-font-size-xl, 26px);
            text-align: center;
            color: var(--gv-theme-color-dark, #193E34);
            opacity: 0.5;
            padding: 41px;
          }
        `,
      ];
    }

    constructor () {
      super();
      this._skeleton = false;
      this._error = false;
      this._empty = false;

      this._eventListener = function eventListener () {
        for (let i = 0; i < Highcharts.charts.length; i++) {
          Highcharts.charts[i].reflow();
        }
      };
    }

    connectedCallback () {
      super.connectedCallback();
      window.addEventListener('resize', this._eventListener);
    }

    disconnectedCallback () {
      super.disconnectedCallback();
      window.removeEventListener('resize', this._eventListener);
    }

    set series (series) {
      this._skeleton = true;
      Promise.resolve(series)
        .then((series) => {
          if (series) {
            this._empty = (series && Object.keys(series).length === 0)
              || (series.values && Object.keys(series.values).length === 0)
              || (series.values && !Object.values(series.values).find((v) => v !== 0))
              || (series.values && series.values[0] && series.values[0].buckets.length === 0);
            this._series = series;
            this.getOptions().then((options) => {
              this._additionalOptions = options;
              this._skeleton = false;
            });
          }
        })
        .catch(() => {
          this._error = true;
          this._skeleton = false;
          this._series = [];
        });
    }

    async getOptions () {}

    render () {

      if (this._error) {
        return html`<div class="error">${i18n('gv-chart.error')}</div>`;
      }
      if (this._empty) {
        return html`<div class="empty">${i18n('gv-chart.empty')}</div>`;
      }

      const container = document.createElement('div');
      container.id = 'container';
      container.className = this._skeleton || this._additionalOptions == null ? 'skeleton' : '';
      container.style = 'height: 100%; width: 100%;';

      if (this._additionalOptions) {
        const options = {
          ...{
            chart: {
              height: '100%',
              width: '100%',
            },
            credits: {
              enabled: false,
            },
            title: {
              text: '',
            },
            time: {
              useUTC: false,
            },
          },
          ...this._additionalOptions,
        };

        const hasData = this._series && this._series.values && this._series.values[0] && this._series.values[0].data;
        if (hasData) {
          options.series = this._series && this._series.values;
        }

        setTimeout(() => {
          if (options.chart.map) {
            Highmaps.mapChart(container, options);
          }
          else {
            Highcharts.chart(container, options);
          }
        });
      }

      return html`${cache(container)}`;
    }
  };
}
