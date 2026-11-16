SPHEREx 2.3.2 — Global Judging catalog and observatory UI

This is the static public deployment. The Netlify publish directory is this folder (15/); no backend, serverless function, API key or database is required for the packaged public experience.

New public assets in this release:
- data/spherex_50_candidates.json — 50 provenance-tagged AllWISE catalog reference rows.
- assets/global-judging-enhancements.js — homepage observatory cards, telemetry, catalog explorer, map reference layer and comparator context.
- assets/index-BXmFav6o.css — appended styles for the new UI.

For a manual Netlify deploy, upload this folder with index.html at its root. If deploying from Git, set the base/publish directory to 15 and leave the build command empty for this static export. Existing SPA redirects and IRSA proxy redirects are retained in netlify.toml and _redirects.

Important scientific scope: AllWISE rows are catalog references, not SPHEREx detections or confirmed Planet X candidates. The map displays them as a separate coordinate reference layer. The comparator explicitly does not assert that an AllWISE row matches an image source. See docs/DATA_PROVENANCE.md and docs/GLOBAL_JUDGING_CATALOG.md.

No Netlify production deployment was triggered from this repository update. Verify the Netlify deploy preview/production URL after uploading or after the connected Git deployment completes.
