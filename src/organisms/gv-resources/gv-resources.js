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
import '../gv-documentation';
import '../../molecules/gv-table';
import '../../atoms/gv-button';
import '../../molecules/gv-option';
import '../../atoms/gv-switch';
import '../../atoms/gv-icon';
import { dispatchCustomEvent } from '../../lib/events';
import { uuid } from '../../lib/utils';
import { KeyboardElement, KEYS } from '../../mixins/keyboard-element';
import { empty } from '../../styles/empty';

export class GvResources extends KeyboardElement(LitElement) {
  static get properties() {
    return {
      resources: { type: Array },
      types: { type: Array },
      documentation: { type: Object },
      _currentResource: { type: Object, attribute: false },
      _currentResourceLoading: { type: Boolean, attribute: false },
      _filter: { type: String },
      readonly: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.resources = [];
    this.types = [];
    this._currentResource = null;
    this._emptymessage = 'No resource';
  }

  get keyboardTarget() {
    return window;
  }

  onKeyboard() {
    if (this.isPressed(KEYS.Esc)) {
      this._onCancelResourceForm();
    }
    if (this.isPressed(KEYS.Shift, KEYS.Alt, KEYS.Space)) {
      const search = this.shadowRoot.querySelector('#search-resource');
      if (search) {
        search.focus();
      }
    }
  }

  firstUpdated() {
    const views = this.shadowRoot.querySelector('gv-resizable-views');
    if (views != null) {
      views.updateComplete.then(() => {
        this._maximizeTopView();
      });
    }
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('types') && this.types == null) {
      this.types = [];
    }
    if (changedProperties.has('resources') && this.resources != null) {
      this.resources = this._generateId(this.resources);
    }
  }

  _generateId(list) {
    if (list) {
      return list.map((e) => {
        if (e._id == null) {
          e._id = uuid();
        }
        return e;
      });
    }
    return list;
  }

  _getResizableViews() {
    return this.shadowRoot.querySelector('gv-resizable-views');
  }

  _maximizeTopView() {
    this._getResizableViews().resize(60, 40);
  }

  _maximizeBottomView() {
    this._getResizableViews().maximizeBottom();
  }

  _splitMainViews() {
    this._getResizableViews().split();
  }

  _onCancelResourceForm() {
    this._currentResource = null;
    this.documentation = null;
    this._maximizeTopView();
  }

  _removeResource(item) {
    this.resources = this.resources.filter((resource) => resource._id !== item._id);
    this._onCancelResourceForm();
    dispatchCustomEvent(this, 'change', { resources: this.resources });
  }

  _buildResourceSchema(resourceType) {
    const defaultSchema = {
      properties: {
        name: {
          type: 'string',
          title: 'Resource name',
        },
      },
      required: ['name'],
    };

    const schema = typeof resourceType.schema === 'string' ? JSON.parse(resourceType.schema) : resourceType.schema;

    return {
      properties: { ...defaultSchema.properties, ...schema.properties },
      required: [...defaultSchema.required, ...schema.required],
    };
  }

  _onDisplayResourceCTA(option) {
    dispatchCustomEvent(this, 'display-resource-cta', option);
  }

  _onCreateResource({ detail }) {
    this._currentResourceLoading = true;
    const defaultResourceType = this.types.find((type) => type.id === detail.id);
    const schema = this._buildResourceSchema(defaultResourceType);
    this._currentResource = {
      type: defaultResourceType.id,
      title: 'Create resource',
      icon: 'code:plus',
      schema,
      values: {},
      submitLabel: 'Add',
      dirty: true,
    };
    this._maximizeBottomView();
    this._onFetchDocumentation();
    setTimeout(() => (this._currentResourceLoading = false), 600);
  }

