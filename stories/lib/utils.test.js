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
import { describe, test, expect } from '@jest/globals';
import { get, set } from 'object-path';
import { flatObject } from '../../src/lib/utils';

describe('U T I L S', () => {
  test('should get simple property with path', () => {
    const a = { b: { c: { d: { e: 'Foobar' } } } };
    expect(get(a, 'b.c.d.e')).toEqual('Foobar');
  });

  test('should get item array with path', () => {
    const a = { b: { c: { d: { e: [1, 2, 3] } } } };
    expect(get(a, 'b.c.d.e.1')).toEqual(2);
  });

  test('should update simple property with path', () => {
    const a = { b: { c: { d: { e: 'Foobar' } } } };
    set(a, 'b.c.d.e', 'Foobar updated');
    expect(get(a, 'b.c.d.e')).toEqual('Foobar updated');
  });

  test('should add simple property with path', () => {
    const a = { b: { c: { d: { e: 'Foobar' } } } };
    set(a, 'b.c.d.f', 'New property');
    expect(a).toEqual({ b: { c: { d: { e: 'Foobar', f: 'New property' } } } });
    expect(get(a, 'b.c.d.f')).toEqual('New property');
  });

  test('should flat object', () => {
    const obj = {
      body: '<xml></xml>',
      'path-operator': {
        operator: 'EQUALS',
        path: '/foobar',
      },
      resources: 'my-resource',
      timeToLiveSeconds: 50,
      useResponseCacheHeaders: true,
      select: 'b',
      multiselect: ['a', 'b', 'c'],
    };

    const flatObj = flatObject(obj);
    expect(flatObj).toEqual({
      body: '<xml></xml>',
      multiselect: ['a', 'b', 'c'],
      'path-operator.operator': 'EQUALS',
      'path-operator.path': '/foobar',
      resources: 'my-resource',
      select: 'b',
      timeToLiveSeconds: 50,
      useResponseCacheHeaders: true,
    });

    expect(get(flatObj, 'multiselect')).toEqual(['a', 'b', 'c']);
  });
});
