/* eslint-disable no-nested-ternary */
import { LitElement, html, css } from 'lit-element';
import { focusStyles } from './utils.js';
import './site-item.js';

/** @typedef {import('./LocatorList').Document} Document */

class MoreItems extends LitElement {
  static get properties() {
    return {
      items: { type: Array },
      loadMoreClicked: { type: Boolean },
      finished: { type: Boolean },
      error: { type: Boolean },
    };
  }

  static get styles() {
    return css`
      ${focusStyles()}
      :host {
        display: block;
      }

      ul {
        list-style: none;
        padding: 0;
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
    `;
  }

  constructor() {
    super();
    /** @type {Document[]} */
    this.items = [];
    /** @type {boolean} */
    this.loadMoreClicked = false;
    /** @type {boolean} */
    this.finished = false;
    /** @type {boolean} */
    this.error = false;
  }

  loadMore() {
    this.dispatchEvent(new Event('load-more'));
    this.loadMoreClicked = true;
  }

  async updated(changedProperties) {
    super.updated(changedProperties);

    if (
      changedProperties &&
      changedProperties.get('items') &&
      this.items.length > 0
    ) {
      this.loadMoreClicked = false;
    }
  }

  render() {
    return html`
      ${this.items.length === 0
        ? ''
        : html`
            <ul>
              ${this.items.map(
                ({ domain, customElements }) => html`
                  <li>
                    <site-item
                      .site=${domain}
                      .components=${customElements}
                    ></site-item>
                  </li>
                `
              )}
            </ul>

            ${!this.finished && !this.loadMoreClicked
              ? html`<button class="button" @click=${this.loadMore}>
                  load more
                </button>`
              : ''}
          `}
    `;
  }
}
customElements.define('more-items', MoreItems);
