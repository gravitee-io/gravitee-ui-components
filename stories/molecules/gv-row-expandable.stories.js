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

import notes from '../../.docs/gv-row-expandable.md';
import '../../src/molecules/gv-row-expandable';
import { makeStory } from '../lib/make-story';

const conf = {
  component: 'gv-row-expandable',
};

export default {
  title: 'Molecules/gv-row-expandable',
  ...conf,
  parameters: {
    notes,
  },
};

export const Basics = makeStory(conf, {
  items: [
    {
      innerHTML: `
        <div slot="summary">One line to sum up</div>
        <div slot="details">An hidden details to display more info on click.</div>
      `,
    },
  ],
});

export const OpenByDefault = makeStory(conf, {
  items: [
    {
      innerHTML: `
        <div slot="summary">One line to sum up</div>
        <div slot="details">An hidden details to display more info on click.</div>
      `,
      open: true,
    },
  ],
});

export const WithComponents = makeStory(conf, {
  items: [
    {
      innerHTML: `
        <div slot="summary" style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%">
          <gv-icon shape="navigation:check"></gv-icon>
          <code>2020-03-14 14:10:15</code>
        </div>

        <div slot="details" style="display: flex; justify-content: center">
            <table>
                <tr>
                  <td>cpu</td>
                  <td><gv-state>HEALTHY</gv-state></td>
                </tr>
                <tr>
                  <td>db</td>
                  <td><gv-state>HEALTHY</gv-state></td>
                </tr>
            </table>
        </div>
      `,
    },
    {
      innerHTML: `
        <div slot="summary" style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%">
          <gv-icon shape="navigation:close"></gv-icon>
          <code>2020-03-14 14:10:15</code>
        </div>

        <div slot="details" style="display: flex; justify-content: center">
            <table>
                <tr>
                  <td>cpu</td>
                  <td><gv-state>UNHEALTHY</gv-state></td>
                </tr>
                <tr>
                  <td>db</td>
                  <td><gv-state>HEALTHY</gv-state></td>
                </tr>
            </table>
        </div>
      `,
    },
    {
      innerHTML: `
        <div slot="summary" style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%">
          <gv-icon shape="navigation:close"></gv-icon>
          <code>2020-03-14 14:10:15</code>
        </div>

        <div slot="details" style="display: flex; justify-content: center">
            <table>
                <tr>
                  <td>cpu</td>
                  <td><gv-state>HEALTHY</gv-state></td>
                </tr>
                <tr>
                  <td>db</td>
                  <td><gv-state>HEALTHY</gv-state></td>
                </tr>
            </table>
        </div>
      `,
    },
  ],
});
