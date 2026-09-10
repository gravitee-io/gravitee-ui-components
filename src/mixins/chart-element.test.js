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
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import Highcharts from 'highcharts';
import { Page } from '../../testing/lib/test-utils';
import '../charts/gv-chart-bar';

const series = { values: { INFO: 152460, WARNING: 27567, CRITICAL: 21000 } };
const options = {
  data: [
    { name: 'INFO', color: '#54a3ff' },
    { name: 'WARNING', color: '#ff9f40' },
  ],
};

const paletteOf = (component) =>
  Array.from(component.shadowRoot.querySelectorAll('style'))
    .map((style) => style.textContent)
    .join('\n');

describe('C H A R T  E L E M E N T', () => {
  let page;
  let component;

  beforeEach(async () => {
    page = new Page();
    component = page.create('gv-chart-bar', { series, options });
    // The value reaches the chart through the skeleton timers, and `render` then builds it from a
    // `setTimeout` of its own, so the chart is not there when the first update ends.
    for (let round = 0; round < 50 && component._chart == null; round++) {
      await component.updateComplete;
      await new Promise((resolve) => setTimeout(resolve));
    }
  });

  afterEach(() => {
    page.clear();
  });

  // The charts live in a shadow root, where `:root` matches nothing: left to its default palette,
  // Highcharts declares its colours there and every one of them falls back to black. Asking for a
  // palette other than the default is what makes it scope them to the chart itself, and that rests
  // on an internal "is this the default palette" check rather than on a documented option.
  test('should scope its colours to the chart rather than to :root', () => {
    const palette = paletteOf(component);

    expect(palette).toContain(`*[data-highcharts-chart="${component._chart.index}"]`);
    expect(palette).not.toContain(':root');
  });

  test('should declare plain colours before the light-dark() ones', () => {
    const palette = paletteOf(component);

    // Browsers without `light-dark()` fall back to this first block, so it has to hold real colours.
    const beforeSupports = palette.slice(0, palette.indexOf('@supports'));
    expect(beforeSupports).toContain('--highcharts-background-color: #ffffff;');
    expect(beforeSupports).not.toContain('light-dark(');
  });

  test('should leave the document alone', () => {
    expect(document.head.querySelector('style.highcharts-palette')).toBeNull();
  });

  test('should draw with the instance a consumer imports', () => {
    expect(Highcharts.charts).toContain(component._chart);
    // The map and gauge modules attach to that same instance.
    expect(typeof Highcharts.mapChart).toEqual('function');
  });
});
