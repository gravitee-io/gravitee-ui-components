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

import './gv-schema-form';
import './gv-resizable-views';
import '../molecules/gv-table';
import '../atoms/gv-button';
import '../atoms/gv-input';
import '../atoms/gv-icon';
import '../atoms/gv-text';
import '../atoms/gv-input-message';
import '../atoms/gv-select';
import { dispatchCustomEvent } from '../lib/events';
import { ERROR_TYPES, parseRaw, toNameEqualsValueString } from '../lib/properties';
import { i18n } from '../lib/i18n';
import { classMap } from 'lit-html/directives/class-map';
import { KeyboardElement, KEYS } from '../mixins/keyboard-element';

/**
 * A component to manage properties
 *
 * @fires gv-properties:change - When list of properties change
 * @fires gv-properties:save-provider - When user validate provider configuration
 *
 * @attr {Array} properties - Array of Properties {key, value, dynamic?}
 * @attr {Object} provider - Configuration of provider
 * @attr {Array} providers - List of available providers (only http for the moment)
 * @attr {Boolean} expert - For display expert mode by default
 */
export class GvProperties extends KeyboardElement(LitElement) {

  static get properties () {
    return {
      properties: { type: Array },
      _properties: { type: Array, attribute: false },
      provider: { type: Object },
      providers: { type: Array },
      _propertySchemaForm: { type: Object, attribute: false },
      expert: { type: Boolean },
      _formattedErrors: { type: Array, attributes: false },
      _filter: { type: String },
      _paginationData: { type: Object, attribute: false },
      _pageSize: { type: Number, attribute: false },
      _newItem: { type: Object, attribute: false },
      _providerDocumentation: { type: Boolean, attribute: false },
      _showDocumentation: { type: Boolean, attribute: false },
      _textRows: { type: Number, attribute: false },
    };
  }

  constructor () {
    super();
    this.properties = [];
    this.types = [];
    this.provider = {};
    this._currentResource = null;
    this._formattedErrors = [];
    this._showDocumentation = true;
    this._newItem = { key: '', value: '', _new: true };
    this._pageSize = 10;
    this._textRows = 10;
    this._pageSizes = [5, 10, 25, 50, 100];
    this._errors = [];
  }

  onKeyboard () {
    if (this.isPressed(KEYS.Esc)) {
      this._onClosePropertySchemaForm();
    }
    if (this.isPressed(KEYS.Shift, KEYS.Ctrl, KEYS.Space)) {
      const search = this.shadowRoot.querySelector('#search-property');
      if (search) {
        search.focus();
      }
    }
  }

  set properties (properties) {
    this._properties = properties.sort((a, b) => a.key.localeCompare(b.key));
  }

  get properties () {
    return this._properties;
  }

  _getResizableViews () {
    return this.shadowRoot.querySelector('gv-resizable-views');
  }

  _maximizeTopView () {
    const views = this._getResizableViews();
    if (views) {
      views.maximizeTop(95, 5);
    }
  }

  _maximizeBottomView () {
    const views = this._getResizableViews();
    if (views) {
      views.resize(30, 70);
    }
  }

  _splitMainViews () {
    const views = this._getResizableViews();
    if (views) {
      views.split();
    }
  }

  _isNewLineTable (line) {
    return line._new === true;
  }

  _onInputNew (name, event) {
    const target = event.target;
    this._newItem[name] = event.detail;
    const { errors } = parseRaw(toNameEqualsValueString([...this.properties, this._newItem]));
    this._errors = errors;
    setTimeout(() => {
      const btn = this.shadowRoot.querySelector('gv-button#add-property');
      if (errors.length > 0 || this._disabledNewLine(this._newItem)) {
        btn.setAttribute('disabled', true);
      }
      else {
        btn.removeAttribute('disabled');
      }
      if (name === 'key') {
        if (errors.length === 0) {
          target.removeAttribute('invalid');
          target.setAttribute('valid', true);

        }
        else {
          target.removeAttribute('valid');
          target.setAttribute('invalid', true);
        }
      }
    }, 0);
  }

  _onInput () {
    dispatchCustomEvent(this, 'change', { properties: this.properties });
  }

