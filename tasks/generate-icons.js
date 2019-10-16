const del = require('del');
const fs = require('fs-extra');
const rawGlob = require('glob');
const util = require('util');
const SVGO = require('svgo');
const pascalCase = require('pascal-case');

const glob = util.promisify(rawGlob);
const svgo = new SVGO({ plugins: [{ removeXMLNS: true }, { removeAttrs: false }] });
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
  await del('src/icons/shapes');
  await fs.mkdir('src/icons/shapes', { recursive: true });
  await fs.writeFile('src/icons/shapes/all-shapes.js', '');
  await fs.writeFile('stories/collection/icons.generated-stories.js', `import '../../src/icons/shapes/all-shapes';
import '../../src/atoms/gv-icon.js';
import {storiesOf} from '@storybook/html';

storiesOf('Collection', module)
  .add('Icons', ()  => {
    return \``);
  for (const [shapeId, icons] of Object.entries(iconsByShape)) {
    const shapeName = pascalCase(`${shapeId}Shapes`);
    console.log(`Generate ${shapeName}`);
    await fs.writeFile(`src/icons/shapes/${shapeId}-shapes.js`,
      `export const ${shapeName} = ${JSON.stringify(icons)};
window.GvIcons = window.GvIcons || {};
window.GvIcons['${shapeId}'] = ${shapeName};
`);
    await fs.appendFile('src/icons/shapes/all-shapes.js', `import './${shapeId}-shapes.js'\n`);

    // Generate tmp file for stories
    await fs.appendFile('stories/collection/icons.generated-stories.js', `<div class="title">${shapeId}</div>\n<div class="shape-container">`);
    for (const icon of Object.keys(icons)) {
      await fs.appendFile('stories/collection/icons.generated-stories.js',
        `<div class="icon-container"><gv-icon shape="${shapeId}:${icon}" size="48"></gv-icon><span>${shapeId}:${icon}</span></div>\n`);
    }
    await fs.appendFile('stories/collection/icons.generated-stories.js', `</div>`);
  }
  await fs.appendFile('stories/collection/icons.generated-stories.js', `\`\n});`);
}

run()
  .then(console.log)
  .catch(console.error);
