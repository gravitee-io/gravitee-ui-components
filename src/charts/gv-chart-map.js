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
import Highcharts from 'highcharts';
import { dispatchCustomEvent } from '../lib/events';

/**
 * Map chart component
 *
 * @fires gv-chart-map:select - Custom event with selected value
 *
 * @attr {Array} series - The series to display on the map chart.
 * @attr {Array} options - The list of options to display.
 *
 */
export class GvChartMap extends ChartElement(LitElement) {
  async getOptions() {
    const data = [];
    if (this._series && this._series.values) {
      Object.keys(this._series.values).forEach((k) => {
        if (!this.options.excludedKeys || (this.options.excludedKeys && !this.options.excludedKeys.includes(k))) {
          data.push({ key: k, value: this._series.values[k] });
        }
      });
    }
    let key, map;
    if (this.options.zone) {
      const zone = this.options.zone.toLowerCase();
      key = 'name';
      map = await import('@highcharts/map-collection/countries/' + zone.substring(0, 2) + '/' + zone + '-all.geo.json');
    } else {
      key = 'hc-a2';
      map = await import('@highcharts/map-collection/custom/world.geo.json');
    }
    return {
      chart: {
        map,
      },
      mapNavigation: {
        enabled: true,
        enableMouseWheelZoom: false,
      },
      legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'bottom',
      },
      colorAxis: {
        min: 0,
        stops: [
          [0, '#EFEFFF'],
          [0.5, Highcharts.getOptions().colors[0]],
          [1, Highcharts.Color(Highcharts.getOptions().colors[0]).brighten(-0.5).get()],
        ],
      },
      series: [
        {
          data,
          joinBy: [key, 'key'],
          name: this.options.name,
          dataLabels: {
            enabled: true,
            formatter: function () {
              return key === 'name' ? this.point[key] : '';
            },
          },
          states: {
            hover: {
              color: '#a4edba',
              borderColor: 'gray',
            },
          },
          nullColor: '#eaecfd',
          point: {
            events: {
              click: (event) => {
                event.preventDefault();
                dispatchCustomEvent(this, 'select', event.point.properties);
              },
            },
          },
        },
      ],
      tooltip: {
        headerFormat: '',
        pointFormat: '<b>{point.name}:</b> {point.value}',
      },
    };
  }
}

window.customElements.define('gv-chart-map', GvChartMap);
