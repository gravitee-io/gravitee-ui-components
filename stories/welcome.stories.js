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
import customProperties from '../.docs/custom-properties.md';
import { markdownToDom } from './lib/markdown.js';
import { storiesOf } from '@storybook/html';

storiesOf('0. Welcome|Documentation', module)
  .addParameters({
    options: {
      showPanel: false,
    },
  })
  .add('Custom properties', () => markdownToDom(customProperties).element)
  .add('Theme', () => {
    return `
    <div class="title">Colors</div>
    <div class="collection colors">
        <div class="item" style="background-color: var(--gv-theme-color-darker); color: var(--gv-theme-color-lighter); ">
          <p>--gv-theme-color-darker </p>
        </div>

        <div class="item" style="background-color: var(--gv-theme-color-dark); color: var(--gv-theme-color-lighter);">
          <p>--gv-theme-color-dark </p>
        </div>

        <div class="item" style="background-color: var(--gv-theme-color); color: var(--gv-theme-color-lighter);">
          <p>--gv-theme-color </p>
        </div>

        <div class="item" style="background-color: var(--gv-theme-color-light); color: var(--gv-theme-color-darker);">
          <p>--gv-theme-color-light </p>
        </div>

        <div class="item" style="background-color: var(--gv-theme-color-lighter); color: var(--gv-theme-color-darker);">
          <p>--gv-theme-color-lighter </p>
        </div>
    </div>

    <div class="title">Category colors</div>
    <div class="collection colors">
        <div class="item" style="background-color: var(--gv-theme-color-category-1); color: var(--gv-theme-color-darker); ">
          <p>--gv-theme-color-category-1</p>
        </div>

        <div class="item" style="background-color: var(--gv-theme-color-category-2); color: var(--gv-theme-color-darker);">
          <p>--gv-theme-color-category-2</p>
        </div>

        <div class="item" style="background-color: var(--gv-theme-color-category-3); color: var(--gv-theme-color-darker);">
          <p>--gv-theme-color-category-3</p>
        </div>

        <div class="item" style="background-color: var(--gv-theme-color-category-4); color: var(--gv-theme-color-darker);">
          <p>--gv-theme-color-category-4</p>
        </div>

        <div class="item" style="background-color: var(--gv-theme-color-category-5); color: var(--gv-theme-color-darker);">
          <p>--gv-theme-color-category-5</p>
        </div>

        <div class="item" style="background-color: var(--gv-theme-color-category-6); color: var(--gv-theme-color-darker);">
          <p>--gv-theme-color-category-6</p>
        </div>
    </div>
</div>`;
  });
