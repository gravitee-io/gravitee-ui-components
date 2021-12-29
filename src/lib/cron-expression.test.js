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
import { describe, expect, test } from '@jest/globals';
import { isValidCron } from './cron-expression';

describe('C R O N - E X P R E S S I O N', () => {
  test('should validate expression with seconds', () => {
    expect(isValidCron('*/30 * * * * *', { seconds: true })).toEqual(true);
  });

  test('should validate expression with days of week', () => {
    expect(isValidCron('*/30 * * * * 0-5', { seconds: true })).toEqual(true);
  });

  test('should validate expression with days of week with alias', () => {
    expect(isValidCron('*/30 * * * * SUN-MON', { seconds: true, alias: true })).toEqual(true);
  });
});
