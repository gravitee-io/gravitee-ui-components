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
import '../../src/molecules/gv-plans';
import notes from '../../.docs/gv-plans.md';
import { makeStory, storyWait } from '../lib/make-story';

export default {
  title: 'Molecules|gv-plans',
  component: 'gv-plans',
  parameters: {
    notes,
  },
};

const plans = [
  {
    name: 'Standard (9,90€/mois)',
    description: 'Idéal pour les petites organisations. (10 à 30 API)',
    characteristics: [
      '100 000 appels / mois',
      'Accès en lecture seule',
      'SLA Garanti',
      'API key nécessaire',
    ],
  },
  {
    name: 'Premium (21,90€/mois)',
    description: 'Une offre pour les grandes organisations. (31 à 500 API)',
    characteristics: [
      '500 000 appels / mois',
      'Accès complet',
      'SLA Garanti',
      'API key nécessaire',
    ],
  },
];

const conf = {
  component: 'gv-plans',
};

export const basics = makeStory(conf, {
  items: [{ plans: plans }],
});

export const empty = makeStory(conf, {
  items: [{}],
});

export const loading = makeStory(conf, {
  items: [{
    plans: new Promise(() => ({})),
  }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.plans = plans;
    }),
  ],
});

export const loadingAndError = makeStory(conf, {
  items: [{
    plans: new Promise(() => ({})),
  }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.plans = Promise.reject(new Error());
    }),
  ],
});
