import '../../src/atoms/gv-input.js';
import notes from '../../.docs/gv-input.md';
import { storiesOf } from '@storybook/html';
import { withActions } from '@storybook/addon-actions';

const eventNames = ['click gv-input'];

storiesOf('Components.Atoms', module)
  .add('<gv-input>', () => withActions(...eventNames)(() => {
    return `
      <div class="title">Type</div>
      <gv-input type="text"></gv-input>
      <gv-input type="password" placeholder="Password..."></gv-input>
      <gv-input type="email" placeholder="Email..."></gv-input>
      
      <div class="title">Size</div>
      <gv-input placeholder="Default size"></gv-input>
      <gv-input large placeholder="Large size"></gv-input>
      <gv-input small placeholder="Small size" ></gv-input>
    
      <div class="title">Disabled</div>
      <gv-input medium disabled></gv-input>
      <gv-input large disabled></gv-input>
       <gv-input small disabled></gv-input>

      <div class="title">Required</div>
      <gv-input placeholder="Required field with placeholder" required></gv-input>
      <gv-input large required></gv-input>
      <gv-input small required></gv-input>

      <div class="title">Skeleton</div>
      <gv-input label="Skeleton field" skeleton></gv-input>
      <gv-input large skeleton ></gv-input>
      <gv-input small skeleton ></gv-input>
   
    `;
  }), { notes });
