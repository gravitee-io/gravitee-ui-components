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

export function FormControl (ParentClass) {
  /**
   * @mixinClass
   */
  return class extends ParentClass {
    static get properties () {
      return {
        ...super.properties,
        small: { type: Boolean, reflect: true },
        medium: { type: Boolean, reflect: true },
        large: { type: Boolean, reflect: true },
        skeleton: { type: Boolean, reflect: true },
        invalid: { type: Boolean, reflect: true },
        valid: { type: Boolean, reflect: true },
      };
    }

    constructor () {
      super();
      this.medium = true;
    }

    static get styles () {
      return [
        super.styles,
        // language=CSS
        css`
            :host {
                box-sizing: border-box;
                margin: 0.2rem;
                display: block;
            }

            :host([invalid]) :not(.clipboard) input,
            :host([invalid]) :not(.clipboard) .box-icon-left,
            :host([invalid]) :not(.clipboard) textarea,
            :host([invalid]) ::slotted([name="input"]) {
                box-shadow: inset 3px 0 0 var(--gv-input-invalid--bxshc, var(--gv-theme-color-error, #da1a1b));
            }

            :host([readonly]) :not(.clipboard) input,
            :host([readonly]) .textarea,
            :host([readonly]) ::slotted([name="input"]) {
                border-left: 1px solid var(--gv-input--bdc, var(--gv-theme-neutral-color-dark, #d9d9d9));
            }

            :host([readonly]) input::placeholder {
                color: transparent;
            }
            
            :host([small]) ::slotted([name="input"]) {
                
            }

            :host([medium]) ::slotted([name="input"]) {

            }

            :host([large]) ::slotted([name="input"]) {

            }
            
        `,
      ];
    }
  }
};
