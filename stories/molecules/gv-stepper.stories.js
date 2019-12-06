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
import '../../src/molecules/gv-stepper.js';
import notes from '../../.docs/gv-stepper.md';
import { storiesOf } from '@storybook/html';
import { text } from '@storybook/addon-knobs';
import { withCustomEventActions } from '../lib/event-action';

const withActions = withCustomEventActions('gv-stepper:change');

const description = 'This is description';
const t1 = text('Step 1', 'Choix du plan');
const d1 = text('Description 1', description);
const t2 = text('Step 2', `Choix de l'application`);
const d2 = text('Description 2', description);
const t3 = text('Step 3', 'Validation');
const d3 = text('Description 3', description);

const _steps = [
  { title: t1, description: d1 },
  { title: t2, description: d2 },
  { title: t3, description: d3 },
];

storiesOf('2. Molecules|<gv-stepper>', module)
  .addParameters({ notes })
  .add('Basics', withActions(() => {

    const container = document.createElement('div');

    container.innerHTML = `
      <div class="title">Initial</div>
      
      <div style="background-color: white; padding: 30px 0;">
            <gv-stepper id="initial"></gv-stepper>
      </div>
      
      <div class="title">Current step</div>
       
      <div style="background-color: white; padding: 30px 0;">
         <gv-stepper id="cur" current="1"></gv-stepper>
      </div>
      
      <div class="title">Validate one step</div>
       
      <div style="background-color: white; padding: 30px 0;">
         <gv-stepper id="validate" current="2"></gv-stepper>
      </div>
      
      <div class="title">Validate two steps</div>
       
      <div style="background-color: white; padding: 30px 0;">
         <gv-stepper id="validate2" current="3"></gv-stepper>
      </div>
      
    `;

    const steps = JSON.parse(JSON.stringify(_steps));
    steps[0].description = 'yeah man';

    const currentSteps = JSON.parse(JSON.stringify(_steps));

    const validateSteps = JSON.parse(JSON.stringify(_steps));
    validateSteps[0].validate = true;
    const validateSteps2 = JSON.parse(JSON.stringify(validateSteps));
    validateSteps2[1].validate = true;

    container.querySelector('#initial').steps = steps;

    container.querySelector('#cur').steps = currentSteps;
    container.querySelector('#cur').current = Promise.resolve(1);

    container.querySelector('#validate').steps = validateSteps;
    container.querySelector('#validate2').steps = Promise.resolve(validateSteps2);
    container.querySelector('#validate2').currenrt = Promise.resolve(3);
    return container;
  }))

  .add('Errors', withActions(() => {

    const container = document.createElement('div');

    container.innerHTML = `
      <div class="title">Validate but no current</div>
       
      <div style="background-color: white; padding: 30px 0;">
         <gv-stepper id="validate1"></gv-stepper>
      </div>
      
      <div class="title">Validate with wrong current</div>
       
      <div style="background-color: white; padding: 30px 0;">
         <gv-stepper id="validate2"></gv-stepper>
      </div>
      
      <div class="title">Reject</div>
       
      <div style="background-color: white; padding: 30px 0;">
         <gv-stepper id="reject"></gv-stepper>
      </div>
      
    `;
    const validateSteps = JSON.parse(JSON.stringify(_steps));
    validateSteps[0].validate = true;
    validateSteps[1].validate = true;
    const validateSteps2 = JSON.parse(JSON.stringify(validateSteps));

    container.querySelector('#validate1').steps = validateSteps;
    container.querySelector('#validate2').steps = validateSteps2;
    container.querySelector('#reject').steps = Promise.reject(new Error('error'));

    return container;
  }));