  _onSubmitResourceForm({ detail }) {
    delete this._currentResource._values;
    const { type } = this._currentResource;
    const { _id, name, ...configuration } = detail.values;

    const resource = {
      _id,
      type,
      name,
      configuration,
    };

    if (detail.values._id != null) {
      const index = this.resources.findIndex((r) => r._id === resource._id);
      this.resources[index] = { ...this.resources[index], ...resource };
    } else {
      if (this.resources == null) {
        this.resources = [];
      }
      resource._id = uuid();
      resource.enabled = true;
      this.resources.push(resource);
    }
    this._onCancelResourceForm();
    dispatchCustomEvent(this, 'change', { resources: this.resources });
  }

  _onChangeResourceForm({ detail }) {
    this._currentResource._values = detail.values;
  }

  _onResetResourceForm() {
    delete this._currentResource._values;
  }

  _findResourceById(id) {
    return this.types.find((resource) => resource.id === id);
  }

  // For readonly mode
  _onSelectResource({ detail: { items } }) {
    if (items.length > 0) {
      this._onEditResource(items[0]);
    } else {
      this._onCancelResourceForm();
    }
  }

  _onEditResource(resource) {
    const values = { ...resource, ...resource.configuration };
    delete values.configuration;
    const resourceType = this._findResourceById(resource.type);
    this._currentResource = {
      _id: resource._id,
      title: 'Resource configuration',
      type: resource.type,
      icon: 'design:edit',
      schema: this._buildResourceSchema(resourceType),
      values,
      submitLabel: 'Update',
    };
    this._splitMainViews();
    this._onFetchDocumentation();
  }

  _onCloseDocumentation() {
    this.documentation = null;
  }

  _getCurrentResourceType() {
    return this._currentResource ? this._findResourceById(this._currentResource.type) : null;
  }

  _onFetchDocumentation() {
    dispatchCustomEvent(this, 'fetch-documentation', { target: this, resourceType: this._getCurrentResourceType() });
  }

  get dirty() {
    const form = this.shadowRoot.querySelector('gv-schema-form');
    return form && form.dirty;
  }

  confirm() {
    const form = this.shadowRoot.querySelector('gv-schema-form');
    if (form) {
      return form.confirm().then(() => this._onCancelResourceForm());
    }
    return Promise.resolve();
  }

  _onChangeResourceState(item, event) {
    const index = this.resources.find((r) => r._id === item._id);
    this.resources[index] = { ...this.resources[index], enabled: item.enabled };
    dispatchCustomEvent(this, 'change', { resources: this.resources });
  }

  _renderForm() {
    const values = { ...this._currentResource.values, ...this._currentResource._values };
    return html`<gv-schema-form
      scrollable
      .schema="${this._currentResource.schema}"
      .values="${values}"
      submitLabel="${this._currentResource.submitLabel}"
      has-header
      .icon="${this._currentResource.icon}"
      validate-on-render
      .dirty="${this._currentResource.dirty || this._currentResource._values != null}"
      ?readonly="${this.readonly}"
      @gv-schema-form:change="${this._onChangeResourceForm}"
      @gv-schema-form:reset="${this._onResetResourceForm}"
      @gv-schema-form:submit="${this._onSubmitResourceForm}"
    >
      <div slot="title" class="form-title">${this._currentResource.title}</div>
      <gv-button
        slot="header-left"
        icon="general:close"
        outlined
        small
        @gv-button:click="${this._onCancelResourceForm}"
        title="Close (esc)"
      ></gv-button>
      <gv-button
        slot="header-left"
        icon="home:book"
        ?disabled="${this.documentation != null}"
        outlined
        small
        @gv-button:click="${this._onFetchDocumentation}"
        title="Open documentation"
      ></gv-button>
    </gv-schema-form>`;
  }

  _renderDoc() {
    return html`<gv-documentation
      .text="${this.documentation.content}"
      .image="${this.documentation.image}"
      @gv-documentation:close="${this._onCloseDocumentation}"
    ></gv-documentation>`;
  }

