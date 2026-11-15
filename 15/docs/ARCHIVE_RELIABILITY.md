# Archive search reliability — 13 November 2026

The previous client aborted after 30 seconds. Earlier inspection of the newer Netlify deployment observed a successful response taking approximately 32 seconds. Today's direct IRSA DR1 query returned a valid VOTable in 27.451 seconds. Network timing varies; neither number guarantees future availability.

## Release migration

IRSA's documentation updated 12 November lists `spherex_dr1`, `spherex_dr1_deep`, `spherex_qr3` and `spherex_qr3_deep` as the current spectral-image search collections. QR2 is no longer searchable; its existing downloaded, validated comparisons remain available. Legacy QR2 query URLs now explain the migration instead of silently using a different release or interpreting a failed query as missing data.

## Changes

- Same-origin SIA and TAP routes retain their position before the SPA catch-all in both Netlify configuration and the downloadable `_redirects` file. This avoids depending on IRSA's inconsistent browser CORS headers.
- Each request permits 45 seconds for connection and response transfer. Network failures, timeouts, HTTP 408/425/429/5xx receive at most 2 retries with backoff; Retry-After is respected up to 10 seconds. Cancellation interrupts both fetch and backoff. New pages stop once the overall search budget has elapsed.
- HTML returned from an API route is diagnosed as a missing proxy, including HTTP 200 SPA fallbacks. It is never parsed as an empty catalog.
- SIA overflow is resolved through inclusive `TIME` intervals; boundary files are deduplicated by exact source URL. Failed/capped pagination keeps actual returned rows and explicitly reports incompleteness. SIA has no documented OFFSET parameter.
- TAP fallback is explicitly center-only; it does not masquerade as a radius or wide/deep search. Release filtering happens in ADQL before TOP 2001. Deep queries never fall back to a differently scoped wide-survey query.
- Twenty successful current-release query snapshots (five presets × four collections), exact query coordinates, query URLs, timestamps, raw VOTables and SHA-256 hashes are saved. The UI can display these while checking live coverage or after an outage. Saved results retain their original date, are not labeled live, and are never substituted for a different coordinate/radius/release.
- Successful live queries cache for 15 minutes. Partial results are not cached as complete. Each response has a 20 MB limit.

## Evidence and limits

`data/observations/coverage-2026-11-13/coverage-report.json` and raw VOTables preserve the 20 successful checks. `scripts/build_archive_cache.py` verifies those hashes and counts before producing browser fallbacks. Asset hashes and exact preset mapping are checked by automated tests.

`docs/science-evidence/archive-proxy-check-2026-11-13.json` records the latest network diagnostic. The Netlify address observed in the prior recording returned 404 today; the directly queried IRSA endpoint returned valid data. These are service checks, not evidence of a deployed fix. The Netlify connection requires reauthentication before an updated deployment can be verified there.

Netlify documents a 26-second upstream proxy limit. The longer client limit allows additional connection/transfer overhead, but cannot override a hosting or IRSA server limit. Retries and dated results preserve a useful fallback; an arbitrary uncached coordinate still depends on the live archive. The static chatgpt.site review host does not implement Netlify redirect proxies; it can show the bundled preset snapshots and original archive links.

Sources:

- https://caltech-ipac.github.io/spherex-archive-documentation/spherex-data-access/
- https://irsa.ipac.caltech.edu/ibe/sia.html
- https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/
