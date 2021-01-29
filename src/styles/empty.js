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
import { css } from 'lit-element';

// language=CSS
export const empty = css`
  .empty,
  .error {
    align-items: center;
    box-sizing: border-box;
    color: var(--gv-theme-font-color-dark);
    font-size: var(--gv-theme-font-size-l, 20px);
    font-weight: bold;
    height: 100%;
    opacity: 0.5;
    padding: 3rem;
    text-align: center;
    width: 100%;
    justify-content: center;
    display: flex;
    flex-direction: column;
  }
`;
