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
import rateLimit from '../resources/schemas/rate-limit.json';
import resourceFiltering from '../resources/schemas/resource-filtering.json';

export default {
  title: 'organisms/gv-schema-form',
  component: 'gv-schema-form',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-schema-form',
};

export const MixedEmpty = makeStory(conf, {
  items: [{
    title: 'Mixed Empty',
    schema: mixed,
    '@gv-schema-form:fetch-data': (event) => {
      const options = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('').map((key, index) => ({ value: `This is generated with ${key}` }));
      event.detail.element.options = options;
    },
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
    schema: mixed,
    values: mixedValues,
    '@gv-schema-form:fetch-data': (event) => {
      const options = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('').map((key, index) => ({ value: `This is generated with ${key}` }));
      event.detail.element.options = options;
    },
  }],
});

export const RateLimit = makeStory(conf, {
  items: [{
    schema: rateLimit,
    values: {
      rate: {
        limit: 15,
        periodTime: 2,
        periodTimeUnit: 'MINUTES',
      },
    },
  }],
});

export const ResourceFiltering = makeStory(conf, {
  items: [{ schema: resourceFiltering }],
});