  _addProperty (item) {
    delete item._new;
    this.properties = [item, ...this._properties];
    this._newItem = { key: '', value: '', _new: true };
    dispatchCustomEvent(this, 'change', { properties: this.properties });
  }

  _removeProperty (item) {
    this._properties = this._properties.filter((property) => property.key !== item.key);
    dispatchCustomEvent(this, 'change', { properties: this.properties });
  }

  _disabledNewLine (item) {
    return item.key == null || item.value == null || item.key.trim() === '' || item.value.trim() === '';
  }

  _onSubmitPropertyForm ({ detail }) {
    const provider = detail.values;
    dispatchCustomEvent(this, 'save-provider', { provider });
    this.requestUpdate();
  }

  _onSubmit (e) {
    const invalidControls = [...e.target.querySelectorAll('.control')].find((control) => control.invalid);
    if (invalidControls == null) {
      this._addProperty(this._newItem);
    }
  }

  _onConfigureDynamicProperties () {
    const providers = this.providers.map((provider) => ({ label: provider.key, value: provider.id }));
    const defaultProvider = this.providers[0];
    const defaultSchema = {
      properties: {
        enabled: {
          type: 'boolean',
          title: 'Enabled',
          description: ' This service is requiring an API deployment. Do not forget to deploy API to start dynamic-properties service.',
        },
        trigger: {
          type: 'object',
          properties: {
            rate: {
              type: 'integer',
              title: 'Polling frequency interval',
            },
            unit: {
              type: 'string',
              title: 'Time unit',
              enum: ['SECONDS', 'MINUTES', 'HOURS'],
            },
          },
          required: [
            'rate',
            'unit',
          ],
        },
        provider: {
          type: 'string',
          title: 'Provider type',
          enum: providers,
          default: defaultProvider.id,
        },
      },
      required: [
        'provider',
      ],
    };

    this._propertySchemaForm = {
      properties: { ...defaultSchema.properties, configuration: defaultProvider.schema },
      required: defaultSchema.required,
    };
    this._providerDocumentation = defaultProvider.documentation;
    this._maximizeBottomView();
  }

  _onClosePropertySchemaForm () {
    this._propertySchemaForm = null;
    this._maximizeTopView();
  }

  _onSearchProperty ({ detail }) {
    this._filter = detail;
    this._onClosePropertySchemaForm();
  }

  _onClearProperty () {
    this._filter = null;
    this._onClosePropertySchemaForm();
  }

  get _errors () {
    return this._formattedErrors;
  }

  set _errors (rawErrors) {
    this._formattedErrors = rawErrors.map(({ type, key, pos }) => {
      if (type === ERROR_TYPES.INVALID_NAME) {
        return {
          line: pos.line,
          msg: i18n('gv-properties.errors.invalid-key', { key }),
        };
      }
      if (type === ERROR_TYPES.DUPLICATED_NAME) {
        return {
          line: pos.line,
          msg: i18n('gv-properties.errors.duplicated-key', { key }),
        };
      }
      if (type === ERROR_TYPES.INVALID_LINE) {
        return {
          line: pos.line,
          msg: i18n('gv-properties.errors.invalid-line'),
        };
      }
      if (type === ERROR_TYPES.INVALID_VALUE) {
        return {
          line: pos.line,
          msg: i18n('gv-properties.errors.invalid-value'),
        };
      }
      return { line: '?', msg: i18n('gv-properties.errors.unknown') };
    });
  }

  _onTextInput ({ detail }) {
    const providerEnabled = this.provider && this.provider.enabled;
    const dynamicProperties = this._properties.filter((prop) => providerEnabled && prop.dynamic);
    const allProperties = `${detail}\n${toNameEqualsValueString(dynamicProperties)}`;
    const { errors } = parseRaw(allProperties);
    this._errors = errors;
    if (errors.length === 0) {
      const { variables } = parseRaw(detail);
      dispatchCustomEvent(this, 'change', { properties: [...variables, ...dynamicProperties] });
    }
  }

