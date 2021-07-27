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
import { makeStory, storyWait } from '../lib/make-story';

export default {
  title: 'Molecules/gv-plans',
  component: 'gv-plans',
};

const plans = [
  {
    name: 'Free',
    description: 'Une offre sans caractéristique',
  },
  {
    name: 'Standard (9,90€/mois)',
    description: 'Un offre avec des caractéristiques générées',
    validation: 'auto',
    security: 'jwt',
  },
  {
    name: 'Premium (21,90€/mois)',
    description: 'Une offre pour les grandes organisations. (31 à 500 API)',
    characteristics: ['500 000 appels / mois', 'Accès complet', 'SLA Garanti', 'API key nécessaire'],
  },
];

const conf = {
  component: 'gv-plans',
};

export const basicUsage = makeStory(conf, {
  items: [{ plans: plans }],
});

export const onePlan = makeStory(conf, {
  items: [
    {
      plans: [
        {
          name: 'Free',
          description: 'Free plan',
          characteristics: ['500 000 appels / mois', 'Accès complet', 'SLA Garanti', 'API key nécessaire'],
        },
      ],
    },
  ],
});

const multiPlan = [
  {
    name: 'Free',
    description: 'Une offre sans caractéristique',
  },
  {
    name: 'Bronze',
    description:
      'On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de ' +
      "distractions, et empêche de se concentrer sur la mise en page elle-même. L'avantage du Lorem Ipsum sur un " +
      "texte générique comme 'Du texte. Du texte. Du texte.' est qu'il possède une distribution de lettres plus " +
      'ou moins normale, et en tout cas comparable avec celle du français standard. De nombreuses suites logicielles ' +
      'de mise en page ou éditeurs de sites Web ont fait du Lorem Ipsum leur faux texte par défaut, et une recherche ' +
      "pour 'Lorem Ipsum' vous conduira vers de nombreux sites qui n'en sont encore qu'à leur phase de construction. " +
      "Plusieurs versions sont apparues avec le temps, parfois par accident, souvent intentionnellement (histoire d'y " +
      "rajouter de petits clins d'oeil, voire des phrases embarassantes)",
  },
  {
    name: 'Standard (9,90€/mois)',
    description: 'Un offre avec des caractéristiques générées',
    validation: 'auto',
    security: 'jwt',
  },
  {
    name: 'Silver',
    description: 'Une offre sans caractéristique',
  },
  {
    name: 'Premium (21,90€/mois)',
    description: 'Une offre pour les grandes organisations. (31 à 500 API)',
    characteristics: ['500 000 appels / mois', 'Accès complet', 'SLA Garanti', 'API key nécessaire'],
  },
  {
    name: 'Gold',
    description: 'Une offre pour les grandes organisations. (31 à 500 API)',
    characteristics: ['500 000 appels / mois', 'Accès complet', 'SLA Garanti', 'API key nécessaire'],
  },
];

export const Pagination = makeStory(conf, {
  items: [{ plans: multiPlan, size: 3 }],
});

export const empty = makeStory(conf, {
  items: [{}],
});

export const loading = makeStory(conf, {
  items: [
    {
      plans: new Promise(() => ({})),
    },
  ],
  simulations: [
    storyWait(2000, ([component]) => {
      component.plans = plans;
    }),
  ],
});

export const loadingAndError = makeStory(conf, {
  items: [
    {
      plans: new Promise(() => ({})),
    },
  ],
  simulations: [
    storyWait(2000, ([component]) => {
      component.plans = Promise.reject(new Error());
    }),
  ],
});
