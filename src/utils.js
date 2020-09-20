import { html, css } from 'lit-element';
import { satisfies } from 'es-semver';
import { installDarkModeHandler } from 'pwa-helper-components';

/** @typedef {import('lit-element').CSSResult} CSSResult */
/** @typedef {import('lit-element').TemplateResult} TemplateResult */

/**
 * @param {string} version
 * @returns {Promise<TemplateResult[]>}
 */
export async function getChanged(version) {
  const { Changelog } = await (await fetch('./CHANGELOG.json')).json();
  return Object.keys(Changelog)
    .filter(item => satisfies(item, `>${version}`))
    .map(
      item => html`
        <li>
          <h2>${item}</h2>
          <div class="changelog">${Changelog[item].raw}</div>
        </li>
      `
    );
}

/**
 * @param {HTMLElement} htmlEl
 */
function handleToggle(htmlEl) {
  if (htmlEl.classList.contains('dark')) {
    htmlEl.classList.remove('dark');
    localStorage.setItem('darkmode', 'false');
  } else {
    htmlEl.classList.add('dark');
    localStorage.setItem('darkmode', 'true');
  }
}

/**
 * @param {HTMLElement} darkModeToggle
 */
export function setupDarkmode(darkModeToggle) {
  const htmlEl = document.getElementsByTagName('html')[0];

  installDarkModeHandler(darkmode => {
    const manifest = /** @type {HTMLLinkElement} */ (document.querySelector(
      "link[rel='manifest']"
    ));

    if (darkmode) {
      manifest.href = '/manifest-dark.json';
      darkModeToggle.setAttribute('checked', '');
      htmlEl.classList.add('dark');
    } else {
      manifest.href = '/manifest.json';
      darkModeToggle.removeAttribute('checked');
      htmlEl.classList.remove('dark');
    }
  });

  ['keydown', 'click'].forEach(event => {
    darkModeToggle.addEventListener(
      event,
      /** @type {KeyboardEvent} */ e => {
        const { keyCode } = /** @type {KeyboardEvent} */ (e);
        switch (event) {
          case 'keydown':
            if (keyCode === 32 || keyCode === 13) {
              e.preventDefault();
              handleToggle(htmlEl);
            }
            break;
          case 'click':
            handleToggle(htmlEl);
            break;
          default:
            break;
        }
      }
    );
  });
}

/**
 * @returns {Promise<void>}
 */
export async function skipWaiting() {
  const reg = await navigator.serviceWorker.getRegistration();
  reg.waiting.postMessage({ type: 'SKIP_WAITING' });
}

/** @type {() => CSSResult} */
export const focusStyles = () => css`
  *:focus {
    outline: 0;
    border-radius: 5px;
    box-shadow: 0 0 0 2px var(--col-active) !important;
    transition: box-shadow 0.2s ease-in-out;
  }
`;

/** @type {() => CSSResult} */
export const switchStyles = () => css`
  generic-switch {
    --generic-switch-focus: 0 0 0 2px var(--col-active);
  }

  generic-switch::part(button):focus {
    outline: 0;
    border-radius: 5px;
    box-shadow: 0 0 0 0px var(--col-active) !important;
    transition: box-shadow 0.1s ease-in-out;
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
`;
