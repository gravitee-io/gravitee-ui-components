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
import { css, html, LitElement, TemplateResult } from 'lit-element';
import { GvIcons } from '../icons/gv-icons';
import { until } from 'lit-html/directives/until';
import { skeleton } from '../styles/skeleton';
import { getCssVar } from '../lib/style';

/**
 * An icon
 *
 * @cssprop {String} [--gv-icon--c=#262626] - set the color of icon
 * @cssprop {String} [--gv-icon--s=32] - set the height and width of icon (crushes size property)
 */
export class GvIcon extends LitElement {

  static get properties () {
    return {
      /**
       * This is a shape, an concatenation of category name and icon name.
       * @type {"{category}:{iconName}"}
       * @attr
       * @required
       */
      shape: { type: String },
    };
  }

  static get excludedShapes () {
    return ['thirdparty:google', 'thirdparty:graviteeio_am'];
  }

  static get styles () {
    return [
      skeleton,
      // language=CSS
      css`
          :host {
              box-sizing: border-box;
              display: inline-flex;
              vertical-align: middle;
          }
      `];
  }

  async _getIcon () {
    let icon = await GvIcons._getIcon(this.shape);
    if (icon) {
      if (!GvIcon.excludedShapes.includes(this.shape)) {
        const color = getCssVar(this, 'gv-icon--c', '#262626');
        if (color) {
          icon = icon.replace(/fill="[#a-zA-Z0-9]*"/g, `fill="${color}"`);
        }
      }
      const size = getCssVar(this, 'gv-icon--s', 32);
      if (size) {
        icon = icon.replace(/<svg/, `<svg width="${size}" height="${size}"`);
      }
    }
    return new TemplateResult([icon], [], 'html');
  }

  render () {
    return html`${until(this._getIcon(), '')}`;
  }

}

window.customElements.define('gv-icon', GvIcon);
