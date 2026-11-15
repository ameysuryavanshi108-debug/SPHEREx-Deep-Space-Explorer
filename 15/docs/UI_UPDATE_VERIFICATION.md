# UI update verification — 2.3.1

**Passed:** owner source **109/109** Node tests; public export **46/46**; both production builds, including observation validation, TypeScript and Vite. A focused 18-test run also passed, including the new genuine-field registry/filter/link checks and frame-by-frame autofocus framing regression. Python was not rerun for this UI-only update; its previous results remain historical.

Actual Chromium workflows were tested against the editable app on port 5173 and the **exact compiled public deployment on port 4173**. Normal runs reported no page exceptions, shader compilation errors or console errors. Earlier packages were preserved; no live site was overwritten.

## Actual browser checks passed

- **Home:** faint line below the hero removed; visible brand exactly “⭐ Interstellar Consortium”; rotating purple/blue sphere retained. Home and map expose the same six genuine field IDs and marker colors, with no 1,050-point decorative replacement.
- **Map:** three desktop columns, working field-name search, release/pair/grid filters, empty state, reset and compact icon controls. Rendered marker counts follow the actual filters. Release checkboxes have explicit accessible names.
- **Inspector:** real dates, coordinates, wavelength and detector; no placeholder confidence, flux or distance. The RW Aurigae preview’s rendered pixel hash matches the expected rendering of the authentic packaged image.
- **Selection and framing:** list selection, re-selection, actual 3D pointer click, 2D marker, direct field/target URLs, main navigation and repeated Home/sphere entry select and face the correct field. Camera snapshots and projected bounds confirm the globe fits the stage after automatic focus. Automated checks also cover close/panned views, nearly opposite directions and reduced motion. Manual zoom can intentionally crop the view.
- **Comparator:** Scientific Details precedes Archive. Prepared-name search opens the genuine M101 pair and Barnard single observation; unknown names show a message without archive requests or fabricated results. R Draconis opens its exact real single image without an invented second date or Play control.
- **Scientific regression:** genuine cached RW Aurigae dates, blink/pause, A/B, synchronized zoom/pan, brightness/contrast and reset passed. Genuine FITS A/B uploads, metadata, preview, WCS alignment, blink, adjustments and drag-and-drop passed. Incompatible wavelengths retain both previews and disable blink; corrupt input is rejected. No observation upload/network transfer occurs.
- **Responsive:** desktop at 1440 px, tablet at 1024 px and mobile at 390 px; no horizontal overflow on Home/map/comparator. Mobile field selection, navigation and uploaded previews work.

## Evidence and limits

`docs/ui-verification-evidence/verification-results.json` records the passed source and compiled-public checks. Selected desktop/mobile and before/after screenshots are included alongside it. Narrow reruns corrected test-harness selectors to human-readable marker labels and waited for the new React view after URL changes; these are not outstanding application issues.

The prior deployment was inspected read-only on port 4180. Its screenshot confirms the faint, partially obscured line and earlier decorative sphere. The large recordings were **not watched** because they exceed the attachment transfer limit.

Rendering pauses offscreen. Mobile selection was checked after bringing the sphere into view; pending automatic focus completes without pressing Focus. Checks cover this Chromium environment, not cross-browser or screen-reader certification.

Markers are prepared **image-field directions**, not claimed source detections or physical distances. Historical QR2 fields remain labeled historical cached observations. Scientific data and processing were retained; this update adds no detection, motion measurement or calibration claim. The earlier 2.3.0 verification report remains historical; this report supersedes its UI descriptions.
