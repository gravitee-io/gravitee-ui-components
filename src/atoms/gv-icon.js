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
import { directive } from 'lit-html';
import { classMap } from 'lit-html/directives/class-map';

/**
 * An icon
 *
 * ## Details
 * * has @theme facet
 *
 * @cssprop {Color} [--gv-icon--c=var(--gv-theme-font-color-dark, #262626)] - Color
 * @cssprop {Color} [--gv-icon-opacity--c=var(--gv-theme-font-color-dark, #262626)] - Opacity color
 * @cssprop {Length} [--gv-icon--s=32px] - Height and width
 */
export class GvIcon extends LitElement {
  static get properties() {
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

  static get excludedShapes() {
    return ['thirdparty:google', 'thirdparty:graviteeio_am'];
  }

  canCustomize() {
    return ![
      'thirdparty:google',
      'thirdparty:graviteeio_am',
      'thirdparty:http',
      'thirdparty:jdbc',
      'thirdparty:microsoft',
      'thirdparty:mongodb',
    ].includes(this.shape);
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          display: inline-flex;
          vertical-align: middle;
          --color: var(--gv-icon--c, var(--gv-theme-font-color-dark, #262626));
          --opacity: var(--gv-icon-opacity--c, var(--gv-theme-font-color-dark, #262626));
          --size: var(--gv-icon--s, 32px);
        }

        svg {
          height: var(--size);
          width: var(--size);
          fill: var(--color);
        }
      `,
    ];
  }

  static getHref(shape) {
    const [category, icon] = shape.split(':');
    return `./icons/${category}.svg#${icon}`;
  }

  render() {
    const namespaced = directive((namespace, value) => (part) => {
      part.committer.element.setAttributeNS(namespace, part.committer.name, value);
    });
    const xlinkNamespace = 'http://www.w3.org/1999/xlink';
    return html`<svg class="${classMap({ 'no-color': !this.canCustomize() })}">
      <use xlink:href="${namespaced(xlinkNamespace, GvIcon.getHref(this.shape))}" />
    </svg>`;
  }
}

window.customElements.define('gv-icon', GvIcon);
