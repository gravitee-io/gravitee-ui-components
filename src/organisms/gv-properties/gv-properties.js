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
import { css, html, LitElement } from 'lit';

import '../gv-schema-form';
import '../gv-resizable-views';
import '../../molecules/gv-table';
import '../../atoms/gv-button';
import '../../atoms/gv-input';
import '../../atoms/gv-icon';
import '../../atoms/gv-text';
import '../../atoms/gv-input-message';
import '../../atoms/gv-select';
import { dispatchCustomEvent } from '../../lib/events';
import { ERROR_TYPES, parseRaw, toNameEqualsValueString } from '../../lib/properties';
import { i18n } from '../../lib/i18n';
import { classMap } from 'lit/directives/class-map.js';
import { KeyboardElement, KEYS } from '../../mixins/keyboard-element';
import { empty } from '../../styles/empty';

/**
 * A component to manage properties
 *
 * @fires gv-properties:change - When list of properties change
 * @fires gv-properties:save-provider - When user validates provider configuration
 * @fires gv-properties:switch-encrypted - When user switches encryption toggle
 *
 * @attr {Array} properties - Array of Properties {key, value, dynamic?}
 * @attr {Object} provider - Configuration of provider
 * @attr {Array} providers - List of available providers (only http for the moment)
 * @attr {Boolean} expert - For display expert mode by default
 * @attr {Boolean} encryptable - To display the 'encrypted' toggle on each property
 *
 * @cssprop {Length} [--gv-properties-table--colmg=0.2rem] - Table cells margin
 */
export class GvProperties extends KeyboardElement(LitElement) {
  static get properties() {
    return {
      dynamicPropertySchema: { type: Object },
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
      readonly: { type: Boolean, reflect: true },
      encryptable: { type: Boolean, reflect: true },
    };
  }

