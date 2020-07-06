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
import { until } from 'lit-html/directives/until';
import { skeleton } from '../styles/skeleton';

/**
 * An icon
 *
 * ## Details
 * * has @theme facet
 *
 * @cssprop {Color} [--gv-icon--c=var(--gv-theme-font-color-dark,  #262626)] - Color
 * @cssprop {Length} [--gv-icon--s=32px] - Height and width
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
          --color: var(--gv-icon--c, var(--gv-theme-font-color-dark,  #262626));
          --size: var(--gv-icon--s, 32px);
        }

        svg {
          height: var(--size);
          width: var(--size);
        }

        svg:not(.no-color) * {
          fill: var(--color);
        }

      `];
  }

  static async _getIcon (name) {
    const [shape, icon] = name.split(':');
    if (window.GvIcons == null) {
      window.GvIcons = {};
    }
    if (shape && window.GvIcons[shape] == null) {
      await import(`../icons/shapes/${shape}.js`);
    }
    if (shape && window.GvIcons[shape]) {
      return new TemplateResult([window.GvIcons[shape][icon]], [], 'html');
    }
    else {
      console.error(`Cannot find shape "${shape}". Show Gravitee.io Components documentation.`);
    }
    return '?';
  }

  render () {
    return html`${until(GvIcon._getIcon(this.shape), '')}`;
  }

}

window.customElements.define('gv-icon', GvIcon);
