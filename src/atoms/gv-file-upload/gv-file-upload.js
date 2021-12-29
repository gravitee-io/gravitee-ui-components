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
import { link } from '../../styles/link';
import { dispatchCustomEvent } from '../../lib/events';
import { ifDefined } from 'lit/directives/if-defined';
import { i18n } from '../../lib/i18n';
import { classMap } from 'lit/directives/class-map';

/**
 * File upload
 *
 * ## Details
 * * has @theme facet
 *
 * @fires gv-file-upload:drop - Custom event when user drop file
 *
 * @attr {String} label - Label
 * @attr {String} accept - One or more file type identifiers describing the authorized file types.
 * @attr {String} except - One or more file type identifiers describing unauthorized file types.
 * @attr {Number} limit - Max size limit in bytes.
 * @attr {String} value - Reflected value of uploaded file
 **/
export class GvFileUpload extends LitElement {
  static get properties() {
    return {
      label: { type: String },
      accept: { type: String },
      except: { type: String },
      limit: { type: Number },
      value: { type: Array, reflect: true },
      _preview: { type: String, attribute: false },
      _files: { type: Array, attribute: false },
      _errors: { type: Array, attribute: false },
    };
  }

  static get styles() {
    return [
      link,
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          display: block;
          width: 100%;
          color: var(--gv-theme-color-dark, #28444f);
        }

        .box {
          font-size: 1.25rem;
          background-color: var(--gv-theme-neutral-color-lighter, #fafafa);
          position: relative;
          padding: 2rem;
          text-align: center;
          display: block;
          border: 1px dashed #28444f;
          border-radius: 4px;
          transition: outline-offset 0.15s ease-in-out, background-color 0.15s linear;
          height: 100%;
        }

        .box .box__icon {
          width: 100%;
          height: 80px;
          display: block;
          margin-bottom: 40px;
          --gv-icon--s: 5rem;
          --gv-icon--c: var(--gv-theme-color-dark, #28444f);
        }

        .box__file {
          width: 0.1px;
          height: 0.1px;
          opacity: 0;
          overflow: hidden;
          position: absolute;
          z-index: -1;
        }

        .box__file + label {
          max-width: 80%;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
          display: inline-block;
          overflow: hidden;
        }

        .box.is-dragover {
          background-color: var(--gv-theme-color-light, #28444f);
          border: none;
          outline: 1px dashed #28444f;
          outline-offset: -10px;
        }

        .box .box__dragndrop {
          display: inline;
        }

        .files {
          box-sizing: border-box;
          display: flex;
          align-items: center;
          --gv-icon--s: 16px;
          padding: 1rem 0.5rem 0;
        }

        .filename {
          flex: 1;
          padding: 0.2rem;
          word-break: break-all;
        }

        .error {
          font-style: italic;
          --gv-icon--c: red;
        }

        gv-image {
          position: absolute;
        }

        .preview {
          transition: all 300ms ease-in-out;
        }

        .box__input {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;
          z-index: 10;
        }

        .preview .box__input {
          visibility: hidden;
        }

        .preview:hover .box__input {
          visibility: visible;
        }

        .preview:hover gv-image {
          opacity: 0.3;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.reader = new FileReader();
    this._files = [];
    this._errors = [];
    this._counter = 0;
  }

  _onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    this._counter++;
    const box = this.shadowRoot.querySelector('.box');
    box.classList.add('is-dragover');
  }

  _onDragEnd(e) {
    e.preventDefault();
    e.stopPropagation();
    if (--this._counter === 0) {
      const box = this.shadowRoot.querySelector('.box');
      box.classList.remove('is-dragover');
    }
  }

  _onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setFiles(e.dataTransfer.files);
  }

  _getRegex(mimeTypes) {
    return `(${mimeTypes.toString().replace(' ', '').replace(/,/g, '.+|').replace(/\*/g, '.+').replace('.+.+', '.+')})`;
  }

  setFiles(files) {
    const errors = [];
    this._files = [...files].filter((file) => {
      if (this.accept && file.type.match(this._getRegex(this.accept)) == null) {
        errors.push({ file, error: i18n('gv-file-upload.error.typeNotAllowed') });
        return false;
      }

      if (this.except && file.type.match(this._getRegex(this.except)) != null) {
        errors.push({ file, error: i18n('gv-file-upload.error.typeNotAllowed') });
        return false;
      }
      if (this.limit && file.size > parseInt(this.limit, 10)) {
        errors.push({ file, error: i18n('gv-file-upload.error.maxSize') });
        return false;
      }
      return true;
    });
    this._errors = errors;
    if (this._errors.length > 0) {
      dispatchCustomEvent(this, 'error', { errors: this._errors });
      this.dispatchEvent(new Event('invalid', { bubbles: true, cancelable: true }));
    }
    const box = this.shadowRoot.querySelector('.box');
    box.classList.remove('is-dragover');
    if (this._files.length > 0) {
      this.reader.readAsDataURL(this._files[0]);
      this.reader.onload = (event) => {
        if (this._files[0].type.match(this._getRegex('image/*'))) {
          this._preview = event.target.result;
        } else {
          this._preview = null;
        }
        this.value = event.target.result;
        this.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        dispatchCustomEvent(this, 'drop', { files: [this.value] });
      };
    }
  }

  _cancelEvent(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  _removeFile() {
    this._errors = [];
    this._files = [];
    this._preview = null;
    this.value = null;
    this.shadowRoot.querySelector('#file').value = null;
    this.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
  }

  _onChange(e) {
    this.setFiles(e.target.files);
  }

  get icon() {
    if (this._files.length > 0) {
      return 'general:clip';
    }
    return 'general:upload';
  }

  render() {
    const label =
      this._errors.length > 0 || this._files.length > 0 ? i18n('gv-file-upload.chooseAnotherFile') : i18n('gv-file-upload.chooseFile');

    const classes = {
      box: true,
      preview: this._preview != null,
    };

    return html`
      <label for="file">${this.label}</label>
      <div
        class="${classMap(classes)}"
        @drop="${this._onDrop}"
        @ondrop="${this._onDrop}"
        @drag="${this._cancelEvent}"
        @dragstart="${this._cancelEvent}"
        @dragover="${this._onDragOver}"
        @dragenter="${this._onDragOver}"
        @dragleave="${this._onDragEnd}"
        @dragend="${this._onDragEnd}"
      >
        ${this._preview != null ? html`<gv-image .src="${this._preview}" @error="${this._onPreviewError}"></gv-image>` : ''}
        <div class="box__input">
          <gv-icon class="box__icon" shape="${this.icon}"></gv-icon>
          <label for="file" class="link">
            <strong>${label}</strong>
            <span class="box__dragndrop">${i18n('gv-file-upload.orDragIt')}</span>
          </label>
          <input
            class="box__file"
            type="file"
            name="files[]"
            id="file"
            files="${this.files}"
            accept="${ifDefined(this.accept)}"
            @change="${this._onChange}"
          />
        </div>
      </div>
      ${this._files.length > 0
        ? html`
            <div class="files">
              <gv-icon shape="general:clip"></gv-icon>
              <div class="filename">${this._files[0].name}</div>
              <gv-icon class="link" @click="${this._removeFile.bind(this, 0)}" shape="general:trash"></gv-icon>
            </div>
          `
        : ''}
      ${this._errors.length > 0
        ? html`
            <div class="files">
              <gv-icon class="error" shape="code:stop"></gv-icon>
              <div class="filename">${this._errors[0].file.name} <span class="error">(${this._errors[0].error})</span></div>
            </div>
          `
        : ''}
      ${this.value && this._files.length === 0 && this._errors.length === 0
        ? html`
            <div class="files">
              <div class="filename"></div>
              <gv-button link @click="${this._removeFile.bind(this, 0)}">${i18n('gv-file-upload.removePicture')}</gv-button>
            </div>
          `
        : ''}
    `;
  }

  _onPreviewError() {
    this.value = null;
  }

  updated(changedProperties) {
    if (changedProperties.has('value')) {
      if (this.value) {
        this._preview = this.value;
        if (this._files && this._files[0]) {
          this.reader.readAsDataURL(this._files[0]);
          this.reader.onload = (event) => {
            if (this.value !== event.target.result) {
              this._files = [];
            }
          };
        }
      } else {
        this._preview = null;
        this._files = [];
      }
    }

    const preview = this.shadowRoot.querySelector('.preview');
    if (preview) {
      const { width, height } = preview.getBoundingClientRect();
      const img = this.shadowRoot.querySelector('gv-image');
      img.style.width = width - 20 + 'px';
      img.style.height = height - 20 + 'px';
      img.style.left = '10px';
      img.style.top = '10px';
    }
  }
}

window.customElements.define('gv-file-upload', GvFileUpload);
