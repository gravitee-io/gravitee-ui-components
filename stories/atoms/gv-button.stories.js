import '../../src/atoms/gv-button.js';
import notes from '../../.docs/gv-button.md';
import {storiesOf} from '@storybook/html';
import {text} from '@storybook/addon-knobs';
import { withActions } from '@storybook/addon-actions';

const eventNames = ['click gv-button'];

storiesOf('Atoms', module)
  .add('<gv-button>', () => withActions(...eventNames)(() => {

    const label = text('Button label', '');

    return `
      <div class="title">Default:</div>
      <gv-button default>${label || 'Default'}</gv-button>
      <gv-button default disabled>${label || 'Default disabled'}</gv-button>
      <gv-button default outlined>${label || 'Default outlined'}</gv-button>
      <gv-button default outlined disabled>${label || 'Default outlined & disabled'}</gv-button>
      
      <div class="title">Default (skeleton):</div>
      <gv-button skeleton default>${label || 'Default'}</gv-button>
      <gv-button default skeleton disabled>${label || 'Default disabled'}</gv-button>
      <gv-button default skeleton outlined>${label || 'Default outlined'}</gv-button>
      <gv-button default skeleton outlined disabled>${label || 'Default outlined & disabled'}</gv-button>
      
      <div class="title">Primary:</div>
      <gv-button primary>${label || 'Primary'}</gv-button>
      <gv-button primary disabled>${label || 'Primary disabled'}</gv-button>
      <gv-button primary outlined>${label || 'Primary outlined'}</gv-button>
      <gv-button primary outlined disabled>${label || 'Primary outlined & disabled'}</gv-button>
      
      <div class="title">Primary (skeleton):</div>
      <gv-button skeleton primary>${label || 'Primary'}</gv-button>
      <gv-button skeleton primary disabled>${label || 'Primary disabled'}</gv-button>
      <gv-button skeleton primary outlined>${label || 'Primary outlined'}</gv-button>
      <gv-button skeleton primary outlined disabled>${label || 'Primary outlined & disabled'}</gv-button>
    `;
  }), { notes });

