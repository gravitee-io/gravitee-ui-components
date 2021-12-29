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
import './gv-relative-time';
import { makeStory } from '../../../testing/lib/make-story';

export function createDateAgo({ seconds = 0, minutes = 0, hours = 0, days = 0, weeks = 0, months = 0, years = 0 }) {
  const nowTs = new Date().getTime();
  const targetTs =
    nowTs -
    seconds * 1000 -
    minutes * 1000 * 60 -
    hours * 1000 * 60 * 60 -
    days * 1000 * 60 * 60 * 24 -
    weeks * 1000 * 60 * 60 * 24 * 7 -
    months * 1000 * 60 * 60 * 24 * (365.25 / 12) -
    years * 1000 * 60 * 60 * 24 * 365.25;
  const targetDate = new Date(targetTs);
  return targetDate.toISOString();
}

const STEPS = [1, 5, 10, 20, 30, 45];

export default {
  title: 'Atoms/gv-relative-time',
  component: 'gv-relative-time',
  parameters: { chromatic: { disable: true } },
  excludeStories: ['createDateAgo'],
};

const conf = {
  component: 'gv-relative-time',
  css: `gv-relative-time {
    display: inline-block;
    margin-right: 1rem;
  }`,
};

export const now = makeStory(conf, {
  items: () => [{ datetime: createDateAgo({}) }],
});

export const secondsAgo = makeStory(conf, {
  items: () => STEPS.map((seconds) => ({ datetime: createDateAgo({ seconds }) })),
});

export const minutesAgo = makeStory(conf, {
  items: () => STEPS.map((minutes) => ({ datetime: createDateAgo({ minutes }) })),
});

export const hoursAgo = makeStory(conf, {
  items: () => STEPS.map((hours) => ({ datetime: createDateAgo({ hours }) })),
});

export const daysAgo = makeStory(conf, {
  items: () => STEPS.map((days) => ({ datetime: createDateAgo({ days }) })),
});

export const weeksAgo = makeStory(conf, {
  items: () => STEPS.map((weeks) => ({ datetime: createDateAgo({ weeks }) })),
});

export const monthsAgo = makeStory(conf, {
  items: () => STEPS.map((months) => ({ datetime: createDateAgo({ months }) })),
});

export const yearsAgo = makeStory(conf, {
  items: () => STEPS.map((years) => ({ datetime: createDateAgo({ years }) })),
});
yearsAgo.parameters = {
  ...yearsAgo.parameters,
  chromatic: { disable: false },
};
