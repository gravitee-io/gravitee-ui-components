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
  return control['x-schema-form']?.type === 'codemirror';
}

export function resolveSchemaNode(node, rootSchema, seen = new Set()) {
  if (node == null || typeof node !== 'object') {
    return node;
  }
  if (typeof node.$ref === 'string') {
    const ref = node.$ref;
    if (seen.has(ref)) {
      return {};
    }
    seen.add(ref);
    const path = ref.replace(/^#\//, '').split('/');
    let target = rootSchema;
    for (const segment of path) {
      target = target?.[segment];
    }
    const rest = { ...node };
    delete rest.$ref;
    return resolveSchemaNode({ ...target, ...rest }, rootSchema, seen);
  }
  if (node.properties) {
    const properties = {};
    for (const [key, value] of Object.entries(node.properties)) {
      properties[key] = resolveSchemaNode(value, rootSchema, new Set(seen));
    }
    return { ...node, properties };
  }
  if (node.items) {
    return { ...node, items: resolveSchemaNode(node.items, rootSchema, new Set(seen)) };
  }
  return node;
}

const normalizedControls = new WeakMap();

export function normalizeControlForSchemaForm(control, seen = new Set()) {
  if (control == null || typeof control !== 'object') {
    return control;
  }
  const cached = normalizedControls.get(control);
  if (cached) {
    return cached;
  }
  if (seen.has(control)) {
    return control;
  }
  seen.add(control);
  let next = { ...control };
  if (next.format === 'gio-code-editor') {
    const language = next.gioConfig?.monacoEditorConfig?.language || 'javascript';
    const existing = next['x-schema-form'];
    next = {
      ...next,
      'x-schema-form': {
        ...existing,
        type: 'codemirror',
        codemirrorOptions: {
          mode: language,
          lineNumbers: true,
          ...existing?.codemirrorOptions,
        },
      },
    };
  }
  if (next.gioConfig?.uiType === 'resource-type') {
    const resourceType = next.gioConfig.uiTypeProps?.resourceType;
    const existing = next['x-schema-form'];
    next = {
      ...next,
      'x-schema-form': {
        ...existing,
        event: {
          name: 'fetch-resources',
          regexTypes: resourceType || '.*',
        },
      },
    };
  }
  if (next.type === 'object' && next.properties) {
    const properties = {};
    for (const [key, value] of Object.entries(next.properties)) {
      properties[key] = normalizeControlForSchemaForm(value, seen);
    }
    next = { ...next, properties };
  }
  normalizedControls.set(control, next);
  return next;
}

function matchesBranchDiscriminators(model, branch) {
  const properties = branch.properties || {};
  for (const [key, property] of Object.entries(properties)) {
    if (property == null || typeof property !== 'object') {
      continue;
    }
    if (Object.hasOwn(property, 'const') && model[key] != null && model[key] !== property.const) {
      return false;
    }
    if (Array.isArray(property.enum) && model[key] != null && !property.enum.includes(model[key])) {
      return false;
    }
  }
  return true;
}

export function inferOneOfIndex(values, oneOf, rootSchema = {}) {
  if (!Array.isArray(oneOf) || oneOf.length === 0) {
    return null;
  }
  const model = values || {};
  const resolved = oneOf.map((branch) => resolveSchemaNode(branch, rootSchema));

  for (let i = 0; i < resolved.length; i++) {
    const branch = resolved[i];
    const required = branch.required || [];
    if (
      required.length > 0 &&
      required.every((key) => model[key] != null && model[key] !== '') &&
      matchesBranchDiscriminators(model, branch)
    ) {
      return i;
    }
  }
  for (let i = 0; i < resolved.length; i++) {
    const props = Object.keys(resolved[i].properties || {});
    const exclusive = props.filter((key) => resolved.every((branch, j) => j === i || branch.properties?.[key] == null));
    if (exclusive.some((key) => model[key] != null && model[key] !== '') && matchesBranchDiscriminators(model, resolved[i])) {
      return i;
    }
  }
  return null;
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
    (error) => error?.property === 'instance' && (error.name === 'oneOf' || error.name === 'anyOf') && Array.isArray(error.argument),
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
  const match = /^"(.*)"$/s.exec(entry);
  return match ? match[1] : entry;
}
