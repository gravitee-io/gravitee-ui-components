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
import '../../src/atoms/gv-input';
import '../../src/atoms/gv-date-picker';
import notes from '../../.docs/gv-date-picker.md';
import { makeStory } from '../lib/make-story';

export default {
  title: 'Atoms/gv-date-picker',
  component: 'gv-date-picker',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-date-picker',
  css: `
    :host {
      height: 350px;
    }
  `,
};

export const BasicUsage = makeStory(conf, {
  items: [{}],
});

export const MinMax = makeStory(conf, {
  items: [{
    max: Date.now(),
    min: Date.now() - (1000 * 60 * 60 * 24 * 2),
  }],
});

export const Range = makeStory(conf, {
  items: [{ range: true }],
});

export const Time = makeStory(conf, {
  items: [{ time: true }],
});

export const RangeTime = makeStory(conf, {
  items: [{ range: true, time: true }],
});

export const RangeTimeMax = makeStory(conf, {
  items: [{
    range: true,
    time: true,
    max: Date.now() + (1000 * 60 * 60 * 24 * 7),
    min: Date.now() - (1000 * 60 * 60 * 24 * 7),
  }],
});

export const DistanceFromNow = makeStory(conf, {
  items: [{
    range: true,
    time: true,
    distanceFromNow: (1000 * 60 * 60 * 24 * 29),
  }],
});
