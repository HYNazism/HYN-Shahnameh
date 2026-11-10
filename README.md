

---

## English

Razmnameh is a 2D action-platformer inspired by Ferdowsi's Shahnameh. It is built with React 19, TypeScript, and Vite, and is intended to run in desktop and mobile browsers. Compatibility and performance vary by device and browser.

### Downloads and release status

- [GitHub Releases](https://github.com/HYNazism/HYN-Shahnameh/releases)
- The current `package.json` version is `2.7.1`.
- The release workflow currently creates ZIP archives and checksums. Existing ZIPs contain web assets and/or launcher/build scripts; they are not native `.exe` installers or installable `.apk` files. Native packages must be built and verified separately before being advertised as direct downloads.

### Local development

Requirements: Node.js and npm.

```bash
git clone https://github.com/HYNazism/HYN-Shahnameh.git
cd HYN-Shahnameh
npm install --legacy-peer-deps
npm run dev
```

Vite starts the development server on port `3000`. To type-check and build the web app:

```bash
npm run lint
npm run build
```

To create the configured local release archives:

```bash
npm run build:releases
```

This runs the packaging defined in `scripts/build-releases.js`; it does not by itself guarantee native installers for every operating system.

### Technologies and license

React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · Capacitor · Electron.

There is currently no `LICENSE` file in the repository, so no reuse or redistribution license has been declared. The project owner should add a license file to specify usage rights.
