# Five target checks — 13 November 2026

Every preset opens real images: a calibrated comparison or a single observation with its quality masks retained. M101 remains the default real-data demonstration. No movement is manufactured.

## Current coverage

IRSA released DR1 in November 2026. DR1 and QR3 supersede QR2 for new searches; legacy QR2 files remain downloadable through February 2027. All 20 current queries completed successfully. Counts below are overlapping files, not detections or distinct dates. Searches use proper-motion guide positions at 2026-07-01 and a 0.12° radius.

| Target | DR1 wide | DR1 deep | QR3 wide | QR3 deep | Viewer result |
|---|---:|---:|---:|---:|---|
| Barnard’s Star | 276 | 0 | 131 | 0 | Real QR3 D5 observation; flagged core masked. |
| Epsilon Indi B | 390 | 0 | 122 | 0 | Existing calibrated QR2 field comparisons; target detection unverified. |
| WISE 0855 | 305 | 0 | 0 | 0 | Existing calibrated QR2 field comparison; brown-dwarf detection unverified. |
| RW Aurigae | 269 | 0 | 153 | 0 | New DR1 D1 comparison: 3 September 2025 / 4 March 2026. |
| R Draconis | 470 | 1320 | 135 | 778 | Real DR1 D6 observation; flagged core masked. |

## Scientific checks

The three previously missing targets contributed 3,532 unique target/exposure records across all six detectors. Detector-specific CWAVE/CBAND maps and propagated guide positions yielded 3,011 usable interior headers; 521 footprints were too close to or outside the detector edge. No final header download or parse failures remained. Header compatibility is not a clean-pixel or detection guarantee.

The earlier D4 header screen used the wrong detector calibration; its negative conclusion is superseded. The screen now rejects detector mismatches. Every prepared full FITS also requires an exact calibration X/Y/VALUES lookup-table match.

DR1/QR3 uses named MSKN/MSKM flag definitions; QR2 uses MP_* definitions. The importer reads the actual header definitions. SOURCE and FULLSAMPLE are informational; every other bit and invalid IMAGE/VARIANCE sample is masked. No fixed bit position is assumed.

RW Aurigae passes the unchanged wavelength, bandwidth, common-mask and target-center gates. Opposite detector orientations require a narrower 2.46′ fixed field. Its 3.075″ display pixels oversample native 6.15″ sampling by two; they add no spatial resolution. Four independent compact-source fits give residual RMS 1.768″ and median vector offset 0.389″. The stricter subpixel-registration diagnostic on this oversampled grid does not pass. Quantitative subtraction, significant variability and PSF-matched photometry are not claimed.

Barnard’s Star and R Draconis have blooming/overflow/processing flags at the reviewed target cores. Deterministic samples of 30 observations per target, spanning all six detectors and available dates, yielded zero clean central pixels. Full-image attempts also failed the target-center gate. All 154 distinct Barnard exposures appearing in the 94 compatible header-pair candidates were subsequently inspected at native resolution; all had flagged central pixels. Twenty initial HTTP 503 responses succeeded on retry, leaving no unresolved requests in that inspection set. This is a documented review, not a claim that no future or unprocessed observation can ever work.

Single images were selected by the highest clean-field fraction among downloaded, reviewed observations, with recency breaking ties. Their central quality flags remain masked. Singles have a separate manifest and cannot be used as two-date comparisons. Pair acceptance criteria are unchanged.

## Evidence and limitations

`data/observations/coverage-2026-11-13/` contains exact queries, UTC retrieval times, raw VOTables, hashes, all-detector header results, native flag inspections and rejected preparations. Each displayed observation has pinned FITS/calibration hashes and a source configuration under `data/observations/<id>/`. Its independent numerical report is served at `public/observations/<id>/validation.json`.

SIMBAD reference astrometry remains unchanged. Proper motion is propagated from J2000 to each observation. Comparisons use one fixed sky field rather than following a predicted target. Annual parallax, perspective acceleration and binary orbits are not fitted. Guide positions are not verified detections.

## Official sources

- Current releases: https://caltech-ipac.github.io/spherex-archive-documentation/spherex-data-releases/
- SIA collections and QR2 retirement: https://caltech-ipac.github.io/spherex-archive-documentation/spherex-data-access/
- FITS, masks and calibration: https://caltech-ipac.github.io/spherex-archive-documentation/spherex-data-products/
- DR1 DOI and acknowledgement: https://irsa.ipac.caltech.edu/data/SPHEREx/docs/overview_dr1.html
- DR1 spectral images: https://doi.org/10.26131/IRSA678

See [SCIENTIFIC_VALIDATION.md](SCIENTIFIC_VALIDATION.md) for observation values and uncertainty limits.
