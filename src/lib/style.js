
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
function getPropertyValue (element, propertyName, defaultValue) {
  /* global getComputedStyle */
  const value = getComputedStyle(element).getPropertyValue(propertyName);
  return value || defaultValue;
}

export const getCssVar = function getCssVar (element, variableName, defaultValue) {
  if (element) {
    if (variableName.startsWith('--')) {
      return getPropertyValue(element, variableName, defaultValue);
    }
    return getPropertyValue(element, `--${variableName}`, defaultValue);
  }
  return defaultValue;
};

export function hexToRGB (hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}
