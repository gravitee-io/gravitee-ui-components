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

const FORM_LEVEL_PREFIXES = {
  oneOf: 'Select exactly one of',
  anyOf: 'Select at least one of',
};

/**
 * Returns validation errors that don't map to any single control: root
 * oneOf/anyOf failures report property === 'instance' with an array argument.
 * They would otherwise be silently dropped by gv-schema-form-control, leaving
 * the user with no feedback on why the form is invalid.
 */
export function getFormLevelErrors(errors) {
  if (!Array.isArray(errors)) return [];
  return errors.filter(
    (error) =>
      error != null && error.property === 'instance' && (error.name === 'oneOf' || error.name === 'anyOf') && Array.isArray(error.argument),
  );
}

/**
 * `jsonschema` builds error.argument as an array of JSON-stringified titles
 * (e.g. '"My title "'). Surface them as a readable comma list rather than the
 * raw `JSON.stringify`'d message.
 */
export function formatFormLevelError(error) {
  const titles = error.argument
    .map(stripJsonStringifyWrap)
    .map((title) => title.trim())
    .filter((title) => title.length > 0);
  if (titles.length === 0) {
    return error.message;
  }
  const prefix = FORM_LEVEL_PREFIXES[error.name];
  return prefix ? `${prefix}: ${titles.join(', ')}` : titles.join(', ');
}

// Strips the surrounding double-quotes JSON.stringify(title) adds, while
// leaving non-string entries (e.g. '<#/defs/Foo>', '[subschema 0]') intact.
function stripJsonStringifyWrap(entry) {
  if (typeof entry !== 'string') return String(entry);
  const match = entry.match(/^"(.*)"$/s);
  return match ? match[1] : entry;
}
