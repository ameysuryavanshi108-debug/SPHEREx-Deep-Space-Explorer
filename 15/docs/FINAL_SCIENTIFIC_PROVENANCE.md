# Scientific provenance — final implementation

Review: 14 November 2026. This record separates newly verified evidence from inherited prototype work.

## Preferred real two-date demonstration

Use **RW Aurigae field · DR1**. This is a visual comparison of authentic calibrated surface brightness around a catalog position, not a verified identification or a detection of motion/variability.

| Observation ID | UTC start | Detector | Center wavelength | Pipeline |
| --- | --- | --- | --- | --- |
| 2025W36_1A_0606_2 | 2025-09-03T17:24:32.428Z | D1 | 0.87854030 µm | 7.0.5 |
| 2026W10_1A_0445_2 | 2026-03-04T07:56:46.935Z | D1 | 0.87818975 µm | 7.0.5 |

Both original FITS files and the shared pinned `cal-swcs-v5-2026-191` D1 spectral calibration were freshly downloaded from the official IRSA AWS mirror. All three SHA-256 checksums match. Re-running `prepare_spherex_pair.py` reproduced both cached frame JSON files **byte for byte**. `validate_spherex_series.py` independently reproduced the numeric QA; see `FINAL_SCIENTIFIC_VALIDATION.json`.

- Common ICRS field: RA 76.956586393983°, Dec +30.401291786294°; 48 × 48 pixels, 3.075 arcsec/display pixel, north up/east left. Native sampling is approximately 6.15 arcsec; oversampling adds no resolution.
- 83.1163% common valid pixels after quality/variance and per-pixel spectral compatibility masks. All quality bits rejected except header-defined SOURCE and FULLSAMPLE. Unknown bits are rejected.
- CWAVE/CBAND calibrated wavelengths matched to the exposure lookup tables. Maximum retained wavelength mismatch 0.00504121 µm, constrained to at most one quarter of the narrower local bandwidth. Center mismatch 0.00035056 µm.
- Same archive MJy/sr display limits, 0.367363 to 29.142271, used for both dates. No independent image normalization, empirical flux correction or zodiacal-light subtraction.
- Bilinear reprojection uses full archive celestial TAN-SIP WCS. Four compact-source centroid diagnostics give residual RMS approximately 1.76776 arcsec; this does **not** certify subpixel quantitative registration.
- Variance is inspected and propagated only under diagonal native-noise assumptions. Output neighboring-pixel correlations are approximately 0.71. Native covariance and calibration covariance are unknown.
- The effective PSF differs between exposures and has not been matched; backgrounds also differ. Blink is suitable for qualified visual inspection, **not** quantitative difference imaging, significant variability, proper-motion measurement or a Planet X claim.

## Current official archive guidance

Official IRSA pages were fetched successfully during this session. DR1 was released in November 2026 and reprocesses QR2; IRSA states DR1 and QR3 spectral images form a uniformly processed set. Current spectral-image SIA2 collections are `spherex_dr1`, `spherex_dr1_deep`, `spherex_qr3`, `spherex_qr3_deep`. The DR1 all-sky cube is `spherex_dr1_cube`; a cube is not automatically a two-date comparison. QR2 is no longer returned by IRSA/VO searches, but direct downloads remain available through February 2027.

The DR1 SIA2 endpoint returned HTTP 200 with authentic VOTable rows for the RW Aurigae coordinates in this session. The QR3 wide collection also returned HTTP 200 with authentic VOTable rows on retry. Deep-collection requests returned HTTP 502 twice; no availability claim is made for those responses. The application keeps dated snapshots/offline data distinct from live results.

Official spectral-image MEFs have an empty primary HDU plus IMAGE, FLAGS, VARIANCE, ZODI, EPSF (DR1/QR3) and WCS-WAVE. IMAGE/FLAGS/VARIANCE/ZODI are 2040 × 2040 arrays. Freshly downloaded DR1 MEFs store FLAGS as a RICE_1 tile-compressed binary-table image (row tiles, BLOCKSIZE=32, BYTEPIX=4); Astropy transparently presents the decompressed image. This native structure was explicitly checked rather than inferred from filenames. WCS-WAVE is a binary-table approximation intended for visualization; science uses the separate CWAVE/CBAND calibration. The importer must not treat a detector label alone as evidence of matching spectral coverage.

The final browser reader supports the tested native RICE_1 FLAGS variant. Its 8,323,200 decompressed flag values across the two original files exactly match independent Astropy output. Both native originals are below the 64 MiB upload limit and successfully produced 2040 × 2040 parsed science images and 512 × 512 previews with quality masking. Raw SPHEREx files do not bundle the separate calibrated CWAVE/CBAND products or explicit release metadata, so they remain previews until these compatibility requirements are supplied. The small bundled adapter samples include this verified calibration and provenance and support blink. Other compressed science-image algorithms, cubes and unsupported projections fail closed with a clear limitation.

