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
import '../../src/molecules/gv-dropdown-menu';
import notes from '../../.docs/gv-dropdown-menu.md';
import { makeStory } from '../lib/make-story';
import '../../src/atoms/gv-button';
import '../../src/atoms/gv-link';

export default {
  title: 'Molecules/gv-dropdown-menu',
  component: 'gv-dropdown-menu',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-dropdown-menu',
  css: `
    :host {
      height: 150px;
    }
  `,
};

export const Basic = makeStory(conf, {
  items: [{
    innerHTML: '<gv-button link icon="general:other#1"></gv-button>'
      + '<div slot="action">foobar</div>' + '<div slot="action">foobar</div>',
  }],
});
