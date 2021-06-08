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

  const mixedControls = [
    'body',
    'el',
    'body-with-el',
    'path-operator',
    'resources',
    'another-list-resources',
    'attributes',
    'timeToLiveSeconds',
    'useResponseCacheHeaders',
    'select',
    'multiselect',
    'cron',
    'disabled',
  ];

  const checkControl = (id, attributes = []) => {
    const ids = id.split('.');
    const acc = [];
    let element = component.getControl(ids[0]);
    if (ids.length > 1) {
      ids.forEach((_id) => {
        acc.push(_id);
        element = element.getControl(acc.join('.'));
      });
    }

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
      expect(component.getControls().map((e) => e.id)).toEqual(mixedControls);

      checkControl('body');
      checkControl('el');
      checkControl('body-with-el');
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
      body: '<xml>foobar</xml>',
      el: `{#request.headers['Content-Type'][0].toString()}`,
      'body-with-el': `<xml name="{#request.headers['Content-Type'][0].toString()}"></xml>`,
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
      cron: '*/30 * * * * SUN-MON',
      disabled: 'Simple Test',
    };
    component.requestUpdate();

    component.updateComplete.then(() => {
      setTimeout(() => {
        expect(component.getControls().map((e) => e.id)).toEqual(mixedControls);

        checkControl('body', { value: '<xml>foobar</xml>' });
        checkControl('path-operator', { value: { operator: 'EQUALS', path: '/foobar' } });
        checkControl('path-operator.path', { value: '/foobar' });
        checkControl('path-operator.operator', { value: 'EQUALS' });
        checkControl('resources', { value: 'my-resource' });
        checkControl('timeToLiveSeconds', { value: 50 });
        checkControl('useResponseCacheHeaders', {});
        checkControl('select', { value: 'b' });
        checkControl('multiselect', { value: ['a', 'b', 'c'] });
        checkControl('attributes', { value: [{ name: 'foo', value: 'bar' }] });
        checkControl('attributes.0', { value: { name: 'foo', value: 'bar' } });
        checkControl('cron', { value: '*/30 * * * * SUN-MON' });
        checkControl('disabled', { value: 'Simple Test' });
        done();
      }, 0);
    });
  });

  test('should disable element if "select" is "a"', (done) => {
    component.values = {
      select: 'a',
      disabled: 'Simple Test',
    };
    component.requestUpdate();

    component.updateComplete.then(() => {
      setTimeout(() => {
        expect(component.getControls().map((e) => e.id)).toEqual(mixedControls);

        checkControl('disabled', { value: 'Simple Test' });

        expect(component.getControl('disabled').disabled).toBeTruthy();
        done();
      }, 0);
    });
  });

  test('should not disable element if "select" is not "a"', (done) => {
    component.values = {
      select: 'b',
      disabled: 'Simple Test',
    };
    component.requestUpdate();

    component.updateComplete.then(() => {
      setTimeout(() => {
        expect(component.getControls().map((e) => e.id)).toEqual(mixedControls);

        checkControl('disabled', { value: 'Simple Test' });

        expect(component.getControl('disabled').disabled).toBeFalsy();

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
        checkControl('path-operator.path', { value: 'not a path' });
        checkControl('path-operator.operator', { value: 'Fake value' });
        checkControl('resources', { value: 'my-resource' });
        checkControl('timeToLiveSeconds', { value: 'not number' });
        checkControl('useResponseCacheHeaders', {});
        checkControl('select', { value: 'b' });
        checkControl('multiselect', { value: ['a', 'b', 'c'] });
        checkControl('attributes', { value: [{ name: 'foo', value: '' }, {}] });
        checkControl('attributes.0', { value: { name: 'foo', value: '' } });
        checkControl('attributes.1', { value: {} });
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

  test('should catch error event if submit form with invalid values', (done) => {
    const values = {
      body: '<xml>foobar</xml>',
      'path-operator': {
        operator: 'EQUALS',
        path: 'no path',
      },
      resources: 'my-resource',
      timeToLiveSeconds: 50,
      useResponseCacheHeaders: true,
      select: 'b',
      multiselect: [],
      attributes: [{ name: 'foo', value: 'bar' }],
    };
    component.values = values;

    component.addEventListener('gv-schema-form:error', ({ detail }) => {
      expect(detail.values).toEqual(values);
      expect(detail.validatorResults.valid).toBeFalsy();
      expect(detail.validatorResults.errors).toEqual([
        {
          argument: '^/',
          instance: 'no path',
          message: 'does not match pattern "^/"',
          name: 'pattern',
          path: ['path-operator', 'path'],
          property: 'instance.path-operator.path',
          schema: {
            description: 'The path of flow (must start by /)',
            pattern: '^/',
            title: 'Path',
            type: 'string',
            'x-schema-form': {
              placeholder: '/my-path',
            },
          },
          stack: 'instance.path-operator.path does not match pattern "^/"',
        },
      ]);
      done();
    });

    component.submit();
  });

  test('should submit form with valid values', (done) => {
    const values = {
      body: '<xml>foobar</xml>',
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
    component.values = values;

    component.addEventListener('gv-schema-form:submit', ({ detail }) => {
      expect(detail.values).toEqual(values);
      expect(detail.validatorResults.valid).toBeTruthy();
      expect(detail.validatorResults.errors).toEqual([]);
      done();
    });

    component.submit();
  });

  test('should catch custom event after create control', (done) => {
    component = page.create('gv-schema-form', {
      schema: mixed,
    });

    let nbOfEmittedEvents = 0;
    component.addEventListener('gv-schema-form:fetch-data', ({ detail }) => {
      nbOfEmittedEvents++;
      expect(detail.name).toEqual('fetch-data');
      expect(detail.currentTarget.tagName.toLowerCase()).toEqual('gv-autocomplete');
      if (nbOfEmittedEvents === 2) {
        done();
      }
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

    component.validate();

    component.updateComplete.then(() => {
      component._touch = true;
      expect(component.canSubmit()).toBeTruthy();
      done();
    });
  });

  test('should not submit form when required values are empty', (done) => {
    component.validate();

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
    timeToLiveSeconds._onInput({
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

  test('should remove value with empty string & empty array', () => {
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
      detail: '',
    });

    const timeToLiveSeconds = component.getControl('timeToLiveSeconds');
    expect(timeToLiveSeconds).not.toBeNull();
    timeToLiveSeconds._onInput({
      preventDefault,
      stopPropagation,
      target: { id: 'timeToLiveSeconds' },
      detail: '',
    });

    const multiselect = component.getControl('multiselect');
    multiselect._onInput({
      preventDefault,
      stopPropagation,
      target: { id: 'multiselect' },
      detail: [],
    });

    expect(component.values).toEqual({
      'path-operator': {
        operator: 'STARTS_WITH',
      },
    });
  });
});
