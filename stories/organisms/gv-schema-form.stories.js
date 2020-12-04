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
import 'whatwg-fetch';

export default {
  title: 'organisms/gv-schema-form',
  component: 'gv-schema-form',
  parameters: {
    notes,
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
  items: [{
    title: 'Mixed Empty',
    schema: mixed,
    '@gv-schema-form:fetch-data': (event) => {
      const options = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('').map((key, index) => ({ value: `This is generated with ${key}` }));
      event.detail.currentTarget.options = options;
    },
    'has-footer': true,
  }],
});

const mixedValues = {
  body: '<xml></xml>',
  'path-operator': {
    path: '/public',
    operator: 'EQUALS',
  },
  resources: 'My resource',
  attributes: [{ name: 'John', value: 'Doe' }, { name: 'Foo', value: 'Bar' }],
  useResponseCacheHeaders: true,
  timeToLiveSeconds: 50,
  select: 'b',
  multiselect: ['a', 'b', 'c'],
};

export const Mixed = makeStory(conf, {
  items: [{
    title: 'mixed',
    icon: 'design:edit',
    values: mixedValues,
    schema: mixed,
    '@gv-schema-form:fetch-data': (event) => {
      const options = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('').map((key, index) => ({ value: `This is generated with ${key}` }));
      event.detail.currentTarget.options = options;
    },
  }],
});

export const HTMLToJson = makeStory(conf, {
  items: [{ schema: htmlToJson, 'has-footer': true }],
});

let policies = [
  'gravitee-policy-apikey',
  'gravitee-policy-assign-attributes',
  'gravitee-policy-assign-content',
  'gravitee-policy-basic-authentication',
  'gravitee-policy-cache',
  'gravitee-policy-callout-http',
  'gravitee-policy-dynamic-routing',
  'gravitee-policy-groovy',
  'gravitee-policy-ipfiltering',
  'gravitee-policy-json-to-json',
  'gravitee-policy-json-validation',
  'gravitee-policy-jws',
  'gravitee-policy-jwt',
  'gravitee-policy-latency',
  'gravitee-policy-mock',
  'gravitee-policy-oauth2',
  'gravitee-policy-openid-connect-userinfo',
  'gravitee-policy-override-http-method',
  'gravitee-policy-ratelimit/gravitee-policy-quota',
  'gravitee-policy-ratelimit/gravitee-policy-ratelimit',
  'gravitee-policy-request-content-limit',
  'gravitee-policy-request-validation',
  'gravitee-policy-resource-filtering',
  'gravitee-policy-rest-to-soap',
  'gravitee-policy-ratelimit/gravitee-policy-spikearrest',
  'gravitee-policy-transformheaders',
  'gravitee-policy-transformqueryparams',
  'gravitee-policy-url-rewriting',
  'gravitee-policy-xml-json',
  'gravitee-policy-xslt',
].map((value, index) => ({ value, view: 0, error: 0 }));

function fetchSchema (autocomplete, nextBtn, policyName = null, branch = 'master') {
  nextBtn.loading = true;
  if (policyName == null) {
    policyName = policies[0].value;
  }
  const names = policyName.split('/');
  names.splice(1, 0, branch);
  const schemaName = policyName === 'gravitee-policy-groovy' ? 'policy-schema-form' : 'schema-form';
  const url = `https://raw.githubusercontent.com/gravitee-io/${names.join('/')}/src/main/resources/schemas/${schemaName}.json`;
  const form = autocomplete.closest('gv-schema-form');
  // eslint-disable-next-line no-undef
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((schema) => {
      if (form) {
        form.schema = schema;
        policies = policies.map((policy) => {
          if (policy.value === policyName) {
            policy.view = policy.view + 1;
            policy.innerHTML = `${policyName} <span style="color:blue;">(view: ${policy.view})</span>`;
          }
          return policy;
        }).sort((a, b) => a.view - b.view);
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
        nextBtn.disabled = true;
        autocomplete.options = policies;
      }
    })
    .finally(() => (nextBtn.loading = false));
}

export const AllPolicies = makeStory(conf, {
  items: [{
    innerHTML:
      `<gv-autocomplete slot="header-left" minChars="0" size="10">
        <gv-input type="search" clearable placeholder="Search policy..."></gv-input>
       </gv-autocomplete>
       <gv-button outlined icon-right="media:next" style="margin:0 0.5rem" slot="header-left" id="next-schema">Next (${policies.length})</gv-button>`,
    'has-header': true,
    '@gv-schema-form:submit': ({ detail, target }) => {
      target.values = detail.values;
    },
    '@gv-autocomplete:search': (event) => {
      const detail = event.detail;
      const component = event.target;
      if (detail && detail.startsWith('*')) {
        component.options = policies;
      }
      else {
        component.options = policies.filter((policy) => policy.value.includes(detail));
      }
    },
    '@click': (e) => {
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
  }],
});
