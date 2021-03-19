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
import { LitElement } from 'lit-element';
import '../atoms/gv-button';
import '../atoms/gv-tag';
import { ChartElement } from '../mixins/chart-element';
import { dispatchCustomEvent } from '../lib/events';

/**
 * Bar chart component
 *
 * @fires gv-chart-bar:select - Custom event with selected value
 *
 * @attr {Array} series - The series to display on the bar chart.
 * @attr {Array} options - The list of options to display.
 *
 */
export class GvChartBar extends ChartElement(LitElement) {
  async getOptions() {
    let total = 0;
    const categories = [];
    if (this._series && this._series.values) {
      this.options.data.forEach((data, i) => {
        data.y = this._series.values[this.options.data[i].name] || 0;
        categories.push(data.name);
      });
      this.options.data.forEach((d) => {
        total += d.y;
      });
    }
    if (!total) {
      this._empty = true;
    }
    return {
      chart: {
        type: 'bar',
      },
      series: total === 0 ? [] : [this.options],
      xAxis: {
        categories: categories,
      },
      legend: {
        enabled: false,
      },
      yAxis: {
        allowDecimals: false,
        title: {
          text: null,
        },
        min: 0,
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
          },
        },
        series: {
          animation: false,
          events: {
            click: (event) => {
              event.preventDefault();
              dispatchCustomEvent(this, 'select', event.point.options);
            },
          },
        },
      },
      tooltip: {
        pointFormat: 'Nb hits: <b>{point.y}</b>',
      },
      title: {
        text: 'Total: ' + total,
        useHTML: true,
        align: 'left',
        verticalAlign: 'bottom',
        y: 10,
        style: {
          fontSize: '12px',
          fontWeight: 'bold',
        },
      },
    };
  }
}

window.customElements.define('gv-chart-bar', GvChartBar);
