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
import '../../src/organisms/gv-resources';
import notes from '../../.docs/gv-resources.md';
import { makeStory } from '../lib/make-story';

import apimResourceTypes from '../resources/apim-resource-types.json';
import apimDefinition from '../resources/apim-definition.json';

export default {
  title: 'organisms/gv-resources',
  component: 'gv-resources',
  parameters: {
    notes,
    options: {
      showPanel: false,
    },
  },
};

const conf = {
  component: 'gv-resources',
  css: `
    gv-resources {
      height: 90vh;
    }
  `,
};

const fetchDocumentation = (event) => {
  const detail = event.detail;
  const component = detail.target;
  if (detail && detail.resourceType) {
    const title = `${detail.resourceType.name} documentation`;
    component.documentation = { title, content: 'Imported from Github' };
  } else {
    component.documentation = null;
  }
};

export const APIM = makeStory(conf, {
  items: [
    {
      resources: apimDefinition.resources,
      types: apimResourceTypes.data,
      '@gv-resources:fetch-documentation': fetchDocumentation.bind(this),
    },
  ],
});
