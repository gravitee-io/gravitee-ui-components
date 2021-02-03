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
import { classMap } from 'lit-html/directives/class-map';
import { dispatchCustomEvent } from '../lib/events';
import '../atoms/gv-image';
import { appendDraggableImage, uuid } from '../lib/utils';
import { PolicyDraggable } from './gv-flow-step';
import { getFlowName, methods } from '../lib/studio';

/**
 * Flow component
 *
 * @fires gv-flow:drop - Drop event
 * @fires gv-flow:edit - Edit event
 * @fires gv-flow:delete - Delete event
 *
 * @attr {Object} flow - the flow to display
 * @attr {String} selectedStepId - the selected step id
 * @attr {Object} targetedPolicy - true, if flow is targeted for drop action
 * @attr {Boolean} has-policy-filter - true if policies have onRequest/onResponse properties
 * @attr {String} flowsTitle - flows menu title
 * @attr {Boolean} disabled - true for disabled
 * @attr {Boolean} readonly - true if readonly
 */
export class GvFlow extends LitElement {
  static get properties() {
    return {
      flow: { type: Object },
      plan: { type: Object },
      policies: { type: Object },
      selectedStepId: { type: String },
      dragPolicy: { type: Object },
      dropPolicy: { type: Object },
      disabled: { type: Boolean, reflect: true },
      hasPolicyFilter: { type: Boolean, attribute: 'has-policy-filter' },
      flowsTitle: { type: String, attribute: 'flows-title' },
      readonly: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.flowsTitle = 'Flows';
    this.addEventListener('mouseleave', this._onMouseLeave);
  }

  _onMouseLeave() {
    this.dragPolicy = null;
    this.dropPolicy = null;
  }

  getCandidate() {
    return this.shadowRoot.querySelector('gv-flow-step[empty]');
  }

  getFlowSteps() {
    return Array.from(this.shadowRoot.querySelectorAll('gv-flow-step'));
  }

  getOrCreateCandidate() {
    let candidate = this.getCandidate();
    if (!candidate) {
      candidate = document.createElement('gv-flow-step');
      candidate.setAttribute('empty', true);
    }
    return candidate;
  }

  removeCandidate() {
    const candidate = this.getCandidate();
    if (candidate) {
      candidate.remove();
    }
  }

  _canDropPolicy(flowKey, policy) {
    if (this.disabled || this.readonly) {
      return false;
    }
    if (policy != null) {
      if (flowKey === 'pre') {
        return this.hasPolicyFilter !== true || policy.onRequest === true;
      } else if (flowKey === 'post') {
        return this.hasPolicyFilter !== true || policy.onResponse === true;
      } else {
        throw new Error(`The flowkey [${flowKey}] parameter must be "pre" or "post"`);
      }
    }
    return false;
  }

  _onDragOver(flowKey, e) {
    if (!this.disabled && !this.readonly) {
      if (e.dataTransfer.items.length > 0) {
        e.preventDefault();
        e.stopPropagation();
        if (this.dropPolicy == null) {
          this.dropPolicy = this.dragPolicy;
        } else {
          this.dragPolicy = this.dropPolicy;
        }

        if (
          this.dropPolicy != null &&
          this._canDropPolicy(flowKey, this.dropPolicy.policy) &&
          !e.target.classList.contains('candidate') &&
          !e.target.hasAttribute('dragging')
        ) {
          if (e.target.tagName.toLowerCase() === 'gv-flow-step') {
            const { x, width } = e.target.getBoundingClientRect();
            const condition = flowKey === 'post' ? e.clientX - x <= width / 2 : e.clientX - x >= width / 2;
            if (condition && !(e.target.nextElementSibling && e.target.nextElementSibling.hasAttribute('dragging'))) {
              e.target.insertAdjacentElement('afterend', this.getOrCreateCandidate());
            } else if (!(e.target.previousElementSibling && e.target.previousElementSibling.hasAttribute('dragging'))) {
              e.target.insertAdjacentElement('beforebegin', this.getOrCreateCandidate());
            }
          } else if (e.target.classList && e.target.classList.contains('drop-area-grid')) {
            const dropAreas = e.target.querySelectorAll('gv-flow-step');
            if (dropAreas.length === 0) {
              e.target.prepend(this.getOrCreateCandidate());
            }
          } else {
            this.removeCandidate();
          }
        }
      }
    }
  }

  _onDragEnd() {
    if (!this.disabled && !this.readonly) {
      if (this._draggablePolicyImage) {
        this._draggablePolicyImage.remove();
        this._draggablePolicyImage = null;
      }
      this.dragPolicy = null;
      this.dropPolicy = null;
    }
  }

  _onDragStart(sourceFlowKey, flowStep, sourcePosition, e) {
    if (!this.disabled && !this.readonly) {
      const policy = this.findPolicy(flowStep.policy);
      if (policy != null) {
        // Simulate click on window for close all dropdown menu
        const windowClick = document.createEvent('Events');
        windowClick.initEvent('click', true, false);
        window.dispatchEvent(windowClick);
        e.target.setAttribute('dragging', true);
        this.shadowRoot.querySelector('.drop-area-grid').classList.add('dragging');

        this.dropPolicy = new PolicyDraggable(policy, sourcePosition, sourceFlowKey, this.flow._id, flowStep);
        e.dataTransfer.setData('text/plain', this.dropPolicy.toString());
        if (policy) {
          const size = 100;
          this._draggablePolicyImage = appendDraggableImage(policy.icon, size);
          e.dataTransfer.setDragImage(this._draggablePolicyImage, size / 2, size / 2);
        }
        dispatchCustomEvent(this, 'drag-start', this.dropPolicy);
      }
    }
  }

  async performUpdate() {
    this.getFlowSteps().forEach((s) => {
      s.requestUpdate();
    });
    super.performUpdate();
  }

  get draggingArea() {
    return this.shadowRoot.querySelector('gv-flow-step[dragging]');
  }

  _onDrop(flowKey, e) {
    this.shadowRoot.querySelectorAll('gv-flow-step').forEach((step) => step.resetConfirm());
    e.preventDefault();
    e.stopPropagation();
    const box = e.target.closest('.drop-area-grid');
    const candidate = this.getCandidate();
    const draggingArea = this.draggingArea;
    if (candidate) {
      let position = 0;
      [...box.querySelectorAll('gv-flow-step')].some((area) => {
        if (!area.hasAttribute('empty')) {
          position++;
        }
        return area.hasAttribute('empty');
      });
      const { policy, sourceFlowKey, sourceFlowId, sourcePosition, flowStep } = this.dropPolicy;
      const move = () => {
        if (draggingArea) {
          draggingArea.removeAttribute('dragging');
        }
        candidate.remove();
        dispatchCustomEvent(this, 'drop', {
          flowId: this.flow._id,
          flowKey,
          position,
          flowStep,
          policy,
          sourcePosition,
          sourceFlowKey,
          sourceFlowId,
        });
        this.dragPolicy = null;
        this.dropPolicy = null;
      };

      if (sourceFlowId != null && this.flow._id !== sourceFlowId) {
        candidate.setAttribute('confirm', true);
        candidate.addEventListener('gv-flow-step:copy', () => {
          candidate.remove();
          this.dragPolicy = null;
          this.dropPolicy = null;
          dispatchCustomEvent(this, 'drop', {
            flowId: this.flow._id,
            flowKey,
            position,
            policy,
            flowStep,
            cancelEdit: true,
          });
        });

        candidate.addEventListener('gv-flow-step:move', () => {
          candidate.remove();
          move();
        });
      } else {
        move();
      }
    } else if (draggingArea) {
      draggingArea.removeAttribute('dragging');
      this.dragPolicy = null;
      this.dropPolicy = null;
    }
  }

  getFlowStep(flowKey, position) {
    return this.flow[flowKey][position];
  }

  _onEditStep({ detail: { step, policy, group } }) {
    dispatchCustomEvent(this, 'edit', { flow: this.flow, step, policy, group });
  }

  _onDuplicateStep(flowKey, position) {
    const step = this.getFlowStep(flowKey, position);
    const duplicatePosition = position + 1;
    const policy = this.findPolicy(step.policy);
    const duplicateStep = { ...step, _id: uuid() };
    dispatchCustomEvent(this, 'drop', {
      flowId: this.flow._id,
      flowKey,
      position: duplicatePosition,
      flowStep: duplicateStep,
      policy,
    });
  }

  _isEditable(step) {
    return this.selectedStepId && this.selectedStepId === step._id;
  }

  _onDeleteStep(flowKey, position, e) {
    dispatchCustomEvent(this, 'delete', { flowKey, position, flowId: this.flow._id, target: e.target });
  }

  _onChangeStepState(flowKey, position, { detail }) {
    dispatchCustomEvent(this, 'change-state', { flowKey, position, flowId: this.flow._id, ...detail });
  }

  _renderDropStep(group, step, position) {
    if (step) {
      return html`<gv-flow-step
        .step="${step}"
        .policy="${this.findPolicy(step.policy)}"
        .id="${step._id}"
        .group="${group}"
        .parent="${this.flow._id}"
        ?disabled="${this.disabled}"
        ?readonly="${this.readonly}"
        .draggable="${!this.disabled && !this.readonly}"
        ?editing="${this._isEditable(step)}"
        @dragstart="${this._onDragStart.bind(this, group, step, position)}"
        @dragend="${this._onDragEnd}"
        @gv-flow-step:edit="${this._onEditStep}"
        @gv-flow-step:change-state="${this._onChangeStepState.bind(this, group, position)}"
        @gv-flow-step:delete="${this._onDeleteStep.bind(this, group, position)}"
        @gv-flow-step:duplicate="${this._onDuplicateStep.bind(this, group, position)}"
      ></gv-flow-step>`;
    } else {
      return html``;
    }
  }

  async _getUpdateComplete() {
    await super._getUpdateComplete();
    await Promise.all(this.getFlowSteps().map((e) => e.updateComplete));
  }

  updated(properties) {
    if (properties.has('data')) {
      this.onDragEnd();
    }
    if (properties.has('dropPolicy') || properties.has('dragPolicy')) {
      if (this.dropPolicy == null && this.dragPolicy == null) {
        this.removeCandidate();
      }
    }
  }

  onDragEnd() {
    setTimeout(() => {
      this.shadowRoot.querySelector('.drop-area-grid').classList.remove('dragging');
      this.removeCandidate();
      const draggingArea = this.draggingArea;
      if (draggingArea) {
        draggingArea.removeAttribute('dragging');
      }
    }, 0);
  }

  _getLabel(flowKey) {
    if (this.flow.type) {
      return html`
        <div class="drop-box-type">${flowKey}</div>
        <div>${this.flow.type.toUpperCase() === 'ROOT' ? 'flow' : this.flow.type}</div>
      `;
    } else if (flowKey === 'pre') {
      return 'request';
    } else if (flowKey === 'post') {
      return 'response';
    }
    return '';
  }

  get collectionName() {
    return this.plan != null ? this.plan.name : this.flowsTitle;
  }

  render() {
    const preTarget = this.dragPolicy && (this.hasPolicyFilter !== true || this.dragPolicy.policy.onRequest);
    const postTarget = this.dragPolicy && (this.hasPolicyFilter !== true || this.dragPolicy.policy.onResponse);

    const preForbidden = this.dragPolicy && this.hasPolicyFilter === true && !this.dragPolicy.policy.onRequest;
    const postForbidden = this.dragPolicy && this.hasPolicyFilter === true && !this.dragPolicy.policy.onResponse;
    const hasPost = this.flow.type == null || (this.flow.type && this.flow.type.toLowerCase() !== 'root');
    return html`<div class="box">
      <div class="container">
        <div class="header">
          <div class="title">${getFlowName(this.flow, this.collectionName)}</div>
        </div>
        <div class="content">
          <div class="flow">
            <div class="${classMap({ pre: true, targeted: preTarget, forbidden: preForbidden })}">
              <div class="arrow arrow-right"></div>
              <div
                class="drop-box"
                @drop="${this._onDrop.bind(this, 'pre')}"
                @dragend="${this.onDragEnd}"
                @dragover="${this._onDragOver.bind(this, 'pre')}"
              >
                <div class="drop-box-title">${preTarget ? 'drop here' : this._getLabel('pre')}</div>
                <div class="drop-area-grid">${this.flow.pre.map((flowStep, i) => this._renderDropStep('pre', flowStep, i))}</div>
              </div>
            </div>

            ${hasPost
              ? html`
                        <div class="${classMap({ post: true, targeted: postTarget, forbidden: postForbidden })}">
                          <div class='arrow arrow-left'> </div>
                            <div class="drop-box" 
                                 @drop="${this._onDrop.bind(this, 'post')}"
                                 @dragend="${this.onDragEnd}"
                                 @dragover="${this._onDragOver.bind(this, 'post')}">
                                 <div class="drop-area-grid drop-area-grid-reverse">
                                    ${this.flow.post.map((flowStep, i) => this._renderDropStep('post', flowStep, i))}
                                 </div>
                                 <div class="drop-box-title">${postTarget ? 'drop here' : this._getLabel('post')}</div>
                             </div>
                          </div>
                        </div>`
              : ''}
          </div>
        </div>
      </div>
    </div>`;
  }

  findPolicy(policyId) {
    const policy = this.policies.find((p) => p.id === policyId);
    if (policy == null) {
      // throw new Error(`Policy ${policyId} not found`);
    }
    return policy;
  }

  static get styles() {
    return [
      methods,
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          position: relative;
          display: block;
          height: 100%;
        }

        .flow {
          padding-left: 20px;
          display: flex;
          height: 100%;
          flex-direction: column;
        }

        .drop-area-grid {
          flex: 1;
          border: 1px dashed transparent;
          transition: all 350ms ease-in-out;
          position: relative;
          display: flex;
          flex-wrap: wrap;
          max-width: calc(100% - 40px);
          align-items: center;
          min-height: 150px;
          box-sizing: border-box;
          padding: 0 30px;
        }

        .targeted .drop-area-grid {
          border: 1px dashed #d9d9d9;
        }

        .forbidden .drop-area-grid {
          background-color: #efefef;
          opacity: 0.2;
        }

        gv-flow-step {
          flex: 1;
        }

        .message {
          text-transform: uppercase;
          color: #d9d9d9;
          opacity: 0;
          transition: opacity 350ms ease-in-out;
          font-size: 18px;
          text-align: center;
          align-self: center;
        }

        .message {
          width: 100%;
        }

        .targeted .message {
          opacity: 1;
        }

        .targeted .drop-area-empty {
          opacity: 0;
          transition: all 350ms ease-in-out;
        }

        .pre,
        .post {
          position: relative;
          flex: 1;
          display: flex;
        }

        .arrow {
          background-color: #d9d9d9;
          width: calc(100% - 50px * 2 - 1px);
          text-align: center;
          position: absolute;
          margin: 0 30px;
          color: #262626;
          top: calc(50% - 20px);
          height: 40px;
        }

        .arrow-right::after {
          width: 0;
          height: 0;
          border-top: 40px solid transparent;
          border-bottom: 40px solid transparent;
          border-left: 40px solid #d9d9d9;
          content: ' ';
          position: absolute;
          right: -20px;
          top: -20px;
        }

        .drop-box-type {
          position: relative;
          writing-mode: horizontal-tb;
          margin-bottom: 10px;
        }

        .drop-box-title {
          position: relative;
          writing-mode: vertical-lr;
          text-orientation: upright;
          text-transform: uppercase;
          color: #bfbfbf;
          font-size: 13px;
          font-weight: 500;
          text-align: center;
          max-height: 145px;
          line-height: 13px;
          display: flex;
          align-items: center;
          min-width: 30px;
        }

        .pre .drop-box-title {
          position: absolute;
          left: -30px;
        }

        .arrow-left::after {
          width: 0;
          height: 0;
          border-top: 40px solid transparent;
          border-bottom: 40px solid transparent;
          border-right: 40px solid #d9d9d9;
          content: ' ';
          position: absolute;
          left: -20px;
          top: -20px;
        }

        .drop-box {
          display: flex;
          border: 1px solid transparent;
          margin: 0 30px;
          align-items: center;
          position: relative;
          width: 100%;
        }

        .drop-area-grid-reverse {
          flex-direction: row-reverse;
        }

        .header {
          border-bottom: 1px solid #d9d9d9;
          display: flex;
          min-height: 45px;
          margin-bottom: 0.5rem;
        }

        .header .title {
          color: #28444f;
          font-size: 18px;
          display: flex;
          align-items: center;
          margin: 0 0.5rem;
          width: 100%;
        }

        .header .title .flow-path {
          flex: 1;
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
        }
      `,
    ];
  }
}

window.customElements.define('gv-flow', GvFlow);
