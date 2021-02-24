import '../../src/molecules/gv-modal';
import '../../src/atoms/gv-input';
import '../../src/atoms/gv-button';
import { makeStory } from '../lib/make-story';
import notes from '../../.docs/gv-modal.md';
import { html } from 'lit-element';

export default {
  title: 'Molecules/gv-modal',
  component: 'gv-modal',
  parameters: {
    notes,
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
      --gv-modal-width: 600px;
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
