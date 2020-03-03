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
import '../../src/atoms/gv-autocomplete';
import '../../src/atoms/gv-input';
import '../../src/atoms/gv-image';
import notes from '../../.docs/gv-autocomplete.md';
import { makeStory, storyWait } from '../lib/make-story';
import picture from '../../assets/images/logo.png';

export default {
  title: 'Atoms|gv-autocomplete',
  component: 'gv-autocomplete',
  parameters: {
    notes,
  },
};

const mockVal = (str, repeat = 1) => ({
  value: str.repeat(repeat),
});

const conf = {
  component: 'gv-autocomplete',
  css: `
    :host {
      height: 200px;
    }
    gv-autocomplete {
      width: 350px;
    }
  `,
};

export const BasicUsage = makeStory(conf, {
  items: [{ innerHTML: '<gv-input label="Play with dynamic data" placeholder="Play with dynamic data"></gv-input>' }],
  simulations: [
    storyWait(0, ([component]) => {
      component.addEventListener('gv-autocomplete:search', ({ detail }) => {
        component.options = [mockVal(detail), mockVal(detail, 2), mockVal(detail, 3)];
      });
    }),
  ],
});

export const Search = makeStory(conf, {
  items: [{ innerHTML: '<gv-input type="search" placeholder="Type text to start the search..."></gv-input>' }],
  simulations: [
    storyWait(0, ([component]) => {
      component.addEventListener('gv-autocomplete:search', ({ detail }) => {
        component.options = [mockVal(detail), mockVal(detail, 2), mockVal(detail, 3)];
      });
    }),
  ],
  docs: `
   You can use any element that returns the native [input event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
  `,
});

const options = [{ value: 'Good Morning' }, { value: 'Hello' }, { value: 'Good Bye' }];
export const Autofocus = makeStory(conf, {
  items: [{
    innerHTML: '<gv-input label="Play with dynamic data" placeholder="Play with dynamic data" autofocus></gv-input>',
    options,
    minChars: 0,
  }],
  simulations: [
    storyWait(0, ([component]) => {
      component.addEventListener('gv-autocomplete:search', ({ detail }) => {
        if (detail.length === 0) {
          component.options = options;
        }
        else {
          component.options = [mockVal(detail), mockVal(detail, 2), mockVal(detail, 3)];
        }

      });
    }),
  ],
  docs: `
    If you want the choices to be displayed on the first load, you must initialize the data and set the option \`minChars = 0\`
  `,
});

const renderApi = ({ title }) => {
  return `
    <div class="api">
        <gv-image src="${picture}"></gv-image>
        <div class="title">
            <strong>${title}</strong>
            <div>A simple description</div>
        </div>
    </div>
  `;
};

// language=CSS
const style = `
    .api {
        display: inline-flex;
        font-size: 11px;
        align-items: center;
    }

    .title {
        display: flex;
        flex: 1;
        margin: 0.5rem;
        flex-direction: column;
    }

    gv-image {
        margin: 0 0.5rem;
        height: 25px;
        width: 25px;
    }
`;

export const Filter = makeStory(conf, {
  items: [{
    innerHTML: '<gv-input placeholder="try to type `g`" autofocus></gv-input>',
    options: [{ value: 'Good Morning' }, { value: 'Hello' }, { value: 'Good Bye' }],
    filter: true,
  }],
  docs: `
    If you want the choices to be displayed on the first load, you must initialize the data and set the option \`minChars = 0\`
  `,
});

const nonCaseSensitive = (value, option) => {
  return option.value.toUpperCase().indexOf(value.toUpperCase()) !== -1;
};

export const NonCaseSensitiveFilter = makeStory(conf, {
  items: [{
    innerHTML: '<gv-input placeholder="try to type `g`" autofocus></gv-input>',
    options: [{ value: 'Good Morning' }, { value: 'Hello' }, { value: 'Good Bye' }],
    filter: nonCaseSensitive,
  }],
});

export const CustomOptions = makeStory(conf, {
  items: [{ innerHTML: `<gv-input></gv-input>`, style }],
  simulations: [
    storyWait(0, ([component, a]) => {
      component.addEventListener('gv-autocomplete:search', ({ detail }) => {
        component.options = [
          { value: mockVal(detail).value, innerHTML: renderApi({ title: mockVal(detail).value }) },
          { value: mockVal(detail, 2).value, innerHTML: renderApi({ title: mockVal(detail, 2).value }) },
          { value: mockVal(detail, 3).value, innerHTML: renderApi({ title: mockVal(detail, 3).value }) },
        ];
      });
    }),
  ],
});
