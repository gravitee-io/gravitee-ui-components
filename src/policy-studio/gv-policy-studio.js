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
import { css, html, LitElement } from 'lit-element';
import { methods } from '../lib/studio';
import { dispatchCustomEvent } from '../lib/events';
import '../atoms/gv-button';
import '../atoms/gv-icon';
import '../molecules/gv-option';
import '../organisms/gv-documentation';
import '../organisms/gv-resizable-views';
import '../organisms/gv-schema-form';
import '../organisms/gv-tabs';
import '../molecules/gv-row';
import './gv-flow';
import './gv-flow-step';
import './gv-policy-studio-menu';
import { empty } from '../styles/empty';
import { loadAsciiDoctor } from '../lib/text-format';
import { cache } from 'lit-html/directives/cache';
import { deepClone, deepEqual, uuid } from '../lib/utils';
import { KeyboardElement, KEYS } from '../mixins/keyboard-element';

const FLOW_STEP_FORM_ID = 'flow-step-form';

/**
 *  Studio Policy component
 *
 * @fires gv-policy-studio:select-policy - Select policy event
 * @fires gv-policy-studio:save - When request savet
 *
 * @attr {Array} policies - Policies available
 * @attr {Array} services - Services available
 * @attr {Array} resourceTypes - Resources types available
 * @attr {Array} propertyProviders - Providers of properties
 * @attr {String} tabId - Current tabId to display (design, settings, properties or resources)
 * @attr {Object} definition - The definition of flows
 * @attr {Object} documentation - The documentation to display
 * @attr {Object} flowSchema - The flow form configuration to display in gv-schema-form component
 * @attr {Object} configurationSchema - The form configuration to display in gv-schema-form component
 * @attr {Object} configurationInformation - The information related to api configuration tab
 * @attr {Boolean} isDirty - true if component is dirty
 * @attr {Array} selectedFlowsId - The selected flows id
 * @attr {Boolean} sortable - true if flows are sortable
 * @attr {Boolean} readonly - true if readonly
 * @attr {Boolean} can-add - true if user can add flow
 * @attr {String} flowsTitle - flows menu title
 * @attr {Boolean} has-policy-filter - true if policies have onRequest/onResponse properties
 */
export class GvPolicyStudio extends KeyboardElement(LitElement) {

  static get properties () {
    return {
      policies: { type: Array },
      services: { type: Object },
      resourceTypes: { type: Array, attribute: 'resource-types' },
      propertyProviders: { type: Array, attribute: 'property-providers' },
      tabId: { type: String, attribute: 'tab-id' },
      _tabId: { type: String, attribute: false },
      definition: { type: Object },
      _definition: { type: Object, attribute: false },
      documentation: { type: Object },
      flowSchema: { type: Object },
      configurationSchema: { type: Object },
      _configurationSchema: { type: Object, attribute: false },
      configurationInformation: { type: String },
      isDirty: { type: Boolean, attribute: 'dirty', reflect: true },
      _dragPolicy: { type: Object, attribute: false },
      _dropPolicy: { type: Object, attribute: false },
      selectedFlowsId: { type: Array, attribute: 'selected-flows-id' },
      _selectedFlowsId: { type: Array, attribute: false },
      _currentPolicyId: { type: String, attribute: false },
      _searchPolicyQuery: { type: String, attribute: false },
      _searchFlowQuery: { type: String, attribute: false },
      _flowStepSchema: { type: Object, attribute: false },
      _currentFlowStep: { type: Object, attribute: false },
      _policyFilter: { type: Array, attribute: false },
      _flowFilter: { type: Array, attribute: false },
      _currentAskConfirmation: { type: Boolean, attribute: false },
      hasProperties: { type: Boolean, attribute: 'has-properties' },
      _hasProperties: { type: Boolean, attribute: false },
      hasResources: { type: Boolean, attribute: 'has-resources' },
      hasPlans: { type: Boolean, attribute: 'has-plans' },
      hasPolicyFilter: { type: Boolean, attribute: 'has-policy-filter' },
      flowsTitle: { type: String, attribute: 'flows-title' },
      sortable: { type: Boolean },
      canAdd: { type: Boolean, attribute: 'can-add' },
      readonly: { type: Boolean },
    };
  }

