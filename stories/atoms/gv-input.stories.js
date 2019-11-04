import '../../src/atoms/gv-input.js';
import notes from '../../.docs/gv-input.md';
import { storiesOf } from '@storybook/html';
import { withActions } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { updateBooleanAttributes, updateTextAttributes } from '../lib/update-attributes';

const eventNames = ['click gv-input'];

storiesOf('Components.Atoms', module)
  .addParameters({ notes })
  .add('<gv-input>', () => withActions(...eventNames)(() => {

    const label = text('Label', '');
    const disabled = boolean('Disabled', false);
    const skeleton = boolean('Skeleton', false);
    const required = boolean('Required', false);

    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title">Size</div>
      <gv-input placeholder="Default size"></gv-input>
      <gv-input large placeholder="Large size"></gv-input>
      <gv-input small placeholder="Small size" ></gv-input>
      
      <div class="title">Type</div>
      <gv-input type="text" placeholder="Text"></gv-input>
      <gv-input type="password" placeholder="Password..."></gv-input>
      <gv-input type="email" placeholder="Email..."></gv-input>
    `;

    const nodeList = container.querySelectorAll('gv-input');
    updateBooleanAttributes(nodeList, 'disabled', disabled);
    updateBooleanAttributes(nodeList, 'skeleton', skeleton);
    updateBooleanAttributes(nodeList, 'required', required);
    updateTextAttributes(nodeList, 'label', label);

    return container;
  }));
