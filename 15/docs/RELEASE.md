# Release 2.2.1 — Validated targets and reliable archive search

Continues the approved 2.2.0 design with targeted scientific-data and archive fixes.

- RW Aurigae now has a calibrated DR1 two-date field comparison, with unchanged pair-quality gates and explicit registration limits.
- Barnard’s Star and R Draconis open actual quality-masked observations. No second date or target measurement is invented.
- Epsilon Indi B, WISE 0855 and the default M101 comparison remain available. Every target card now opens its own real imagery.
- Archive search uses current DR1/QR3 releases, diagnoses retired QR2 and missing proxies, retries temporary failures, handles SIA overflow through date windows and preserves partial results.
- Twenty checksum-verified preset snapshots show their original retrieval dates during live checks or archive outages.
- Existing homepage, map, modeled catalog, image mappings, favorites, comparison controls and routes are retained.

The Complete Source and Owner Netlify archives contain the existing full owner experience. The public-export script remains available for producing the edition without workbook-derived records whose redistribution terms are undocumented.

`BUILD_SOURCE.json`, `SOURCE_FILES.sha256` and `build-info.json` identify source and assets. See `FINAL_VERIFICATION.md`, `FIVE_TARGETS.md` and `ARCHIVE_RELIABILITY.md` for actual verification and limits. Netlify production publication requires reconnecting its account and verifying the deployment proxy there.
