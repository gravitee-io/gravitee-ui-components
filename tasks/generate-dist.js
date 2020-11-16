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
const babel = require('@babel/core');
const del = require('del');
const fs = require('fs-extra');
const path = require('path');
const rawGlob = require('glob');
const Terser = require('terser');
const util = require('util');
const pascalCase = require('pascal-case');

const glob = util.promisify(rawGlob);

// Minify HTML inside lit-html and LitElement html`` templates
// Minify CSS inside LitElement css`` templates
function minifyHtmlCss (code, sourceFileName) {
  return babel.transformSync(code, {
    sourceFileName,
    // Put sourcemap in the file to simplify further manipulation
    sourceMaps: 'inline',
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      [
        'template-html-minifier',
        {
          modules: {
            'lit-html': ['html'],
            'lit-element': [
              'html',
              { name: 'css', encapsulation: 'style' },
            ],
          },
          strictCSS: true,
          htmlMinifier: {
            collapseWhitespace: true,
            conservativeCollapse: true,
            removeComments: true,
            caseSensitive: true,
            minifyCSS: true,
          },
        },
      ],
    ],
  });
}

function minifyJs (code, sourceMapUrl) {
  return Terser.minify(code, {
    module: true,
    toplevel: true,
    sourceMap: {
      content: 'inline',
      url: sourceMapUrl,
    },
  });
};

async function run () {

  await del('dist/**/*');

  const sourceFilepaths = await glob('./src/**/*.js');

  const filepaths = sourceFilepaths.map((src) => {
    // this seems to get better integration in browsers
    const sourceMapFilename = src.replace('/src/', '/node_modules/@gravitee/ui-components/');
    const dst = src.replace('/src/', '/dist/src/');
    const sourceMapUrl = path.parse(dst).base + '.map';
    return { src, sourceMapFilename, dst, sourceMapUrl };
  });

  for (const { src, sourceMapFilename, dst, sourceMapUrl } of filepaths) {
    await fs.readFile(src, 'utf8')
      .then((code) => minifyHtmlCss(code, sourceMapFilename))
      .then(({ code }) => minifyJs(code, sourceMapUrl))
      .then(async ({ code, map }) => {
        await fs.outputFile(dst, code);
        await fs.outputFile(dst + '.map', map);
      });
  }

  const sourceIndex = './src/index.js';
  await del(sourceIndex);

  const componentPaths = await glob('./src/**/gv-*.js');
  await del('wc/gv-*.js');
  for (const src of componentPaths) {
    const filePath = './wc/' + path.basename(src);
    const dst = src.replace('/src/', './src/');
    await fs.outputFile(filePath, `import '${dst.replace('.js', '')}';`);
    const _path = src.replace('src/', '').replace('.js', '');
    const name = pascalCase(_path.split('/').pop());
    await fs.appendFile(sourceIndex, `export { ${name} } from '${_path}';\n`);
  }

  fs.copy('wc', 'dist/wc');
  fs.copy('assets/css', 'dist/assets/css');
  fs.copy('assets/images', 'dist/assets/images');
  fs.copy('assets/i18n', 'dist/assets/i18n');
  fs.copy('package.json', 'dist/package.json');
}

run().catch(console.error);
