import '../../src/atoms/gv-state.js';
import notes from '../../.docs/gv-state.md';
import { storiesOf } from '@storybook/html';
import { text } from '@storybook/addon-knobs';
import { withActions } from '@storybook/addon-actions';

const eventNames = ['click gv-state'];

storiesOf('Components.Atoms', module)
  .addParameters({ notes })
  .add('<gv-state>', () => withActions(...eventNames)(() => {

    const label = text('State label', '');

    return `
      <div class="title">Default</div>
      <gv-state>${label || 'beta'}</gv-state>
      <gv-state skeleton>${label || 'Beta'}</gv-state>
      
      <div class="title">Running</div>
      <gv-state running>${label || 'Running'}</gv-state>
      <gv-state running skeleton>${label || 'Running'}</gv-state>
    `;
  }));
