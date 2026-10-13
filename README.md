<p align="center">
  <img src="public/icon-512.png" alt="Westlake CS Club icon" width="128">
</p>

# Westlake CS Club

The Westlake High School Computer Science Club website, built with Preact and Vite.

## Development

```sh
npm install
npm run dev
```

The Vite server prints the local URL when it starts. Home (`/`), Events (`/events/`), and Practice (`/practice/`) share a persistent navigation header and switch through browser history without a full page reload. Each URL also works as a direct entry page. The design prototype gallery remains available at `/proto/hero-type-actions/` during development.

## Production build

```sh
npm run build
npm run test:build
npm run preview
```

The build writes the deployable static site to `dist/`, including rendered homepage, events, and practice archive HTML. The page's critical styles and UI fonts are included in the document so text can paint without extra font or stylesheet requests. Disabled stylesheet links let the route preloader recognize styles already applied. This increases HTML size; compare the complete first-load payload when measuring performance. The app loads directly to attach navigation and practice controls; the rendered content remains usable while its modules download. URL selections and saved scroll positions restore during hydration. Homepage animations load after rendering.

The shared page shell, navigation, and reporting live in `src/SiteApp.jsx`. Public archive rows are retained during initial hydration; filters and private progress render updated rows, while one delegated handler opens tests. The practice archive metadata is included in its HTML; individual tests and judge outputs still load on demand. Answers, timers, and drafts are restored from the visitor's browser after hydration. Event HTML reflects the schedule at build time, and the browser applies the current club date when JavaScript runs. Rebuild to refresh the HTML snapshot. Build-time rendering uses `preact-render-to-string`; it does not require a production application server. `npm run test:build` checks the generated pages and image paths after a build.

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

## Performance assets

The practice archive loads the question runner, diagrams, and workspace styles only when a test is selected. Questions and runner code download concurrently. Browser progress stays in the page controller, and exam ticks update the clock instead of the whole question view.

`assets/newsreader-display-latin.woff2` retains the original font's glyphs and the 400–500 weight range declared in `styles.css`. The full original font remains available. To regenerate the optimized fonts, install Python's `fonttools` and `brotli` in a development environment and run `python scripts/optimize-fonts.py`. These tools are not required for the website build.

Geist and Geist Mono also retain the 400–700 range used by interface text and bold question content. Every glyph stays available. Home and Events load their page-specific styles through their components; shared navigation, typography and event styles remain in `styles.css`. Route metadata is extracted from the entry HTML during the build, so the shared JavaScript does not include full HTML documents.
