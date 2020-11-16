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
import { Page } from '../lib/test-utils';
import '../../src/policy-studio/gv-flow';
import policies from '../resources/apim-policies.json';

describe('F L O W', () => {

  let page, component;

  beforeEach(() => {
    page = new Page();
    component = page.create('gv-flow', {});
    component.policies = policies.data;
    component.flow = {
      pre: [{ name: 'rule 1', policy: 'rate-limit' }],
      post: [{ name: 'rule 2', policy: 'rate-limit' }],
    };
  });

  afterEach(() => {
    page.clear();
  });

  test('should create element', () => {
    expect(window.customElements.get('gv-flow')).toBeDefined();
    expect(component).toBeDefined();
  });

  test('should throw an Error if flowKey is not pre or post', () => {
    expect.assertions(1);
    try {
      component._canDropPolicy('foobar', {});
    }
    catch (e) {
      expect(e).toBeDefined();
    }
  });

  test('should not have candidate when drag over flow without items', () => {
    const flowKey = 'pre';
    const event = {
      dataTransfer: {
        items: [],
      },
    };
    component._onDragOver(flowKey, event);

    const candidate = component.getCandidate();
    expect(candidate).toBeNull();
  });

  test('should have candidate when drag over flow without items', () => {
    const flowKey = 'pre';
    const target = component.shadowRoot.querySelector('gv-flow-step');
    expect(target).not.toBeNull();
    const event = {
      dataTransfer: {
        items: [
          {},
        ],
      },
      preventDefault: () => {
      },
      stopPropagation: () => {
      },
      target,
    };
    component.dropPolicy = { policy: { onRequest: true } };
    component._onDragOver(flowKey, event);

    expect(component.getCandidate()).not.toBeNull();
  });

});
