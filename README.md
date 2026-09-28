<p align="center">
  <img src="public/icon-512.png" alt="Westlake CS Club icon" width="128">
</p>

# Westlake CS Club

The Westlake High School Computer Science Club website, built with React and Vite.

## Development

```sh
npm install
npm run dev
```

The Vite server prints the local URL when it starts. The production homepage is at `/`; the design prototype gallery remains available at `/proto/hero-type-actions/` during development.

## Production build

```sh
npm run build
npm run preview
```

Vite writes the deployable site to `dist/`.

## UIL practice

`/practice/` provides written practice with answer checks, a 45-minute exam, scoring (+6 correct, −2 incorrect, 0 blank), review and retry. Programming practice has native statements and examples, a Java draft editor, source downloads, and comparison with supplied judge output. Java programs run on your own machine. Answers and Java drafts stay in this browser; no accounts, notes, or practiced flags are stored.

Original packets remain downloadable. Questions, code, formulas, and answer choices render as selectable text. Graphs and trees use native SVG paths and labels; other source artwork remains localized to its illustration. Missing judge files or statements are labeled. Large judge outputs load when requested, and comparisons use the complete file.

Run `npm test` for event behavior, grading, storage, timers, output comparison and imported asset/content checks. Import scripts in `scripts/` require Python with PyMuPDF, Pillow, and FontTools; legacy Word conversion uses the configured bundled LibreOffice runtime. The supplied archives are inputs only, and none of their source programs are executed. Import modern packets first, then older written/programming packets, and merge their metadata with the archive manifest.

```sh
python3 scripts/import-uil.py /path/to/UIL-20260928T174754Z-1-001.zip
UIL_DOWNLOADS=/path/to/archives UIL_SOFFICE=/path/to/soffice python3 scripts/import-legacy-written.py
UIL_DOWNLOADS=/path/to/archives UIL_SOFFICE=/path/to/soffice python3 scripts/import-legacy-programming.py
python3 scripts/merge-practice-data.py
```

The legacy importers default to `~/Downloads` and the bundled Codex LibreOffice runtime. Generated native content and original downloads live in `public/practice-data/`; importer working files stay in `work/`.
