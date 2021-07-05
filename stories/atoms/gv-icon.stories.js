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
import '../../src/atoms/gv-icon';
import notes from '../../.docs/gv-icon.md';
import { icons } from '../../.docs/icons.json';
import { makeStory, storyWait } from '../lib/make-story';

export default {
  title: 'Atoms/gv-icon',
  component: 'gv-icon',
  parameters: {
    notes,
    // DO NOT REACTIVATE a11y on these stories for now as the a11y checks are taking forever to run
    a11y: { disable: true },
  },
};
const conf = {
  component: 'gv-icon',
  css: `
    :host {
      display: flex;
      flex-wrap: wrap;
    }

    .item {
      text-align: center;
      padding: 0.5rem;
      min-width: 175px;
      font-size: 11px;
    }

    .item gv-icon {
      display: block;
    }
    gv-icon {
      display:none;
      --gv-icon--c: var(--gv-theme-color-info)
    }
  `,
};
const items = icons.map((shape) => ({ shape, title: shape }));
export const all = makeStory(conf, {
  items,
  simulations: [
    storyWait(0, (components) => {
      components.forEach((component) => {
        const item = document.createElement('div');
        item.className = 'item';
        component.parentNode.insertBefore(item, component);
        item.appendChild(component);
        const title = document.createElement('div');
        title.innerHTML = component.shape;
        item.appendChild(title);
      });
    }),
  ],
});

all.parameters = {
  ...all.parameters,
  chromatic: { disable: false, delay: 2000 },
};
