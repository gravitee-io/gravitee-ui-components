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
import { get } from 'object-path';
import { renderRootOneOfPart, renderSchemaFormControl, switchOneOfBranch, syncSelectedOneOfIndex } from '../lib/schema-form-oneof';

/**
 * Shared root-oneOf behaviour for gv-schema-form and gv-schema-form-group.
 * Hosts must implement `_getSchemaFormModel()` and `_afterOneOfBranchChange()`.
 * @mixinFunction
 */
export function SchemaFormOneOf(ParentClass) {
  /**
   * @mixinClass
   */
  return class extends ParentClass {
    static get properties() {
      return {
        ...super.properties,
        _selectedOneOfIndex: { type: Number, attribute: false },
      };
    }

    constructor() {
      super();
      this._selectedOneOfIndex = null;
    }

    _getSchemaFormModel() {
      throw new Error('_getSchemaFormModel() must be implemented');
    }

    _afterOneOfBranchChange() {
      throw new Error('_afterOneOfBranchChange() must be implemented');
    }

    _syncOneOfIndex(forceReinfer = false) {
      this._selectedOneOfIndex = syncSelectedOneOfIndex(
        this._getSchemaFormModel(),
        this.schema?.oneOf,
        forceReinfer ? null : this._selectedOneOfIndex,
        this.schema,
      );
    }

    willUpdate(changedProperties) {
      if (changedProperties.has('schema')) {
        this._syncOneOfIndex(true);
      }
      super.willUpdate?.(changedProperties);
    }

    _onOneOfSelect(e) {
      const next = Number(e.target.value);
      if (Number.isNaN(next)) {
        return;
      }
      const oneOf = this.schema?.oneOf;
      if (!Array.isArray(oneOf) || oneOf[next] == null) {
        return;
      }
      const previous = this._selectedOneOfIndex;
      this._selectedOneOfIndex = switchOneOfBranch(this._getSchemaFormModel(), oneOf, previous, next, this.schema);
      if (this._selectedOneOfIndex !== previous) {
        this._afterOneOfBranchChange();
      }
    }

    _renderControl(key, controlOverride = null, requiredOverride = null) {
      return renderSchemaFormControl({
        key,
        controlOverride,
        requiredOverride,
        schema: this.schema,
        errors: this.errors,
        skeleton: this.skeleton,
        readonly: this.readonly,
        value: get(this._getSchemaFormModel(), key),
        evaluateCondition: (control, attribute) => this._evaluateCondition(control, attribute),
        onHidden: (hiddenKey) => this._ignoreProperties.push(hiddenKey),
      });
    }

    _renderOneOfPart() {
      return renderRootOneOfPart({
        schema: this.schema,
        selectedIndex: this._selectedOneOfIndex,
        readonly: this.readonly,
        onSelect: this._onOneOfSelect.bind(this),
        renderControl: this._renderControl.bind(this),
      });
    }
  };
}
