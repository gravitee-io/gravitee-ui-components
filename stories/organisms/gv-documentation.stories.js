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
import notes from '../../.docs/gv-documentation.md';
import '../../src/organisms/gv-documentation';
import content from '../resources/adoc/policy-mock-readme.adoc';
import { makeStory } from '../lib/make-story';

export default {
  title: 'Organisms/gv-documentation',
  component: 'gv-documentation',
  parameters: {
    notes,
    options: {
      showPanel: false,
    },
  },
};

const conf = {
  component: 'gv-documentation',
};

export const Empty = makeStory(conf, {
  items: [{}],
});

export const PolicyReadme = makeStory(conf, {
  items: [{ text: content }],
});