  _renderBottom() {
    if (this.documentation && this._currentResource) {
      return html` <gv-resizable-views direction="horizontal" no-overflow>
        <div slot="top">${this._renderForm()}</div>
        <div slot="bottom">${this._renderDoc()}</div>
      </gv-resizable-views>`;
    } else if (this._currentResource) {
      return this._renderForm();
    } else if (this.documentation) {
      return this._renderDoc();
    } else if (this.readonly !== true) {
      const resourceOpts = this.types.map((resource) => {
        return {
          id: resource.id,
          title: resource.name,
          description: resource.description,
          image: resource.icon,
          locked: resource.deployed === false,
        };
      });

      return html`
        <div class="resources-bottom-container">
          <gv-option
            class="resource__option"
            .options="${resourceOpts}"
            @gv-option:select="${this._onCreateResource}"
            @gv-option:display-resource-cta="${this._onDisplayResourceCTA}"
          ></gv-option>
        </div>
      `;
    } else if (this.readonly && this.resources.length > 0) {
      return html`<div class="resources-bottom-container empty">You can see the resource configuration by clicking on it</div>`;
    }
  }

  _onSearchResource({ detail }) {
    this._filter = detail;
  }

  _onClearResource() {
    this._filter = null;
  }

  render() {
    const options = {
      selectable: true,
      data: [
        { field: 'name', label: 'Name' },
        {
          field: 'type',
          width: '50px',
          type: 'gv-image',
          attributes: {
            src: (item) => {
              const resourceType = this._findResourceById(item.type);
              return resourceType ? resourceType.icon : null;
            },
            style: 'width:40px;height:40px;',
          },
        },
        { field: 'type', label: 'Type' },
        {
          field: 'enabled',
          type: 'gv-switch',
          title: (item) => (item.enabled ? 'Click to disable' : 'Click to enable'),
          width: '50px',
          attributes: {
            readonly: this.readonly,
            'ongv-switch:input': (item, event) => this._onChangeResourceState(item, event),
          },
        },
      ],
    };

    if (this.readonly !== true) {
      options.data.push({
        type: 'gv-button',
        width: '50px',
        attributes: {
          onClick: (item) => this._removeResource(item),
          title: 'remove',
          danger: true,
          outlined: true,
          icon: 'home:trash',
        },
      });
    }

    const filteredResources =
      this._filter != null
        ? this.resources.filter((resource) => {
            return (resource.name.toLowerCase() + resource.type.toLowerCase()).includes(this._filter);
          })
        : this.resources;

    return html`<div class="resources">
      <gv-resizable-views no-overflow>
        <div slot="top" class="box">
          <div class="container">
            <div class="header">
              <div class="title">Manage global resources <span>(${this.resources.length})</span></div>
              <gv-input
                id="search-resource"
                class="search-input"
                placeholder="Filter resources (Shift + Alt + Space)"
                type="search"
                small
                @gv-input:input="${this._onSearchResource}"
                @gv-input:clear="${this._onClearResource}"
              ></gv-input>
            </div>
            <div class="content">
              <div class="table-container">
                <gv-table
                  .options="${options}"
                  .items="${filteredResources}"
                  emptymessage="${this._emptymessage}"
                  @gv-table:select="${this._onSelectResource}"
                  order="name"
                  rowheight="50px"
                ></gv-table>
              </div>
            </div>
          </div>
        </div>
        <div slot="bottom">${this._renderBottom()}</div>
      </gv-resizable-views>
    </div>`;
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

        .resources {
          display: flex;
          height: 100%;
          width: 100%;
        }

        gv-resizable-views {
          height: 100%;
          width: 100%;
        }

        gv-table {
          --gv-table-rows--ov: none;
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

        .form-title {
          text-transform: uppercase;
          letter-spacing: 0.2rem;
        }

        .resources-bottom-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: calc(100% - var(--gv-policy-studio--pb, 0px));
        }

        .table-container {
          max-width: 1200px;
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .search-input {
          width: 300px;
        }

        .resource__option {
          --gv-option-button--maw: 175px;
        }
      `,
    ];
  }
}

window.customElements.define('gv-resources', GvResources);
