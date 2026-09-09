# Web Deployment Notes

## Recommended production path: GitHub Pages from main/(root)

This application is intentionally static. GitHub Pages can serve it directly without npm install, Gradle, Capacitor, or a Pages build action.

### One-time GitHub setup

1. Repository → Settings → Pages.
2. Source: **Deploy from a branch**.
3. Branch: **main**.
4. Folder: **/(root)**.
5. Save.

After GitHub publishes the site, open the generated HTTPS URL once while online. The service worker will cache the app shell. Subsequent launches can work offline, subject to browser storage/cache policies.

## Update workflow

For normal UI or logic updates:

1. Replace the changed files in the repository.
2. Commit/push to `main`.
3. GitHub Pages republishes automatically.
4. The service worker checks for an updated version on subsequent page loads.

If you modify cached file names or need to force all clients to refresh cached assets, increment `CACHE_NAME` in `sw.js`.

## Important limitation

GitHub Pages is static hosting. It does not create a central database. Participant and evaluator records are stored locally in each browser. A multi-location enterprise version will require an approved backend/data store and authentication layer; that is intentionally not included in this package.
