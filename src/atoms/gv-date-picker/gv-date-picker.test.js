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
import { Page, querySelector } from '../../../testing/lib/test-utils';
import { setLanguage } from '../../lib/i18n';
import './gv-date-picker';

describe('D A T E P I C K E R', () => {
  let page;

  beforeEach(() => {
    page = new Page();
    page.create('gv-date-picker');
  });

  afterEach(() => {
    page.clear();
    setLanguage(undefined);
  });

  test('should create element', () => {
    expect(window.customElements.get('gv-date-picker')).toBeDefined();
    const component = querySelector('gv-date-picker');
    expect(component).toBeDefined();
  });

  describe('getLocale', () => {
    test.each([
      ['en', 'en-US'],
      ['fr', 'fr'],
      ['cs', 'cs'],
      ['it', 'it'],
    ])('should resolve the %s locale without dynamic import', async (lang, expectedCode) => {
      setLanguage(lang);
      const component = querySelector('gv-date-picker');
      const locale = await component.getLocale();
      expect(locale).toBeDefined();
      expect(locale.code).toEqual(expectedCode);
    });

    test('should fall back to en-US for an unsupported language', async () => {
      setLanguage('de');
      const component = querySelector('gv-date-picker');
      const locale = await component.getLocale();
      expect(locale.code).toEqual('en-US');
    });

    test('should fall back to en-US when no language is set', async () => {
      const component = querySelector('gv-date-picker');
      const locale = await component.getLocale();
      expect(locale.code).toEqual('en-US');
    });
  });
});
