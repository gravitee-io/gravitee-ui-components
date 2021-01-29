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
import { setAsciiDoctorAsGlobal, toDom } from '../../src/lib/text-format';
import Readme from '../../README.adoc';
import Contributing from '../../CONTRIBUTING.adoc';
import Theme from '../../docs/theme.md';
import { Parser as HtmlToReactParser } from 'html-to-react';
import asciidoctor from 'asciidoctor';
import highlightJsExt from 'asciidoctor-highlight.js';

setAsciiDoctorAsGlobal(asciidoctor, highlightJsExt);

const htmlToReactParser = new HtmlToReactParser();

function domToReact(element) {
  return htmlToReactParser.parse(element.outerHTML);
}

export function createDocsStories(kind, stories) {
  stories.forEach(({ name, text, type }) => {
    const dom = toDom(text, type);
    storiesOf(kind + '/' + name, module)
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

createDocsStories('Welcome', [
  { name: ' Readme', text: Readme, type: 'adoc' },
  { name: 'Contributing', text: Contributing, type: 'adoc' },
]);

createDocsStories('Documentation', [{ name: 'Theme/LearnMore', text: Theme }]);
