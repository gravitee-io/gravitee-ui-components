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
import { html } from 'lit-html';
import { dispatchCustomEvent } from '../lib/events';
import { repeat } from 'lit-html/directives/repeat';
import { getApplicationTypeIcon } from '../lib/theme';
import '../molecules/gv-identity-picture';

/**
 * This is a mixin for ItemResource
 * @mixinFunction
 */
export function ItemResource (ParentClass) {

  /**
   * @mixinClass
   */
  return class extends ParentClass {

    static get properties () {
      return {
        /** @required */
        item: { type: Object },
        _item: { type: Object, attribute: false },
        _skeleton: { type: Boolean, attribute: false },
        _error: { type: Boolean, attribute: false },
        _empty: { type: Boolean, attribute: false },
        _picture: { type: String, attribute: false },
      };
    }

    constructor () {
      super();
      this._skeleton = false;
      this._error = false;
      this._empty = true;
    }

    set item (item) {
      this._skeleton = true;
      Promise.resolve(item)
        .then((item) => {
          if (item) {
            this._item = item;
            if (item.picture) {
              this._picture = item.picture;
            }
            else if (item._links && item._links.picture) {
              this._picture = item._links.picture;
            }
            this._empty = false;
            this._skeleton = false;
          }
          else {
            this._skeleton = true;
          }
          this._empty = item == null || Object.keys(item).length === 0;
          this._error = false;
        })
        .catch(() => {
          this._error = true;
          this._skeleton = false;
        });
    }

    _getVersion () {
      if (this._item) {
        if (this._item.version) {
          return this._item.version;
        }
        else if (this._item.applicationType) {
          const icon = getApplicationTypeIcon(this._item.applicationType);
          return html`<gv-icon shape="${icon}"></gv-icon>`;
        }
      }
      return null;
    }

    _onImageLoaded () {
      if (this._item) {
        this._skeleton = false;
      }
    }

    _getStates () {
      if (this._item) {
        return this._item.states;
      }
      return null;
    }

    _getLabels () {
      if (this._item) {
        return this._item.labels;
      }
      return null;
    }

    _getViews () {
      if (this._item) {
        return this._item.views;
      }
      return null;
    }

    _renderImage () {
      if (!this._empty) {
        return html`<gv-identity-picture .display_name="${this._getTitle()}" .picture="${this._picture}" @load="${this._onImageLoaded}"></gv-identity-picture>`;
      }
      return '';
    }

    _onTagClick (tagValue, tagType) {
      dispatchCustomEvent(this, 'click-' + tagType, { tagValue });
    }

    _renderLabels () {
      const labels = this._getLabels();
      if (labels) {
        return repeat(labels, (label) => label, (label) => html` <gv-tag @click="${this._onTagClick.bind(this, label, 'label')}" ?skeleton="${this._skeleton}" major>${label}</gv-tag>`);
      }
      return '';
    }

    _renderStates () {
      const states = this._getStates();
      if (states) {
        return repeat(states, (state) => state, ({ value, major, minor }) => html`
                 <gv-state ?skeleton="${this._skeleton}"
                    ?major="${major === true}"
                    ?minor="${minor === true}">${value}</gv-state>
        `);
      }
      return '';
    }

    _renderMetricsWithRating () {
      const rendered = [];
      if (this.metrics) {
        rendered.push(html`<gv-metrics .metrics="${this.metrics}">`);
      }
      const rating = this._getRating();
      if (rating) {
        rendered.push(html`<gv-rating readonly .skeleton="${this._skeleton}" .value="${rating.average}" .count="${rating.count}"></gv-rating>`);
      }
      return rendered;
    }

    _renderInfoRating () {
      const rating = this._getRating();
      if (rating) {
        return html`<gv-rating readonly .skeleton="${this._skeleton}" .value="${rating.average}" .count="${rating.count}"></gv-rating>`;
      }
      return '';
    }

    _renderViews () {
      const views = this._getViews();
      if (views) {
        return repeat(views, (name) => name, (name) => html`<gv-tag @click="${this._onTagClick.bind(this, name, 'view')}" ?skeleton="${this._skeleton}">${name}</gv-tag>`);
      }
      return '';
    }

    _getRating () {
      if (this._item) {
        return this._item.rating_summary;
      }
      return null;
    }

    _getDescription () {
      if (this._item) {
        return this._item.description;
      }
      return '';
    }

    _getTitle () {
      if (this._item) {
        return this._item.name;
      }
      return '';
    }

    _getOwner () {
      if (this._item && this._item.owner) {
        return this._item.owner.display_name;
      }
      return '';
    }

  };

}
