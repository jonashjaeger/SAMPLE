# SAMPLE v1.0 — Biomolecular Archaeology Field Journal

An offline-first, mobile-friendly specimen and subsample manager for archaeological research. Runs as an installable PWA from any HTTPS static host, including GitHub Pages. No account, subscription, or remote database.

## Features

- Original **specimen records**: archaeological ID, site, context, collection/inventory, taxonomic identification, skeletal element/side, chronology, permission status, notes, and optional compressed photograph.
- Linked **analytical subsamples**: sample ID, parent specimen, method (ZooMS, aDNA, stable isotopes, proteomics, other), sampling date, removed mass in mg, material and sampling position, project/lab, operator, status, storage, results reference and notes.
- **Append-only custody-event interface**: record transfers, receipts, storage changes, processing, consumption and corrections. Events have date/time, from/to, operator and notes. Updates to storage are reflected in the sample record.
- **Printable QR labels** encode the *sample code*, not a cloud URL. They can be scanned with an appropriate QR reader; the resulting code can be looked up in SAMPLE. No camera-scanning function in v1.0. The embedded generator works offline.
- **Photos**: resize to JPEG max 1280px, stored in local IndexedDB, included in JSON backup.
- **Search** and filter sample status. Basic dashboard.
- **Portable data**: complete JSON backup and restore; separate specimens, samples, custody events CSV exports with stable relational IDs and UTF-8 BOM for spreadsheet compatibility.
- **Offline**: service worker caches app-shell files. The research database uses IndexedDB.
- **Update banner** for available service-worker versions.

## Install with GitHub Pages (iPhone-friendly)

1. Create a **Public** GitHub repository, e.g. `sample-journal`.
2. Extract ZIP. Upload **all files and the `assets` and `icons` folders** into the repo root. `index.html` must be at the root.
3. In repo Settings → Pages, choose *Deploy from a branch*, `main`, `/ (root)`.
4. Visit `https://USERNAME.github.io/sample-journal/` on your iPhone using Safari.
5. Share → Add to Home Screen. Open once while online; after the initial service-worker installation the app should work offline.

**Be careful:** Safari and the installed Home Screen web app can use separate storage. Creating records in one doesn't automatically put them in the other. Transfer data via a JSON backup if necessary.

## Data model

`specimens`: `id` (internal UUID), `code` (user ID), `site`, `context`, `collection`, `inventory`, `taxon`, `element`, `side`, `period`, `dating`, `permissionStatus`, `permissionRef`, `notes`, timestamps.

`samples`: `id` (internal UUID), `specimenId` (foreign key), `code`, `method`, `status`, `sampleDate`, `massMg`, `sampleMaterial`, `samplingLocation`, `operator`, `project`, `storage`, `resultRef`, `destructive`, `notes`, timestamps.

`events`: `id`, `sampleId` (foreign key), `type`, `at` (ISO UTC), `from`, `to`, `actor`, `notes`.

`photos`: `id`, `specimenId` (foreign key), `name`, `data` (data URL JPEG), `createdAt`.

JSON schema version `1` is embedded in complete backups. Sample IDs (`code`) and specimen IDs (`code`) must be unique *within their respective tables*. Relational foreign keys use stable `id` values, not codes. Photo bytes live in JSON backup; not CSV.

## Research integrity and limitations

- **Permissions:** status and reference are recorded, and warnings appear if destructive collection lacks a *Granted* status. This app does not verify legal permission. Researchers must obtain formal consent from the relevant collection authority before destructive sampling.
- **Custody tracking:** entries are append-only in the user interface, but not cryptographically secured. Backups and browser storage can be edited; this is **not a tamper-proof legal audit trail or an accredited LIMS**.
- **No lab integrations, cloud sync, multi-user collaboration, automatic DNA/ZooMS identifications, or clinical data security.**
- **No encrypted at-rest storage:** backups and photos can contain collection-sensitive information. Apply relevant museum, project and data-protection policies. Do not commit research data to a public GitHub repository.
- **Loss risk:** iOS can purge website data due to storage pressure or app removal. Export JSON backups regularly, especially before updates, and test a restore on a spare browser profile.
- **QR labels:** print layout approximately 60×34 mm; adjust printing scale and media in browser print settings. Scanner reads the sample code as text. QR does not create a server record or synchronise information.
- **No standards crosswalk yet:** v1.0 does not map fields automatically to CIDOC CRM, Darwin Core, or a specific institutional schema. Please evaluate before treating CSV as archival metadata.
- **Photo colour and EXIF:** resizing strips EXIF and may alter image colour precision. Keep original files separately if photograph is scientific evidence.

## Offline and upgrades

`sw.js` precaches static assets only and does not intercept any external research services. On a new release, change `CACHE` in `sw.js`, update version in `app.js`, refresh manifest if needed, and replace files. When the new worker installs, users may see an update banner; clicking Update reloads the app. The IndexedDB database persists across regular updates of the same origin and app profile.

## Testing checklist

- Add a specimen, with non-granted sampling permission.
- Add a planned subsample; verify code uniqueness and correct parent.
- Change a specimen's permission to Granted; mark sample Collected.
- Append an event for transfer to a new storage location; verify sample storage update.
- Print a QR label, scan it, search for that sample code.
- Add a specimen photograph; export JSON; restore it on a *different browser profile*; verify link and image.
- Export all three CSVs; check specimen `id` / sample `specimenId` and sample `id` / event `sampleId` relations.
- Load offline after one connected visit; check that new entries can be saved and exported without internet.

## License note

SAMPLE's original application code is provided as a starting point for personal and research use. The bundled QR code implementation has its own MIT copyright notice in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
