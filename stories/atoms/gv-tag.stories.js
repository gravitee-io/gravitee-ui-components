import '../../src/atoms/gv-tag.js';
import notes from '../../.docs/gv-tag.md';
import '../../src/icons/shapes/all-shapes';
import { storiesOf } from '@storybook/html';
import { text } from '@storybook/addon-knobs';
import { withActions } from '@storybook/addon-actions';

const eventNames = ['click gv-tag'];

storiesOf('Components.Atoms', module)
  .addParameters({ notes })
  .add('<gv-tag>', () => withActions(...eventNames)(() => {

    const label = text('Tag label', '');

    return `
      <div class="title">Default</div>
      <gv-tag>${label || 'Productivity'}</gv-tag>
      <gv-tag>${label || 'User Experience'}</gv-tag>
      <gv-tag skeleton>${label || 'UX'}</gv-tag>
      <gv-tag icon="communication:add-user">${label || 'Add user'}</gv-tag>
      
      <div class="title">Major</div>
      <gv-tag major minor>${label || 'Design System'}</gv-tag>
      <gv-tag major>${label || 'UX'}</gv-tag>
      <gv-tag major skeleton>${label || 'UX'}</gv-tag>
      <gv-tag major icon="communication:shield-user"  style="--gv-icon:#fff">${label || 'Administrator'}</gv-tag>
      
      <div class="title">Minor</div>
      <gv-tag minor>${label || 'UI'}</gv-tag>
      <gv-tag minor>${label || 'Awesome'}</gv-tag>
      <gv-tag minor skeleton>${label || 'UX'}</gv-tag>
      <gv-tag minor icon="communication:thumbtack">${label || 'Pin'}</gv-tag>
    `;
  }));
