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
import '../../src/molecules/gv-user-avatar';
import notes from '../../.docs/gv-user-avatar.md';
import avatar from '../../assets/images/logo.png';
import { makeStory } from '../lib/make-story';

export default {
  title: 'Molecules|gv-user-avatar',
  component: 'gv-user-avatar',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-user-avatar',
};

const user = { display_name: 'Gravatar', _links: { avatar } };

export const withPicture = makeStory(conf, {
  items: [{ user }, { user, size: 150 }],
});

export const withoutPicture = makeStory(conf, {
  items: [{ user: { display_name: `Jean Jean` } }, { user: { display_name: `Jean Jean` }, size: 150 }],
});

export const Empty = makeStory(conf, {
  items: [{ }],
});
