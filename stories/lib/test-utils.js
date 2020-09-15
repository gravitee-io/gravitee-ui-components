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
export class Page {

  constructor (tagName = 'div') {
    this._id = 'page-container';
    if (querySelector(`#${this._id}`) != null) {
      throw new Error('Cannot instantiate another page...');
    }
    else {
      this._element = window.document.createElement(tagName);
      this._element.id = this._id;
      window.document.body.appendChild(this._element);
    }

  }

  create (componentTagName, props = {}) {
    const element = window.document.createElement(componentTagName);

    for (const [key, value] of Object.entries(props)) {
      element[key] = value;
    }

    this._element.appendChild(element);
    return element;
  }

  clear () {
    window.document.body.removeChild(this._element);
  }

  addEventListener (type, listener) {
    this._element.addEventListener(type, listener);
  }

}

export function querySelector (selectors) {
  return window.document.querySelector(selectors);
}
