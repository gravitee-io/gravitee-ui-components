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
import { html, css } from 'lit';
import { i18n } from '../lib/i18n';
// The default entry point, and its UMD modules, so that a host importing `highcharts` gets the very
// instance these charts draw with: `highcharts` has no `exports` map, and its ESM build is a
// separate object that would silently ignore the host's `setOptions`.
import Highcharts from 'highcharts';
import 'highcharts/modules/map';
import { cache } from 'lit/directives/cache.js';
import { withSkeletonAttribute } from './with-skeleton-attribute';

/**
 * This is a mixin for ChartElement
 * @mixinFunction
 */
export function ChartElement(ParentClass) {
  /**
   * @mixinClass
   */
  return class extends withSkeletonAttribute(ParentClass) {
    static get properties() {
      return {
        /** @required */
        series: { type: Array },
        options: { type: Array },
        _additionalOptions: { type: Object, attribute: false },
        _series: { type: Array, attribute: false },
      };
    }

    static get styles() {
      return [
        ...super.styles,
        // language=CSS
        css`
          :host {
            box-sizing: border-box;
            display: flex;
            height: 100%;
            width: 100%;
            flex-direction: column;
            justify-content: center;
            align-content: center;
          }

          .container {
            flex: 1;
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
        `,
      ];
    }

    constructor() {
      super();
      this._skeletonAttribute = 'series';
      this._eventListener = function eventListener() {
        for (let i = 0; i < Highcharts.charts.length; i++) {
          Highcharts.charts[i].reflow();
        }
      };
    }

    connectedCallback() {
      super.connectedCallback();
      window.addEventListener('resize', this._eventListener);
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      window.removeEventListener('resize', this._eventListener);
    }

    async getOptions() {}

    updated(changedProperties) {
      super.updated(changedProperties);
      if (changedProperties.has('_series')) {
        this.getOptions()
          .then((options) => {
            this._additionalOptions = options;
          })
          .catch((err) => {
            console.warn(err);
            // A chart that cannot build its options says so, rather than leaving a skeleton behind.
            this._error = true;
            this._skeleton = false;
            this._empty = false;
          });
      }
    }

    render() {
      if (this._error) {
        return html` <div class="error">${i18n('gv-chart.error')}</div>`;
      }
      if (this._empty) {
        return html` <div class="empty">${i18n('gv-chart.empty')}</div>`;
      }

      const container = document.createElement('div');
      container.id = 'container';
      container.className = this._skeleton || this._additionalOptions == null ? 'skeleton' : '';
      container.classList.add('container');

      if (this._additionalOptions) {
        const options = {
          ...{
            chart: {
              height: '100%',
              width: '100%',
            },
            // Highcharts declares its colours as CSS variables under `:root`, which matches nothing
            // inside a shadow root: every one of them would fall back to black. Asking for a palette
            // other than the default makes it scope them to the chart's own `<defs>`, in the same
            // shadow tree. `light` rather than the default `light dark`, so that a component library
            // does not silently repaint its host's charts on an operating system set to dark.
            palette: {
              colorScheme: 'light',
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
          this._chart = options.chart.map ? Highcharts.mapChart(container, options) : Highcharts.chart(container, options);
        });
      }

      return html`${cache(container)}`;
    }
  };
}
