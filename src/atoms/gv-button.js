import { classMap } from 'lit-html/directives/class-map.js';
import { LitElement, html, css } from 'lit-element';
import { skeleton } from '../styles/skeleton.js';

/**
 * A button
 *
 * ## Details
 *
 * * attributes `primary` define the mode of the button and are exclusive.
 * * You can only set one mode at a time.
 * * When you don't use any of these values, the mode defaults to `default`.
 *
 * @fires click - Native click event from inner button element
 *
 * @slot - The content of the button (text or HTML)
 *
 * @attr {Boolean} primary - set button UI mode to primary
 * @attr {Boolean} disabled - same as native button element `disabled` attribute
 * @attr {Boolean} outlined - set button UI as outlined (white background instead of filled color)
 * @attr {Boolean} skeleton - enable skeleton screen UI pattern (loading hint)
 *
 * @cssprop {String} --btn-default - set the color of default button.
 * @cssprop {String} --btn-primary - set the color of primary button.
 */

export class GvButton extends LitElement {

  static get properties () {
    return {
      disabled: { type: Boolean },
      primary: { type: Boolean },
      outlined: { type: Boolean },
      skeleton: { type: Boolean },
    };
  }

  static get styles () {
    return [
      skeleton,
      // language=CSS
      css`        
          :host {
              box-sizing: border-box;
              display: inline-block;
              margin: 0.2rem;
              vertical-align: top;
          }

          /* RESET */
          button {
              background: #fff;
              border: 1px solid #000;
              display: block;
              font-size: 14px;
              font-family: inherit;
              margin: 0;
              padding: 0;
          }

          /* BASE */
          button {
              border-radius: 0.15rem;
              cursor: pointer;
              font-weight: bold;
              min-height: 2rem;
              padding: 0 0.5rem;
              text-transform: uppercase;
              -moz-user-select: none;
              -webkit-user-select: none;
              -ms-user-select: none;
              user-select: none;
              width: 100%;
          }

          /* COLORS */
          button.default {
              --btn-color: var(--btn-default, #009B5B);
          }

          button.primary {
              --btn-color: var(--btn-primary, #193E34);
          }

          /* MODES */
          button {
              background-color: var(--btn-color);
              border-color: var(--btn-color);
              color: #fff;
          }

          button.outlined {
              background-color: #fff;
              color: var(--btn-color);
          }

          /* special case: we want to keep simple buttons subtle */
          button.simple {
              border-color: #aaa;
          }

          /* STATES */
          button:enabled:focus {
              box-shadow: 0 0 0 .2em rgba(50, 115, 220, .25);
              outline: 0;
          }

          button:enabled:hover {
              box-shadow: 0 1px 3px #888;
          }

          button:enabled:active {
              box-shadow: none;
              outline: 0;
          }

          button:disabled {
              cursor: default;
              opacity: .5;
          }

          button.skeleton {
              background-color: #aaa;
              border-color: #777;
              color: transparent;
          }

          /* TRANSITIONS */
          button {
              box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
              transition: all 75ms ease-in-out;
          }

          /* We can do this because we set a visible focus state */
          button::-moz-focus-inner {
              border: 0;
          }
      `,
    ];
  }

  render () {

    const modes = {
      primary: this.primary,
      skeleton: this.skeleton,
      default: !this.primary,
      outlined: this.outlined,
    };

    return html`<button
      type="button"
      class=${classMap(modes)}
      .disabled=${this.disabled || this.skeleton}>
       <slot></slot>
       </button>`;
  }

}

window.customElements.define('gv-button', GvButton);
