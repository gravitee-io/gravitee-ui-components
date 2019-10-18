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
      const color = getCssVar(element, 'gv-icon');
      if (color) {
        icon = icon.replace(/fill="#000"/g, `fill="${color}"`);
      }
      icon = icon.replace(/<svg/, `<svg width="${size}" height="${size}"`);
    }
    return new TemplateResult([icon], [], 'html');
  }

}
