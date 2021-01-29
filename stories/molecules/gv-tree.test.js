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
import '../../src/molecules/gv-tree';

describe('<gv-tree>', () => {
  let page;
  let component;

  beforeEach(() => {
    page = new Page();
    component = page.create('gv-tree', {
      items: [
        { name: 'page 1', value: 'p1' },
        { name: 'page 2', value: { id: 'an object', link: 'https://gravitee.io', logo: 'logo' } },
        {
          name: 'folder 1',
          id: 'f1',
          children: [
            { name: 'page 11', value: true },
            { name: 'page 12', value: 1234 },
          ],
        },
        {
          name: 'folder 2',
          id: 'f2',
          children: [
            { name: 'page 21', value: 'p21' },
            { name: 'page 22', value: 'p22' },
            {
              name: 'folder 21',
              id: 'f21',
              children: [
                { name: 'page 211', value: 'p211' },
                { name: 'page 212', value: 'p212' },
              ],
              selected: true,
            },
          ],
        },
      ],
    });
  });

  afterEach(() => {
    page.clear();
  });

  test('should create element', () => {
    expect(window.customElements.get('gv-tree')).toBeDefined();
    expect(component).toEqual(querySelector('gv-tree'));
  });

  test('should expand folder', () => {
    const folder2 = component.items[3];
    const requestUpdateSpy = jest.spyOn(component, 'requestUpdate');

    component._onClick(folder2);

    expect(component.items[3].expanded).toEqual(true);
    expect(requestUpdateSpy).toBeCalled();
  });
});
