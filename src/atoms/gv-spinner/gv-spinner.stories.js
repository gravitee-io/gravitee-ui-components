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
import './gv-spinner';
import '../gv-image';
import { makeStory } from '../../../testing/lib/make-story';

export default {
  title: 'Atoms/gv-spinner',
  component: 'gv-spinner',
  parameters: {
    chromatic: { disable: true },
  },
};

const conf = {
  component: 'gv-spinner',
  css: `
    :host {
      width: 200px;
      height: 200px;
    }
  `,
};

const items = [{}];

export const basic = makeStory(conf, {
  items,
});
