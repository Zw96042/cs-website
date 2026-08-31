import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',
  plugins: [react(),
    legacy({
      targets: ['>0.3%', 'IE 11']
    })
  ],
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        events: resolve(import.meta.dirname, 'events/index.html')
      }
    }
  }
});
