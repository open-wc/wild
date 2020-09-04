<p align="center">
  <img width="128" src="/images/icons/icon128.png"></img>
</p>

## Custom Elements in the wild

[![Built with open-wc recommendations](https://img.shields.io/badge/built%20with-open--wc-blue.svg)](https://github.com/open-wc) 

[Visit site](https://wild.open-wc.org)

## Quickstart

To get started:

```bash
npm install
npm start
```

## Testing the service worker

- `npm run build`
- `cd dist && http-server -o`
- open browser

If you want to test the update flow as well, continue here:

- make a change to the code
- `npm run build`
- `cd dist && http-server -o`
- open browser

## Contributing

This project makes use of a semver-based service worker update pattern. Every update should be done via a pull request to the `master` branch, and all pull requests should contain an updated `CHANGELOG.md` and a version bump in the `package.json`.

## Scripts

- `start` runs your app for development, reloading on file changes
- `start:build` runs your app after it has been built using the build command
- `build` builds your app and outputs it in your `dist` directory
- `test` runs your test suite with Karma
- `lint` runs the linter for your project

## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.