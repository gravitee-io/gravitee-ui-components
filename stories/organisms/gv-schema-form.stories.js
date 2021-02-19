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
import notes from '../../.docs/gv-schema-form.md';
import '../../src/organisms/gv-schema-form';
import { makeStory } from '../lib/make-story';
import mixed from '../resources/schemas/mixed.json';
import htmlToJson from '../resources/schemas/html-to-json.json';
import { fetch } from 'whatwg-fetch';
import grammar from '../resources/el-grammar.json';

export default {
  title: 'organisms/gv-schema-form',
  component: 'gv-schema-form',
  parameters: {
    notes,
    // DO NOT REACTIVATE a11y on these stories for now as the a11y checks are taking forever to run
    a11y: { disable: true },
  },
};

const conf = {
  component: 'gv-schema-form',
  // language=CSS
  css: `
    :host {
      display: block;
      min-height: 700px;
    }

    gv-schema-form {
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
      '@gv-schema-form:fetch-data': (event) => {
        const options = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('').map((key, index) => ({ value: `This is generated with ${key}` }));
        event.detail.currentTarget.options = options;
      },
      'has-footer': true,
      scrollable: true,
      '@gv-expression-language:ready': ({ detail }) => {
        detail.currentTarget.grammar = grammar;
      },
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
      values: mixedValues,
      schema: mixed,
      '@gv-schema-form:fetch-data': (event) => {
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
      values: mixedValues,
      schema: mixed,
      '@gv-schema-form:fetch-data': (event) => {
        const options = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('').map((key, index) => ({ value: `This is generated with ${key}` }));
        event.detail.currentTarget.options = options;
      },
      '@gv-expression-language:ready': ({ detail }) => {
        detail.currentTarget.grammar = grammar;
      },
    },
  ],
});

export const HTMLToJson = makeStory(conf, {
  items: [{ schema: htmlToJson, 'has-footer': true }],
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

// fetchAllPolicies();

async function fetchSchema(autocomplete, nextBtn, policyName = null, branch = 'master') {
  const form = autocomplete.closest('gv-schema-form');
  form.skeleton = true;
  form.schema = null;
  form.values = {};
  nextBtn.loading = true;
  if (policyName == null) {
    policyName = policies[0].value;
  }
  const names = policyName.split('/');
  names.splice(1, 0, branch);
  const schemaName = policyName === 'gravitee-policy-groovy' ? 'policy-schema-form' : 'schema-form';
  const url = `https://raw.githubusercontent.com/gravitee-io/${names.join('/')}/src/main/resources/schemas/${schemaName}.json`;

  // eslint-disable-next-line no-undef
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((schema) => {
      if (form) {
        form.schema = schema;
        policies = policies
          .map((policy) => {
            if (policy.value === policyName) {
              policy.view = policy.view + 1;
              policy.innerHTML = `${policyName} <span style="color:blue;">(view: ${policy.view})</span>`;
            }
            return policy;
          })
          .sort((a, b) => a.error - b.error || a.view - b.view);
        const available = policies.filter((p) => p.view === 0).length;
        nextBtn.innerHTML = `Next (${available})`;
        autocomplete.querySelector('gv-input').value = policyName;
        if (available === 0) {
          nextBtn.disabled = true;
        }
        autocomplete.options = policies;
      }
    })
    .catch((ex) => {
      // eslint-disable-next-line no-console
      console.error(`[ui-components] cannot load policy ${policyName}`, ex);
      if (form) {
        policies = policies.map((policy, index) => {
          if (policy.value === policyName) {
            policy.error = policy.error + 1;
            policy.innerHTML = `${policyName} <span style="color:red;">(error: ${policy.error})</span>`;
          }
          return policy;
        });
        autocomplete.options = policies;
      }
    })
    .finally(() => {
      form.updateComplete.then(() => {
        setTimeout(() => {
          nextBtn.loading = false;
          form.skeleton = false;
        }, 300);
      });
    });
}

export const AllPolicies = makeStory(conf, {
  items: [
    {
      skeleton: true,
      innerHTML: `<div slot="header-left" style="width: 100%; display: flex; align-items: center; justify-content: center">
        <gv-autocomplete  minChars="0" size="10">
        <gv-input type="search" clearable placeholder="Fetch policy from Github"></gv-input>
       </gv-autocomplete>
       <gv-button outlined icon-right="media:next" style="margin:0 0.5rem"  id="next-schema">Next (${policies.length})</gv-button>
       <gv-switch title="Validate on render"></gv-switch>
      </div>`,
      'has-header': true,
      scrollable: true,
      '@gv-schema-form:submit': ({ detail, target }) => {
        target.values = detail.values;
      },
      '@gv-autocomplete:search': (event) => {
        const detail = event.detail;
        const target = event.target;
        if (detail && detail.startsWith('*')) {
          target.options = policies;
        } else {
          target.options = policies.filter((policy) => policy.value.includes(detail));
        }
      },
      '@gv-switch:input': ({ detail, target }, component) => {
        if (detail) {
          component.setAttribute('validate-on-render', true);
        } else {
          component.removeAttribute('validate-on-render');
        }
      },
      '@click': async (e) => {
        if (e.target && e.target.id === 'next-schema') {
          const autocomplete = e.target.previousElementSibling;
          fetchSchema(autocomplete, e.target);
        }
      },
      '@gv-autocomplete:select': ({ detail, target }) => {
        const policyName = detail.value;
        const autocomplete = target;
        fetchSchema(autocomplete, target.nextElementSibling, policyName);
      },
      '@gv-expression-language:ready': ({ detail }) => {
        detail.currentTarget.grammar = grammar;
      },
    },
  ],
});
AllPolicies.parameters = {
  ...AllPolicies.parameters,
  chromatic: { disable: true },
};
