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
import { html } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';
import { withResizeObserver } from '../mixins/with-resize-observer';
import './gv-category';
import { classMap } from 'lit-html/directives/class-map';
import { i18n } from '../lib/i18n';

/**
 * List of categories
 *
 * @cssprop {Color} [--gv-category-list--bgc-1=#CCE6EB] - Category background color 1
 * @cssprop {Color} [--gv-category-list--bgc-2=#FCF1A8] - Category background color 2
 * @cssprop {Color} [--gv-category-list--bgc-3=#D9D4F1] - Category background color 3
 * @cssprop {Color} [--gv-category-list--bgc-4=#F9C15E] - Category background color 4
 * @cssprop {Color} [--gv-category-list--bgc-5=#D4FCCD] - Category background color 5
 * @cssprop {Color} [--gv-category-list--bgc-6=#E0C8B2] - Category background color 6
 */
export class GvCategoryList extends withResizeObserver(LitElement) {

  static get properties () {
    return {
      categories: { type: Array },
      _categories: { type: Array, attribute: false },
      _skeleton: { type: Boolean, attribute: false },
      _error: { type: Boolean, attribute: false },
    };
  }

  constructor () {
    super();
    this.breakpoints = {
      width: [845, 1270],
    };
    this._categories = [];
    this._skeleton = false;
    this._error = false;
    this._empty = true;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          --bgc-1: var(--gv-category-list--bgc-1, #CCE6EB);
          --bgc-2: var(--gv-category-list--bgc-2, #FCF1A8);
          --bgc-3: var(--gv-category-list--bgc-3, #D9D4F1);
          --bgc-4: var(--gv-category-list--bgc-4, #F9C15E);
          --bgc-5: var(--gv-category-list--bgc-5, #D4FCCD);
          --bgc-6: var(--gv-category-list--bgc-6, #E0C8B2);
          box-sizing: border-box;
          display: block;
        }

        .container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-gap: 0.5rem;
        }

        .container.error {
            display: block;
            text-align: center;
        }

        :host([w-lt-1270]) .container {
          grid-template-columns: repeat(2, 1fr);
        }

        :host([w-lt-845]) .container {
          display: flex;
          flex-direction: column;
        }

        :host([w-lt-845]) .container > gv-category {
          flex: 0 1 auto;
        }

      `,
    ];
  }

  set categories (value) {
    Promise.resolve(value)
      .then((value) => {
        if (value) {
          this._skeleton = false;
          this._categories = value;
        }
        else {
          this._skeleton = true;
        }
      })
      .catch(() => {
        this._skeleton = false;
        this._error = true;
      });
  }

  render () {
    return html`<div class="${classMap({ container: true, error: this._error })}">
                 ${this._error ? html`<div>${i18n('gv-category-list.error')}</div>`
      : repeat(this._categories, (category) => category, (category, index) =>
        html`<gv-category .category="${category}" style="${this._getCategoryBackgroundColor(index)}"> </gv-category>`
      )}
               </div>
        `;
  }

  _getCategoryBackgroundColor (index) {
    return `--gv-category--bgc: var(--bgc-${index % 6 + 1})`;
  }

}

window.customElements.define('gv-category-list', GvCategoryList);
