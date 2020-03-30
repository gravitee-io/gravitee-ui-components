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
export function isInvalid (date, min, max, noTime = true, disabledDates = []) {
  if (date) {
    if (min) {
      const minDate = new Date(min * 1000);
      if (noTime) {
        minDate.setHours(0, 0);
      }
      minDate.setSeconds(0, 0);
      if (date < minDate.getTime() / 1000) {
        return true;
      }
    }
    if (max) {
      const maxDate = new Date(max * 1000);
      if (noTime) {
        maxDate.setHours(23, 59);
      }
      maxDate.setSeconds(59, 59);
      if (date > maxDate.getTime() / 1000) {
        return true;
      }
    }

    if (disabledDates.findIndex((disabledDay) => parseInt(disabledDay, 10) === date) !== -1) {
      return true;
    }
  }
  return false;
}
