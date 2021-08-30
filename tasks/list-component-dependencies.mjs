/*
 * Copyright (C) 2021 The Gravitee team (http://gravitee.io)
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
import { $, chalk } from 'zx';
import { readFile } from 'fs/promises';

const dependenciesMap = new Map();

// List all the files matching `gv-*` in `src` folder
const files = (await $`find src -type f -iname "*gv-*.js"`)
  .toString()
  .split('\n')
  .filter((filePath) => filePath !== '');

for (const filePath of files) {
  // Extract component name from path
  const pathParts = filePath.replace('.js', '').split('/');
  const componentName = pathParts[pathParts.length - 1];

  // Read file and look for things like `import .../gv-*`
  const fileContent = await readFile(filePath, { encoding: 'utf-8' });
  const magicRegex = /import '.*\/gv-(.*)';/g;

  let gvComponents = Array.from(fileContent.matchAll(magicRegex)).map((regExpMatch) => `gv-${regExpMatch[1]}`);

  dependenciesMap.set(componentName, new Set(gvComponents));
}

// Loop an arbitrary nb of time to replace each dep component with it's own deps
// in order to have transitive dependencies
for (let i = 0; i < 10; i++) {
  dependenciesMap.forEach((value, key) => {
    const components = Array.from(value);
    const subComponents = components.flatMap((value) => Array.from(dependenciesMap.get(value) || []));
    dependenciesMap.set(key, new Set([...components, ...subComponents]));
  });
}

// Display result
console.log(`${chalk.blue('RESULT')}\n`);

Array.from(dependenciesMap, ([componentName, subComponents]) => ({ componentName, subComponents }))
  .sort((compo1, compo2) => compo1.componentName.localeCompare(compo2.componentName))
  .forEach(({ componentName, subComponents }) => {
    console.log(` - ${chalk.blue(componentName)}: ${Array.from(subComponents).join(', ')}`);
  });
