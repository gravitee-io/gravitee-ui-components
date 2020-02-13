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
import '../atoms/gv-button';
import { repeat } from 'lit-html/directives/repeat';
import { classMap } from 'lit-html/directives/class-map';
import { dispatchCustomEvent } from '../lib/events';
import { ifDefined } from 'lit-html/directives/if-defined';

/**
 * Option component
 *
 * @attr {Array} options - An array of {title, icon, id, active}.
 *
 * @cssprop {Color} [--gv-option--bgc=var(--gv-theme-neutral-color-dark, #BFBFBF)] - Background color
 * @cssprop {Length} [--gv-option--bdrs=0.15rem] - Border radius
 * @cssprop {Length} [--gv-option-button--p=5px] - Button padding
 */
export class GvOption extends LitElement {

  static get properties () {
    return { data: { type: Array } };
  }

  static get styles () {
    return [
      // language=CSS
      css`
          :host {
              box-sizing: border-box;
              display: inline-block;
              --gv-button--p: var(--gv-option-button--p, 5px);
              margin: 0.2rem;
             --bdrs: var(--gv-option--bdrs, 0.15rem);
          }

          gv-button {
              margin: 0;
              --gv-button--bgc: var(--gv-option--bgc, var(--gv-theme-neutral-color-dark, #BFBFBF));
              --gv-button--bdrs: 0;
          }

          gv-button.entry {
              --gv-button--bdrs: var(--bdrs) 0 0 var(--bdrs);
          }

          gv-button.exit {
              --gv-button--bdrs: 0 var(--bdrs) var(--bdrs) 0;
          }
      `,
    ];
  }

  _onClick (e) {
    const selectedId = e.target.dataset.id;
    this.options = this.options.map((option) => {
      option.active = option.id === selectedId;
      return option;
    });
    dispatchCustomEvent(this, 'select', { id: selectedId });
    this.performUpdate();
  }

  async performUpdate () {
    this.shadowRoot.querySelectorAll('gv-button').forEach((btn) => btn.performUpdate());
    return super.performUpdate();
  }

  render () {
    if (this.options) {
      return html`<div>${repeat(this.options, (option) => option, (option, index) =>
        html`<gv-button icon=${option.icon} .title="${ifDefined(option.title)}" style=""
.primary="${option.active}"
@click="${this._onClick}"
class="${classMap({ active: option.active, entry: index === 0, exit: (index === this.options.length - 1) })}"
data-id="${option.id}"></gv-button>`
      )}</div>`;
    }

    return html``;
  }

}

window.customElements.define('gv-option', GvOption);
