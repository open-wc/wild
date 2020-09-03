# Update experience

- undo skipwaiting/clientsclaim
- Do not cache changelog.json
  - DO cache version.js
  - changelog.json should be generated based on the CHANGELOG.md, this should happen during the rollup build probably
  - we need some way to find our current version.js based on package.json, see: https://github.com/thepassle/lockdown
  - find way to diff between current version and any updates in later versions from changelog.json
  - if update found, open dialog
    - fetch changelog.json, compare with current version.js
    - render
    - show update button
