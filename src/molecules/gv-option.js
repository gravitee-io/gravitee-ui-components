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
 * @attr {Array<{id, title, icon, active?, description?}>} options - An array of options.
 * @attr {String|Array} value - Selected value, array with multiple option.
 * @attr {Boolean} multiple - If true, can choose several option
 * @attr {Boolean} reverse - If true, title and description are reversed.
 *
 * @cssprop {Color} [--gv-option--bgc=var(--gv-theme-neutral-color-dark, #BFBFBF)] - Background color
 * @cssprop {Length} [--gv-option--bdrs=0.15rem] - Border radius
 * @cssprop {Length} [--gv-option-button--p=5px] - Button padding
 * @cssprop {Length} [--gv-option-button--maw=200px] - Button max width
 * @cssprop {Length} [--gv-option--fxw=none] - Flex wrap
 */
export class GvOption extends LitElement {

  static get properties () {
    return {
      options: { type: Array },
      _options: { type: Array, attribute: false },
      value: { type: String, reflect: true },
      multiple: { type: Boolean },
      reverse: { type: Boolean },
    };
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
              --maw: var(--gv-option-button--maw, 200px);
          }

          .box.description {
              display: flex;
              margin: -0.5rem;
              flex-wrap: var(--gv-option--fxw, none);
              justify-content: space-around;
          }
          
          gv-button {
              margin: 0;
          }
          
          gv-button.description {
              flex: 1 1 var(--maw);
              max-width: var(--maw);
          }

          gv-button:not(.description) {
              margin: 0;
              --gv-button--bdrs: 0;
              --gv-button--bgc: var(--gv-option--bgc, var(--gv-theme-neutral-color-dark, #BFBFBF));
          }

          gv-button:not(.description).entry {
              --gv-button--bdrs: var(--bdrs) 0 0 var(--bdrs);
          }

          gv-button:not(.description).exit {
              --gv-button--bdrs: 0 var(--bdrs) var(--bdrs) 0;
          }
          
          .content {
              white-space: pre-line;
              --gv-icon--s: 64px;
              display: flex;
              flex-direction: column;
              align-items: center;
              height: 100%;
              text-transform: none;
          }
          .reverse .content {
              flex-direction: column-reverse;
          }
          
          .title {
              font-size: var(--gv-theme-font-size-l, 18px);
              font-weight: bold;
              margin: 0.5rem 0;
          }

          gv-button.description {
              margin: 0.5rem;
          }
      `,
    ];
  }

  constructor () {
    super();
    this.multiple = false;
    this.reverse = false;
  }

  _onClick (option) {
    if (this.multiple === true) {
      this._options = this._options.map((opt) => {
        if (opt.id === option.id) {
          opt.active = !opt.active;
        }
        return opt;
      });
      this.setValue(this._options.filter((opt) => opt.active));
    }
    else {
      this._options = this._options.map((opt) => {
        opt.active = opt.id === option.id;
        return opt;
      });
      this.setValue(option);
    }
    dispatchCustomEvent(this, 'select', option);
    this.dispatchEvent(new Event('input'), { bubbles: true, cancelable: true });
  }

  async performUpdate () {
    this.shadowRoot.querySelectorAll('gv-button').forEach((btn) => btn.performUpdate());
    return super.performUpdate();
  }

  setValue (option) {
    if (option) {
      this.value = option.id;
    }
  }

  set options (options) {
    if (options) {
      Promise.all(options).then((_options) => {
        this._options = _options;
        this.setValue(this._options.find((option) => option.active));
      });
    }
  }

  render () {
    if (this._options) {

      const hasDescription = this._options.find((opt) => opt.description != null) != null;
      const classes = {
        box: true,
        description: hasDescription,
        reverse: this.reverse,
      };
      return html`<div class="${classMap(classes)}">${repeat(this._options, (option) => option, (option, index) =>
        html`<gv-button 
            .icon=${ifDefined(!hasDescription ? option.icon : null)} 
            .title="${ifDefined(option.title)}"
            .primary="${option.active}"
            .disabled="${option.disabled}"
            @click="${this._onClick.bind(this, option)}"
            .outlined="${!option.active && hasDescription}"
            class="${classMap({
          active: option.active,
          entry: index === 0,
          exit: (index === this._options.length - 1),
          description: option.description != null,
        })}">
        ${!hasDescription ? ''
          : html`<div class="content">
            ${option.icon ? html`<gv-icon shape="${option.icon}"></gv-icon>` : ''}
            <div class="title">${option.title}</div>
            <div class="description-content" .innerHTML="${option.description}"></div>
            
</div>`}
</gv-button>`
      )}</div>`;
    }
    return html``;
  }

}

window.customElements.define('gv-option', GvOption);
