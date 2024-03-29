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
import { deleteAsync } from 'del';
import { appendFile, copyFile, mkdir, readFile } from 'fs/promises'
import { analyzeText, transformAnalyzerResult } from "web-component-analyzer";
const rawGlob = require('glob');
const util = require('util');
const glob = util.promisify(rawGlob);
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

async function run() {
  await deleteAsync(['assets/css/github-markdown-css', 'assets/css/highlight.js']);
  await mkdir('assets/css/github-markdown-css')
  await mkdir('assets/css/highlight.js');
  await copyFile('node_modules/github-markdown-css/github-markdown.css', 'assets/css/github-markdown-css/github-markdown.css');
  await copyFile('node_modules/highlight.js/styles/github.css', 'assets/css/highlight.js/github.css');

  const sourceFilepaths = await glob('./src/**/*.{js,ts}', {
    ignore: ['./src/lib/*.{js,ts}', './src/styles/*.{js,ts}', './src/studio-policy/*.{js,ts}'],
  });

  await deleteAsync([themeFilepath, cssFilepath]);

  let gvTheme;
  let themableElements = [];
  for (const src of sourceFilepaths) {
    const code = await readFile(src, 'utf8');
    const { results, program } = analyzeText(code, { config: { features: ['cssproperty'] } });
    const output = transformAnalyzerResult('json', results, program);
    const tag = JSON.parse(output).tags[0];
    if (tag && tag.name && tag.name === 'gv-theme') {
      gvTheme = tag;
      delete gvTheme.description;
    } else if (tag && tag.description && tag.description.includes('@theme')) {
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
              } else if (foundProp.default !== `${codeProp.value}`) {
                throw new Error(
                  `${tag.name} | ${codeProp.name} default value is not up to date (in doc:|${foundProp.default}| / in code:|${codeProp.value}|)`,
                );
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
          if (
            cssProperty.default &&
            cssProperty.type.toLowerCase() !== 'length' &&
            (cssProperty.default.endsWith('px"') || cssProperty.default.endsWith('em"'))
          ) {
            throw new Error(`${tag.name} | ${cssProperty.name} should have Length type`);
          }
        });
        themableElements = themableElements.concat(tag);
      } else {
        console.warn(`warning: ${tag.name} doesn't have css properties ?`);
      }
    }
  }

  const gvThemeProperties = gvTheme.cssProperties.map((cssProperty) => {
    themableElements.forEach((element) =>
      element.cssProperties
        .filter((prop) => prop.default === cssProperty.default && prop.default !== '"none"')
        .forEach((prop) => {
          console.warn(`warning: Please use theme property ${cssProperty.name} for ${prop.name}=${prop.default}`);
        }),
    );
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
  await appendFile(cssFilepath, `:root{\n${theme.join('')}}`);

  gvTheme.css = gvThemeProperties.filter((cssProperty) => cssProperty.type.toLowerCase() !== 'image');
  delete gvTheme.cssProperties;

  await appendFile(themeFilepath, JSON.stringify({ data: [gvTheme].concat(gvComponents) }, null, 2));
}

run().catch(console.error);
