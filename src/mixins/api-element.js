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
import { LitElement } from 'lit-element';
import defaultPicture from '../../assets/images/promote-api.png';
import { html } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';

export class ApiElement extends LitElement {

  static get properties () {
    return {
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
            this._picture = defaultPicture;
          }
        }
        else {
          this._skeleton = true;
          this._error = false;
          this._empty = false;
        }
      }).catch(() => {
        this._error = true;
        this._picture = this.getDefaultPicture();
        this._skeleton = false;
      });
  }

  getDefaultPicture () {
    return defaultPicture;
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

  _renderImage () {
    if (this._picture) {
      return html`<gv-image src="${this._picture}" alt="${this._getTitle()}" @load="${this._onImageLoaded}">`;
    }
    return ``;
  }

  _renderLabels () {
    const labels = this._getLabels();
    if (labels) {
      return repeat(labels, (label) => label, ({ value, major, minor }) => html`
                    <gv-tag ?skeleton="${this._skeleton}"
                    ?major="${major === true}"
                    ?minor="${minor === true}">${value}</gv-tag>
                `);
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

  _renderInfoRating () {
    const rating = this._getRating();
    if (rating) {
      return html`<gv-rating .skeleton="${this._skeleton}" .average="${rating.average}" .count="${rating.count}"></gv-rating>`;
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

}
