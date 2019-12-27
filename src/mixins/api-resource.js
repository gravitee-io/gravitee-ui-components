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
import { dispatchCustomEvent } from '../lib/events.js';
import { repeat } from 'lit-html/directives/repeat';

/**
 * This is a mixin for ApiResource
 * @mixinFunction
 */
export function ApiResource (ParentClass) {

  /**
   * @mixinClass
   */
  return class extends ParentClass {

    static get properties () {
      return {
        /** @required */
        api: { type: Object },
        _api: { type: Object, attribute: false },
        _skeleton: { type: Boolean, attribute: false },
        _error: { type: Boolean, attribute: false },
        _empty: { type: Boolean, attribute: false },
        _picture: { type: String, attribute: false },
      };
    }

    constructor () {
      super();
      this._skeleton = true;
      this._error = false;
      this._empty = false;
    }

    set api (api) {
      Promise.resolve(api)
        .then((api) => {
          if (api) {
            this._skeleton = false;
            this._empty = Object.keys(api).length === 0;
            this._api = api;
            if (api._links && api._links.picture) {
              this._picture = api._links.picture;
            }
            else {
              this._loadDefaultPicture();
            }
          }
          else {
            this._skeleton = true;
            this._error = false;
            this._empty = false;
          }
        }).catch(() => {
          this._loadDefaultPicture();
          this._error = true;
          this._skeleton = false;
        });
    }

    getDefaultPicture () {
      return import('../../assets/images/promote-api.png');
    }

    _getVersion () {
      if (this._api) {
        return this._api.version;
      }
      return null;
    }

    _onImageLoaded () {
      if (this._api) {
        this._skeleton = false;
      }
    }

    _getStates () {
      if (this._api) {
        return this._api.states;
      }
      return null;
    }

    _getLabels () {
      if (this._api) {
        return this._api.labels;
      }
      return null;
    }

    _getViews () {
      if (this._api) {
        return this._api.views;
      }
      return null;
    }

    _renderImage () {
      if (this._picture) {
        return html`<gv-image src="${this._picture}" alt="${this._getTitle()}" @load="${this._onImageLoaded}">`;
      }
      return ``;
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
        rendered.push(html`<gv-rating .skeleton="${this._skeleton}" .average="${rating.average}" .count="${rating.count}"></gv-rating>`);
      }
      return rendered;
    }

    _renderInfoRating () {
      const rating = this._getRating();
      if (rating) {
        return html`<gv-rating .skeleton="${this._skeleton}" .average="${rating.average}" .count="${rating.count}"></gv-rating>`;
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
      if (this._api) {
        return this._api.rating_summary;
      }
      return null;
    }

    _getDescription () {
      if (this._api) {
        return this._api.description;
      }
      return '';
    }

    _getTitle () {
      if (this._api) {
        return this._api.name;
      }
      return '';
    }

    _getOwner () {
      if (this._api && this._api.owner) {
        return this._api.owner.display_name;
      }
      return '';
    }

    _loadDefaultPicture () {
      this.getDefaultPicture().then((picture) => {
        this._picture = picture.default;
      });
    }
  };

}
