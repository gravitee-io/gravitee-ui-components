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
import { css } from 'lit';

// language=CSS
export const skeleton = css`
  @keyframes skeleton-pulse {
    from {
      opacity: 0.85;
    }
    to {
      opacity: 0.45;
    }
  }
  .skeleton,
  :host([skeleton]) {
    animation-direction: alternate;
    animation-duration: 500ms;
    animation-iteration-count: infinite;
    animation-name: skeleton-pulse;
    color: transparent;
    cursor: progress !important;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-color: var(--gv-theme-skeleton-color, #bfbfbf) !important;
    border-color: var(--gv-theme-skeleton-color, #bfbfbf);
  }

  .skeleton svg,
  :host([skeleton]) svg,
  :host([skeleton]) gv-icon,
  .skeleton gv-icon,
  .skeleton > *,
  .skeleton ::slotted(*),
  :host([skeleton]) ::slotted(*) {
    visibility: hidden;
  }
`;
