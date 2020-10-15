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

  const checkElement = (id, expectedTagName, attributes = []) => {
    const element = component.getElement(id);

    since(`Element [id="${id}"] not found`, () => expect(element).not.toBeNull());
    since(`Element [id="${id}"] not have class control`, () => expect(element.classList.contains('control')).toBeTruthy());
    expect(element.tagName).toEqual(expectedTagName.toUpperCase());

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
      expect(component.getElements().map((e) => e.id)).toEqual([
        'body',
        'path-operator.operator',
        'path-operator.path',
        'resources',
        'timeToLiveSeconds',
        'useResponseCacheHeaders',
        'select',
        'multiselect',
      ]);

      checkElement('body', 'gv-code');
      checkElement('path-operator.operator', 'gv-select');
      checkElement('path-operator.path', 'gv-input', { type: 'text', pattern: '^/' });
      checkElement('resources', 'gv-input', { type: 'text' });
      checkElement('timeToLiveSeconds', 'gv-input', { type: 'number' });
      checkElement('useResponseCacheHeaders', 'gv-switch');
      checkElement('select', 'gv-select');
      checkElement('multiselect', 'gv-select', ['multiple']);
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
        expect(component.getElements().map((e) => e.id)).toEqual([
          'body',
          'path-operator.operator',
          'path-operator.path',
          'resources',
          'attributes.0.name',
          'attributes.0.value',
          'timeToLiveSeconds',
          'useResponseCacheHeaders',
          'select',
          'multiselect',
        ]);

        checkElement('body', 'gv-code', { value: '<xml></xml>' });
        checkElement('path-operator.operator', 'gv-select', { value: 'EQUALS', valid: true });
        checkElement('path-operator.path', 'gv-input', { type: 'text', pattern: '^/', value: '/foobar', valid: true });
        checkElement('resources', 'gv-input', { type: 'text', value: 'my-resource' });
        checkElement('timeToLiveSeconds', 'gv-input', { type: 'number', value: '50', valid: true });
        checkElement('useResponseCacheHeaders', 'gv-switch', { value: true });
        checkElement('select', 'gv-select', { value: 'b' });
        checkElement('multiselect', 'gv-select', { value: ['a', 'b', 'c'], valid: true });
        checkElement('attributes.0.name', 'gv-input', { value: 'foo', valid: true });
        checkElement('attributes.0.value', 'gv-input', { value: 'bar', valid: true });
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
        checkElement('body', 'gv-code', { value: '<xml></xml>' });
        checkElement('path-operator.operator', 'gv-select', { value: 'Fake value', invalid: true });
        checkElement('path-operator.path', 'gv-input', {
          type: 'text',
          pattern: '^/',
          value: 'not a path',
          invalid: true,
        });
        checkElement('resources', 'gv-input', { type: 'text', value: 'my-resource' });
        checkElement('timeToLiveSeconds', 'gv-input', { type: 'number', value: 'not number', invalid: true });
        checkElement('useResponseCacheHeaders', 'gv-switch', { value: true });
        checkElement('select', 'gv-select', { value: 'b' });
        checkElement('multiselect', 'gv-select', { value: ['a', 'b', 'c'], valid: true });
        checkElement('attributes.0.name', 'gv-input', { value: 'foo', valid: true });
        checkElement('attributes.0.value', 'gv-input', { invalid: true });
        checkElement('attributes.1.name', 'gv-input', { invalid: true });
        checkElement('attributes.1.value', 'gv-input', { invalid: true });
        done();
      }, 0);
    });
  });

  test('should update dirty state when user change the form', () => {
    component.values = {
      timeToLiveSeconds: 5,
      body: '<xml></xml>',
    };
    expect(component.dirty).toBeUndefined();

    component._onChange('timeToLiveSeconds', { detail: 6 });

    expect(component.dirty).toEqual(true);
  });

  test('should update values when user change the form', (done) => {
    component.values = {
      timeToLiveSeconds: 5,
      body: '<xml></xml>',
    };

    component._onChange('timeToLiveSeconds', { detail: 6 });
    component.addEventListener('gv-schema-form:change', ({ detail }) => {
      expect(detail.values).toEqual({
        body: '<xml></xml>',
        // Default value
        'path-operator': {
          operator: 'STARTS_WITH',
        },
        timeToLiveSeconds: 6,
      });
      done();
    });

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
      expect(detail.element.tagName.toLowerCase()).toEqual('gv-autocomplete');
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
      expect(component._findOptionalInvalid()).toBeUndefined();
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
    const values = {
      'path-operator': {
        operator: 'STARTS_WITH',
        path: '/my-path',
      },
      timeToLiveSeconds: 5,
      multiselect: ['a'],
    };
    component.values = deepClone(values);

    const pathInput = component.getElement('path-operator.path');
    expect(pathInput).not.toBeNull();
    pathInput.value = '/updated-path';
    /* global CustomEvent */
    pathInput.dispatchEvent(new CustomEvent('gv-input:input', {
      detail: pathInput.value,
      bubbles: true,
      cancelable: true,
    }));

    const timeToLiveSeconds = component.getElement('timeToLiveSeconds');
    expect(timeToLiveSeconds).not.toBeNull();
    timeToLiveSeconds.value = 12;
    timeToLiveSeconds.dispatchEvent(new CustomEvent('gv-input:input', {
      detail: timeToLiveSeconds.value,
      bubbles: true,
      cancelable: true,
    }));

    const multiselect = component.getElement('multiselect');
    expect(multiselect).not.toBeNull();
    multiselect.value = ['a', 'b'];
    multiselect.dispatchEvent(new CustomEvent('gv-select:input', {
      detail: multiselect.value,
      bubbles: true,
      cancelable: true,
    }));

    expect(component.values).toEqual({
      'path-operator': {
        operator: 'STARTS_WITH',
        path: pathInput.value,
      },
      timeToLiveSeconds: 12,
      multiselect: ['a', 'b'],
    });

    component.reset();

    expect(component.values).toEqual(values);

  });

  test('should add item to array property', (done) => {
    const attributes = [{ name: 'foo', value: 'bar' }];
    const values = {
      'path-operator': {
        path: '/my-path',
        operator: 'STARTS_WITH',
      },
      timeToLiveSeconds: 5,
      multiselect: ['a'],
      attributes,
    };
    component.values = values;

    component.updateComplete.then(() => {

      expect(component.getElements().map((e) => e.id)).toEqual([
        'body',
        'path-operator.operator',
        'path-operator.path',
        'resources',
        'attributes.0.name',
        'attributes.0.value',
        'timeToLiveSeconds',
        'useResponseCacheHeaders',
        'select',
        'multiselect',
      ]);

      component.addEventListener('gv-schema-form:change', ({ detail }) => {
        expect(detail.values).toEqual({ ...values, attributes: [{ name: 'foo', value: 'bar' }, {}] });
        expect(component.getElements().map((e) => e.id)).toEqual([
          'body',
          'path-operator.operator',
          'path-operator.path',
          'resources',
          'attributes.0.name',
          'attributes.0.value',
          'attributes.1.name',
          'attributes.1.value',
          'timeToLiveSeconds',
          'useResponseCacheHeaders',
          'select',
          'multiselect',
        ]);
        done();
      });

      const parent = component.getElement('attributes');
      component._onAddItem('attributes', 1, mixed.properties.attributes, parent, false);
    });
  });

  test('should remove item to array property', (done) => {
    const values = {
      'path-operator': {
        path: '/my-path',
        operator: 'STARTS_WITH',
      },
      timeToLiveSeconds: 5,
      multiselect: ['a'],
      attributes: [{ name: '1', value: '1' }, { name: '2', value: '2' }, { name: '3', value: '3' }],
    };
    component.values = values;

    component.updateComplete.then(() => {
      expect(component.getElements().map((e) => e.id)).toEqual(
        expect.arrayContaining([
          'attributes.0.name',
          'attributes.0.value',
          'attributes.1.name',
          'attributes.1.value',
          'attributes.2.name',
          'attributes.2.value']));

      component.addEventListener('gv-schema-form:change', ({ detail }) => {
        expect(detail.values).toEqual({
          ...values,
          attributes: [{ name: '2', value: '2' }, { name: '3', value: '3' }],
        });
        expect(component.getElements().map((e) => e.id)).toEqual([
          'body',
          'path-operator.operator',
          'path-operator.path',
          'resources',
          'attributes.0.name',
          'attributes.0.value',
          'attributes.1.name',
          'attributes.1.value',
          'timeToLiveSeconds',
          'useResponseCacheHeaders',
          'select',
          'multiselect',
        ]);
        done();
      });
      component._onRemoveItem('attributes.0');

    });

  });

});
