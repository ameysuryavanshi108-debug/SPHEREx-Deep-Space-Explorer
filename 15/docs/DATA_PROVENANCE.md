# Current data provenance

The authoritative record for this final implementation is [FINAL_SCIENTIFIC_PROVENANCE.md](FINAL_SCIENTIFIC_PROVENANCE.md), with exact observation URLs, IDs, dates, releases, hashes and limitations in [FINAL_SCIENTIFIC_PROVENANCE.json](FINAL_SCIENTIFIC_PROVENANCE.json). Newly reproduced DR1 image QA is recorded in [FINAL_SCIENTIFIC_VALIDATION.json](FINAL_SCIENTIFIC_VALIDATION.json).

The preferred current-release offline demonstration is the RW Aurigae DR1 field observed on 3 September 2025 and 4 March 2026. Both source FITS files and their spectral calibration were freshly downloaded and checksum-verified during this implementation; cached frame arrays were reproduced byte for byte. This supports qualified visual inspection only, with no motion, variability or Planet X detection claim.

The two small native-pixel upload samples under `public/samples/` include explicit derived-cutout provenance. No synthetic observation pixels are used. Historical QR2 caches are distinct from current DR1/QR3 archive collections. Modeled catalog rows, SIMBAD/AllWISE reference positions and decorative artwork are not confirmed SPHEREx detections.

The supplied older provenance report is preserved in [history/DATA_PROVENANCE_2_1.md](history/DATA_PROVENANCE_2_1.md) as development history. Its release/status statements describe that earlier version, not the final implementation. Original code licensing does not relicense datasets or third-party media.

SPHEREx / NASA / JPL-Caltech; served by Caltech/IPAC IRSA. DR1 spectral-image DOI: https://doi.org/10.26131/IRSA678. Relevant media credits and reuse conditions remain in [REFINED_ASSETS.md](REFINED_ASSETS.md); software notices remain in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).


## Global judging catalog layer (2.3.2)

`../data/spherex_50_candidates.json` contains 50 rows selected from the repository's archived NASA/IPAC IRSA AllWISE Source Catalog snapshot (`allwise_p3as_psd`) for the Epsilon Indi B reference field. The source snapshot was retrieved 2026-11-10 and contained 263 rows; 72 rows met the display-selection criterion W1−W2 ≥ 0.5 mag. The 50 rows in the new file are the first 50 qualifying designations in ascending designation order. This is a reproducible color-selected AllWISE reference subset, not a scientifically confirmed class of cold objects, not a SPHEREx detection catalog, and not a Planet X candidate list.

Each row preserves the AllWISE designation, ICRS RA/Dec, W1/W2 magnitudes and reported errors, W1−W2 color, photometric quality flag, catalog/table identity, and explicit `NASA/IPAC IRSA AllWISE Point Source` origin label. The source query URL, source snapshot timestamp and SHA-256, selection count, selection criterion, and limitations are stored at the dataset top level. The W1 and W2 catalog bands are 3.4 and 4.6 µm; they are not SPHEREx's 102 spectral channels.

The public UI displays the 50 references in a separate equirectangular coordinate layer alongside the 3D SPHEREx observation-field map. Selecting a reference opens its catalog metadata and provides a link to the Blink Comparator. The comparator context explicitly says it is **not an image match**: no positional cross-match between the AllWISE point source and the displayed SPHEREx pixels is asserted. Existing SPHEREx observation pairs remain independently selected and unchanged.

The homepage telemetry is computed from the loaded dataset and observation manifest: 50 catalog rows, 6 prepared comparison pairs, 1 catalog category, and 2 AllWISE catalog bands. These are interface counts, not detection counts or evidence of Planet X.
