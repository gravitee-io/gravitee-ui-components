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

/**
 *
 * A wrapper of a <text> component.
 *
 * @attr {Boolean} disabled - same as native text element `disabled` attribute
 * @attr {Boolean} required - same as native text element `required` attribute
 * @attr {Boolean} skeleton - enable skeleton screen UI pattern (loading hint)
 * @attr {String} value - the value of the text
 * @attr {String} label - label of the text
 * @attr {String} title - title of the text
 * @attr {String} name - name of the text
 * @attr {String} placeholder - an example value to display in the text when empty
 * @attr {Number} rows - number of rows of the text element
 * @attr {Boolean} autofocus - true to put the focus on the input
 * @attr {Boolean} [readonly=false] - true if field is readonly mode
 *
 */

export class GvText extends LitElement {

  static get properties () {
    return {
      disabled: { type: Boolean },
      required: { type: Boolean },
      skeleton: { type: Boolean },
      value: { type: String },
      label: { type: String },
      title: { type: String },
      name: { type: String },
      placeholder: { type: String },
      rows: { type: Number },
      autofocus: { type: Boolean },
      minlength: { type: Number },
      maxlength: { type: Number },
      readonly: { type: Boolean },
    };
  }

  static get styles () {
    return [
      skeleton,
      // language=CSS
      css`

          :host {
            box-sizing: border-box;
            margin: 0.2rem;
            display: block;
          }
          div {
              position: relative;
              line-height: 0;
          }

          /* BASE */
          textarea {
              border: 1px solid #D9D9D9;
              box-sizing: border-box;
              border-radius: 4px;
              outline: none;
              padding: 10px 5px;
              width: 100%;
              resize: none;
              font-size: 14px;
              line-height: 17px;
          }

          textarea:disabled {
              cursor: default;
              opacity: .5;
          }

          textarea:required {
            box-shadow: none;
          }

          label {
              display: block;
              line-height: 15px;
              padding: 0.2rem 0.4rem;
          }

          label.required {
              padding-left: 0.6rem;
          }

          label abbr {
              position: absolute;
              left: 0;
              color: red;
              font-variant: none;
              text-decoration: none;
          }
      `,
    ];
  }

  constructor () {
    super();
    this._id = 'gv-id';
    this.rows = 10;
  }

  firstUpdated (changedProperties) {
    if (this.autofocus) {
      this.shadowRoot.querySelector('textarea').focus();
    }
  }

  _renderRequired () {
    if (this.required && !this.readonly) {
      return html`<abbr title="(required)" aria-hidden="true">*</abbr>`;
    }
    return '';
  }

  _renderLabel () {
    if (this.label) {
      return html`<label for=${this.id} class="${classMap({ required: this.required && !this.readonly })}" title="${this.label}">
        ${this._renderRequired()}${this.label}
        </label>
        `;
    }
    return '';
  }

  _onInput (e) {
    this.value = e.target.value;
    dispatchCustomEvent(this, 'input', this.value);
  }

  render () {
    const classes = {
      skeleton: this.skeleton,
    };

    return html`
      <div>
        ${this._renderLabel()}
        <textarea class="${classMap(classes)}"
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
            rows="${this.rows}"
            @input=${this._onInput}></textarea>
      </div>
    `;
  }
}

window.customElements.define('gv-text', GvText);
