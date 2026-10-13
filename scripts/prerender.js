import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';
import { inlineStyles } from './inline-styles.js';

// Bundle the same components for build-time rendering; no production server is needed.
await build({
  base: '/',
  build: {
    ssr: 'src/prerender.jsx',
    outDir: 'work/prerender',
    copyPublicDir: false,
    ssrEmitAssets: true,
    rollupOptions: { input: 'src/prerender.jsx' }
  }
});
const { renderPage } = await import(pathToFileURL(resolve('work/prerender/prerender.js')));
const manifest = JSON.parse(await readFile('public/practice-data/manifest.json', 'utf8'));
const pages = { home: 'index.html', events: 'events/index.html', practice: 'practice/index.html' };
const builtAt = new Date().toISOString();

for (const [page, file] of Object.entries(pages)) {
  const path = resolve('dist', file);
  const html = await inlineStyles(await readFile(path, 'utf8'), file);
  const data = page === 'practice' ? manifest : null;
  // Escape < so source text cannot terminate the inert JSON script element.
  const bootstrap = `<script id="site-data" type="application/json">${JSON.stringify({ builtAt, manifest: data }).replace(/</g, '\\u003c')}</script>`;
  const root = '<div id="root"></div>';
  if (!html.includes(root)) throw new Error(`Missing app root in ${file}`);
  await writeFile(path, html.replace(root, () => `<div id="root" data-prerendered="true">${renderPage(page, data, builtAt)}</div>${bootstrap}`));
  console.log(`Prerendered ${file}`);
}
