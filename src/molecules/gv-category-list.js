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
import { css } from 'lit-element';
import { html } from 'lit-html';
import './gv-category';
import { GvCardList } from './gv-card-list';

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
export class GvCategoryList extends GvCardList {

  static get styles () {
    return [...GvCardList.styles, ...[
      // language=CSS
      css`
        :host {
          --bgc-1: var(--gv-category-list--bgc-1, #CCE6EB);
          --bgc-2: var(--gv-category-list--bgc-2, #FCF1A8);
          --bgc-3: var(--gv-category-list--bgc-3, #D9D4F1);
          --bgc-4: var(--gv-category-list--bgc-4, #F9C15E);
          --bgc-5: var(--gv-category-list--bgc-5, #D4FCCD);
          --bgc-6: var(--gv-category-list--bgc-6, #E0C8B2);
        }
      `,
    ]];
  }

  renderItem (item, index) {
    return html`<gv-category class="item" .category="${item}" style="${this._getCategoryBackgroundColor(index)}"> </gv-category>`;
  }

  _getCategoryBackgroundColor (index) {
    return `--gv-category--bgc: var(--bgc-${index % 6 + 1})`;
  }

}

window.customElements.define('gv-category-list', GvCategoryList);
