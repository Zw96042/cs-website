import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';
import { extractPageMetadata } from './page-metadata.js';

const pages = [
  ['index.html', 'Find your place in', 'club-content'],
  ['events/index.html', 'Events.', 'events-content'],
  ['practice/index.html', 'library-heading', 'practice-content']
];

test('route metadata preserves titles and social tags without bundling entry documents', () => {
  for (const [file] of pages) {
    const source = readFileSync(file, 'utf8');
    const metadata = extractPageMetadata(source);
    const title = source.match(/<title>(.*?)<\/title>/)[0];
    assert.ok(metadata.includes(title));
    assert.match(metadata, /name="description"/);
    assert.match(metadata, /rel="canonical"/);
    assert.match(metadata, /property="og:title"/);
    assert.match(metadata, /name="twitter:image:alt"/);
    assert.doesNotMatch(metadata, /<!doctype|<script|stylesheet|preload|theme-color|name="robots"/);
  }
  assert.equal(extractPageMetadata('<title>A &amp; B</title><meta name="description" content="&quot;Quoted&quot;" />'),
    '<title>A &amp; B</title><meta name="description" content="&quot;Quoted&quot;" />');
  assert.throws(() => extractPageMetadata('<meta name="description" content="No title" />'), /missing a title/);
});

test('initial font faces embed the optimized assets without duplicate preloads', () => {
  const expected = ['geist-ui-latin', 'geist-mono-ui-latin', 'newsreader-display-latin']
    .map(name => readFileSync(`assets/${name}.woff2`));
  for (const [file] of pages) {
    const html = readFileSync(resolve('dist', file), 'utf8');
    const fonts = [...html.matchAll(/url\("data:font\/woff2;base64,([^"]+)"\)/g)]
      .map(([, base64]) => Buffer.from(base64, 'base64'));
    assert.equal(fonts.length, expected.length);
    for (const bytes of expected) assert.ok(fonts.some(font => font.equals(bytes)), 'Wrong font embedded');
    assert.doesNotMatch(html, /rel="preload"[^>]*href="[^"]+\.woff2"/);
  }
});

for (const [file, content, mainId] of pages) {
  test(`${file} has usable content before JavaScript runs`, () => {
    const html = readFileSync(resolve('dist', file), 'utf8');
    assert.ok(/id="root" data-prerendered="true"/.test(html), 'Missing prerendered root');
    assert.ok(html.includes(content));
    assert.ok(html.includes(`id="${mainId}"`));
    assert.match(html, /href="\/events\/"/);
    assert.doesNotMatch(html, /Loading (home|events|practice)…/);
    assert.match(html, /<style data-build-css=/);
    const startupScripts = [...html.matchAll(/<(?:script|link)[^>]*(?:src|href)="([^"]+\.js)"[^>]*>/g)]
      .filter(([tag]) => tag.includes('type="module"') || tag.includes('modulepreload'));
    // Leave room for both preloaded fonts within an HTTP/1.1 connection wave.
    assert.ok(startupScripts.length <= 4, 'Too many initial JavaScript downloads');
    for (const [link] of html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)) {
      assert.ok(link.includes('media="print"'), 'Initial stylesheet must not block paint');
      assert.ok(link.includes('disabled'), 'Inline styles must not be downloaded again at startup');
    }
    const css = [...html.matchAll(/<style data-build-css="[^"]+">(.*?)<\/style>/gs)].map(match => match[1]).join('');
    for (const [, src] of css.matchAll(/url\("([^"]+)"\)/g)) {
      if (/^(?:data:|https?:|\/|#)/.test(src)) continue;
      assert.ok(existsSync(resolve('dist', file, '..', src)), `Missing inline CSS asset: ${src}`);
    }
    for (const [, src] of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
      assert.ok(existsSync(resolve('dist', src.replace(/^\//, ''))), `Missing image: ${src}`);
    }
  });
}

test('practice bootstraps the archive without downloading every test', () => {
  const html = readFileSync('dist/practice/index.html', 'utf8');
  const data = html.match(/<script id="site-data" type="application\/json">(.*?)<\/script>/s);
  assert.ok(data, 'Missing practice bootstrap data');
  const { builtAt, manifest } = JSON.parse(data[1]);
  assert.ok(Number.isFinite(Date.parse(builtAt)), 'Missing hydration date snapshot');
  assert.ok(manifest.tests.length > 0);
  assert.ok(manifest.tests.every((entry) => entry.dataUrl && !entry.questions));
  assert.ok(html.includes(manifest.tests[0].title));
  assert.doesNotMatch(html, /<link[^>]+href="[^"]*PracticeWorkspace/);
  assert.doesNotMatch(html, /\.pr-editor\{|\.pr-dialog\{|\.pr-dg-fill/);
  const initialScripts = [...html.matchAll(/<(?:script|link)[^>]*(?:src|href)="([^"]+\.js)"[^>]*>/g)]
    .filter(([tag]) => tag.includes('type="module"') || tag.includes('modulepreload'));
  for (const [, src] of initialScripts) {
    const code = readFileSync(resolve('dist/practice', src), 'utf8');
    assert.ok(!code.includes('Start 45-minute exam'), 'Archive must not preload the question runner');
    assert.ok(!code.includes('Paste your program'), 'Archive must not preload the editor');
  }
});

test('event HTML uses the supplied hydration date across month boundaries', async () => {
  const { renderPage } = await import(pathToFileURL(resolve('work/prerender/prerender.js')));
  const september = renderPage('events', null, '2026-09-29T12:00:00Z');
  const november = renderPage('events', null, '2026-11-22T12:00:00Z');
  assert.ok(september.includes('id="september-events"'));
  assert.ok(!november.includes('id="october-events"'));
  assert.ok(november.includes('id="november-events"'));
  assert.ok(november.includes('An Afternoon with Neo Wang'));
  assert.ok(!november.includes('Quantum computing with HitoMatch'));
});
