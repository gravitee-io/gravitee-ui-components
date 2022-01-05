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
import { LitElement, html, css } from 'lit';
import { dispatchCustomEvent } from '../../lib/events';
import '../../atoms/gv-button';
import '../../atoms/gv-input';
import { i18n } from '../../lib/i18n';
import { customElement, property, query } from 'lit/decorators';
import { Pagination } from './types';

/**
 * A pagination
 *
 * ## Details
 * * has @theme facet
 *
 * @fires gv-pagination:paginate - Custom event with pagination link
 *
 * @attr {Object} data - Pagination information {first, last, total, current_page}
 * @attr {Boolean} hide-empty - hide component if no page or no data.
 * @attr {Boolean} widget - display widget pagination (with arrows).
 * @attr {Boolean} disabled - same as native button element `disabled` attribute
 * @attr {Boolean} has-search - display an input and a submit button to go to page.
 *
 * @cssprop {Length} [--gv-pagination--fz=var(--gv-theme-font-size-s, 12px)] - Font size
 * @cssprop {Length} [--gv-pagination-icon--s=18px] - Height and icon width
 */
@customElement('gv-pagination')
export class GvPagination extends LitElement {
  @property({ type: Object })
  public data: Pagination | any;

  @property({ type: Boolean, attribute: 'hide-empty' })
  public hideEmpty: boolean = false;

  @property({ type: Boolean })
  public widget: boolean = false;

  @property({ type: Boolean })
  public disabled: boolean = false;

  @property({ type: Boolean, attribute: 'has-search' })
  public hasSearch: boolean = false;

  @property({ type: Number, attribute: false })
  private max: number = 10;

  @property({ type: Number, attribute: false })
  private center: number = this.max / 2 - 1;

  @query('gv-input')
  private input: any;

  static get styles() {
    return [
      // language=css
      css`
        .pagination {
          --font-size: var(--gv-pagination--fz, var(--gv-theme-font-size-s, 12px));
          font-size: var(--fz);
          --gv-button--fz: var(--fz);
          display: flex;
          align-items: center;
        }

        gv-button {
          --gv-icon--s: var(--gv-pagination-icon--s, 18px);
          min-width: 29px;
        }

        gv-input {
          width: 50px;
        }
      `,
    ];
  }

  willUpdate(changedProperties: any) {
    if (changedProperties.has('data') && this.data) {
      if (this.data.total_pages < this.max) {
        this.max = this.data.total_pages;
        this.center = this.max / 2 - 1;
      }
    }
  }

  private goToPage(page: number) {
    this.data.current_page = page;
    this.requestUpdate('data');
    dispatchCustomEvent(this, 'paginate', { page: page });
  }

  private onSubmit(e: Event) {
    // @ts-ignore ?
    const page = e.target?.value;
    this.goToPage(parseInt(page, 10));
  }

  private onClickToSearch() {
    if (this.input) {
      // @ts-ignore ?
      const page = this.input.value;
      if (page) {
        this.goToPage(page);
      }
    }
  }

  private renderPagination() {
    const pagination = [];
    for (let i = 0; i < this.data.total_pages; i++) {
      pagination.push(i + 1);
    }

    let left = pagination.slice(0, this.data.current_page - 1);
    let right = pagination.slice(this.data.current_page);

    if (pagination.length > this.max) {
      const dL = left.length;
      let removeL = dL - this.center - 1;
      let addRight = this.max - this.data.current_page > this.center ? this.max - this.data.current_page : this.center;
      if (removeL > 0) {
        addRight = this.center;
        const diff = this.data.last - this.data.current_page - addRight;
        if (diff < 0) {
          removeL += diff;
        }
        left = left.slice(removeL);
      }
      right = right.slice(0, addRight);
    }
    const leftP = left.map((i) => html`<gv-button small outlined @click="${this.goToPage.bind(this, i)}">${i}</gv-button>`);
    const rightP = right.map((i) => html`<gv-button small outlined @click="${this.goToPage.bind(this, i)}">${i}</gv-button>`);

    leftP.unshift(
      html`<gv-button
        small
        .disabled="${this.disabled || leftP.length === 0}"
        .icon="${this.widget ? 'navigation:angle-left' : null}"
        .title="${i18n('gv-pagination.previous')}"
        outlined
        @click="${leftP.length === 0 ? () => {} : this.goToPage.bind(this, this.data.current_page - 1)}"
        >${this.widget ? '' : i18n('gv-pagination.previous')}</gv-button
      >`,
    );
    rightP.push(
      html`<gv-button
        small
        .disabled="${this.disabled || rightP.length === 0}"
        .icon="${this.widget ? 'navigation:angle-right' : null}"
        .title="${i18n('gv-pagination.next')}"
        outlined
        @click="${rightP.length === 0 ? () => {} : this.goToPage.bind(this, this.data.current_page + 1)}"
        >${this.widget ? '' : i18n('gv-pagination.next')}</gv-button
      >`,
    );
    return html`${this.widget ? leftP.slice(0, 1) : leftP}
    ${html`<gv-button .disabled="${this.disabled}" small primary
      >${this.widget ? this.data.current_page + ' / ' + pagination.length : this.data.current_page}</gv-button
    >`}
    ${this.widget ? rightP.slice(rightP.length - 1, rightP.length) : rightP}`;
  }

  private get hasData() {
    return this.data?.total_pages && this.data?.last && this.data?.current_page;
  }

  private get hide() {
    return this.hideEmpty && this.data?.total_pages < 2;
  }

  render() {
    if (this.hasData && !this.hide) {
      return html`<div class="pagination">
        ${this.hasSearch
          ? html`<gv-input
                class="goto"
                @gv-input:submit="${this.onSubmit}"
                type="number"
                min="1"
                max="${this.data.total_pages}"
                placeholder="Page"
                small
              ></gv-input>
              <gv-button small outlined @click="${this.onClickToSearch}" icon="general:search"></gv-button>`
          : ''}
        ${this.renderPagination()}
      </div> `;
    }
    return html``;
  }
}
