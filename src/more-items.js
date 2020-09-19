/* eslint-disable no-nested-ternary */
import { LitElement, html, css } from 'lit-element';
import { loading, loadingStyles } from './icons/index.js';
import './site-item.js';

class MoreItems extends LitElement {
  static get properties() {
    return {
      items: { type: Array },
      loadMoreClicked: { type: Boolean },
      finished: { type: Boolean },
      error: { type: Boolean },
      shouldFocus: { type: Boolean },
    };
  }

  static get styles() {
    return css`
      ${loadingStyles}

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
    this.items = [];
    this.loadMoreClicked = false;
    this.finished = false;
    this.error = false;
    this.shouldFocus = false;
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
      this.items.length > 0 &&
      this.shouldFocus
    ) {
      const siteItem = this.shadowRoot.querySelector('site-item');
      await siteItem.updateComplete;
      const disclosure = siteItem.shadowRoot
        .querySelector('generic-disclosure')
        .querySelector('button');
      disclosure.focus();
    }
  }

  render() {
    return html`
      ${this.items.length === 0
        ? this.error
          ? ''
          : loading
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
