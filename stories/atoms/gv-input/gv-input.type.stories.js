import '../../../src/atoms/gv-input.js';
import notes from '../../../.docs/gv-input.md';
import { storiesOf } from '@storybook/html';
import { withActions } from '@storybook/addon-actions';

const eventNames = ['click gv-input'];

storiesOf('atoms.gv-input', module)
  .add('type', () => withActions(...eventNames)(() => {

    return `
      <div class="title">Empty</div>
      <gv-input type="text" placeholder="text" ></gv-input>
      <gv-input type="password" placeholder="password"></gv-input>
      <gv-input type="email" value="not an email"></gv-input>
      <gv-input type="email" value="it.is@e.mail"></gv-input>

      <div class="title">Disabled</div>
      <gv-input type="text" disabled placeholder="text disabled" ></gv-input>
      <gv-input type="password" disabled placeholder="password disabled"></gv-input>
      <gv-input type="email" disabled value="not an email - disabled"></gv-input>
      <gv-input type="email" value="it.is@email.disabled"></gv-input>

      <div class="title">Required</div>
      <gv-input type="text" required placeholder="text required" ></gv-input>
      <gv-input type="password" required placeholder="password required"></gv-input>
      <gv-input type="email" required value="not an email - required"></gv-input>
      <gv-input type="email" required value="it.is@email.required"></gv-input>

      <div class="title">Skeleton</div>
      <gv-input type="text" skeleton ></gv-input>
      <gv-input type="password" skeleton ></gv-input>
      <gv-input type="email" skeleton ></gv-input>
      <gv-input type="email" skeleton ></gv-input>

    `;
  }), { notes });
