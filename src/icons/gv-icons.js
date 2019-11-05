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
import './shapes/general-shapes';
import { getCssVar } from '../lib/style';
import { TemplateResult } from 'lit-html';

export class GvIcons {

  static _getIcon (name) {
    const [shape, icon] = name.split(':');
    if (window.GvIcons[shape]) {
      if (window.GvIcons[shape][icon]) {
        return window.GvIcons[shape][icon];
      }
      console.error(`Cannot find icon "${icon}" in shape "${shape}". Show Gravitee.io Components documentation.`);
    }
    else {
      console.error(`Cannot find shape "${shape}". Show Gravitee.io Components documentation.`);
    }
    return '?';
  }

  static getIcon (name, size, element) {
    let icon = this._getIcon(name);
    if (element) {
      const color = getCssVar(element, 'gv-icon--c');
      if (color) {
        icon = icon.replace(/fill="#000"/g, `fill="${color}"`);
      }
    }
    icon = icon.replace(/<svg/, `<svg width="${size}" height="${size}"`);
    return new TemplateResult([icon], [], 'html');
  }

}
