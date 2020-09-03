/* eslint-disable no-nested-ternary */
import { LitElement, html, css } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/firestore';
import '@thepassle/generic-components/generic-disclosure.js';
import '@thepassle/generic-components/generic-switch.js';
import { installDarkModeHandler } from 'pwa-helper-components';
import { reticle } from './icons/index.js';
import './site-item.js';

firebase.initializeApp({
  apiKey: 'AIzaSyDHaekG4-W4Zv7FLHdai8uqGwHKV0zKTpw',
  authDomain: 'locator-a6a89.firebaseapp.com',
  projectId: 'locator-a6a89',
});

const col = firebase.firestore().collection('sites');

/**
 * @typedef {Object} Site
 * @property {string} site
 * @property {string[]} components
 */

export class LocatorList extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      page: { type: String },
      index: { type: Number },
      limit: { type: Number },
      sites: { type: Array },
      error: { type: Boolean },
      lastVisible: {},
      finished: { type: Boolean },
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

      .explainer {
        font-weight: 300;
        font-size: 24px;
        text-align: left;
        line-height: 34px;
      }

      button {
        background-color: #2758ff;
        border: 0;
        border-radius: 10px;
        color: var(--text-color-inv);
        padding: 10px 20px 10px 20px;
        font-weight: 700;
        font-size: 16px;
        border: solid 2px var(--border-col);
      }

      button:hover,
      button:focus,
      button:active {
        background-color: #388cfa;
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
        display: block;
        position: absolute;
        right: 0;
        font-size: 16px;
      }

      ul {
        list-style: none;
        padding-left: 0;
      }

      .logo {
        padding-top: 36px;
      }

      .logo > svg {
        /* transform: rotate(90deg); */
      }

      .app-footer {
        font-size: calc(12px + 0.5vmin);
        align-items: center;
      }

      .app-footer a {
        margin-left: 5px;
      }

      generic-switch::part(button) {
        height: 20px;
        width: 40px;
      }

      generic-switch::part(thumb) {
        top: -1px;
        right: 20px;
        border: solid 2px #4d4d4d;
        border-radius: 50%;
        width: calc(50% - 2px);
        height: calc(100% - 2px);
        background-color: white;
      }
      generic-switch[checked]::part(thumb) {
        right: 0px;
      }
      generic-switch::part(track) {
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        background-color: var(--switch-track);
      }

      generic-switch[checked]::part(track)::before {
        position: absolute;
        left: 2px;
        top: 4px;
        line-height: 14px;
      }

      generic-switch#darkmode[checked]::part(track)::before {
        content: '🌞';
      }

      generic-switch#darkmode::part(track)::before {
        content: '🌛';
      }

      generic-switch::part(track)::before {
        position: absolute;
        left: 22px;
        top: 4px;
        line-height: 14px;
      }

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
    /** @type {Site[]} */
    this.sites = [];
    this.index = 0;
    this.limit = 25;
  }

  async connectedCallback() {
    super.connectedCallback();
    try {
      col
        .orderBy('count', 'desc')
        .limit(this.limit)
        .get()
        .then(({ docs }) => {
          this.sites = [...this.sites, ...docs.map(doc => doc.data())];
          this.lastVisible = docs[docs.length - 1];
        });
      this.error = false;
    } catch {
      this.error = true;
    }
  }

  getSites() {
    if (!this.finished) {
      col
        .orderBy('count', 'desc')
        .startAfter(this.lastVisible)
        .limit(this.limit)
        .get()
        .then(({ docs }) => {
          this.sites = [...this.sites, ...docs.map(doc => doc.data())];
          this.lastVisible = docs[docs.length - 1];

          if (docs[docs.length - 1] === undefined) {
            this.finished = true;
          }
        });
    }
  }

  firstUpdated() {
    const darkModeToggle = this.shadowRoot.getElementById('darkmode');
    /* eslint-disable-next-line */
    const html = document.getElementsByTagName('html')[0];

    function handleToggle() {
      if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('darkmode', 'false');
      } else {
        html.classList.add('dark');
        localStorage.setItem('darkmode', 'true');
      }
    }

    installDarkModeHandler(darkmode => {
      if (darkmode) {
        darkModeToggle.setAttribute('checked', '');
        html.classList.add('dark');
      } else {
        darkModeToggle.removeAttribute('checked');
        html.classList.remove('dark');
      }
    });

    ['keydown', 'click'].forEach(event => {
      darkModeToggle.addEventListener(event, e => {
        switch (event) {
          case 'keydown':
            if (e.keyCode === 32 || e.keyCode === 13) {
              e.preventDefault();
              handleToggle();
            }
            break;
          case 'click':
            handleToggle();
            break;
          default:
            break;
        }
      });
    });
  }

  render() {
    return html`
      <main>
        <generic-switch id="darkmode" label="Toggle darkmode"></generic-switch>

        <div class="logo">
          <a
            target="_blank"
            href="https://chrome.google.com/webstore/detail/custom-elements-locator/eccplgjbdhhakefbjfibfhocbmjpkafc"
            >${reticle}</a
          >
        </div>
        <h1>Custom elements in the wild</h1>
        <p class="explainer">
          This page lists sites that make use of custom elements. Sites are
          automatically and anonymously added by users browsing the web with the
          <a
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
                      ${this.sites.map(
                        ({ site, components }) => html`
                          <li>
                            <site-item
                              .site=${site}
                              .components=${components}
                            ></site-item>
                          </li>
                        `
                      )}
                    </ul>
                  `
                : html`<p>Uh oh! Looks like you're not online</p>`}
            `
          : html`<p>Something went wrong!</p>`}
        ${navigator.onLine
          ? !this.finished
            ? html`<button @click=${this.getSites}>Find more</button>`
            : html`<p>No more sites found!</p>`
          : ''}
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
