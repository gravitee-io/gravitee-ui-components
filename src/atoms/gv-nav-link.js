import { LitElement, html, css } from 'lit-element';
import { link } from '../styles';
import { dispatchCustomEvent } from '../lib/events';

/**
 * A nav link
 *
 * @fires gv-nav-link:click - Custom click event from inner link element
 *
 * @slot - The content of the link (text or HTML)
 *
 * @attr {Object} route - Simple object with {title: String, path: String, isActive: Boolean}
 *
 * @cssprop {String} --gv-nav-link-active - set the color of selected link.
 */
export class GvNavLink extends LitElement {

  static get properties () {
    return {
      route: { type: Object },
      _currentRoute: { type: Array, attribute: false },
    };
  }

  static get styles () {
    return [
      link,
      // language=css
      css`
          a {
              opacity: 1;
              padding: 1rem 2rem;
              color: #333333;
              display: inline-block;
              background-color: transparent;
              text-align: center;
          }

          .active {
              color: #fff;
              background-color: var(--gv-nav-link-active, #333)
          }
      `,
    ];
  }

  constructor () {
    super();
    this._currentRoute = {};
  }

  set route (route) {
    if (route) {
      Promise.resolve(route)
        .then((value) => {
          this._currentRoute = value;
        })
        .catch((e) => {
          console.trace('Cannot get route', e);
        });
    }
  }

  get route () {
    return this.route;
  }

  _onClick (e) {
    e.preventDefault();
    dispatchCustomEvent(this, 'click', this._currentRoute);
  }

  render () {
    return html`
      <a @click=${this._onClick} 
      class="${this._currentRoute.isActive ? 'active ' : ''}link" 
      href="${this._currentRoute.path}" 
      title="${this._currentRoute.title}">
${this._currentRoute.title}
      </a>
    `;
  }

}

window.customElements.define('gv-nav-link', GvNavLink);
