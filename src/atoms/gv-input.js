import { classMap } from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';

import { LitElement, html, css } from 'lit-element';
import { skeleton } from '../styles/skeleton.js';

/**
 *
 * @fires click - Native click event from inner input element
 *
 * @attr {Boolean} disabled - same as native input element `disabled` attribute
 * @attr {Boolean} required - same as native input element `required` attribute
 * @attr {Boolean} skeleton - enable skeleton screen UI pattern (loading hint)
 * @attr {String} value - the value of the input
 * @attr {String} label - name of the label and id of the input
 * @attr {String} placeholder - an example value to display in the input when empty
 * @attr {String} type - type of the input. Can be text (Default), password or email.
 * @attr {Boolean} large - for a large input
 * @attr {Boolean} medium - for a medium input (Default)
 * @attr {Boolean} small - for a small input
 *
 */

export class GvInput extends LitElement {

  static get properties () {
    return {
      disabled: { type: Boolean },
      required: { type: Boolean },
      skeleton: { type: Boolean },
      value: { type: String },
      label: { type: String },
      placeholder: { type: String },
      type: { type: String },
      large: { type: Boolean },
      medium: { type: Boolean },
      small: { type: Boolean },
    };
  }

  static get styles () {
    return [
      skeleton,
      // language=CSS
      css`        
          /* BASE */
          input {
              border: 1px solid #D9D9D9;
              box-sizing: border-box;
              border-radius: 4px;
              font-style: normal;
              font-weight: normal;
          }

          /* SIZE */
          input.large {
            width: 256px;
            height: 40px;
            padding: 12px 8px;
            font-size: 16px;
            line-height: 24px;
          }

          input.medium {
            width: 256px;
            height: 32px;
            padding: 12px 5px;
            font-size: 14px;
            line-height: 22px;
          }

          input.small {
            width: 256px;
            height: 24px;
            font-size: 14px;
            line-height: 22px;
          }

          /* STATES */
          input:enabled:focus {
              box-shadow: 0 0 0 .2em rgba(50, 115, 220, .25);
              outline: 0;
          }

          input:enabled:hover {
              box-shadow: 0 1px 3px #888;
          }

          input:enabled:active {
              box-shadow: none;
              outline: 0;
          }

          input:disabled {
              cursor: default;
              opacity: .5;
          }

          input.skeleton {
              background-color: #aaa;
              border-color: #777;
          }
      `,
    ];
  }

  focus () {
    this.shadowRoot.querySelector('.input').focus();
  }

  _onInput (e) {
    this.value = e.target.value;
  }

  render () {

    const modes = {
      skeleton: this.skeleton,
      large: this.large,
      medium: (this.medium || (!this.large && !this.small)),
      small: this.small,
    };

    var inputType = 'text';
    var allowedTypes = ['text', 'password', 'email'];
    if (allowedTypes.includes(this.type)) {
      inputType = this.type;
    }

    var labelHTML;
    var inputId;
    if (this.label) {
      inputId = 'inputId';
      labelHTML = html`<label for=${inputId}>${this.label}${this.required ? '*' : ''}</label>`;
    }
    else {
      labelHTML = html``;
    }

    return html`
      ${labelHTML}
      <input
        .id=${ifDefined(inputId)}
        type=${inputType}
        .required=${this.required}
        .disabled=${this.disabled || this.skeleton}
        placeholder=${ifDefined(this.placeholder)}
        value=${ifDefined(this.value)}
        class=${classMap(modes)}
        @input=${this._onInput}
        >
    `;
  }

}

window.customElements.define('gv-input', GvInput);
