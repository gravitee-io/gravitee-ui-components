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
import { css, LitElement, html } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

import CodeMirror from 'codemirror/lib/codemirror';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/matchtags';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/search/jump-to-line';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/json-lint';
import 'codemirror/addon/lint/yaml-lint';
import 'codemirror/addon/display/placeholder';
import { i18n } from '../lib/i18n';
import { shapeClipboard, shapeCopied } from '../styles/shapes';
import { skeleton } from '../styles/skeleton';
import { dispatchCustomEvent } from '../lib/events';
import { InputElement } from '../mixins/input-element';
import { uuid } from '../lib/utils';
import { input } from '../styles/input';
import { empty } from '../styles/empty';

/**
 * Code component
 *
 * ## Details
 * * This component requires that the "gravitee-ui-components/assets/css" folder be mounted on "/css" of your webapp
 * * has @theme facet
 *
 * @fires gv-code:input - input events with the `value` on `detail`
 * @fires gv-code:ready - event dispatch when component is ready
 * @fires gv-code:clipboard-copy - event dispatch when component the `value` has been copied to clipboard
 *
 * @attr {String} label - code language
 * @attr {String} value - code content to be highlighted
 * @attr {options} Object - options based on codemirror https://codemirror.net/doc/manual.html#config
 * @attr {String} placeholder - an example value to display in the input when empty
 * @attr {Number} rows - number of rows of the text element
 * @attr {Boolean} large - for a large input (only if the field has one row)
 * @attr {Boolean} medium - for a medium input (only if the field has one row) (Default)
 * @attr {Boolean} small - for a small input (only if the field has one row)
 *
 * @attr {Boolean} [clipboard=false]- true if field has clipboard button
 * @attr {Boolean} [autofocus=false] - true to put the focus on the input
 * @attr {Boolean} [readonly=false] - true if field is readonly mode
 */
export class GvCode extends InputElement(LitElement) {
  static get properties() {
    return {
      ...super.properties,
      options: { type: Object },
      clipboard: { type: Boolean },
      _clipboardIcon: { type: String },
      _codeMirror: { type: Object },
      rows: { type: Number },
      _error: { type: String, attribute: false },
    };
  }

  constructor() {
    super();
    this._id = `gv-code-${uuid()}`;
    this.value = '';
    this.readonly = false;
    this.autofocus = false;
    this.clipboard = false;
    this._clipboardIcon = shapeClipboard;
  }

  _onError() {
    this._error = `Cannot load library, please read the documentation.`;
  }

  async _onLoad() {
    if (this._loaded !== true) {
      this._loaded = true;
      if (this.clipboard) {
        import('clipboard-copy').then((mod) => {
          const copy = mod.default;
          this.shadowRoot.querySelector('gv-button').addEventListener('gv-button:click', () => {
            copy(this.value);
            this._copied = true;
            this._clipboardIcon = shapeCopied;
            dispatchCustomEvent(this, 'clipboard-copy');
            setTimeout(() => {
              this._copied = false;
              this._clipboardIcon = shapeClipboard;
            }, 1000);
          });
        });
      }
      const options = this._getProcessedOptions();

      try {
        if (options.mode != null) {
          const mode = typeof options.mode === 'string' ? options.mode : options.mode.name;
          if (mode === 'asciidoc') {
            await import('codemirror-asciidoc/lib/asciidoc');
          } else {
            await import(`codemirror/mode/${mode}/${mode}`);
          }
        }
      } catch (er) {}

      const textArea = this.shadowRoot.querySelector(`#${this._id}`);
      this._codeMirror = CodeMirror.fromTextArea(textArea, {
        ...options,
        ...{
          theme: 'mdn-like',
          lineWrapping: true,
          readOnly: this.readonly,
          autofocus: this.autofocus,
          scrollbarStyle: this.singleLine ? null : 'native',
        },
      });

      if (this.autofocus) {
        setTimeout(() => {
          this._codeMirror.focus();
        }, 200);
      }

      dispatchCustomEvent(this, 'ready');
    }
  }

  render() {
    if (this._error != null) {
      return html`<div class="error">${this._error}</div>`;
    }

    return html`
      <link @load="${this._onLoad}" @error=${this._onError} rel="stylesheet" href="./css/codemirror/all.css" />
      <div
        class="${classMap({
          box: true,
          'box-invisible': this.skeleton,
          large: this.large,
          medium: this.medium || (!this.large && !this.small),
          small: this.small,
        })}"
      >
        <div class="${classMap({ input: this.singleLine })}">
          ${this.label ? html`<label for="code">${this.label}</label>` : ''}
          ${this.clipboard
            ? html`<gv-button
                title="${i18n('gv-code.copy')}"
                ?outlined="${!this._copied}"
                ?primary="${this._copied}"
                small
                icon="${this._clipboardIcon}"
              ></gv-button>`
            : ''}
          <textarea id="${this._id}" name="code">${this.value}</textarea>
          ${this.skeleton ? html`<div class="skeleton"></div>` : ''}
        </div>
      </div>
      ${this.description != null ? html`<div class="description" .innerHTML="${this.description}"></div>` : ''}
    `;
  }

