# FieldReady Competency Study — Web/PWA v0.1.2

This repository is the browser/PWA companion to the Android FieldReady Competency Study baseline. It is a **static web application** designed to be hosted directly from GitHub Pages. No server, database, Node runtime, or build step is required for the deployed site.

## Clinical content baseline

This web version uses the same protected `tiers.js` assessment data as the v0.1.2 Android-source package, including the restored CMC Tactical Trauma Assessment with CUF, TFC, MARCH-PAWS, communication, documentation, and evacuation content, plus the selected TQ, NPA, NDC, and blood skill assessments.

Do not casually edit `tiers.js`. `npm run verify` protects the study configuration and should be run after clinical-content changes.

## What is different from Android

- Runs in Chrome, Edge, Safari, Firefox, and other modern browsers.
- Can be installed as a Progressive Web App (PWA) on supported devices.
- Caches the application shell for offline use after the first successful load.
- Exports PDF/CSV/JSON through normal browser downloads.
- Stores working records in **browser-local storage**. There is no central synchronization in this version.
- Each browser/device therefore has an independent local dataset.

## Publish with GitHub Pages — recommended method

1. Create a new GitHub repository, for example `FieldReady-Competency-Web`.
2. Upload **all files and folders in this ZIP to the repository root**.
3. Commit them to the `main` branch.
4. In GitHub open **Settings → Pages**.
5. Under **Build and deployment**, select **Deploy from a branch**.
6. Choose branch **main** and folder **/(root)**, then Save.
7. GitHub will provide the Pages address after deployment completes.

This branch-based method intentionally does **not** use `actions/configure-pages`, so the site does not depend on the Pages Actions configuration that can fail when Pages has not been enabled first.

## GitHub Actions

The included `.github/workflows/validate.yml` workflow only validates the protected assessment configuration and web package. It does not deploy the site. Deployment is handled by GitHub Pages directly from `main/(root)`.

## Local testing

Do not double-click `index.html` for final PWA testing because service workers require HTTP(S). From the repository directory you can use any local static server, for example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Data handling

This release is local-only. Do not enter CUI, PHI, classified information, patient identifiers, SSNs, DoD ID numbers, or other protected information unless the application and hosting environment are specifically approved for that data. Export and back up completed study data according to the approved study/organizational process.

## Files to know

- `index.html` — application UI
- `app.js` — evaluator workflow, records, exports, analytics
- `tiers.js` — protected assessment content
- `installations.js` — MAJCOM/installation selector data
- `styles.css` — visual design
- `branding.js` — ownership/branding text
- `web-platform.js` — PWA install + connectivity behavior
- `sw.js` — offline cache/service worker
- `manifest.webmanifest` — installable web-app metadata
- `assets/` — app icons and AE/CCATT visuals
- `scripts/verify-study-config.js` — clinical/study-content validation
- `scripts/verify-web-package.js` — static web package validation
