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
import { css, html } from 'lit';

import { EditorView, basicSetup } from '@codemirror/basic-setup';
import { EditorState, Compartment } from '@codemirror/state';
import { autocompletion } from '@codemirror/autocomplete';
import { json } from '@codemirror/lang-json';
import { languages } from '@codemirror/language-data';
import { placeholder } from '@codemirror/view';

import { shapeClipboard } from '../../styles/shapes';
import { dispatchCustomEvent } from '../../lib/events';
import { uuid } from '../../lib/utils';
import { classMap } from 'lit/directives/class-map.js';
import { GvInput } from '../../atoms/gv-input';
import { skeleton } from '../../styles/skeleton';
import { empty } from '../../styles/empty';
import { input } from '../../styles/input';

/**
 * Code component
 *
 * ## Details
 * * has @theme facet
 *
 * @fires gv-code:input - input events with the `value` on `detail`
 * @fires gv-code:ready - event dispatch when component is ready
 * @fires gv-code:clipboard-copy - event dispatch when component the `value` has been copied to clipboard
 *
 * @attr {String} label - code language
 * @attr {String} value - code content to be highlighted
 * @attr {options} Object - options based on codemirror
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
export class GvCode extends GvInput {
  static get properties() {
    return {
      ...super.properties,
      options: { type: Object },
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
    this.languageCompartment = new Compartment();
    this.readonlyCompartment = new Compartment();
    this.placeholderCompartment = new Compartment();
  }

  render() {
    const classes = {
      box: true,
      'box-invisible': this.skeleton,
      large: this.large,
      medium: this.medium || (!this.large && !this.small),
      small: this.small,
      copied: this.hasClipboard && this._copied,
    };
    const inputClasses = {
      content: true,
      code: !this.hasInputStyle,
      input: this.hasInputStyle,
    };

    return html`
      <div class="${classMap(classes)}">
        ${this.label ? html`<label for="code">${this.label}</label>` : ''}
        <div id="${this._id}" class="${classMap(inputClasses)}">
          <!-- No format please -->
          ${this.renderIcon()}
        </div>
      </div>
      ${this.description != null ? html`<div class="description" .innerHTML="${this.description}"></div>` : ''}
    `;
  }

  bindInputEvents() {
    dispatchCustomEvent(this, 'ready', { currentTarget: this });
  }

  get hasInputStyle() {
    return this.rows === 1;
  }

  _autocomplete(completionContext) {
    const { handler, match } = this.findBestAutocompleteHandler(completionContext);
    return handler.run.call(this, completionContext, match);
  }

  findBestAutocompleteHandler(completionContext) {
    return { handler: this.defaultCompletionHandler, match: true };
  }

  get defaultCompletionHandler() {
    return {
      run(completionContext) {
        const language = completionContext.state.languageDataAt('autocomplete', completionContext.pos);
        if (language.length > 0) {
          return language[0](completionContext);
        }
        return { from: completionContext.pos, options: [] };
      },
    };
  }

  _getExtensions() {
    return [
      basicSetup,
      GvCode.codemirrorTheme,
      this.languageCompartment.of(json()),
      this.placeholderCompartment.of(placeholder(this.placeholder || '')),
      EditorState.transactionFilter.of((tr) => (this.hasInputStyle && tr.newDoc.lines > 1 ? [] : tr)),
      this.readonlyCompartment.of(EditorView.editable.of(!this.readonly && !this.disabled)),
      EditorView.updateListener.of((viewUpdate) => {
        const value = this._editorView.state.doc.toString();
        if (this.value !== value && viewUpdate.docChanged) {
          this._lockReflectValue = true;
          this.value = value;
          dispatchCustomEvent(this, 'input', this.value);
          setTimeout(() => {
            this._lockReflectValue = false;
          });
        }
      }),
      autocompletion({
        activateOnTyping: true,
        override: [this._autocomplete.bind(this)],
      }),
      ...this.getExtensions(),
    ];
  }

  getExtensions() {
    return [];
  }

  getInputElement() {
    return this.shadowRoot.querySelector(`[id=${this._id}]`);
  }

  firstUpdated() {
    super.firstUpdated();
    const state = EditorState.create({
      doc: this.value,
      extensions: this._getExtensions(),
    });
    const parent = this.getInputElement();
    this._editorView = new EditorView({
      root: this.shadowRoot,
      parent,
      state: state,
      dispatch: (transaction) => {
        try {
          this._editorView.update([transaction]);
        } catch (e) {
          // Sometimes the default dispatch fn throws an NS_ERROR_FAILURE at runtime.
          // It's so strange but with this catch everything is okay
        }
      },
    });
    parent.appendChild(this._editorView.dom);
  }

  async updated(properties) {
    super.updated(properties);
    if (properties.has('placeholder')) {
      this._reflectPlaceholder();
    }
    if (properties.has('value')) {
      this._reflectValue();
    }
    if (properties.has('readonly') || properties.has('disabled')) {
      this._reflectReadonlyDisabled();
    }
    if (properties.has('options') && this.options) {
      await this._reflectOptions();
    }
  }

  _reflectPlaceholder() {
    this._editorView.dispatch({
      effects: this.placeholderCompartment.reconfigure(placeholder(this.placeholder)),
    });
  }

  _reflectValue() {
    if (this._lockReflectValue === true) {
      return;
    }
    const transaction = this._editorView.state.update({
      changes: {
        from: 0,
        to: this._editorView.state.doc.length,
        insert: this.value,
      },
    });
    this._editorView.update([transaction]);
  }

  _reflectReadonlyDisabled() {
    this._editorView.dispatch({
      effects: this.readonlyCompartment.reconfigure(EditorView.editable.of(!this.readonly && !this.disabled)),
    });
  }

  static async findLanguage(mode) {
    if (mode) {
      const modeOnly = mode.split('/').pop();
      if (modeOnly === 'asciidoc') {
        const [{ asciidoc }, { StreamLanguage }] = await Promise.all([
          import('codemirror-asciidoc/lib/asciidoc'),
          import('@codemirror/stream-parser'),
        ]);
        return {
          name: 'asciidoc',
          support: {
            extension: StreamLanguage.define(asciidoc),
          },
        };
      } else {
        const language = languages.find((languageDescription) => {
          return languageDescription.name.toUpperCase() === modeOnly.toUpperCase() || languageDescription.alias.includes(modeOnly);
        });
        if (language == null) {
          console.warn(
            `Cannot find language ${mode}, please use language supported by CodeMirror 6`,
            languages.map((l) => l.name),
          );
        }
        return language;
      }
    }
    return null;
  }

  async _reflectOptions() {
    const language = await GvCode.findLanguage(this.options.mode);
    if (language != null) {
      if (language.support == null) {
        await language.load();
      }
      this._editorView.dispatch({
        effects: this.languageCompartment.reconfigure(language.support.extension),
      });
    }
  }

  static get codemirrorTheme() {
    return EditorView.theme({
      '&.cm-editor.cm-focused': {
        outline: 'none',
      },
      '.cm-gutters': {
        backgroundColor: 'var(--gv-input-icon--bgc, var(--gv-theme-neutral-color, #f5f5f5))',
        color: 'var(--gv-theme-font-color-dark, #262626)',
        borderLeft: '5px solid',
        borderColor: 'var(--gv-input--bdc, var(--gv-theme-neutral-color-dark, #d9d9d9))',
      },
    });
  }

  static get styles() {
    return [
      ...super.styles,
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

        .content {
          position: relative;
          border: var(--gv-input--bdw, 1px) var(--gv-input--bds, solid) var(--gv-input--bdc, var(--gv-theme-neutral-color-dark, #d9d9d9));
          box-sizing: border-box;
          border-radius: 4px;
        }

        .btn_copy {
        }

        .box-icon {
          bottom: -1px;
          right: -1px;
          z-index: 1;
        }

        .code .box-icon {
          border-radius: 3px;
        }

        .code .cm-content,
        .code .cm-gutters {
          height: var(--input-medium--h);
        }

        .large .code .cm-content,
        .large .code .cm-gutters {
          height: var(--input-large--h);
        }

        .small .code .cm-content,
        .small .code .cm-gutters {
          height: var(--input-small--h);
        }

        /**  Override Codemirror theme */
        .input .cm-gutters {
          display: none;
        }

        .input .cm-scroller {
          overflow: hidden;
        }

        .input .cm-activeLine,
        :host([readonly]) .cm-activeLine {
          background-color: transparent;
        }

        .input .cm-content {
          padding: 0;
        }

        :host([invalid]) .cm-gutters {
          border-color: var(--gv-theme-color-error, #da1a1b);
        }
      `,
    ];
  }
}

window.customElements.define('gv-code', GvCode);
