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
import '../../src/organisms/gv-documentation';
import { policyMockReadme } from '../resources/adoc/policy-mock-readme';
import { makeStory, storyWait } from '../lib/make-story';

export default {
  title: 'Organisms/gv-documentation',
  component: 'gv-documentation',
  parameters: {
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

export const OverrideEmptyMsg = makeStory(conf, {
  items: [
    {
      innerHTML: `
      <div slot="empty">
        <gv-icon shape="text:align-center" style="--gv-icon--s: 96px;"></gv-icon>
        <div>Content is empty</div>
      </div>
    `,
    },
  ],
});

export const PolicyReadme = makeStory(conf, {
  items: [{ text: policyMockReadme }],
});

export const WithoutHeader = makeStory(conf, {
  items: [{ text: policyMockReadme, 'without-header': true }],
});

export const Async = makeStory(conf, {
  items: [{ text: '', skeleton: true }],
  simulations: [
    storyWait(1000, ([component]) => {
      component.text = policyMockReadme;
      component.removeAttribute('skeleton');
    }),
  ],
});
