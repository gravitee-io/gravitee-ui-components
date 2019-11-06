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
import { css, LitElement } from 'lit-element';
import { GvIcons } from '../icons/gv-icons';
import { until } from 'lit-html/directives/until';
import { html } from 'lit-html';

/**
 * An icon
 *
 * @attr {String} shape - name of shape
 * @attr {Number} size - size in pixel use for width and height
 *
 * @cssprop {String} --gv-icon--c - set the color of icon
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
    return html`${until(GvIcons.getIcon(this.shape, this.size, this), '')}`;
  }

}

window.customElements.define('gv-icon', GvIcon);
