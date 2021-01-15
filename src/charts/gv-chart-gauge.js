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
import ChartModuleMore from 'highcharts/highcharts-more';
import Highcharts from 'highcharts';
import HCSolidGauge from 'highcharts/modules/solid-gauge';

/**
 * Gauge chart component
 *
 * @attr {number} max - The maximum value of the gauge.
 * @attr {Array} series - Array of the series to display.
 *
 */
export class GvChartGauge extends ChartElement(LitElement) {

  constructor () {
    super();
    ChartModuleMore(Highcharts);
    HCSolidGauge(Highcharts);
  }

  static get properties () {
    return {
      /** @required */
      max: { type: Number },
      series: { type: Array },
    };
  }

  async getOptions () {
    this._empty = false;
    return {
      chart: {
        type: 'solidgauge',
      },

      tooltip: {
        enabled: false,
      },

      pane: {
        startAngle: 0,
        endAngle: 360,
        background: [{
          outerRadius: '112%',
          innerRadius: '88%',
          backgroundColor: '#fff',
          borderWidth: 0,
        }],
      },

      yAxis: [{
        min: 0,
        max: this.max,
        lineWidth: 0,
        tickPositions: [],
      }],

      plotOptions: {
        solidgauge: {
          dataLabels: {
            enabled: true,
          },
          linecap: 'round',
          stickyTracking: false,
          rounded: true,
        },
      },

      series: this.series,
    };
  }
}

window.customElements.define('gv-chart-gauge', GvChartGauge);
