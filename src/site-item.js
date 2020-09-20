/* eslint-disable lit/no-invalid-html */

import { html, css, LitElement } from 'lit-element';
import '@thepassle/generic-components/generic-disclosure.js';
import { chevronRight, chevronDown } from './icons/index.js';
import { focusStyles } from './utils.js';

class SiteItem extends LitElement {
  static get properties() {
    return {
      site: { type: String },
      components: { type: Array },
      chevron: { type: Boolean },
    };
  }

  static get styles() {
    return css`
      ${focusStyles()}
      :host {
        display: flex;
      }

      a {
        height: 50px;
        line-height: 50px;
        color: var(--col-active);
        text-decoration: none;
        margin-right: 10px;
      }

      a:hover,
      a:active,
      a:focus {
        text-decoration: underline;
      }

      button {
        line-height: 24px;
        border-radius: 7px;
        border: solid 2px var(--input-border);
        background-color: var(--input-bg);
      }

      generic-disclosure {
        border-bottom: none;
        margin-bottom: 20px;
      }

      button:hover {
        box-shadow: 0 0 0 2px var(--col-active) !important;
      }

      button:active:hover {
        background-color: var(--input-bg-hover);
      }

      div[slot='detail'] {
        border: solid 2px var(--input-border);
        background-color: var(--col-dark);
        margin-top: 10px;
        border-radius: 7px;
      }

      svg {
        fill: var(--text-color);
      }

      button {
        color: var(--text-color);
      }

      ul {
        color: var(--text-color);
        list-style: none;
        padding: 15px;
        text-align: left;
        font-size: 16px;
        line-height: 34px;
      }

      .component {
        color: var(--component-color);
      }
    `;
  }

  constructor() {
    super();
    /** @type {string} - domainname */
    this.site = '';
    /** @type {string[]} */
    this.components = [];
    /** @type {boolean} */
    this.chevron = false;
  }

  toggleChevron() {
    this.chevron = !this.chevron;
  }

  render() {
    return html`
      <a target="_blank" rel="noreferrer noopener" href="https://${this.site}"
        >#</a
      >
      <generic-disclosure @opened-changed=${this.toggleChevron}>
        <button slot="toggle">
          ${this.chevron ? chevronDown : chevronRight} ${this.site}
        </button>
        <div slot="detail">
          <ul>
            ${this.components.map(
              component =>
                html`<li>< <span class="component">${component}</span> ></li>`
            )}
          </ul>
        </div>
      </generic-disclosure>
    `;
  }
}

customElements.define('site-item', SiteItem);
