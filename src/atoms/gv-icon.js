import { css, LitElement } from 'lit-element';
import { GvIcons } from '../icons/gv-icons';

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
 * @cssprop {String} --gv-icon - set the color of icon
 */

export class GvIcon extends LitElement {

  static get properties () {
    return {
      shape: { type: String },
      size: { type: Number },
    };
  }

  static get styles () {
    return [
      // language=CSS
      css`
          :host {
              box-sizing: border-box;
              display: inline-flex;
              vertical-align: middle;
          }
      `];
  }

  constructor () {
    super();
    this.size = 24;
  }

  render () {
    return GvIcons.getIcon(this.shape, this.size, this);
  }

}

window.customElements.define('gv-icon', GvIcon);
