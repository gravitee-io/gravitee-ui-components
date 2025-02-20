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
const fs = require('fs-extra');
const rawGlob = require('glob');
const util = require('util');
const { optimize, extendDefaultPlugins } = require('svgo');
const svgstore = require('svgstore');

const glob = util.promisify(rawGlob);
const svgoConfig = {
  plugins: extendDefaultPlugins([
    'removeXMLNS',
    'removeDimensions',
    {
      name: 'removeAttrs',
      params: {
        attrs: '(svg|path|rect):fill:.*',
      },
    },
  ]),
};

const svgoThirdPartyConfig = {
  plugins: extendDefaultPlugins(['removeXMLNS', 'removeDimensions']),
};
const iconsByShape = {};

async function run() {
  const svgFilepaths = await glob('.files/icons/**/*.svg');
  for (const src of svgFilepaths) {
    const relativePath = src.replace('.files/icons/', '');
    const [category, filename] = relativePath.split('/');
    // eslint-disable-next-line no-console
    console.log(`Parse ${src}`);
    iconsByShape[category] = iconsByShape[category] || {};
    const id = filename.replace('.svg', '').toLowerCase();
    const code = await fs.readFile(src, 'utf8');
    const svgOptimized = optimize(code, category === 'thirdparty' ? svgoThirdPartyConfig : svgoConfig);
    const svgContent = svgOptimized.data.replace('opacity=', 'style="fill: var(--opacity, #fff)" opacity=');
    iconsByShape[category][id] = svgContent;
  }

  await fs.rm('assets/icons', { recursive: true, force: true });
  await fs.mkdir('assets/icons', { recursive: true });
  // Generate shapes
  for (const [shapeId, icons] of Object.entries(iconsByShape)) {
    // eslint-disable-next-line no-console
    console.log(`Generate ${shapeId}`);
    const store = svgstore();
    for (const iconId in icons) {
      store.add(iconId, icons[iconId]);
    }
    await fs.writeFile(`assets/icons/${shapeId}.svg`, store);
  }
}

run()
  // eslint-disable-next-line no-console
  .then(console.log)
  .catch(console.error);
