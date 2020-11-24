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
import { classMap } from 'lit-html/directives/class-map';
import { getFlowName, methods } from '../lib/studio';
import { dispatchCustomEvent } from '../lib/events';
import '../atoms/gv-button';
import '../atoms/gv-icon';
import '../molecules/gv-option';
import '../organisms/gv-documentation';
import '../organisms/gv-properties';
import '../organisms/gv-resizable-views';
import '../organisms/gv-resources';
import '../organisms/gv-schema-form';
import '../organisms/gv-tabs';
import '../molecules/gv-row';
import './gv-flow';
import './gv-flow-step';
import './gv-policy-studio-menu';
import { empty } from '../styles/empty';
import { loadAsciiDoctor } from '../lib/text-format';
import { cache } from 'lit-html/directives/cache';
import { deepClone } from '../lib/utils';
import { KeyboardElement, KEYS } from '../mixins/keyboard-element';

const FLOW_STEP_FORM_ID = 'flow-step-form';

/**
 *  Studio Policy component
 *
 * @fires gv-policy-studio:select-policy - Select policy event
 *
 * @attr {Array} policies - Policies available
 * @attr {Array} resources - Resources available
 * @attr {Object} definition - The definition of flows
 * @attr {Object} documentation - The documentation to display
 * @attr {String} selectedId - The selected policy id
 * @attr {Object} flowSettingsForm - The flow form configuration to display in gv-schema-form component
 *
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
      flowSettingsForm: { type: Object },
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
      _registeredSchemaForms: { type: Array, attribute: false },
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

        .flow-settings {
          display: flex;
          flex-direction: column;
          border-left: 1px solid #BFBFBF;
          height: var(--height-in-tabs);
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
    this.services = {};
    this._definition = {
      flows: [],
    };
    this._tabs = [
      { id: 'design', title: 'Design', icon: 'navigation:exchange' },
      { id: 'settings', title: 'Settings', icon: 'general:settings#2' },
      { id: 'properties', title: 'Properties', icon: 'general:settings#1' },
      { id: 'resources', title: 'Resources', icon: 'general:settings#5' },
    ];
    this._flowFilterOptions = [
      { id: 'api', title: 'Api', icon: 'shopping:box#3' },
      { id: 'plan', title: 'Plans', icon: 'shopping:sale#2' },
    ];
    this._flowFilter = [];
    this._policyFilterOptions = [
      { id: 'onRequest', title: 'Request', icon: 'navigation:arrow-from-left' },
      { id: 'onResponse', title: 'Response', icon: 'navigation:arrow-from-right' },
    ];
    this._policyFilter = [];
    loadAsciiDoctor();
    this._registeredSchemaForms = [];
    this.addEventListener('gv-schema-form:change', this._onSchemaFormChange);
  }

  onKeyboard () {
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

  set tabId (tabId) {
    if (tabId != null && ['design', 'settings', 'properties', 'resources'].includes(tabId)) {
      this._tabId = tabId;
    }
    else {
      this._tabId = 'design';
    }
  }

  _onSchemaFormChange ({ detail }) {
    const form = detail.target;
    if (form.id == null || form.id.trim() === '') {
      console.warn('Cannot register schema form without id');
    }
    else if (!this._registeredSchemaForms.includes(form.id)) {
      this._registeredSchemaForms.push(form.id);
    }
  }

  get tabId () {
    return this._tabId;
  }

  set definition (definition) {
    if (definition) {
      this._initialDefinition = deepClone(definition);
      const flows = this._generateFlowsId(definition.flows);
      const resources = this._generateId('resource-', definition.resources);
      const plans = definition.plans == null ? [] : definition.plans.map((plan) => {
        return { ...plan, flows: this._generatePlanFlowsId(plan) };
      });

      this._definition = { ...definition, flows, resources, plans };
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

  _onDragEndPolicy () {
    this.shadowRoot.querySelectorAll('gv-flow').forEach((e) => e.onDragEnd());
  }

  _onDropPolicy ({ detail }) {
    const targetFlow = this._findFlowById(detail.flowId);
    const sourceFlow = detail.sourceFlowId != null ? this._findFlowById(detail.sourceFlowId) : targetFlow;
    const policy = detail.policy;

    let name = policy.name;
    let description = policy.description;
    let configuration = {};
    if (detail.flowStep) {
      name = detail.flowStep.name;
      description = detail.flowStep.description;
      configuration = detail.flowStep.configuration;
    }

    const flowStep = { name, policy: policy.id, description, enabled: true, configuration };

    if (detail.sourcePosition != null) {
      if (detail.sourceFlowKey && detail.sourceFlowKey !== detail.flowKey) {
        sourceFlow[detail.sourceFlowKey].splice(detail.sourcePosition, 1);
        targetFlow[detail.flowKey].splice(detail.position, 0, flowStep);
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
      this._refresh(true);
      this._onCloseDocumentation();
    }
    else {
      targetFlow[detail.flowKey].splice(detail.position, 0, flowStep);
      const step = targetFlow[detail.flowKey][detail.position];
      this._onEditFlowStep(targetFlow, {
        detail: {
          step,
          policy,
          flowKey: detail.flowKey,
          position: detail.position,
        },
      });
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

  _onDeletePolicy ({ detail }) {
    const targetFlow = this._findFlowById(detail.flowId);
    targetFlow[detail.flowKey].splice(detail.position, 1);
    targetFlow._dirty = true;
    this.isDirty = true;
    this._refresh(detail.isEditable);
  }

  _onDesign () {
    this._changeTab('design');
    this._splitMainViews();
  }

  async _onEditFlowStep (flow, { detail }) {
    if (detail) {
      const currentFlowStep = { flow, step: detail.step, ...detail };
      let flowStepSchema = null;
      this._currentPolicyId = detail.policy.id;
      if (detail.policy.schema) {
        const description = {
          title: 'Description',
          description: 'Description of flow step',
          type: 'string',
        };
        const schema = typeof detail.policy.schema === 'string' ? JSON.parse(detail.policy.schema) : detail.policy.schema;
        const properties = { description, ...schema.properties };
        flowStepSchema = { ...schema, properties };
      }
      try {
        await this._setCurrentFlowStep(currentFlowStep, flowStepSchema);
        this._updateSelectedFlows([flow._id]);
        this._splitMainViews();
        this._onOpenDocumentation();
      }
      catch (e) {

      }

    }
    else {
      this._closeFlowStepForm();
      this._maximizeTopView();
    }
  }

  _getResizableViews () {
    return this.shadowRoot.querySelector('gv-resizable-views');
  }

  _maximizeTopView () {
    this._getResizableViews().maximizeTop();
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
    this._refresh(false);
  }

  _closeFlowStepForm (force = false) {
    this._setCurrentFlowStep(null, null, force);
  }

  async _setCurrentFlowStep (currentFlowStep, flowStepSchema, force = false) {
    if (!force) {
      const form = this._getFlowStepForm();
      if (form && form.dirty) {
        // eslint-disable-next-line no-useless-catch
        await form.confirm();
      }
    }

    this._currentFlowStep = currentFlowStep;

    if (flowStepSchema && flowStepSchema.properties.scope) {
      if (flowStepSchema.properties.scope.enum.find((scope) => ['REQUEST', 'REQUEST_CONTENT', 'RESPONSE', 'RESPONSE_CONTENT'].includes(scope)) != null) {
        const filtered = this._currentFlowStep.flowKey === 'pre' ? ['REQUEST', 'REQUEST_CONTENT'] : ['RESPONSE', 'RESPONSE_CONTENT'];
        flowStepSchema.properties.scope.enum = flowStepSchema.properties.scope.enum.filter((scope) => filtered.includes(scope));
        const scope = this._currentFlowStep.step.configuration.scope;
        if (scope == null || !flowStepSchema.properties.scope.enum.includes(scope)) {
          this._currentFlowStep.step.configuration.scope = flowStepSchema.properties.scope.enum[0];
        }
      }
    }

    this._flowStepSchema = flowStepSchema;
  }

  _refresh (closeStepForm = true) {
    if (closeStepForm) {
      this._closeFlowStepForm(true);
    }
    this._definition = deepClone(this._definition);
  }

  _onSelectFlows ({ detail }) {
    this._closeFlowStepForm();
    this._updateSelectedFlows(detail.flows);
    this._onDesign();
    if (detail.flows.length <= 1) {
      this._maximizeTopView();
    }
    this._onCloseDocumentation();
  }

  _onOpenDocumentationFromMenu ({ detail: { policy } }) {
    if (this.documentation == null || this.documentation.id !== policy.id) {
      this._currentPolicyId = policy.id;
      this._closeFlowStepForm();
      if (this.getSelectedFlow()) {
        this._splitMainViews();
      }
      else {
        this._maximizeBottomView();
      }
      dispatchCustomEvent(this, 'fetch-documentation', { policy });
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

  _findFlowCollection (flowId) {
    const plan = this.definedPlans.find((plan) => plan.flows.find((flow) => flow._id === flowId) != null);
    return { plan, flows: plan != null ? plan.flows : this.definedFlows };
  }

  _findFlowById (flowId) {
    const plansFlows = this.definedPlans.map((plan) => plan.flows).reduce((acc, val) => acc.concat(val), []);
    return [...plansFlows, ...this.definedFlows].find((flow) => flow._id === flowId);
  }

  getSelectedFlow (index = 0) {
    const selectedFlowId = this.selectedFlowsId[index];
    return this._findFlowById(selectedFlowId);
  }

  _onTargetPolicy ({ detail }) {
    this._dragPolicy = detail;
  }

  _onChangeFlowStep ({ detail }) {
    this._currentFlowStep._values = detail.values;
  }

  _onSubmitFlowStep ({ detail }) {
    delete this._currentFlowStep._values;
    const { description, ...configuration } = detail.values;
    this._currentFlowStep.step.description = description;
    this._currentFlowStep.step.configuration = configuration;
    this._currentFlowStep.step._dirty = true;
    if (this._currentFlowStep.flow) {
      this._currentFlowStep.flow._dirty = true;
    }
    const flow = this._findFlowById(this._currentFlowStep.flow._id);
    flow[this._currentFlowStep.flowKey][this._currentFlowStep.position] = this._currentFlowStep.step;

    this.isDirty = true;
    // Important to refresh schema-form
    this._refresh(false);
  }

  _onCancelFlow () {
    this._onDesign();
  }

  _onSubmitFlow ({ detail: { values } }) {
    const selectedFlow = this.getSelectedFlow();
    selectedFlow.name = values.name || '';
    selectedFlow.description = values.description || '';
    selectedFlow.condition = values.condition || '';
    selectedFlow['path-operator'] = values['path-operator'];
    selectedFlow.methods = values.methods;
    selectedFlow._dirty = true;
    this.isDirty = true;
    this._refresh();
  }

  _onChangeTab ({ detail }) {
    this._changeTab(detail.value);
  }

  _changeTabValidator ({ from, to }) {
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
      const confirmForms = Object.values(this._registeredSchemaForms)
        .map((formId) => this.shadowRoot.querySelector(`#${formId}`))
        .filter((form) => form && form.dirty)
        .map((form) => form.confirm());
      if (confirmForms) {
        return Promise.all(confirmForms);
      }
    }

    return Promise.resolve();
  }

  _changeTab (tabId) {
    this.tabId = tabId;
    dispatchCustomEvent(this, 'change-tab', this.tabId);
  }

  _onDragStartFlowStep (flow, { detail }) {
    this._dropPolicy = detail;
    this._dragPolicy = detail;
  }

  _renderFlowEmptyState () {
    return html`<div slot="content" class="empty">
                      <div>Select a flow or <gv-button @gv-button:click="${this._onAddFlow}" outlined icon="code:plus" large>design new one</gv-button></div>
                  </div>`;
  }

  _renderFlow (index = 0, hasEmptyState = true) {
    const flow = this.getSelectedFlow(index);
    if (flow) {
      const { plan } = this._findFlowCollection(flow._id);
      return html`
                <gv-flow 
                style="height: 100%"
                 .flow="${flow}"
                 .plan="${plan}"
                 .policies="${this.policies}"
                 slot="content"
                 .dragPolicy="${this._dragPolicy}"
                 .dropPolicy="${this._dropPolicy}"
                 .editableArea="${this._currentFlowStep}"
                 @gv-flow:drag-start="${this._onDragStartFlowStep.bind(this, flow)}"
                 @gv-flow:edit="${this._onEditFlowStep.bind(this, flow)}"
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
    const { element, regexTypes } = event.detail;
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
    element.options = options;
  }

  _renderPolicy () {
    if (this._flowStepSchema && this.documentation) {
      return html`<gv-resizable-views direction="horizontal" no-overflow>
                    <div slot="top">${this._renderFlowStepForm()}</div>
                    <div slot="bottom">
                      <gv-documentation .text="${this.documentation.content}" .image="${this.documentation.image}" @gv-documentation:close="${this._onCloseDocumentation}"></gv-documentation>
                    </div>
                  </gv-resizable-views>`;
    }
    else if (this.documentation) {
      return html`<gv-documentation .text="${this.documentation.content}" .image="${this.documentation.image}" @gv-documentation:close="${this._onCloseDocumentation}"></gv-documentation>`;
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
    delete this._currentFlowStep._values;
    this._getFlowStepForm().reset();
  }

  _generateFlowsId (list, force = false) {
    return this._generateId('f', list, force);
  }

  _generatePlanFlowsId (plan, force = false) {
    return this._generateId(plan.id, plan.flows, force);
  }

  _generateId (prefix, list, force = false) {
    if (list) {
      return list.map((e, index) => {
        if (force || e._id == null) {
          return { ...e, _id: `${prefix}_${index}` };
        }
        return e;
      });
    }
    return list;
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
    const values = this._currentFlowStep._values || {
      ...this._currentFlowStep.step.configuration,
      description: this._currentFlowStep.step.description,
    };

    return html`${cache(this._flowStepSchema && this._currentFlowStep
      ? html`<div class="flow-step__container">
           <div class="flow-step__form">
             <gv-schema-form 
                 .id="${FLOW_STEP_FORM_ID}"
                 .schema="${this._flowStepSchema}" 
                .icon="design:edit"
                has-header
                .values="${values}" 
                .dirty="${this._currentFlowStep._values != null}"
                @gv-schema-form:change="${this._onChangeFlowStep}"
                @gv-schema-form:reset="${this._onResetFlowStep}"
                @gv-schema-form:fetch-resources="${this._onFetchResources}"
                @gv-schema-form:submit="${this._onSubmitFlowStep}">
                
                  <div slot="title" class="flow-step__form-title">${this._currentFlowStep.step.name}</div>
                  <gv-button slot="header-left" icon="general:close" outlined small @gv-button:click="${this._closeFlowStepForm}" title="Close (esc)"></gv-button>
                  <gv-button slot="header-left" icon="home:book" ?disabled="${this.documentation != null}" outlined small @gv-button:click="${this._fetchDocumentation.bind(this, this._currentFlowStep.policy)}" title="Open documentation"></gv-button>
                  
              </gv-schema-form>
            </div>
        </div>` : html``)}`;
  }

  _onCloseDocumentation () {
    this.documentation = null;
    if (this._currentFlowStep == null) {
      this._maximizeTopView();
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

  _onDuplicateFlow ({ detail }) {
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
  };

  _onChangeFlowState ({ detail }) {
    const flow = this._findFlowById(detail.content._id);
    flow.enabled = detail.enabled;
    flow._dirty = true;
    this.isDirty = true;
    this._refresh();
  }

  _onAddFlowPlan ({ detail }) {
    this._addFlow(this.definedPlans[detail.planIndex].flows);
    this.definedPlans[detail.planIndex].flows = this._generatePlanFlowsId(this.definedPlans[detail.planIndex]);
    this._updateSelectedFlows([this.definedPlans[detail.planIndex].flows[this.definedPlans[detail.planIndex].flows.length - 1]._id]);
  }

  _onAddFlow () {
    this._addFlow(this._definition.flows);
    this._definition.flows = this._generateFlowsId(this._definition.flows);
    this._updateSelectedFlows([this._definition.flows[this._definition.flows.length - 1]._id]);
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
    this._refresh();
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

  _onReorderFlows ({ detail: { plan } }) {
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

    this._refresh(false);
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

  _onResetAll () {
    this._closeFlowStepForm();
    this.definition = deepClone(this._initialDefinition);
    this._splitMainViews();
  }

  _removePrivateProperties (o) {
    const copy = { ...o };
    Object.keys(o).filter((key) => key.startsWith('_')).forEach((key) => {
      delete copy[key];
    });
    return copy;
  }

  _onSaveAll () {
    const confirmForms = Object.values(this._registeredSchemaForms)
      .map((formId) => this.shadowRoot.querySelector(`#${formId}`))
      .filter((form) => form && form.dirty)
      .map((form) => form.confirm());
    Promise.all(confirmForms)
      .then(() => {
        const plans = this._definition.plans.map((plan) => {
          const flows = plan.flows.map((f) => {
            const flow = this._removePrivateProperties(f);
            flow.pre = flow.pre.map(this._removePrivateProperties);
            flow.post = flow.post.map(this._removePrivateProperties);
            return flow;
          });
          return { ...plan, flows };
        });

        const flows = this._definition.flows.map((f) => {
          const flow = this._removePrivateProperties(f);
          flow.pre = flow.pre.map(this._removePrivateProperties);
          flow.post = flow.post.map(this._removePrivateProperties);
          return flow;
        });

        const resources = this._definition.resources.map(this._removePrivateProperties);
        const definition = { ...this._definition, flows, resources, plans };
        dispatchCustomEvent(this, 'save', { definition, services: this.services });
      })
      .catch(() => {
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
                </div>
             </gv-resizable-views>
           <gv-policy-studio-menu
              class="right-menu"
              .policies="${this._getFilteredPolicies()}"
              .selectedIds="${[this._currentPolicyId]}"
              .query="${this._searchPolicyQuery}"
              @gv-policy-studio-menu:target-policy="${this._onTargetPolicy}"
              @gv-policy-studio-menu:fetch-documentation="${this._onOpenDocumentationFromMenu}"
              @gv-policy-studio-menu:dragend-policy="${this._onDragEndPolicy}">
                  
              <div slot="header" class="search-policies">
                <gv-option .options="${this._policyFilterOptions}" multiple outlined .value="${this._policyFilter}" small @gv-option:select="${this._onFilterPolicies}"></gv-option>
                <gv-input 
                    id="search-policy"
                    placeholder="Filter policies (Shift + Ctrl + Space)" type="search" small 
                    @gv-input:input="${this._onSearchPolicy}" 
                    @gv-input:clear="${this._onClearPolicy}"></gv-input>
              </div>
           </gv-policy-studio-menu>
         </div>`;
  }

  _renderSettings () {
    const flow = this.getSelectedFlow();
    if (flow) {
      const { plan } = this._findFlowCollection(flow.id);
      const values = deepClone(flow);
      return html`<div id="settings" slot="content" class="flow-settings" @dragover="${this._onDesign}">
                    <gv-schema-form .schema="${this.flowSettingsForm}" 
                              id="settings-form"
                              .values="${values}"
                              has-header
                              has-footer
                              @gv-schema-form:cancel="${this._onCancelFlow}"
                              @gv-schema-form:submit="${this._onSubmitFlow}">
                        <div slot="title" class="${classMap({ 'flow-name': true, dirty: flow._dirty })}">
                          ${getFlowName(flow, plan)}
                        </div>
                    </gv-schema-form>
            </div>`;
    }
    else {
      return html`<div id="settings" slot="content" class="flow-settings" @dragover="${this._onDesign}">${this._renderFlowEmptyState()}</div>`;
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
              sortable
              .query="${this._searchFlowQuery}"
              @gv-policy-studio-menu:reorder-flows="${this._onReorderFlows}"
              @gv-policy-studio-menu:change-flow-state="${this._onChangeFlowState}"
              @gv-policy-studio-menu:add-flow="${this._onAddFlow}"
              @gv-policy-studio-menu:add-flow-plan="${this._onAddFlowPlan}"
              @gv-policy-studio-menu:delete-flow="${this._onDeleteFlow}"
              @gv-policy-studio-menu:duplicate-flow="${this._onDuplicateFlow}"
              @gv-policy-studio-menu:select-flows="${this._onSelectFlows}">
              
                <div slot="header" class="header-actions">
                  <div class="title">${this._definition.name}</div>
                  <gv-option .options="${this._flowFilterOptions}" multiple outlined .value="${this._flowFilter}" small @gv-option:select="${this._onFilterFlows}"></gv-option>
                  <gv-input id="search-flow" placeholder="Filter flows (Ctrl + Space)" type="search" small
                    @gv-input:input="${this._onSearchFlows}" 
                    @gv-input:clear="${this._onClearFlows}"></gv-input>
                </div>
                
                <div slot="footer" class="footer-actions">
                  <gv-button class="save" .disabled="${!this.isDirty}" @gv-button:click="${this._onSaveAll}">Save</gv-button>
                  <gv-button link .disabled="${!this.isDirty}" @gv-button:click="${this._onResetAll}">Reset</gv-button>
                </div>
         </gv-policy-studio-menu>

        <gv-tabs .value="${this.tabId}" .options="${this._tabs}" @gv-tabs:change="${this._onChangeTab}" .validator="${this._changeTabValidator.bind(this)}">
            ${this._renderDesign()}
            ${this._renderSettings()}
            <gv-properties id="properties" slot="content" class="properties"
                            .provider="${this.services['dynamic-property']}"  
                            @gv-properties:change="${this._onPropertiesChange}"
                            @gv-properties:save-provider="${this._onSaveProvider}" 
                            .properties="${this.definedProperties}" 
                            .providers="${this.propertyProviders}"></gv-properties>
            <gv-resources id="resources" slot="content" class="resources"
                          @gv-resources:change="${this._onResourcesChange}" 
                          .resources="${this.definedResources}" 
                          .types="${this.resourceTypes}"></gv-resources>
        </gv-tabs>
         
      </div>`;
  }

}

window.customElements.define('gv-policy-studio', GvPolicyStudio);
