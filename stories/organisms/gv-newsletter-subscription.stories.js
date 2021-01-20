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
import '../../src/organisms/gv-newsletter-subscription';
import notes from '../../.docs/gv-newsletter-subscription.md';
import { makeStory } from '../lib/make-story';

export default {
  title: 'Organisms/gv-newsletter-subscription',
  component: 'gv-newsletter-subscription',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-newsletter-subscription',
};

export const Basics = makeStory(conf, {
  items: [
    {},
  ],
});

export const InputDisabled = makeStory(conf, {
  items: [
    { email: 'alreadyprovided@mail.com', disabled: true },
  ],
});

export const OneTagline = makeStory(conf, {
  items: [
    { taglines: ['Only one tagline'] },
  ],
});

export const TwoTagline = makeStory(conf, {
  items: [
    { taglines: ['One tagline', 'And one more'] },
  ],
});

export const MoreTagline = makeStory(conf, {
  items: [
    { taglines: ['One tagline', 'And one more', 'And one more', 'And one more', 'And one more'] },
  ],
});
