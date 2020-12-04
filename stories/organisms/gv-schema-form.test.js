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
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { Page, querySelector, since } from '../lib/test-utils';
import '../../src/organisms/gv-schema-form';
import mixed from '../resources/schemas/mixed.json';
import { deepClone } from '../../src/lib/utils';

describe('S C H E M A  F O R M', () => {

  let page;
  let component;

  beforeEach(() => {
    page = new Page();
    component = page.create('gv-schema-form', {
      schema: mixed,
    });
  });

  afterEach(() => {
    page.clear();
  });

  const checkControl = (id, attributes = []) => {
    const element = component.getControl(id);

    since(`Element [id="${id}"] not found`, () => expect(element).not.toBeNull());

    const expectedAttributes = Array.isArray(attributes) ? attributes : Object.keys(attributes);

    expectedAttributes.forEach((attr) => {
      since(`Element [id="${id}"] not have attr [${attr}]`, () => expect(element[attr]).toBeTruthy());
      if (attributes[attr] != null) {
        expect(element[attr]).toEqual(attributes[attr]);
      }
    });
  };

  test('should create element', (done) => {
    expect(window.customElements.get('gv-schema-form')).toBeDefined();
    expect(component).toEqual(querySelector('gv-schema-form'));

    component.updateComplete.then(() => {
      expect(component.getControls().map((e) => e.id)).toEqual([
        'body',
        'path-operator',
        'resources',
        'attributes',
        'timeToLiveSeconds',
        'useResponseCacheHeaders',
        'select',
        'multiselect',
      ]);

      checkControl('body');
      checkControl('path-operator');
      checkControl('resources');
      checkControl('timeToLiveSeconds');
      checkControl('useResponseCacheHeaders');
      checkControl('select');
      checkControl('multiselect');
      done();
    });

  });

  test('should create element with valid values', (done) => {

    component.values = {
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
      attributes: [{ name: 'foo', value: 'bar' }],
    };

    component.updateComplete.then(() => {
      setTimeout(() => {
        expect(component.getControls().map((e) => e.id)).toEqual([
          'body',
          'path-operator',
          'resources',
          'attributes',
          'timeToLiveSeconds',
          'useResponseCacheHeaders',
          'select',
          'multiselect',
        ]);

        checkControl('body', { value: '<xml></xml>' });
        checkControl('path-operator', { value: { operator: 'EQUALS', path: '/foobar' } });
        checkControl('resources', { value: 'my-resource' });
        checkControl('timeToLiveSeconds', { value: 50 });
        checkControl('useResponseCacheHeaders', {});
        checkControl('select', { value: 'b' });
        checkControl('multiselect', { value: ['a', 'b', 'c'] });
        checkControl('attributes', { value: [{ name: 'foo', value: 'bar' }] });
        done();
      }, 0);

    });
  });

  test('should create element with invalid values', (done) => {

    component.values = {
      body: '<xml></xml>',
      'path-operator': {
        operator: 'Fake value',
        path: 'not a path',
      },
      resources: 'my-resource',
      timeToLiveSeconds: 'not number',
      useResponseCacheHeaders: true,
      select: 'b',
      multiselect: ['a', 'b', 'c'],
      attributes: [{ name: 'foo', value: '' }, {}],
    };

    component.updateComplete.then(() => {
      setTimeout(() => {
        checkControl('body', { value: '<xml></xml>' });
        checkControl('path-operator', { value: { operator: 'Fake value', path: 'not a path' } });
        checkControl('resources', { value: 'my-resource' });
        checkControl('timeToLiveSeconds', { value: 'not number' });
        checkControl('useResponseCacheHeaders', {});
        checkControl('select', { value: 'b' });
        checkControl('multiselect', { value: ['a', 'b', 'c'] });
        checkControl('attributes', { value: [{ name: 'foo', value: '' }, {}] });
        done();
      }, 0);
    });
  });

  test('should update values & dirty state when user change the form', () => {
    component.values = {
      timeToLiveSeconds: 5,
      body: '<xml></xml>',
    };
    expect(component.dirty).toBeUndefined();
    const detail = { control: { type: 'integer' }, value: '16', currentTarget: { id: 'timeToLiveSeconds' } };
    component._onChange({ detail });

    expect(component.dirty).toEqual(true);
    expect(component.values.timeToLiveSeconds).toEqual(16);
  });

  test('should catch event when submit form', (done) => {
    const values = {
      timeToLiveSeconds: 5,
      body: '<xml></xml>',
    };
    component.values = values;

    component.addEventListener('gv-schema-form:submit', ({ detail }) => {
      expect(detail.values).toEqual(values);
      done();
    });

    component._onSubmit();

  });

  test('should catch custom event after create control', (done) => {

    component = page.create('gv-schema-form', {
      schema: mixed,
    });

    component.addEventListener('gv-schema-form:fetch-data', ({ detail }) => {
      expect(detail.name).toEqual('fetch-data');
      expect(detail.currentTarget.tagName.toLowerCase()).toEqual('gv-autocomplete');
      done();
    });

  });

  test('should submit form when values respect constraints', (done) => {
    component.values = {
      'path-operator': {
        operator: 'STARTS_WITH',
        path: '/my-path',
      },
      timeToLiveSeconds: 5,
      multiselect: ['a'],
    };

    component.updateComplete.then(() => {
      component.dirty = true;
      expect(component.canSubmit()).toBeTruthy();
      done();
    });
  });

  test('should not submit form when required values are empty', (done) => {
    component.updateComplete.then(() => {
      component.dirty = true;
      expect(component.canSubmit()).toBeFalsy();
      done();
    });

  });

  test('should reset initial values', () => {
    const preventDefault = jest.fn();
    const stopPropagation = jest.fn();
    const values = {
      'path-operator': {
        operator: 'STARTS_WITH',
        path: '/my-path',
      },
      timeToLiveSeconds: 5,
      multiselect: ['a'],
    };
    component.values = deepClone(values);

    const pathOperatorControl = component.getControl('path-operator');
    expect(pathOperatorControl).not.toBeNull();
    pathOperatorControl._onInput({
      preventDefault,
      stopPropagation,
      target: { id: 'path-operator.path' },
      detail: '/updated-path',
    });

    const timeToLiveSeconds = component.getControl('timeToLiveSeconds');
    expect(timeToLiveSeconds).not.toBeNull();
    pathOperatorControl._onInput({
      preventDefault,
      stopPropagation,
      target: { id: 'timeToLiveSeconds' },
      detail: 12,
    });

    const multiselect = component.getControl('multiselect');
    multiselect._onInput({
      preventDefault,
      stopPropagation,
      target: { id: 'multiselect' },
      detail: ['a', 'b'],
    });

    expect(component.values).toEqual({
      'path-operator': {
        operator: 'STARTS_WITH',
        path: '/updated-path',
      },
      timeToLiveSeconds: 12,
      multiselect: ['a', 'b'],
    });

    component.reset();

    expect(component.values).toEqual(values);

  });

});
