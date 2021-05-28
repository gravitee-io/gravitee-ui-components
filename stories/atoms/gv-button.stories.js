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
import '../../src/atoms/gv-button';
import notes from '../../.docs/gv-button.md';
import { makeStory } from '../lib/make-story';

const items = [
  { innerHTML: 'Default' },
  { innerHTML: 'Primary', primary: true },
  { innerHTML: 'Primary href', primary: true, href: 'https://gravitee.io/' },
  { innerHTML: 'Danger', danger: true },
  { innerHTML: 'Link', link: true },
  { innerHTML: 'Link href', link: true, href: 'https://gravitee.io/' },
  { innerHTML: 'Default', icon: 'cooking:dish' },
  { icon: 'cooking:dish' },
  { innerHTML: 'Default href', icon: 'navigation:angle-right', href: 'https://gravitee.io/' },
  { innerHTML: 'Primary', primary: true, icon: 'cooking:dish' },
  { innerHTML: 'Danger', danger: true, icon: 'cooking:dish' },
  { innerHTML: 'Default', 'icon-right': 'code:plus' },
  { innerHTML: 'Primary', primary: true, 'icon-right': 'code:plus' },
  { innerHTML: 'Danger', danger: true, 'icon-right': 'code:plus' },
  { innerHTML: 'Github', provider: 'github' },
  { innerHTML: 'Oidc', provider: 'oidc' },
  { innerHTML: 'Gravitee', provider: 'graviteeio_am' },
  { innerHTML: 'Google', provider: 'google' },
];

export default {
  title: 'Atoms/gv-button',
  component: 'gv-button',
  parameters: {
    notes,
  },
};

const conf = { component: 'gv-button' };

export const modes = makeStory(conf, {
  items,
});

export const modesInColumn = makeStory(
  {
    ...conf,
    ...{
      css: `
        :host {
          display: flex;
          flex-direction: column;
          width: 200px;
        }
`,
    },
  },
  {
    items,
  },
);

export const small = makeStory(conf, {
  items: items.map((p) => ({ ...p, small: true })),
});

export const outlined = makeStory(conf, {
  items: items.map((p) => ({ ...p, outlined: true })),
});

export const texted = makeStory(conf, {
  items: items.map((p) => ({ ...p, texted: true })),
});

export const disabled = makeStory(conf, {
  items: items.map((p) => ({ ...p, disabled: true })),
});

export const outlinedAndDisabled = makeStory(conf, {
  items: items.map((p) => ({ ...p, outlined: true, disabled: true })),
});

export const loading = makeStory(conf, {
  items: items.map((p) => ({ ...p, loading: true })),
});

export const outlinedAndLoading = makeStory(conf, {
  items: items.map((p) => ({ ...p, outlined: true, loading: true })),
});

export const smallOutlinedAndLoading = makeStory(conf, {
  items: items.map((p) => ({ ...p, outlined: true, loading: true, small: true })),
});

export const skeleton = makeStory(conf, {
  items: items.map((p) => ({ ...p, skeleton: true })),
});
