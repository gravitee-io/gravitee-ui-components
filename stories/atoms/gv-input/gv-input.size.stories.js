import '../../../src/atoms/gv-input.js';
import notes from '../../../.docs/gv-input.md';
import { storiesOf } from '@storybook/html';
import { withActions } from '@storybook/addon-actions';

const eventNames = ['click gv-input'];

storiesOf('atoms.gv-input', module)
  .add('size', () => withActions(...eventNames)(() => {

    return `
      <div class="title">Empty</div>
      <gv-input small placeholder="small" ></gv-input>
      <gv-input medium placeholder="medium"></gv-input>
      <gv-input large placeholder="large"></gv-input>

      <div class="title">Disabled</div>
      <gv-input small disabled placeholder="small disabled" ></gv-input>
      <gv-input medium disabled placeholder="medium disabled"></gv-input>
      <gv-input large disabled placeholder="large disabled"></gv-input>

      <div class="title">Required</div>
      <gv-input small required placeholder="small required" ></gv-input>
      <gv-input medium required placeholder="medium required"></gv-input>
      <gv-input large required placeholder="large required"></gv-input>

      <div class="title">Skeleton</div>
      <gv-input small skeleton ></gv-input>
      <gv-input medium skeleton ></gv-input>
      <gv-input large skeleton ></gv-input>
    `;
  }), { notes });
