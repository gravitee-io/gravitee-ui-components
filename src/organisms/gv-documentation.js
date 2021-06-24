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
import { classMap } from 'lit-html/directives/class-map';

/**
 *  Documentation component
 *
 * ⚠️ This component is based on `asciidoctor`, `highlight.js` and `asciidoctor-highlight.js`.
 * To use this component in your project be sure the dependencies are installed or
 * install them with: `npm install asciidoctor highlight.js asciidoctor-highlight.js --save`
 *
 * @attr {String} type - Type of content
 * @attr {String} title - Title used in header
 * @attr {String} image - Image or icon to display in header
 * @attr {Boolean} disabled - true if component is disabled
 * @attr {Boolean} without-header - true if component should not have header with title and actions
 */
export class GvDocumentation extends LitElement {
  static get properties() {
    return {
      type: { type: String },
      image: { type: String },
      title: { type: String },
      disabled: { type: Boolean },
      withoutHeader: { type: Boolean, attribute: 'without-header' },
      _cssLoaded: { type: Boolean, attribute: false },
      _contentReady: { type: Boolean, attribute: false },
      _content: { type: String, attribute: false },
    };
  }

  static get styles() {
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
          border-bottom: 1px solid #d9d9d9;
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
          color: #28444f;
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

        .container {
          flex-grow: 1;

          display: flex;
          flex-direction: column;

          /* for Firefox */
          min-height: 0;
          height: 100%;
        }

        .box {
          background: white;
          display: none;
          flex-grow: 1;

          overflow: auto;

          /* for Firefox */
          min-height: 0;
          padding: 0.5rem;
        }

        /* Hack for long string */
        .hljs-string {
          white-space: pre-wrap;
        }

        .empty,
        .doc-content {
          display: none;
        }

        .show {
          display: block;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.type = 'adoc';
    this._contentReady = false;
    this._cssLoaded = false;
    this._empty = true;
  }

  _onCloseDocumentation() {
    dispatchCustomEvent(this, 'close');
  }

  _renderIcon() {
    if (this.image) {
      return html`<gv-image src="${this.image}"></gv-image>`;
    }
    return html`<gv-icon shape="code:question"></gv-icon>`;
  }

  isNativeContent() {
    return !['adoc'].includes(this.type);
  }

  _onLoad() {
    this._cssLoaded = true;
  }

  async _onContentChange(event) {
    if (this.type === 'adoc') {
      const slot = event.target;
      const nodes = slot.assignedNodes();
      if (nodes.length > 0) {
        const dom = await toDom(nodes[0].innerHTML, this.type, true, false);
        if (dom) {
          const title = dom.element.querySelector('h1');
          if (title && !this.withoutHeader) {
            title.remove();
            this.title = dom.title;
          }
          dom.element.querySelectorAll('a').forEach((link) => (link.target = '_blank'));
          this._content = dom.element;
          this._empty = false;
          this._contentReady = true;
        }
      }
    } else {
      this._empty = false;
      this._contentReady = true;
    }
  }

  render() {
    return html`<link @load="${this._onLoad}" rel="stylesheet" href="css/documentation.css" />
      <div class="container">
        ${this.withoutHeader
          ? html``
          : html`<div class="header">
              <div class="left">
                ${this.disabled
                  ? html``
                  : html`<gv-button
                      icon="general:close"
                      outlined
                      small
                      @gv-button:click="${this._onCloseDocumentation}"
                      title="Close"
                    ></gv-button>`}
              </div>
              <div class="title">${this.title}</div>
              <div class="right">${this._renderIcon()}</div>
            </div>`}
        <div class="${classMap({ box: true, show: this._cssLoaded })}">
          <slot
            name="content"
            class="${classMap({
              'doc-content': true,
              show: this.isNativeContent(),
            })}"
            @slotchange="${this._onContentChange.bind(this)}"
          ></slot>
          ${!this.isNativeContent() ? this._content : ''}
          <slot name="empty" class="${classMap({ empty: true, show: this._empty })}">
            <div>Sorry,the documentation was not found.</div>
            <div>See the documentation about plugins.</div>
          </slot>
        </div>
      </div> `;
  }
}

window.customElements.define('gv-documentation', GvDocumentation);