  _renderErrors (withLine = false) {
    if (this._formattedErrors.length > 0) {
      return html`<div class="${classMap({ 'add-form-error': true, 'add-form-error_expert': this.expert })}"><div></div><div class="error-list">
          ${this._formattedErrors.map(({ line, msg }) => html`
            <gv-input-message>${withLine ? html`<strong .innerHTML="${i18n('gv-properties.errors.line')} ${line}:&nbsp;"></strong>` : ''} <span .innerHTML="${msg}"></span></gv-input-message>
          `)}
        </div></div>`;
    }
    return html``;
  }

  _renderTable () {
    const providerEnabled = this.provider && this.provider.enabled;
    if (this.expert) {
      this._computeTextRows();

      const expertProperties = providerEnabled ? this._properties.filter((prop) => (!(providerEnabled && prop.dynamic))) : this._properties;
      const content = expertProperties.map((prop) => (`${prop.key}="${prop.value}"`)).join('\n');

      return html`<gv-text id="expert-input" 
                           placeholder="${i18n('gv-properties.placeholder.input')}"
                           @gv-text:input="${this._onTextInput}" 
                           .value="${content}" 
                           .rows="${this._textRows}"></gv-text>
                  ${this._renderErrors(true)}`;

    }
    else {
      const options = {
        data: [
          {
            field: 'dynamic',
            label: 'Dynamic',
            width: '40px',
            type: (item) => item.dynamic && providerEnabled ? 'gv-icon' : 'div',
            attributes: {
              shape: (item) => item.dynamic && providerEnabled ? 'code:time-schedule' : '',
              title: (item) => item.dynamic && providerEnabled ? 'Dynamic properties service is actually in running' : '',
              style: 'justify-content: center;',
            },
          },
          {
            field: 'key',
            label: 'Key',
            type: 'gv-input',
            attributes: {
              clipboard: true,
              placeholder: i18n('gv-properties.placeholder.key'),
              name: 'key',
              required: true,
            },
          },
          {
            field: 'value',
            label: 'Value',
            type: 'gv-input',
            attributes: {
              name: 'value',
              placeholder: 'Property value',
              required: true,
              disabled: (item) => item.dynamic && providerEnabled,
              'ongv-input:input': this._onInput.bind(this),
            },
          },
          {
            type: 'gv-button',
            width: '40px',
            attributes: {
              'ongv-button:click': (item, event, target) => this._removeProperty(item, target),
              title: 'Remove',
              disabled: (item) => item.dynamic && providerEnabled,
              danger: true,
              outlined: true,
              icon: 'home:trash',
            },
          },
        ],
      };

      const filteredProperties = this._filter != null ? this._properties.filter((prop) => {
        return (prop.key.toLowerCase() + prop.value.toLowerCase()).includes(this._filter);
      }) : this._properties;
      let properties = [...filteredProperties];
      if (this._paginationData) {
        this._paginationData.last = Math.ceil(filteredProperties.length / this._pageSize);
        this._paginationData.total = filteredProperties.length;
        this._paginationData.total_pages = Math.ceil(filteredProperties.length / this._pageSize);
        const index = (this._paginationData.current_page - 1) * this._pageSize;
        properties = [...filteredProperties].splice(index, this._pageSize);
      }

      return html`<form class="add-form" @submit="${this._onSubmit}">
                      <div></div>
                      <gv-input class="control" placeholder="${i18n('gv-properties.placeholder.key')}" required @gv-input:input="${this._onInputNew.bind(this, 'key')}" value="${this._newItem.key}"></gv-input>
                      <gv-input class="control" placeholder="${i18n('gv-properties.placeholder.value')}" required @gv-input:input="${this._onInputNew.bind(this, 'value')}" .value="${this._newItem.value}"></gv-input>
                      <gv-button id="add-property" icon="code:plus" outlined disabled @gv-button:click="${this._addProperty.bind(this, this._newItem)}" title="${i18n('gv-properties.add')}"></gv-button>
                  </form>
                  ${this._renderErrors()}
                  <gv-table .options="${options}"
                            .items="${properties}"
                            noheader
                            nosort
                            order="key"
                            rowheight="50px"></gv-table>`;
    }
  }

