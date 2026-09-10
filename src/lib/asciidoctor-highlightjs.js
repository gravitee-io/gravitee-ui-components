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

/**
 * Value to give to the `source-highlighter` document attribute to colorize source blocks with Highlight.js while
 * converting, instead of relying on the `highlightjs` adapter shipped by Asciidoctor which only emits CSS classes and
 * defers the highlighting to a script loaded at runtime.
 */
export const HIGHLIGHTER_NAME = 'highlightjs-ext';

// Same set as the Asciidoctor `specialcharacters` substitution, which highlighting replaces.
const SPECIAL_CHARS = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };

function escapeSpecialChars(source) {
  return source.replace(/[&<>]/g, (char) => SPECIAL_CHARS[char]);
}

/**
 * Register the Highlight.js syntax highlighter into an Asciidoctor module.
 *
 * The markup it produces is the one Asciidoctor emits for a source block without any highlighter
 * (`<pre class="highlight"><code class="language-xxx" data-lang="xxx">`), with the source colorized by Highlight.js.
 *
 * @param asciidoctor the `@asciidoctor/core` module
 */
export async function registerHighlightJs(asciidoctor) {
  const hljs = (await import('highlight.js')).default;

  class HighlightJsSyntaxHighlighter extends asciidoctor.SyntaxHighlighterBase {
    handlesHighlighting() {
      return true;
    }

    highlight(node, source, lang) {
      if (lang === 'auto') {
        const { language, value } = hljs.highlightAuto(source);
        node.setAttribute('language', language);
        return value;
      }
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(source, { language: lang, ignoreIllegals: true }).value;
      }
      // Highlighting takes the place of the `specialcharacters` substitution, so an unhandled language still has to be
      // escaped.
      return escapeSpecialChars(source);
    }

    format(node, lang, opts) {
      return super.format(node, lang, {
        ...opts,
        transform: (pre, code) => {
          pre.class = opts.nowrap ? 'highlight nowrap' : 'highlight';
          if (lang) {
            code.class = `language-${lang}`;
          }
        },
      });
    }
  }

  asciidoctor.SyntaxHighlighter.register(HighlightJsSyntaxHighlighter, HIGHLIGHTER_NAME);
}
