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
import { LitElement, css, html } from 'lit-element';
import hljs from 'highlight.js/lib/highlight';
import { link } from '../styles/link';
import '../atoms/gv-icon';
import { classMap } from 'lit-html/directives/class-map';
import { i18n } from '../lib/i18n';
import copy from 'clipboard-copy';

/**
 * Code wrapper component
 *
 * @attr {String} lang - code language
 *
 * @cssprop {String} [--gv-code--ff=Operator Mono, Inconsolata, Roboto Mono, monaco, consolas, monospace] - Font family
 * @cssprop {Length} [--gv-code--fz=var(--gv-theme-font-size-m, 14px)] - Font size
 * @cssprop {Color} [--gv-code--bgc=var(--gv-theme-neutral-color-lighter, #FAFAFA)] - Background color
 * @cssprop {Color} [--gv-code--c=var(--gv-theme-font-color-dark, #262626)] - Color
 * @cssprop {Length} [--gv-code--bdw=1px] - Border width
 * @cssprop {String} [--gv-code--bds=solid] - Border style
 * @cssprop {Color} [--gv-code--bdc=var(--gv-theme-color, #009B5B)] - Border color
 * @cssprop {Length} [--gv-code-icon--s=24px] - Height and icon width
 */
export class GvCode extends LitElement {

  static get shapeCopy () {
    return 'communication:clipboard-list';
  }

  static get shapeCopied () {
    return 'communication:clipboard-check';
  }

  static get properties () {
    return {
      lang: { type: String },
      _shape: { type: String, attribute: false },
    };
  }

  static get styles () {
    return [
      link,
      // language=css
      css`
        :host {
          box-sizing: border-box;
          margin: 0.2rem;
          display: block;
          --bgc: var(--gv-code--bgc, var(--gv-theme-neutral-color-lighter, #FAFAFA));
        }

        pre {
          padding: 1rem;
          white-space: pre-wrap;
          background-color: var(--bgc);
          color: var(--gv-code--c, var(--gv-theme-font-color-dark, #262626));
          border-width: var(--gv-code--bdw, 1px);
          border-style: var(--gv-code--bds, solid);
          border-color: var(--gv-code--bdc, var(--gv-theme-color, #009B5B));
          border-radius: 4px;
          display: flex;
        }

        code {
          font-family: var(--gv-code--ff, Operator Mono, Inconsolata, Roboto Mono, monaco, consolas, monospace);
          font-size: var(--gv-code--fz, var(--gv-theme-font-size-m, 14px));
          letter-spacing: 0.05em;
          line-height: 1.3;
          flex: 1;
        }

        .link {
          --gv-icon--s: var(--gv-code-icon--s, 24px);
          align-self: flex-end;
        }

        pre.copied {
          --gv-icon--c: var(--gv-theme-color, #009B5B);
          opacity: 0.8;
        }

        .hljs-comment,
        .hljs-quote {
          color: #696969;
        }

        .hljs-variable,
        .hljs-template-variable,
        .hljs-tag,
        .hljs-name,
        .hljs-selector-id,
        .hljs-selector-class,
        .hljs-regexp,
        .hljs-deletion {
          color: #d91e18;
        }

        .hljs-number,
        .hljs-built_in,
        .hljs-builtin-name,
        .hljs-literal,
        .hljs-type,
        .hljs-params,
        .hljs-meta,
        .hljs-link {
          color: #aa5d00;
        }

        .hljs-attribute {
          color: #aa5d00;
        }

        .hljs-string,
        .hljs-symbol,
        .hljs-bullet,
        .hljs-addition {
          color: #008000;
        }

        .hljs-title,
        .hljs-section {
          color: #00449E;
        }

        .hljs-keyword,
        .hljs-selector-tag {
          color: #7928a1;
        }

        .hljs {
          display: block;
          overflow-x: auto;
          padding: 0.5em;
        }

        .hljs-emphasis {
          font-style: italic;
        }

        .hljs-strong {
          font-weight: bold;
        }
      `,
    ];
  }

  constructor () {
    super();
    this.lang = 'html';
    this._shape = GvCode.shapeCopy;
  }

  _onCopy () {
    this.classList.add('copied');
    this._shape = GvCode.shapeCopied;
    setTimeout(() => {
      this._shape = GvCode.shapeCopy;
      this.classList.remove('copied');
    }, 500);

    const code = this.lang === 'shell' && this._code.charAt(0) === '$' ? this._code.substring(1) : this._code;
    copy(code.trim());
  }

  render () {
    const codeClasses = { hljs: true };
    codeClasses[this.lang] = true;
    const classes = { copied: GvCode.shapeCopied === this._shape };
    return html`<pre class="${classMap(classes)}">
        <code class="${classMap(codeClasses)}"><slot></slot></code>
        <gv-icon @click="${this._onCopy}" title="${i18n('gv-code.copy')}" shape="${this._shape}" class="link"></gv-icon>
        </pre>`;
  }

  async firstUpdated (changedProperties) {
    if (this.lang !== 'html') {
      const language = await import(`highlight.js/lib/languages/${this.lang}`);
      hljs.registerLanguage(this.lang, language.default);
    }
    const highlights = [];
    const contents = [];
    for (const node of this.childNodes) {
      const content = node.outerHTML || node.textContent;
      contents.push(content);
      highlights.push(hljs.highlight(this.lang, content).value);
    }
    this._code = contents.join('').trim();
    this.shadowRoot.querySelector('code').innerHTML = highlights.join('');
  }

}

window.customElements.define('gv-code', GvCode);
