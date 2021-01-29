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
import { Page, querySelector } from '../lib/test-utils';
import '../../src/atoms/gv-switch';

describe('S W I T C H', () => {
  describe('<gv-switch>', () => {
    let page;
    let component;

    beforeEach(() => {
      page = new Page();
      component = page.create('gv-switch');
    });

    afterEach(() => {
      page.clear();
    });

    test('should create element', () => {
      expect(window.customElements.get('gv-switch')).toBeDefined();
      expect(component).toEqual(querySelector('gv-switch'));
      expect(component.checked).toEqual(false);
    });

    test('should checked with Boolean.TRUE', async () => {
      component.value = true;
      await component.updateComplete;
      expect(component.checked).toEqual(true);
    });

    test('should not checked with Boolean.FALSE', async () => {
      component.value = false;
      await component.updateComplete;
      expect(component.checked).toEqual(false);
    });

    test('should checked with string "true"', async () => {
      component.value = 'true';
      await component.updateComplete;
      expect(component.checked).toEqual(true);
    });

    test('should not checked with string "false"', async () => {
      component.value = 'false';
      await component.updateComplete;
      expect(component.checked).toEqual(false);
    });
  });
});