References:
- https://irsa.ipac.caltech.edu/data/SPHEREx/docs/overview_dr1.html
- https://irsa.ipac.caltech.edu/data/SPHEREx/docs/overview_qr.html
- https://irsa.ipac.caltech.edu/spherex-archive-documentation/spherex-data-products/
- https://irsa.ipac.caltech.edu/spherex-archive-documentation/spherex-data-access/

## Downloadable genuine FITS upload samples

`public/samples/rw-aurigae-A.fits` and `rw-aurigae-B.fits` are 109,440-byte **derived native-pixel cutouts**, not archive-issued MEFs. Each includes 36 × 36 IMAGE, FLAGS, VARIANCE and ZODI pixels copied exactly from the verified original, plus corresponding real calibrated CWAVE/CBAND arrays. Primary headers record the source URL/hash, calibration URL/hash, release origin and cutout origin. Full provenance is in `public/samples/provenance.json`.

`scripts/prepare_upload_samples.py` reproduces these samples and checks every copied array and WCS mapping. No synthetic image data are used. Native opposite orientations are retained so upload comparison exercises WCS registration. EPSF and the visualization-only WCS-WAVE table are omitted from these small adapter samples; this omission is disclosed.

## Complete active observation inventory

Exact original URLs, observation IDs, UTC dates, release, detector, processing versions, calibrated wavelength/bandwidth, source hashes and cache hashes are in `FINAL_SCIENTIFIC_PROVENANCE.json`. All 15 active cached frame arrays were checksum-verified this session; only the two RW Aurigae DR1 upstream originals and their calibration were freshly fetched and reprocessed. Other field provenance and prior numeric validation are inherited from the supplied source and are not represented as new current-session research. QR2 caches are historical real observations, explicitly distinct from current DR1/QR3 discovery collections.

| Field / selection | Release | Dates |
| --- | --- | --- |
| M101 central field · real SPHEREx / m101-2026-d2-cwave | SPHEREx Quick Release 2 (IRSA) | 2026-05-17, 2026-06-22 |
| Epsilon Indi B field · real SPHEREx / epsilon-indi-b-d2-2 | SPHEREx Quick Release 2 (IRSA) | 2025-04-26, 2025-06-06 |
| Epsilon Indi B field · real SPHEREx / epsilon-indi-b-d2-3 | SPHEREx Quick Release 2 (IRSA) | 2025-04-26, 2025-06-06 |
| Epsilon Indi B field · real SPHEREx / epsilon-indi-b-three-dates | SPHEREx Quick Release 2 (IRSA) | 2025-04-26, 2025-06-06, 2025-10-02 |
| WISE 0855 field · real SPHEREx / wise-0855-d2-1 | SPHEREx Quick Release 2 (IRSA) | 2025-11-07, 2025-12-13 |
| RW Aurigae field · real SPHEREx / rw-aurigae-dr1-d1-1 | SPHEREx Data Release 1 (IRSA) | 2025-09-03, 2026-03-04 |
| Barnard’s Star · real observation / barnards-star-qr3-d5-single-2026w34-1a-0363-1 | SPHEREx Quick Release 3 (IRSA) | 2026-08-18 |
| R Draconis · real observation / r-draconis-dr1-d6-single-2026w18-2a-0497-1 | SPHEREx Data Release 1 (IRSA) | 2026-05-02 |

## Credits and interpretation

SPHEREx / NASA / JPL-Caltech; served by Caltech/IPAC IRSA. DR1 spectral images DOI: https://doi.org/10.26131/IRSA678; QR3: https://doi.org/10.26131/IRSA662; archived QR2: https://doi.org/10.26131/IRSA652.

> This publication makes use of data products from the Spectro-Photometer for the History of the Universe, Epoch of Reionization and Ices Explorer (SPHEREx), which is a joint project of the Jet Propulsion Laboratory and the California Institute of Technology, and is funded by the National Aeronautics and Space Administration.

SIMBAD guide positions and AllWISE catalog overlays remain reference catalogs, not confirmed SPHEREx detections. The 3D map represents celestial directions rather than verified physical distances. Modeled workbook objects and decorative generated cosmic artwork are not authentic SPHEREx observations. No NASA endorsement is implied.

## Reproduction commands

From the editable source root, install `requirements-observations.txt` in a Python virtual environment. Then:

```sh
python scripts/prepare_spherex_pair.py public/observations/rw-aurigae-dr1-d1-1/source-config.json --output work/reproduction/rw-aurigae-dr1-d1-1
python scripts/validate_spherex_series.py public/observations/rw-aurigae-dr1-d1-1/source-config.json --prepared work/reproduction/rw-aurigae-dr1-d1-1 --output work/reproduction/validation.json
python scripts/prepare_upload_samples.py --cache work/reproduction/.fits-cache
npm test
```

The data pipeline downloads approximately 164 MB of pinned FITS products; the browser application uses small packaged derived arrays and samples. Use a new output directory for each reprojection: the pipeline intentionally refuses to overwrite an existing prepared dataset.
