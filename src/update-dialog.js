import { html, LitElement } from 'lit-element';
import { dialog } from '@thepassle/generic-components/generic-dialog/dialog.js';
import { getChanged, skipWaiting } from './utils.js';
import version from './version.js';
import { cross, loading } from './icons/index.js';

class UpdateDialog extends LitElement {
  static get properties() {
    return {
      changed: { type: Array },
      loading: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.changed = [];
    this.loading = true;
  }

  createRenderRoot() {
    return this;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.changed = await getChanged(version);
    this.loading = false;
  }

  render() {
    return html`
      <button @click=${() => dialog.close()} class="close button">
        ${cross}
      </button>
      <h1>There's an update available!</h1>
      <p>Here's what's changed:</p>
      <ul>
        ${this.loading ? loading : this.changed}
      </ul>
      <div class="dialog-buttons">
        <button class="button" @click=${skipWaiting}>Install update</button>
        <button class="button" @click=${() => dialog.close()}>Close</button>
      </div>
    `;
  }
}

customElements.define('update-dialog', UpdateDialog);
