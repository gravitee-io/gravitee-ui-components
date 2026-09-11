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
import { expect } from '@jest/globals';

export const rootOneOfSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  oneOf: [
    {
      title: 'Source A ',
      properties: { sourceA: { type: 'string' } },
      required: ['sourceA'],
    },
    {
      title: 'Source B',
      properties: { sourceB: { type: 'string' } },
      required: ['sourceB'],
    },
  ],
};

// Combines top-level properties (so gv-schema-form-control instances actually
// render) with a root oneOf (so the validator emits an array-argument error
// that hits the control's shouldUpdate forEach loop). This is the shape that
// reproduces the production DOMException, so the control-level guards
// (Array.isArray, typeof key string, CSS.escape) are actually exercised here.
export const rootOneOfWithPropertiesSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    basePath: { type: 'string', title: 'Base Path' },
  },
  oneOf: [
    {
      title: 'Source A ',
      properties: { sourceA: { type: 'string', title: 'Source A' } },
      required: ['sourceA'],
    },
    {
      title: 'Source B',
      properties: { sourceB: { type: 'string', title: 'Source B' } },
      required: ['sourceB'],
    },
  ],
};

export async function expectControlGuardsHoldWithRootOneOf(component) {
  let caught;
  try {
    component.validate();
  } catch (e) {
    caught = e;
  }
  expect(caught).toBeUndefined();
  await component.updateComplete;

  const banner = component.shadowRoot.querySelector('.form-level-error');
  expect(banner).not.toBeNull();
  expect(banner.textContent).toContain('Select exactly one of');

  // Top-level property still rendered as a control — proves the
  // child shouldUpdate didn't crash on the array-argument error.
  const controlElements = component.shadowRoot.querySelectorAll('gv-schema-form-control');
  expect(controlElements.length).toBeGreaterThan(0);
  const basePathControl = Array.from(controlElements).find((c) => c.id === 'basePath');
  expect(basePathControl).not.toBeUndefined();
}

export async function expectNoThrowOnNonArrayErrors(component) {
  const banner = () => component.shadowRoot.querySelector('.form-level-error');

  let caught;
  try {
    component.errors = { not: 'an array' };
    await component.updateComplete;
    component.errors = null;
    await component.updateComplete;
    component.errors = undefined;
    await component.updateComplete;
  } catch (e) {
    caught = e;
  }
  expect(caught).toBeUndefined();
  expect(banner()).toBeNull();
}

export async function expectRootOneOfBanner(component) {
  let caught;
  try {
    component.validate();
  } catch (e) {
    caught = e;
  }
  expect(caught).toBeUndefined();
  await component.updateComplete;

  expect(component.errors).toHaveLength(1);
  expect(component.errors[0].name).toEqual('oneOf');
  expect(Array.isArray(component.errors[0].argument)).toBe(true);

  const banner = component.shadowRoot.querySelector('.form-level-error');
  expect(banner).not.toBeNull();
  expect(banner.textContent).toContain('Select exactly one of');
  expect(banner.textContent).toContain('Source A');
  expect(banner.textContent).toContain('Source B');
  expect(banner.textContent).not.toContain('"Source');
}
