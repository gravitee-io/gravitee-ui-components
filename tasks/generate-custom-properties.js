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
const filepath = 'CUSTOM-PROPERTIES.md';

async function run () {

  const sourceFilepaths = await glob('./src/**/*.js', {
    ignore: [
      './src/lib/*.js',
      './src/styles/*.js',
    ],
  });

  await del(filepath);

  const input = ['# Gravitee.io UI Components\n'];
  input.push('## Custom Properties\n');
  input.push('```css');
  for (const src of sourceFilepaths) {
    const code = await fs.readFile(src, 'utf8');
    const { results, program } = wca.analyzeText(code);
    const format = 'json';
    const output = wca.transformAnalyzerResult(format, results, program);
    const tag = JSON.parse(output).tags[0];
    if (tag) {

      const cssProperties = tag.cssProperties;
      if (cssProperties) {
        const matches = code.match(/var\(--gv[a-zA-Z-, 0-9.#]*\)/g);
        let codeProperties = [];
        if (matches) {
          codeProperties = matches.map((match) => {
            const [start, end] = match.split(',');
            if (end == null) {
              throw new Error(`Default value not found for ${start} in code of ${tag.name}  `);
            }
            const name = start.replace('var(', '').trim();
            const value = `"${end.replace(/[);]*/g, '').trim()}"`;
            return { name, value };
          });

          codeProperties.forEach((codeProp) => {
            const foundProp = cssProperties.find((p) => p.name === codeProp.name);
            if (!foundProp) {
              throw new Error(`${tag.name} | ${codeProp.name} is used but not documented (default value:${codeProp.value})`);
            }
            else if (foundProp.default !== `${codeProp.value}`) {
              throw new Error(`${tag.name} | ${codeProp.name} default value is not up to date (in doc:|${foundProp.default}| / in code:|${codeProp.value}|)`);
            }
          });
        }
        // gv-icon is excluded because var css is used in js.
        if (tag.name !== 'gv-icon') {
          cssProperties.forEach((cssProperty) => {
            const foundProp = codeProperties.find((p) => p.name === cssProperty.name);
            if (!foundProp) {
              throw new Error(`${tag.name} | ${cssProperty.name} is documented but not used (default value:${cssProperty.value})`);
            }
          });
        }
        input.push(`\n/*****************************`);
        input.push(`/*     ${tag.name}`);
        input.push(`******************************/`);

        for (const prop of cssProperties) {
          if (prop.default) {
            input.push(`${prop.name}: ${prop.default}; /* ${prop.description} */`);
          }
          else {
            input.push(`${prop.name}: none; /* ${prop.description} */`);
          }
        }

      }
      else {
        console.warn(`warning: ${tag.name} doesn't have css properties ?`);
      }
    }
  }
  input.push('```');
  await fs.appendFile(filepath, input.join('\n'));
}

run().catch(console.error);
