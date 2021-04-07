import { LitElement, html, css } from 'lit-element';

export class GvVueMeter extends LitElement {
  static get properties () {
    return {
      levels: { type: Array },
    };
  }

  _getColor (score) {
    if (score < 50) return '#FF1F1F';
    if (score >= 50 && score < 60) return '#F58351';
    if (score >= 60 && score < 75) return '#FCFC36';
    if (score >= 75 && score < 90) return '#8FCCA7';
    if (score === 100) return '#2F4B26';
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
          vertical-align: middle;
        }
        .container {
          border-top: 2px solid #d3d3d3;
          width: fit-content;
          padding: 20px;
          color: #d3d3d3;
          text-align: center;
        }
        .gauge-container {
          display: flex;
          background-color: #d3d3d3;
          height: 20px;
          width: 500px;
          border-radius: 20px;
          font-size: 30px;
          margin-top: 20px;
        }
        .level-container {
          border: thin black solid;
          width: 20%;
          color: black;
          font-size: 10px;
        }
        .level-container:nth-child(n+1){
          border-right:0px;
        }
        .level-container:last-child {
          border-left: 0px;
          border-right: thin black solid;
        }
        .target-level-container {
          border: thin black solid;
          width: 20%;
          font-size: 10px;
          color: black;
        }
        .target-border {
          border: 3px dotted rgba(255,0,0,0.64);
          border-radius: 4px;
          height: 30px;
          position: relative;
          top: -21px;
          left: 12px;
          width: 70%;
        }
        div > strong {
          position: relative;
          top: 3px;
        }
      `,
    ];
  }

  render () {
    return html`
      <div class="container">
        Quality :
        <div class="gauge-container">
          ${this.levels.map((level) =>
            level.targetLevel
              ? html`
                  <div
                    class="target-level-container"
                    style="background-color: ${this._getColor(level.score)}"
                  >
                    <strong> LEVEL ${level.level} </strong>
                    <div class="target-border"></div>
                  </div>
                `
              : html`<div
                  class="level-container"
                  style="background-color: ${this._getColor(level.score)}"
                >
                <strong> LEVEL ${level.level} </strong>
                </div>`,
          )}
        </div>
      </div>
    `;
  }
}

window.customElements.define('gv-vue-meter', GvVueMeter);
