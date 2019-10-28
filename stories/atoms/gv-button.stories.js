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
      <gv-button icon="thirdparty:github" outlined class="github_outlined">Sign in with GitHub</gv-button>
      <gv-button icon="thirdparty:github" class="github">Sign in with GitHub</gv-button>

      <gv-button icon="thirdparty:google" outlined class="google_outlined">Sign in with Google</gv-button>
      <gv-button icon="thirdparty:google" class="google">Sign in with Google</gv-button>
      
      <gv-button icon="thirdparty:oidc" outlined class="oidc_outlined">Sign in with OIDC</gv-button>
      <gv-button icon="thirdparty:oidc" class="oidc">Sign in with OIDC</gv-button>
      
      <gv-button icon="thirdparty:graviteeio_am" outlined class="graviteeio_am_outlined">Sign in with Gravitee.io AM</gv-button>
      <gv-button icon="thirdparty:graviteeio_am" class="graviteeio_am">Sign in with Gravitee.io AM</gv-button>
    `;
  }), { notes });
