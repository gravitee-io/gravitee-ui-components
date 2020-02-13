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

const glob = util.promisify(rawGlob);

async function run () {
  const svgFilepaths = await glob('assets/icons/**/*.svg');

  const icons = svgFilepaths
    .map((src) => {
      const relativePath = src.replace('assets/icons/', '');
      const [category, filename] = relativePath.split('/');
      const id = filename.replace('.svg', '').toLowerCase();
      return `${category}:${id}`;
    }).sort((icon) => {
      if (icon.startsWith('general')) {
        return -1;
      }
      return 0;
    });

  await fs.writeFile('.docs/icons.json', JSON.stringify({ icons }));
}

run()
  .then(console.log)
  .catch(console.error);
