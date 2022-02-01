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
import './gv-design';
import { makeStory } from '../../../testing/lib/make-story';

import apimPolicies from '../../../testing/resources/apim-policies.json';
import amPolicies from '../../../testing/resources/am-policies.json';
import apimResourceTypes from '../../../testing/resources/apim-resource-types.json';
import apimDefinition from '../../../testing/resources/apim-definition.json';
import apimDefinitionEmptyPlans from '../../../testing/resources/apim-definition-empty-plans.json';
import amDefinition from '../../../testing/resources/am-definition.json';
import apimFlow from '../../../testing/resources/schemas/apim-flow.json';
import amForm from '../../../testing/resources/schemas/am.json';
import icon from '../../../testing/resources/images/policy.svg';
import { deepClone } from '../../lib/utils';

export default {
  title: 'Policy studio/gv-design',
  component: 'gv-design',
  parameters: {
    options: {
      showPanel: false,
    },
    // DO NOT REACTIVATE a11y on these stories for now as the a11y checks are taking forever to run
    a11y: { disable: true },
  },
};

const conf = {
  component: 'gv-design',
  css: `
    body {
      overflow: hidden;
    }
  `,
};

const buildDoc = (title) => {
  return `= ${title}

== Phase

|===
|onRequest|onResponse

|X
|

|===

== Description

Mock documentation in story...

[source, xml]
.Body content example (xml)
----
<user id="{#request.paths[3]}">
    <firstname>{#properties['firstname_' + #request.paths[3]]}</firstname>
\t<lastname>{#properties['lastname_' + #request.paths[3]]}</lastname>
\t<age>{(T(java.lang.Math).random() * 60).intValue()}</age>
\t<createdAt>{(new java.util.Date()).getTime()}</createdAt>
</user>
----
      `;
};

const fetchPolicyDocumentation = (event) => {
  const detail = event.detail;
  const component = event.target;
  if (detail && detail.policy) {
    component.documentation = {
      image: detail.policy.icon,
      content: buildDoc(`${detail.policy.name || detail.policy.type} documentation`),
    };
  } else {
    component.documentation = null;
  }
};

export const Empty = makeStory(conf, {
  items: [
    {
      policies: apimPolicies.data.map((policy) => ({ ...policy, icon })),
      resourceTypes: apimResourceTypes.data,
      flowSchema: apimFlow,
      '@gv-design:fetch-documentation': fetchPolicyDocumentation.bind(this),
    },
  ],
});

export const APIM = makeStory(conf, {
  items: [
    {
      policies: apimPolicies.data.map((policy) => ({ ...policy, icon })),
      resourceTypes: apimResourceTypes.data,
      definition: apimDefinition,
      flowSchema: apimFlow,
      '@gv-design:fetch-documentation': fetchPolicyDocumentation.bind(this),
      'flows-title': 'API Flows',
      'has-policy-filter': true,
      'can-add': true,
      sortable: true,
    },
  ],
});

export const APIMReadonly = makeStory(conf, {
  items: [
    {
      policies: apimPolicies.data.map((policy) => ({ ...policy, icon })),
      resourceTypes: apimResourceTypes.data,
      definition: apimDefinition,
      flowSchema: apimFlow,
      '@gv-design:fetch-documentation': fetchPolicyDocumentation.bind(this),
      'flows-title': 'API Flows',
      'has-policy-filter': true,
      'can-add': true,
      sortable: true,
      readonly: true,
    },
  ],
});

export const APIMWithoutPlans = makeStory(conf, {
  items: [
    {
      policies: apimPolicies.data.map((policy) => ({ ...policy, icon })),
      resourceTypes: apimResourceTypes.data,
      definition: { ...apimDefinition, plans: [] },
      flowSchema: apimFlow,
      '@gv-design:fetch-documentation': fetchPolicyDocumentation.bind(this),
      'flows-title': 'API Flows',
      'has-policy-filter': true,
      'can-add': true,
      sortable: true,
    },
  ],
});

const apimDefinitionWithConditional = deepClone(apimDefinition);
apimDefinitionWithConditional.flows[0].pre[0].condition = "#method == 'POST'";
export const APIMWithoutPlansAndConditionalPolicies = makeStory(conf, {
  items: [
    {
      policies: apimPolicies.data.map((policy) => ({ ...policy, icon })),
      resourceTypes: apimResourceTypes.data,
      definition: { ...apimDefinitionWithConditional, plans: [] },
      flowSchema: apimFlow,
      '@gv-design:fetch-documentation': fetchPolicyDocumentation.bind(this),
      'flows-title': 'API Flows',
      'has-policy-filter': true,
      'can-add': true,
      sortable: true,
      'has-conditional-steps': true,
    },
  ],
});

const apimDefinitionWithConditionalFlows = deepClone(apimDefinition);
apimDefinitionWithConditionalFlows.flows[1].condition = "#method == 'POST'";
export const APIMWithoutPlansAndConditionalFlows = makeStory(conf, {
  items: [
    {
      policies: apimPolicies.data.map((policy) => ({ ...policy, icon })),
      resourceTypes: apimResourceTypes.data,
      definition: { ...apimDefinitionWithConditionalFlows, plans: [] },
      flowSchema: apimFlow,
      '@gv-design:fetch-documentation': fetchPolicyDocumentation.bind(this),
      'flows-title': 'API Flows',
      'has-policy-filter': true,
      'can-add': true,
      sortable: true,
      'has-conditional-steps': true,
    },
  ],
});

export const APIMWithEmptyPlans = makeStory(conf, {
  items: [
    {
      policies: apimPolicies.data.map((policy) => ({ ...policy, icon })),
      resourceTypes: apimResourceTypes.data,
      definition: apimDefinitionEmptyPlans,
      flowSchema: apimFlow,
      '@gv-design:fetch-documentation': fetchPolicyDocumentation.bind(this),
      'flows-title': 'API Flows',
      'has-policy-filter': true,
      'can-add': true,
      sortable: true,
    },
  ],
});

export const APIMWithReadonlyPlans = makeStory(conf, {
  items: [
    {
      policies: apimPolicies.data.map((policy) => ({ ...policy, icon })),
      resourceTypes: apimResourceTypes.data,
      definition: apimDefinition,
      flowSchema: apimFlow,
      '@gv-design:fetch-documentation': fetchPolicyDocumentation.bind(this),
      'flows-title': 'API Flows',
      'has-policy-filter': true,
      'can-add': true,
      sortable: true,
      'readonly-plans': true,
    },
  ],
});

export const AM = makeStory(conf, {
  items: [
    {
      policies: amPolicies.data.map((policy) => ({ ...policy, icon })),
      definition: amDefinition,
      flowSchema: amForm,
      '@gv-design:fetch-documentation': fetchPolicyDocumentation.bind(this),
    },
  ],
});

export const AMEditable = makeStory(conf, {
  items: [
    {
      policies: amPolicies.data.map((policy) => ({ ...policy, icon })),
      definition: amDefinition,
      flowSchema: amForm,
      '@gv-design:fetch-documentation': fetchPolicyDocumentation.bind(this),
      'can-add': true,
    },
  ],
});
