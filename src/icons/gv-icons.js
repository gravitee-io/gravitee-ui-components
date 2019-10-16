import './shapes/general-shapes'

export class GvIcons {

  static getIcon(name) {

    const [shape, icon] = name.split(':');
    if (window.GvIcons[shape]) {
      if (window.GvIcons[shape][icon]) {
        return window.GvIcons[shape][icon];
      }
      console.error(`Cannot find icon "${icon}" in shape "${shape}". Show Gravitee.io Components documentation.`);
    } else {
      console.error(`Cannot find shape "${shape}". Show Gravitee.io Components documentation.`);
    }
    return '?';
  }

}
