# Global judging catalog and observatory UI — SPLICES update

## Catalog integration

The Candidate Explorer now retrieves a reproducible 50-row sample directly from the NASA/IPAC IRSA **SPHEREx List of Ice Sources (SPLICES)** catalog using IRSA's TAP service and the public table `splices`.

The query selects:
- SPLICES source ID and designation
- J2000 right ascension and declination
- 2MASS J/H/K photometry
- WISE W1–W4 photometry and reported uncertainties
- Selection type, catalog class, machine-learning class and proper name

The sample is ordered by `source_id` and limited to 50 rows. It is not a static AllWISE-only snapshot. The source query is executed at page load through the existing same-origin Netlify proxy route `/archive/irsa/TAP/sync`.

## UI integration

- Homepage observatory cards and telemetry now describe the SPLICES target-list sample.
- Candidate Explorer displays the 50 returned SPLICES entries, coordinates, ancillary photometry and catalog classifications.
- Sky-map page shows a separately labeled SPLICES coordinate-reference layer.
- Blink Comparator can show the selected SPLICES record as context, while explicitly stating that it is not an image match.
- Existing prepared SPHEREx observation pairs and the scientific disclaimer remain unchanged.
- If the archive query fails, the interface reports the error and offers a retry; it does not fall back to fabricated or unrelated records.

## Scientific scope

SPLICES is a target list of nearly ten million spatially isolated, infrared-bright sources likely to exhibit ice absorption features when observed by SPHEREx. It is based on broadband catalog photometry; its 2MASS and WISE magnitudes are ancillary catalog measurements, not SPHEREx spectral measurements. A SPLICES entry is not automatically a confirmed SPHEREx detection, a measured moving object, or a Planet X candidate. The map layer does not establish that a listed target appears in a displayed SPHEREx image.

Sources:
- [NASA/IPAC IRSA SPLICES catalog](https://irsa.ipac.caltech.edu/data/SPHEREx/SPLICES/index.html)
- [SPLICES column descriptions](https://irsa.ipac.caltech.edu/data/SPHEREx/SPLICES/gator_docs/splices_colDescriptions.html)
- [SPLICES dataset DOI](https://doi.org/10.26131/IRSA554)
- [IRSA TAP documentation](https://irsa.ipac.caltech.edu/docs/program_interface/api_catalogs.html)
