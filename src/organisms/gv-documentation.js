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
import { dispatchCustomEvent } from '../lib/events';
import { toDom } from '../lib/text-format';
import { empty } from '../styles/empty';

export class GvDocumentation extends LitElement {

  static get properties () {
    return {
      text: { type: String },
      type: { type: String },
      image: { type: String },
      _dom: { type: Object, attribute: false },
    };
  }

  static get styles () {
    return [
      empty,
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          position: relative;
        }

        .header {
          display: flex;
          border-bottom: 1px solid #D9D9D9;
          box-sizing: border-box;
          min-height: 45px;
          --gv-icon--s: 26px;
          align-items: center;
          padding: 0 1rem;
          position: relative;
        }

        .header .left,
        .header .right {
          display: flex;
          flex: 1;
          z-index: 10;
        }

        .header .right {
          justify-content: flex-end;
        }

        .header .title {
          color: #28444F;
          font-size: 18px;
          display: flex;
          position: absolute;
          text-transform: uppercase;
          letter-spacing: 0.2rem;
          justify-content: center;
          width: 100%;
          top: 0;
          left: 0;
          bottom: 0;
          align-items: center;
          text-transform: capitalize;
        }

        .header gv-image {
          height: 35px;
          width: 35px;
        }

        .documentation-content {
          padding: 0.5rem 1rem;
        }

        .container {
          flex-grow: 1;

          display: flex;
          flex-direction: column;

          /* for Firefox */
          min-height: 0;
          height: 100%;
        }

        .content {
          background: white;
          flex-grow: 1;

          overflow: auto;

          /* for Firefox */
          min-height: 0;
          padding: 0.5rem;
        }
      `,
    ];
  }

  constructor () {
    super();
    this.type = 'adoc';
  }

  _onCloseDocumentation () {
    dispatchCustomEvent(this, 'close');
  }

  _renderIcon () {
    if (this.image) {
      return html`<gv-image src="${this.image}"></gv-image>`;
    }
    return html`<gv-icon shape="code:question"></gv-icon>`;
  }

  async updated (props) {
    if (props.has('text')) {
      this._dom = await toDom(this.text, this.type, true);
      const title = this._dom.element.querySelector('h1');
      if (title) {
        this._dom.element.querySelector('h1').remove();
      }
    }
  }

  render () {
    let title = '';
    let content;
    if (this._dom) {
      title = this._dom.title;
      content = this._dom.element;
    }
    else {
      content = html`<div class="empty"><div>Sorry, the documentation was not found. </div><div>See the documentation about plugins.</div></div>`;
    }
    return html`<link rel="stylesheet" href="css/documentation.css">
                  <div class="container">  
                    <div class="header">
                      <div class="title">${title}</div>
                        <div class="left">
                          <gv-button icon="general:close" outlined small @gv-button:click="${this._onCloseDocumentation}" title="Close"></gv-button>
                        </div>
                        <div class="right">
                          ${this._renderIcon()}
                        </div>
                      </div>
                      <div class="content">
                        ${content}
                      </div>
                    </div>
                  </div>
                  `;
  }

}

window.customElements.define('gv-documentation', GvDocumentation);
