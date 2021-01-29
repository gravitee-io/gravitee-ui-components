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
import '../../src/atoms/gv-select';

describe('S E L E C T', () => {
  describe('<gv-select>', () => {
    let page;
    let component;

    beforeEach(() => {
      page = new Page();
      component = page.create('gv-select', {
        options: ['a', 1, true],
      });
    });

    afterEach(() => {
      page.clear();
    });

    test('should create element', () => {
      expect(window.customElements.get('gv-select')).toBeDefined();
      expect(component).toEqual(querySelector('gv-select'));
    });

    test('should has valid attribute when value is defined and required', (done) => {
      component.required = true;
      component.multiple = true;
      component.value = ['a'];

      component.updateComplete.then(() => {
        expect(component.valid).toBeTruthy();
        expect(component.invalid).toBeFalsy();
        done();
      });
    });

    test('should has invalid attribute when value is empty and required', (done) => {
      component.required = true;
      component.multiple = true;
      component.value = [];

      component.updateComplete.then(() => {
        expect(component.invalid).toBeTruthy();
        expect(component.valid).toBeFalsy();
        done();
      });
    });
  });
});
