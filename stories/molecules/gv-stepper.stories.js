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
import '../../src/molecules/gv-stepper';
import notes from '../../.docs/gv-stepper.md';
import { makeStory } from '../lib/make-story';

export default {
  title: 'Molecules|gv-stepper',
  component: 'gv-stepper',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-stepper',
};
const description = 'This is description';
const steps = [
  { title: 'Choix du plan', description },
  { title: `Choix de l'application`, description },
  { title: 'Validation', description },
];

export const basics = makeStory(conf, {
  items: [{ steps }],
});

export const withCurrentStep = makeStory(conf, {
  items: [{ steps, current: 1 }],
});

const validateSteps = JSON.parse(JSON.stringify(steps));
validateSteps[0].validate = true;

export const withValidateStep = makeStory(conf, {
  items: [{ steps: validateSteps }],
});

const validateSteps2 = JSON.parse(JSON.stringify(validateSteps));
validateSteps2[1].validate = true;

export const withTwoValidateStep = makeStory(conf, {
  items: [{ steps: validateSteps2, current: 3 }],
});
