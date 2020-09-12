/* eslint-disable lit/no-invalid-html */

import { html, css, LitElement } from 'lit-element';
import '@thepassle/generic-components/generic-disclosure.js';
import { chevronRight, chevronDown } from './icons/index.js';

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
      :host {
        display: flex;
      }

      a {
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
        border: solid 3px var(--border-col);
        background-color: var(--col-dark);
      }

      generic-disclosure {
        border-bottom: none;
        margin-bottom: 20px;
      }

      button:hover,
      button:focus {
        background-color: var(--col-dark);
        border: solid 3px var(--col-active);
      }

      div[slot='detail'] {
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
    this.site = '';
    this.components = [];
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
