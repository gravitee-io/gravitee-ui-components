/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import '../../src/atoms/gv-button.js';
import notes from '../../.docs/gv-button.md';
import '../../src/icons/shapes/all-shapes';
import { storiesOf } from '@storybook/html';
import { boolean, text } from '@storybook/addon-knobs';
import { withActions } from '@storybook/addon-actions';
import { updateBooleanAttributes } from '../lib/update-attributes';

const eventNames = ['click gv-button'];

storiesOf('Components.Atoms', module)
  .addParameters({ notes })
  .add('<gv-button>', () => withActions(...eventNames)(() => {

    const label = text('Button label', '');
    const disabled = boolean('Disabled', false);
    const skeleton = boolean('Skeleton', false);

    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title"> Default </div>
      
      <gv-button>${label || 'Simple'}</gv-button>
      <gv-button outlined>${label || 'Simple outlined'}</gv-button>
      <gv-button icon="cooking:dish" style="--gv-icon--c:white">${label || 'Simple icon'}</gv-button>
      <gv-button icon="cooking:dish" style="--gv-icon--c:white"></gv-button>
      
      <div class="title"> Primary </div>
      <gv-button primary>${label || 'Simple'}</gv-button>
      <gv-button primary outlined>${label || 'Simple outlined'}</gv-button>
      <gv-button primary icon="cooking:dish" style="--gv-icon--c:orange">${label || 'Simple icon'}</gv-button>
      <gv-button primary icon="cooking:dish" style="--gv-icon--c:orange"></gv-button>
       
      <div class="title">Github</div>
      <gv-button icon="thirdparty:github" outlined class="github_outlined">Sign in with GitHub</gv-button>
      <gv-button icon="thirdparty:github" class="github">Sign in with GitHub</gv-button>

      <div class="title">Google</div>
      <gv-button icon="thirdparty:google" outlined class="google_outlined">Sign in with Google</gv-button>
      <gv-button icon="thirdparty:google" class="google">Sign in with Google</gv-button>
      
      <div class="title">Oidc</div>
      <gv-button icon="thirdparty:oidc" outlined class="oidc_outlined">Sign in with OIDC</gv-button>
      <gv-button icon="thirdparty:oidc" class="oidc">Sign in with OIDC</gv-button>
      
      <div class="title">Gravitee</div>
      <gv-button icon="thirdparty:graviteeio_am" outlined class="graviteeio_am_outlined">Sign in with Gravitee.io AM</gv-button>
      <gv-button icon="thirdparty:graviteeio_am" class="graviteeio_am">Sign in with Gravitee.io AM</gv-button>
    `;

    const nodeList = container.querySelectorAll('gv-button');
    updateBooleanAttributes(nodeList, 'disabled', disabled);
    updateBooleanAttributes(nodeList, 'skeleton', skeleton);
    return container;
  }));
