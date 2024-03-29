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
import './gv-message';
import { makeStory } from '../../../testing/lib/make-story';

export default {
  title: 'Atoms/gv-message',
  component: 'gv-message',
};

const conf = {
  component: 'gv-message',
  css: `
    :host {
      height: 50px;
    }
  `,
};

const items = [{ innerHTML: 'The cake is a lie' }];

export const Default = makeStory(conf, {
  items: items.map((p) => ({ ...p })),
});

export const Info = makeStory(conf, {
  items: items.map((p) => ({ ...p, type: 'info' })),
});

export const Success = makeStory(conf, {
  items: items.map((p) => ({ ...p, type: 'success' })),
});

export const Warning = makeStory(conf, {
  items: items.map((p) => ({ ...p, type: 'warning' })),
});

export const Error = makeStory(conf, {
  items: items.map((p) => ({ ...p, type: 'error' })),
});

export const Closable = makeStory(conf, {
  items: items.map((p) => ({ ...p, closable: true })),
});

export const WithHtml = makeStory(conf, {
  items: items.map((p) => ({ innerHTML: '<b>Some text</b> with a <a href="#">link</a>' })),
});

export const ClosableWithButton = makeStory(
  { ...conf, events: ['gv-button:click'] },
  {
    items: items.map((p) => ({ innerHTML: 'hello <gv-button>toto</gv-button>', closable: true })),
  },
);
