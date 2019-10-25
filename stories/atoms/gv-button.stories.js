import '../../src/atoms/gv-button.js';
import notes from '../../.docs/gv-button.md';
import '../../src/icons/shapes/all-shapes';
import { storiesOf } from '@storybook/html';
import { text } from '@storybook/addon-knobs';
import { withActions } from '@storybook/addon-actions';

const eventNames = ['click gv-button'];

storiesOf('Components.Atoms', module)
  .add('<gv-button>', () => withActions(...eventNames)(() => {

    const label = text('Button label', '');

    return `
      <div class="title">Default</div>
      <gv-button default>${label || 'Default'}</gv-button>
      <gv-button icon="cooking:dish" style="--gv-icon--c:white">${label || 'Default'}</gv-button>
      <gv-button default disabled>${label || 'Default disabled'}</gv-button>
      <gv-button default outlined>${label || 'Default outlined'}</gv-button>
      <gv-button default outlined disabled>${label || 'Default outlined & disabled'}</gv-button>
       <gv-button icon="cooking:dish" style="--gv-icon--c:white"></gv-button>
      
      <div class="title">Default (skeleton)</div>
      <gv-button skeleton default>${label || 'Default'}</gv-button>
      <gv-button skeleton icon="cooking:dish">${label || 'Default'}</gv-button>
      <gv-button default skeleton disabled>${label || 'Default disabled'}</gv-button>
      <gv-button default skeleton outlined>${label || 'Default outlined'}</gv-button>
      <gv-button default skeleton outlined disabled>${label || 'Default outlined & disabled'}</gv-button>
       <gv-button skeleton icon="cooking:dish"></gv-button>
      
      <div class="title">Primary</div>
      <gv-button primary>${label || 'Primary'}</gv-button>
      <gv-button primary disabled icon="cooking:dish" style="--gv-icon--c:orange">${label || 'Primary disabled'}</gv-button>
      <gv-button primary outlined>${label || 'Primary outlined'}</gv-button>
      <gv-button primary outlined disabled>${label || 'Primary outlined & disabled'}</gv-button>
      <gv-button primary disabled icon="cooking:dish" style="--gv-icon--c:orange"></gv-button>
       
      <div class="title">Primary (skeleton)</div>
      <gv-button skeleton primary>${label || 'Primary'}</gv-button>
      <gv-button skeleton primary disabled disabled icon="cooking:dish">${label || 'Primary disabled'}</gv-button>
      <gv-button skeleton primary outlined>${label || 'Primary outlined'}</gv-button>
      <gv-button skeleton primary outlined disabled>${label || 'Primary outlined & disabled'}</gv-button>
      <gv-button skeleton primary disabled icon="cooking:dish" style="--gv-icon--c:orange"></gv-button>
      
      <div class="title">Sign In</div>
      <gv-button icon="thirdparty:github" outlined style="--gv-button: var(--github-color); --gv-icon--c: var(--github-color);">Sign in with GitHub</gv-button>
      <gv-button icon="thirdparty:github" style="--gv-button: var(--github-color);--gv-icon--c: #fff;">Sign in with GitHub</gv-button>
      <gv-button icon="thirdparty:google" outlined style="--gv-button: var(--google-color);">Sign in with Google</gv-button>
      <gv-button icon="thirdparty:google" style="--gv-button: var(--google-color);">Sign in with Google</gv-button>
      
      <gv-button icon="thirdparty:oidc" outlined style="--gv-button: var(--oidc-color);">Sign in with OIDC</gv-button>
      <gv-button icon="thirdparty:oidc" style="--gv-button: var(--oidc-color);--gv-icon--c: #fff;">Sign in with OIDC</gv-button>
      
      <gv-button icon="thirdparty:gravitee" outlined style="--gv-button: var(--gv-logo-grey);">Sign in with Gravitee.io AM</gv-button>
      <gv-button icon="thirdparty:gravitee" style="--gv-button: var(--gv-logo-blue);--gv-icon--c: var(--gv-logo-white);">Sign in with Gravitee.io AM</gv-button>
    `;
  }), { notes });
