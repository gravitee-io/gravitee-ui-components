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
import { afterEach, beforeEach, describe, expect, test, jest } from '@jest/globals';
import { Page, querySelector } from '../../../testing/lib/test-utils';
import definition from '../../../testing/resources/apim-definition.json';
import policies from '../../../testing/resources/apim-policies.json';
import resourceTypes from '../../../testing/resources/apim-resource-types.json';
import './gv-policy-studio';
import apimFlowSchema from '../../../testing/resources/schemas/apim-flow.json';

describe('P O L I C Y  S T U D I O', () => {
  let page, component;

  beforeEach(() => {
    page = new Page();
    component = page.create('gv-policy-studio', {});
    component.policies = policies.data;
    component.resourceTypes = resourceTypes.data;
    component.flowSchema = {};
  });

  afterEach(() => {
    page.clear();
  });

  describe('C O M M O N', () => {
    test('should create element', () => {
      expect(window.customElements.get('gv-policy-studio')).toBeDefined();
      const element = querySelector('gv-policy-studio');
      expect(element).toBeDefined();
      expect(element.definedFlows.length).toEqual(0);
      expect(element.definedResources.length).toEqual(0);
      expect(element.definedProperties).toBeDefined();
    });

    test('should remove private properties when save all', (done) => {
      const flow = {
        _id: 'foobar',
        _dirty: true,
        name: 'ALL',
        post: [{ policy: 'rate-limit', _dirty: true }],
        pre: [],
      };
      const resource = { _id: 'resource-1', _dirty: true, configuration: {} };
      component.definition = {
        flows: [flow],
        resources: [resource],
        plans: [{ id: 'plan', name: 'Plan', flows: [flow] }],
      };
      component.policies = [{ id: 'rate-limit' }];
      component.addEventListener('gv-policy-studio:save', ({ detail }) => {
        expect(detail).toEqual({
          definition: {
            flows: [{ name: 'ALL', post: [{ policy: 'rate-limit' }], pre: [] }],
            resources: [{ configuration: {} }],
            plans: [{ id: 'plan', name: 'Plan', flows: [{ name: 'ALL', post: [{ policy: 'rate-limit' }], pre: [] }] }],
          },
          services: {},
        });
        done();
      });
      component._onSaveAll();
    });

    test('should dispatch fetch-documentation when open documentation from menu', (done) => {
      const policy = { id: 'rate-limit', name: 'Rate Limit' };
      component.policies = [policy];

      component.addEventListener('gv-policy-studio:fetch-documentation', (e) => {
        expect(e).toBeDefined();
        done();
      });
      component._onOpenDocumentationFromMenu({ detail: { policy } });
    });

    test('should not updated when _dragPolicy change', (done) => {
      component.updated = jest.fn();

      component._dragPolicy = { policy: 'foobar' };
      component.updateComplete.then(() => {
        expect(component.updated.mock.calls.length).toBe(0);
        done();
      });
    });

    test('should not updated when _dropPolicy change', (done) => {
      component.updated = jest.fn();

      component._dropPolicy = { policy: 'foobar' };

      component.updateComplete.then(() => {
        expect(component.updated.mock.calls.length).toBe(0);
        done();
      });
    });
  });

  describe('A P I M', () => {
    beforeEach(() => {
      component.definition = definition;
    });

    test('should find flow by id', () => {
      const flowIdFromApiDefinition = component.definition.flows[0]._id;
      const flowIdFromPlanDefinition = component.definition.plans[1].flows[0]._id;
      expect(component._findFlowById(flowIdFromApiDefinition)).not.toBeNull();
      expect(component._findFlowById(flowIdFromPlanDefinition)).not.toBeNull();
    });

    test('should find collection of flow', (done) => {
      const flowIdFromApiDefinition = component.definition.flows[0]._id;
      const flowIdFromPlanDefinition = component.definition.plans[1].flows[0]._id;

      component.updateComplete.then(() => {
        expect(component._findFlowCollection(flowIdFromApiDefinition)).toEqual({
          plan: undefined,
          flows: component.definition.flows,
        });
        expect(component._findFlowCollection(flowIdFromPlanDefinition)).toEqual({
          plan: component.definition.plans[1],
          flows: component.definition.plans[1].flows,
        });
        done();
      });
    });

    test('should delete flow from plan', () => {
      const flow = component.definition.plans[1].flows[0];
      expect(component.definition.plans[1].flows.length).toEqual(3);
      expect(component.definition.flows.length).toEqual(3);

      component._onDeleteFlow({ detail: { content: { ...flow } } });

      expect(component.definition.plans[1].flows.length).toEqual(2);
      expect(component.definition.flows.length).toEqual(3);
    });

    test('should add flow plan', (done) => {
      expect(component.definition.plans[1].flows.length).toEqual(3);
      expect(component.getSelectedFlow()).toBeDefined();
      expect(component._tabId).toEqual('design');

      component.flowSchema = {
        type: 'object',
        id: 'apim',
        properties: {
          name: {
            title: 'Name',
            description: 'The name of flow. If empty, the name will be generated with the path and methods',
            type: 'string',
          },
          'path-operator': {
            type: 'object',
            title: 'Path',
            properties: {
              operator: {
                title: 'Operator path',
                description: 'The operator path',
                type: 'string',
                enum: ['EQUALS', 'STARTS_WITH'],
                default: 'STARTS_WITH',
                'x-schema-form': {
                  titleMap: {
                    EQUALS: 'Equals',
                    STARTS_WITH: 'Starts with',
                  },
                },
              },
              path: {
                title: 'Path',
                description: 'The path of flow (must start by /)',
                type: 'string',
                pattern: '^/',
                default: '/',
              },
            },
            required: ['path', 'operator'],
          },
          methods: {
            title: 'Methods',
            description: 'The HTTP methods of flow (ALL if empty)',
            type: 'array',
            items: {
              type: 'string',
              enum: ['CONNECT', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT', 'TRACE'],
            },
          },
          condition: {
            title: 'Condition',
            description: 'The extra condition of flow',
            type: 'string',
          },
        },
        required: [],
        disabled: [],
      };

      component.updateComplete
        .then(() => component._onAddFlowPlan({ detail: { planIndex: 1 } }))
        .then(() => component.updateComplete)
        .then(() => {
          expect(component.definition.plans[1].flows.length).toEqual(4);

          const createdFlow = component.definition.plans[1].flows[3];
          expect(createdFlow._dirty).toEqual(true);
          expect(createdFlow.name).toEqual('');
          expect(createdFlow.post).toEqual([]);
          expect(createdFlow.pre).toEqual([]);
          expect(createdFlow._id).toBeDefined();
          expect(createdFlow['path-operator']).toBeDefined();
          expect(createdFlow['path-operator'].operator).toBeDefined();
          expect(createdFlow['path-operator'].path).toBeDefined();
          expect(createdFlow.type).not.toBeDefined();
          done();
        });
    });

    test('should create element with definition', () => {
      expect(component.definedFlows.length).toEqual(3);
      expect(component.definedResources.length).toEqual(1);
      expect(Object.keys(component.definedProperties).length).toEqual(3);
      expect(component.definedFlows[0]._id).toBeDefined();
      expect(component.definedResources[0]._id).toBeDefined();
      expect(component.selectedFlowsId.length).toEqual(1);
    });
  });

  describe('F L O W S', () => {
    test('should add flow', async () => {
      component.definition = { flows: [] };
      component.flowSchema = {
        type: 'object',
        id: 'am',
        properties: {
          name: {
            title: 'Name',
            description: 'The name of flow. If empty, the name will be generated with the path and methods',
            type: 'string',
            default: 'New Flow',
          },
          type: {
            title: 'Type',
            description: 'The type of flow',
            type: 'string',
            default: 'ROOT',
            enum: ['ROOT', 'LOGIN', 'LOGIN_IDENTIFIER', 'RESET_PASSWORD', 'CONSENT', 'REGISTER'],
          },
          condition: {
            title: 'Condition',
            description: 'The condition of flow',
            type: 'string',
          },
        },
        required: [],
        disabled: [],
      };

      await component._onAddFlow();

      expect(component.definition.flows.length).toEqual(1);
      const createdFlow = component.definition.flows[0];
      expect(createdFlow._dirty).toEqual(true);
      expect(createdFlow._id).toBeDefined();
      expect(createdFlow.name).toEqual('New Flow');
      expect(createdFlow.post).toEqual([]);
      expect(createdFlow.pre).toEqual([]);
      expect(createdFlow.type).toEqual('ROOT');
      expect(createdFlow['path-operator']).not.toBeDefined();
    });

    test('should duplicate flow', async () => {
      const flow = { _id: 'f-1', name: 'ALL', post: [{ policy: 'rate-limit', name: 'Rate limit' }], pre: [] };
      component.definition = { flows: [flow] };

      await component.updateComplete;
      await component._onDuplicateFlow({ detail: { content: { ...flow } } });

      const expected = {
        ...flow,
        _dirty: true,
        _id: expect.any(String),
        id: null,
        post: [{ _id: expect.any(String), policy: 'rate-limit', name: 'Rate limit' }],
      };
      expect(component.definition.flows.length).toEqual(2);
      expect(component.definition.flows[1]).toEqual(expected);
    });

    test('should delete flow', () => {
      const flow = { _id: 'foobar', name: 'ALL', post: [{ policy: 'rate-limit', name: 'Rate limit' }], pre: [] };
      component.definition = { flows: [flow] };

      component._onDeleteFlow({ detail: { content: { ...flow } } });

      expect(component.definition.flows.length).toEqual(0);
    });

    test('should update definition when submit schema form with updated flow', async () => {
      const _id = 'foobar';
      const flow = { _id, name: 'New flow', condition: '#method == "POST"' };
      component.definition = { flows: [flow] };

      await component._onSelectFlows({ detail: { flows: [flow._id] } });
      const updatedFlow = {
        name: 'Updated flow',
        description: 'more....',
        methods: ['GET', 'POST'],
        'path-operator': { path: '/', operator: 'STARTS_WITH' },
      };
      component._onSubmitFlow({ detail: { values: updatedFlow } });

      expect(component.definition.flows.length).toEqual(1);
      expect(component.definition.flows[0]._dirty).toEqual(true);
      expect(component.definition.flows[0]._id).toEqual(_id);
      expect(component.definition.flows[0].name).toEqual(updatedFlow.name);
      expect(component.definition.flows[0]['path-operator']).toEqual({ path: '/', operator: 'STARTS_WITH' });
      expect(component.definition.flows[0].methods).toEqual(['GET', 'POST']);
    });

    test('should update definition when submit flow schema', async () => {
      const _id = 'foobar';
      const _stepId = 'foobar-step';
      const step = { _id: _stepId, name: 'step', description: 'step description', configuration: {}, policy: 'api-key' };
      const flow = {
        _id,
        name: 'New flow',
        description: 'test',
        condition: '#method == "POST"',
        pre: [step],
        post: [],
      };
      component.definition = { flows: [flow] };
      await component._onSelectFlows({ detail: { flows: [flow._id] } });

      const policy = policies.data.find((policy) => policy.id === 'policy-http-callout');
      const flowStepSchema = component.buildSchema(policy);
      const currentFlowStep = { flow, step, policy, group: 'pre', position: 0 };
      await component._setCurrentFlowStep(currentFlowStep, flowStepSchema);

      const cases = [
        ['updated description', 'http://localhost', 'GET'],
        ['', 'http://localhost/api', 'POST'],
        ['simple description', 'http://localhost:8080', 'PUT'],
      ];

      for (const [commonDescription, url, method] of cases) {
        const values = { commonDescription, method, url };
        await component._onSubmitFlowStep({ detail: { values } });

        expect(component.definition.flows.length).toEqual(1);
        expect(component.definition.flows[0]._id).toEqual(_id);
        expect([...component.definition.flows[0].pre]).toMatchObject([
          {
            ...step,
            description: commonDescription,
            configuration: { method, url },
          },
        ]);
      }
    });

    test('should reset field', async () => {
      component.flowSchema = apimFlowSchema;

      const _id = 'foobar';
      const _stepId = 'foobar-step';
      const step = { _id: _stepId, name: 'step', description: 'step description', configuration: {}, policy: 'api-key' };
      const flow = {
        _id,
        name: 'New flow',
        description: 'test',
        condition: '#method == "POST"',
        pre: [step],
        post: [],
      };
      const values = {
        _id,
        description: 'test',
        pre: [step],
        post: [],
      };
      component.definition = { flows: [flow] };
      await component._onSelectFlows({ detail: { flows: [flow._id] } });

      // execute update
      await component._onSubmitFlow({ detail: { values } });

      expect(component.definition.flows.length).toEqual(1);
      expect(component.definition.flows[0]._id).toEqual(_id);
      expect(component.definition.flows[0].name).toEqual('');
      expect(component.definition.flows[0].condition).toEqual('');
    });
  });
});
