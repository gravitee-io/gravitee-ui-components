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

import '../../src/molecules/gv-expandable';
import { makeStory, storyWait } from '../lib/make-story';
import mixed from '../resources/schemas/mixed.json';

const conf = {
  component: 'gv-expandable',
};

export default {
  title: 'Molecules/gv-expandable',
  ...conf,
};

export const Basics = makeStory(conf, {
  items: [
    {
      innerHTML: `
        <div slot="summary">One line to sum up</div>
        <div slot="details">An hidden details to display more info on click.</div>
      `,
    },
  ],
});

export const OpenByDefault = makeStory(conf, {
  items: [
    {
      innerHTML: `
        <div slot="summary">One line to sum up</div>
        <div slot="details">An hidden details to display more info on click.</div>
      `,
      open: true,
    },
  ],
});

export const WithForm = makeStory(conf, {
  items: [
    {
      innerHTML: `
        <div slot="summary">Complex form</div>
      `,
    },
  ],
  simulations: [
    storyWait(0, ([component]) => {
      const form = document.createElement('gv-schema-form');
      form.schema = mixed;
      const container = document.createElement('div');
      container.slot = 'details';
      container.style.padding = '0.5rem';
      container.style.display = 'flex';
      container.appendChild(form);
      component.appendChild(container);
    }),
  ],
});
