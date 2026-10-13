import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import { resolve } from 'node:path';
import { pageMetadataPlugin } from './scripts/page-metadata.js';

export default defineConfig(({ isSsrBuild }) => ({
  base: './',
  resolve: {
    alias: [
      { find: /^react\/jsx-runtime$/, replacement: 'preact/jsx-runtime' },
      { find: /^react\/jsx-dev-runtime$/, replacement: 'preact/jsx-dev-runtime' },
      { find: /^react-dom\/client$/, replacement: 'preact/compat/client' },
      { find: /^react-dom$/, replacement: 'preact/compat' },
      { find: /^react$/, replacement: 'preact/compat' }
    ]
  },
  ssr: { noExternal: true },
  plugins: [
    pageMetadataPlugin(),
    react({ jsxImportSource: 'preact' }),
    !isSsrBuild && legacy({
      targets: ['>0.3%', 'IE 11']
    })
  ],
  build: {
    rollupOptions: {
      output: {
        // Keep shared startup code together instead of making page code wait
        // behind extra downloads. Question workspaces stay lazy.
        codeSplitting: {
          groups: [{
            name: 'site',
            test: /(?:\/src\/renderApp\.jsx|\/src\/components\/EventItem\.jsx|\/styles\.css|vite\/modulepreload-polyfill\.js)$/
          }]
        }
      },
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        events: resolve(import.meta.dirname, 'events/index.html'),
        practice: resolve(import.meta.dirname, 'practice/index.html')
      }
    }
  }
}));
