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
import '../../src/atoms/gv-image';
import notes from '../../.docs/gv-image.md';
import '../../src/atoms/gv-icon';
import logo from '../../assets/images/gravitee-logo.png';
import logoImage from '../../assets/images/gravitee-logo-inline.png';
import { makeStory, storyWait } from '../lib/make-story';

const items = [
  { src: logoImage, alt: 'Gravitee', class: 'horizontal' },
  { src: logo, alt: 'Gravitee' },
];

export default {
  title: 'Atoms/gv-image',
  component: 'gv-image',
  parameters: { notes },
};

const conf = {
  component: 'gv-image',
  css: `
    gv-image {
      height: 75px;
      margin-right: 1rem;
      width: 75px
    }

    .horizontal {
      width: 450px;
    }
  `,
};

export const Simple = makeStory(conf, {
  items,
});

export const empty = makeStory(conf, {
  items: [{ alt: 'Gravitee' }],
});

export const errors = makeStory(conf, {
  items: [{ src: 'http://localhost/fake', alt: 'Gravitee' }],
});

export const skeleton = makeStory(conf, {
  items: [{ alt: 'Gravitee', skeleton: true }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.src = logo;
    }),
  ],
});

export const skeletonAndError = makeStory(conf, {
  items: [{ alt: 'Gravitee', skeleton: true }],
  simulations: [
    storyWait(3000, ([component]) => {
      component.src = 'http://localhost/fake';
    }),
  ],
});
