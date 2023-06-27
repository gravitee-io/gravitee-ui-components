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
import './gv-schema-form-group';
import { makeStory } from '../../../testing/lib/make-story';
import mixed from '../../../testing/resources/schemas/mixed.json';
import htmlToJson from '../../../testing/resources/schemas/html-to-json.json';
import httpConnector from '../../../testing/resources/schemas/http-connector.json';
import policyCache from '../../../testing/resources/schemas/policy-cache.json';
import { fetch } from 'whatwg-fetch';
import grammar from '../../../testing/resources/el-grammar.json';
import resourceCacheRedis from '../../../testing/resources/schemas/resource-cache-redis.json';

export default {
  title: 'Organisms/gv-schema-form-group',
  component: 'gv-schema-form-group',
  parameters: {
    // DO NOT REACTIVATE a11y on these stories for now as the a11y checks are taking forever to run
    a11y: { disable: true },
  },
};

const conf = {
  component: 'gv-schema-form-group',
  // language=CSS
  css: `
    :host {
      display: block;
      min-height: 700px;
    }

    gv-schema-form-group {
      display: block;
      position: relative;
      min-height: 700px;
    }
  `,
};

export const MixedEmpty = makeStory(conf, {
  items: [
    {
      title: 'Mixed Empty',
      schema: mixed,
      '@gv-schema-form-group:fetch-data': (event) => {
        const options = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('').map((key, index) => ({ value: `This is generated with ${key}` }));
        event.detail.currentTarget.options = options;
      },
      'has-footer': true,
      scrollable: true,
      '@gv-expression-language:ready': ({ detail }) => {
        detail.currentTarget.grammar = grammar;
      },
      'validate-on-render': true,
    },
  ],
});

const mixedValues = {
  body: '<xml></xml>',
  'path-operator': {
    path: '/public',
    operator: 'EQUALS',
  },
  resources: 'My resource',
  attributes: [
    { name: 'John', value: 'Doe' },
    { name: 'Foo', value: 'Bar' },
  ],
  useResponseCacheHeaders: true,
  timeToLiveSeconds: 50,
  select: 'b',
  multiselect: ['a', 'b', 'c'],
};

export const Skeleton = makeStory(conf, {
  items: [
    {
      title: 'mixed',
      skeleton: true,
      icon: 'design:edit',
      value: mixedValues,
      schema: mixed,
      '@gv-schema-form-group:fetch-data': (event) => {
        const options = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('').map((key, index) => ({ value: `This is generated with ${key}` }));
        event.detail.currentTarget.options = options;
      },
      '@gv-expression-language:ready': ({ detail }) => {
        detail.currentTarget.grammar = grammar;
      },
    },
  ],
});

export const Mixed = makeStory(conf, {
  items: [
    {
      title: 'mixed',
      icon: 'design:edit',
      value: mixedValues,
      schema: mixed,
      '@gv-schema-form-group:fetch-data': (event) => {
        const options = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('').map((key, index) => ({ value: `This is generated with ${key}` }));
        event.detail.currentTarget.options = options;
      },
      '@gv-expression-language:ready': ({ detail }) => {
        detail.currentTarget.grammar = grammar;
      },
      '@gv-schema-form-group:change': ({ detail }) => {
        detail.target.values = detail.values;
      },
      'validate-on-render': true,
    },
  ],
});

export const HTMLToJson = makeStory(conf, {
  items: [{ schema: htmlToJson, 'has-footer': true }],
});

export const HttpConnector = makeStory(conf, {
  items: [{ schema: httpConnector }],
});

export const PolicyCache = makeStory(conf, {
  items: [{ schema: policyCache }],
});

export const ResourceCacheRedis = makeStory(conf, {
  items: [{ schema: resourceCacheRedis, 'has-footer': true }],
});

let policies = [
  'gravitee-policy-ratelimit/gravitee-policy-quota',
  'gravitee-policy-ratelimit/gravitee-policy-ratelimit',
  'gravitee-policy-ratelimit/gravitee-policy-spikearrest',
  'gravitee-policy-apikey',
  'gravitee-policy-request-content-limit',
  'gravitee-policy-oauth2',
  'gravitee-policy-transformheaders',
  'gravitee-policy-rest-to-soap',
  'gravitee-policy-transformqueryparams',
  'gravitee-policy-ipfiltering',
  'gravitee-policy-mock',
  'gravitee-policy-cache',
  'gravitee-policy-xslt',
  'gravitee-policy-xml-json',
  'gravitee-policy-groovy',
  'gravitee-policy-dynamic-routing',
  'gravitee-policy-jwt',
  'gravitee-policy-resource-filtering',
  'gravitee-policy-json-to-json',
  'gravitee-policy-blank',
  'gravitee-policy-latency',
  'gravitee-policy-basic-authentication',
  'gravitee-policy-override-http-method',
  'gravitee-policy-request-validation',
  'gravitee-policy-openid-connect-userinfo',
  'gravitee-policy-assign-content',
  'gravitee-policy-jws',
  'gravitee-policy-json-validation',
  'gravitee-policy-url-rewriting',
  'gravitee-policy-xml-validation',
  'gravitee-policy-callout-http',
  'gravitee-policy-assign-attributes',
  'gravitee-policy-generate-jwt',
  'gravitee-policy-role-based-access-control',
  'gravitee-policy-ssl-enforcement',
  'gravitee-policy-geoip-filtering',
  'gravitee-policy-circuit-breaker',
  'gravitee-policy-regex-threat-protection',
  'gravitee-policy-xml-threat-protection',
  'gravitee-policy-json-threat-protection',
  'gravitee-policy-wssecurity-authentication',
  'gravitee-policy-aws-lambda',
  'gravitee-policy-retry',
].map((value) => ({ value, view: 0, error: 0 }));
// Github rate limit: 60 request per hour
// Useful to generate the table of policies
// eslint-disable-next-line no-unused-vars
async function fetchAllPolicies() {
  const fakeOrEmptyPolicies = [
    // Technical repo
    'gravitee-policy-maven-archetype',
    'gravitee-policy-authentication',
    'gravitee-policy-api',
    // Multi policies repo
    'gravitee-policy-ratelimit',
    // Generate policies repo
    'gravitee-policy-html-json',
    'gravitee-policy-keyless',
  ];
  const githubUrl = 'https://api.github.com/orgs/gravitee-io/repos?per_page=100&page=';

  return Promise.all([fetch(`${githubUrl}1`), fetch(`${githubUrl}2`)])
    .then(([a, b]) => {
      return Promise.all([a.json(), b.json()]);
    })
    .then(([firstPage, secondPage]) => {
      const repositories = [...firstPage, ...secondPage];
      policies = [
        'gravitee-policy-ratelimit/gravitee-policy-quota',
        'gravitee-policy-ratelimit/gravitee-policy-ratelimit',
        'gravitee-policy-ratelimit/gravitee-policy-spikearrest',
        ...repositories
          .filter((repo) => repo.archived === false && repo.name.startsWith('gravitee-policy-') && !fakeOrEmptyPolicies.includes(repo.name))
          .map(({ name }) => name),
      ];

      // eslint-disable-next-line no-console
      console.log(policies);
    });
}
