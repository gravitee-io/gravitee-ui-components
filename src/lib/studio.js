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
import { html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import '../atoms/gv-icon';
import '../atoms/gv-tag';

// language=CSS
export const methods = css`
  gv-tag {
    font-family: monospace;
  }

  gv-tag.ALL {
    --gv-tag--bdc: #262626;
    --gv-tag--bgc: #262626;
    --gv-tag--c: white;
  }

  gv-tag.POST {
    --gv-tag--bdc: #fb8c00;
    --gv-tag--bgc: #fb8c00;
    --gv-tag--c: white;
  }

  gv-tag.PUT {
    --gv-tag--bdc: #039be5;
    --gv-tag--bgc: #039be5;
    --gv-tag--c: white;
  }

  gv-tag.GET {
    --gv-tag--bdc: #43a047;
    --gv-tag--bgc: #43a047;
    --gv-tag--c: white;
  }

  gv-tag.DELETE {
    --gv-tag--bdc: #e53935;
    --gv-tag--bgc: #e53935;
    --gv-tag--c: white;
  }

  .flow-path,
  .plan-name {
    margin-left: 0.2rem;
    display: flex;
    align-items: center;
  }

  .collection-name {
    margin-right: 0.5rem;
    --gv-icon--s: 26px;
    --gv-icon--c: #5a7684;
    --gv-icon-opacity--c: #5a7684;
  }

  .icon-type {
    --gv-icon--s: 26px;
    --gv-icon--c: #383e3f;
    --gv-icon-opacity--c: #5a7684;
  }

  .content-icon-conditional {
    --gv-icon--c: transparent;
    --gv-icon--s: 24px;
  }
`;

export function getFlowTitle(flow, collectionName, withMethods = true, draggable = false, compact = true) {
  let rendering = [];
  if (flow) {
    if (draggable) {
      rendering.push(html`<gv-icon title="Drag for reorder" class="draggable-icon" shape="general:sort"></gv-icon>`);
    }
    if (flow.condition) {
      rendering.push(html`<gv-icon title="Conditional flow" class="content-icon-conditional" shape="code:if"></gv-icon>`);
    }
    const methods = flow.methods || [];
    if (flow.type != null) {
      const shape = flow.icon;
      if (shape != null) {
        rendering = [...rendering, html`<gv-icon title="${flow.type}" shape="${shape}" class="icon-type"></gv-icon>`];
      }
    } else if (withMethods) {
      const renderingMethods = methods.map((method) => html`<gv-tag class="${method.toUpperCase()}">${method.toUpperCase()}</gv-tag>`);
      if (compact && (renderingMethods.length === 9 || renderingMethods.length === 0)) {
        rendering = [...rendering, html`<gv-tag major title="${methods.join('\n')}">ALL</gv-tag>`];
      } else if (compact && renderingMethods.length >= 3) {
        const renderingMethodsCompact = renderingMethods.slice(0, 2);
        renderingMethodsCompact.push(html`<gv-tag minor title="${methods.join('\n')}">+${renderingMethods.length - 2}</gv-tag>`);
        rendering = [...rendering, ...renderingMethodsCompact];
      } else {
        rendering = [...rendering, ...renderingMethods];
      }
    }

    const classes = {
      'flow-path': true,
      disabled: flow.disabled,
    };

    if (flow.name != null && flow.name.trim() !== '') {
      if (flow._dirty) {
        rendering.push(html`<div class="${classMap(classes)}"><mark>${flow.name}</mark></div>`);
      } else {
        rendering.push(html`<div class="${classMap(classes)}">${flow.name}</div>`);
      }
    } else if (flow['path-operator']) {
      let pathWithOperator = '/';
      if (flow['path-operator'].path && flow['path-operator'].path.length > 1) {
        flow['path-operator'].path.split('/').forEach((pathPart) => {
          if (pathPart !== '') {
            pathWithOperator += `${pathPart}/`;
          }
        });
        pathWithOperator = pathWithOperator.substring(0, pathWithOperator.length - 1);
      }
      if (flow['path-operator'].operator === 'STARTS_WITH') {
        pathWithOperator += '**';
      }

      if (flow._dirty) {
        rendering.push(html`<div class="${classMap(classes)}"><mark>${pathWithOperator}</mark></div>`);
      } else {
        rendering.push(html`<div class="${classMap(classes)}">${pathWithOperator}</div>`);
      }
    }

    if (collectionName) {
      rendering.push(html`<div class="collection-name">${collectionName}</div>`);
    }
  }
  return rendering;
}
