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
import { css, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events';
import { applyTheme } from '../lib/theme';

/**
 *
 * Our components use css variables to expose customizable properties.
 *
 * We did a work of inheritance and factorization of properties in order to define a general theme for our components.
 *
 * So we offer within our portal a customization tool.
 *
 * @cssprop {Color} [--gv-theme-color-darker=#1D3730] - Primary darker color
 * @cssprop {Color} [--gv-theme-color-dark=#193E34] - Primary dark color
 * @cssprop {Color} [--gv-theme-color=#009B5B] - Primary color
 * @cssprop {Color} [--gv-theme-color-light=#D5FDCB] - Primary light color
 * @cssprop {Color} [--gv-theme-color-danger=#FF5722] - Primary danger color
 *
 * @cssprop {Color} [--gv-theme-neutral-color-darkest=#000000] - Neutral darkest color
 * @cssprop {Color} [--gv-theme-neutral-color-darker=#BFBFBF] - Neutral darker color
 * @cssprop {Color} [--gv-theme-neutral-color-dark=#D9D9D9] - Neutral dark color
 * @cssprop {Color} [--gv-theme-neutral-color=#F5F5F5] - Neutral color
 * @cssprop {Color} [--gv-theme-neutral-color-light=#EFEFEF] - Neutral light color
 * @cssprop {Color} [--gv-theme-neutral-color-lighter=#FAFAFA] - Neutral light color
 * @cssprop {Color} [--gv-theme-neutral-color-lightest=#FFFFFF] - Neutral lightest color

 * @cssprop {Color} [--gv-theme-font-color-dark=#262626] - Dark font color
 * @cssprop {Color} [--gv-theme-font-color-light=#FFFFFF] - Light Font color
 * @cssprop {String} [--gv-theme-font-family='IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif] - Family
 * @cssprop {Length} [--gv-theme-font-size-xs=10px] - Extra small
 * @cssprop {Length} [--gv-theme-font-size-s=12px] - Small
 * @cssprop {Length} [--gv-theme-font-size-m=14px] - Medium (Default)
 * @cssprop {Length} [--gv-theme-font-size-l=16px] - Large
 * @cssprop {Length} [--gv-theme-font-size-xl=26px] - Extra large
 * @cssprop {Length} [--gv-theme-font-size-xxl=30px] - Extra extra large
 *
 * @cssprop {Color} [--gv-theme-skeleton-color=#BFBFBF] - Primary skeleton color
 *
 * @cssprop {Image} [--gv-theme-background-image=url('/images/gravitee-bgi.jpg')] - Background image
 * @cssprop {Image} [--gv-theme-logo=url('/images/gravitee-logo.png')] - Logo
 * @cssprop {Image} [--gv-theme-optional-logo=url('/images/gravitee-logo-light.png')] - Optional logo
 *
 */

export class GvTheme extends LitElement {

  static get properties () {
    return {
      _theme: { type: Object, attribute: false },
      _lastDate: { type: Number, attribute: false },
    };
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          --gv-theme-color-darker: var(--gv-theme-color-darker, #1D3730);
          --gv-theme-color-dark: var(--gv-theme-color-dark, #193E34);
          --gv-theme-color: var(--gv-theme-color, #009B5B);
          --gv-theme-color-light: var(--gv-theme-color-light, #D5FDCB);
          --gv-theme-color-danger: var(--gv-theme-color-danger, #FF5722);

          --gv-theme-neutral-color-darkest: var(--gv-theme-neutral-color-darkest, #000000);
          --gv-theme-neutral-color-darker: var(--gv-theme-neutral-color-darker, #BFBFBF);
          --gv-theme-neutral-color-dark: var(--gv-theme-neutral-color-dark, #D9D9D9);
          --gv-theme-neutral-color: var(--gv-theme-neutral-color, #F5F5F5);
          --gv-theme-neutral-color-light: var(--gv-theme-neutral-color-light, #EFEFEF);
          --gv-theme-neutral-color-lighter: var(--gv-theme-neutral-color-lighter, #FAFAFA);
          --gv-theme-neutral-color-lightest: var(--gv-theme-neutral-color-lightest, #FFFFFF);

          --gv-theme-font-color-dark: var(--gv-theme-font-color-dark, #262626);
          --gv-theme-font-color-light: var(--gv-theme-font-color-light, #FFFFFF);
          --gv-theme-font-size-xs: var(--gv-theme-font-size-xs, 10px);
          --gv-theme-font-size-s: var(--gv-theme-font-size-s, 12px);
          --gv-theme-font-size-m: var(--gv-theme-font-size-m, 14px);
          --gv-theme-font-size-l: var(--gv-theme-font-size-l, 16px);
          --gv-theme-font-size-xl: var(--gv-theme-font-size-xl, 26px);
          --gv-theme-font-size-xxl: var(--gv-theme-font-size-xxl, 30px);
          --gv-theme-skeleton-color: var(--gv-theme-skeleton-color, #BFBFBF);
          --gv-theme-font-family: var(--gv-theme-font-family, 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif);

          --gv-theme-background-image: var(--gv-theme-background-image, url('/images/gravitee-bgi.jpg'));
          --gv-theme-logo: var(--gv-theme-logo, urt('/images/gravitee-logo.png'));
          --gv-theme-optional-logo: var(--gv-theme-optional-logo, url('/images/gravitee-logo-light.png'));
        }
      `];
  }

  constructor () {
    super();
    this._lastDate = 0;
  }

  handleEvent (event) {
    if (event.data.type === 'gravitee') {
      this.source = event.source;
      this.origin = event.origin;
      this.isDetached = event.data.isDetached;
      this._lastDate = event.data.date;
      if (event.data.requestAnswer) {
        this.sendMessage();
      }
      if (event.data.theme) {
        this._theme = event.data.theme;
      }
      else {
        console.warn('Theme not found', event.data);
      }
    }
    else {
      console.warn('Unknown message', event.data);
    }
  }

  getData () {
    return {
      type: 'gravitee',
      href: window.location.href,
      date: Date.now(),
    };
  }

  sendMessage (data = {}, timeout = 0) {
    if (this.source && this.origin) {
      const sendData = Object.assign({}, this.getData(), data);
      this.source.postMessage(sendData, this.origin);
    }
    else {
      console.warn('Unknown source & origin for send message');
    }
  }

  render () {
    applyTheme(this._theme);
  }

  firstUpdated () {
    window.addEventListener('message', this.handleEvent.bind(this), false);
    window.addEventListener('unload', (event) => {
      if (this.isDetached) {
        this.sendMessage({ unload: true });
      }
      else {
        this.sendMessage();
      }
      clearInterval(this.intervalID);
    });
    this.intervalID = setInterval(() => {
      if (this._lastDate - Date.now() < -30000) {
        dispatchCustomEvent(this, 'error', { message: 'Connection for preview has been lost, please close this tab and refresh your browser.' });
      }
    }, 30000);
  }

}

window.customElements.define('gv-theme', GvTheme);
