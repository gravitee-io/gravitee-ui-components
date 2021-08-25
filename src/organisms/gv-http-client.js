/* eslint-disable yoda */
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
import { css, html, LitElement } from 'lit-element';

import './gv-schema-form';
import './gv-resizable-views';
import './gv-documentation';
import '../molecules/gv-table';
import '../atoms/gv-button';
import '../molecules/gv-option';
import '../atoms/gv-switch';
import '../atoms/gv-icon';
import { KeyboardElement } from '../mixins/keyboard-element';
import { empty } from '../styles/empty';
import { httpClientSchemaForm } from '../lib/http-client-schema-form';
import { dispatchCustomEvent } from '../lib/events';
import { statusCode } from '../lib/http';
import { repeat } from 'lit-html/directives/repeat';

/**
 * @fires gv-http-client:send - Event sent when
 *
 * @attr {String} path - Path of the request
 * @attr {String} method - Method of the request
 * @attr {Boolean} loading - True if the request is in progress
 * @attr {Object} response - Response of the request
 */
export class GvHttpClient extends KeyboardElement(LitElement) {
  static get properties() {
    return {
      response: { type: Object },
      path: { type: String },
      method: { type: String },
      loading: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.response = undefined;
    this.loading = false;
    this.path = undefined;
    this.method = undefined;
    this.request = {
      method: 'GET',
      path: '/',
    };
  }

  _sendRequest() {
    dispatchCustomEvent(this, 'send', { request: this.request });
  }

  _updateRequest(formData) {
    this.isFormValid = formData.detail.validation.valid;
    this.request = formData.detail.values;
    this.requestUpdate();
  }

  render() {
    return html` <div class="container">
      <div class="request">
        <div class="top-bar">Request</div>
        <div class="request-form">
          <gv-schema-form .schema="${httpClientSchemaForm}" id="request-form" @gv-schema-form:change="${this._updateRequest}">
          </gv-schema-form>
          <gv-button
            class="request-form-button"
            icon-right="content:send"
            .disabled="${this.isFormValid === false || this.loading === true}"
            @gv-button:click="${this._sendRequest}"
          >
            Send
          </gv-button>
        </div>
      </div>

      <div class="response">
        ${!this.loading && !this.response ? this._renderEmptyResponse() : ''} ${this.loading ? this._renderLoading() : ''}
        ${this.response ? this._renderDebugResponse() : ''}
      </div>
    </div>`;
  }

  _renderEmptyResponse() {
    return html`
      <div class="empty-response">
        <gv-icon class="empty-response-icon" shape="editor:format_align_left"></gv-icon>
        <div>Define and run the request you want to test!</div>
      </div>
    `;
  }

  _renderLoading() {
    return html`
      <div class="loading">
        <gv-icon class="loading-icon" shape="communication:sending"></gv-icon>
        <div>Request in progress!</div>
      </div>
    `;
  }

  _renderDebugResponse() {
    let prettifiedResponse = this.response.body;
    let mode = 'text';

    if (this.response.headers) {
      // eslint-disable-next-line no-unused-vars
      const contentTypeHeader = Object.entries(this.response.headers).find(([key, value]) => {
        return key.toLowerCase() === 'content-type';
      });

      const contentType = contentTypeHeader ? contentTypeHeader[1].split(';')[0] : undefined;

      if (contentType === 'text/html') {
        mode = 'htmlmixed';
        prettifiedResponse = this.response.body;
      } else if (contentType === 'application/json') {
        mode = 'application/json';
        // Convert JSON body to a human readable form with 2 spaces indentation
        prettifiedResponse = JSON.stringify(JSON.parse(this.response.body), null, 2);
      }
    }

    const gvCodeOptions = {
      lineNumbers: true,
      mode: mode,
    };

    return html`
      ${this._renderResponseHeader()}
      <div class="response-headers">Headers</div>
      <div class="response-headers-content">
        ${repeat(Object.keys(this.response.headers), (key) => {
          return html`<div><code>${key}: ${this.response.headers[key]}</code></div>`;
        })}
      </div>
      <div class="response-body">Body</div>
      <div class="code-container">
        <gv-code .value="${prettifiedResponse}" .options="${gvCodeOptions}" readonly></gv-code>
      </div>
    `;
  }

  _renderResponseHeader() {
    const successfulRequest = 200 <= this.response.statusCode && this.response.statusCode < 300;
    const errorRequest = 400 <= this.response.statusCode && this.response.statusCode < 600;

    return html`<div class="top-bar">
      <div class="response-row-item">Response</div>
      ${this.method ? html` <div class="response-row-item-method">${this.method}</div>` : ''}
      ${this.path ? html` <div class="response-row-item">${this.path}</div>` : ''}
      ${this.response.statusCode
        ? html` <div class="response-row-item">
            <gv-state ?success="${successfulRequest}" ?error="${errorRequest}">
              ${this.response.statusCode} - ${statusCode[this.response.statusCode].description}
            </gv-state>
          </div>`
        : ''}
    </div> `;
  }

  static get styles() {
    return [
      empty,
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          height: 100%;
          width: 100%;
          display: block;
        }

        .container {
          display: flex;
          flex-direction: row;
          height: 100%;
        }

        .request {
          width: 40%;
          height: 100%;
        }

        .request-form {
          padding: 8px;
          display: flex;
          flex-direction: column;
        }

        .request-form-button {
          margin-top: 16px;
        }

        .response {
          border-left: 1px solid #d9d9d9;
          border-right: 1px solid #d9d9d9;
          height: 100%;
          width: 60%;
          overflow: hidden;
        }

        .top-bar {
          background-color: #f5f5f5;
        }

        .response-row-item {
          margin-right: 16px;
        }

        .response-row-item-method {
          margin-right: 4px;
          font-weight: bold;
        }

        .status-code,
        .top-bar,
        .response-headers,
        .response-body {
          font-size: 16px;
          height: 40px;
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 0 16px;
          border-bottom: 1px solid #d9d9d9;
        }

        .response-headers-content {
          padding: 16px;
          border-bottom: 1px solid #d9d9d9;
          max-height: 40%;
        }

        .loading,
        .empty-response {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          font-size: 16px;
        }

        .loading-icon,
        .empty-response-icon {
          --gv-icon--s: 128px;
          --gv-icon--c: var(--gv-theme-color-dark);
        }

        .code-container {
          height: 100%;
          overflow: auto;
        }
      `,
    ];
  }
}

window.customElements.define('gv-http-client', GvHttpClient);