  constructor() {
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

  get keyboardTarget() {
    return window;
  }

  onKeyboard() {
    if (this.isPressed(KEYS.Esc)) {
      this._onClosePropertySchemaForm();
    }
    if (this.isPressed(KEYS.Shift, KEYS.Alt, KEYS.Space)) {
      const search = this.shadowRoot.querySelector('#search-property');
      if (search) {
        search.focus();
      }
    }
  }

  set properties(properties) {
    this._properties = properties
      .sort((a, b) => a.key.localeCompare(b.key))
      .map((property) => {
        if (property.encrypted) {
          property.encryptable = true;
        }
        return property;
      });
  }

  get properties() {
    return this._properties;
  }

  _getResizableViews() {
    return this.shadowRoot.querySelector('gv-resizable-views');
  }

  _maximizeTopView() {
    const views = this._getResizableViews();
    if (views) {
      views.maximizeTop(95, 5);
    }
  }

  _maximizeBottomView() {
    const views = this._getResizableViews();
    if (views) {
      views.resize(30, 70);
    }
  }

  _splitMainViews() {
    const views = this._getResizableViews();
    if (views) {
      views.split();
    }
  }

  _isNewLineTable(line) {
    return line._new === true;
  }

  _onInputNew(name, event) {
    const target = event.target;
    this._newItem[name] = event.detail;
    const { errors } = parseRaw(toNameEqualsValueString([...this.properties, this._newItem]));
    this._errors = errors;
    setTimeout(() => {
      const btn = this.shadowRoot.querySelector('gv-button#add-property');
      if (errors.length > 0 || this._disabledNewLine(this._newItem)) {
        btn.setAttribute('disabled', true);
      } else {
        btn.removeAttribute('disabled');
      }
      if (name === 'key') {
        if (errors.length === 0) {
          target.removeAttribute('invalid');
          target.setAttribute('valid', true);
        } else {
          target.removeAttribute('valid');
          target.setAttribute('invalid', true);
        }
      }
    }, 0);
  }

  _onInput() {
    dispatchCustomEvent(this, 'change', { properties: this.properties });
  }

  _onSwitchEncrypted(item) {
    if (item.encrypted === true) {
      item.value = '';
      item.encrypted = false;
      item.encryptionWarning = i18n('gv-properties.infos.overwrite-encryption');
      this.requestUpdate();
    }
    dispatchCustomEvent(this, 'switch-encrypted', { properties: this.properties });
  }

  _addProperty(item) {
    delete item._new;
    this.properties = [item, ...this._properties];
    this._newItem = { key: '', value: '', _new: true, encryptable: false, encrypted: false };
    dispatchCustomEvent(this, 'change', { properties: this.properties });
  }

  _removeProperty(item) {
    this._properties = this._properties.filter((property) => property.key !== item.key);
    dispatchCustomEvent(this, 'change', { properties: this.properties });
  }

  _disabledNewLine(item) {
    return item.key == null || item.value == null || item.key.trim() === '' || item.value.trim() === '';
  }

  _submitExpertMode() {
    if (this.expert) {
      this.properties = this._handleExpertModeInput(this.shadowRoot.querySelector('#expert-input').value);
    }
  }

  _onExpertModeTextInput({ detail }) {
    this._handleExpertModeInput(detail);
  }

  _handleExpertModeInput(expertModeInputString) {
    let allProperties = this._properties;
    const providerEnabled = this.provider && this.provider.enabled;
    const dynamicProperties = allProperties.filter((prop) => providerEnabled && prop.dynamic);
    const encryptedProperties = allProperties.filter((prop) => prop.encrypted);

    const allPropertiesString = `${expertModeInputString}\n${toNameEqualsValueString(dynamicProperties)}\n${toNameEqualsValueString(
      encryptedProperties,
    )}`;
    const { errors } = parseRaw(allPropertiesString);
    this._errors = errors;
    if (errors.length === 0) {
      const { variables } = parseRaw(expertModeInputString);
      allProperties = [...variables, ...dynamicProperties, ...encryptedProperties];
      dispatchCustomEvent(this, 'change', { properties: allProperties });
    }

    return allProperties;
  }

  _onSubmitPropertyForm({ detail }) {
    const provider = detail.values;
    dispatchCustomEvent(this, 'save-provider', { provider });
    this.requestUpdate();
  }

  submit() {
    if (this.expert) {
      this._submitExpertMode();
    } else {
      this._onSubmit();
    }
  }

  _onSubmit(event) {
    if (event) {
      event.preventDefault();
    }
    const invalidControls = [...this.shadowRoot.querySelectorAll('form .control')].find((control) => control.invalid);
    if (invalidControls == null) {
      this._addProperty(this._newItem);
    }
  }

  _onConfigureDynamicProperties() {
    if (this.dynamicPropertySchema == null) {
      // dynamicPropertySchema has been introduced to ensure backward compatibility with old versions. If no schema is provided a default schema will be used.
      const providersTitleMap = this.providers.reduce((map, provider) => {
        map[provider.id] = provider.key;
        return map;
      }, {});

      const providersEnum = Object.keys(providersTitleMap);
      this.dynamicPropertySchema = {
        properties: {
          enabled: {
            type: 'boolean',
            title: 'Enabled',
            description: ' This service is requiring an API deployment. Do not forget to deploy API to start dynamic-properties service.',
          },
          schedule: {
            type: 'string',
            title: 'Schedule',
            'x-schema-form': {
              'cron-expression': true,
            },
          },
          provider: {
            type: 'string',
            title: 'Provider type',
            enum: providersEnum,
            default: providersEnum[0],
            'x-schema-form': {
              titleMap: providersTitleMap,
            },
          },
        },
        required: ['schedule', 'provider'],
      };
    }

    const defaultProvider = this.providers[0];

    this._propertySchemaForm = {
      properties: { ...this.dynamicPropertySchema.properties, configuration: defaultProvider.schema },
      required: this.dynamicPropertySchema.required,
    };
    this._providerDocumentation = defaultProvider.documentation;
    this._maximizeBottomView();
  }

  _onClosePropertySchemaForm() {
    this._propertySchemaForm = null;
    this._maximizeTopView();
  }

  _onSearchProperty({ detail }) {
    this._filter = detail;
    this._onClosePropertySchemaForm();
  }

  _onClearProperty() {
    this._filter = null;
    this._onClosePropertySchemaForm();
  }

  get _errors() {
    return this._formattedErrors;
  }

  set _errors(rawErrors) {
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

  _renderErrors(withLine = false) {
    if (this._formattedErrors.length > 0) {
      return html`<div class="${classMap({ 'add-form-error': true, 'add-form-error_expert': this.expert })}">
        <div></div>
        <div class="error-list">
          ${this._formattedErrors.map(
            ({ line, msg }) => html`
              <gv-input-message
                >${withLine ? html`<strong .innerHTML="${i18n('gv-properties.errors.line')} ${line}:&nbsp;"></strong>` : ''}
                <span .innerHTML="${msg}"></span
              ></gv-input-message>
            `,
          )}
        </div>
      </div>`;
    }
    return html``;
  }

  _renderTable() {
    const providerEnabled = this.provider && this.provider.enabled;
    if (this.expert) {
      this._computeTextRows();

      const staticProperties = providerEnabled ? this._properties.filter((prop) => !(providerEnabled && prop.dynamic)) : this._properties;
      const expertProperties = staticProperties.filter((prop) => !prop.encrypted);
      const content = expertProperties.map((prop) => `${prop.key}="${prop.value}"`).join('\n');

      return html`<gv-text
          id="expert-input"
          placeholder="${i18n('gv-properties.placeholder.input')}"
          @gv-text:input="${this._onExpertModeTextInput}"
          .value="${content}"
          ?readonly="${this.readonly}"
          .rows="${this._textRows}"
        ></gv-text>
        ${this._renderErrors(true)}`;
    } else {
      const options = {
        data: [
          {
            field: 'dynamic',
            label: 'Dynamic',
            width: '40px',
            type: (item) => (item.dynamic && providerEnabled ? 'gv-icon' : 'div'),
            attributes: {
              shape: (item) => (item.dynamic && providerEnabled ? 'code:time-schedule' : ''),
              title: (item) => (item.dynamic && providerEnabled ? 'Dynamic properties service is actually in running' : ''),
              style: 'justify-content: center; align-items: center; height: 100%;',
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
              readonly: this.readonly,
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
              readonly: this.readonly,
              disabled: (item) => (item.dynamic && providerEnabled) || item.encrypted,
              type: (item) => (item.encrypted ? 'password' : 'text'),
              title: (item) => (item.encrypted ? i18n('gv-properties.infos.encrypted-value') : ''),
              description: (item) => item.encryptionWarning,
              icon: null,
              'ongv-input:input': this._onInput.bind(this),
            },
          },
        ],
      };

      if (this.encryptable === true) {
        options.data.push({
          field: 'encryptable',
          type: 'gv-switch',
          style: '--gv-switch--ta: right;',
          width: '105px',
          attributes: {
            description: i18n('gv-properties.encrypted-toggle'),
            required: true,
            readonly: this.readonly,
            disabled: (item) => item.dynamic && providerEnabled,
            'ongv-switch:input': this._onSwitchEncrypted.bind(this),
            style: 'display: inline-flex; font-size: 12px; height: 40px;',
          },
        });
      }

      if (this.readonly !== true) {
        options.data.push({
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
        });
      }

      const filteredProperties =
        this._filter != null
          ? this._properties.filter((prop) => {
              return (prop.key.toLowerCase() + prop.value.toLowerCase()).includes(this._filter);
            })
          : this._properties;
      let properties = [...filteredProperties];
      if (this._paginationData) {
        this._paginationData.last = Math.ceil(filteredProperties.length / this._pageSize);
        this._paginationData.total = filteredProperties.length;
        this._paginationData.total_pages = Math.ceil(filteredProperties.length / this._pageSize);
        const index = (this._paginationData.current_page - 1) * this._pageSize;
        properties = [...filteredProperties].splice(index, this._pageSize);
      }

      const addPropertyFormGridClass = this.encryptable ? 'add-form-grid-with-encrypted-toggle' : 'add-form-grid';

      const addPropertyForm =
        this.readonly !== true
          ? html`<form id="add-property-form" class="add-form ${addPropertyFormGridClass}" @submit="${this._onSubmit}">
                <div></div>
                <gv-input
                  class="control"
                  placeholder="${i18n('gv-properties.placeholder.key')}"
                  required
                  @gv-input:input="${this._onInputNew.bind(this, 'key')}"
                  value="${this._newItem.key}"
                ></gv-input>
                <gv-input
                  class="control"
                  placeholder="${i18n('gv-properties.placeholder.value')}"
                  required
                  @gv-input:input="${this._onInputNew.bind(this, 'value')}"
                  .value="${this._newItem.value}"
                ></gv-input>
                ${this.encryptable
                  ? html` <gv-switch
                      class="control"
                      required
                      description="${i18n('gv-properties.encrypted-toggle')}"
                      @gv-switch:input="${this._onInputNew.bind(this, 'encryptable')}"
                      .value="${this._newItem.encryptable}"
                    ></gv-switch>`
                  : ''}
                <gv-button
                  id="add-property"
                  icon="code:plus"
                  outlined
                  disabled
                  @gv-button:click="${this._addProperty.bind(this, this._newItem)}"
                  title="${i18n('gv-properties.add')}"
                ></gv-button>
              </form>
              ${this._renderErrors()}
              <hr />`
          : '';

      return html` ${addPropertyForm}
        <gv-table .options="${options}" .items="${properties}" noheader nosort order="key" rowheight="57px"></gv-table>`;
    }
  }

  _onChangeMode({ detail }) {
    this._submitExpertMode();
    this.expert = detail;
    this._errors = [];
    this._newItem = { key: '', value: '', _new: true };
    this._onClosePropertySchemaForm();
  }

  _onPaginate({ detail }) {
    if (detail.page) {
      this._paginationData.current_page = detail.page;
    }
    if (detail.size) {
      this._pageSize = detail.size;
    }
    this._onClosePropertySchemaForm();
    this.requestUpdate();
  }

  updated(props) {
    if (props.has('_properties') || props.has('_pageSize')) {
      this._paginationData = {
        first: 1,
        last: Math.ceil(this._properties.length / this._pageSize),
        total: this._properties.length,
        current_page: 1,
        total_pages: Math.ceil(this._properties.length / this._pageSize),
        size: this._pageSize,
        sizes: this._pageSizes,
      };
    }
  }

  _renderTableForm() {
    return html`<div class="container">
      <div class="header">
        <div class="title">Manage API properties <span>(${this._properties ? this._properties.length : 0})</span></div>
        <gv-switch
          small
          .description="${this.expert ? 'Expert' : 'Simple'}"
          .value="${this.expert}"
          @gv-switch:input="${this._onChangeMode}"
        ></gv-switch>
        <gv-input
          id="search-property"
          placeholder="Filter properties (Shift + Alt + Space)"
          type="search"
          small
          class="search-input"
          .disabled="${this.expert}"
          @gv-input:input="${this._onSearchProperty}"
          @gv-input:clear="${this._onClearProperty}"
        ></gv-input>
        <gv-pagination
          @gv-pagination:paginate="${this._onPaginate}"
          .disabled="${this.expert || this._paginationData == null}"
          .data="${this._paginationData}"
          widget
          has-select
        ></gv-pagination>
      </div>
      <div class="content"><div class="form-content">${this._renderTable()}</div></div>
    </div>`;
  }

  _fetchDocumentation() {
    this._showDocumentation = true;
  }

  _hideDocumentation() {
    this._showDocumentation = false;
  }

  get dirty() {
    const form = this.shadowRoot.querySelector('gv-schema-form');
    return form && form.dirty;
  }

  confirm() {
    const form = this.shadowRoot.querySelector('gv-schema-form');
    if (form) {
      return form.confirm().then(() => this._onClosePropertySchemaForm());
    }
    return Promise.resolve();
  }

  _renderForm() {
    return html`<gv-schema-form
      slot="top"
      scrollable
      .schema="${this._propertySchemaForm}"
      .values="${this.provider}"
      .icon="design:edit"
      has-header
      ?readonly="${this.readonly}"
      @gv-schema-form:submit="${this._onSubmitPropertyForm}"
    >
      <div slot="title" class="properties-title">Configure dynamic properties</div>
      <gv-button
        slot="header-left"
        icon="general:close"
        outlined
        small
        @gv-button:click="${this._onClosePropertySchemaForm}"
        title="Close (esc)"
      ></gv-button>
      <gv-button
        slot="header-left"
        icon="home:book"
        ?disabled="${this._showDocumentation}"
        outlined
        small
        @gv-button:click="${this._fetchDocumentation}"
        title="Open documentation"
      ></gv-button>
    </gv-schema-form>`;
  }

  _renderBottom() {
    if (this._propertySchemaForm && this._showDocumentation) {
      return html`<gv-resizable-views no-overflow direction="horizontal">
        ${this._renderForm()}
        <gv-documentation
          slot="bottom"
          .text="${this._providerDocumentation}"
          @gv-documentation:close="${this._hideDocumentation}"
        ></gv-documentation>
      </gv-resizable-views>`;
    } else if (this._propertySchemaForm) {
      return this._renderForm();
    } else {
      return html`<div class="properties-bottom-container">${this._renderDynamicConfiguration()}</div>`;
    }
  }

  _renderDynamicConfiguration() {
    const hasDynamicConfiguration = this.provider && this.provider.enabled;

    let configureAction = '';
    if (hasDynamicConfiguration || this.readonly !== true) {
      configureAction = html`<gv-button
        icon="tools:tools"
        @gv-button:click="${this._onConfigureDynamicProperties}"
        outlined
        .disabled="${this.expert}"
        >Configure dynamic properties</gv-button
      >`;
    }

    if (hasDynamicConfiguration) {
      return html`<div class="properties-message">
          Dynamic properties service is actually in <code>running</code> state and run with cron expression
          <code>${this.provider.schedule}</code> using <code>${this.provider.provider}</code> provider.
        </div>
        ${configureAction}`;
    } else if (this.readonly) {
      return html`<div class="empty">No dynamic properties service configured</div>`;
    } else {
      return configureAction;
    }
  }

  _onMove() {
    this._computeTextRows();
  }

  _computeTextRows() {
    const parent = this.shadowRoot.querySelector('.content');
    if (parent) {
      const { height } = parent.getBoundingClientRect();
      // --gv-text--lh=30px
      this._textRows = Math.round(Math.round(height - 20) / 30) - 2;
    }
  }

  render() {
    if (this.providers && this.providers.length > 0) {
      return html`<div class="properties">
        <gv-resizable-views no-overflow @gv-resizable-views:move="${this._onMove}" @gv-resizable-views:resize="${this._onMove}">
          <div slot="top" class="box">${this._renderTableForm()}</div>
          <div slot="bottom">${this._renderBottom()}</div>
        </gv-resizable-views>
      </div>`;
    } else {
      return html`<div class="properties">
        <div class="table-box">${this._renderTableForm()}</div>
      </div>`;
    }
  }

  static get styles() {
    return [
      empty,
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
          border-left: 1px solid #bfbfbf;
          display: flex;
        }

        gv-table {
          height: auto;
          flex: 1;
          margin-top: 10px;
          margin-right: 50px;
          --gv-table-rows--ov: none;
          --gv-table--colmg: var(--gv-properties-table--colmg, 0.2rem);
          --gv-table-cell--d: inline;
          --gv-table-row--ai: flex-start;
          --gv-table-row--ac: flex-start;
          --gv-table-hover--bgc: var(--gv-theme-neutral-color-lightest);
        }

        .properties-title {
          text-transform: uppercase;
          letter-spacing: 0.2rem;
        }

        .properties-bottom-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: calc(100% - var(--gv-policy-studio--pb, 0px));
          flex-direction: column;
        }

        .header {
          border-bottom: 1px solid #d9d9d9;
          display: flex;
          min-height: 45px;
          align-items: center;
          margin-bottom: 0.5rem;
          padding: 0 0.5rem;
        }

        .header .title {
          color: #28444f;
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

        gv-switch {
          --gv-switch--ta: right;
        }

        .header gv-input {
          margin: 0 1rem;
        }

        .add-form,
        .add-form-error {
          display: grid;
          margin: auto 50px auto 0;
          box-sizing: border-box;
        }

        .add-form {
          column-gap: var(--gv-properties-table--colmg, 0.2rem);
          border-right: solid thick transparent;
          height: 50px;
        }

        .add-form gv-input,
        .add-form gv-button,
        .add-form gv-switch {
          margin: auto 0;
        }

        .add-form gv-switch {
          font-size: 12px;
        }

        .add-form-grid {
          grid-template-columns: 40px auto auto 40px;
        }

        .add-form-grid-with-encrypted-toggle {
          grid-template-columns: 40px auto auto 105px 40px;
        }

        .add-form-error_expert {
          display: flex;
        }

        .add-form-error {
          grid-template-columns: 40px 1fr;
        }

        code {
          color: var(--gv-theme-color-warning-dark, #f57c00);
        }

        .form-content {
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

        hr {
          background-color: var(--gv-theme-neutral-color);
          border: 0;
          width: 100%;
          height: 2px;
        }
      `,
    ];
  }
}

window.customElements.define('gv-properties', GvProperties);
