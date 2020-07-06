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
import { css, LitElement } from 'lit-element';
import { html } from 'lit-html';

/**
 * Resizable views component
 *
 * @slot top - The top content
 * @slot bottom - The bottom content
 */
export class GvResizableViews extends LitElement {

  static get styles () {
    return [
      // language=css
      css`
        .box {
          display: flex;
          height: 100%;
          flex: 1 1 0;
          flex-direction: column;
        }

        * {
          box-sizing: border-box;
        }

        ::slotted(*) {
          display: inline-block;
          width: 100%;
        }

        ::slotted([slot="bottom"]) {
        }

        .bottom {
          display: flex;
          flex-grow: 1;
        }

        .left {
          width: 70%;
        }

        .left, .right {
          padding: 0.2rem;
          overflow: auto;
        }

        .top, .bottom {
          border-left: 1px solid #BFBFBF;
          border-right: 1px solid #BFBFBF;
        }

        .transition .top, .transition .bottom {
          transition: height 350ms ease-in-out;
        }

        .top {
          overflow-y: auto;
          overflow-x: hidden;
          height: 50%;
        }

        .bottom {
          overflow-y: auto;
          overflow-x: hidden;
          height: 50%;
        }

        .resizer {
          z-index: 10;
          background-color: #D9D9D9;
          --gv-icon--s: 20px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          --gv-icon--c: #28444F;
        }

        .resizer > gv-icon {
          margin-right: 8px;
        }

        .resizer[data-direction="vertical"] {
          cursor: ns-resize;
          height: 2px;
          width: 100%;
        }

        .resizer[data-direction="horizontal"] {
          cursor: ew-resize;
          height: 100%;
          width: 2px;
        }

        .actions {
          margin-top: -22px;
          margin-right: 15px;
          padding: 0 0.2rem;
          border-radius: 4px 4px 0 0;
          background-color: #D9D9D9;
        }

        .actions gv-button {
          margin: 0.2rem 0.1rem;
          visibility: hidden;
          opacity: 0;
          display: none;
          transition: all 250ms ease-in-out;
        }

        .actions:focus-within,
        .actions:hover {
          padding: 0.2rem;
          margin-top: -66px;
        }

        .actions:focus-within gv-button,
        .actions:hover gv-button {
          display: block;
          opacity: 1;
          visibility: visible;
        }

        .actions:focus-within gv-icon,
        .actions:hover gv-icon {
          display: none;
          opacity: 0;
          visibility: hidden;
        }

      `,
    ];
  }

  static get properties () {
    return {};
  }

  split () {
    this.resize('top', '50%');
    this.resize('bottom', '50%');
  }

  maximizeTop () {
    this.resize();
    this.resize('top', '90%');
  }

  maximizeBottom () {
    this.resize('bottom', '80%');
    this.resize('top', '20%');
  }

  resize (zone = 'bottom', height = '10%') {
    this.shadowRoot.querySelector(`.${zone}`).style.height = height;
  }

  resizable (resizer) {
    const direction = resizer.getAttribute('data-direction') || 'horizontal';
    const prevSibling = resizer.previousElementSibling;
    const nextSibling = resizer.nextElementSibling;

    // The current position of mouse
    let x = 0;
    let y = 0;
    let prevSiblingHeight = 0;
    let prevSiblingWidth = 0;
    const shadowRoot = this.shadowRoot;

    // Handle the mousedown event
    // that's triggered when user drags the resizer
    const mouseDownHandler = function (e) {
      if (!e.target.classList.contains('action')) {
        // Get the current mouse position
        shadowRoot.querySelector('.box').classList.remove('transition');
        x = e.clientX;
        y = e.clientY;
        const rect = prevSibling.getBoundingClientRect();
        prevSiblingHeight = rect.height;
        prevSiblingWidth = rect.width;

        // Attach the listeners to `document`
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
      }
    };

    const mouseMoveHandler = function (e) {
      // How far the mouse has been moved
      const dx = e.clientX - x;
      const dy = e.clientY - y;

      switch (direction) {
        case 'vertical':
          prevSibling.style.height = `${(prevSiblingHeight + dy) * 100 / resizer.parentNode.getBoundingClientRect().height}%`;
          nextSibling.style.height = `${100 - (prevSiblingHeight + dy) * 100 / resizer.parentNode.getBoundingClientRect().height}%`;
          break;
        case 'horizontal':
        default:
          prevSibling.style.width = `${(prevSiblingWidth + dx) * 100 / resizer.parentNode.getBoundingClientRect().width}%`;
          break;
      }

      const cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
      resizer.style.cursor = cursor;
      document.body.style.cursor = cursor;

      prevSibling.style.userSelect = 'none';
      prevSibling.style.pointerEvents = 'none';

      nextSibling.style.userSelect = 'none';
      nextSibling.style.pointerEvents = 'none';
    };

    const mouseUpHandler = function () {
      resizer.style.removeProperty('cursor');
      document.body.style.removeProperty('cursor');

      prevSibling.style.removeProperty('user-select');
      prevSibling.style.removeProperty('pointer-events');

      nextSibling.style.removeProperty('user-select');
      nextSibling.style.removeProperty('pointer-events');

      // Remove the handlers of `mousemove` and `mouseup`
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);

      shadowRoot.querySelector('.box').classList.add('transition');
    };

    // Attach the handler
    resizer.addEventListener('mousedown', mouseDownHandler);
  };

  firstUpdated () {
    this.shadowRoot.querySelectorAll('.resizer').forEach((elt) => this.resizable(elt));
  }

  render () {
    return html`
    <div class="box transition">
      <div class="top"><slot name="top"></slot></div>
      <div class="resizer" data-direction="vertical">
        <gv-icon shape="design:horizontal"></gv-icon>
        <div class="actions">
          <gv-icon shape="layout:layout-right-panel-2"></gv-icon>
          <gv-button small link class="action" icon="layout:layout-bottom-panel" title="Maximize top" @gv-button:click="${this.maximizeTop}"></gv-button>
          <gv-button small link class="action" icon="layout:layout-horizontal-2" title="Split screen" @gv-button:click="${this.split}"></gv-button>
          <gv-button small link class="action" icon="layout:layout-top-panel-6" title="Maximize bottom" @gv-button:click="${this.maximizeBottom}"></gv-button>
        </div>
      </div>
      <div class="bottom"><slot name="bottom"></slot></div>
    </div>
    `;
  }
}

window.customElements.define('gv-resizable-views', GvResizableViews);
