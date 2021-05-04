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
import { ChartElement } from '../mixins/chart-element';

/**
 * Histogram chart component
 *
 * @attr {Array} series - The series to display on the histogram chart.
 * @attr {Object} options - The list of options to display.
 *
 */
export class GvChartHistogram extends ChartElement(LitElement) {
  async getOptions() {
    let categories = [];
    let yAxisTitle;
    let title;
    let subtitle;
    let max;
    let min = 0;

    if (this.options) {
      yAxisTitle = this.options.yAxisTitle;
      title = this.options.title;
      subtitle = this.options.subtitle;
      categories = this.options.data.values || [];
      min = this.options.min;
      max = this.options.max;
    }

    if (this._series && this._series.values && this._series.values.length === 0) {
      this._empty = true;
    }

    return {
      chart: {
        type: 'column',
      },
      title: {
        text: title,
        align: 'left',
        style: { fontSize: '12px', fontWeight: '700' },
      },
      subtitle: {
        text: subtitle,
        align: 'left',
        style: { fontSize: '11px', color: '#000000', opacity: '0.54' },
      },
      series: this._series.values,
      xAxis: {
        categories: categories,
      },
      legend: {
        enabled: false,
      },
      yAxis: {
        min,
        max,
        title: {
          text: yAxisTitle,
        },
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      tooltip: {
        pointFormat: 'Value: <b>{point.y}</b>',
      },
    };
  }
}

window.customElements.define('gv-chart-histogram', GvChartHistogram);
