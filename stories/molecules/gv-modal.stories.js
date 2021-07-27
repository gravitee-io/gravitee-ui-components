/*
 * Copyright (C) 2021 The Gravitee team (http://gravitee.io)
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
import '../../src/molecules/gv-modal';
import '../../src/atoms/gv-input';
import '../../src/atoms/gv-button';
import { makeStory } from '../lib/make-story';
import { html } from 'lit-element';

export default {
  title: 'Molecules/gv-modal',
  component: 'gv-modal',
  parameters: {
    options: {
      showPanel: false,
    },
  },
};

const conf = {
  component: 'gv-modal',
  // language=CSS
  css: `
    :host {
      display: flex;
      height: 90vh;
      width: 90vw;
      justify-content: space-around;
      align-items: center;
    }

    gv-modal {
      --gv-modal--w: 600px;
    }
  `,
};

const dangerZoneHtml = `
<div>
        <p>
          This action <strong>cannot</strong> be undone. This will permanently delete the <strong>installation</strong>
          and you will not be able to reconnect it later.
        </p>

        <p>Please type the installation name to confirm deletion.</p>

        <div style="display: flex; flex-direction: column;">
          <gv-input autofocus="true"></gv-input>
          <gv-button danger>I understand the consequences, delete this installation</gv-button>
        </div>
</div>
`;

export const modalOpenedWithCloseIcon = makeStory(conf, {
  items: [
    {
      opened: true,
      showCloseIcon: true,
      modalTitle: 'Are you sure?',
      innerHTML: dangerZoneHtml,
    },
  ],
});

export const modalOpenOnButtonClick = () => {
  return html`<button @click="${() => document.getElementById('myModal').open()}">Open Modal</button>
    <gv-modal id="myModal" modalTitle="🚨 Warning">
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veritatis quia, excepturi, perspiciatis quo obcaecati similique commodi
      temporibus hic iusto asperiores laborum debitis in quasi velit animi, error nam rerum veniam?
    </gv-modal> `;
};
// Disable Chromatic as a button click is need to display the modal
modalOpenOnButtonClick.parameters = {
  ...modalOpenOnButtonClick.parameters,
  chromatic: { disable: true },
};
