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
import '../../src/atoms/gv-switch';
import { makeStory } from '../lib/make-story';

export default {
  title: 'Atoms/gv-switch',
  component: 'gv-switch',
};

const conf = {
  component: 'gv-switch',
  css: `
    :host {
      display: flex;
    }
    gv-switch {
      flex: 1;
    }
  `,
};

const items = [
  {},
  { small: true, value: true },
  { label: 'Subscription Resumed', value: 'false' },
  { label: 'Subscription Resumed', description: 'Triggered when a Subscription is created.', value: false },
  { description: 'Triggered when a Subscription is created.', value: 'true' },
];

export const basics = makeStory(conf, {
  items,
});

export const disabled = makeStory(conf, {
  items: items.map((p) => ({ ...p, disabled: true })),
});

export const readonly = makeStory(conf, {
  items: items.map((p) => ({ ...p, readonly: true })),
});

export const skeleton = makeStory(conf, {
  items: items.map((p) => ({ ...p, skeleton: true })),
});
