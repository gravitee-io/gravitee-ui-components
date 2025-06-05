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

import DOMPurify from 'dompurify';
import { marked } from 'marked';

export async function loadAsciiDoctor() {
  let _gvAsciidoctor = window._gvAsciidoctor;

  // Load asciidoctor if is not already loaded
  if (_gvAsciidoctor == null) {
    _gvAsciidoctor = (await import('@asciidoctor/core')).default();
    window._gvAsciidoctor = _gvAsciidoctor;
  }

  // Load asciidoctor highlight if is not already loaded
  if (window._gvAsciidoctorHighlight == null) {
    const highlightJsExt = await import('asciidoctor-highlight.js');
    highlightJsExt.default.register(_gvAsciidoctor.Extensions);
    window._gvAsciidoctorHighlight = true;
  }
  return _gvAsciidoctor;
}

export async function toDom(text, type = 'adoc', small = false) {
  if (!text) return;

  let innerHTML = '';
  if (type === 'adoc') {
    const asciidoctor = await loadAsciiDoctor();
    const htmlContent = asciidoctor
      .convert(text, {
        attributes: {
          showtitle: true,
          'source-highlighter': 'highlightjs-ext',
        },
      })
      .replace(/href="#/g, `href="${window.location.href}#`);
    innerHTML = DOMPurify.sanitize(htmlContent);
  } else if (type === 'md' || type === 'markdown') {
    const htmlContent = marked.parse(text).replace(/href="#/g, `href="${window.location.href}#`);
    innerHTML = DOMPurify.sanitize(htmlContent);
  } else {
    throw new Error(`Unsupported documentation type: '${type}'`);
  }

  const element = document.createElement('div');
  element.innerHTML = innerHTML;
  element.style.width = '100%';
  element.style.maxWidth = '1000px';
  element.style.margin = '5px auto';
  element.classList.add('markdown-body');
  if (small) {
    element.classList.add('small');
  }

  const titleElement = element.querySelector('h1');
  const title = titleElement ? titleElement.textContent : '';

  return { title, element };
}
