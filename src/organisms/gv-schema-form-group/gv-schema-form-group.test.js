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
import { Page, querySelector, since } from '../../../testing/lib/test-utils';
import './gv-schema-form-group';
import mixed from '../../../testing/resources/schemas/mixed.json';
import fieldsDependencies from '../../../testing/resources/schemas/fields-dependencies.json';
import fieldsConditional from '../../../testing/resources/schemas/fields-conditional.json';
import httpConnector from '../../../testing/resources/schemas/http-connector.json';
import { deepClone } from '../../lib/utils';

describe('S C H E M A  F O R M  G R O U P', () => {
  let page;
  let component;

  beforeEach(async () => {
    page = new Page();
    component = page.create('gv-schema-form-group', {
      schema: mixed,
    });
    await component.updateComplete;
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
    'hidden-with-condition',
    'hidden',
    'readonly',
    'writeonly',
    'whitelist',
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

  test('should create element', async () => {
    expect(window.customElements.get('gv-schema-form-group')).toBeDefined();
    expect(component).toEqual(querySelector('gv-schema-form-group'));

    await component.updateComplete;

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
    checkControl('whitelist');
  });

  test('should create element with valid value', async () => {
    component.value = {
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
      hidden: 'not visible',
    };

    component.requestUpdate();
    await component.updateComplete;

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
    checkControl('hidden', { value: 'not visible', hidden: true });
    checkControl('whitelist', {});
  });

  test('should disable element if "select" is "a"', async () => {
    component.value = {
      select: 'a',
      disabled: 'Simple Test',
    };
    component.requestUpdate();

    await component.updateComplete;

    expect(component.getControls().map((e) => e.id)).toEqual(mixedControls);

    checkControl('disabled', { value: 'Simple Test' });

    expect(component.getControl('disabled').disabled).toBeTruthy();
  });

  test('should not disable element if "select" is not "a"', async () => {
    component.value = {
      select: 'b',
      disabled: 'Simple Test',
    };
    component.requestUpdate();

    await component.updateComplete;

    expect(component.getControls().map((e) => e.id)).toEqual(mixedControls);

    checkControl('disabled', { value: 'Simple Test' });

    expect(component.getControl('disabled').disabled).toBeFalsy();
  });

  test('should create element with invalid value', async () => {
    component.value = {
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

    await component.updateComplete;

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
  });

  test('should update value & dirty state when user change the form', () => {
    component.value = {
      timeToLiveSeconds: 5,
      body: '<xml></xml>',
    };
    expect(component.dirty).toBeUndefined();
    const detail = { control: { type: 'integer' }, value: '16', currentTarget: { id: 'timeToLiveSeconds' } };
    component._onChange({ detail });

    expect(component.dirty).toEqual(true);
    expect(component.value.timeToLiveSeconds).toEqual(16);
  });

  test('should catch custom event after create control', (done) => {
    component = page.create('gv-schema-form-group', {
      schema: mixed,
    });

    let nbOfEmittedEvents = 0;
    component.addEventListener('gv-schema-form-group:fetch-data', ({ detail }) => {
      nbOfEmittedEvents++;
      expect(detail.name).toEqual('fetch-data');
      expect(detail.currentTarget.tagName.toLowerCase()).toEqual('gv-autocomplete');
      if (nbOfEmittedEvents === 2) {
        done();
      }
    });
  });

  test('should reset initial value', (done) => {
    const preventDefault = jest.fn();
    const stopPropagation = jest.fn();
    const value = {
      'path-operator': {
        operator: 'STARTS_WITH',
        path: '/my-path',
      },
      timeToLiveSeconds: 5,
      multiselect: ['a'],
    };
    component.value = deepClone(value);
    component.updateComplete.then(() => {
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

      expect(component.value).toEqual({
        'path-operator': {
          operator: 'STARTS_WITH',
          path: '/updated-path',
        },
        readonly: 'Should not edit my value',
        timeToLiveSeconds: 12,
        writeonly: 'Should not read my value',
        multiselect: ['a', 'b'],
      });

      component.reset();

      expect(component.value).toEqual(value);
      done();
    });
  });

  test('should remove value with empty string & empty array', (done) => {
    const preventDefault = jest.fn();
    const stopPropagation = jest.fn();
    const value = {
      'path-operator': {
        operator: 'STARTS_WITH',
        path: '/my-path',
      },
      timeToLiveSeconds: 5,
      multiselect: ['a'],
      whitelist: [
        {
          pattern: 'abc',
          methods: [],
        },
      ],
    };
    component.value = deepClone(value);

    component.updateComplete.then(() => {
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

      const whitelist = component.getControl('whitelist');
      whitelist._onInput({
        preventDefault,
        stopPropagation,
        target: { id: 'whitelist' },
        detail: [],
      });

      expect(component.value).toEqual({
        'path-operator': {
          operator: 'STARTS_WITH',
        },
        readonly: 'Should not edit my value',
        writeonly: 'Should not read my value',
        multiselect: [],
      });

      done();
    });
  });

  test('should validate schema with dependencies form', () => {
    component.schema = fieldsDependencies;

    component.value = {
      'path-operator': {
        operator: 'EQUALS',
        path: '/foobar',
      },
    };

    component.validate();
    expect(component.errors).toEqual([]);

    component.value = {
      'path-operator': {
        operator: 'EQUALS',
        path: '/foobar',
      },
      select: 'a',
    };

    component.validate();
    expect(component.errors).toEqual([
      {
        path: [],
        property: 'instance',
        message: 'property timeToLiveSeconds not found, required by instance.select',
        schema: 'story',
        instance: {
          'path-operator': {
            operator: 'EQUALS',
            path: '/foobar',
          },
          select: 'a',
        },
        name: 'dependencies',
        argument: 'instance.select',
        stack: 'instance property timeToLiveSeconds not found, required by instance.select',
      },
    ]);
  });

  test('should validate schema with oneOf', () => {
    component.schema = fieldsDependencies;

    component.value = {
      select: 'a',
      'path-operator': {
        operator: 'EQUALS',
        path: '/foobar',
      },
      timeToLiveSeconds: 2,
    };

    component.validate();
    expect(component.errors).toEqual([
      {
        path: ['timeToLiveSeconds'],
        property: 'instance.timeToLiveSeconds',
        message: 'is not exactly one from [subschema 0],[subschema 1]',
        schema: {
          title: 'Time to live (in seconds)',
          default: 600,
          description: 'Required only if select has value',
          type: 'integer',
          minimum: 0,
          maximum: 1000,
          oneOf: [
            {
              type: 'number',
              multipleOf: 5,
            },
            {
              type: 'number',
              multipleOf: 3,
            },
          ],
        },
        instance: 2,
        name: 'oneOf',
        argument: ['[subschema 0]', '[subschema 1]'],
        stack: 'instance.timeToLiveSeconds is not exactly one from [subschema 0],[subschema 1]',
      },
    ]);
  });

  test('should validate schema with conditions and custom error message', () => {
    component.schema = fieldsConditional;

    component.value = {};

    component.validate();
    expect(component.errors).toEqual([]);

    component.value = {
      type: 'b',
      path: 'file://',
      content: 'binary',
    };

    component.validate();
    expect(component.errors).toEqual([]);

    component.value = {
      type: 'c',
      path: 'file://',
      content: 'binary',
    };

    component.validate();
    expect(component.errors).toEqual([]);
  });

  test('should validate complex schema', () => {
    component.schema = httpConnector;

    component.value = {};
    component.validate();
    expect(component.errors).toEqual([]);

    component.value = {
      ssl: {
        trustStore: {
          type: 'PEM',
        },
      },
    };
    component.validate();
    expect(component.errors[0].message).toEqual(
      'A path or a content is <span class="error">required</span> - for JKS and PKCS#12 a password is also <span class="error">required</span>',
    );
  });

  test('should validate with additional properties', () => {
    component.value = {
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
      'property-to-keep': 'value',
      'property-to-remove': 'yeah',
    };
    component.validate();
    expect(component.errors).toEqual([]);
  });
});
