import { html, css } from 'lit-element';
import { satisfies } from 'es-semver';
import { installDarkModeHandler } from 'pwa-helper-components';

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

function handleToggle(htmlEl) {
  if (htmlEl.classList.contains('dark')) {
    htmlEl.classList.remove('dark');
    localStorage.setItem('darkmode', 'false');
  } else {
    htmlEl.classList.add('dark');
    localStorage.setItem('darkmode', 'true');
  }
}

export function setupDarkmode(darkModeToggle) {
  const htmlEl = document.getElementsByTagName('html')[0];
  handleToggle(htmlEl);

  installDarkModeHandler(darkmode => {
    const manifest = document.querySelector("link[rel='manifest']");

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
    darkModeToggle.addEventListener(event, e => {
      switch (event) {
        case 'keydown':
          if (e.keyCode === 32 || e.keyCode === 13) {
            e.preventDefault();
            handleToggle();
          }
          break;
        case 'click':
          handleToggle(htmlEl);
          break;
        default:
          break;
      }
    });
  });
}

export async function skipWaiting() {
  const reg = await navigator.serviceWorker.getRegistration();
  reg.waiting.postMessage({ type: 'SKIP_WAITING' });
}

export const switchStyles = () => css`
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
