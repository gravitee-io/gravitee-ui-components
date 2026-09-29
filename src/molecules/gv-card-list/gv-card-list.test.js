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
import { Page } from '../../../testing/lib/test-utils';
import { GvCardList } from './gv-card-list';

// jsdom has no layout engine, so the column count cannot be measured: the stylesheet is checked instead
function cssRules() {
  const style = document.createElement('style');
  style.textContent = GvCardList.styles.map((result) => result.cssText).join('\n');
  document.head.appendChild(style);
  const rules = Array.from(style.sheet.cssRules);
  style.remove();
  return rules;
}

function gridTemplateColumnsOf(selector) {
  const rule = cssRules().find((r) => r.selectorText === selector);
  return rule ? rule.style.getPropertyValue('grid-template-columns') : undefined;
}

describe('<gv-card-list>', () => {
  let page;
  let component;

  beforeEach(async () => {
    page = new Page();
    component = page.create('gv-card-list', {
      items: [{ item: { name: 'Api 1' } }, { item: { name: 'Api 2' } }, { item: { name: 'Api 3' } }],
    });
    await component.updateComplete;
  });

  afterEach(() => {
    page.clear();
  });

  test('should only style elements it renders', async () => {
    // let the first card fade in, so that `.show` is rendered too
    await new Promise((resolve) => setTimeout(resolve));
    const classNames = new Set(cssRules().flatMap((r) => r.selectorText.match(/\.[\w-]+/g) ?? []));

    classNames.forEach((className) => {
      expect({ className, found: component.shadowRoot.querySelector(className) != null }).toEqual({ className, found: true });
    });
  });

  test('should lay cards out in 3 columns that can shrink below their content', () => {
    expect(gridTemplateColumnsOf(':host')).toEqual('repeat(3, minmax(0, 1fr))');
  });

  test('should lay cards out in 2 columns below 1270px', () => {
    expect(gridTemplateColumnsOf(':host([w-lt-1270])')).toEqual('repeat(2, minmax(0, 1fr))');
  });

  test('should stack cards in a single column below 845px', () => {
    expect(gridTemplateColumnsOf(':host([w-lt-845])')).toEqual('minmax(0, 1fr)');
  });
});
