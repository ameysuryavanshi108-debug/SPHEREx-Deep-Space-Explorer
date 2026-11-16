# Current data provenance

The authoritative record for the SPHEREx observation implementation is [FINAL_SCIENTIFIC_PROVENANCE.md](FINAL_SCIENTIFIC_PROVENANCE.md), with exact observation URLs, IDs, dates, releases, hashes and limitations in [FINAL_SCIENTIFIC_PROVENANCE.json](FINAL_SCIENTIFIC_PROVENANCE.json). Reproduced DR1 image QA is recorded in [FINAL_SCIENTIFIC_VALIDATION.json](FINAL_SCIENTIFIC_VALIDATION.json).

The preferred current-release offline demonstration is the RW Aurigae DR1 field observed on 3 September 2025 and 4 March 2026. Both source FITS files and their spectral calibration were downloaded and checksum-verified during the implementation. This supports qualified visual inspection only, with no motion, variability or Planet X detection claim.

## Global judging catalog layer — SPLICES

The Candidate Explorer now queries the NASA/IPAC IRSA **SPHEREx List of Ice Sources (SPLICES)** catalog live through IRSA's Table Access Protocol (TAP). It requests 50 records from the public table named `splices`, selecting source ID, designation, J2000 coordinates, 2MASS J/H/K magnitudes, WISE W1–W4 magnitudes and uncertainties, selection type, catalog class, machine-learning class and proper name.

The current query is:

```sql
SELECT TOP 50 source_id, designation, ra, dec,
       J, H, K, W1, W1err, W2, W2err, W3, W3err, W4, W4err,
       SEL_TYPE, CLASS_1, STYPE_ML, NAME
FROM splices
WHERE ra IS NOT NULL AND dec IS NOT NULL
  AND W1 IS NOT NULL AND W2 IS NOT NULL
ORDER BY source_id
```

The 50 rows are a reproducible sample of the SPLICES target catalog, not a newly extracted list of detections from SPHEREx DR1 images. SPLICES is a compilation of nearly ten million spatially isolated, infrared-bright point sources selected from broadband catalog photometry and intended as a target list for SPHEREx ice-feature observations. Its source coordinates are J2000; J/H/K are 2MASS photometry and W1–W4 are WISE photometry. These magnitudes are not SPHEREx's 102 spectral channels, and an entry is not proof that the source was observed in a particular displayed SPHEREx field.

The public UI displays the SPLICES positions in a separate coordinate-reference layer on the sky-map page and gives the selected catalog entry as context in the Blink Comparator. The comparator explicitly states that this is **not an image match**: no positional cross-match between a SPLICES target and the displayed SPHEREx pixels is asserted. Existing prepared SPHEREx observation pairs remain independently selected and unchanged.

If IRSA TAP is temporarily unavailable, the UI reports the connection error and provides a retry and a link to the archive. It does not substitute unrelated or fabricated rows.

Please cite both the SPLICES paper (Ashby et al. 2023) and dataset DOI when reusing SPLICES data:
- Dataset: https://doi.org/10.26131/IRSA554
- Catalog overview: https://irsa.ipac.caltech.edu/data/SPHEREx/SPLICES/index.html
- Column descriptions: https://irsa.ipac.caltech.edu/data/SPHEREx/SPLICES/gator_docs/splices_colDescriptions.html
- TAP endpoint: https://irsa.ipac.caltech.edu/TAP

The existing scientific disclaimer remains: this is an exploratory multi-epoch visualization tool, not a confirmed Planet X detection.
