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
import notes from '../../.docs/gv-theme.md';
import '../../src/theme/gv-theme';
import customElements from '../../.docs/custom-elements.json';
import { makeStory } from '../lib/make-story';

export default {
  title: 'Documentation|Theme',
  component: 'gv-theme',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-theme',
};

const gvTheme = customElements.tags.find((tag) => tag.name === conf.component);

export const Colors = () => {
  const colors = gvTheme.cssProperties.filter((cssProperty) => cssProperty.type.toLowerCase() === 'color');
  const container = document.createElement('div');
  colors.forEach((color) => {
    const colorItem = document.createElement('div');
    const value = color.default.replace(/"/g, '');
    colorItem.innerHTML = `
        <div class="inverse-color" style="background-color: ${value}; padding: 1rem;">
            <span>${color.description}<span><br/>
            <span>${color.name}: ${value}</span>
        </div>
    `;
    container.appendChild(colorItem);
  });
  return container;
};

const loremIpsum = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.';

export const FontSizes = () => {
  const fonts = gvTheme.cssProperties.filter((cssProperty) => cssProperty.name.includes('font-size'));
  const container = document.createElement('div');
  container.className = 'fonts';
  fonts.forEach((font) => {
    const fontTitle = document.createElement('div');
    fontTitle.className = 'title';
    fontTitle.innerHTML = font.description;
    const fontItem = document.createElement('div');
    fontItem.className = 'item';
    const value = font.default.replace(/"/g, '');
    fontItem.innerHTML = `<div class="item item-size"><div style="font-size: ${value};">${loremIpsum}</div></div>`;
    container.appendChild(fontTitle);
    container.appendChild(fontItem);
  });
  return container;
};

const images = gvTheme.cssProperties
  .filter((cssProperty) => cssProperty.type.toLowerCase() === 'image')
  .map((prop) => ({ src: prop.default.replace(/"/g, '').replace(/url\('/, '').replace(/'\)/, ''), alt: prop.description, title: prop.description }));

export const Images = makeStory({
  component: 'gv-image',
  css: `
    :host {
      display: flex;
      flex-wrap: wrap;
      height: 600px;
    }
    gv-image {
      min-height: 50px;
      min-width: 50px;
      width: 100%;
      --gv-image--of: contain;
      margin: 1rem;
    }
  `,
},
{
  items: images,
});
