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
export function withResizeObserver (ParentClass) {

  // Load native impl or polyfill (without poluting global scope)
  const ResizeObserverPromise = ('ResizeObserver' in window)
    ? Promise.resolve(window.ResizeObserver)
    : import('resize-observer-polyfill/dist/ResizeObserver.es.js').then((mod) => mod.default);

  return class extends ParentClass {

    _onResize ({ width }) {

      if (this.onResize != null) {
        this.onResize({ width });
      }
      if (this.breakpoints != null) {
        this.breakpoints.width.forEach((breakpoint) => {

          const gteAttr = 'w-gte-' + breakpoint;
          (breakpoint <= width)
            ? this.setAttribute(gteAttr, '')
            : this.removeAttribute(gteAttr);

          const ltAttr = 'w-lt-' + breakpoint;
          (width < breakpoint)
            ? this.setAttribute(ltAttr, '')
            : this.removeAttribute(ltAttr);
        });
      }
    }

    async connectedCallback () {
      if (super.connectedCallback != null) {
        super.connectedCallback();
      }
      const ResizeObserver = await ResizeObserverPromise;
      const ro = new ResizeObserver(() => {
        const { width } = this.getBoundingClientRect();
        this._onResize({ width });
      });
      ro.observe(this);
      this._unobserveResize = () => ro.unobserve(this);
    }

    disconnectedCallback () {
      if (super.connectedCallback != null) {
        super.disconnectedCallback();
      }
      if (this._unobserveResize) {
        this._unobserveResize();
      }
    }
  };
}
