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
    --bdw: var(--gv-input--bdw, 1px);
    --2xbdw: calc(var(--gv-input--bdw, 1px) * 2);
    --input-small--p: 4px 4px;
    --input-small--fz: 12px;
    --input-small--lh: 15px;
    --icon-small--w: calc(15px + 4px + 4px);
    --input-small--h: calc(var(--icon-small--w) + var(--2xbdw));

    --input-medium--p: 10px 5px;
    --input-medium--fz: 14px;
    --input-medium--lh: 17px;
    --icon-medium--w: calc(17px + 10px + 10px);
    --input-medium--h: calc(var(--icon-medium--w) + var(--2xbdw));
      
    --input-large--p: 12px 8px;
    --input-large--fz: 16px;
    --input-large--lh: 18px;
    --icon-large--w: calc(18px + 12px + 12px);
    --input-large--h: calc(var(--icon-large--w) + var(--2xbdw));
  }
  
  .box-icon {
      box-sizing: border-box;
      height: var(--input-medium--h);
      width: calc(var(--input-medium--h) - 4px);
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      bottom: 0px;
      right: 0px;
      left: initial;
      border-radius: 0 3px 3px 0;
  }
  
  .box-icon-left {
      right: initial;
      left: 0px;
      border-radius: 3px 0 0 3px;
  }

  .box-icon gv-icon {
      width: 22px;
  }

  .box-icon.box-icon-clear gv-icon, :host([large]) .box-icon.box-icon-clear gv-icon {
      width: 16px;
      --gv-icon--c: var(--gv-theme-neutral-color-darker, #BFBFBF);
  }

  .box-icon.box-icon-bgc {
      background-color: var(--gv-input-icon--bgc, var(--gv-theme-neutral-color, #F5F5F5));
      border: var(--gv-input--bdw, 1px) var(--gv-input--bds, solid) var(--gv-input--bdc, var(--gv-theme-neutral-color-dark, #D9D9D9));
  }

  :host([large]) .box-icon {
      height: var(--input-large--h);
      width: var(--input-large--h);
  }
  
  :host([large]) .box-icon gv-icon {
      width: 24px;
  }

  :host([small]) .box-icon {
      height: var(--input-small--h);
      width: var(--input-small--h);
  }

  :host([small]) .box-icon gv-icon {
      width: 18px;
  }

  :host([small]) .box-icon-clear gv-icon {
      width: 14px;
  }
  
  div {
    position: relative;
    line-height: 0;
  }

  /* BASE */
  input {
    border: var(--gv-input--bdw, 1px) var(--gv-input--bds, solid) var(--gv-input--bdc, var(--gv-theme-neutral-color-dark, #D9D9D9));
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
    padding-right: 45px;
  }

  input.large.clearable {
      padding-right: 50px;
  }

  input.medium.icon {
    padding-right: 36px;
  }
  
  input.medium.clearable {
      padding-right: 32px;
  }

  input.small.icon {
    padding-right: 26px;
  }

  input.small.clearable {
      padding-right: 22px;
  }

  input.large.icon-left {
    padding-left: 45px;
  }

  input.large.clearable {
      padding-right: 40px;
  }

  input.medium.icon-left {
    padding-left: 36px;
  }

  input.small.icon-left {
    padding-left: 26px;
  }

  ::-webkit-search-cancel-button {
      -webkit-appearance: none;
  }

  /* STATES */
  :host([disabled]) .box-icon-bgc {
      background-color: transparent;
      --gv-icon--c: var(--gv-theme-neutral-color-darker, #D9D9D9);
  }
  
  :host([disabled]) input {
    cursor: default;
    opacity: 0.5;
  }
  

  input:required {
    box-shadow: none;
  }

  label {
    display: block;
    line-height: 15px;
    padding: 0 0 0.2rem 0;
  }
`;
