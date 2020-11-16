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
import { LitElement, html, css } from 'lit-element';
import { link } from '../styles/link';
import { dispatchCustomEvent } from '../lib/events';
import { classMap } from 'lit-html/directives/class-map';
import '../atoms/gv-image';
import '../atoms/gv-state';
import '../molecules/gv-popover';
import './gv-flow-step';
import { getFlowName, methods, uuid } from '../lib/studio';
import { repeat } from 'lit-html/directives/repeat';
import { appendDraggableImage } from '../lib/utils';

/**
 * Policy studio menu component
 */
export class GvPolicyStudioMenu extends LitElement {

  static get properties () {
    return {
      policies: { type: Array },
      apiName: { type: String, attribute: 'api-name' },
      flows: { type: Object },
      plans: { type: Object },
      selectedIds: { type: Array },
      sortable: { type: Boolean },
      query: { type: String },
    };
  }

  constructor () {
    super();
    this.selectedIds = [];
  }

  static get styles () {
    return [
      link,
      methods,
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          min-width: 250px;
          display: flex;
          flex-direction: column;
        }

        .box {
          flex: 1;
          overflow: auto;
        }

        .type {
          background-color: #F5F5F5;
          text-transform: capitalize;
          text-decoration: none;
          padding: 0.2rem;
          color: #262626;
          border-width: 1px 0 1px 0;
          border-style: solid;
          border-color: #BFBFBF;
          font-size: 15px;
          display: flex;
          align-items: center;
          box-sizing: border-box;
          height: 42px;
        }

        .type .type-name {
          flex: 1;
        }

        .type .type-name,
        .entry .entry-name {
          display: flex;
          align-items: center;
          white-space: nowrap;
          overflow: hidden;
          min-width: 150px;
          height: 100%;
        }

        .expandable {
          background: #fff;
          overflow: hidden;
          transition: height, opacity, width, padding, color .250s ease-in-out;
          line-height: 0;
          color: transparent;
          box-sizing: border-box;
          font-size: 14px;
          --gv-icon--s: 0;
          visibility: hidden;
        }

        .expandable.open {
          line-height: 1.5;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          color: #262626;
          overflow: auto;
          visibility: visible;
        }

        .entry {
          display: flex;
          align-items: center;
          user-select: none;
          position: relative;
        }

        .entry.disabled {
          text-decoration: line-through;
          font-style: italic;
        }

        .entry gv-image {
          height: 0px;
          width: 0px;
          transition: height 75ms ease-in-out;
          visibility: hidden;
        }

        .entry gv-tag {
          display: none;
        }

        .expandable-icon {
          margin-right: 2px;
          --gv-icon--s: 22px;
          --gv-icon--c: #5A7684;
          --gv-icon-opacity--c: #5A7684;
        }
        
        .policy-icon {
          --gv-icon--s: 40px;
          margin-right: 2px;
          --gv-icon--c: #5A7684;
          --gv-icon-opacity--c: #5A7684;
        }

        .expandable.open .entry gv-tag {
          display: block;
        }

        .expandable.open .entry gv-image {
          height: 40px;
          width: 40px;
          margin-right: 5px;
          visibility: visible;
        }

        .expandable.open .entry:focus-within {
          --gv-icon--c: #28444F;
          color: #28444F;
        }

        .expandable.open .entry:focus-within .actions {
          visibility: visible;
          opacity: 1;
          height: 25px;
        }

        .flow-path {
          max-width: 200px;
        }

        .entry .actions {
          background-color: white;
          transition: all 250ms ease-in-out;
          align-items: center;
          display: flex;
          position: absolute;
          right: 0;
          padding: 0.1rem;
        }

        gv-button {
          --gv-icon--c: #28444F;
        }

        .entry .actions > * {
          margin: 1px;
          opacity: 0;
          visibility: hidden;
          display: none;
        }

        .entry:focus-within .actions > * {
          opacity: 1;
          visibility: visible;
          display: block;
        }

        .flow-path {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .expandable.open .entry {
          border: 1px dotted transparent;
          padding: 0.2rem;
          line-height: 25px;
          min-height: 32px;
        }

        .expandable.open .entry {
          --gv-icon--s: 16px;
        }

        .expandable.open .entry.selected,
        .expandable.open .entry.selected .actions {
          background-color: #F5F5F5;
        }

        .expandable.open .entry.selected {
          border-top: 1px dotted #BFBFBF;
          border-bottom: 1px dotted #BFBFBF;
          border-right: 1px dotted #BFBFBF;
        }

        .dragging {
          cursor: grabbing;
          opacity: 1;
          background-color: #F5F5F5;
          box-shadow: 0 0 5px rgba(0, 0, 0, .1);
          transform: none;
        }

        .flow {
          margin-left: 0.2rem;
        }

        .flow.sortable {
          margin: 0;
        }

        .policy.draggable gv-icon,
        .policy.draggable gv-image,
        .sortable,
        .sortable gv-icon {
          cursor: grab;
        }

        .policy.draggable:active,
        .sortable:active,
        .sortable gv-icon:active {
          cursor: grabbing;
        }

        .policy-name {
          flex: 1;
          display: flex;
          align-items: center;
        }

        .policy .draggable-icon {
          opacity: 0;
          visibility: hidden;
          transition: all 350ms ease-in-out;
        }

        .policy:hover .draggable-icon {
          opacity: 1;
          visibility: visible;
        }

        gv-tag, gv-state {
          --gv-tag--p: 1px 3px;
          --gv-state--p: 4px 6px;
          --gv-state--fz: 10px;
          --gv-state--c: #28444F;
          --gv-state--bgc: #FFFFFF;
          margin: 0 1px;
        }

        .error-icon {
          --gv-icon--c: var(--gv-theme-color-warning, #ff9800);
        }
      `,
    ];
  }

  _onExpand (anchor, e) {
    e.preventDefault();
    e.stopPropagation();
    this.shadowRoot.querySelector(anchor).classList.toggle('open');
  }

  _onDragStartPolicy (policy, e) {
    e.dataTransfer.setData('text/plain', JSON.stringify({ policy }));
    if (policy.icon) {
      const size = 100;
      this._draggablePolicyImage = appendDraggableImage(policy.icon, size);
      e.dataTransfer.setDragImage(this._draggablePolicyImage, size / 2, size / 2);
    }
    dispatchCustomEvent(this, 'dragstart-policy', { dataTransfer: e.dataTransfer });
  }

  _onDragEndPolicy () {
    if (this._draggablePolicyImage) {
      this._draggablePolicyImage.remove();
      this._draggablePolicyImage = null;
    }
    dispatchCustomEvent(this, 'dragend-policy');
  }

  _onClickFlow (flow, e) {
    if (e.shiftKey) {
      this._compareFlow(flow);
    }
    else {
      this._selectFlow(flow);
    }
  }

  _selectFlow (flow) {
    this.selectedIds = [flow._id];
    dispatchCustomEvent(this, 'select-flows', { flows: this.selectedIds });
  }

  _compareFlow (flow) {
    if (this.selectedIds.length > 0) {
      this.selectedIds = [...new Set([this.selectedIds[0], flow._id])];
      dispatchCustomEvent(this, 'select-flows', { flows: this.selectedIds });
    }
    else {
      this._selectFlow(flow);
    }
  }

  _onMouseEnterPolicy (policy) {
    dispatchCustomEvent(this, 'target-policy', { policy });
  }

  _onMouseLeavePolicy () {
    dispatchCustomEvent(this, 'target-policy', null);
  }

  _onMouseEnterFlow (e) {
    if (this._draggingFlow == null) {
      e.target.focus();
    }
  }

  _onMouseLeaveFlow (e) {
    if (this._draggingFlow == null) {
      e.target.blur();
    }
  }

  _filter (content) {
    if (this.query) {
      return content.name.toLowerCase().includes(this.query.toLowerCase());
    }
    return true;
  }

  hasCompare () {
    return this.selectedIds.length > 1;
  }

  _onChangeFlowState (content, { detail }) {
    dispatchCustomEvent(this, 'change-flow-state', { content, enabled: detail });
  }

  _onDuplicateFlow (content) {
    dispatchCustomEvent(this, 'duplicate-flow', { content });
  }

  _onDeleteFlow (content) {
    dispatchCustomEvent(this, 'delete-flow', { content });
  }

  _renderFlowActions (content) {
    const enabled = content.enabled !== false;
    const stateLabel = enabled ? 'Disable flow ?' : 'Enable flow ?';
    return html`<div class="actions">
                  ${this.hasCompare() || this.selectedIds.includes(content._id) ? '' : html`<gv-button tabindex="0" link small icon="navigation:route" @gv-button:click="${this._compareFlow.bind(this, content)}" title="Compare"></gv-button>`}
                  <gv-button tabindex="0" link small icon="general:duplicate" @gv-button:click="${this._onDuplicateFlow.bind(this, content)}" title="Duplicate"></gv-button>
                  <gv-button tabindex="0" link small icon="home:trash" @gv-button:click="${this._onDeleteFlow.bind(this, content)}" title="Delete"></gv-button>
                  <gv-switch tabindex="0" small title="${stateLabel}" .value="${enabled}" @gv-switch:input="${this._onChangeFlowState.bind(this, content)}"></gv-switch>
                </div>`;
  }

  _onDragStartFlow (flow, index, event) {
    const classList = event.target.classList;
    if (classList && classList.contains('flow')) {
      classList.remove('hover');
      classList.add('dragging');
      this._draggingFlow = { target: event.target, flow, index };
    }
  }

  _onDragEnterFlow (event) {
    if (event.target.classList && event.target.classList.contains('flow')
      && this._draggingFlow.target.parentElement === event.target.parentElement) {

      if (event.target.previousSibling !== this._draggingFlow.target) {
        event.target.parentElement.insertBefore(this._draggingFlow.target, event.target);
      }
      else if (event.target.nextSibling) {
        event.target.parentElement.insertBefore(this._draggingFlow.target, event.target.nextSibling);
      }
      else {
        event.target.parentElement.appendChild(this._draggingFlow.target);
      }
      this._draggingFlow.target.classList.remove('dragging');
    }
  }

  _findFlowCollection (flowId) {
    const plan = this.plans.find((plan) => plan.flows.find((flow) => flow._id === flowId) != null);
    return { plan, flows: plan != null ? plan.flows : this.flows };
  }

  _onDragEndFlow () {
    this._draggingFlow.target.classList.remove('dragging');
    const index = [...this._draggingFlow.target.parentElement.querySelectorAll('.flow[draggable="true"]')].indexOf(this._draggingFlow.target);
    if (index !== this._draggingFlow.index) {
      const { plan, flows } = this._findFlowCollection(this._draggingFlow.flow._id);
      const flowToReorder = flows.splice(this._draggingFlow.index, 1)[0];
      flows.splice(index, 0, flowToReorder);
      const min = Math.min(this._draggingFlow.index, index);
      const max = Math.max(this._draggingFlow.index, index);
      flows.forEach((flow, i) => {
        if (i >= min && i <= max) {
          flow._dirty = true;
        }
      });

      dispatchCustomEvent(this, 'reorder-flows', { plan });
      setTimeout(() => {
        this._draggingFlow = null;
      }, 0);
      this._draggingFlow.target.focus();
    }
  }

  _onDragOverFlow (e) {
    e.preventDefault();
  }

  _onKeyDownFlow (index, e) {
    if (e.target.classList.contains('flow') && e.keyCode === 32) {
      e.preventDefault();
      this._selectFlow(index);
    }
  }

  _onClickPolicy (policy) {
    this.selectedIds = [policy.id];
    dispatchCustomEvent(this, 'fetch-documentation', { policy });
  }

  _isSelected (id) {
    return this.selectedIds != null && this.selectedIds.includes(id);
  }

  _renderFlows (filteredData, type, isChild, id, open) {
    return html`<div class="${classMap({ content: true, expandable: true, open })}" id="${id}">
      ${repeat(filteredData, () => uuid(), (content, index) => html`
        <div
          draggable="${this.sortable}" 
          tabindex="0"
          @dragstart="${this._onDragStartFlow.bind(this, content, index)}"
          @dragenter="${this._onDragEnterFlow}"
          @dragend="${this._onDragEndFlow}"
          @dragover="${this._onDragOverFlow}"
          @keydown="${this._onKeyDownFlow.bind(this, index)}"
          @mouseenter="${this._onMouseEnterFlow}"
          @mouseleave="${this._onMouseLeaveFlow}"
          class="${classMap({
      entry: true,
      flow: true,
      sortable: this.sortable,
      selected: this.selectedIds.includes(content._id),
      child: isChild,
      disabled: content.enabled === false,
    })}">
          <div title="${content.name} | Compare with current selection (Shift + click)"
               @click="${this._onClickFlow.bind(this, content)}" 
               class="entry-name link">
                 ${getFlowName(content, null, true, this.sortable, true)}
                </div>
          ${this._renderFlowActions(content)}
      `)}
        `;
  }

  _isDraggable (policy) {
    return policy.onRequest === true || policy.onResponse === true;
  }

  _renderPolicies (filteredData, type, isChild, id, group) {
    return html`<div id="${id}" class="${classMap({
      content: true,
      expandable: true,
      open: true,
      child: isChild,
    })}">${filteredData.map((content) => {
      const draggable = this._isDraggable(content);
      return html`<div class="${classMap({
        entry: true,
        link: true,
        policy: true,
        selected: this._isSelected(content.id),
        draggable,
      })}" 
      draggable="${draggable}" 
      @mouseenter="${this._onMouseEnterPolicy.bind(this, content)}"
      @mouseleave="${this._onMouseLeavePolicy.bind(this, content)}"
      @dragstart="${this._onDragStartPolicy.bind(this, content)}" 
      @dragend="${this._onDragEndPolicy}"  
      @click="${this._onClickPolicy.bind(this, content)}"
      title="Show documentation of ${content.name}">
        ${content.icon == null && group != null ? html`<gv-icon class="policy-icon" shape="${this._getGroupShape(group)}"></gv-icon>` : html`<gv-image src="${content.icon}"></gv-image>`}
        <div class="policy-name">${content.name}</div>
        ${draggable ? html`<gv-icon class="draggable-icon" shape="design:arrows"></gv-icon>`
        : html`<gv-icon class="error-icon" title="Plugin not loaded successfully" shape="appliances:highvoltage"></gv-icon>`}
           </div>`;
    })}`;
  }

  _getGroupShape (groupName) {
    if (groupName === 'security') {
      return 'general:shield-protected';
    }
    else if (groupName === 'transformation') {
      return 'tools:roller';
    }
    else if (groupName === 'performance') {
      return 'general:thunder-move';
    }
    else {
      return 'communication:shield-thunder';
    }
  }

  _renderPart (type, title, icon, data = [], hideIfEmpty, addHandler, groupKey = null, isOpen = true, isChild = false, listId) {
    let list;
    const filteredData = data.filter((content) => this._filter(content));
    if ((hideIfEmpty && data.length > 0) || !hideIfEmpty) {
      if (groupKey && !isChild) {
        const groups = [...new Set(filteredData.map((content) => content[groupKey]))];

        return html`${groups.map((group, index) => {
          let groupData = filteredData.filter((data) => data[groupKey] === group);
          const listId = group ? group.replace(/\s+/g, '-').toLowerCase() : `group-${index}`;
          const anchor = `#${listId}`;
          let right = html`<gv-state>${groupData.length}</gv-state>`;
          if (addHandler) {
            right = html`<gv-button small link icon="code:plus" @click="${addHandler.bind(this, index, listId)}"></gv-button>`;
          }
          if (type === 'flows') {
            groupData = groupData[0].flows;
          }
          return html`<div class="type" @click="${this._onExpand.bind(this, anchor)}">
                    <gv-icon class="expandable-icon" shape="${this._getGroupShape(group)}"></gv-icon>
                    <div class="link type-name">${group || 'No category'}</div>${right}</div>
                    ${this._renderPart(type, group, icon, groupData, hideIfEmpty, addHandler, groupKey, isOpen, true, listId)}`;
        })}`;
      }
      else {
        if (listId == null) {
          listId = type.replace(/\s+/g, '-').toLowerCase();
        }
        if (type === 'flows') {
          list = this._renderFlows(filteredData, type, isChild, listId, isOpen);
        }
        else {
          list = this._renderPolicies(filteredData, type, isChild, listId, title);
        }
      }

      if (isChild) {
        return html`${list}`;
      }
      else {
        const anchor = `#${listId}`;
        let action = '';
        if (addHandler) {
          action = html`<gv-button small link icon="code:plus" @click="${addHandler.bind(this, listId)}"></gv-button>`;
        }
        return html`<div class="type" draggable="false">
                      ${icon ? html`<gv-icon class="expandable-icon" shape="${icon}"></gv-icon>` : ''}
                      <div class="type-name link" @click="${this._onExpand.bind(this, anchor)}">${title}</div>${action}</div>${list}`;
      }
    }
    return html``;
  }

  _getListElement (id) {
    return this.shadowRoot.querySelector(`#${id}`);
  }

  _onAddFlowToPlan (index, listId, e) {
    const list = this._getListElement(listId);
    list.classList.add('open');
    e.preventDefault();
    e.stopPropagation();
    dispatchCustomEvent(this, 'add-flow-plan', { planIndex: index });
  }

  _onAddFlow (listId, e) {
    const list = this._getListElement(listId);
    list.classList.add('open');
    e.preventDefault();
    e.stopPropagation();
    dispatchCustomEvent(this, 'add-flow');
  }

  render () {
    const flowsTitle = this.apiName != null ? `${this.apiName} flows` : 'API flows';

    return html`
          <slot name="header"></slot>
          <div class="box">
           ${this.plans != null ? this._renderPart('flows', '', 'shopping:sale#2', this.plans, false, this._onAddFlowToPlan, 'name') : ``}
           ${this.flows != null ? this._renderPart('flows', flowsTitle, 'shopping:box#3', this.flows, false, this._onAddFlow) : ``}
           ${this.policies != null ? this._renderPart('policies', 'Policies', null, this.policies, true, null, this.policies.length > 0 && this.policies[0].category != null ? 'category' : null) : ''}
          </div>
          <slot name="footer"></slot>`;
  }

}

window.customElements.define('gv-policy-studio-menu', GvPolicyStudioMenu);
