SPHEREx Explorer — live SPLICES catalog integration

This is the static public deployment. The Netlify publish directory is this folder (15/); the Candidate Explorer retrieves its catalog sample from NASA/IPAC IRSA through the existing same-origin TAP proxy route.

Catalog integration:
- The Candidate Explorer queries the public IRSA TAP table "splices".
- It requests 50 SPLICES target-list records with coordinates, 2MASS J/H/K photometry, WISE W1-W4 photometry, selection type and catalog classifications.
- The query is made at page load; the site does not bundle a stale AllWISE-only JSON candidate file.
- If IRSA TAP is unavailable, the UI reports the error and provides a retry instead of substituting unrelated records.

The SPLICES catalog is a target list based on broadband catalog photometry. Entries are not automatically confirmed SPHEREx detections, and WISE/2MASS magnitudes are not SPHEREx spectral measurements. The map layer is a separate coordinate-reference layer; the comparator does not claim a catalog target is matched to the displayed image.

For a manual Netlify deploy, upload this folder with index.html at its root. If deploying from Git, set the base/publish directory to 15 and leave the build command empty for this static export. Existing SPA redirects and IRSA proxy redirects in netlify.toml are retained.

Catalog source and citation:
https://irsa.ipac.caltech.edu/data/SPHEREx/SPLICES/index.html
https://doi.org/10.26131/IRSA554
