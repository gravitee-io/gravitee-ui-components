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
import '../../src/atoms/gv-card-category.js';
import notes from '../../.docs/gv-card-category.md';
import { storiesOf } from '@storybook/html';
import { number } from '@storybook/addon-knobs';

storiesOf('Components.Atoms', module)
  .add('<gv-card-category>', () => {
    const limit = number('Limit size for description', '');

    return `
      <div class="title">Cards</div>
      <gv-card-category 
        title="Title"
      >
      </gv-card-category>
      <gv-card-category
        title="Title + image"
        src="http://picsum.photos/200"
      >
      </gv-card-category>
      <gv-card-category
        title="Title + description" 
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      >
      </gv-card-category>
      <gv-card-category
        title="Title + image + description" 
        src="http://picsum.photos/200"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      >
      </gv-card-category>
      <gv-card-category
        title="Title + image + description + description limit" 
        src="http://picsum.photos/200"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        limit="${limit || 50}";
      >
      </gv-card-category>
      <gv-card-category
      title="Category card" 
      src="http://picsum.photos/200"
      description="An example of what could be done with some styling"
      limit="50"
      style="--gv-card-category--bgc: #D9D4F1; --gv-card-category--c: var(--gv-theme-color-dark);width: 440px; height: 228px";
      >
      </gv-card-category>
    `;
  }, { notes });
