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
import { i18n } from '../../lib/i18n';
import { customElement, property, query } from 'lit/decorators';
import { Pagination, PaginateDetail } from './model';
import '../../atoms/gv-button';
import '../../atoms/gv-input';
import '../../atoms/gv-select-native';
import { classMap } from 'lit/directives/class-map';

/**
 * A pagination
 *
 * ## Details
 * * has @theme facet
 * * @see { Pagination } for data attribute
 * * @see { PaginateDetail } for detail of custom event
 *
 * @fires gv-pagination:paginate - Custom event with pagination link
 *
 * @attr {Object} data - Pagination information
 * @attr {Boolean} hide-empty - hide component if no page, no data or just one page.
 * @attr {Boolean} widget - display widget pagination (with arrows).
 * @attr {Boolean} disabled - same as native button element `disabled` attribute
 * @attr {Boolean} has-search - display an input and a submit button to go to page.
 * @attr {Boolean} has-select - display a page size selector
 * @attr {Boolean} small - for pagination with small fields (Default)
 * @attr {Boolean} medium - for pagination with medium fields
 * @attr {Boolean} large - for pagination with large fields
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

  @property({ type: Boolean, attribute: 'has-select' })
  public hasSelect: boolean = false;

  @property({ type: Boolean, reflect: true })
  public small: boolean = true;

  @property({ type: Boolean, reflect: true })
  public medium: boolean = false;

  @property({ type: Boolean, reflect: true })
  public large: boolean = false;

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

        .medium gv-input,
        .large gv-input {
          width: 60px;
        }

        gv-select-native {
          width: 65px;
        }

        .medium gv-select-native,
        .large gv-select-native {
          width: 75px;
        }
      `,
    ];
  }

  willUpdate(changedProperties: any) {
    if (changedProperties.has('data') && this.data) {
      this.max = Math.min(this.data.total_pages, 10);
    }
    if (changedProperties.has('max') && this.max != null) {
      this.center = this.max / 2 - 1;
    }

    if (changedProperties.has('large') && this.large) {
      this.small = false;
      this.medium = false;
    } else if (changedProperties.has('medium') && this.medium) {
      this.small = false;
      this.large = false;
    } else if (changedProperties.has('small') && this.small) {
      this.medium = false;
      this.large = false;
    }
  }

  private goToPage(page: number) {
    this.data.current_page = page;
    this.requestUpdate('data');
    dispatchCustomEvent(this, 'paginate', { page: page, size: this.data.size } as PaginateDetail);
  }

  private onSubmit(e: CustomEvent<number>) {
    const page = e.detail;
    if (page != null && page <= this.data.total_pages && page > 0) {
      this.goToPage(page);
    }
  }

  private onClickToSearch() {
    if (this.input) {
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
    const leftP = left.map(
      (i) => html`<gv-button
        ?small="${this.small}"
        ?medium="${this.medium}"
        ?large="${this.large}"
        outlined
        @gv-button:click="${this.goToPage.bind(this, i)}"
        >${i}</gv-button
      >`,
    );
    const rightP = right.map(
      (i) => html`<gv-button
        ?small="${this.small}"
        ?medium="${this.medium}"
        ?large="${this.large}"
        outlined
        @gv-button:click="${this.goToPage.bind(this, i)}"
        >${i}</gv-button
      >`,
    );

    leftP.unshift(
      html`<gv-button
        ?small="${this.small}"
        ?medium="${this.medium}"
        ?large="${this.large}"
        .disabled="${this.disabled || leftP.length === 0}"
        .icon="${this.widget ? 'navigation:angle-left' : null}"
        .title="${i18n('gv-pagination.previous')}"
        outlined
        @gv-button:click="${leftP.length === 0 ? () => {} : this.goToPage.bind(this, this.data.current_page - 1)}"
        >${this.widget ? '' : i18n('gv-pagination.previous')}</gv-button
      >`,
    );
    rightP.push(
      html`<gv-button
        ?small="${this.small}"
        ?medium="${this.medium}"
        ?large="${this.large}"
        .disabled="${this.disabled || rightP.length === 0}"
        .icon="${this.widget ? 'navigation:angle-right' : null}"
        .title="${i18n('gv-pagination.next')}"
        outlined
        @gv-button:click="${rightP.length === 0 ? () => {} : this.goToPage.bind(this, this.data.current_page + 1)}"
        >${this.widget ? '' : i18n('gv-pagination.next')}</gv-button
      >`,
    );
    return html`${this.widget ? leftP.slice(0, 1) : leftP}
    ${html`<gv-button
      .disabled="${this.disabled}"
      ?small="${this.small}"
      ?medium="${this.medium}"
      ?large="${this.large}"
      primary
      .title="${this.widget
        ? i18n('gv-pagination.results', { count: this.data.total })
        : this.data.current_page + ' / ' + pagination.length}"
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

  private get pageSize() {
    if (this.hasSelect) {
      return this.data?.size || this.data?.sizes[0];
    }
    return null;
  }

  private onChangePageSize({ detail }: any) {
    this.data.size = Number(detail).valueOf();
    this.goToPage(1);
  }

  render() {
    const classes = {
      pagination: true,
      small: this.small,
      medium: this.medium,
      large: this.large,
    };

    if (this.hasData && !this.hide) {
      return html`<div class="${classMap(classes)}">
        ${this.hasSearch
          ? html`<gv-input
                class="goto"
                @gv-input:submit="${this.onSubmit}"
                type="number"
                min="1"
                .disabled="${this.disabled}"
                .value="${this.data?.current_page}"
                max="${this.data.total_pages}"
                placeholder="Page"
                ?small="${this.small}"
                ?medium="${this.medium}"
                ?large="${this.large}"
                .title="${this.data?.current_page + ' / ' + this.data.total_pages}"
              ></gv-input>
              <gv-button
                ?small="${this.small}"
                ?medium="${this.medium}"
                ?large="${this.large}"
                outlined
                @gv-button:click="${this.onClickToSearch}"
                icon="general:search"
                .title="${i18n('gv-pagination.goTo')}"
              ></gv-button>`
          : ''}
        ${this.hasSelect
          ? html`<gv-select-native
              .value="${this.pageSize}"
              .options="${this.data.sizes}"
              .disabled="${this.disabled}"
              @gv-select-native:input="${this.onChangePageSize}"
              ?small="${this.small}"
              ?medium="${this.medium}"
              ?large="${this.large}"
            ></gv-select-native>`
          : ''}
        ${this.renderPagination()}
      </div>`;
    }
    return html``;
  }
}
