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
export const link = css`
  .link,
  .link:visited {
    cursor: pointer;
    opacity: 1;
    transition: opacity 0.15s ease-in;
    text-decoration: none;
  }

  .link:hover {
    opacity: 0.7;
    transition: opacity 0.15s ease-in;
  }
`;
