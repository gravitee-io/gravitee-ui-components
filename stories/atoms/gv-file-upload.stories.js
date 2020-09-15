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
import '../../src/atoms/gv-file-upload';
import notes from '../../.docs/gv-file-upload.md';
import { makeStory } from '../lib/make-story';
import img from '../../assets/images/gravitee-logo-inline.png';

export default {
  title: 'Atoms/gv-file-upload',
  component: 'gv-file-upload',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-file-upload',
  css: `
  `,
};

export const BasicUsage = makeStory(conf, {
  items: [{ label: 'Image de l\'application' }],
});

export const InitialValue = makeStory(conf, {
  items: [{ label: 'Image de l\'application', value: [img] }],
});

export const MimeTypesConstraint = makeStory(conf, {
  items: [{ label: 'Image de l\'application', accept: 'image/*', except: '.svg' }],
});

export const SizeLimit = makeStory(conf, {
  items: [{ label: 'Image de l\'application', accept: 'image/*', limit: 500000 }],
});
