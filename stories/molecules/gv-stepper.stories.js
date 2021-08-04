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
import { makeStory } from '../lib/make-story';
import { deepClone } from '../../src/lib/utils';

export default {
  title: 'Molecules/gv-stepper',
  component: 'gv-stepper',
  parameters: {
    chromatic: { delay: 2000 },
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

const validStep = deepClone(steps);
validStep[0].valid = true;

export const withValidStep = makeStory(conf, {
  items: [{ steps: validStep }],
});
withValidStep.parameters = {
  ...withValidStep.parameters,
  chromatic: { disable: true },
};

const validSteps = deepClone(validStep);
validSteps[1].valid = true;

export const withTwoValidateStep = makeStory(conf, {
  items: [{ steps: validSteps, current: 3 }],
});

const invalidSteps = deepClone(validSteps);
invalidSteps[0].invalid = true;

export const withInvalidStep = makeStory(conf, {
  items: [{ steps: invalidSteps, current: 3 }],
});
withInvalidStep.parameters = {
  ...withInvalidStep.parameters,
  chromatic: { disable: true },
};
