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
export function isCodemirror(control) {
  return control['x-schema-form'] && control['x-schema-form'].type === 'codemirror';
}

export function isObject(control) {
  return control.type === 'object';
}

export function isComplexArray(control) {
  return control.type === 'array' && !control.items.enum;
}

export function canInline(schema) {
  if (schema.properties) {
    const keys = Object.keys(schema.properties);
    return keys.length === 2 && keys.filter((key) => _canInline(schema, key)).length === keys.length;
  }
  return true;
}

function _canInline(schema, key) {
  const property = schema.properties[key];
  return !isCodemirror(property) && !isObject(property) && !isComplexArray(property);
}

export function canGrid(schema) {
  const keys = Object.keys(schema.properties || {});
  return keys.length > 2 && keys.filter((key) => _canInline(schema, key)).length === keys.length;
}
