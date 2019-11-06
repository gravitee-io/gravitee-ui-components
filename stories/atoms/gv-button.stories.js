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
import { storiesOf } from '@storybook/html';
import { text } from '@storybook/addon-knobs';
import { withActions } from '@storybook/addon-actions';
import { updateInnerText } from '../lib/update-attributes';

const eventNames = ['click gv-button'];

storiesOf('Components.Atoms', module)
  .addParameters({ notes })
  .add('<gv-button>', () => withActions(...eventNames)(() => {

    const label = text('Button label', '');

    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title">Default</div>
      <div class="group">
        <gv-button default>Simple</gv-button>
        <gv-button icon="cooking:dish" style="--gv-icon--c:white"></gv-button>
        <gv-button icon="cooking:dish" style="--gv-icon--c:white">Icon</gv-button>
        <gv-button disabled>Disabled</gv-button>
        <gv-button icon="cooking:dish" style="--gv-icon--c:white" disabled></gv-button>
        <gv-button disabled icon="cooking:dish" style="--gv-icon--c:white">Disabled icon</gv-button>
        <gv-button outlined default>Outlined</gv-button>
        <gv-button outlined icon="cooking:dish"></gv-button>
        <gv-button outlined icon="cooking:dish">Outlined icon</gv-button>
        <gv-button outlined disabled>Outlined disabled</gv-button>
        <gv-button outlined icon="cooking:dish" disabled></gv-button>
        <gv-button outlined disabled icon="cooking:dish">Outlined disabled icon</gv-button>
      </div>
      
      <div class="generated-zone">
      </div>
       
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

    const variants = [['skeleton'], ['primary'], ['primary', 'skeleton']];
    const generatedZone = container.querySelector('.generated-zone');
    const elements = container.querySelectorAll('.group gv-button');

    variants.forEach((variant) => {

      const title = document.createElement('div');
      title.className = 'title';
      title.innerText = variant.join(' ');
      generatedZone.appendChild(title);
      elements.forEach((e) => {
        const n = e.cloneNode();
        n.innerText = e.innerText;
        variant.forEach((attr) => n.setAttribute(attr, ''));
        generatedZone.appendChild(n);
      });
    });

    const nodeList = container.querySelectorAll('gv-button');
    if (label) {
      updateInnerText(nodeList, label);
    }

    return container;
  }));
