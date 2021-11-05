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

  .small .box-icon {
    height: var(--input-small--h);
    width: calc(var(--input-small--h) - 4px);
  }

  .box-icon-left {
    right: initial;
    left: 0px;
    border-radius: 3px 0 0 3px;
  }

  .box-icon gv-icon {
    --gv-icon--s: 22px;
    --gv-icon--c: var(--gv-theme-font-color-dark);
  }

  .small .box-icon gv-icon {
    --gv-icon--s: 16px;
  }

  .box-icon.box-icon-clear gv-icon,
  :host([large]) .box-icon.box-icon-clear gv-icon {
    width: 16px;
  }

  .box-icon.box-icon-bgc {
    background-color: var(--gv-input-icon--bgc, var(--gv-theme-neutral-color, #f5f5f5));
    border: var(--gv-input--bdw, 1px) var(--gv-input--bds, solid) var(--gv-input--bdc, var(--gv-theme-neutral-color-dark, #d9d9d9));
  }

  :host([large]) .box-icon {
    height: var(--input-large--h);
    width: var(--input-large--h);
  }

  :host([large]) .box-icon gv-icon {
    width: 24px;
    --gv-icon--s: 24px;
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

  .box-input {
    position: relative;
    line-height: 0;
  }

  /* BASE */
  input,
  ::slotted(input),
  ::slotted(.input),
  .input {
    border: var(--gv-input--bdw, 1px) var(--gv-input--bds, solid) var(--gv-input--bdc, var(--gv-theme-neutral-color-dark, #d9d9d9));
    box-sizing: border-box;
    border-radius: 4px;
    font-style: normal;
    font-weight: normal;
    outline: none;
    width: 100%;
    height: 100%;
    -webkit-appearance: none;
  }

  input::-webkit-search-decoration,
  ::slotted(input::-webkit-search-decoration) {
    -webkit-appearance: none;
  }

  /* SIZE */
  .large input,
  .large ::slotted(input),
  .large ::slotted(.input),
  .large .input {
    padding: var(--input-large--p);
    font-size: var(--input-large--fz);
    line-height: var(--input-large--lh);
    height: var(--input-large--h);
  }

  .medium input,
  .medium ::slotted(input),
  .medium ::slotted(.input),
  .medium .input {
    padding: var(--input-medium--p);
    font-size: var(--input-medium--fz);
    line-height: var(--input-medium--lh);
    height: var(--input-medium--h);
  }

  .small input,
  .small ::slotted(input),
  .small ::slotted(.input),
  .small .input {
    padding: var(--input-small--p);
    font-size: var(--input-small--fz);
    line-height: var(--input-small--lh);
    height: var(--input-small--h);
  }

  .large.icon input,
  .large.icon ::slotted(input) {
    padding-right: 45px;
  }

  .large.clearable input,
  .large.clearable ::slotted(input) {
    padding-right: 50px;
  }

  .medium.icon input,
  .medium.icon ::slotted(input) {
    padding-right: 36px;
  }

  .medium.clearable input,
  .medium.clearable ::slotted(input) {
    padding-right: 32px;
  }

  .small.icon input,
  .small ::slotted(input) {
    padding-right: 26px;
  }

  .small.clearable inpu,
  .small.clearable ::slotted(input) {
    padding-right: 22px;
  }

  .large.icon-left input,
  .large.icon-left ::slotted(input) {
    padding-left: 45px;
  }

  .large.clearable input,
  .large.clearable ::slotted(input) {
    padding-right: 40px;
  }

  .medium.icon-left input,
  .medium.icon-left ::slotted(input) {
    padding-left: 36px;
  }

  .small.icon-left input,
  .small.icon-left ::slotted(input) {
    padding-left: 26px;
  }

  ::-webkit-search-cancel-button {
    -webkit-appearance: none;
  }

  /* STATES */
  :host([disabled]) {
    --gv-icon--c: var(--gv-theme-neutral-color-darker, #d9d9d9);
  }

  :host([disabled]) .box-icon-bgc {
    background-color: transparent;
  }

  :host([disabled]) input,
  :host([disabled]) ::slotted(input) {
    cursor: default;
    opacity: 0.5;
  }

  input:required,
  .input:required,
  ::slotted(input:required),
  ::slotted(.input:required),
  input:invalid,
  .input:invalid,
  ::slotted(input:invalid),
  ::slotted(.input:invalid) {
    box-shadow: none;
  }

  label {
    display: block;
    line-height: 15px;
    padding: 0 0 0.2rem 0;
  }

  .description {
    opacity: 0.6;
    font-size: var(--gv-theme-font-size-s, 12px);
  }
`;
