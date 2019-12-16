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
export function truncate (text, limit = 250, suffix = '...') {
  return text && text.length > limit ? `${text.substring(0, limit)}${suffix}` : text;
}

export function isSameRoutes (routes, futureRoutes) {
  if (routes && futureRoutes) {
    const same = JSON.stringify(routes.map((r) => r.path)) === JSON.stringify(futureRoutes.map((r) => r.path));
    if (same) {
      const future = futureRoutes.filter((r) => r.active);
      const current = routes.filter((r) => r.active);
      return future.length === current.length;
    }
    return same;
  }
  return false;
}
