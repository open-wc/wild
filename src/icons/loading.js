import { html, css } from 'lit-element';

export const loading = html`<svg
  class="loading"
  id="Layer_1"
  data-name="Layer 1"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 59.94 59.94"
>
  <defs>
    <style>
      .cls-1 {
        fill: none;
        stroke: #828282;
        stroke-miterlimit: 10;
        stroke-width: 6px;
      }
    </style>
  </defs>
  <path
    class="cls-1"
    d="M8.53,13.68A27,27,0,1,1,3,30v-.57"
    transform="translate(-0.03 -0.03)"
  />
</svg>`;
export const loadingStyles = css`
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    flex-direction: column;
    height: calc(100% - 60px);
  }

  .loading {
    width: 40px;
    height: 40px;
    animation: rotate 2000ms linear infinite;
    transform-origin: center center;
    margin: auto;
  }

  .loading circle {
    stroke-dasharray: 85, 200;
    /* 0px is requires for edge 15 and lower */
    stroke-dashoffset: 0px;
    animation: dash 2000ms ease-in-out infinite;
    stroke-linecap: round;
    stroke-width: var(--spinner-stroke-width, 4px);
    stroke-miterlimit: 10;
    fill: none;
    stroke: #828282;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 200;
      /* 0px is requires for edge 15 and lower */
      stroke-dashoffset: 0px;
    }
    50% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -35px;
    }
    100% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -124px;
    }
  }

  /* Animating SVG does not work on IE11. Use a fallback animation. */
  @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
    .loading svg {
      animation-duration: 1500ms;
    }

    .loading circle {
      stroke-linecap: square;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .loading svg {
      animation-duration: 20000ms;
    }

    .loading circle {
      animation: dash 20000ms ease-in-out infinite;
    }
  }
`;
