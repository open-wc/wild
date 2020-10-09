/* eslint-disable no-nested-ternary */
import { LitElement, html, css } from 'lit-element';
import { render } from 'lit-html';
import { dialog } from '@thepassle/generic-components/generic-dialog/dialog.js';
import { addPwaUpdateListener } from 'pwa-helper-components';

import '@thepassle/generic-components/generic-disclosure.js';
import '@thepassle/generic-components/generic-switch.js';
import 'pwa-helper-components/pwa-update-available.js';

import { loading, reticle, loadingStyles } from './icons/index.js';
import { switchStyles, focusStyles, setupDarkmode } from './utils.js';
import version from './version.js';
import './update-dialog.js';
import './more-items.js';

/**
 * @typedef {Object} Document
 * @property {string} domain
 * @property {string[]} customElements
 */

/**
 * @typedef {Object} ApiReponse
 * @property {number} total
 * @property {Document[]} data
 */

console.log(`[Custom Elements in the wild] version: ${version}`);

/**
 * @extends {LitElement}
 */
export class LocatorList extends LitElement {
  static get properties() {
    return {
      allItems: { type: Array },
      totalItems: { type: Number },
      finished: { type: Boolean },
      error: { type: Boolean },
      updateAvailable: { type: Boolean },
      endpoint: { type: String },
      loading: { type: Boolean },
    };
  }

  static get styles() {
    return css`
      ${loadingStyles}
      ${focusStyles()}

      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        font-size: calc(10px + 2vmin);
        color: #1a2b42;
        text-align: center;
      }

      header {
        width: 100%;
        background-color: var(--col-dark);
        height: 60px;
        position: sticky;
        top: 0;
        z-index: 1;
        box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.5);
      }

      main {
        max-width: 960px;
        margin: 0 auto;
      }

      .header {
        display: flex;
        justify-content: space-between;
        height: 100%;
        align-items: center;
        max-width: 960px;
        margin: 0 auto;
      }

      form {
        width: 40%;
      }

      input {
        width: 100%;
        font-size: 15px;
        padding: 10px;
        border-radius: 7px;
        background-color: var(--input-bg);
        color: var(--input-text-color);
        border: solid 2px var(--input-border);
        transition: box-shadow 0.2s ease-in-out;
      }

      input:active:hover {
        box-shadow: 0 0 0 2px var(--col-active-lighter) !important;
      }

      input:hover {
        background-color: var(--input-bg-hover);
        box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.3);
      }

      input::placeholder {
        color: var(--input-placeholder);
      }

      form {
        display: flex;
        align-items: stretch;
        justify-content: center;
      }

      select {
        border-radius: 7px;
        font-size: 15px;
        padding: 10px;
        background-color: var(--input-bg);
        color: var(--input-text-color);
        border: solid 2px var(--input-border);
      }

      .explainer {
        font-weight: 300;
        font-size: 24px;
        text-align: left;
        line-height: 34px;
      }

      h1 {
        margin-top: 60px;
      }

      h1,
      p {
        color: var(--text-color);
      }

      path {
        fill: url(#gradient);
      }

      main {
        flex-grow: 1;
        padding-top: 36px;
        position: relative;
      }

      generic-switch {
        height: auto;
        display: block;
        font-size: 16px;
      }

      ul {
        list-style: none;
        padding-left: 0;
        margin-top: 60px;
      }

      .logo {
        padding-top: 36px;
      }

      .find-more {
        margin-left: auto;
        margin-right: auto;
      }

      .app-footer {
        font-size: calc(12px + 0.5vmin);
        align-items: center;
      }

      .app-footer a {
        margin-left: 5px;
      }

      ${switchStyles()}

      a,
      a:visited {
        color: var(--col-active);
      }

      a {
        display: inline-block;
      }

      .button {
        fill: var(--col-active);
        background: transparent;
        border: none;
        display: block;
        font-size: 16px;
        margin-left: auto;
        margin-right: auto;
        color: var(--col-active);
        position: relative;
        border: solid 2px var(--col-active);
        border-radius: 10px;
        padding: 5px 10px 5px 10px;
      }

      .button:hover,
      .button:active,
      .button:focus {
        background: var(--col-active-hover);
      }

      .switch-container,
      .update-container {
        width: 60px;
      }

      @media (max-width: 960px) {
        svg {
          width: 200px;
          height: 200px;
        }

        main {
          padding: 10px;
        }

        generic-switch {
          right: 10px;
        }
      }

      @media (max-width: 480px) {
        .explainer {
          font-size: 16px;
          line-height: 22px;
        }
      }
    `;
  }

