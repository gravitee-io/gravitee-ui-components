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
import { css, LitElement, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import '../../atoms/gv-relative-time';
import '../../molecules/gv-identity-picture';
import '../../molecules/gv-rating';
import '../../molecules/gv-confirm';
import { skeleton } from '../../styles/skeleton';
import { link } from '../../styles/link';
import { i18n } from '../../lib/i18n';
import { classMap } from 'lit/directives/class-map.js';
import { dispatchCustomEvent } from '../../lib/events';

/**
 * List of ratings with answer form
 *
 * ## Details
 * * has @theme facet
 *
 * ## Attribute `permissions` details
 * * `delete` and `update` properties supports booleans or arrays of rating identifier.
 * * `addAnswer` and `deleteAnswer` only accept booleans.
 *
 * @fires gv-rating-list:add-answer - When user submit answer
 * @fires gv-rating-list:delete - When user delete rating
 * @fires gv-rating-list:delete-answer - When user delete answer
 * @fires gv-rating-list:update - When user update rating
 *
 * @attr {Promise<Array>} ratings - ratings
 * @attr {id, avatar, display_name} user - a current user
 * @attr {Object<{update, delete, addAnswer, deleteAnswer}>} permissions - The permissions
 * @cssprop {Color} [--gv-rating-list--bgc=var(--gv-theme-neutral-color-lightest, #ffffff)] - Background color
 * @cssprop {Color} [--gv-rating-list-answer--bgc=var(--gv-theme-neutral-color-lighter, #fafafa)] - Answer background color
 * @cssprop {Color} [--gv-rating-list--bdc=var(--gv-theme-neutral-color, #f5f5f5)] - Border color
 * @cssprop {Length} [--gv-rating-list--s=18px] - Height and star width
 */

export class GvRatingList extends LitElement {
  static get properties() {
    return {
      ratings: { type: Array },
      user: { type: Object },
      permissions: { type: Object },
      required: { type: Boolean, attribute: 'required' },
      _permissions: { type: Object, attribute: false },
      _ratings: { type: Array, attribute: false },
    };
  }

  static get styles() {
    return [
      skeleton,
      link,
      // language=CSS
      css`
        :host {
          --s: var(--gv-rating-list--s, 18px);
          --gv-icon--s: var(--s);
          --gv-rating--s: var(--s);
          margin: 0.2rem;
          box-sizing: border-box;
        }

        .rating-list {
          background-color: var(--gv-rating-list--bgc, var(--gv-theme-neutral-color-lightest, #ffffff));
        }

        .rating.parent {
          border-bottom: 1px solid var(--gv-rating-list--bdc, var(--gv-theme-neutral-color, #f5f5f5));
        }

        .rating {
          display: flex;
          padding: 1rem 0;
        }

        .answer .rating {
          padding: 1rem 0 0 0;
        }

        .sub-title {
          color: grey;
          display: flex;
          line-height: 20px;
        }

        gv-confirm {
          align-self: center;
        }

        .sub-title a.link {
          text-decoration: underline;
        }

        gv-identity-picture {
          margin: 0 1rem;
          height: 60px;
          width: 60px;
        }

        .title {
          display: flex;
          line-height: 20px;
        }

        .title b,
        .rating-content {
          flex: 1;
        }

        .link-answer {
          display: inline-block;
          padding: 1rem 0;
        }

        .link-answer gv-icon {
          margin-right: 0.2rem;
          --gv-icon--s: var(--s);
        }

        .delete-rating,
        .delete-answer,
        .fake-icon {
          --gv-icon--s: var(--s);
          min-width: var(--s);
          display: inline-flex;
        }

        .delete-rating {
          padding-right: 1rem;
        }

        .answer {
          padding: 1rem;
          margin-top: 1rem;
          background-color: var(--gv-rating-list-answer--bgc, var(--gv-theme-neutral-color-lighter, #fafafa));
        }

        .answer-form {
          display: flex;
          flex-direction: column;
        }

        .display-name:after {
          content: '|';
          margin: 2px;
        }

        .actions {
          text-align: right;
        }
      `,
    ];
  }

  constructor() {
    super();
    this._ratings = [];
    this._permissions = {
      update: false,
      delete: false,
      addAnswer: false,
      deleteAnswer: false,
    };
    this._hasValidAnswer = false;
  }

  set ratings(value) {
    Promise.resolve(value)
      .then((value) => {
        if (value) {
          this._skeleton = false;
          this._ratings = value;
        } else {
          this._skeleton = true;
        }
      })
      .catch(() => {
        this._skeleton = false;
      });
  }

  set permissions(permissions) {
    if (permissions && typeof permissions === 'object') {
      this._permissions = Object.assign({}, this._permissions, permissions);
    }
  }

  render() {
    return html` <div class="rating-list">${repeat(this._ratings, (rating) => this._render(rating))}</div> `;
  }

  _editAnswer(rating, e) {
    e.stopPropagation();
    this._ratings.forEach((rating) => (rating._edit = false));
    rating._edit = true;
    this.requestUpdate();
  }

  _getAnswerValue() {
    const element = this.shadowRoot.querySelector('gv-text');
    if (element) {
      return element.value;
    }
    return '';
  }

  _onAnswer(rating) {
    const answer = this._getAnswerValue();
    if (answer.trim().length > 0) {
      dispatchCustomEvent(this, 'add-answer', { rating, answer });
    }
  }

  _onClose(rating) {
    delete rating._edit;
    this._hasValidAnswer = false;
    this.requestUpdate();
  }

  _renderAnswer(rating, answer) {
    return html`<div class="answer">${this._render(answer, rating)}</div>`;
  }

  _onResponseInput() {
    const answer = this._getAnswerValue();
    this._hasValidAnswer = answer.trim().length > 0;
    this.requestUpdate();
  }

  _renderAnswers(rating) {
    return html` ${rating.answers
      ? html` ${this._canAddAnswer()
            ? html`<a class="link link-answer" @click="${this._editAnswer.bind(this, rating)}">
                <gv-icon class="link" shape="communication:chat#5"></gv-icon> ${i18n('gv-rating-list.reply')}</a
              >`
            : ''}
          ${rating._edit
            ? html`
                <div class="answer answer-form">
                  <gv-text
                    rows="4"
                    label="${i18n('gv-rating-list.answerLabel')}"
                    required
                    @input="${this._onResponseInput.bind(this)}"
                  ></gv-text>
                  <div class="actions">
                    <gv-button primary outlined @click="${this._onClose.bind(this, rating)}">${i18n('gv-rating-list.cancel')}</gv-button>
                    <gv-button primary @click="${this._onAnswer.bind(this, rating)}" .disabled="${!this._hasValidAnswer}"
                      >${i18n('gv-rating-list.send')}</gv-button
                    >
                  </div>
                </div>
              `
            : ''}
          <div>${repeat(rating.answers, (answer) => this._renderAnswer(rating, answer))}</div>`
      : ''}`;
  }

  _onDelete(rating) {
    dispatchCustomEvent(this, 'delete', { rating });
  }

  _onDeleteAnswer(rating, answer) {
    dispatchCustomEvent(this, 'delete-answer', { rating, answer });
  }

  _renderActions(data, parent) {
    if (parent) {
      return html`
        ${this._canDeleteAnswer()
          ? html`<gv-confirm
              danger
              icon="home:trash"
              @gv-confirm:ok="${this._onDeleteAnswer.bind(this, parent, data)}"
              message="${i18n('gv-rating-list.confirmAnswerDelete')}"
            >
              <gv-icon title="${i18n('gv-rating-list.deleteAnswer')}" class="link delete-answer" shape="home:trash"></gv-icon>
            </gv-confirm>`
          : ''}
      `;
    } else {
      return html`
        ${this._canDelete(data.id)
          ? html`<gv-confirm
              danger
              icon="home:trash"
              @gv-confirm:ok="${this._onDelete.bind(this, data)}"
              message="${i18n('gv-rating-list.confirmRatingDelete')}"
            >
              <gv-icon title="${i18n('gv-rating-list.deleteRating')}" class="link delete-rating" shape="home:trash"></gv-icon>
            </gv-confirm>`
          : html`<div class="fake-icon"></div>`}
      `;
    }
  }

  _render(data, parent) {
    const classes = { rating: true, skeleton: this._skeleton, parent: parent == null };
    const displayName = data.author && data.author.display_name ? data.author.display_name : null;
    const picture = data.author && data.author._links && data.author._links.avatar ? data.author._links.avatar : null;

    return html`
      <div class="${classMap(classes)}">
        <gv-identity-picture rounded .display_name="${displayName}" .picture="${picture}"></gv-identity-picture>
        <div class="rating-content">
          <div class="title">
            <b>${data.title ? data.title : data.author.display_name}</b>${parent
              ? ''
              : html`<gv-rating
                  .readonly="${!this._canUpdate(data.id)}"
                  @input="${this._onUpdateRating.bind(this, data)}"
                  value="${data.value}"
                ></gv-rating>`}${this._renderActions(data, parent)}
          </div>
          <div class="sub-title">${this._getDisplayName(data)}<gv-relative-time datetime="${data.date}" noFuture></gv-relative-time></div>
          <p class="comment">${data.comment}</p>
          ${parent ? '' : this._renderAnswers(data)}
        </div>
      </div>
    `;
  }

  _onUpdateRating(rating, e) {
    rating.value = e.target.value;
    dispatchCustomEvent(this, 'update', { rating });
  }

  _canAddAnswer() {
    return this._permissions.addAnswer === true;
  }

  _canDeleteAnswer() {
    return this._permissions.deleteAnswer === true;
  }

  _canUpdate(ratingId) {
    if (Array.isArray(this._permissions.update)) {
      return this._permissions.update.includes(ratingId);
    }
    return this._permissions.update === true;
  }

  _canDelete(ratingId) {
    if (Array.isArray(this._permissions.delete)) {
      return this._permissions.delete.includes(ratingId);
    }
    return this._permissions.delete === true;
  }

  _getDisplayName(data) {
    if (data.title) {
      return html`<span class="display-name">${data.author.display_name}</span>`;
    }
    return '';
  }
}

window.customElements.define('gv-rating-list', GvRatingList);
