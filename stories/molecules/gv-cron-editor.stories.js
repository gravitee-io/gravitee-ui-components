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
import notes from '../../.docs/gv-cron-editor.md';
import '../../src/molecules/gv-cron-editor';
import { makeStory } from '../lib/make-story';

export default {
  title: 'molecules/gv-cron-editor',
  component: 'gv-cron-editor',
  parameters: {
    notes,
    // DO NOT REACTIVATE a11y on these stories for now as the a11y checks are taking forever to run
    a11y: { disable: true },
  },
};

const conf = {
  component: 'gv-cron-editor',
};

const modes = ['seconds', 'minutes', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'pro'];

export const Simple = makeStory(conf, {
  items: modes.map((mode) => ({ mode })),
});

export const WithValue = makeStory(conf, {
  items: [{ value: '30 10 */5 * * MON-FRI' }],
});