  _onChange(cm) {
    this.value = cm.getValue();
    dispatchCustomEvent(this, 'input', this.value);
  }

  get singleLine() {
    return this.rows === 1;
  }

  disconnectedCallback() {
    if (this._codeMirror != null) {
      this._codeMirror.off('beforeChange', this._handlers.beforeChange);
      this._codeMirror.off('change', this._handlers.change);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._handlers = {
      beforeChange: (cm, event) => {
        if (this.singleLine && this._id === cm.getTextArea().id) {
          // Identify typing events that add a newline to the buffer.
          const hasTypedNewline = event.origin === '+input' && typeof event.text === 'object' && event.text.join('') === '';

          // Prevent newline characters from being added to the buffer.
          if (hasTypedNewline) {
            return event.cancel();
          }

          // Identify paste events.
          const hasPastedNewline = event.origin === 'paste' && typeof event.text === 'object' && event.text.length > 1;

          // Format pasted text to replace newlines with spaces.
          if (hasPastedNewline) {
            const newText = event.text.join(' ');
            return event.update(null, null, [newText]);
          }
        }
        return null;
      },
      change: (cm) => {
        if (this._id === cm.getTextArea().id) {
          this._onChange(cm);
        }
      },
    };
    CodeMirror.defineInitHook((cm) => {
      cm.on('beforeChange', this._handlers.beforeChange);
      cm.on('change', this._handlers.change);
    });
  }

  _getProcessedOptions() {
    const options = { ...this.options };
    if (options.mode === 'json' || options.mode === 'application/json') {
      options.mode = {
        name: 'javascript',
        json: true,
      };
    }
    if (this.placeholder) {
      options.placeholder = this.placeholder;
    }

    return options;
  }

  async updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('label') && this.label) {
      this.screenReaderLabel = this.label;
    } else if (changedProperties.has('value')) {
      if (this.getCM() != null && this.getCM().getValue() !== this.value) {
        const value = this.value != null ? this.value : '';
        this.getCM().setValue(value);
      }
      this.resize();
    }
  }

  getCM() {
    return this._codeMirror;
  }

  resize() {
    if (this._codeMirror) {
      const options = this._getProcessedOptions();
      if (this.value == null && options.placeholder) {
        const placeholderByLines = options.placeholder.split('\n');
        this._codeMirror.setSize(null, placeholderByLines.length * 18);
      } else {
        this._codeMirror.setSize(null, null);
      }
    }
  }

  static get styles() {
    return [
      skeleton,
      empty,
      input,
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          display: block;
          margin: 0 0.2rem 0.2rem 0.2rem;
        }

        .skeleton {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          color: white;
        }

        .box {
          position: relative;
        }

        .box-invisible {
          min-height: 70px;
        }

        .box-invisible > *:not(.skeleton) {
          visibility: hidden;
          opacity: 0;
        }

        textarea[name='code'] {
          display: none;
        }

        label {
          line-height: 15px;
          padding: 0 0 0.2rem 0;
        }

        gv-button {
          position: absolute;
          right: 0;
          top: 0;
          z-index: 10;
        }

        /** Enable autoresize: https://codemirror.net/demo/resize.html **/
        .CodeMirror {
          height: auto;
        }

        /** Overwrite code mirror colors **/
        :host([invalid]) .cm-s-mdn-like .CodeMirror-gutters {
          border-color: var(--gv-theme-color-error-dark, #d32f2f);
        }

        .cm-s-mdn-like .CodeMirror-gutters {
          border-left: 6px solid var(--gv-theme-color, #5a7684);
        }

        /** Overwrite code mirror for input style **/
        .input {
          --input-medium--p: 11px 5px 9px;
        }

        .input .CodeMirror-lines {
          padding: 0;
        }

        .medium .input .CodeMirror {
          height: var(--input-medium--lh);
        }

        .small .input .CodeMirror {
          height: var(--input-small--lh);
        }

        .large .input .CodeMirror {
          height: var(--input-large--lh);
        }

        .input pre.CodeMirror-line,
        .input pre.CodeMirror-line-like {
          white-space: nowrap;
        }

        .input .CodeMirror-sizer {
          height: 28px;
          border: 0;
        }

        .input .CodeMirror-scroll {
          width: 100%;
          overflow: hidden !important;
        }
      `,
    ];
  }
}

window.customElements.define('gv-code', GvCode);
