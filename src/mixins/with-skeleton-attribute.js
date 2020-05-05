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
import { skeleton } from '../styles/skeleton';
import { empty } from '../styles/empty';

const timeBeforeSkeleton = 500;
const minimumTimeOfSkeleton = 1000;

/**
 * This is a mixin for withSkeletonStates
 * @mixinFunction
 */
export function withSkeletonAttribute (ParentClass) {

  /**
   * @mixinClass
   */
  return class extends ParentClass {

    static get properties () {
      return {
        /** @required */
        _invisible: { type: Boolean, reflect: true },
        _skeleton: { type: Boolean, attribute: false },
        _error: { type: Boolean, attribute: false },
        _empty: { type: Boolean, attribute: false },
      };
    }

    static get styles () {
      return [
        skeleton,
        empty,
        // language=CSS
        css`
          :host([_invisible]) {
            visibility: hidden;
          }`,
      ];
    }

    constructor () {
      super();
      this._invisible = true;
      this._skeleton = false;
      this._error = false;
      this._empty = false;
    }

    updated (changedProperties) {
      if (this._skeletonAttribute != null && changedProperties.has(this._skeletonAttribute)) {
        this._error = false;
        const start = new Date().getTime();
        let end = null;
        const timer = setTimeout(() => {
          this._invisible = false;
          this._skeleton = true;
          end = new Date().getTime();
        }, timeBeforeSkeleton);

        const attribute = this[this._skeletonAttribute];
        Promise.resolve(attribute)
          .then((value) => {
            clearTimeout(timer);
            if (end && (end - start) < minimumTimeOfSkeleton) {
              setTimeout(() => {
                this[this._skeletonAttribute] = value;
              }, minimumTimeOfSkeleton - (end - start));
            }
            else {
              this._invisible = value === undefined;
              this._skeleton = value === null;
              if (value) {
                if (Array.isArray(value)) {
                  this._empty = value.length === 0;
                }
                else {
                  this._empty = Object.keys(value).length === 0;
                }
                this[`_${this._skeletonAttribute}`] = value;
              }
            }
          })
          .catch((err) => {
            clearTimeout(timer);
            if (end && (end - start) < minimumTimeOfSkeleton) {
              setTimeout(() => {
                this[this._skeletonAttribute] = Promise.reject(err);
              }, minimumTimeOfSkeleton - (end - start));
            }
            else {
              this._error = true;
              this._skeleton = false;
              this._empty = false;
              this._invisible = false;
            }
          });
      }

    }

  };

}
