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
import 'github-markdown-css/github-markdown.css';
import 'highlight.js/styles/vs.css';
import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  // Enable HTML tags in source
  html: true,
  // Use '/' to close single tags (<br />).
  xhtmlOut: false,
  // This is only for full CommonMark compatibility.
  // Convert '\n' in paragraphs into <br>
  breaks: false,
  // CSS language prefix for fenced blocks. Can be useful for external highlighters.
  langPrefix: 'language-',

  // Autoconvert URL-like text to links
  linkify: true,

  // Enable some language-neutral replacement + quotes beautification
  typographer: true,

  // Double + single quotes replacement pairs, when typographer enabled,
  // and smartquotes on. Could be either a String or an Array.
  // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
  // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
  quotes: '“”‘’',

  // Highlighter function. Should return escaped HTML,
  // or '' if the source string is not changed and should be escaped externally.
  // If result starts with <pre... internal wrapper is skipped.
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      }
      catch (__) {
      }
    }

    // use external default escaping
    return '';
  },
});

export function markdownToDom (markdownText) {

  const html = md.render(markdownText);

  const element = document.createElement('div');
  element.style.width = '100%';
  element.style.margin = '2rem';
  element.classList.add('markdown-body');
  element.innerHTML = html;

  const title = element.querySelector('h1').textContent;

  return { title, element };
}