  constructor() {
    super();
    /** @type {boolean} - show PWA update available button */
    this.updateAvailable = false;
    /** @type {Array<Document[]>} */
    this.allItems = [[]];
    /** @type {string} */
    this.endpoint = 'get';
    /** @type {boolean} */
    this.loading = true;
    /** @type {number} */
    this.totalItems = 0;
  }

  async connectedCallback() {
    super.connectedCallback();

    try {
      const { total, data } = await this.getItems();
      this.allItems[0] = data;
      this.totalItems = total;

      this.finished = this.allItems.flat().length >= total;

      this.error = false;
      this.loading = false;
      this.requestUpdate();
    } catch {
      this.error = true;
      this.loading = false;
    }

    addPwaUpdateListener(updateAvailable => {
      this.updateAvailable = updateAvailable;
    });
  }

  async loadMore() {
    this.loading = true;
    try {
      const { length } = this.allItems;
      this.allItems = [...this.allItems, []];
      const { total, data } = await this.getItems();
      this.allItems[length] = data;
      this.finished = this.allItems.flat().length >= total;
      this.loadMoreError = false;
      this.loading = false;
    } catch {
      this.loadMoreError = true;
      this.loading = false;
    }

    this.requestUpdate();
  }

  firstUpdated() {
    const darkModeToggle = this.shadowRoot.getElementById('darkmode');
    setupDarkmode(darkModeToggle);
  }

  /**
   * @returns {Promise<ApiReponse>}
   */
  async getItems() {
    return (
      await fetch(
        `https://custom-elements-api.cleverapps.io/${this.endpoint}?current=${
          this.allItems.flat().length
        }`,
        {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    ).json();
  }

  // eslint-disable-next-line class-methods-use-this
  openDialog(e) {
    dialog.open({
      invokerNode: e.target,
      content: dialogNode => {
        // eslint-disable-next-line
        dialogNode.id = 'dialog';
        render(html`<update-dialog></update-dialog>`, dialogNode);
      },
    });
  }

  async submit(e) {
    e.preventDefault();

    let type;
    const query = e.target.elements.query.value;
    const re = /^[a-z]*-[a-z]*$/;
    if (query.match(re)) {
      type = 'component';
    } else {
      type = 'domain';
    }

    if (query.length === 0) {
      this.endpoint = 'get';
    } else {
      this.endpoint = `get/${type}/${query}`;
    }

    this.allItems = [[]];
    await this.loadMore();
  }

  render() {
    return html`
      <header>
        <div class="header">
          <div class="update-container">
            ${
              this.updateAvailable
                ? html`<button @click=${this.openDialog} class="update button">
                    Hey!
                    <div class="dot"></div>
                  </button>`
                : ''
            }
          </div>

          <form @submit=${this.submit}>
            <input aria-label="Search tagname or domain" placeholder="Search tagname or domain" name="query" type="text"></input>
          </form>

          <div class="switch-container">
            <generic-switch
              id="darkmode"
              label="Toggle darkmode"
            ></generic-switch>
          </div>
        </div>
      </header>
      <main>
        <div class="logo">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://chrome.google.com/webstore/detail/custom-elements-locator/eccplgjbdhhakefbjfibfhocbmjpkafc"
            >${reticle}</a
          >
        </div>
        <h1>Custom elements<br/>in the wild</h1>
        <p class="explainer">
          This page lists sites that make use of custom elements. Sites are
          automatically and anonymously added by users browsing the web with the
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://chrome.google.com/webstore/detail/custom-elements-locator/eccplgjbdhhakefbjfibfhocbmjpkafc"
            >Custom Elements Locator</a
          >
          browser extension. Currently, ${
            this.totalItems
          } sites have been indexed.
        </p>
        
        ${
          !navigator.onLine
            ? html`<p>Uh oh! Looks like you're not online ☹️</p>`
            : !this.error
            ? html`
                <ul>
                  ${this.allItems.map(
                    items => html`
                      <more-items
                        .finished=${this.finished}
                        .items=${items}
                        .error=${this.loadMoreError}
                        @load-more=${this.loadMore}
                      >
                      </more-items>
                    `
                  )}
                </ul>

                ${this.loading ? loading : ''}
                ${this.loadMoreError
                  ? html`<p>
                      Something went wrong loading more sites. Please try again
                      later.
                    </p>`
                  : ''}
              `
            : html`<p>Something went wrong!</p>`
        }
      </main>

      <p class="app-footer">
        🚽 Made with love by
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.open-wc.org"
          >open-wc</a
        >.<br/>Contribute on <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/open-wc/wild"
          >Github</a
        >.
      </p>
    `;
  }
}
