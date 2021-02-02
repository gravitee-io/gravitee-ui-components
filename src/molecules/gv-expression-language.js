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
import { css, LitElement } from 'lit-element';
import { html } from 'lit-html';
import '../molecules/gv-code';
import CodeMirror from 'codemirror/lib/codemirror';
import 'codemirror/addon/hint/show-hint';
import { get } from 'object-path';
import { input } from '../styles/input';
import { dispatchCustomEvent } from '../lib/events';

/**
 * Expression Language component
 *
 * @fires gv-expression-language:input - input events with the `value` on `detail`
 * @fires gv-expression-language:ready - event dispatch when component is ready
 *
 * @attr {String} value - the value of the input
 * @attr {String} label - label of the input
 * @attr {String} placeholder - an example value to display in the input when empty
 * @attr {Object} grammar - Grammar for expression languages
 * @attr {Number} rows - Number of rows, if rows=1 the field will look like an input text
 * @attr {Object} options -  options based on codemirror https://codemirror.net/doc/manual.html#config
 */
export class GvExpressionLanguage extends LitElement {
  static get properties() {
    return {
      label: { type: String },
      placeholder: { type: String },
      value: { type: String, reflect: true },
      grammar: { type: Object },
      rows: { type: Number },
      options: { type: Object, attribute: false },
      disabled: { type: Boolean, reflect: true },
      required: { type: Boolean, reflect: true },
      readonly: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.addEventListener('gv-code:ready', this._onReady);
    this.addEventListener('gv-code:input', this._onInput);
  }

  connectedCallback() {
    super.connectedCallback();
    // Experimental
    // CodeMirror.registerHelper('lint', 'javascript', this._lintValidator);
  }

  _onReady(event) {
    event.preventDefault();
    event.stopPropagation();
    const codeElement = this.codeElement;
    codeElement.addEventListener('keydown', this._onKeydown);
    const codemirror = codeElement.getCM();
    codemirror.setOption('extraKeys', {
      'Cmd-E': this.insertOrSuggest.bind(this, codemirror),
      'Ctrl-E': this.insertOrSuggest.bind(this, codemirror),
    });
    codemirror.on('keydown', (cm, event) => {
      this._lastKeyDown = event.key;
    });
    dispatchCustomEvent(this, 'ready', { currentTarget: this });
  }

  // Experimental
  // _lintValidator (text, options) {
  //   const els = text.match(EL_REGEX);
  //   if (els != null) {
  //     return els.map((el) => {
  //       const assign = el.match(/=/g);
  //       const compare = el.match(/==/g);
  //       if (assign != null && compare == null) {
  //         const start = text.indexOf(el) + el.indexOf('=');
  //         const end = start + 1;
  //         return {
  //           message: `Expected a conditional expression and instead saw an assignment. (use '==' instead '=')`,
  //           severity: 'warning',
  //           from: CodeMirror.Pos(0, start),
  //           to: CodeMirror.Pos(0, end),
  //         };
  //       }
  //       return null;
  //     })
  //       .filter((el) => el != null);
  //   }
  //   return [];
  // }

  getPreviousKey(key) {
    if (key != null && key.indexOf('.') > -1) {
      const keys = key.split('.');
      // Remove last element
      keys.splice(-1, 1);
      return keys.join('.');
    }
    return null;
  }

  getType(typeId) {
    if (this.grammar != null) {
      return get(this.grammar, `_types.${typeId}`);
    }
    return null;
  }

  getEnum(typeId) {
    if (this.grammar != null) {
      return get(this.grammar, `_enums.${typeId}`);
    }
    return null;
  }

  isArray(typeId) {
    return typeId && typeId.match(/[a-zA-Z]*\[\]$/g);
  }

  isMap(typeId) {
    return ['Map', 'HttpHeaders', 'MultiValueMap'].includes(typeId);
  }

  buildMethods(methods, methodName = '') {
    const prefix = methodName == null || methodName.trim() === '' ? '.' : '';
    const list = methods
      .filter(({ name }) => name.startsWith(methodName))
      .map(({ name, params = [], returnType }) => {
        const text = `${prefix}${name}()`;
        const displayParams = params.map((p) => `${p.type} ${p.name}`);
        const displayText = `${name}(${displayParams.join(', ')}): ${returnType}`;
        return { text, displayText };
      });
    return { list };
  }

  buildEnum(candidate, parameter) {
    parameter = parameter || '';
    const prefix = `'`;
    const typeEnum = this.getEnum(candidate._type);
    if (typeEnum != null) {
      const list = typeEnum
        .filter((value) => value.toLowerCase().startsWith(parameter.toLowerCase()))
        .map((g) => ({
          text: `${prefix}${g}`,
          displayText: `${g}`,
        }));
      return { list };
    }
    return { list: [] };
  }

  isFunction(term) {
    if (term != null) {
      return term.match(/\({1}.*\)$/g) != null;
    }
    return false;
  }

  findMethod(type, methodName) {
    return type.methods.find(({ name }) => name === methodName);
  }

  findReturnType(typeId, words = []) {
    const fns = words.filter(({ fn }) => fn);
    let type = this.getType(typeId);
    if (fns.length > 0) {
      fns.forEach(({ term }) => {
        const method = this.findMethod(type, term);
        if (method) {
          typeId = method.returnType;
          type = this.getType(method.returnType);
        }
      });
    } else if (words.length > 1 && words[words.length - 2].term.endsWith(']')) {
      if (this.isMap(typeId)) {
        return this.getType('String');
      } else if (this.isArray(typeId)) {
        return this.getType(typeId.replaceAll(/\[]/g, ''));
      }
    }
    return type;
  }

  insertOrSuggest(codemirror) {
    const cursor = codemirror.getCursor();
    const caretPosition = cursor.ch;
    const currentEL = this.getCurrentEl(caretPosition, cursor.line);
    if (currentEL != null) {
      this._suggest();
    } else {
      const pos = { line: cursor.line };
      const data = '{#}';
      codemirror.replaceRange(data, pos, pos);
      codemirror.setCursor(cursor.line, caretPosition + 2);
    }
  }

  isHttpHeader(candidate, key) {
    return (
      candidate &&
      key &&
      candidate._type === 'HttpHeaders' &&
      key.match(/headers$/g) &&
      key.match('/headers\\[(.*)\\]\\[(.*)\\]$/g') == null
    );
  }

  getEnumTerm(term) {
    if (term.match(/\['[a-z-_]*$/gi)) {
      const splitted = term.split(`['`);
      return splitted[splitted.length - 1];
    }
    return null;
  }

  getGrammar({ sentence = null, key = null, words = [], fn = [] }) {
    let grammar = [];
    let prefix = '';
    if (sentence && sentence.match(/^#[a-zA-Z]*/g)) {
      grammar = this.grammar;
    }
    if (key != null) {
      const isArray = sentence && sentence.match(/[[\w'"-]+(\].)([a-zA-Z]*)$/);
      let candidate = get(this.grammar, key);
      if (candidate != null && !key.endsWith('.') && !isArray && !this.isHttpHeader(candidate, key)) {
        return { list: [] };
      }
      if (candidate == null) {
        const previousKey = this.getPreviousKey(key);
        if (previousKey != null) {
          candidate = get(this.grammar, previousKey);
          if (key.endsWith('.')) {
            prefix = '.';
          }
        }
      }
      if (candidate != null) {
        const lastTerm = words.length ? words[words.length - 1].term : '';
        if (this.isMap(candidate._type)) {
          const enumTerm = this.getEnumTerm(lastTerm);
          if (enumTerm != null) {
            return this.buildEnum(candidate, enumTerm);
          }
        }
        const type = this.findReturnType(candidate._type, words);
        if (type && type.methods != null) {
          return this.buildMethods(type.methods, lastTerm);
        }
        grammar = candidate;
      }
    }

    if (grammar == null) {
      return { list: [] };
    }

    const list = Object.keys(grammar)
      .filter((prop) => !prop.startsWith('_'))
      .map((g) => {
        const suffix = this.getSuffix(grammar[g]);
        const text = `${prefix}${g}${suffix}`;
        const displayText = `${g}${suffix}`;
        return { text, displayText };
      });

    return { list };
  }

  getSuffix(candidate) {
    if (this.isArray(candidate._type)) {
      return '[]';
    } else if (this.isMap(candidate._type)) {
      return `[''][0]`;
    } else {
      return '';
    }
  }

  getCurrentEl(caretPosition, line = 0) {
    if (this.value != null) {
      const value = this.value.split('\n')[line];

      const group = value.match(/({[ ]*#[\w-. =+-<>!?'"[\]#()]*\})/g);
      if (group != null) {
        let start;
        let end;
        const el = group.find((group) => {
          start = value.indexOf(group);
          end = start + group.length;
          return caretPosition > start && caretPosition < end;
        });
        if (el != null) {
          return { el, caretPosition, start, end };
        }
      }
    }
    return null;
  }

  analyse({ el, start, caretPosition }) {
    const end = caretPosition - start >= 1 ? caretPosition - start : 1;
    const expressions = el.slice(1, end).trim().split('.');
    let sentence = '';
    const words = expressions.map((k) => {
      const fn = this.isFunction(k);
      let term = '';
      if (fn) {
        term = k.split('(')[0];
      } else {
        term = k;
        sentence += `.${k}`;
      }
      return { term, fn };
    });
    if (sentence) {
      sentence = sentence.slice(1);
    }

    let key = sentence.indexOf('#') > -1 ? sentence.split('#').reverse()[0] : null;
    if (key === '') {
      key = null;
    }
    if (key != null) {
      key = key.split('[')[0];
    }
    return { sentence, key, words };
  }

  get codeElement() {
    return this.shadowRoot.querySelector('gv-code');
  }

  canMoveCursor() {
    return !['Backspace', 'Delete'].includes(this._lastKeyDown);
  }

  _suggest() {
    const codeElement = this.codeElement;
    const codemirror = codeElement.getCM();
    const cursor = codemirror.getCursor();
    const caretPosition = cursor.ch;
    const currentEL = this.getCurrentEl(caretPosition, cursor.line);
    if (currentEL != null) {
      const { sentence, key, words, fn } = this.analyse(currentEL);
      const { list } = this.getGrammar({ sentence, key, words, fn });
      if (this.canMoveCursor() && (sentence.endsWith('()') || sentence.endsWith('[]'))) {
        codemirror.setCursor(cursor.line, caretPosition - 1);
        this._suggest();
      } else if (this.canMoveCursor() && sentence.endsWith(`[''][0]`)) {
        codemirror.setCursor(cursor.line, caretPosition - 5);
        this._suggest();
      } else {
        this._doSuggest(list);
      }
    }
  }

  _onInput(event) {
    event.preventDefault();
    event.stopPropagation();
    this.value = event.detail;
    this._suggest();
    dispatchCustomEvent(this, 'input', this.value);
  }

  _doSuggest(suggestions = [], prefix = '#') {
    if (suggestions == null) {
      suggestions = [];
    }
    const code = this.codeElement;
    const hint = this.shadowRoot.querySelector('#hint');
    const codemirror = code.getCM();
    CodeMirror.showHint(
      codemirror,
      () => {
        const cursor = codemirror.getCursor();
        const token = codemirror.getTokenAt(cursor);
        const start = token.start;
        const end = cursor.ch;
        const line = cursor.line;
        const currentWord = token.string;
        let _suggestions = [];
        if (currentWord.startsWith(prefix)) {
          _suggestions = suggestions.map((item) => {
            return { ...item, text: `${prefix}${item.text}` };
          });
        } else {
          _suggestions = suggestions;
        }

        const list = _suggestions.filter((item) => {
          return item.text.indexOf(currentWord) >= 0;
        });
        return {
          list: list.length ? list : _suggestions,
          from: CodeMirror.Pos(line, start),
          to: CodeMirror.Pos(line, end),
        };
      },
      { completeSingle: false, container: hint },
    );
  }

  render() {
    const options = {
      ...{
        mode: 'javascript',
        autoCloseTags: true,
        autoCloseBrackets: true,
        matchTags: true,
        lint: false,
        // lint: {
        //   selfContain: true,
        // },
      },
      ...(this.options || {}),
    };
    return html`<div title="Ctrl-E or Cmd-E to insert EL">
      <label>${this.label}</label>
      <gv-code
        .options="${options}"
        .value="${this.value}"
        rows="${this.rows}"
        ?disabled="${this.disabled}"
        ?readonly="${this.readonly}"
        ?required="${this.required}"
        .placeholder="${this.placeholder}"
      ></gv-code>
      <div id="hint"></div>
    </div>`;
  }

  static get styles() {
    return [
      input,
      // language=CSS
      css`
        :host {
          width: 100%;
        }

        gv-code {
          margin: 0;
          font-size: 14px;
        }

        .CodeMirror-hints {
          position: absolute;
          z-index: 80;
          overflow: hidden;
          list-style: none;

          margin: 0;
          padding: 2px;

          -webkit-box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.2);
          -moz-box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.2);
          box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.2);
          border-radius: 3px;
          border: 1px solid silver;

          background: white;
          font-family: monospace;

          max-height: 20em;
          overflow-y: auto;
        }

        .CodeMirror-hint {
          padding: 4px;
          border-radius: 2px;
          white-space: pre;
          color: black;
          cursor: pointer;
        }

        li.CodeMirror-hint-active {
          background: var(--gv-theme-color, #5a7684);
          color: white;
        }
      `,
    ];
  }
}

window.customElements.define('gv-expression-language', GvExpressionLanguage);
