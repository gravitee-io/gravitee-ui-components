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
import '../../src/atoms/gv-quality-gauge';
import notes from '../../.docs/gv-spinner.md';
import { makeStory } from '../lib/make-story';

export default {
  title: 'Atoms/gv-quality-gauge',
  component: 'gv-quality-gauge',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-quality-gauge',
  css: `
    :host {
      width: 500px;
      height: 200px;
      
    }
  `,
};

const items = [
  {percent: 10},
  {percent: 20},
  {percent: 30},
  {percent: 40},
  {percent: 50},
  {percent: 60},
  {percent: 70},
  {percent: 80},
  {percent: 90},
  {percent: 100},
];

export const basic = makeStory(conf, {
  items,
});