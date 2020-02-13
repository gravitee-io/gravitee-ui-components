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
import { skeleton } from '../styles/skeleton';
import { classMap } from 'lit-html/directives/class-map';
import '../atoms/gv-image';
import '../atoms/gv-button';
import '../molecules/gv-rating';
import { dispatchCustomEvent } from '../lib/events';
import { i18n } from '../lib/i18n';
import { ItemResource } from '../mixins/item-resource';

/**
 * Promote component
 *
 * @fires gv-promote:click - When click on button for view item
 *
 * @attr {Promise<any>} item - an item.
 *
 * @cssprop {Color} [--gv-promote-image--bgc=var(--gv-theme-color-light,#D5FDCB)] - Image background color
 * @cssprop {Color} [--gv-promote--bgc=var(--gv-theme-neutral-color-lightest, #FFFFFF)] - Background color
 * @cssprop {Length} [--gv-promote-image--h=300px] - Image height
 * @cssprop {Length} [--gv-promote-image--w=300px] - Image width
 * @cssprop {Length} [--gv-promote-button--p=19px 80px] - Button padding
 * @cssprop {Length} [--gv-promote-button--fz=var(--gv-theme-font-size-l, 16px)] - Button font size
 */
export class GvPromote extends ItemResource(LitElement) {

  static get styles () {
    return [
      // language=CSS
      css`
          :host {
              box-sizing: border-box;
              display: inline-block;
              margin: 0.2rem;
              vertical-align: middle;
              --gv-button--p: var(--gv-promote-button--p, 19px 80px);
              --gv-button--fz: var(--gv-promote-button--fz, var(--gv-theme-font-size-l, 16px));
              --gv-preview-button: 'none';
          }

          gv-image {
            height: var(--gv-promote-image--h, 300px);
            width: var(--gv-promote-image--w, 300px);
            --gv-image--of: contain;
          }

          .container {
              display: flex;
              min-height: 416px;
              max-height: 416px;
          }

          .container > div {
              min-width: 400px;
              max-width: 514px;
          }

          .image {
              background-color: var(--gv-promote-image--bgc, var(--gv-theme-color-light,#D5FDCB));
              min-height: 0;
              min-width: 0;
              display: flex;
              flex: 1;
              align-items: center;
              justify-content: center;
              border-radius: 4px 0 0 4px;
          }

          .title {
              text-transform: capitalize;
              min-height: 32px;
              display: flex;
              align-items: center;
          }

          .title h2 {
              font-size: var(--gv-theme-font-size-xl, 26px);
              flex: 1;
          }

          .title .version {
              font-size: var(--gv-theme-font-size-s, 12px);
              color: var(--gv-theme-neutral-color-dark, #D9D9D9);
          }

          .content {
              flex: 1;
              padding: 50px 70px;
              background-color: var(--gv-promote--bgc, var(--gv-theme-neutral-color-lightest, #FFFFFF));
              color: var(--gv-theme-font-color-dark,  #262626);
              font-size: var(--gv-theme-font-size-l, 16px);
              line-height: 24px;
              border-radius: 0 4px 4px 0;
              display: flex;
              flex-direction: column;
              max-width: 374px;
          }

          .description {
              margin: 24px 0px;
              flex-grow: 1;
          }

          .infos {
              display: flex;
              justify-content: flex-end;
              padding: 8px 0;
              margin: 8px 0;
          }

          .labels {
            text-align: right;
          }
      `,
      skeleton,
    ];
  }

  _onClick () {
    dispatchCustomEvent(this, 'click', { path: this.path });
  }

  render () {
    return html`<div class="container">
    <div class="${classMap({ skeleton: this._skeleton, image: true })}">${this._renderImage()}</div>
    <div class="content">
    ${this._error && !this._skeleton ? html`<p class="description">${i18n('gv-promote.error')}</p>` : html`
        ${this._empty && !this._skeleton ? html`<p class="description">${i18n('gv-promote.empty')}</p>` : html`
        <div class=${classMap({ skeleton: this._skeleton, title: true })}>
          <h2>${this._getTitle()}</h2>
          <span class="version">${this._getVersion()}</span>
        </div>
        <p class=${classMap({ skeleton: this._skeleton, description: true })}>${this._getDescription()}</p>
        <div class=${classMap({ skeleton: this._skeleton, infos: true })}>
            ${this._renderMetricsWithRating()}
        </div>
        <div class="labels">
          ${this._renderLabels()}
        </div>
        <gv-button ?skeleton=${this._skeleton} @click="${this._onClick}" .skeleton=${this._skeleton}>${i18n('gv-promote.view')}</gv-button>`}
    `}
    </div>
</div>`;
  }

}

window.customElements.define('gv-promote', GvPromote);
