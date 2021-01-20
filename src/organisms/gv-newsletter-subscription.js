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
import { dispatchCustomEvent } from '../lib/events';

/**
 * The newsletter subscription page
 *
 * @fires gv-newsletter-subscription:subscribe - Custom event when link click
 * @fires gv-newsletter-subscription:skip - Custom event when link click
 *
 * @attr {String} title - The title of newsletter subscription container
 * @attr {String} header - The header of newsletter subscription container
 * @attr {String} placeholder - The placeholder used for the email input
 * @attr {String} subscribeLabel - The text of the subscribe button
 * @attr {String} skipLabel - The text of the skip button
 * @attr {Array} taglines - The taglines to promote the newsletter subscription
 * @attr {String} email - The email value
 * @attr {Boolean} disabled - The disabled state of email input
 * @attr {String} githubUrl - The url to github page
 * @attr {String} twitterUrl - The url to twitter page
 * @attr {String} linkedinUrl - The url to linkedin page
 *
 */
export class GvNewsletterSubscription extends LitElement {

  static get properties () {
    return {
      title: { type: String },
      header: { type: String },
      placeholder: { type: String },
      subscribeLabel: { type: String, attribute: 'subscribe-label' },
      skipLabel: { type: String, attribute: 'skip-label' },
      taglines: { type: Array },
      email: { type: String },
      disabled: { type: Boolean },
      githubUrl: { type: String, attribute: 'github-url' },
      twitterUrl: { type: String, attribute: 'twitter-url' },
      linkedinUrl: { type: String, attribute: 'linkedin-url' },
      _invalid: { type: Boolean, attribute: false },
    };
  }

  static get styles () {
    return [
      // language=css
      css`
        :host {
          box-sizing: border-box;
          margin: 0.2rem;
        }

        .newsletter-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          height: 60%;
          width: 50%;
          max-width: 680px;
          box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
          padding: 20px 20px 5px 20px;
        }

        .newsletter__header {
          text-transform: uppercase;
          font-style: oblique;
          text-align: center;
          font-size: 16px;
          font-weight: bold;
          padding: 5px 35px;
          color: var(--gv-theme-neutral-color-lightest, #ffffff);
          background-color: var(--gv-theme-color-light, #86c3d0);
        }

        .newsletter__title {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 20px;
          text-transform: uppercase;
          padding: 20px;
          color: var(--gv-theme-color-light, #86c3d0);
        }

        .newsletter__title-highlight {
          font-size: 30px;
        }

        .newsletter__email {
          display: flex;
          flex-direction: column;
          width: 50%;
        }

        .newsletter__taglines {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          text-align: center;
          text-transform: uppercase;
          font-size: 14px;
          height: 20%;
          margin-top: 20px;
          padding: 10px 0;
          color: var(--gv-theme-color-darker, #383E3F);
          border-bottom: solid 1px var(--gv-theme-color-darker, #383E3F);
        }

        .newsletter__tagline {
          display: flex;
          flex-basis: 100%;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          font-weight: bold;
          padding: 0 15px;
          border-right: solid 1px var(--gv-theme-color-darker, #383E3F);
        }

        .newsletter__tagline.last {
          border-right: none;
        }

        .newsletter__tagline-text {
          width: 100%;
        }

        .newsletter__skip {
          margin-top: 20px;
        }

        .social {
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
        }

        .social-link {
          --gv-icon--c: var(--gv-theme-color-light, #86c3d0);
          --gv-icon--s: 32px;
        }
      `,
    ];
  }

  constructor () {
    super();
    this.header = 'Customers process over 1 billion requests through the gravitee.io gateway in just one week';
    this.title = 'Community of api masters';
    this.placeholder = 'Enter your email';
    this.subscribeLabel = 'Become an API master now';
    this.taglines = ['New release monthly updates', 'Free trial of Gravitee.IO enterprise', 'Share your experiences with other members'];
    this.skipLabel = 'Skip';
    this.email = '';
    this.disabled = false;
    this._invalid = true;
    this.githubUrl = 'https://github.com/gravitee-io';
    this.twitterUrl = 'https://twitter.com/GraviteeIO';
    this.linkedinUrl = 'https://www.linkedin.com/company/gravitee-io/';
  }

  render () {
    return html`
        <div class="newsletter-container">
          <div class="newsletter__header">
            ${this.header}
          </div>
          <div class="newsletter__title">
            <span>Join the</span>
            <span class="newsletter__title-highlight">${this.title}</span>
            <span>Today</span>
          </div>
          <div class="newsletter__email">
            <gv-input
              id="email"
              name="email"
              @gv-input:submit="${this._onSubscribe}"
              @gv-input:input="${this._onInputChange}"
              type="email"
              required
              .value="${this.email}"
              .disabled=${this.disabled}
              placeholder="${this.placeholder}"
            ></gv-input>
            <gv-button @click="${this._onSubscribe}"
                       id="email-submit"
                       provider="graviteeio_am"
                       icon-right="navigation:angle-right"
                       .disabled=${!this.disabled && this._invalid}>
              ${this.subscribeLabel}
            </gv-button>
          </div>
          ${this.taglines.length > 0 ? html`
          <div class="newsletter__taglines">
            ${this.taglines.map((item, i, arr) => html`
              <div class="newsletter__tagline ${i === arr.length - 1 ? 'last' : ''}">
                <div class="newsletter__tagline-text">
                  ${item}
                </div>
              </div>
            `)}
          </div>`
          : ''}
          <div class="newsletter__skip">
            <gv-button @click="${this._onSkip}"
                       provider="graviteeio_am"
                       icon-right="navigation:angle-right"
                       small
                       outlined>
              ${this.skipLabel}
            </gv-button>
          </div>
          <div class="social">
            <gv-button class="social-link"
                       link
                       icon="thirdparty:github"
                       .href="${this.githubUrl}"
                       @gv-button:click="${this._navigateSocial.bind(this, this.githubUrl)}">
            </gv-button>
            <gv-button class="social-link"
                       link icon="thirdparty:twitter"
                       .href="${this.twitterUrl}"
                       @gv-button:click="${this._navigateSocial.bind(this, this.twitterUrl)}">
            </gv-button>
            <gv-button class="social-link"
                       link
                       icon="thirdparty:linkedin"
                       .href="${this.linkedinUrl}"
                       @gv-button:click="${this._navigateSocial.bind(this, this.linkedinUrl)}">
            </gv-button>
            </gv-link>
          </div>
        </div>
    `;
  }

  _onSubscribe () {
    dispatchCustomEvent(this, 'subscribe', this.email);
  }

  _onSkip () {
    dispatchCustomEvent(this, 'skip');
  }

  _navigateSocial (url) {
    window.open(url, '_blank');
  }

  _onInputChange (e) {
    this._invalid = e.target.invalid;
    this.email = e.detail;
  }
}

window.customElements.define('gv-newsletter-subscription', GvNewsletterSubscription);
