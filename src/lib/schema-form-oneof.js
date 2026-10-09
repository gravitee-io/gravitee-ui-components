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
import { css, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { del } from 'object-path';
import { formatFormLevelError, getFormLevelErrors, inferOneOfIndex, normalizeControlForSchemaForm, resolveSchemaNode } from './schema-form';

export function renderSchemaFormControl({
  key,
  controlOverride = null,
  requiredOverride = null,
  schema,
  errors,
  skeleton,
  readonly,
  value,
  evaluateCondition,
  onHidden,
}) {
  const source = controlOverride || schema.properties?.[key];
  const control = normalizeControlForSchemaForm(source) || {};
  const isRequired =
    (requiredOverride != null ? requiredOverride : schema.required?.includes(key)) || evaluateCondition(control, 'required');
  const isDisabled = schema.disabled?.includes(key) || evaluateCondition(control, 'disabled');
  const isHidden = evaluateCondition(control, 'hidden');
  if (isHidden) {
    onHidden?.(key);
  }
  const isReadonly = readonly || control.readOnly === true;
  const isWriteOnly = control.writeOnly === true;
  return html`<gv-schema-form-control
    .id="${key}"
    .errors="${errors}"
    .control="${control}"
    .skeleton="${skeleton}"
    .value="${value}"
    ?readonly="${isReadonly}"
    ?writeonly="${isWriteOnly}"
    ?required="${isRequired}"
    ?disabled="${isDisabled}"
    ?hidden="${isHidden}"
  ></gv-schema-form-control>`;
}

export const schemaFormOneOfStyles = css`
  .form-level-error {
    margin: 0.4rem;
  }

  .oneof-select {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin: var(--gv-schema-form-control--m, var(--gv-schema-form-group-control--m, 0.4rem));
    width: calc(100% - 0.8rem);
    align-self: center;
    box-sizing: border-box;
  }

  .oneof-select__label {
    font-size: 0.85rem;
    font-weight: 600;
  }

  .oneof-select select {
    width: 100%;
    padding: 0.45rem 0.5rem;
    border: 1px solid var(--gv-theme-neutral-color-dark, #d9d9d9);
    border-radius: 2px;
    background: var(--bgc);
    color: inherit;
    font: inherit;
  }
`;

export function syncSelectedOneOfIndex(values, oneOf, currentIndex, rootSchema = {}) {
  if (!Array.isArray(oneOf) || oneOf.length === 0) {
    return null;
  }
  const inferred = inferOneOfIndex(values, oneOf, rootSchema);
  return inferred != null ? inferred : currentIndex;
}

export function switchOneOfBranch(values, oneOf, prevIndex, nextIndex, rootSchema = {}) {
  if (!Array.isArray(oneOf) || oneOf[nextIndex] == null) {
    return prevIndex;
  }
  if (prevIndex != null && prevIndex !== nextIndex && oneOf[prevIndex]) {
    const previousBranch = resolveSchemaNode(oneOf[prevIndex], rootSchema);
    const nextBranch = resolveSchemaNode(oneOf[nextIndex], rootSchema);
    const nextProps = new Set(Object.keys(nextBranch.properties || {}));
    for (const key of Object.keys(previousBranch.properties || {})) {
      if (!nextProps.has(key)) {
        del(values, key);
      }
    }
  }
  return nextIndex;
}

export function renderFormLevelErrors(errors) {
  return getFormLevelErrors(errors).map(
    (error) => html`<gv-input-message class="form-level-error" level="warning">${formatFormLevelError(error)}</gv-input-message>`,
  );
}

export function renderRootOneOfPart({ schema, selectedIndex, readonly, onSelect, renderControl }) {
  const oneOf = schema?.oneOf;
  if (!Array.isArray(oneOf) || oneOf.length === 0) {
    return html``;
  }
  const titles = oneOf.map((branch, i) => {
    const resolved = resolveSchemaNode(branch, schema);
    return (resolved.title || branch.title || `Option ${i + 1}`).trim();
  });
  let branchControls = html``;
  if (selectedIndex != null && oneOf[selectedIndex]) {
    const branch = resolveSchemaNode(oneOf[selectedIndex], schema);
    const properties = branch.properties || {};
    const required = branch.required || [];
    branchControls = html`${repeat(
      Object.keys(properties),
      (key) => `${selectedIndex}:${key}`,
      (key) => renderControl(key, properties[key], required.includes(key)),
    )}`;
  }
  return html`
    <label class="oneof-select">
      <span class="oneof-select__label">Select option</span>
      <select .value="${selectedIndex != null ? String(selectedIndex) : ''}" ?disabled="${readonly}" @change="${onSelect}">
        <option value="" disabled ?selected="${selectedIndex == null}">Select option</option>
        ${titles.map((title, index) => html`<option value="${index}" ?selected="${selectedIndex === index}">${title}</option>`)}
      </select>
    </label>
    ${branchControls}
  `;
}

export function renderGroupedSchemaControls(groups, keys, renderControl, renderOneOfPart) {
  const groupsCleaned = groups.reduce((prev, group) => {
    const itemsExistingInSchemaKeys = keys.filter((key) => [...(group.items || [])].includes(key));
    prev.push({
      ...group,
      items: itemsExistingInSchemaKeys || [],
    });
    return prev;
  }, []);

  let defaultGroup = groupsCleaned.find((g) => g.default);
  if (!defaultGroup) {
    defaultGroup = { default: true, items: [] };
    groupsCleaned.push(defaultGroup);
  }
  const zipGroupedItems = groupsCleaned.reduce((prev, group) => {
    if (group === defaultGroup) {
      return prev;
    }
    return [...prev, ...group.items];
  }, []);
  defaultGroup.items = keys.filter((key) => !zipGroupedItems.includes(key));

  return repeat(groupsCleaned, (group) => {
    const controls = html`${repeat(
      group.items,
      (key) => key,
      (key) => renderControl(key),
    )}
    ${group.default ? renderOneOfPart() : ''}`;
    if (group.name) {
      return html`<h2 class="group-title">${group.name}</h2>
        ${controls}`;
    }
    return controls;
  });
}
