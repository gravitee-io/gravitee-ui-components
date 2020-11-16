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
'use strict';

const del = require('del');
const fs = require('fs-extra');
const rawGlob = require('glob');
const util = require('util');
const glob = util.promisify(rawGlob);
const wca = require('web-component-analyzer');
const filepath = '.docs/custom-properties.md';
const themeFilepath = 'src/theme/definition.json';
const cssFilepath = 'assets/css/gravitee-theme.generated.css';

const formatCssProperty = (cssProperty) => {
  cssProperty.default = cssProperty.default.replace(/"/g, '');
  cssProperty.value = '';
  if (!cssProperty.default.startsWith('var(')) {
    cssProperty.value = cssProperty.default;
  }
  cssProperty.type = cssProperty.type.toLowerCase();
  return cssProperty;
};

async function run () {

  await del([
    'assets/css/github-markdown-css',
    'assets/css/highlight.js',
  ]);

  fs.copy('node_modules/github-markdown-css/github-markdown.css', 'assets/css/github-markdown-css/github-markdown.css');
  fs.copy('node_modules/highlight.js/styles/github-gist.css', 'assets/css/highlight.js/github-gist.css');

  const sourceFilepaths = await glob('./src/**/*.js', {
    ignore: [
      './src/lib/*.js',
      './src/styles/*.js',
      './src/studio-policy/*.js',
    ],
  });

  await del([filepath, themeFilepath, cssFilepath]);

  const input = [];
  let gvTheme;
  let themableElements = [];
  let index = 1;
  for (const src of sourceFilepaths) {

    const code = await fs.readFile(src, 'utf8');
    const { results, program } = wca.analyzeText(code, { config: { features: ['cssproperty'] } });
    const output = wca.transformAnalyzerResult('json', results, program);
    const tag = JSON.parse(output).tags[0];
    if (tag && tag.name && tag.name === 'gv-theme') {
      gvTheme = tag;
      delete gvTheme.description;
    }
    else if (tag && tag.description && tag.description.includes('@theme')) {
      const cssProperties = tag.cssProperties;
      if (cssProperties) {
        const matches = code.match(/var\(--gv[a-zA-Z-, 0-9.#();'/]*\)/g);
        let codeProperties = [];
        if (matches) {
          codeProperties = matches.map((match) => {
            let [start, ...end] = match.split(',');
            if (end == null) {
              throw new Error(`Default value not found for ${start} in code of ${tag.name}  `);
            }
            end = end.join(',');
            const name = start.replace('var(', '').trim();
            const value = `"${end.replace(/\)$/g, '').trim()}"`;
            return { name, value };
          });

          codeProperties
            .filter((codeProp) => !codeProp.name.startsWith('--gv-theme'))
            .forEach((codeProp) => {
              const foundProp = cssProperties.find((p) => p.name === codeProp.name);
              if (!foundProp) {
                console.warn(`${tag.name} | ${codeProp.name} is used but not documented (default value:${codeProp.value})`);
              }
              else if (foundProp.default !== `${codeProp.value}`) {
                throw new Error(`${tag.name} | ${codeProp.name} default value is not up to date (in doc:|${foundProp.default}| / in code:|${codeProp.value}|)`);
              }
            });
        }

        cssProperties.forEach((cssProperty) => {
          const foundProp = codeProperties.find((p) => p.name === cssProperty.name);
          if (!foundProp) {
            console.warn(`${tag.name} | ${cssProperty.name} is documented but not used (default value:${cssProperty.value})`);
          }

          if ((cssProperty.name.endsWith('--c') || cssProperty.name.endsWith('--bgc')) && cssProperty.type.toLowerCase() !== 'color') {
            throw new Error(`${tag.name} | ${cssProperty.name} should have Color type`);
          }
          if (cssProperty.default && cssProperty.type.toLowerCase() !== 'length' && (cssProperty.default.endsWith('px"') || cssProperty.default.endsWith('em"'))) {
            throw new Error(`${tag.name} | ${cssProperty.name} should have Length type`);
          }

        });
        const doc = wca.transformAnalyzerResult('markdown', results, program);
        const markdownProperties = doc.split('## CSS Custom Properties')[1];
        input.push(`# ${index++}. ${tag.name}`);
        input.push(markdownProperties);
        themableElements = themableElements.concat(tag);
      }
      else {
        console.warn(`warning: ${tag.name} doesn't have css properties ?`);
      }
    }
  }

  const gvThemeProperties = gvTheme.cssProperties.map((cssProperty) => {
    themableElements.forEach(
      (element) => element.cssProperties.filter((prop) => prop.default === cssProperty.default && prop.default !== '"none"').forEach((prop) => {
        console.warn(`warning: Please use theme property ${cssProperty.name} for ${prop.name}=${prop.default}`);
      }));
    return formatCssProperty(cssProperty);
  });

  const gvComponents = themableElements
    .filter((element) => !element.name.startsWith('gv-theme'))
    .map((element) => {
      delete element.description;
      element.css = element.cssProperties.map(formatCssProperty);
      delete element.cssProperties;
      return element;
    })
    .reverse();

  /** Generate Theme **/
  const theme = gvThemeProperties.map((property) => {
    return `  ${property.name}: ${property.value};\n`;
  });
  await fs.appendFile(cssFilepath, `:root{\n${theme.join('')}}`);

  gvTheme.css = gvThemeProperties.filter((cssProperty) => cssProperty.type.toLowerCase() !== 'image');
  delete gvTheme.cssProperties;

  await fs.appendFile(themeFilepath, JSON.stringify({ data: [gvTheme].concat(gvComponents) }, null, 2));
  await fs.appendFile(filepath, input.join('\n'));
}

run().catch(console.error);
