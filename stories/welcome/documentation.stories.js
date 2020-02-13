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
import { storiesOf } from '@storybook/web-components';
import { domToReact, toDom } from '../lib/text-format';

import Readme from '../../README.adoc';
import Contributing from '../../CONTRIBUTING.adoc';
import Theme from '../../docs/theme.md';

export function createDocsStories (kind, stories) {
  stories.forEach(({ name, text, type }) => {

    const dom = toDom(text, type);
    storiesOf(kind + '|' + name, module)
      .addParameters({
        options: { showPanel: false },
      })
      .add(dom.title, () => dom.element, {
        docsOnly: true,
        docs: {
          page: () => domToReact(dom.element),
        },
      });
  });
}

createDocsStories('Welcome',
  [
    { name: ' Readme', text: Readme, type: 'adoc' },
    { name: 'Contributing', text: Contributing, type: 'adoc' },
  ]
);

createDocsStories('Documentation',
  [
    { name: 'Theme/LearnMore', text: Theme },
  ]
);
