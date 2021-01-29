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
import '../../src/organisms/gv-properties';
import notes from '../../.docs/gv-properties.md';
import { makeStory } from '../lib/make-story';

export default {
  title: 'Organisms/gv-properties',
  component: 'gv-properties',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-properties',
};

export const Empty = makeStory(conf, {
  items: [{}],
});

const properties = [
  { key: 'file.encoding', value: 'UTF-8' },
  { key: 'file.separator', value: '/' },
  { key: 'ftp.nonProxyHosts', value: 'local|*.local|169.254/16|*.169.254/16' },
  { key: 'java.awt.headless', value: 'true' },
];

export const Basics = makeStory(conf, {
  items: [
    {
      properties,
    },
  ],
});

export const Expert = makeStory(conf, {
  items: [
    {
      properties,
      expert: true,
    },
  ],
});
