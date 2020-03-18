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
export const input = css`
  :host {
    box-sizing: border-box;
    display: inline-block;
    margin: 0.2rem;
    vertical-align: middle;
    background-color: transparent;
    --input-small--p: 4px 4px;
    --input-small--fz: 12px;
    --input-small--lh: 15px;
    --input-small--h: calc(15px + 4px + 4px + 2px);

    --input-medium--p: 10px 5px;
    --input-medium--fz: 14px;
    --input-medium--lh: 17px;
    --input-medium--h: calc(17px + 10px + 10px + 2px);
      
    --input-large--p: 12px 8px;
    --input-large--fz: 16px;
    --input-large--lh: 18px;
    --input-large--h: calc(18px + 12px + 12px + 2px);
  }

  div {
    position: relative;
    line-height: 0;
  }

  /* BASE */
  input {
    border: 1px solid var(--gv-input--bdc, var(--gv-theme-neutral-color-dark, #D9D9D9));
    box-sizing: border-box;
    border-radius: 4px;
    font-style: normal;
    font-weight: normal;
    outline: none;
    width: 100%;
    height: 100%;
    -webkit-appearance: none;
  }

  input::-webkit-search-decoration {
      -webkit-appearance: none;
  }
  
  /* SIZE */
  input.large {
    padding: var(--input-large--p);
    font-size: var(--input-large--fz);
    line-height: var(--input-large--lh);
    height: var(--input-large--h);
  }

  input.medium {
    padding: var(--input-medium--p);
    font-size: var(--input-medium--fz);
    line-height: var(--input-medium--lh);
    height: var(--input-medium--h);
  }

  input.small {
    padding: var(--input-small--p);
    font-size: var(--input-small--fz);
    line-height: var(--input-small--lh);
    height: var(--input-small--h);
  }

  input.large.icon {
    padding-right: 58px;
  }

  input.medium.icon {
    padding-right: 40px;
  }

  input.small.icon {
    padding-right: 30px;
  }

  input.large.icon-left {
    padding-left: 58px;
  }

  input.medium.icon-left {
    padding-left: 40px;
  }

  input.small.icon-left {
    padding-left: 30px;
  }

  /* STATES */
  input:disabled {
    cursor: default;
    opacity: .5;
  }

  input:required {
    box-shadow: none;
  }

  label {
    display: block;
    line-height: 15px;
    padding: 0.2rem 0.4rem;
  }

  label.required {
    padding-left: 0.6rem;
  }

  label abbr {
    position: absolute;
    left: 0;
    color: red;
    font-variant: none;
    text-decoration: none;
  }
`;
