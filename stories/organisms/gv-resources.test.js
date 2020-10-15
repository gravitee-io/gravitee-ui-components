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
import '../../src/organisms/gv-resources';
import apimResourceTypes from '../resources/apim-resource-types.json';
import apimDefinition from '../resources/apim-definition.json';

describe('R E S O U R C E S', () => {

  let page;
  let component;

  beforeEach(() => {
    page = new Page();
    component = page.create('gv-resources', {
      resources: apimDefinition.resources,
      types: apimResourceTypes.data,
    });
  });

  afterEach(() => {
    page.clear();
  });

  test('should create element', () => {
    expect(window.customElements.get('gv-resources')).toBeDefined();
    expect(component).toEqual(querySelector('gv-resources'));
  });

  test('should edit resource', () => {
    const resource = { _id: 'foobar', name: 'My cache', type: 'cache' };

    component._onEditResource(resource);

    expect(component._currentResource).toBeDefined();
    expect(component._currentResource.title).toBeDefined();
    expect(component._currentResource.schema).toBeDefined();
  });

  test('should find resource by id', () => {
    const resourceType = component._findResourceById('cache');

    expect(resourceType).toBeDefined();
    expect(resourceType.schema).toBeDefined();
  });

  test('should update resource', () => {
    expect(component.resources.length).toEqual(1);

    const resourceToUpdate = { ...component.resources[0] };
    // eslint-disable-next-line no-unused-vars
    const { _id, type, name, enabled, configuration } = resourceToUpdate;
    const values = { _id, name: 'Updated name', ...configuration };
    component._currentResource = { type };
    component._onSubmitResourceForm({ detail: { values } });

    expect(component.resources.length).toEqual(1);
    expect(component.resources[0]).toEqual({
      _id,
      name: 'Updated name',
      type,
      enabled,
      configuration,
    });
  });

  test('should add resource', () => {
    expect(component.resources.length).toEqual(1);

    const name = 'My cache';
    const type = 'cache';
    const enabled = true;
    const configuration = { a: 1, b: 2, c: new Date() };
    const values = { name, ...configuration };
    component._currentResource = { type };
    component._onSubmitResourceForm({ detail: { values } });

    expect(component.resources.length).toEqual(2);
    expect(component.resources[1]).toEqual({
      _id: expect.any(String),
      name,
      type,
      enabled,
      configuration,
    });
  });

  test('should remove resource', () => {
    expect(component.resources.length).toEqual(1);

    const resourceToRemove = { ...component.resources[0] };
    component._removeResource(resourceToRemove);

    expect(component.resources.length).toEqual(0);
  });

});