  static get styles () {
    return [
      empty,
      methods,
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          --height: var(--gv-policy-studio--h, calc(100vh - 32px));
          height: var(--height);
          --height-in-tabs: calc(var(--height) - 25px);
        }

        .box {
          height: var(--height);
          display: flex;
        }

        .design, .properties {
          display: flex;
        }

        gv-resizable-views {
          width: 100%;
        }

        .editable-name {
          padding: 0.5rem 1rem;
          font-size: 16px;
        }

        .editable-name span {
          color: #BFBFBF;
          font-size: 12px;
        }

        .form__control {
          margin: 0.5rem;
        }

        gv-input {
          width: 100%;
        }

        .flow-name {
          display: flex;
          align-items: center;
        }

        .flow-name.dirty {
          font-style: italic;
          opacity: 0.8;
        }

        .flow-name gv-icon {
          --gv-icon--s: 24px;
          margin-right: 0.2rem;
        }

        .flow-path {
          margin-left: 0.2rem;
        }

        .title_methods {
          margin-left: 0.5rem;
        }

        .two-cols {
          display: flex;
          width: 100%;
          height: 100%;
        }

        .two-cols > * {
          flex: 1;
        }

        .left-menu {
          border-left: 1px solid #D9D9D9;
          height: var(--height-in-tabs)
        }

        .right-menu {
          border-right: 1px solid #D9D9D9;
          height: var(--height-in-tabs)
        }

        .two-cols > *:first-child {
          border-right: 1px solid #D9D9D9;
        }

        .flow-step__container {
          overflow: hidden;
          position: relative;
          overflow: hidden;
          height: 99%;
        }

        .flow-step__form {
          padding: 0 0.5rem;
          overflow: auto;
        }

        .flow-step__form-title {
          text-transform: uppercase;
          letter-spacing: 0.2rem;
        }

        gv-tabs {
          width: 100%;
          height: 100%;
          display: inline-block;
        }

        gv-resizable-views,
        gv-properties,
        gv-resources {
          height: var(--height-in-tabs);
        }

        gv-properties,
        gv-resources {
          width: 100%;
        }

        .api-settings {
          display: flex;
          flex-direction: column;
          border-left: 1px solid #BFBFBF;
          height: var(--height-in-tabs);
        }

        .api-settings-information {
          display: flex;
          align-items: center;
        }

        .api-settings-information__icon {
          --gv-icon--c: var(--gv-theme-color, #5A7684);
          --gv-icon-opacity--c: var(--gv-theme-color-info-light, #64b5f6);
        }

        .api-settings-information__blockquote {
          border-left: 1px solid var(--gv-theme-color, #5A7684);
          margin: 15px;
          padding-left: 15px;
          font-size: 14px;
        }

        .flow-settings gv-schema-form {
          flex: 1;
          padding: 0.5rem;
        }

        .search {
          display: flex;
          justify-content: stretch;
        }

        gv-input {
          margin: 0.2rem 0;
          width: 100%;
        }

        .header-actions, .search-policies {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0.5rem;
        }

        .search-policies {
          margin: 1.5rem 0.5rem 0.5rem;
        }

        .footer-actions > gv-button.save,
        .footer-actions > gv-option {
          width: 100%;
        }

        .footer-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.5rem 0;
          margin: 0.5rem 15px;
          border-top: 1px solid #BFBFBF;
        }

        .header-actions .title {
          text-transform: uppercase;
          text-align: center;
          letter-spacing: .3rem;
          color: #BFBFBF;
          font-size: 18px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 240px;
          min-height: 25px;
        }

        .header-actions > *,
        .search-policies > * {
          margin-bottom: 1rem;
        }
      `,
    ];
  }

  constructor () {
    super();
    this.isDirty = false;
    this.policies = [];
    this.resourceTypes = [];
    this.tabId = 'design';
    this.selectedFlowsId = [];
    this.flowsTitle = 'Flows';
    this.sortable = false;
    this.services = {};
    this._definition = {
      flows: [],
    };
    this._tabs = [
      { id: 'design', title: 'Design', icon: 'navigation:exchange' },
    ];
    this._policyFilter = [];
    this._flowFilter = [];
    loadAsciiDoctor();
  }

  set hasProperties (value) {
    if (value) {
      import('../organisms/gv-properties').then(() => {
        this._tabs = [...this._tabs, { id: 'properties', title: 'Properties', icon: 'general:settings#1' }];
        this.requestUpdate();
      });
    }
    this._hasProperties = value;
  }

  get hasProperties () {
    return this._hasProperties;
  }

  set hasResources (value) {
    if (value) {
      import('../organisms/gv-resources').then(() => {
        this._tabs = [...this._tabs, { id: 'resources', title: 'Resources', icon: 'general:settings#5' }];
        this.requestUpdate();
      });
    }
  }

  set hasPlans (value) {
    if (value) {
      this._flowFilterOptions = [
        { id: 'api', title: 'Api', icon: 'shopping:box#3' },
        { id: 'plan', title: 'Plans', icon: 'shopping:sale#2' },
      ];
    }
  }

  set hasPolicyFilter (value) {
    if (value) {
      this._policyFilterOptions = [
        { id: 'onRequest', title: 'Request', icon: 'navigation:arrow-from-left' },
        { id: 'onResponse', title: 'Response', icon: 'navigation:arrow-from-right' },
      ];
    }
  }

  set configurationSchema (value) {
    if (value) {
      this._tabs.splice(1, 0, { id: 'settings', title: 'Configuration', icon: 'general:settings#2' });
    }

    this._configurationSchema = value;
  }

  get configurationSchema () {
    return this._configurationSchema;
  }

  onKeyboard () {
    if (this._currentAskConfirmation == null) {
      if (this.isPressed(KEYS.Shift, KEYS.Ctrl, KEYS.Space)) {
        const search = this.shadowRoot.querySelector('#search-policy');
        if (search) {
          search.focus();
        }
      }
      else if (this.isPressed(KEYS.Ctrl, KEYS.Space)) {
        const search = this.shadowRoot.querySelector('#search-flow');
        if (search) {
          search.focus();
        }
      }
      if (this.isPressed(KEYS.Esc)) {
        this._closeFlowStepForm();
        this._onCloseDocumentation();
      }
    }
  }

  set tabId (tabId) {
    if (tabId != null && ['design', 'settings', 'properties', 'resources'].includes(tabId)) {
      this._tabId = tabId;
    }
    else {
      this._tabId = 'design';
    }
  }

  get tabId () {
    return this._tabId;
  }

  set definition (definition) {
    if (definition) {
      const flows = this._generateFlowsId(definition.flows);
      const resources = this._generateId('resource-', definition.resources);
      const plans = definition.plans == null ? [] : definition.plans.map((plan) => {
        return { ...plan, flows: this._generatePlanFlowsId(plan) };
      });
      this._initialDefinition = { ...definition, flows, resources, plans };
      this._definition = deepClone(this._initialDefinition);
      this.isDirty = false;
      this._selectFirstFlow();
    }
  }

  get definition () {
    return this._definition;
  }

  set selectedFlowsId (selectedFlowsId) {
    if (selectedFlowsId != null && Array.isArray(selectedFlowsId)) {
      this._selectedFlowsId = selectedFlowsId.filter((id) => this._findFlowById(id) != null);
      if (selectedFlowsId.length !== this._selectedFlowsId.length) {
        this._selectFirstFlow(true);
      }
    }
  }

  get selectedFlowsId () {
    return this._selectedFlowsId.filter((id) => this._findFlowById(id) != null);
  }

  _updateSelectedFlows (selectedFlowsId) {
    this.selectedFlowsId = selectedFlowsId;
    dispatchCustomEvent(this, 'select-flows', { flows: this.selectedFlowsId });
  }

  _selectFirstFlow (dispatch = false) {
    if (this.selectedFlowsId.length === 0) {
      let candidate = null;
      if (this.definedFlows.length > 0 && this.definedFlows[0]._id != null) {
        candidate = this.definedFlows[0];
      }
      else if (this.definedPlans.length > 0) {
        const plan = this.definedPlans.find((plan) => plan.flows != null && plan.flows.length > 0 && plan.flows[0]._id != null);
        if (plan) {
          candidate = plan.flows[0];
        }
      }
      if (candidate != null) {
        if (dispatch) {
          this._updateSelectedFlows([candidate._id]);
        }
        else {
          this.selectedFlowsId = [candidate._id];
        }
      }
    }
  }

  _getFlowElement (flowId) {
    return this.shadowRoot.querySelector(`[id="${flowId}"]`);
  }

  _onDragEndPolicy () {
    this.shadowRoot.querySelectorAll('gv-flow').forEach((e) => e.onDragEnd());
  }

  async _onDropPolicy ({ detail }) {
    try {

      await this._askToValidateForms();

      const policy = detail.policy;

      let name = policy.name;
      let description = '';
      let configuration = {};
      let _id;
      let _new = false;
      if (detail.flowStep) {
        _id = detail.flowStep._id;
        name = detail.flowStep.name;
        description = detail.flowStep.description || '';
        configuration = detail.flowStep.configuration;
      }
      else {
        _id = uuid();
        _new = true;
      }

      const flowStep = { _id, _new, name, policy: policy.id, description, enabled: true, configuration };

      const targetFlow = this._findFlowById(detail.flowId);
      const sourceFlow = detail.sourceFlowId != null ? this._findFlowById(detail.sourceFlowId) : targetFlow;

      if (detail.sourcePosition != null) {
        if (detail.sourceFlowKey && detail.sourceFlowKey !== detail.flowKey) {
          sourceFlow[detail.sourceFlowKey].splice(detail.sourcePosition, 1);
          targetFlow[detail.flowKey].splice(detail.position, 0, flowStep);
          if (this._currentFlowStep != null && this._currentFlowStep.step._id === _id) {
            this._currentFlowStep.group = detail.flowKey;
            // Special case for update schema after change request to response or inverse
            const schema = this.buildSchema(this._currentFlowStep.policy);
            await this._setCurrentFlowStep(this._currentFlowStep, schema, true);
            this._getFlowElement(targetFlow._id).requestUpdate();
          }

        }
        else {
          if (detail.position > detail.sourcePosition) {
            targetFlow[detail.flowKey].splice(detail.position, 0, flowStep);
            sourceFlow[detail.flowKey].splice(detail.sourcePosition, 1);
          }
          else {
            sourceFlow[detail.flowKey].splice(detail.sourcePosition, 1);
            targetFlow[detail.flowKey].splice(detail.position, 0, flowStep);
          }
        }
        // Force Refresh source flow element when move to other flow
        if (targetFlow._id !== sourceFlow._id) {
          this._getFlowElement(targetFlow._id).requestUpdate();
        }
      }
      else {
        targetFlow[detail.flowKey].splice(detail.position, 0, flowStep);
        const currentFlowForm = this._getFlowStepForm();
        if (currentFlowForm == null || currentFlowForm.dirty !== true) {

          let step = targetFlow[detail.flowKey][detail.position];
          if (step == null) {
            // When confirm lose change after drop policy
            step = targetFlow[detail.flowKey][detail.position - 1];
          }

          if (detail.cancelEdit !== true) {
            setTimeout(async () => {
              await this._editFlowStep({ step, policy, flow: targetFlow, group: detail.flowKey });
              this.updateComplete.then(() => {
                const flowElement = this._getFlowElement(targetFlow._id);
                flowElement.selectedStepId = step._id;
                flowElement.requestUpdate();
              });
            });
          }
        }
      }
      targetFlow._dirty = true;
      sourceFlow._dirty = true;
      this.isDirty = true;
      this.shadowRoot.querySelectorAll('gv-flow').forEach((gvFlow) => gvFlow.removeCandidate());
      setTimeout(() => {
        this._dragPolicy = null;
        this._dropPolicy = null;
      }, 0);
    }
    catch (e) {
      this._currentAskConfirmation = null;
    }

  }

  _onDeletePolicy ({ detail }) {
    const targetFlow = this._findFlowById(detail.flowId);
    targetFlow[detail.flowKey].splice(detail.position, 1);
    targetFlow._dirty = true;
    this.isDirty = true;
    if (detail.target.editing) {
      this._closeFlowStepForm(true);
    }
    this._getFlowElement(detail.flowId).requestUpdate();
  }

  _onDesign () {
    this._changeTab('design');
    this._splitMainViews();
  }

  buildSchema ({ schema }) {
    const description = {
      title: 'Description',
      description: 'Description of flow step',
      type: 'string',
    };
    if (schema) {
      const jsonSchema = typeof schema === 'string' ? JSON.parse(schema) : schema;
      const properties = { description, ...jsonSchema.properties };
      return { ...jsonSchema, properties };
    }
    return { properties: { description } };
  }

  async _editFlowStep ({ step, flow, policy, group }) {
    if (step) {
      this._currentPolicyId = policy.id;
      const currentFlowStep = { flow, step, policy, group };
      const schema = this.buildSchema(policy);
      try {
        await this._setCurrentFlowStep(currentFlowStep, schema);
        this._updateSelectedFlows([flow._id]);
        this._splitMainViews();
        if (localStorage.getItem('gv-policy-studio:keep-documentation-close') == null) {
          this._onOpenDocumentation();
        }

      }
      catch (e) {
        this._currentAskConfirmation = null;
      }
    }
    else {
      await this._closeFlowStepForm();
      this._maximizeTopView();
    }
  }

  async _onEditFlowStep ({ detail: { step, flow, policy, group } }) {
    return this._editFlowStep({ step, flow, policy, group });
  }

  _getResizableViews () {
    return this.shadowRoot.querySelector('gv-resizable-views');
  }

  _maximizeTopView () {
    if (this.selectedFlowsId.length <= 1) {
      this._getResizableViews().maximizeTop();
    }
  }

  _maximizeBottomView () {
    this._getResizableViews().maximizeBottom();
  }

  _splitMainViews () {
    this._getResizableViews().split();
  }

  _onChangeFlowStepState ({ detail }) {
    const targetFlow = this._findFlowById(detail.flowId);
    const step = targetFlow[detail.flowKey][detail.position];
    step.enabled = detail.enabled;
    targetFlow._dirty = true;
    this.isDirty = true;
  }

  async _onCloseFlowStepForm () {
    try {
      await this._closeFlowStepForm();
    }
    catch (err) {
      this._currentAskConfirmation = null;
    }
  }

  async _closeFlowStepForm (force = false) {
    await this._setCurrentFlowStep(null, null, force);
  }

  async _askToValidateForms () {
    if (this._currentAskConfirmation == null) {
      this._currentAskConfirmation = true;
      return Promise.all(this._submitOrConfirmForms()).then((forms) => {
        if (forms.filter((r) => r != null).length > 0) {
          this._definition = this._buildDefinitionToSave();
          this.getChildren().forEach((e) => e.requestUpdate());
          // Refresh if lose changes lost current step selection
          return this._checkCurrentFlowStep().then(() => {
            this.getChildren().forEach((e) => e.requestUpdate());
            return this.updateComplete.then(() => {
              this._currentAskConfirmation = null;
              return forms;
            });
          });
        }
        else {
          this._currentAskConfirmation = null;
          return forms;
        }
      });
    }
    throw new Error('ask already waiting');
  }

  async _setCurrentFlowStep (currentFlowStep, flowStepSchema, force = false) {

    if (!force) {
      await this._askToValidateForms();
    }

    const schema = deepClone(flowStepSchema);
    if (currentFlowStep != null) {

      const configuration = typeof currentFlowStep.step.configuration === 'string'
        ? JSON.parse(currentFlowStep.step.configuration) : currentFlowStep.step.configuration;
      const step = { ...currentFlowStep.step, configuration };

      const _initialValues = { ...step.configuration, description: step.description };
      this._currentFlowStep = { ...currentFlowStep, step, _initialValues };

      if (flowStepSchema && flowStepSchema.properties.scope) {
        const _enum = schema.properties.scope.enum;
        if (_enum.find((scope) => ['REQUEST', 'REQUEST_CONTENT', 'RESPONSE', 'RESPONSE_CONTENT'].includes(scope)) != null) {
          const filtered = this._currentFlowStep.group === 'pre' ? ['REQUEST', 'REQUEST_CONTENT'] : ['RESPONSE', 'RESPONSE_CONTENT'];
          schema.properties.scope.enum = _enum.filter((scope) => filtered.includes(scope));
          const scope = this._currentFlowStep.step.configuration.scope;
          if (scope == null || !schema.properties.scope.enum.includes(scope)) {
            schema.properties.scope.default = schema.properties.scope.enum[0];
            this._currentFlowStep.step.configuration.scope = schema.properties.scope.enum[0];
            this._currentFlowStep._initialValues.scope = schema.properties.scope.enum[0];
            if (this._currentFlowStep._values) {
              this._currentFlowStep._values.scope = schema.properties.scope.enum[0];
            }
          }
        }
      }
    }
    else {
      this._currentFlowStep = null;
    }

    this._flowStepSchema = schema;
  }

  _refresh (closeStepForm = true) {
    if (closeStepForm) {
      this._closeFlowStepForm(true);
    }
    this._definition = deepClone(this._definition);
  }

  async _onSelectFlows ({ detail }) {
    try {
      await this._closeFlowStepForm();
      this._onCloseDocumentation();
      this._updateSelectedFlows(detail.flows);
      this._onDesign();
    }
    catch (e) {
      this._currentAskConfirmation = null;
    }

  }

  async _onOpenDocumentationFromMenu ({ detail: { policy } }) {
    try {
      if (this.documentation == null || this.documentation.id !== policy.id) {
        await this._closeFlowStepForm();
        this._currentPolicyId = policy.id;
        if (this.getSelectedFlow()) {
          this._splitMainViews();
        }
        else {
          this._maximizeBottomView();
        }
        dispatchCustomEvent(this, 'fetch-documentation', { policy });
      }
    }
    catch (e) {

    }
  }

  _fetchDocumentation (policy) {
    if (this.documentation == null || this.documentation.id !== policy.id) {
      dispatchCustomEvent(this, 'fetch-documentation', { policy });
    }
  }

  _onOpenDocumentation () {
    if (this._currentFlowStep && this._currentFlowStep.policy) {
      this._fetchDocumentation(this._currentFlowStep.policy);
    }
  }

  _onOpenDocumentationFromForm () {
    localStorage.removeItem('gv-policy-studio:keep-documentation-close');
    this._onOpenDocumentation();
  }

  _findFlowCollection (flowId) {
    const plan = this.definedPlans.find((plan) => plan.flows.find((flow) => flow._id === flowId) != null);
    return { plan, flows: plan != null ? plan.flows : this.definedFlows };
  }

  _findFlowById (flowId) {
    let flow = this.definedFlows.find((flow) => flow._id === flowId);
    if (flow == null) {
      const plansFlows = this.definedPlans.map((plan) => plan.flows).reduce((acc, val) => acc.concat(val), []);
      flow = plansFlows.find((flow) => flow._id === flowId);
    }
    return flow;
  }

  getSelectedFlow (index = 0) {
    const selectedFlowId = this.selectedFlowsId[index];
    return this._findFlowById(selectedFlowId);
  }

  _onTargetPolicy ({ detail }) {
    if (this._currentAskConfirmation == null) {
      this._dragPolicy = detail;
    }
  }

  _onChangeFlowStep ({ detail }) {
    this._currentFlowStep._values = detail.values;
  }

  _writeFlowStep (values) {
    const { description, ...configuration } = values;
    if (this._currentFlowStep.step._new || this._currentFlowStep.step.description !== description || !deepEqual(this._currentFlowStep.step.configuration, configuration)) {
      const flow = this._findFlowById(this._currentFlowStep.flow._id);
      const position = flow[this._currentFlowStep.group].findIndex((step) => step._id === this._currentFlowStep.step._id);
      flow[this._currentFlowStep.group][position].description = description;
      flow[this._currentFlowStep.group][position].configuration = configuration;
      delete flow[this._currentFlowStep.group][position]._new;
      flow[this._currentFlowStep.group][position]._dirty = true;
      flow._dirty = true;
      this.isDirty = true;
      this._currentFlowStep.flow = flow;
      this._currentFlowStep.step = flow[this._currentFlowStep.group][position];
    }
  }

  async _onSubmitFlowStep ({ detail }) {
    this._writeFlowStep(detail.values);
    await this.requestUpdate('_definition');
    this.getChildren().forEach((c) => (c.requestUpdate()));
  }

  _onCancelFlow () {
    this._onDesign();
  }

  _onSubmitFlow ({ detail: { values } }) {
    const selectedFlow = this.getSelectedFlow();
    selectedFlow.name = values.name || '';
    selectedFlow.condition = values.condition || '';
    selectedFlow['path-operator'] = values['path-operator'];
    selectedFlow.methods = values.methods;
    selectedFlow._dirty = true;
    this.isDirty = true;
    this._refresh();
  }

  _onCancelFlowMode () {
    this._onDesign();
  }

  _onSubmitFlowMode ({ detail: { values } }) {
    this._definition['flow-mode'] = values['flow-mode'] || 'DEFAULT';
    this.isDirty = true;
    this._refresh();
  }

  _onChangeTab ({ detail }) {
    this._changeTab(detail.value);
  }

  async _changeTabValidator ({ from, to }) {
    if (from === 'properties') {
      const component = this.shadowRoot.querySelector('gv-properties');
      if (component.dirty) {
        return component.confirm();
      }
    }
    else if (from === 'resources') {
      const component = this.shadowRoot.querySelector('gv-resources');
      if (component.dirty) {
        return component.confirm();
      }
    }
    else {
      try {
        return await this._askToValidateForms();
      }
      catch (e) {
        this._currentAskConfirmation = null;
        throw e;
      }

    }
    return Promise.resolve();
  }

  _changeTab (tabId) {
    if (this._currentAskConfirmation == null) {
      this.tabId = tabId;
      dispatchCustomEvent(this, 'change-tab', this.tabId);
    }
  }

  _onDragStartFlowStep (flow, { detail }) {
    if (this._currentAskConfirmation == null) {
      this._dropPolicy = detail;
      this._dragPolicy = detail;
    }
  }

  _renderFlowEmptyState () {
    return html`<div slot="content" class="empty">
                  <div>Select a flow ${this.readonly !== true ? html`or <gv-button @gv-button:click="${this._onAddFlow}" outlined icon="code:plus" large>design new one</gv-button>` : ''}</div>
                </div>`;
  }

  _renderFlow (index = 0, hasEmptyState = true) {
    const flow = this.getSelectedFlow(index);
    if (flow) {
      const { plan } = this._findFlowCollection(flow._id);
      const selectedStepId = this._currentFlowStep ? this._currentFlowStep.step._id : null;
      return html`
                <gv-flow
                style="height: 100%"
                 .id="${flow._id}"
                 .flow="${flow}"
                 .plan="${plan}"
                 .policies="${this.policies}"
                 slot="content"
                 ?disabled="${this._currentAskConfirmation}"
                 .dragPolicy="${this._dragPolicy}"
                 .dropPolicy="${this._dropPolicy}"
                 .selectedStepId="${selectedStepId}"
                 ?readonly="${this.readonly}"
                 ?has-policy-filter="${this._policyFilterOptions != null}"
                 flows-title="${this.flowsTitle}"
                 @gv-flow:drag-start="${this._onDragStartFlowStep.bind(this, flow)}"
                 @gv-flow:edit="${this._onEditFlowStep}"
                 @gv-flow:change-state="${this._onChangeFlowStepState}"
                 @gv-flow:drop="${this._onDropPolicy}"
                 @gv-flow:delete="${this._onDeletePolicy}"></gv-flow>`;
    }
    else if (hasEmptyState) {
      return this._renderFlowEmptyState();
    }
    return html``;
  }

  _onFetchResources (event) {
    const { currentTarget, regexTypes } = event.detail;
    const options = this.definedResources
      .filter((resource) => regexTypes == null || new RegExp(regexTypes).test(resource.type))
      .map((resource, index) => {
        const resourceType = this.resourceTypes.find((type) => type.id === resource.type);
        const row = document.createElement('gv-row');
        const picture = resourceType.icon ? resourceType.icon : null;
        row.item = { picture, name: resource.name };
        return {
          element: row,
          value: resource.name,
          id: resource.type,
        };
      });
    currentTarget.options = options;
  }

  _renderPolicy () {
    if (this._flowStepSchema && this.documentation) {
      return html`<gv-resizable-views direction="horizontal" no-overflow>
                    <div slot="top">${this._renderFlowStepForm()}</div>
                    <div slot="bottom">
                      <gv-documentation .text="${this.documentation.content}"
                                        .image="${this.documentation.image}"
                                        ?disabled="${this._currentAskConfirmation}"
                                        @gv-documentation:close="${this._onCloseDocumentation}"></gv-documentation>
                    </div>
                  </gv-resizable-views>`;
    }
    else if (this.documentation) {
      return html`<gv-documentation .text="${this.documentation.content}"
                                    .image="${this.documentation.image}"
                                    ?disabled="${this._currentAskConfirmation}"
                                    @gv-documentation:close="${this._onCloseDocumentation}"></gv-documentation>`;
    }

    else if (this._flowStepSchema) {
      return this._renderFlowStepForm();
    }
    return html``;
  }

  _getFlowStepForm () {
    return this.shadowRoot.querySelector(`#${FLOW_STEP_FORM_ID}`);
  }

  _onResetFlowStep () {
    if (this._currentFlowStep) {
      delete this._currentFlowStep._values;
      this._getFlowStepForm().reset();
    }
  }

  _generateFlowsId (list, force = false) {
    return this._generateId('f', list, force, true);
  }

  _generatePlanFlowsId (plan, force = false) {
    return this._generateId(plan.id, plan.flows, force, true);
  }

  _generateId (prefix, list, force = false, isFlow = false) {
    if (list) {
      return list.map((e, index) => {
        if (isFlow) {
          if (e.pre) {
            e.pre.forEach((step) => (step._id = uuid()));
          }
          if (e.post) {
            e.post.forEach((step) => (step._id = uuid()));
          }
        }
        if (force || e._id == null) {
          return { ...e, _id: `${prefix}_${index}` };
        }
        return e;
      });
    }
    return list;
  }

  getChildren () {
    return [
      ...Array.from(this.shadowRoot.querySelectorAll('gv-flow')),
      ...Array.from(this.shadowRoot.querySelectorAll('gv-resizable-views')),
    ];
  }

  async _getUpdateComplete () {
    await super._getUpdateComplete();
    await Promise.all(this.getChildren().map((e) => e.updateComplete));
  }

  shouldUpdate (changedProperties) {
    // Just refresh gv-flow components
    if (changedProperties.has('_dragPolicy')) {
      this.shadowRoot.querySelectorAll('gv-flow').forEach((flow) => (flow.dragPolicy = this._dragPolicy));
      return false;
    }
    if (changedProperties.has('_dropPolicy')) {
      this.shadowRoot.querySelectorAll('gv-flow').forEach((flow) => (flow.dropPolicy = this._dropPolicy));
      return false;
    }
    return super.shouldUpdate(changedProperties);
  }

  updated (props) {
    if (props.has('documentation') && this.documentation != null && this.selectedFlowsId.length > 1) {
      this._updateSelectedFlows([this.selectedFlowsId[0]]);
    }
  }

  _renderFlowStepForm () {
    const values = this._currentFlowStep._values || this._currentFlowStep._initialValues;
    return html`${cache(this._flowStepSchema && this._currentFlowStep
      ? html`<div class="flow-step__container">
           <div class="flow-step__form">
             <gv-schema-form
                 .id="${FLOW_STEP_FORM_ID}"
                 .schema="${this._flowStepSchema}"
                .icon="design:edit"
                has-header
                validate-on-render
                .values="${values}"
                .dirty="${this._currentFlowStep._values != null}"
                ?readonly="${this.readonly}"
                @gv-schema-form:change="${this._onChangeFlowStep}"
                @gv-schema-form:reset="${this._onResetFlowStep}"
                @gv-schema-form:fetch-resources="${this._onFetchResources}"
                @gv-schema-form:submit="${this._onSubmitFlowStep}">

                  <div slot="title" class="flow-step__form-title">${this._currentFlowStep.step.name}</div>
                  <gv-button slot="header-left" icon="general:close" outlined small @gv-button:click="${this._onCloseFlowStepForm}" title="Close (esc)"></gv-button>
                  <gv-button slot="header-left" icon="home:book" ?disabled="${this.documentation != null}" outlined small
                             @gv-button:click="${this._onOpenDocumentationFromForm}"
                             title="Open documentation"></gv-button>

              </gv-schema-form>
            </div>
        </div>` : '')}`;
  }

  _onCloseDocumentation () {
    this.documentation = null;
    if (this._currentFlowStep == null) {
      this._maximizeTopView();
    }
    else {
      localStorage.setItem('gv-policy-studio:keep-documentation-close', true);
    }
  }

  _onDeleteFlow ({ detail }) {
    const flowId = detail.content._id;
    const { flows } = this._findFlowCollection(flowId);
    const flow = flows.find((flow) => flow._id === flowId);
    this._deleteFlow(flows, flow);
  }

  get definedFlows () {
    return this._definition && this._definition.flows ? this._definition.flows : [];
  }

  get definedPlans () {
    return this._definition && this._definition.plans ? this._definition.plans : [];
  }

  get definedResources () {
    return this._definition && this._definition.resources ? this._definition.resources : [];
  }

  get definedProperties () {
    return this._definition && this._definition.properties ? this._definition.properties : [];
  }

  async _onDuplicateFlow ({ detail }) {
    try {
      await this._askToValidateForms();

      const flowId = detail.content._id;
      const { plan, flows } = this._findFlowCollection(flowId);
      this._addFlow(flows, this._findFlowById(flowId));
      if (plan != null) {
        let planIndex = null;
        this.definedPlans.find((p, i) => {
          if (p.id === plan.id) {
            planIndex = i;
            return true;
          }
          return false;
        });
        plan.flows = flows;
        this.definedPlans[planIndex].flows = this._generatePlanFlowsId(plan, true);
        this._updateSelectedFlows([this.definedPlans[planIndex].flows[flows.length - 1]._id]);
      }
      else {
        this._definition.flows = this._generateFlowsId(this._definition.flows);
        this._updateSelectedFlows([this._definition.flows[this._definition.flows.length - 1]._id]);
      }
    }
    catch (err) {
      this._currentAskConfirmation = null;
    }

  };

  _onChangeFlowState ({ detail }) {
    const flow = this._findFlowById(detail.content._id);
    flow.enabled = detail.enabled;
    flow._dirty = true;
    this.isDirty = true;
  }

  async _onAddFlowPlan ({ detail }) {
    try {
      await this._askToValidateForms();
      this._addFlow(this.definedPlans[detail.planIndex].flows);
      this.definedPlans[detail.planIndex].flows = this._generatePlanFlowsId(this.definedPlans[detail.planIndex]);
      this._updateSelectedFlows([this.definedPlans[detail.planIndex].flows[this.definedPlans[detail.planIndex].flows.length - 1]._id]);
    }
    catch (err) {
      this._currentAskConfirmation = null;
    }
  }

  async _onAddFlow () {
    try {
      await this._askToValidateForms();

      this._addFlow(this._definition.flows);
      this._definition.flows = this._generateFlowsId(this._definition.flows);
      this._updateSelectedFlows([this._definition.flows[this._definition.flows.length - 1]._id]);
    }
    catch (err) {
      this._currentAskConfirmation = null;
    }
  }

  _addFlow (collection, duplicate = null) {
    const flow = duplicate == null ? {
      name: '',
      pre: [],
      post: [],
      _dirty: true,
      'path-operator': { path: '/', operator: 'STARTS_WITH' },
    } : {
      ...duplicate,
      _id: null,
      _dirty: true,
    };
    collection.push(flow);
    this.isDirty = true;
    return collection;
  }

  _deleteFlow (collection, flow) {
    const index = collection.indexOf(flow);
    collection.splice(index, 1);
    const selectedFlows = this.selectedFlowsId.filter((flowId) => flowId !== flow._id);
    if (selectedFlows.length === 1) {
      this._updateSelectedFlows(selectedFlows);
    }
    else {
      this._selectFirstFlow(true);
    }
    this._changeTab('design');
    this._refresh();
    this.isDirty = true;
  }

  _findFlowIndex (list, id) {
    let index = null;
    list.find((f, i) => {
      if (f._id === id) {
        index = i;
        return true;
      }
      return false;
    });
    return index;
  }

  async _onReorderFlows ({ detail: { plan } }) {
    try {
      await this._askToValidateForms();
      this.isDirty = true;
      if (plan != null) {
        const newOrder = this._generatePlanFlowsId(plan, true);
        if (this.selectedFlowsId) {
          this._updateSelectedFlows(this.selectedFlowsId.map((flowId) => {
            const index = this._findFlowIndex(plan.flows, flowId);
            return index != null ? newOrder[index]._id : flowId;
          }));
        }
        plan.flows = newOrder;
      }
      else {
        const newOrder = this._generateFlowsId(this._definition.flows, true);
        if (this.selectedFlowsId) {
          this._updateSelectedFlows(this.selectedFlowsId.map((flowId) => {
            const index = this._findFlowIndex(this._definition.flows, flowId);
            return index != null ? newOrder[index]._id : flowId;
          }));
        }
        this._definition.flows = newOrder;
      }
    }
    catch (err) {
      this._currentAskConfirmation = false;
    }
  }

  _onSearchPolicy ({ detail }) {
    this._searchPolicyQuery = detail;
  }

  _onClearPolicy () {
    this._searchPolicyQuery = null;
  }

  _onSearchFlows ({ detail }) {
    this._searchFlowQuery = detail;
  }

  _onClearFlows () {
    this._searchFlowQuery = null;
  }

  async _onResetAll () {
    try {
      await this._closeFlowStepForm();
      this.definition = deepClone(this._initialDefinition);
    }
    catch (e) {
      this._currentAskConfirmation = null;
    }
  }

  _filterNotValidStep (step) {
    return step._new !== true;
  }

  _removePrivateProperties (o) {
    const copy = { ...o };
    Object.keys(o).filter((key) => key.startsWith('_')).forEach((key) => {
      delete copy[key];
    });
    return copy;
  }

  _submitOrConfirmForms () {
    return [...this.shadowRoot.querySelectorAll('gv-schema-form')]
      .filter((form) => {
        const isValid = form.isValid();
        if (isValid) {
          form.submit();
        }
        return !isValid;
      })
      .map((form) => form.confirm());
  }

  getPropertiesElement () {
    return this.shadowRoot.querySelector('gv-properties');
  }

  async _checkCurrentFlowStep () {
    if (this._currentFlowStep && this.selectedFlowsId) {
      const closePromises = this.selectedFlowsId
        .map((flowId) => {
          const flow = this._findFlowById(flowId);
          const currentStep = [...flow.pre, ...flow.post].find((step) => step._id === this._currentFlowStep.step._id);
          if (currentStep == null) {
            return this._closeFlowStepForm(true);
          }
          return null;
        })
        .filter((p) => p !== null);
      return Promise.all(closePromises);
    }
    return Promise.resolve();
  }

  saved () {
    if (this.isDirty) {
      this._initialDefinition = deepClone(this._definitionSaved);
      this._definition = deepClone(this._definitionSaved);
      this._definitionSaved = null;
      this.isDirty = false;
      this._checkCurrentFlowStep();
      this.definedPlans.forEach((plan) => {
        plan.flows.forEach((flow) => (flow._dirty = false));
      });
      this.definedFlows.forEach((flow) => (flow._dirty = false));
      this.getChildren().forEach((e) => e.requestUpdate());
    }
  }

  _buildDefinitionToSave () {
    // Copy definition and remove invalid step
    // Keep private properties like _id and others stuff useful for render
    const flows = this._definition.flows
      .map((flow) => {
        flow.pre = flow.pre.filter(this._filterNotValidStep);
        flow.post = flow.post.filter(this._filterNotValidStep);
        return flow;
      });

    let definition = { ...this._definition, flows };

    if (this._definition.plans != null) {
      const plans = this._definition.plans.map((plan) => {
        const flows = plan.flows
          .map((flow) => {
            flow.pre = flow.pre.filter(this._filterNotValidStep);
            flow.post = flow.post.filter(this._filterNotValidStep);
            return flow;
          });
        return { ...plan, flows };
      });
      definition = { ...definition, plans };
    }
    return definition;
  }

  _buildDefinitionToSend (definitionToSave) {
    // Copy definition and remove all private properties
    const flows = definitionToSave.flows
      .map((f) => {
        const flow = this._removePrivateProperties(f);
        flow.pre = flow.pre.map(this._removePrivateProperties);
        flow.post = flow.post.map(this._removePrivateProperties);
        return flow;
      });

    let definition = { ...this._definition, flows };
    if (this._definition.plans != null) {
      const plans = definitionToSave.plans.map((plan) => {
        const flows = plan.flows
          .map((f) => {
            const flow = this._removePrivateProperties(f);
            flow.pre = flow.pre.map(this._removePrivateProperties);
            flow.post = flow.post.map(this._removePrivateProperties);
            return flow;
          });
        return { ...plan, flows };
      });
      definition = { ...definition, plans };
    }

    if (this._definition.resources != null) {
      const resources = this._definition.resources.map(this._removePrivateProperties);
      definition = { ...definition, resources };
    }

    return definition;
  }

  _onSaveAll () {

    if (this.hasProperties) {
      this.getPropertiesElement().submit();
    }

    Promise.all(this._submitOrConfirmForms())
      .then(() => {
        this._definitionSaved = this._buildDefinitionToSave();
        const definition = this._buildDefinitionToSend(this._definitionSaved);
        dispatchCustomEvent(this, 'save', { definition, services: this.services });
      })
      .catch((err) => {
        console.error(`[policy-studio] Error on save`, err);
      });
  }

  get filteredFlows () {
    if (this._flowFilter.length === 0 || this._flowFilter.includes('api')) {
      return this.definedFlows;
    }
    return null;
  }

  get filteredPlans () {
    if (this._flowFilter.length === 0 || this._flowFilter.includes('plan')) {
      return this.definedPlans;
    }
    return null;
  }

  _onFilterFlows ({ detail }) {
    if (this._flowFilter.includes(detail.id)) {
      this._flowFilter = [];
    }
    else {
      this._flowFilter = [detail.id];
    }
  }

  _getFilteredPolicies () {
    if (this._policyFilter.length > 0) {
      return this.policies.filter((policy) => {
        return (policy.onRequest && this._policyFilter.includes('onRequest')) || (policy.onResponse && this._policyFilter.includes('onResponse'));
      });
    }
    return this.policies;
  }

  _onFilterPolicies ({ detail }) {
    if (this._policyFilter.includes(detail.id)) {
      this._policyFilter = [];
    }
    else {
      this._policyFilter = [detail.id];
    }
  }

  _renderDesign () {
    return html`
           <div id="design" slot="content" class="design">
             <gv-resizable-views no-overflow>
                <div slot="top">
                  ${this._renderFlow()}
                </div>

                <div slot="bottom">
                  ${this._renderFlow(1, false)}
                  ${this._renderPolicy()}
                  ${this._renderFlowForm()}
                </div>
             </gv-resizable-views>
             ${this.readonly !== true ? html`<gv-policy-studio-menu
              class="right-menu"
              ?disabled="${this._currentAskConfirmation}"
              .policies="${this._getFilteredPolicies()}"
              .selectedIds="${[this._currentPolicyId]}"
              .query="${this._searchPolicyQuery}"
              ?has-policy-filter="${this._policyFilterOptions != null}"
              ?readonly="${this.readonly}"
              @gv-policy-studio-menu:target-policy="${this._onTargetPolicy}"
              @gv-policy-studio-menu:fetch-documentation="${this._onOpenDocumentationFromMenu}"
              @gv-policy-studio-menu:dragend-policy="${this._onDragEndPolicy}">

              <div slot="header" class="search-policies">
               ${this._policyFilterOptions != null ? html`<gv-option ?disabled="${this._currentAskConfirmation}" .options="${this._policyFilterOptions}" multiple outlined .value="${this._policyFilter}" small @gv-option:select="${this._onFilterPolicies}"></gv-option>` : ''}
                <gv-input
                    id="search-policy"
                    ?disabled="${this._currentAskConfirmation}"
                    placeholder="Filter policies (Shift + Ctrl + Space)" type="search" small
                    @gv-input:input="${this._onSearchPolicy}"
                    @gv-input:clear="${this._onClearPolicy}"></gv-input>
              </div>
           </gv-policy-studio-menu>` : ''}
         </div>`;
  }

  _renderConfigurationForm () {
    if (this.configurationSchema) {
      const values = deepClone(this._definition);
      return html`
        <div id="settings" slot="content" class="api-settings" @dragover="${this._onDesign}">
                <gv-schema-form
                  .schema="${this.configurationSchema}"
                  id="api-settings-form"
                  .values="${values}"
                  has-header
                  has-footer
                  ?readonly="${this.readonly}"
                  @gv-schema-form:cancel="${this._onCancelFlowMode}"
                  @gv-schema-form:submit="${this._onSubmitFlowMode}">
                  ${!this.configurationInformation ? ''
                  : html`
                  <div class="api-settings-information" slot="title">
                    <gv-icon class="api-settings-information__icon" title="Info" shape="code:info"></gv-icon>
                    <blockquote class="api-settings-information__blockquote">
                      ${this.configurationInformation}
                    </blockquote>
                  </div>

                `}
                </gv-schema-form>
        </div>`;
    }
    return html``;
  }

  _renderFlowForm () {
    if (this.flowSchema && this._flowStepSchema == null && this.documentation == null && this.selectedFlowsId.length === 1) {
      const flow = this.getSelectedFlow();
      if (flow) {
        const values = deepClone(flow);
        return html`<div slot="content" class="flow-settings">
                    <gv-schema-form .schema="${this.flowSchema}"
                              id="settings-form"
                              .values="${values}"
                              has-header
                              ?readonly="${this.readonly}"
                              @gv-schema-form:cancel="${this._onCancelFlow}"
                              @gv-schema-form:submit="${this._onSubmitFlow}">
                        <div slot="title" class="flow-step__form-title">Flow configuration</div>
                    </gv-schema-form>
            </div>`;
      }
    }
  }

  _onResourcesChange ({ detail }) {
    this.definition.resources = detail.resources;
    this.isDirty = true;
  }

  _onPropertiesChange ({ detail }) {
    this.definition.properties = detail.properties;
    this.isDirty = true;
  }

  _onSaveProvider ({ detail }) {
    this.services['dynamic-property'] = detail.provider;
    this.isDirty = true;
  }

  render () {
    return html`<div class="box">
        <gv-policy-studio-menu
              class="left-menu"
              .api-name="${this._definition.name}"
              .flows="${this.filteredFlows}"
              .plans="${this.filteredPlans}"
              .selectedIds="${this.selectedFlowsId}"
              ?disabled="${this._currentAskConfirmation}"
              ?sortable="${this.sortable && this.readonly !== true}"
              ?readonly="${this.readonly}"
              flows-title="${this.flowsTitle}"
              .query="${this._searchFlowQuery}"
              ?can-add="${this.canAdd && !this.readonly}"
              @gv-policy-studio-menu:reorder-flows="${this._onReorderFlows}"
              @gv-policy-studio-menu:change-flow-state="${this._onChangeFlowState}"
              @gv-policy-studio-menu:add-flow="${this._onAddFlow}"
              @gv-policy-studio-menu:add-flow-plan="${this._onAddFlowPlan}"
              @gv-policy-studio-menu:delete-flow="${this._onDeleteFlow}"
              @gv-policy-studio-menu:duplicate-flow="${this._onDuplicateFlow}"
              @gv-policy-studio-menu:select-flows="${this._onSelectFlows}">

                <div slot="header" class="header-actions">
                  <div class="title">${this._definition.name}</div>
                  ${this._flowFilterOptions != null ? html`<gv-option ?disabled="${this._currentAskConfirmation}" .options="${this._flowFilterOptions}" multiple outlined .value="${this._flowFilter}" small @gv-option:select="${this._onFilterFlows}"></gv-option>` : ''}
                  <gv-input  ?disabled="${this._currentAskConfirmation}" id="search-flow" placeholder="Filter flows (Ctrl + Space)" type="search" small
                    @gv-input:input="${this._onSearchFlows}"
                    @gv-input:clear="${this._onClearFlows}"></gv-input>
                </div>
                
                  ${this.readonly !== true ? html`
                    <div slot="footer" class="footer-actions">
                      <gv-button class="save" .disabled="${!this.isDirty || this._currentAskConfirmation}" @gv-button:click="${this._onSaveAll}">Save</gv-button>
                      <gv-button link .disabled="${!this.isDirty || this._currentAskConfirmation}" @gv-button:click="${this._onResetAll}">Reset</gv-button>
                    </div>` : ''}
                
         </gv-policy-studio-menu>

        <gv-tabs .value="${this.tabId}" .options="${this._tabs}"
                  .disabled="${this._currentAskConfirmation}"
                  @gv-tabs:change="${this._onChangeTab}"
                 .validator="${this._changeTabValidator.bind(this)}">
            ${this._renderDesign()}
            ${this._renderConfigurationForm()}
            <gv-properties id="properties" slot="content" class="properties"
                            .provider="${this.services['dynamic-property']}"
                            @gv-properties:change="${this._onPropertiesChange}"
                            @gv-properties:save-provider="${this._onSaveProvider}"
                            ?readonly="${this.readonly}"
                            .properties="${this.definedProperties}"
                            .providers="${this.propertyProviders}"></gv-properties>
            <gv-resources id="resources" slot="content" class="resources"
                          @gv-resources:change="${this._onResourcesChange}"
                          ?readonly="${this.readonly}"
                          .resources="${this.definedResources}"
                          .types="${this.resourceTypes}"></gv-resources>
        </gv-tabs>

      </div>`;
  }

}

window.customElements.define('gv-policy-studio', GvPolicyStudio);
