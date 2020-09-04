import { html, css, LitElement } from 'lit-element';
import { dialog } from '@thepassle/generic-components/generic-dialog/dialog.js';
import { getChanged, skipWaiting } from './utils.js';
import version from './version.js';
import { cross } from './icons/index.js';

class UpdateDialog extends LitElement {
  static get properties() {
    return {
      changed: { type: Array },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  constructor() {
    super();
    this.changed = [];
  }

  createRenderRoot() {
    return this;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.changed = await getChanged(version);
  }

  render() {
    return html`
      <button @click=${() => dialog.close()} class="close button">
        ${cross}
      </button>
      <h1>There's an update available!</h1>
      <p>Here's what has changed:</p>
      <ul>
        ${this.changed}
      </ul>
      <div class="dialog-buttons">
        <button class="button" @click=${skipWaiting}>Install update</button>
        <button class="button" @click=${() => dialog.close()}>Close</button>
      </div>
    `;
  }
}

customElements.define('update-dialog', UpdateDialog);
