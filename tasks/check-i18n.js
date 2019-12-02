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

// Require ESM modules like we're in the future
// eslint-disable-next-line no-global-assign
require = require('esm')(module);

const en = require('../assets/i18n/en.json');
const fr = require('../assets/i18n/fr.json');

const fs = require('fs-extra');
const rawGlob = require('glob');
const util = require('util');
const { extractFromCode } = require('i18n-extract');

const glob = util.promisify(rawGlob);
const translationsByLang = { en, fr };

async function getUsedKeys (sourceFilepaths) {
  const usedKeysByFile = {};
  for (const src of sourceFilepaths) {
    const code = await fs.readFile(src, 'utf8');
    const keys = extractFromCode(code, { marker: 'i18n' });
    usedKeysByFile[src] = keys.map(({ key }) => key);
  }
  return usedKeysByFile;
}

async function run () {

  let errors = false;

  const sourceFilepaths = await glob('./src/*/*.js', {
    ignore: [
      './src/lib/*.js',
      './src/styles/*.js',
    ],
  });

  const usedKeysByFile = await getUsedKeys(sourceFilepaths);

  // MISSING KEYS
  sourceFilepaths.forEach((src) => {
    console.log(`Inspecting translations for ${src}`);

    Object.entries(translationsByLang).forEach(([lang, translations]) => {
      const missingKeys = usedKeysByFile[src]
        .filter((key) => key.split('.').reduce((prev, curr) => prev && prev[curr], translations) == null);

      if (missingKeys.length !== 0) {
        errors = true;
        const formattedLog = missingKeys
          .map((k) => `  MISSING (${lang}): ${k}`)
          .join('\n');
        console.log(formattedLog);
      }
    });
  });

  // UNUSED KEYS
  const allUsedKeys = Object.values(usedKeysByFile)
    .reduce((a, b) => [...a, ...b]);
  Object.entries(translationsByLang).forEach(([lang, translations]) => {

    const translationsKeys = getDeepKeys(translations);

    const unusedKeys = translationsKeys
      .filter((key) => !allUsedKeys.includes(key));

    if (unusedKeys.length !== 0) {
      errors = true;
      const formattedLog = unusedKeys
        .map((k) => `  UNUSED (${lang}): ${k}`)
        .join('\n');
      console.log(formattedLog);
    }
  });

  if (errors) {
    process.exit(1);
  }

  function getDeepKeys (obj) {
    let keys = [];
    for (var key in obj) {
      if (typeof obj[key] === 'object') {
        const subkeys = getDeepKeys(obj[key]);
        keys = keys.concat(subkeys.map((subkey) => {
          return key + '.' + subkey;
        }));
      }
      else if (typeof obj[key] === 'string') {
        keys.push(key);
      }
    }
    return keys;
  }
}

run()
  .catch(console.error);
