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
import './gv-icon';
import { icons } from '../../../.docs/icons.json';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map';
import { repeat } from 'lit/directives/repeat';

export default {
  title: 'Atoms/gv-icon',
  component: 'gv-icon',
  parameters: {
    // DO NOT REACTIVATE a11y on these stories for now as the a11y checks are taking forever to run
    a11y: { disable: true },
  },
};

const rootStyle = {
  display: 'flex',
  'flex-wrap': 'wrap',
};

const itemStyle = {
  'text-align': 'center',
  padding: '0.5rem',
  'min-width': '175px',
  'font-size': '11px',
  '--gv-icon--c': 'var(--gv-theme-color-info)',
};

export const all = {
  render: () => html`
    <div style="${styleMap(rootStyle)}">
      ${repeat(
        icons,
        (shape) => html`
          <div style="${styleMap(itemStyle)}">
            <gv-icon shape="${shape}"></gv-icon>
            <div>${shape}</div>
          </div>
        `,
      )}
    </div>
  `,
};

all.parameters = {
  ...all.parameters,
  chromatic: { disable: false, delay: 2000 },
};
