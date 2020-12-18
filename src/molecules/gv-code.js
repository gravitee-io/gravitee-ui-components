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

/**
 * Code component
 *
 * ## Details
 * * has @theme facet
 *
 * @fires gv-code:input - input events with the `value` on `detail`
 * @fires gv-code:ready - event dispatch when component is ready
 *
 * @attr {String} label - code language
 * @attr {String} value - code content to be highlighted
 * @attr {options} Object - options based on codemirror https://codemirror.net/doc/manual.html#config
 *
 * @attr {Boolean} [clipboard=false]- true if field has clipboard button
 * @attr {Boolean} [autofocus=false] - true to put the focus on the input
 * @attr {Boolean} [readonly=false] - true if field is readonly mode
 */
export class GvCode extends InputElement(LitElement) {

  static get properties () {
    return {
      ...super.properties,
      options: { type: Object },
      _clipboardIcon: { type: String },
      _codeMirror: { type: Object },
      rows: { type: Number },
    };
  }

  constructor () {
    super();
    this._id = `gv-code-${uuid()}`;
    this.value = '';
    this.readonly = false;
    this.autofocus = false;
    this.clipboard = false;
    this._clipboardIcon = shapeClipboard;
  }

  render () {
    return html`
      <div class="${classMap({ box: true, 'box-invisible': this.skeleton, input: this.singleLine })}">
        ${this.label ? html`<label for="code">${this.label}</label>` : ''}
        ${this.clipboard ? html`<gv-button title="${i18n('gv-code.copy')}" ?outlined="${!this._copied}" ?primary="${this._copied}" small icon="${this._clipboardIcon}"></gv-button>` : ''}
        <textarea id="${this._id}" name="code">${this.value}</textarea>
        ${this.skeleton ? html`<div class="skeleton"></div>` : ''}
      </div>
    `;
  }

  _onChange (cm) {
    this.value = cm.getValue();
    dispatchCustomEvent(this, 'input', this.value);
  }

  get singleLine () {
    return this.rows === 1;
  }

  connectedCallback () {
    super.connectedCallback();
    CodeMirror.defineInitHook((cm) => {

      cm.on('beforeChange', (cm, event) => {
        if (this.singleLine && this._id === cm.getTextArea().id) {

          // Identify typing events that add a newline to the buffer.
          const hasTypedNewline = (
            event.origin === '+input'
            && typeof event.text === 'object'
            && event.text.join('') === '');

          // Prevent newline characters from being added to the buffer.
          if (hasTypedNewline) {
            return event.cancel();
          }

          // Identify paste events.
          const hasPastedNewline = (
            event.origin === 'paste'
            && typeof event.text === 'object'
            && event.text.length > 1);

          // Format pasted text to replace newlines with spaces.
          if (hasPastedNewline) {
            const newText = event.text.join(' ');
            return event.update(null, null, [newText]);
          }

        }
        return null;
      });

      cm.on('change', () => {
        if (this._id === cm.getTextArea().id) {
          this._onChange(cm);
        }
      });
    });
  }

  _getProcessedOptions () {
    const options = { ...this.options };
    if (options.mode === 'json') {
      options.mode = 'javascript';
    }
    return options;
  }

