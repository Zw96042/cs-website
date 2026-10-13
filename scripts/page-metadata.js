import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Route changes only need these head tags, not the full entry documents, fonts,
// scripts or stylesheet links. Keep the HTML templates as the source of truth.
export function extractPageMetadata (html) {
  const title = html.match(/<title\b[^>]*>[\s\S]*?<\/title>/i)?.[0];
  if (!title) throw new Error('Page is missing a title');
  const tags = [...html.matchAll(/<(?:meta|link)\b[^>]*>/gi)]
    .map(([tag]) => tag)
    .filter(tag => /\b(?:name="(?:description|twitter:[^"]+)"|property="og:[^"]+"|rel="canonical")/.test(tag));
  return [title, ...tags].join('');
}

export function pageMetadataPlugin () {
  const moduleId = 'virtual:page-metadata';
  const resolvedId = `\0${moduleId}`;
  return {
    name: 'page-metadata',
    resolveId: id => id === moduleId ? resolvedId : undefined,
    async load (id) {
      if (id !== resolvedId) return;
      const root = resolve(import.meta.dirname, '..');
      const pages = { home: 'index.html', events: 'events/index.html', practice: 'practice/index.html' };
      const entries = await Promise.all(Object.entries(pages).map(async ([page, file]) => {
        const path = resolve(root, file);
        this.addWatchFile(path);
        return [page, extractPageMetadata(await readFile(path, 'utf8'))];
      }));
      return `export default ${JSON.stringify(Object.fromEntries(entries))};`;
    }
  };
}
