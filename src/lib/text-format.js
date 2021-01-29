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

export function loadAsciiDoctor() {
  if (window._gvAsciidoctor == null) {
    return Promise.all([import('asciidoctor'), import('asciidoctor-highlight.js')]).then(([asciidoctor, highlightJsExt]) => {
      window._gvAsciidoctor = asciidoctor.default();
      highlightJsExt.default.register(window._gvAsciidoctor.Extensions);
      return setAsciiDoctorAsGlobal(asciidoctor.default, highlightJsExt.default);
    });
  }
  return Promise.resolve(window._gvAsciidoctor);
}

export function setAsciiDoctorAsGlobal(asciidoctor, highlightJsExt) {
  if (window._gvAsciidoctor == null) {
    window._gvAsciidoctor = asciidoctor();
    highlightJsExt.register(window._gvAsciidoctor.Extensions);
  }
  return window._gvAsciidoctor;
}

export function toDom(text, type = 'adoc', small = false) {
  if (window._gvAsciidoctor) {
    if (text) {
      let innerHTML = '';
      if (type === 'adoc') {
        innerHTML = window._gvAsciidoctor.convert(text, {
          attributes: {
            showtitle: true,
            'source-highlighter': 'highlightjs-ext',
          },
        });
      } else {
        throw new Error(`Library not found for type : '${type}' | ${text}`);
      }

      const element = document.createElement('div');
      element.innerHTML = innerHTML;
      element.style.width = '100%';
      element.style.maxWidth = '1000px';
      element.style.margin = '0 auto';
      element.classList.add('markdown-body');
      if (small) {
        element.classList.add('small');
      }
      const title = element.querySelector('h1').textContent;

      return { title, element };
    }
  } else {
    console.error('Should loadAsciiDoctor before convert content');
  }

  return null;
}