  _onChangeMode ({ detail }) {
    if (!detail) {
      const providerEnabled = this.provider && this.provider.enabled;
      const manualPropertiesValue = this.shadowRoot.querySelector('#expert-input').value;
      const dynamicProperties = this._properties.filter((prop) => providerEnabled && prop.dynamic);
      const allProperties = `${manualPropertiesValue}\n${toNameEqualsValueString(dynamicProperties)}`;
      const { errors } = parseRaw(allProperties);
      if (errors.length === 0) {
        const { variables } = parseRaw(manualPropertiesValue);
        this.properties = [...variables, ...dynamicProperties];
      }
    }
    this.expert = detail;
    this._errors = [];
    this._newItem = { key: '', value: '', _new: true };
    this._onClosePropertySchemaForm();
  }

  _onPaginate ({ detail }) {
    this._paginationData.current_page = detail.page;
    this._onClosePropertySchemaForm();
    this.requestUpdate();
  }

  updated (props) {
    if (props.has('_properties') || props.has('_pageSize')) {
      this._paginationData = {
        first: 1,
        last: Math.ceil(this._properties.length / this._pageSize),
        total: this._properties.length,
        current_page: 1,
        total_pages: Math.ceil(this._properties.length / this._pageSize),
      };
    }
  }

  _onChangePageSize ({ detail }) {
    this._pageSize = Number(detail).valueOf();
    this._onClosePropertySchemaForm();
  }

  _renderTableForm () {
    return html`<div class="container">
                  <div class="header">
                    <div class="title">
                      Manage global properties <span>(${this._properties ? this._properties.length : 0})</span>
                    </div>
                    <gv-switch small .description="${this.expert ? 'Expert' : 'Simple'}" .value="${this.expert}" @gv-switch:input="${this._onChangeMode}"></gv-switch>
                    <gv-input id="search-property" placeholder="Filter properties (Shift + Ctrl + Space)" type="search" small
                              class="search-input"
                              .disabled="${this.expert}"
                              @gv-input:input="${this._onSearchProperty}"
                              @gv-input:clear="${this._onClearProperty}"></gv-input>
                    <gv-select class="page-size__select" @gv-select:input="${this._onChangePageSize}" small .options="${this._pageSizes}" .value="${this._pageSize}" .disabled="${this.expert || this._paginationData == null}"></gv-select>
                    <gv-pagination @gv-pagination:paginate="${this._onPaginate}" .disabled="${this.expert || this._paginationData == null}" .data="${this._paginationData}" widget></gv-pagination>
                  </div>
                  <div class="content"><div class="form-content">${this._renderTable()}</div></div>
                </div>`;
  }

  _fetchDocumentation () {
    this._showDocumentation = true;
  }

  _hideDocumentation () {
    this._showDocumentation = false;
  }

  get dirty () {
    const form = this.shadowRoot.querySelector('gv-schema-form');
    return form && form.dirty;
  }

  confirm () {
    const form = this.shadowRoot.querySelector('gv-schema-form');
    if (form) {
      return form.confirm().then(() => this._onClosePropertySchemaForm());
    }
    return Promise.resolve();
  }

  _renderForm () {
    return html`<gv-schema-form
                  slot="top"
                  .schema="${this._propertySchemaForm}"
                  .values="${this.provider}"
                  .icon="design:edit"
                  has-header
                  @gv-schema-form:submit="${this._onSubmitPropertyForm}">
                    <div slot="title" class="properties-title">Configure dynamic properties</div>
                    <gv-button slot="header-left" icon="general:close" outlined small @gv-button:click="${this._onClosePropertySchemaForm}" title="Close (esc)"></gv-button>
                    <gv-button slot="header-left" icon="home:book" ?disabled="${this._showDocumentation}" outlined small @gv-button:click="${this._fetchDocumentation}" title="Open documentation"></gv-button>
               </gv-schema-form>`;
  }

