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
import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import '../molecules/gv-identity-picture';
import { getLabels, getPicture, getStates, getRating, getPictureDisplayName } from '../lib/item';
import { withSkeletonAttribute } from './with-skeleton-attribute';

/**
 * This is a mixin for ItemResource
 * @mixinFunction
 */
export function ItemResource(ParentClass) {
  /**
   * @mixinClass
   */
  return class extends withSkeletonAttribute(ParentClass) {
    static get properties() {
      return {
        ...super.properties,
        /** @required */
        item: { type: Object },
        href: { type: String },
        metrics: { type: Object },
        _item: { type: Object, attribute: false },
      };
    }

    constructor() {
      super();
      this._skeletonAttribute = 'item';
    }

    _onImageLoaded() {
      if (this._item) {
        this._skeleton = false;
      }
    }

    _renderImage() {
      if (this._item && !this._empty) {
        return html`<gv-identity-picture
          .skeleton="${this._skeleton}"
          .display_name="${getPictureDisplayName(this._item)}"
          .picture="${getPicture(this._item)}"
          @load="${this._onImageLoaded}"
        ></gv-identity-picture>`;
      }
      return '';
    }

    _onTagClick(tagValue, event) {
      event.detail.tagValue = tagValue;
    }

    _renderLabels(clickable) {
      const labels = getLabels(this._item);
      if (labels) {
        return repeat(
          labels,
          (label) => label,
          (label) =>
            html`<gv-tag ?clickable="${clickable}" @gv-tag:click="${this._onTagClick.bind(this, label)}" ?skeleton="${this._skeleton}" major
              >${label}</gv-tag
            >`,
        );
      }
      return '';
    }

    _renderStates() {
      const states = getStates(this._item);
      if (states) {
        return repeat(
          states,
          (state) => state,
          ({ value, major, minor }) => html`
            <gv-state ?skeleton="${this._skeleton}" ?major="${major === true}" ?minor="${minor === true}">${value}</gv-state>
          `,
        );
      }
      return '';
    }

    _onClickToMetrics(event) {
      event.detail.item = this._item;
    }

    _renderMetricsWithRating() {
      if (this.metrics) {
        return html`
          <gv-metrics .metrics="${this.metrics}" @gv-metrics:click="${this._onClickToMetrics}"> ${this._renderInfoRating()} </gv-metrics>
        `;
      } else {
        return this._renderInfoRating();
      }
    }

    _renderInfoRating() {
      const rating = getRating(this._item);
      if (rating && rating.count) {
        return html`<gv-rating readonly .skeleton="${this._skeleton}" .value="${rating.average}" .count="${rating.count}"></gv-rating>`;
      }
      return '';
    }
  };
}
