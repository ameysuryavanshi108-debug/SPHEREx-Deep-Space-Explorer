# Global judging catalog and observatory UI — release 2.3.2

## Added

- A 50-row AllWISE Source Catalog reference subset at `data/spherex_50_candidates.json`.
- Explicit per-row origin labels and retained catalog designation, ICRS coordinates, W1/W2 magnitudes, uncertainties where available, W1−W2 color and quality flags.
- Homepage “Explore the Observatory” cards for the 3D Celestial Map and Candidate Explorer, with representative image captions.
- Four live telemetry cards derived from the loaded JSON and observation manifest.
- A searchable 50-row Candidate Explorer with local RA/Dec position plot and source details.
- A separate AllWISE reference layer on the Celestial Map page and a selected-catalog-context panel in the Blink Comparator.

## Verified data counts

| Metric | Count | Meaning |
|---|---:|---|
| Candidate objects | 50 | AllWISE catalog reference rows |
| Epoch pairs | 6 | Prepared SPHEREx comparison pairs in observations/manifest.json |
| Object categories | 1 | AllWISE catalog reference class |
| Catalog wavelengths | 2 | W1 3.4 µm and W2 4.6 µm |

## Provenance and limits

The 50 entries were selected from the repository's archived IRSA AllWISE query snapshot (263 rows retrieved 2026-11-10). The color filter is W1−W2 ≥ 0.5 mag; 72 snapshot rows met it, and the first 50 designations in ascending order were retained. This is a visualization subset, not a validated “cold source” classification. The AllWISE W1/W2 bands are not SPHEREx's 102 spectral channels.

Catalog references are displayed separately from SPHEREx observation fields. The comparator does not claim an AllWISE object is the source in either SPHEREx image. No motion measurement, Planet X detection, or automatic source association is claimed. The existing scientific disclaimer in the main application remains unchanged.

## Deployment

This repository contains the static public export under `15/`. Netlify should publish that directory with no build command. The deploy guide is `DEPLOY_README.txt`. The repository update itself does not trigger or verify a Netlify production deployment; confirm the Netlify deploy status and test the live routes after deployment.
