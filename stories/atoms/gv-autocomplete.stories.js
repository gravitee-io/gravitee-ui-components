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
import { makeStory } from '../lib/make-story';
import picture from '../../assets/images/avatar.png';

export default {
  title: 'Atoms/gv-autocomplete',
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
  events: ['gv-input:submit', 'click'],
  css: `
    :host {
      height: 175px;
      display: flex;
      flex-direction: column;
    }
    gv-autocomplete {
      width: 350px;
    }
  `,
};

export const BasicUsage = makeStory(conf, {
  items: [
    {
      innerHTML: '<gv-input placeholder="Type something..." description="Try to type something"></gv-input>',
      '@gv-autocomplete:search': (event) => {
        const detail = event.detail;
        const component = event.target;
        component.options = [mockVal(detail), mockVal(detail, 2), mockVal(detail, 3)];
      },
    },
  ],
});

export const CustomInput = makeStory(conf, {
  items: [
    {
      innerHTML: '<gv-input type="search" placeholder="Type text to start the search..."></gv-input>',
      '@gv-autocomplete:search': (event) => {
        const component = event.target;
        const detail = event.detail;
        component.options = [mockVal(detail), mockVal(detail, 2), mockVal(detail, 3)];
      },
    },
  ],
  docs: `
   You can use any element that returns the native [input event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
  `,
});

const options = [{ value: 'Good Morning' }, { value: 'Hello' }, { value: 'Good Bye' }];
export const DisplayChoices = makeStory(conf, {
  items: [
    {
      innerHTML: '<gv-input label="Play with dynamic data" placeholder="Play with dynamic data" autofocus></gv-input>',
      options,
      minChars: 0,
      '@gv-autocomplete:search': (event) => {
        const detail = event.detail;
        const component = event.target;
        if (detail.length === 0) {
          component.options = options;
        } else {
          component.options = [mockVal(detail), mockVal(detail, 2), mockVal(detail, 3)];
        }
      },
    },
  ],
  docs: `
    If you want displayed choices on the first load, you must initialize the data and set the option \`minChars = 0\`
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

const style = `
    <style>
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
  </style>
`;

export const DefaultFilter = makeStory(conf, {
  items: [
    {
      innerHTML: '<gv-input placeholder="try to type `g`" autofocus></gv-input>',
      options: [
        { value: 'Good Morning' },
        { value: 'Hello' },
        { value: 'Good Bye' },
        { value: 'Morning' },
        { value: 'Bonjour' },
        { value: 'Bye Bye' },
      ],
      filter: true,
    },
  ],
  docs: `
    If you want to use default case sensitive filter, set option \`filter=true\`
  `,
});

export const CustomFilter = makeStory(conf, {
  items: [
    {
      innerHTML: '<gv-input placeholder="try to type `g`" autofocus></gv-input>',
      options: [{ value: 'Good Morning' }, { value: 'Hello' }, { value: 'Good Bye' }],
      filter: (value, option) => option.value.toUpperCase().indexOf(value.toUpperCase()) !== -1,
    },
  ],
  docs: `
      If you want to use custom filter, set function to \`filter\` option
    `,
});

export const CustomHTML = makeStory(conf, {
  items: [
    {
      innerHTML: `<gv-input></gv-input>`,
      style,
      '@gv-autocomplete:search': (event) => {
        const detail = event.detail;
        const component = event.target;
        component.options = [
          { value: mockVal(detail).value, innerHTML: renderApi({ title: mockVal(detail).value }) },
          { value: mockVal(detail, 2).value, innerHTML: renderApi({ title: mockVal(detail, 2).value }) },
          { value: mockVal(detail, 3).value, innerHTML: renderApi({ title: mockVal(detail, 3).value }) },
          { value: mockVal(detail, 4).value, innerHTML: renderApi({ title: mockVal(detail, 4).value }) },
          { value: mockVal(detail, 5).value, innerHTML: renderApi({ title: mockVal(detail, 5).value }) },
          { value: mockVal(detail, 6).value, innerHTML: renderApi({ title: mockVal(detail, 6).value }) },
          { value: mockVal(detail, 7).value, innerHTML: renderApi({ title: mockVal(detail, 7).value }) },
        ];
      },
    },
  ],
  docs: `
      If you want to customize option rendering, you must use option object with value and innerHTML property's
    `,
});

const renderApiElement = ({ title }) => {
  const api = document.createElement('div');
  api.className = 'api';
  api.innerHTML = `
        <gv-image src="${picture}"></gv-image>
        <div class="title">
            <strong>${title}</strong>
            <div>A simple description</div>
        </div>
  `;
  return api;
};

export const CustomElement = makeStory(conf, {
  items: [
    {
      innerHTML: `<gv-input></gv-input>`,
      style,
      '@gv-autocomplete:search': (event) => {
        const detail = event.detail;
        const component = event.target;
        component.options = [
          { value: mockVal(detail).value, element: renderApiElement({ title: mockVal(detail).value }) },
          { value: mockVal(detail, 2).value, element: renderApiElement({ title: mockVal(detail, 2).value }) },
          { value: mockVal(detail, 3).value, element: renderApiElement({ title: mockVal(detail, 3).value }) },
        ];
      },
    },
  ],
  docs: `
      If you want to customize option rendering, you must use option object with value and innerHTML property's
    `,
});

const users = [{ value: 'John' }, { value: 'Jack' }, { value: 'Jane' }, { value: 'Steeve' }, { value: 'Tony' }, { value: 'Axel' }];
export const NoOptionsSlot = makeStory(conf, {
  items: [
    {
      options: users,
      innerHTML: `
        <gv-input placeholder='Type some unavailable option like Jim…'></gv-input>
        <div slot='noOption' style='display:flex;flex-direction:row;align-items:center;justify-content:space-around'>
            <span>No matching option found</span>
            <gv-button>Add one</gv-button>
        </div>`,
      '@gv-autocomplete:search': (event) => {
        const detail = event.detail;
        const component = event.target;
        component.options = users.filter((user) => user.value.includes(detail));
      },
    },
  ],
});
