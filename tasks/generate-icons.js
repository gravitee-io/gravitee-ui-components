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
const del = require('del');
const fs = require('fs-extra');
const rawGlob = require('glob');
const util = require('util');
const SVGO = require('svgo');
const pascalCase = require('pascal-case');

const glob = util.promisify(rawGlob);
const svgo = new SVGO({ plugins: [{ removeXMLNS: true }, { removeDimensions: true }, { removeAttrs: { attrs: ['svg:fill:none', 'path:fill:none'] } }] });
// {attrs: 'fill:none|stroke|fill-rule|clip-rule|width|height'}
const iconsByShape = {};

async function run () {
  const svgFilepaths = await glob('assets/icons/**/*.svg');

  for (const src of svgFilepaths) {
    const relativePath = src.replace('assets/icons/', '');
    const [category, filename] = relativePath.split('/');

    console.log(`Parse ${src}`);
    iconsByShape[category] = iconsByShape[category] || {};
    const id = filename.replace('.svg', '').toLowerCase();
    const code = await fs.readFile(src, 'utf8');
    iconsByShape[category][id] = await svgo.optimize(code).then((optimizeCode) => optimizeCode.data.replace('<svg>', '').replace('</svg>', ''));
  }

  iconsByShape.thirdparty.google = iconsByShape.thirdparty.google.replace('svg', 'svg class="no-color"');
  iconsByShape.thirdparty.graviteeio_am = iconsByShape.thirdparty.graviteeio_am.replace('svg', 'svg class="no-color"');

  const filepath = 'stories/lib/icons.generated.js';
  await del('src/icons/shapes');
  await fs.mkdir('src/icons/shapes', { recursive: true });
  await fs.writeFile(filepath, `import '../../src/atoms/gv-icon.js';

export function generateIcons() {
    return \``);
  for (const [shapeId, icons] of Object.entries(iconsByShape)) {
    const shapeName = pascalCase(`${shapeId}Shapes`);
    console.log(`Generate ${shapeName}`);
    await fs.writeFile(`src/icons/shapes/${shapeId}.js`,
      `export const ${shapeName} = ${JSON.stringify(icons)};
window.GvIcons = window.GvIcons || {};
window.GvIcons['${shapeId}'] = ${shapeName};
`);

    // Generate tmp file for stories
    await fs.appendFile(filepath, `<div class="title" data-shape="${shapeId}">${shapeId}</div>\n<div class="collection">`);
    for (const icon of Object.keys(icons)) {
      await fs.appendFile(filepath,
        `<div class="item" data-shape="${shapeId}:${icon}"><gv-icon shape="${shapeId}:${icon}" size="48"></gv-icon><span>${shapeId}:${icon}</span></div>\n`);
    }
    await fs.appendFile(filepath, `</div>`);
  }
  await fs.appendFile(filepath, `\`\n};`);
}

run()
  .then(console.log)
  .catch(console.error);
