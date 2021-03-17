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
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

/**
 * Spinner component
 *
 * ## Details
 * * has @theme facet
 *
 */
export class GvQualityGauge extends LitElement {

  static get properties () {
    return {
      percent: { type: Number }
    };
  }

  _getColor(percent) {
    if (percent < 50) return 'red';
    if (percent >= 50 && percent < 60) return 'orange';
    if (percent >= 60 && percent < 70) return 'yellow';
    if (percent >= 70 && percent < 90) return 'light-green';
    if (percent >= 90) return 'green';
  }

  static get styles () {
    return [
      // language=css
      css`
      .meter-wrap {
        box-sizing: content-box;
      }

      .meter-qual {
        box-sizing: content-box;
        font-size: 10px;
        opacity: 0.5;
        text-align: center
      }

      .meter {
        height: 10px; /* Can be anything */
        position: relative;
        background: #c9c9c9;
        border-radius: 25px;
        padding: 5px;
        box-shadow: inset 0 -1px 1px rgba(255, 255, 255, 0.3);
      }
      .meter > span {
        display: block;
        height: 100%;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
        background-color: rgb(43, 194, 83);
        background-image: linear-gradient(
          center bottom,
          rgb(43, 194, 83) 37%,
          rgb(84, 240, 84) 69%
        );
        box-shadow: inset 0 2px 9px rgba(255, 255, 255, 0.3),
          inset 0 -2px 6px rgba(0, 0, 0, 0.4);
        position: relative;
        overflow: hidden;
      }
      .meter > span:after,

      .orange > span {
        background-image: linear-gradient(#f1a165, #f36d0a);
      }
      
      .red > span {
        background-image: linear-gradient(#f0a3a3, #f42323);
      }

      .yellow > span {
        background-image: linear-gradient(#f5d442, #f5d442)
      }

      .light-green > span {
        background-image: linear-gradient(#c5f542, #c5f542)
      }

      .green > span {
        background-image: linear-gradient(#52c91a, #52c91a)
      }
      
      .nostripes > span > span,
      .nostripes > span::after {
        background-image: none;
      }
      `,
    ];
  }

  render () {
    const classes = {
      red: this.percent < 50,
      orange: this.percent >= 50 && this.percent < 60,
      yellow: this.percent >= 60 && this.percent < 70,
      'light-green': this.percent >= 70 && this.percent < 90,
      green: this.percent >= 90,
      meter: true,
      nostripes: true
    };

    return html`
        <div class="meter-wrap">
        <div class="meter-qual">Quality</div>
        <div class=${classMap(classes)}>
          <span style="width: ${this.percent}%"></span>
        </div>
      </div>`
    ;
  }
}

window.customElements.define('gv-quality-gauge', GvQualityGauge);
