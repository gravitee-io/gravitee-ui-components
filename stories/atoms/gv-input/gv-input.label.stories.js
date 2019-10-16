import '../../../src/atoms/gv-input.js';
import notes from '../../../.docs/gv-input.md';
import { storiesOf } from '@storybook/html';
import { withActions } from '@storybook/addon-actions';

const eventNames = ['click gv-input'];

storiesOf('atoms.gv-input', module)
  .add('label', () => withActions(...eventNames)(() => {

    return `
      <div class="title">Text input</div>
      <gv-input value="No label"></gv-input><br>
      <gv-input label="Optional" value="Optional label"></gv-input><br>
      <gv-input label="Required" value="Required label" required></gv-input>
    `;
  }), { notes });
