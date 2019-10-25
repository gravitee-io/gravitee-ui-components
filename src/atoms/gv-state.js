import { classMap } from 'lit-html/directives/class-map.js';
import { LitElement, html, css } from 'lit-element';
import { skeleton } from '../styles';

/**
 * A State
 *
 * @fires click - Native click event
 *
 * @slot - The content of the state (text or HTML)
 *
 * @attr {Boolean} running - enable running mode
 * @attr {Boolean} skeleton -  enable skeleton screen UI pattern (loading hint)
 *
 * @cssprop {String} --gv-state--bdr - set the border radius.
 * @cssprop {String} --gv-state([-running]?)--bgc - set the background color.
 * @cssprop {String} --gv-state([-running]?)--c - set the color.
 */
export class GvState extends LitElement {

  static get properties () {
    return {
      running: { type: Boolean },
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
              vertical-align: middle;
          }

          div.default {
              --bgc: var(--gv-tag--bgc, #F0F5FF);
              --c: var(--gv-tag--c, #597EF7)
          }

          div.running {
              --bgc: var(--gv-state-running--bgc, #D5FDCB);
              --c: var(--gv-state-running--c, #009B5B);
          }

          div {
              background-color: var(--bgc);
              border-radius: var(--gv-state--bdr, 17px);
              color: var(--c);

              font-size: 10px;
              font-weight: bold;
              text-transform: uppercase;
              line-height: 20px;
              padding: 0 8px;
          }
      `,
    ];
  }

  render () {

    const modes = {
      default: !this.running,
      running: this.running,
      skeleton: this.skeleton,
    };

    return html`
      <div class=${classMap(modes)}>
        <slot></slot>
      </div>
    `;
  }

}

window.customElements.define('gv-state', GvState);
