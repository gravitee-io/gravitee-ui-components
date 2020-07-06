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
import { afterEach, beforeEach, describe, expect, test, jest } from '@jest/globals';
import { Page, querySelector } from '../lib/test-utils';
import '../../src/atoms/gv-button';

describe('B U T T O N', () => {

  describe('<gv-button>', () => {

    let page;

    beforeEach(() => {
      page = new Page();
      page.create('gv-button', {
        innerHTML: 'FOOBAR',
      });
    });

    afterEach(() => {
      page.clear();
    });

    test('should create element', () => {
      expect(window.customElements.get('gv-button')).toBeDefined();
      const component = querySelector('gv-button');
      expect(component).toBeDefined();
      expect(component.innerHTML).toEqual('FOOBAR');
      expect(component.tabIndex).toEqual(0);
    });

    test('should dispatch `gv-button:click` event when clicked', () => {
      const component = querySelector('gv-button');
      const mockFn = jest.fn();

      component.addEventListener('gv-button:click', mockFn);

      component.click();

      expect(mockFn).toBeCalled();
    });

  });

  describe('<gv-button type="submit">', () => {

    let page;

    beforeEach(() => {
      page = new Page('form');
      page.create('gv-button', {
        innerHTML: 'Submit action',
        type: 'submit',
      });
    });

    afterEach(() => {
      page.clear();
    });

    test('should dispatch `submit` event on form when clicked', () => {
      const component = querySelector('gv-button');
      const mockFn = jest.fn();

      page.addEventListener('submit', mockFn);

      component.click();

      expect(mockFn).toBeCalled();
    });

  });

});
