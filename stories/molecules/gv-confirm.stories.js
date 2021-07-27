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
import '../../src/atoms/gv-button';
import '../../src/molecules/gv-confirm';
import { makeStory } from '../lib/make-story';

export default {
  title: 'Molecules/gv-confirm',
  component: 'gv-confirm',
};

const conf = {
  component: 'gv-confirm',
  css: `
   :host {
      display: flex;
      height: 90vh;
      justify-content: space-around;
      align-items: center;
    }
  `,
};

export const Basic = makeStory(conf, {
  items: [{ message: 'Are you sure ?', innerHTML: '<gv-button>Ask confirmation</gv-button>' }],
});

export const CustomLabels = makeStory(conf, {
  items: [
    {
      message: 'Are you agree to delete this comment ?',
      innerHTML: '<gv-button outlined>Ask confirmation</gv-button>',
      okLabel: 'I agree',
      cancelLabel: 'Not agree',
    },
  ],
});

export const CustomIcon = makeStory(conf, {
  items: [
    {
      message: 'Are we going to eat pizza tomorrow?',
      innerHTML: '<gv-button outlined>Ask confirmation</gv-button>',
      okLabel: 'Awesome',
      cancelLabel: 'Sorry, I prefer the pasta',
      icon: 'food:pizza',
    },
  ],
});

export const Disabled = makeStory(conf, {
  items: [{ message: 'Are you sure ?', innerHTML: '<gv-button>Ask confirmation</gv-button>', disabled: true }],
});

export const DisabledFromGvButton = makeStory(conf, {
  items: [{ message: 'Are you sure ?', innerHTML: '<gv-button disabled="true">Ask confirmation</gv-button>' }],
});
