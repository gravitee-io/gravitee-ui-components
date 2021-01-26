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
import '../../src/molecules/gv-cron-editor';

describe('<gv-cron-editor>', () => {

  let page;
  const DEFAULT_VALUE = '*/60 * * * * *';

  beforeEach(() => {
    page = new Page();
    page.create('gv-cron-editor', {
      value: DEFAULT_VALUE,
    });
  });

  afterEach(() => {
    page.clear();
  });

  test('should create element', () => {
    expect(window.customElements.get('gv-cron-editor')).toBeDefined();
    const component = querySelector('gv-cron-editor');
    expect(component).toBeDefined();
    expect(component.value).toEqual(DEFAULT_VALUE);
  });

});
