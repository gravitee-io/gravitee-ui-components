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
import '../../src/organisms/gv-properties';
import apimPropertyProvider from '../resources/apim-property-providers.json';
import apimDefinition from '../resources/apim-definition.json';

describe('P R O P E R T I E S', () => {

  let page;
  let component;

  beforeEach(() => {
    page = new Page();
    component = page.create('gv-properties', {
      properties: apimDefinition.properties,
      providers: apimPropertyProvider.data,
    });
  });

  afterEach(() => {
    page.clear();
  });

  test('should create element', () => {
    expect(window.customElements.get('gv-properties')).toBeDefined();
    expect(component).toEqual(querySelector('gv-properties'));
  });

  test('should add property', () => {
    expect(component.properties.length).toEqual(3);
    const property = { name: 'Foo', value: 'Bar' };

    component._addProperty(property);

    expect(component.properties.length).toEqual(4);
  });

  test('should remove property', () => {
    expect(component.properties.length).toEqual(3);

    component._removeProperty(component.properties[2]);

    expect(component.properties.length).toEqual(2);
  });

});
