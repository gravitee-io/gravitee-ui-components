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
import '../../src/atoms/gv-autocomplete';
import '../../src/atoms/gv-input';
import '../../src/atoms/gv-image';
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { Page, querySelector } from '../lib/test-utils';

describe('A U T O C O M P L E T E', () => {

  let page;

  beforeEach(() => {
    page = new Page();
    page.create('gv-autocomplete', {
      innerHTML: '<gv-input></gv-input>',
    });
  });

  afterEach(() => {
    page.clear();
  });

  test('should create element', () => {
    expect(window.customElements.get('gv-autocomplete')).toBeDefined();
    const component = querySelector('gv-autocomplete');
    expect(component).toBeDefined();
    expect(component.innerHTML).toEqual('<gv-input no-submit="true" valid="" value=""></gv-input>');
  });

  test('should catch `gv-autocomplete:search` event when input dispatch input event', (done) => {
    const component = querySelector('gv-autocomplete');

    component.addEventListener('gv-autocomplete:search', (event) => {
      expect(event).toBeDefined();
      expect(event.detail).toEqual(input.value);
      done();
    });

    const input = component._getInput();
    input.value = 'foobar';
    input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
  });

  test('should reset options when input dispatch input event with empty value', () => {
    const component = querySelector('gv-autocomplete');
    component.options = [{ value: 1 }, { value: 2 }, { value: 3 }];

    const input = component._getInput();
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));

    expect(component.options).toEqual([]);

  });

  test('should catch `gv-autocomplete:search` event when input dispatch input event with empty value', (done) => {
    const component = querySelector('gv-autocomplete');
    component.minChars = 0;

    component.addEventListener('gv-autocomplete:search', (event) => {
      expect(event).toBeDefined();
      expect(event.detail).toEqual(input.value);
      done();
    });

    const input = component._getInput();
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
  });

});
