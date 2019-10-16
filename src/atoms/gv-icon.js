import {css, LitElement} from "lit-element";
import {TemplateResult} from "lit-html";
import {GvIcons} from '../icons/gv-icons';

/**
 * An icon
 *
 * ## Details
 *
 * *  You can import all shapes or only shapes by category
 *
 * @example
 * import './shapes/all-shapes'
 * import './shapes/shopping-shapes'
 *
 * @attr {String} shape - name of shape like 
 * @attr {Number} size - size in pixel use for width and height
 */

export class GvIcon extends LitElement {

  static get properties() {
    return {
      shape: {type: String},
      size: {type: Number},
    };
  }

  static get styles() {
    return [
      //language=CSS
      css`
          :host {
              box-sizing: border-box;
              display: inline-block;
              margin: 0.2rem;
              vertical-align: top;
          }
      `]
  }

  constructor() {
    super();
    this.size = 24;
  }

  render() {
    const icon = GvIcons.getIcon(this.shape);

    return new TemplateResult([
        `<svg width="${this.size}" height="${this.size}" viewBox="0 0 48 48">`, icon, '</svg>'],
      [],
      'html');
  }

}

window.customElements.define('gv-icon', GvIcon);
