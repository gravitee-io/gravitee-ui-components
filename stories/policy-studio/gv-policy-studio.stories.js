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
import '../../src/policy-studio/gv-policy-studio';
import notes from '../../.docs/gv-policy-studio.md';
import { makeStory } from '../lib/make-story';

import apimPolicies from '../resources/apim-policies.json';
import amPolicies from '../resources/am-policies.json';
import apimResourceTypes from '../resources/apim-resource-types.json';
import apimDefinition from '../resources/apim-definition.json';
import apimDefinitionEmptyPlans from '../resources/apim-definition-empty-plans.json';
import amDefinition from '../resources/am-definition.json';
import apimFlow from '../resources/schemas/apim-flow.json';
import apimConfiguration from '../resources/schemas/apim-configuration.json';
import apimPropertyProviders from '../resources/apim-property-providers.json';
import amForm from '../resources/schemas/am.json';
import icon from '../resources/images/policy.svg';

export default {
  title: 'Policy Studio/gv-policy-studio',
  component: 'gv-policy-studio',
  parameters: {
    notes,
    options: {
      showPanel: false,
    },
  },
};

const conf = {
  component: 'gv-policy-studio',
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
  }
  else {
    component.documentation = null;
  }
};

const fetchResourceDocumentation = (event) => {
  const detail = event.detail;
  const component = detail.target;
  if (detail && detail.resourceType) {
    component.documentation = {
      content: buildDoc(`${detail.resourceType.name} documentation`),
    };
  }
  else {
    component.documentation = null;
  }
};

export const Empty = makeStory(conf, {
  items: [{
    policies: apimPolicies.data.map((policy) => {
      policy.icon = icon;
      return policy;
    }),
    resourceTypes: apimResourceTypes.data,
    flowSchema: apimFlow,
    apiConfigurationSchema: apimConfiguration,
    '@gv-resources:fetch-documentation': fetchResourceDocumentation.bind(this),
    '@gv-policy-studio:fetch-documentation': fetchPolicyDocumentation.bind(this),
  }],
});

export const APIM = makeStory(conf, {
  items: [{
    policies: apimPolicies.data.map((policy) => {
      policy.icon = icon;
      return policy;
    }),
    resourceTypes: apimResourceTypes.data,
    propertyProviders: apimPropertyProviders.data,
    definition: apimDefinition,
    flowSchema: apimFlow,
    configurationSchema: apimConfiguration,
    configurationInformation: 'By default, the selection of a flow is based on the operator defined in the flow itself.'
      + ' This operator allows either to select a flow when the path matches exactly, or when the start of the path matches.'
      + ' The "Best match" option allows you to select the flow from the path that is closest.',
    '@gv-policy-studio:fetch-documentation': fetchPolicyDocumentation.bind(this),
    '@gv-resources:fetch-documentation': fetchResourceDocumentation.bind(this),
    'flows-title': 'API Flows',
    'has-resources': true,
    'has-properties': true,
    'has-policy-filter': true,
    'can-add': true,
    sortable: true,
  }],
});

export const APIMReadonly = makeStory(conf, {
  items: [{
    policies: apimPolicies.data.map((policy) => {
      policy.icon = icon;
      return policy;
    }),
    resourceTypes: apimResourceTypes.data,
    propertyProviders: apimPropertyProviders.data,
    definition: apimDefinition,
    flowSchema: apimFlow,
    configurationSchema: apimConfiguration,
    configurationInformation: 'By default, the selection of a flow is based on the operator defined in the flow itself.'
      + ' This operator allows either to select a flow when the path matches exactly, or when the start of the path matches.'
      + ' The "Best match" option allows you to select the flow from the path that is closest.',
    '@gv-policy-studio:fetch-documentation': fetchPolicyDocumentation.bind(this),
    '@gv-resources:fetch-documentation': fetchResourceDocumentation.bind(this),
    'flows-title': 'API Flows',
    'has-resources': true,
    'has-properties': true,
    'has-policy-filter': true,
    'can-add': true,
    sortable: true,
    readonly: true,
  }],
});

export const APIMWithoutPlans = makeStory(conf, {
  items: [{
    policies: apimPolicies.data.map((policy) => {
      policy.icon = icon;
      return policy;
    }),
    resourceTypes: apimResourceTypes.data,
    propertyProviders: apimPropertyProviders.data,
    definition: { ...apimDefinition, plans: [] },
    flowSchema: apimFlow,
    configurationSchema: apimConfiguration,
    configurationInformation: 'By default, the selection of a flow is based on the operator defined in the flow itself.'
      + ' This operator allows either to select a flow when the path matches exactly, or when the start of the path matches.'
      + ' The "Best match" option allows you to select the flow from the path that is closest.',
    '@gv-policy-studio:fetch-documentation': fetchPolicyDocumentation.bind(this),
    '@gv-resources:fetch-documentation': fetchResourceDocumentation.bind(this),
    'flows-title': 'API Flows',
    'has-resources': true,
    'has-properties': true,
    'has-policy-filter': true,
    'can-add': true,
    sortable: true,
  }],
});

export const APIMWithEmptyPlans = makeStory(conf, {
  items: [{
    policies: apimPolicies.data.map((policy) => {
      policy.icon = icon;
      return policy;
    }),
    resourceTypes: apimResourceTypes.data,
    propertyProviders: apimPropertyProviders.data,
    definition: apimDefinitionEmptyPlans,
    flowSchema: apimFlow,
    configurationSchema: apimConfiguration,
    configurationInformation: 'By default, the selection of a flow is based on the operator defined in the flow itself.'
      + ' This operator allows either to select a flow when the path matches exactly, or when the start of the path matches.'
      + ' The "Best match" option allows you to select the flow from the path that is closest.',
    '@gv-policy-studio:fetch-documentation': fetchPolicyDocumentation.bind(this),
    '@gv-resources:fetch-documentation': fetchResourceDocumentation.bind(this),
    'flows-title': 'API Flows',
    'has-resources': true,
    'has-properties': true,
    'has-policy-filter': true,
    'can-add': true,
    sortable: true,
  }],
});

export const APIMWithReadonlyPlans = makeStory(conf, {
  items: [{
    policies: apimPolicies.data.map((policy) => {
      policy.icon = icon;
      return policy;
    }),
    resourceTypes: apimResourceTypes.data,
    propertyProviders: apimPropertyProviders.data,
    definition: apimDefinition,
    flowSchema: apimFlow,
    configurationSchema: apimConfiguration,
    configurationInformation: 'By default, the selection of a flow is based on the operator defined in the flow itself.'
      + ' This operator allows either to select a flow when the path matches exactly, or when the start of the path matches.'
      + ' The "Best match" option allows you to select the flow from the path that is closest.',
    '@gv-policy-studio:fetch-documentation': fetchPolicyDocumentation.bind(this),
    '@gv-resources:fetch-documentation': fetchResourceDocumentation.bind(this),
    'flows-title': 'API Flows',
    'has-resources': true,
    'has-properties': true,
    'has-policy-filter': true,
    'can-add': true,
    sortable: true,
    'readonly-plans': true,
  }],
});

export const AM = makeStory(conf, {
  items: [{
    policies: amPolicies.data.map((policy) => {
      policy.icon = icon;
      return policy;
    }),
    definition: amDefinition,
    flowSchema: amForm,
    '@gv-policy-studio:fetch-documentation': fetchPolicyDocumentation.bind(this),
  }],
});
