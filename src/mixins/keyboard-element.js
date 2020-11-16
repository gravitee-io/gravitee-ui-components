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
export const KEYS = {
  ArrowDown: '40',
  ArrowLeft: '37',
  ArrowRight: '39',
  ArrowUp: '38',
  Ctrl: '17',
  Esc: '27',
  Shift: '16',
  Space: '32',
};

export function KeyboardElement (ParentClass) {

  /**
   * @mixinClass
   */
  return class extends ParentClass {

    constructor () {
      super();
      this._controller = {};
      this._handleKeyDown = this._onKeyDown.bind(this);
      this._handleKeyUp = this._onKeyUp.bind(this);
    }

    connectedCallback () {
      super.connectedCallback();
      window.addEventListener('keydown', this._handleKeyDown);
      window.addEventListener('keyup', this._handleKeyUp);
    }

    disconnectedCallback () {
      window.removeEventListener('keydown', this._handleKeyDown);
      window.removeEventListener('keyup', this._handleKeyUp);
      super.disconnectedCallback();
    }

    _onKeyDown (e) {
      this._controller[e.keyCode] = true;
      this.onKeyboard(this._controller);
    }

    _onKeyUp (e) {
      if (this._controller[e.keyCode]) {
        this._controller[e.keyCode] = null;
      }
    }

    isPressed (...keys) {
      return keys.find((key) => (this._controller[key] == null)) == null;
    }

    // abstract
    onKeyboard (controller) {

    }

  };

}
