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
import '../../src/atoms/gv-text';
import { makeStory } from '../lib/make-story';

export default {
  title: 'Atoms/gv-text',
  component: 'gv-text',
};

const conf = {
  component: 'gv-text',
};

const items = [{ rows: 3 }, { label: 'Your request', placeholder: 'Explain your request...', rows: 3 }];

export const basics = makeStory(conf, {
  items,
});

export const required = makeStory(conf, {
  items: items.map((p) => ({ ...p, required: true })),
});

export const readonly = makeStory(conf, {
  items: items.map((p) => ({ ...p, required: true, readonly: true, value: 'Readonly text' })),
});

export const disabled = makeStory(conf, {
  items: items.map((p) => ({ ...p, disabled: true })),
});

export const requiredAndDisabled = makeStory(conf, {
  items: items.map((p) => ({ ...p, disabled: true, required })),
});

export const autofocus = makeStory(conf, {
  docs: `
  All fields have the autofocus attribute, so it's the last one in the dom that gets it.
`,
  items: items.map((p) => ({ ...p, autofocus: true })),
});

export const skeleton = makeStory(conf, {
  items: items.map((p) => ({ ...p, skeleton: true })),
});
