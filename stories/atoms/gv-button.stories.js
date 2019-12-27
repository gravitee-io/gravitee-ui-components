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
import { color, text } from '@storybook/addon-knobs';
import { withActions } from '@storybook/addon-actions';
import { updateInnerText } from '../lib/update-attributes';

const eventNames = ['click gv-button'];

storiesOf('1. Atoms|<gv-button>', module)
  .addParameters({ notes })
  .add('Basics', () => withActions(...eventNames)(() => {

    const label = text('Button label', '');

    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title">Default</div>
      <div class="group">
        <gv-button default>Simple</gv-button>
        <gv-button icon="cooking:dish" style="--gv-icon--c:white"></gv-button>
        <gv-button icon="cooking:dish" style="--gv-icon--c:white">Icon</gv-button>
        <gv-button icon-right="cooking:dish">Icon</gv-button>
        <gv-button disabled>Disabled</gv-button>
        <gv-button icon="cooking:dish" style="--gv-icon--c:white" disabled></gv-button>
        <gv-button disabled icon="cooking:dish" style="--gv-icon--c:white">Disabled icon</gv-button>
        <gv-button outlined default>Outlined</gv-button>
        <gv-button outlined icon="cooking:dish"></gv-button>
        <gv-button outlined icon="cooking:dish">Outlined icon</gv-button>
        <gv-button outlined disabled>Outlined disabled</gv-button>
        <gv-button outlined icon="cooking:dish" disabled></gv-button>
        <gv-button outlined disabled icon="cooking:dish">Outlined disabled icon</gv-button>
        <gv-button outlined loading>Loading</gv-button>
        <gv-button loading style="--gv-icon--c:white">Loading</gv-button>
      </div>

      <div class="generated-zone">
      </div>
    `;

    const variants = [['skeleton'], ['primary'], ['primary', 'skeleton'], ['secondary'], ['secondary', 'skeleton']];
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

    const padding = text('--gv-button--p', '0rem 0.5rem');
    const bdrs = text('--gv-button--bdrs', '0.15rem');
    const fz = text('--gv-button--fz', '14px');
    const btnColor = color('--gv-button--bgc', '');
    const btnPrimaryColor = color('--gv-button-primary--bgc', '');
    const iconColor = color('--gv-icon--c', '');

    container.style = [{ value: padding, prop: '--gv-button--p' },
      { value: fz, prop: '--gv-button--fz' },
      { value: bdrs, prop: '--gv-button--bdrs' },
      { value: btnColor, prop: '--gv-button--bgc' },
      { value: btnPrimaryColor, prop: '--gv-button-primary--bgc' },
      { value: iconColor, prop: '--gv-icon--c' }]
      .filter(({ value }) => value)
      .map(({ value, prop }) => `${prop}:${value}`)
      .join(';');

    return container;
  }))
  .add('Customs', () => withActions(...eventNames)(() => {
    return `
      <div class="title">Github</div>
      <gv-button icon="thirdparty:github" outlined class="github_outlined"><span>Continue with GitHub</span></gv-button>
      <gv-button icon="thirdparty:github" class="github">Continue with GitHub</gv-button>

      <div class="title">Google</div>
      <gv-button icon="thirdparty:google" outlined class="google_outlined">Continue with Google</gv-button>
      <gv-button icon="thirdparty:google" class="google">Continue with Google</gv-button>

      <div class="title">Oidc</div>
      <gv-button icon="thirdparty:oidc" outlined class="oidc_outlined">Continue with OpenID</gv-button>
      <gv-button icon="thirdparty:oidc" class="oidc">Continue with OpenID</gv-button>

      <div class="title">Gravitee</div>
      <gv-button icon="thirdparty:graviteeio_am" outlined class="graviteeio_am_outlined">Continue with Gravitee</gv-button>
      <gv-button icon="thirdparty:graviteeio_am" class="graviteeio_am">Continue with Gravitee</gv-button>
     `;
  }))
  .add('In column', () => withActions(...eventNames)(() => {
    return `
      <div class="title">Column with a fixed width </div>
       <div style="display: flex; flex-direction: column; max-width: 20rem;">
        <gv-button default>Simple</gv-button>
        <gv-button icon="cooking:dish">Simple</gv-button>
        <gv-button icon-right="cooking:dish">Simple</gv-button>
        <gv-button icon="cooking:dish" icon-right="cooking:dish">Simple</gv-button>
        <gv-button disabled>Disabled</gv-button>
        <gv-button disabled icon="cooking:dish" style="--gv-icon--c:white">Disabled icon</gv-button>
        <gv-button outlined default>Outlined</gv-button>
        <gv-button outlined icon="cooking:dish">Outlined icon</gv-button>
        <gv-button outlined disabled>Outlined disabled</gv-button>
        <gv-button outlined disabled icon="cooking:dish">Outlined disabled icon</gv-button>
        <gv-button icon="thirdparty:graviteeio_am" class="graviteeio_am"><span>Gravitee<span>.io<span> AM</span></gv-button>
        <gv-button icon="thirdparty:google" outlined class="google_outlined">Sign in with Google</gv-button>
       </div>
     `;
  }))
  .add('Loading after click', () => withActions(...eventNames)(() => {

    const container = document.createElement('div');

    container.innerHTML = `
       <div class="title">Loading after click</div>
       <gv-button default>Simple</gv-button>
        <gv-button icon="cooking:dish" style="--gv-icon--c:white"></gv-button>
        <gv-button icon="cooking:dish" style="--gv-icon--c:white">Icon</gv-button>
        <gv-button icon-right="cooking:dish">Icon</gv-button>
        <gv-button disabled>Disabled</gv-button>
        <gv-button icon="cooking:dish" style="--gv-icon--c:white" disabled></gv-button>
        <gv-button disabled icon="cooking:dish" style="--gv-icon--c:white">Disabled icon</gv-button>
        <gv-button outlined default>Outlined</gv-button>
        <gv-button outlined icon="cooking:dish"></gv-button>
        <gv-button outlined icon="cooking:dish">Outlined icon</gv-button>
        <gv-button outlined disabled>Outlined disabled</gv-button>
        <gv-button outlined icon="cooking:dish" disabled></gv-button>
        <gv-button outlined disabled icon="cooking:dish">Outlined disabled icon</gv-button>
        <gv-button outlined loading>Loading</gv-button>
        <gv-button loading style="--gv-icon--c:white">Loading</gv-button>
     `;

    container.querySelectorAll('gv-button').forEach((btn) => {
      btn.addEventListener('click', () => {
        btn.setAttribute('loading', true);
        setTimeout(() => {
          btn.removeAttribute('loading');
        }, 2000);
      });
    });

    return container;
  }));
