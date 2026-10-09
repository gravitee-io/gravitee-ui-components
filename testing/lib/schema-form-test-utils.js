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
import { expect, test } from '@jest/globals';

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

// Root oneOf plus a sibling property so form-level errors and control guards
// are exercised together.
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

export const rootOneOfWithRefsSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  definitions: {
    SourceA: {
      title: 'Source A ',
      properties: { sourceA: { type: 'string' } },
      required: ['sourceA'],
    },
    SourceB: {
      title: 'Source B',
      properties: { sourceB: { type: 'string' } },
      required: ['sourceB'],
    },
  },
  oneOf: [{ $ref: '#/definitions/SourceA' }, { $ref: '#/definitions/SourceB' }],
};

export const rootOneOfWithConstSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  oneOf: [
    {
      title: 'Type A',
      properties: {
        type: { type: 'string', const: 'A' },
        sourceA: { type: 'string' },
      },
      required: ['type', 'sourceA'],
    },
    {
      title: 'Type B',
      properties: {
        type: { type: 'string', const: 'B' },
        sourceB: { type: 'string' },
      },
      required: ['type', 'sourceB'],
    },
  ],
};

export async function expectControlGuardsHoldWithRootOneOf(component) {
  expect(() => component.validate()).not.toThrow();
  await component.updateComplete;

  const banner = component.shadowRoot.querySelector('.form-level-error');
  expect(banner).not.toBeNull();
  expect(banner.textContent).toContain('Select exactly one of');

  const controlElements = component.shadowRoot.querySelectorAll('gv-schema-form-control');
  expect(controlElements.length).toBeGreaterThan(0);
  const basePathControl = Array.from(controlElements).find((c) => c.id === 'basePath');
  expect(basePathControl).not.toBeUndefined();
}

export async function expectNoThrowOnNonArrayErrors(component) {
  const banner = () => component.shadowRoot.querySelector('.form-level-error');

  expect(() => {
    component.errors = { not: 'an array' };
  }).not.toThrow();
  await component.updateComplete;
  expect(() => {
    component.errors = null;
  }).not.toThrow();
  await component.updateComplete;
  expect(() => {
    component.errors = undefined;
  }).not.toThrow();
  await component.updateComplete;
  expect(banner()).toBeNull();
}

export async function expectRootOneOfBanner(component) {
  expect(() => component.validate()).not.toThrow();
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

/**
 * Shared root-oneOf behavioural coverage for both schema-form hosts.
 * `api` adapts values/touch/validate differences between form and group.
 */
export function describeRootOneOfBehaviors(getComponent, api) {
  test('should render a banner and not throw on root oneOf failures', async () => {
    const component = getComponent();
    component.schema = rootOneOfSchema;
    api.setModel(component, {});
    api.touch(component);
    await component.updateComplete;
    await expectRootOneOfBanner(component);
  });

  test('should validate successfully when oneOf required field is provided', async () => {
    const component = getComponent();
    component.schema = rootOneOfSchema;
    api.setModel(component, { sourceA: 'value' });
    await component.updateComplete;
    expect(api.getErrors(component)).toEqual([]);
    expect(component.isValid()).toBe(true);
  });

  test('should drop previous branch values when switching oneOf selection', async () => {
    const component = getComponent();
    component.schema = rootOneOfSchema;
    api.setModel(component, { sourceA: 'a' });
    await component.updateComplete;
    const select = component.shadowRoot.querySelector('.oneof-select select');
    select.value = '1';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await component.updateComplete;
    expect(api.getModel(component).sourceA).toBeUndefined();
  });

  test('should drop previous $ref branch values when switching oneOf selection', async () => {
    const component = getComponent();
    component.schema = rootOneOfWithRefsSchema;
    api.setModel(component, { sourceA: 'a' });
    await component.updateComplete;
    expect(component._selectedOneOfIndex).toBe(0);
    const select = component.shadowRoot.querySelector('.oneof-select select');
    select.value = '1';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await component.updateComplete;
    expect(api.getModel(component).sourceA).toBeUndefined();
  });

  test('should infer oneOf branch from const discriminators', async () => {
    const component = getComponent();
    component.schema = rootOneOfWithConstSchema;
    api.setModel(component, { type: 'B', sourceB: 'value' });
    await component.updateComplete;
    expect(component._selectedOneOfIndex).toBe(1);
    expect(component.shadowRoot.querySelector('[id="sourceB"]')).not.toBeNull();
    expect(component.shadowRoot.querySelector('[id="sourceA"]')).toBeNull();
  });

  test('should still infer branch when const discriminator is absent from saved values', async () => {
    const component = getComponent();
    component.schema = rootOneOfWithConstSchema;
    api.setModel(component, { sourceB: 'value' });
    await component.updateComplete;
    expect(component._selectedOneOfIndex).toBe(1);
    expect(component.shadowRoot.querySelector('[id="sourceB"]')).not.toBeNull();
  });

  test('should re-sync oneOf index on reset', async () => {
    const component = getComponent();
    component.schema = rootOneOfSchema;
    api.setModel(component, { sourceA: 'a' });
    await component.updateComplete;
    expect(component._selectedOneOfIndex).toBe(0);

    const select = component.shadowRoot.querySelector('.oneof-select select');
    select.value = '1';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await component.updateComplete;
    expect(component._selectedOneOfIndex).toBe(1);

    component.reset();
    await component.updateComplete;
    expect(component._selectedOneOfIndex).toBe(0);
    expect(api.getModel(component).sourceA).toBe('a');
  });

  test('should render oneOf when groups has no default group', async () => {
    const component = getComponent();
    component.schema = rootOneOfWithPropertiesSchema;
    component.groups = [{ name: 'Common', items: ['basePath'] }];
    api.setModel(component, {});
    await component.updateComplete;
    expect(component.shadowRoot.querySelector('.oneof-select select')).not.toBeNull();
  });

  test('should not crash when root oneOf coexists with rendered controls', async () => {
    const component = getComponent();
    component.schema = rootOneOfWithPropertiesSchema;
    api.setModel(component, {});
    api.touch(component);
    await component.updateComplete;
    await expectControlGuardsHoldWithRootOneOf(component);
  });

  test('should not throw when errors is a non-array value', async () => {
    const component = getComponent();
    component.schema = { type: 'object', properties: { foo: { type: 'string' } } };
    api.setModel(component, {});
    await component.updateComplete;
    await expectNoThrowOnNonArrayErrors(component);
  });
}
