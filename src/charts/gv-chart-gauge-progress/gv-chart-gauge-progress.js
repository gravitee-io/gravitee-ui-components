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
import { GvChartGauge } from '../gv-chart-gauge';

/**
 * Gauge chart component
 *
 * ⚠️ This component is based on `highcharts`.
 * To use this component in your project be sure the dependency is installed or
 * install it with: `npm install highcharts --save`
 *
 * @attr {number} max - The time remaining in milliseconds
 * @attr {Array} series - Array of the series to display.
 * @attr {Object} tooltip - The list of tooltip attributes to overwrite.
 * @attr {Object} pane - The pane serves as a container for axes and backgrounds for circular gauges and polar charts.
 */
export class GvChartGaugeProgress extends GvChartGauge {
  connectedCallback() {
    super.connectedCallback();
    this.start();
  }

  start() {
    this.startedAt = Date.now();
    this.updatePoint(0);
    requestAnimationFrame(this.updateProgress.bind(this));
  }

  updateProgress() {
    const elapsedTime = Date.now() - this.startedAt;
    this.updatePoint(elapsedTime);
    if (elapsedTime > 0 && elapsedTime < this.max) {
      // Queue the next frame
      requestAnimationFrame(this.updateProgress.bind(this));
    }
  }

  updatePoint(playback) {
    if (this._chart) {
      const point = this._chart.series[0].points[0];
      point.update(playback);
    }
  }

  async getOptions() {
    const options = await super.getOptions();

    const max = this.max;
    options.series[0].dataLabels = [
      {
        enabled: true,
        align: 'center',
        verticalAlign: 'middle',
        formatter: function () {
          if (this.y >= max) {
            return `Done !`;
          }
          const remainingTime = Math.ceil((max - this.y) / 60000);
          return `${remainingTime} min remaining...`;
        },
        borderWidth: 0,
        style: {
          fontSize: '16px',
        },
      },
    ];

    return options;
  }
}

window.customElements.define('gv-chart-gauge-progress', GvChartGaugeProgress);