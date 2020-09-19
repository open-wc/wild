/* eslint-disable no-nested-ternary */
import { LitElement, html, css } from 'lit-element';
import { render } from 'lit-html';
import { dialog } from '@thepassle/generic-components/generic-dialog/dialog.js';
import { addPwaUpdateListener } from 'pwa-helper-components';

import '@thepassle/generic-components/generic-disclosure.js';
import '@thepassle/generic-components/generic-switch.js';
import 'pwa-helper-components/pwa-update-available.js';

import { reticle } from './icons/index.js';
import { switchStyles, setupDarkmode } from './utils.js';
import version from './version.js';
import './update-dialog.js';
import './more-items.js';

console.log(`[Custom Elements in the wild] version: ${version}`);

export class LocatorList extends LitElement {
  static get properties() {
    return {
      allItems: { type: Array },
      finished: { type: Boolean },
      error: { type: Boolean },
      updateAvailable: { type: Boolean },
    };
  }

  static get styles() {
    return css`
      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        font-size: calc(10px + 2vmin);
        color: #1a2b42;
        max-width: 960px;
        margin: 0 auto;
        text-align: center;
      }

      .header {
        display: flex;
      }

      .explainer {
        font-weight: 300;
        font-size: 24px;
        text-align: left;
        line-height: 34px;
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
        margin-left: auto;
        display: block;
        width: max-content;
        font-size: 16px;
      }

      ul {
        list-style: none;
        padding-left: 0;
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
    this.updateAvailable = false;
    this.allItems = [[]];
  }

  async connectedCallback() {
    super.connectedCallback();

    try {
      const { total, data } = await this.getItems();
      this.allItems[0] = data;

      this.finished = this.allItems.flat().length >= total;

      this.error = false;
      this.requestUpdate();
    } catch {
      this.error = true;
    }

    addPwaUpdateListener(updateAvailable => {
      this.updateAvailable = updateAvailable;
    });
  }

  async loadMore() {
    try {
      const { length } = this.allItems;
      this.allItems = [...this.allItems, []];
      const { total, data } = await this.getItems();
      this.allItems[length] = data;
      this.finished = this.allItems.flat().length >= total;
      this.loadMoreError = false;
    } catch {
      this.loadMoreError = true;
    }

    this.requestUpdate();
  }

  firstUpdated() {
    const darkModeToggle = this.shadowRoot.getElementById('darkmode');
    setupDarkmode(darkModeToggle);
  }

  async getItems() {
    return (
      await fetch(
        `https://custom-elements-api.cleverapps.io/get?current=${
          this.allItems.flat().length
        }`,
        {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
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

  render() {
    return html`
      <main>
        <div class="header">
          ${this.updateAvailable
            ? html`<button @click=${this.openDialog} class="update button">
                Hey!
                <div class="dot"></div>
              </button>`
            : ''}
          <generic-switch
            id="darkmode"
            label="Toggle darkmode"
          ></generic-switch>
        </div>

        <div class="logo">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://chrome.google.com/webstore/detail/custom-elements-locator/eccplgjbdhhakefbjfibfhocbmjpkafc"
            >${reticle}</a
          >
        </div>
        <h1>Custom elements in the wild</h1>
        <p class="explainer">
          This page lists sites that make use of custom elements. Sites are
          automatically and anonymously added by users browsing the web with the
          <a
            rel="noopener noreferrer"
            href="https://chrome.google.com/webstore/detail/custom-elements-locator/eccplgjbdhhakefbjfibfhocbmjpkafc"
            >Custom Elements Locator</a
          >
          browser extension.
        </p>

        ${!this.error
          ? html`
              ${navigator.onLine
                ? html`
                    <ul>
                      ${this.allItems.map(
                        items => html`
                          <more-items
                            .shouldFocus=${this.allItems.length > 1}
                            .finished=${this.finished}
                            .items=${items}
                            .error=${this.loadMoreError}
                            @load-more=${this.loadMore}
                          >
                          </more-items>
                        `
                      )}
                    </ul>

                    ${this.loadMoreError
                      ? html`<p>
                          Something went wrong loading more sites. Please try
                          again later.
                        </p>`
                      : ''}
                  `
                : html`<p>Uh oh! Looks like you're not online ☹️</p>`}
            `
          : html`<p>Something went wrong!</p>`}
      </main>

      <p class="app-footer">
        🚽 Made with love by
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/open-wc"
          >open-wc</a
        >.
      </p>
    `;
  }
}
