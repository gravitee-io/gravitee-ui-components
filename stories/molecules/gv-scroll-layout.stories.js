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
import '../../src/molecules/gv-scroll-layout';
import { makeStory } from '../lib/make-story';

export default {
  title: 'Molecules/gv-scroll-layout',
  component: 'gv-scroll-layout',
};

const items = [
  {
    innerHTML: `
  <div slot="header-left">
    <gv-button
      icon="general:close"
      outlined
      small
      title="Close (esc)"
    ></gv-button>
    <gv-button
      icon="home:book"
      outlined
      small
      title="Open documentation"
    ></gv-button>
  </div>

  <div slot="header-title">
    The title
  </div>

  <div slot="header-right">
    <gv-button
      id="reset"
      outlined
      small
      icon="general:update"
      title="Reset"
    ></gv-button>
    <gv-button
      id="submit"
      small
      icon="code:check"
    ></gv-button>
  </div>

  <div slot="content">
    The Long content
    <div style="height:800px"></div>
    The End
  </div>
`,
  },
];

const conf = {
  component: 'gv-scroll-layout',
  css: `
      gv-scroll-layout {
        display: block;
        max-width: 500px;
        height: 500px;
      }
    `,
};
export const empty = makeStory(conf, { items: [{}] });

export const skeleton = makeStory(conf, { items: items.map((p) => ({ ...p, skeleton: true })) });

export const withHeaderAndContent = makeStory(conf, { items });
