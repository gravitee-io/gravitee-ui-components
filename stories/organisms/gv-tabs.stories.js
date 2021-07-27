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
import '../../src/organisms/gv-tabs';
import '../../src/atoms/gv-button';
import { makeStory } from '../lib/make-story';

export default {
  title: 'Organisms/gv-tabs',
  component: 'gv-tabs',
};

const conf = {
  component: 'gv-tabs',
};

export const Simple = makeStory(conf, {
  items: [
    {
      options: ['tab-1', 'tab-2', 'tab-3'],
      value: 'one',
      innerHTML:
        '<div slot="content" id="tab-1">Content One</div>' +
        '<div slot="content" id="tab-2">Content two</div>' +
        '<div slot="content" id="tab-3">Content two</div>',
    },
  ],
});

export const WithTitle = makeStory(conf, {
  items: [
    {
      options: [
        { id: 'one', title: 'Tab 1' },
        { id: 'two', title: 'Tab 2' },
        { id: 'three', title: 'Tab 3' },
      ],
      value: 'one',
      innerHTML:
        '<div slot="content" id="one">Content One</div>' +
        '<div slot="content" id="two">Content two</div>' +
        '<div slot="content" id="three">Content three</div>' +
        '<div slot="title">My tabs</div>',
    },
  ],
});

export const WithValidator = makeStory(conf, {
  items: [
    {
      options: [{ id: 'one' }, { id: 'two' }, { id: 'three' }],
      value: 'two',
      innerHTML:
        '<div slot="content" id="one">You can open tab <b>two</b> or <b>three</b></div>' +
        '<div slot="content" id="two">You can only open tab <b>one</b></div>' +
        '<div slot="content" id="three">You can open tab <b>one</b> or <b>two</b></div>',
      validator: ({ from, to }) => {
        if (from === 'two' && to === 'three') {
          const reason = `[Validator] Cannot change tab from[${from}] to[${to}]`;
          // eslint-disable-next-line no-console
          console.log(reason);
          return Promise.reject(reason);
        }
        // eslint-disable-next-line no-console
        console.log(`[Validator] Can change tab from[${from}] to[${to}]`);
        return Promise.resolve();
      },
    },
  ],
});
