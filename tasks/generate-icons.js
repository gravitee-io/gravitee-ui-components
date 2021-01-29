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
const svgo = new SVGO({
  plugins: [{ removeXMLNS: true }, { removeDimensions: true }, { removeAttrs: { attrs: ['svg:fill:none', 'path:fill:none'] } }],
});
// {attrs: 'fill:none|stroke|fill-rule|clip-rule|width|height'}
const iconsByShape = {};

async function run() {
  const svgFilepaths = await glob('assets/icons/**/*.svg');

  for (const src of svgFilepaths) {
    const relativePath = src.replace('assets/icons/', '');
    const [category, filename] = relativePath.split('/');
    // eslint-disable-next-line no-console
    console.log(`Parse ${src}`);
    iconsByShape[category] = iconsByShape[category] || {};
    const id = filename.replace('.svg', '').toLowerCase();
    const code = await fs.readFile(src, 'utf8');
    iconsByShape[category][id] = await svgo
      .optimize(code)
      .then((optimizeCode) => optimizeCode.data.replace('<svg>', '').replace('</svg>', ''));
  }

  iconsByShape.thirdparty.google = iconsByShape.thirdparty.google.replace('svg', 'svg class="no-color"');
  iconsByShape.thirdparty.graviteeio_am = iconsByShape.thirdparty.graviteeio_am.replace('svg', 'svg class="no-color"');
  iconsByShape.thirdparty.http = iconsByShape.thirdparty.http.replace('svg', 'svg class="no-color"');
  iconsByShape.thirdparty.jdbc = iconsByShape.thirdparty.jdbc.replace('svg', 'svg class="no-color"');
  iconsByShape.thirdparty.microsoft = iconsByShape.thirdparty.microsoft.replace('svg', 'svg class="no-color"');
  iconsByShape.thirdparty.mongodb = iconsByShape.thirdparty.mongodb.replace('svg', 'svg class="no-color"');

  await del('src/icons/shapes');
  await fs.mkdir('src/icons/shapes', { recursive: true });

  // Generate shapes
  for (const [shapeId, icons] of Object.entries(iconsByShape)) {
    const shapeName = pascalCase(`${shapeId}Shapes`);
    // eslint-disable-next-line no-console
    console.log(`Generate ${shapeName}`);
    await fs.writeFile(
      `src/icons/shapes/${shapeId}.js`,
      `export const ${shapeName} = ${JSON.stringify(icons)};
window.GvIcons = window.GvIcons || {};
window.GvIcons['${shapeId}'] = ${shapeName};
`,
    );
  }

  // Generate icons.json
  const icons = Object.entries(iconsByShape)
    .sort(([shapeId]) => (shapeId === 'general' ? -1 : 0))
    .map(([shapeId, iconsByShape]) => Object.keys(iconsByShape).map((icon) => `${shapeId}:${icon}`));

  await fs.writeFile('.docs/icons.json', JSON.stringify({ icons: [].concat(...icons) }));
}

run()
  // eslint-disable-next-line no-console
  .then(console.log)
  .catch(console.error);