  _renderBottom () {
    if (this._propertySchemaForm && this._showDocumentation) {
      return html`<gv-resizable-views no-overflow direction="horizontal">
                    ${this._renderForm()}
                    <gv-documentation slot="bottom" .text="${this._providerDocumentation}" @gv-documentation:close="${this._hideDocumentation}"></gv-documentation>
                  </gv-resizable-views>`;
    }
    else if (this._propertySchemaForm) {
      return this._renderForm();
    }
    else {
      return html`<div class="properties-bottom-container">
                    ${this.provider && this.provider.enabled ? html`<div class="properties-message">
                      Dynamic properties service is actually in <code>running</code>
                      state and run each <code>${this.provider.trigger.rate} ${this.provider.trigger.unit}</code>
                      using <code>${this.provider.provider}</code> provider.
                      </div>` : ''}  
                    <gv-button icon="tools:tools" @gv-button:click="${this._onConfigureDynamicProperties}" outlined .disabled="${this.expert}">Configure dynamic properties</gv-button>
                  </div>`;
    }
  }

  _onMove () {
    this._computeTextRows();
  }

  _computeTextRows () {
    const parent = this.shadowRoot.querySelector('.content');
    if (parent) {
      const { height } = parent.getBoundingClientRect();
      // --gv-text--lh=30px
      this._textRows = Math.round(Math.round(height - 20) / 30) - 2;
    }
  }

  render () {
    if (this.providers && this.providers.length > 0) {
      return html`<div class="properties">
                    <gv-resizable-views no-overflow @gv-resizable-views:move="${this._onMove}"  @gv-resizable-views:resize="${this._onMove}">
                      <div slot="top" class="box">${this._renderTableForm()}</div>
                      <div slot="bottom">
                        ${this._renderBottom()}    
                      </div>
                    </gv-resizable-views>
                  </div>`;
    }
    else {
      return html`<div class="properties">
                    <div class="table-box">${this._renderTableForm()}</div>
                  </div>`;
    }

  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          height: 100%;
          width: 100%;
          display: block;
        }

        .properties {
          display: flex;
          height: 100%;
          width: 100%;
        }

        gv-resizable-views {
          height: 100%;
          width: 100%;
        }

        gv-schema-form {
          margin: 0;
        }

        .table-box {
          width: 100%;
          border-left: 1px solid #BFBFBF;
          display: flex;
        }

        gv-table {
          height: auto;
          flex: 1;
        }

        .properties-title {
          text-transform: uppercase;
          letter-spacing: 0.2rem;
        }

        .properties-bottom-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          flex-direction: column;
        }

        .header {
          border-bottom: 1px solid #D9D9D9;
          display: flex;
          min-height: 45px;
          align-items: center;
          margin-bottom: .5rem;
          padding: 0 .5rem;
        }

        .header .title {
          color: #28444F;
          font-size: 18px;
          display: flex;
          align-items: flex-end;
          flex: 1;
        }

        .header .title span {
          font-size: 12px;
          margin-left: 8px;
          opacity: 0.7;
        }

        .box {
          position: absolute;
          display: flex;
          flex-direction: column;
          width: 100%;
          top: 0;
          bottom: 0;
          left: 0;
        }

        .container {
          flex-grow: 1;

          display: flex;
          flex-direction: column;

          /* for Firefox */
          min-height: 0;
          height: 100%;
        }

        .content {
          background: white;
          flex-grow: 1;

          overflow: auto;

          /* for Firefox */
          min-height: 0;
          padding: 0.5rem;

          display: flex;
          flex-direction: column;
          align-items: center;
        }

        gv-text {
          --gv-text--fz: 20px;
          --gv-text--lh: 25px;
        }

        .header gv-input {
          margin: 0 1rem;
        }

        .add-form, .add-form-error {
          display: grid;
          box-sizing: border-box;
          margin: 0.2rem;
          border-right: solid thick transparent
        }

        .add-form {
          grid-template-columns: 40px calc(50% - 40px) calc(50% - 40px) 40px;
          height: 50px;
        }

        .add-form-error_expert {
          display: flex;
        }

        .add-form-error {
          grid-template-columns: 40px 1fr;
        }

        .add-form > * {
          margin: auto 0.2rem;
        }

        code {
          color: var(--gv-theme-color-warning-dark, #f57c00);
        }

        .form-content {
          max-width: 1200px;
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .properties-message {
          margin-bottom: 0.5rem;
          font-size: 14px;
        }

        .page-size__select {
          max-width: 50px;
        }

        .search-input {
          width: 300px;
        }
      `,
    ];
  }

}

window.customElements.define('gv-properties', GvProperties);