  async updated (changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('label') && this.label) {
      this.screenReaderLabel = this.label;
    }
    else if (changedProperties.has('value')) {
      this.resize();
    }
  }

  getCM () {
    return this._codeMirror;
  }

  async firstUpdated () {
    if (this.clipboard) {
      import('clipboard-copy').then((mod) => {
        const copy = mod.default;
        this.shadowRoot.querySelector('gv-button').addEventListener('gv-button:click', () => {
          copy(this.value);
          this._copied = true;
          this._clipboardIcon = shapeCopied;
          setTimeout(() => {
            this._copied = false;
            this._clipboardIcon = shapeClipboard;
          }, 1000);
        });
      });
    }
    const options = this._getProcessedOptions();

    try {
      await import(`codemirror/mode/${options.mode}/${options.mode}`);
    }
    catch (er) {

    }

    const textArea = this.shadowRoot.querySelector(`#${this._id}`);
    this._codeMirror = CodeMirror.fromTextArea(textArea, {
      ...options,
      ...{
        theme: 'mdn-like',
        lineWrapping: true,
        readOnly: this.readonly,
        autofocus: this.autofocus,
      },
    });

    dispatchCustomEvent(this, 'ready');
  }

  resize () {
    if (this._codeMirror) {
      const options = this._getProcessedOptions();
      if (this.value == null && options.placeholder) {
        const placeholderByLines = options.placeholder.split('\n');
        this._codeMirror.setSize(null, placeholderByLines.length * 18);
      }
      else {
        this._codeMirror.setSize(null, null);
      }
    }
  }

  static get styles () {
    return [
      skeleton,
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
          bottom: 0;
          z-index: 10;
        }

        /* CodeMirror CSS */

        .CodeMirror {
          /* Set height, width, borders, and global font properties here */
          font-family: monospace;
          min-height: 34px;
          height: auto;
          max-height: 500px;
          color: black;
          direction: ltr;
        }

        .small .CodeMirror {
          min-height: 18px;
        }

        .large .CodeMirror {
          min-height: 37px;
        }

        /* PADDING */

        .CodeMirror-lines {
          padding: 4px 0; /* Vertical padding around content */
        }

        .CodeMirror pre.CodeMirror-line,
        .CodeMirror pre.CodeMirror-line-like {
          padding: 0 4px; /* Horizontal padding of content */
        }

        .CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {
          background-color: white; /* The little square between H and V scrollbars */
        }

        /* GUTTER */

        .CodeMirror-gutters {
          border-right: 1px solid #ddd;
          background-color: #f7f7f7;
          white-space: nowrap;
        }

        .CodeMirror-linenumbers {
        }

        .CodeMirror-linenumber {
          padding: 0 3px 0 5px;
          min-width: 20px;
          text-align: right;
          color: #999;
          white-space: nowrap;
        }

        .CodeMirror-guttermarker {
          color: black;
        }

        .CodeMirror-guttermarker-subtle {
          color: #999;
        }

        /* CURSOR */

        .CodeMirror-cursor {
          border-left: 1px solid black;
          border-right: none;
          width: 0;
        }

        /* Shown when moving in bi-directional text */
        .CodeMirror div.CodeMirror-secondarycursor {
          border-left: 1px solid silver;
        }

        .cm-fat-cursor .CodeMirror-cursor {
          width: auto;
          border: 0 !important;
          background: #7e7;
        }

        .cm-fat-cursor div.CodeMirror-cursors {
          z-index: 1;
        }

        .cm-fat-cursor-mark {
          background-color: rgba(20, 255, 20, 0.5);
          -webkit-animation: blink 1.06s steps(1) infinite;
          -moz-animation: blink 1.06s steps(1) infinite;
          animation: blink 1.06s steps(1) infinite;
        }

        .cm-animate-fat-cursor {
          width: auto;
          border: 0;
          -webkit-animation: blink 1.06s steps(1) infinite;
          -moz-animation: blink 1.06s steps(1) infinite;
          animation: blink 1.06s steps(1) infinite;
          background-color: #7e7;
        }

        @-moz-keyframes blink {
          0% {
          }
          50% {
            background-color: transparent;
          }
          100% {
          }
        }

        @-webkit-keyframes blink {
          0% {
          }
          50% {
            background-color: transparent;
          }
          100% {
          }
        }

        @keyframes blink {
          0% {
          }
          50% {
            background-color: transparent;
          }
          100% {
          }
        }

        /* Can style cursor different in overwrite (non-insert) mode */
        .CodeMirror-overwrite .CodeMirror-cursor {
        }

        .cm-tab {
          display: inline-block;
          text-decoration: inherit;
        }

        .CodeMirror-rulers {
          position: absolute;
          left: 0;
          right: 0;
          top: -50px;
          bottom: 0;
          overflow: hidden;
        }

        .CodeMirror-ruler {
          border-left: 1px solid #ccc;
          top: 0;
          bottom: 0;
          position: absolute;
        }

        /* DEFAULT THEME */

        .cm-s-default .cm-header {
          color: blue;
        }

        .cm-s-default .cm-quote {
          color: #090;
        }

        .cm-negative {
          color: #d44;
        }

        .cm-positive {
          color: #292;
        }

        .cm-header, .cm-strong {
          font-weight: bold;
        }

        .cm-em {
          font-style: italic;
        }

        .cm-link {
          text-decoration: underline;
        }

        .cm-strikethrough {
          text-decoration: line-through;
        }

        .cm-s-default .cm-keyword {
          color: #708;
        }

        .cm-s-default .cm-atom {
          color: #219;
        }

        .cm-s-default .cm-number {
          color: #164;
        }

        .cm-s-default .cm-def {
          color: #00f;
        }

        .cm-s-default .cm-variable,
        .cm-s-default .cm-punctuation,
        .cm-s-default .cm-property,
        .cm-s-default .cm-operator {
        }

        .cm-s-default .cm-variable-2 {
          color: #05a;
        }

        .cm-s-default .cm-variable-3, .cm-s-default .cm-type {
          color: #085;
        }

        .cm-s-default .cm-comment {
          color: #a50;
        }

        .cm-s-default .cm-string {
          color: #a11;
        }

        .cm-s-default .cm-string-2 {
          color: #f50;
        }

        .cm-s-default .cm-meta {
          color: #555;
        }

        .cm-s-default .cm-qualifier {
          color: #555;
        }

        .cm-s-default .cm-builtin {
          color: #30a;
        }

        .cm-s-default .cm-bracket {
          color: #997;
        }

        .cm-s-default .cm-tag {
          color: #170;
        }

        .cm-s-default .cm-attribute {
          color: #00c;
        }

        .cm-s-default .cm-hr {
          color: #999;
        }

        .cm-s-default .cm-link {
          color: #00c;
        }

        .cm-s-default .cm-error {
          color: #f00;
        }

        .cm-invalidchar {
          color: #f00;
        }

        .CodeMirror-composing {
          border-bottom: 2px solid;
        }

        /* Default styles for common addons */

        div.CodeMirror span.CodeMirror-matchingbracket {
          color: #0b0;
        }

        div.CodeMirror span.CodeMirror-nonmatchingbracket {
          color: #a22;
        }

        .CodeMirror-matchingtag {
          background: rgba(255, 150, 0, .3);
        }

        .CodeMirror-activeline-background {
          background: #e8f2ff;
        }

        /* STOP */

        /* The rest of this file contains styles related to the mechanics of
           the editor. You probably shouldn't touch them. */

        .CodeMirror {
          position: relative;
          overflow: hidden;
          background: white;
        }

        .CodeMirror-scroll {
          overflow: scroll !important; /* Things will break if this is overridden */
          /* 50px is the magic margin used to hide the element's real scrollbars */
          /* See overflow: hidden in .CodeMirror */
          margin-bottom: -50px;
          margin-right: -50px;
          padding-bottom: 50px;
          height: 100%;
          outline: none; /* Prevent dragging from highlighting the element */
          position: relative;
        }

        .CodeMirror-sizer {
          position: relative;
          border-right: 50px solid transparent;
        }

        .input .CodeMirror-sizer {
          margin-top: 7px;
        }

        /* The fake, visible scrollbars. Used to force redraw during scrolling
           before actual scrolling happens, thus preventing shaking and
           flickering artifacts. */
        .CodeMirror-vscrollbar, .CodeMirror-hscrollbar, .CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {
          position: absolute;
          z-index: 6;
          display: none;
        }

        .CodeMirror-vscrollbar {
          right: 0;
          top: 0;
          overflow-x: hidden;
          overflow-y: scroll;
        }

        .CodeMirror-hscrollbar {
          bottom: 0;
          left: 0;
          overflow-y: hidden;
          overflow-x: scroll;
        }

        .CodeMirror-scrollbar-filler {
          right: 0;
          bottom: 0;
        }

        .CodeMirror-gutter-filler {
          left: 0;
          bottom: 0;
        }

        .CodeMirror-gutters {
          position: absolute;
          left: 0;
          top: 0;
          min-height: 100%;
          z-index: 3;
        }

        .CodeMirror-gutter {
          white-space: normal;
          height: 100%;
          display: inline-block;
          vertical-align: top;
          margin-bottom: -50px;
        }

        .CodeMirror-gutter-wrapper {
          position: absolute;
          z-index: 4;
          background: none !important;
          border: none !important;
        }

        .CodeMirror-gutter-background {
          position: absolute;
          top: 0;
          bottom: 0;
          z-index: 4;
        }

        .CodeMirror-gutter-elt {
          position: absolute;
          cursor: default;
          z-index: 4;
        }

        .CodeMirror-gutter-wrapper ::selection {
          background-color: transparent
        }

        .CodeMirror-gutter-wrapper ::-moz-selection {
          background-color: transparent
        }

        .CodeMirror-lines {
          cursor: text;
          min-height: 1px; /* prevents collapsing before first draw */
        }

        .CodeMirror pre.CodeMirror-line,
        .CodeMirror pre.CodeMirror-line-like {
          /* Reset some styles that the rest of the page might have set */
          -moz-border-radius: 0;
          -webkit-border-radius: 0;
          border-radius: 0;
          border-width: 0;
          background: transparent;
          font-family: inherit;
          font-size: inherit;
          margin: 0;
          white-space: pre;
          word-wrap: normal;
          line-height: inherit;
          color: inherit;
          z-index: 2;
          position: relative;
          overflow: visible;
          -webkit-tap-highlight-color: transparent;
          -webkit-font-variant-ligatures: contextual;
          font-variant-ligatures: contextual;
        }

        .CodeMirror-wrap pre.CodeMirror-line,
        .CodeMirror-wrap pre.CodeMirror-line-like {
          word-wrap: break-word;
          white-space: pre-wrap;
          word-break: normal;
        }

        .CodeMirror-linebackground {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          z-index: 0;
        }

        .CodeMirror-linewidget {
          position: relative;
          z-index: 2;
          padding: 0.1px; /* Force widget margins to stay inside of the container */
        }

        .CodeMirror-widget {
        }

        .CodeMirror-rtl pre {
          direction: rtl;
        }

        .CodeMirror-code {
          outline: none;
        }

        /* Force content-box sizing for the elements where we expect it */
        .CodeMirror-scroll,
        .CodeMirror-sizer,
        .CodeMirror-gutter,
        .CodeMirror-gutters,
        .CodeMirror-linenumber {
          -moz-box-sizing: content-box;
          box-sizing: content-box;
        }

        .CodeMirror-measure {
          position: absolute;
          width: 100%;
          height: 0;
          overflow: hidden;
          visibility: hidden;
        }

        .CodeMirror-cursor {
          position: absolute;
          pointer-events: none;
        }

        .CodeMirror-measure pre {
          position: static;
        }

        div.CodeMirror-cursors {
          visibility: hidden;
          position: relative;
          z-index: 3;
        }

        div.CodeMirror-dragcursors {
          visibility: visible;
        }

        .CodeMirror-focused div.CodeMirror-cursors {
          visibility: visible;
        }

        .CodeMirror-selected {
          background: #d9d9d9;
        }

        .CodeMirror-focused .CodeMirror-selected {
          background: #d7d4f0;
        }

        .CodeMirror-crosshair {
          cursor: crosshair;
        }

        .CodeMirror-line::selection, .CodeMirror-line > span::selection, .CodeMirror-line > span > span::selection {
          background: #d7d4f0;
        }

        .CodeMirror-line::-moz-selection, .CodeMirror-line > span::-moz-selection, .CodeMirror-line > span > span::-moz-selection {
          background: #d7d4f0;
        }

        .cm-searching {
          background-color: #ffa;
          background-color: rgba(255, 255, 0, .4);
        }

        /* Used to force a border model for a node */
        .cm-force-border {
          padding-right: .1px;
        }

        @media print {
          /* Hide the cursor when printing */
          .CodeMirror div.CodeMirror-cursors {
            visibility: hidden;
          }
        }

        /* See issue #2901 */
        .cm-tab-wrap-hack:after {
          content: '';
        }

        /* Help users use markselection to safely style text background */
        span.CodeMirror-selectedtext {
          background: none;
        }

        /** THEME mdn-like **/
        .cm-s-mdn-like.CodeMirror {
          color: #999;
          background-color: #fff;
        }

        .cm-s-mdn-like div.CodeMirror-selected {
          background: #cfc;
        }

        .cm-s-mdn-like .CodeMirror-line::selection, .cm-s-mdn-like .CodeMirror-line > span::selection, .cm-s-mdn-like .CodeMirror-line > span > span::selection {
          background: #cfc;
        }

        .cm-s-mdn-like .CodeMirror-line::-moz-selection, .cm-s-mdn-like .CodeMirror-line > span::-moz-selection, .cm-s-mdn-like .CodeMirror-line > span > span::-moz-selection {
          background: #cfc;
        }

        :host([invalid]) .cm-s-mdn-like .CodeMirror-gutters {
          border-color: var(--gv-theme-color-error-dark, #d32f2f);
        }

        .cm-s-mdn-like .CodeMirror-gutters {
          background: #f8f8f8;
          border-left: 6px solid var(--gv-theme-color, #5A7684);
          color: #333;
        }

        .cm-s-mdn-like .CodeMirror-linenumber {
          color: #aaa;
          padding-left: 8px;
        }

        .cm-s-mdn-like .CodeMirror-cursor {
          border-left: 2px solid #222;
        }

        .cm-s-mdn-like .cm-keyword {
          color: #6262FF;
        }

        .cm-s-mdn-like .cm-atom {
          color: #F90;
        }

        .cm-s-mdn-like .cm-number {
          color: #ca7841;
        }

        .cm-s-mdn-like .cm-def {
          color: #8DA6CE;
        }

        .cm-s-mdn-like span.cm-variable-2, .cm-s-mdn-like span.cm-tag {
          color: #690;
        }

        .cm-s-mdn-like span.cm-variable-3, .cm-s-mdn-like span.cm-def, .cm-s-mdn-like span.cm-type {
          color: #07a;
        }

        .cm-s-mdn-like .cm-variable {
          color: #07a;
        }

        .cm-s-mdn-like .cm-property {
          color: #905;
        }

        .cm-s-mdn-like .cm-qualifier {
          color: #690;
        }

        .cm-s-mdn-like .cm-operator {
          color: #cda869;
        }

        .cm-s-mdn-like .cm-comment {
          color: #777;
          font-weight: normal;
        }

        .cm-s-mdn-like .cm-string {
          color: #07a;
          font-style: italic;
        }

        .cm-s-mdn-like .cm-string-2 {
          color: #bd6b18;
        }

        /*?*/
        .cm-s-mdn-like .cm-meta {
          color: #000;
        }

        /*?*/
        .cm-s-mdn-like .cm-builtin {
          color: #9B7536;
        }

        /*?*/
        .cm-s-mdn-like .cm-tag {
          color: #997643;
        }

        .cm-s-mdn-like .cm-attribute {
          color: #d6bb6d;
        }

        /*?*/
        .cm-s-mdn-like .cm-header {
          color: #FF6400;
        }

        .cm-s-mdn-like .cm-hr {
          color: #AEAEAE;
        }

        .cm-s-mdn-like .cm-link {
          color: #ad9361;
          font-style: italic;
          text-decoration: none;
        }

        .cm-s-mdn-like .cm-error {
          border-bottom: 1px solid red;
        }

        div.cm-s-mdn-like .CodeMirror-activeline-background {
          background: #efefff;
        }

        div.cm-s-mdn-like span.CodeMirror-matchingbracket {
          outline: 1px solid grey;
          color: inherit;
        }

        /* Lint.css */
        /* The lint marker gutter */
        .CodeMirror-lint-markers {
          width: 16px;
        }

        .CodeMirror-lint-tooltip {
          background-color: #ffd;
          border: 1px solid black;
          border-radius: 4px 4px 4px 4px;
          color: black;
          font-family: monospace;
          font-size: 10pt;
          overflow: hidden;
          padding: 2px 5px;
          position: fixed;
          white-space: pre;
          white-space: pre-wrap;
          z-index: 100;
          max-width: 600px;
          opacity: 0;
          transition: opacity .4s;
          -moz-transition: opacity .4s;
          -webkit-transition: opacity .4s;
          -o-transition: opacity .4s;
          -ms-transition: opacity .4s;
        }

        .CodeMirror-lint-mark-error, .CodeMirror-lint-mark-warning {
          background-position: left bottom;
          background-repeat: repeat-x;
        }

        .CodeMirror-lint-mark-error {
          background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sJDw4cOCW1/KIAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAHElEQVQI12NggIL/DAz/GdA5/xkY/qPKMDAwAADLZwf5rvm+LQAAAABJRU5ErkJggg==")
        }

        .CodeMirror-lint-mark-warning {
          background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sJFhQXEbhTg7YAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAMklEQVQI12NkgIIvJ3QXMjAwdDN+OaEbysDA4MPAwNDNwMCwiOHLCd1zX07o6kBVGQEAKBANtobskNMAAAAASUVORK5CYII=");
        }

        .CodeMirror-lint-marker-error, .CodeMirror-lint-marker-warning {
          background-position: center center;
          background-repeat: no-repeat;
          cursor: pointer;
          display: inline-block;
          height: 16px;
          width: 16px;
          vertical-align: middle;
          position: relative;
        }

        .CodeMirror-lint-message-error, .CodeMirror-lint-message-warning {
          padding-left: 18px;
          background-position: top left;
          background-repeat: no-repeat;
        }

        .CodeMirror-lint-marker-error, .CodeMirror-lint-message-error {
          background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAHlBMVEW7AAC7AACxAAC7AAC7AAAAAAC4AAC5AAD///+7AAAUdclpAAAABnRSTlMXnORSiwCK0ZKSAAAATUlEQVR42mWPOQ7AQAgDuQLx/z8csYRmPRIFIwRGnosRrpamvkKi0FTIiMASR3hhKW+hAN6/tIWhu9PDWiTGNEkTtIOucA5Oyr9ckPgAWm0GPBog6v4AAAAASUVORK5CYII=");
        }

        .CodeMirror-lint-marker-warning, .CodeMirror-lint-message-warning {
          background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAANlBMVEX/uwDvrwD/uwD/uwD/uwD/uwD/uwD/uwD/uwD6twD/uwAAAADurwD2tQD7uAD+ugAAAAD/uwDhmeTRAAAADHRSTlMJ8mN1EYcbmiixgACm7WbuAAAAVklEQVR42n3PUQqAIBBFUU1LLc3u/jdbOJoW1P08DA9Gba8+YWJ6gNJoNYIBzAA2chBth5kLmG9YUoG0NHAUwFXwO9LuBQL1giCQb8gC9Oro2vp5rncCIY8L8uEx5ZkAAAAASUVORK5CYII=");
        }

        .CodeMirror-lint-marker-multiple {
          background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAMAAADzjKfhAAAACVBMVEUAAAAAAAC/v7914kyHAAAAAXRSTlMAQObYZgAAACNJREFUeNo1ioEJAAAIwmz/H90iFFSGJgFMe3gaLZ0od+9/AQZ0ADosbYraAAAAAElFTkSuQmCC");
          background-repeat: no-repeat;
          background-position: right bottom;
          width: 100%;
          height: 100%;
        }

      `,
    ];
  }

}

window.customElements.define('gv-code', GvCode);
