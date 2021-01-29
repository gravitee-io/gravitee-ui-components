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
import { classMap } from 'lit-html/directives/class-map';
import { ifDefined } from 'lit-html/directives/if-defined';
import { LitElement, css, html } from 'lit-element';
import { skeleton } from '../styles/skeleton';
import { dispatchCustomEvent } from '../lib/events';
import { InputElement } from '../mixins/input-element';

/**
 * A wrapper of a <text> component.
 *
 * ## Details
 * * has @theme facet
 *
 * @fires gv-text:input - mirrors native textarea events with the `value` on `detail`
 *
 * @attr {Boolean} disabled - same as native text element `disabled` attribute
 * @attr {Boolean} required - same as native text element `required` attribute
 * @attr {Boolean} skeleton - enable skeleton screen UI pattern (loading hint)
 * @attr {String} value - the value of the text
 * @attr {String} label - label of the text
 * @attr {String} title - title of the text
 * @attr {String} name - name of the text
 * @attr {String} placeholder - an example value to display in the text when empty
 * @attr {Length} rows - number of rows of the text element
 * @attr {Boolean} autofocus - true to put the focus on the input
 * @attr {Boolean} [readonly=false] - true if field is readonly mode
 * @attr {Boolean} [autosize=false] - true if field auto resize when content change
 *
 * @cssprop {Color} [--gv-input--bdc=var(--gv-theme-neutral-color-dark, #d9d9d9)] - Border color
 * @cssprop {Length} [--gv-text--fz=var(--gv-theme-font-size-m, 14px)] - Font size
 * @cssprop {Length} [--gv-text--lh=var(--gv-theme-font-size-m, 14px)] - Line height
 */
export class GvText extends InputElement(LitElement) {
  static get properties() {
    return {
      rows: { type: Number },
      minlength: { type: Number },
      maxlength: { type: Number },
      autosize: { type: Boolean },
    };
  }

  static get styles() {
    return [
      ...super.styles,
      skeleton,
      // language=CSS
      css`
        .box {
          position: relative;
          line-height: 0;
        }

        /* BASE */
        .textarea {
          --fz: var(--gv-text--fz, var(--gv-theme-font-size-m, 14px));
          --tmp: var(--gv-text--lh, var(--gv-theme-font-size-m, 14px));
          --lh: calc(var(--tmp) + 3px);
          border: 1px solid var(--gv-input--bdc, var(--gv-theme-neutral-color-dark, #d9d9d9));
          box-sizing: border-box;
          border-radius: 4px;
          outline: none;
          padding: 10px 5px;
          width: 100%;
          resize: none;
          font-size: var(--fz);
          line-height: var(--lh);
        }

        div.textarea {
          white-space: pre;
        }

        textarea:disabled {
          cursor: default;
          opacity: 0.5;
        }

        textarea:required {
          box-shadow: none;
        }

        label {
          display: block;
          line-height: 15px;
          padding: 0 0 0.2rem 0;
        }

        /* Hack for FF */
        textarea {
          font-family: inherit;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.rows = 10;
  }

  getInputElement() {
    return this.shadowRoot.querySelector('textarea');
  }

  _onInput(e) {
    this.updateState(e.target.value);
    this.value = e.target.value;
    dispatchCustomEvent(this, 'input', this.value);
  }

  render() {
    const classes = {
      skeleton: this.skeleton,
      required: this.required,
      textarea: true,
    };

    if (this.readonly) {
      if (this.value || this.value.trim() !== '') {
        return html`
          ${this.renderLabel()}
          <div class="${classMap(classes)}" .title=${ifDefined(this.title || this.label)}>${ifDefined(this.value)}</div>
        `;
      }
      return '';
    }
    const rows = this.autosize ? this.value.split('\n').length : this.rows;
    return html`
      <div class="box">
        ${this.renderLabel()}
        <textarea
          class="${classMap(classes)}"
          id=${this._id}
          .name=${ifDefined(this.name)}
          .title=${ifDefined(this.title || this.label)}
          .required=${this.required}
          ?readonly="${this.readonly}"
          maxlength="${this.maxlength}"
          minlength="${this.minlength}"
          aria-required=${!!this.required}
          ?disabled=${this.disabled || this.skeleton}
          .placeholder=${ifDefined(this.placeholder)}
          .value=${ifDefined(this.value)}
          rows="${this.rows < rows ? rows : this.rows}"
          @input=${this._onInput}
        ></textarea>
      </div>
    `;
  }
}

window.customElements.define('gv-text', GvText);
