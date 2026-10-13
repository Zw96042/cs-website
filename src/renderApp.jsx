import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import SiteApp from './SiteApp.jsx';

export function renderApp (initialPage, InitialComponent) {
  const root = document.getElementById('root');
  const prerendered = root.dataset.prerendered === 'true';
  const data = document.getElementById('site-data');
  const { manifest: initialManifest = null, builtAt: initialNow } = data ? JSON.parse(data.textContent) : {};
  const app = (
    <StrictMode>
      <SiteApp {...{ initialPage, InitialComponent, initialManifest, initialNow, prerendered }} />
    </StrictMode>
  );
  if (prerendered) hydrateRoot(root, app);
  else createRoot(root).render(app);
  queueMicrotask(() => { root.dataset.appHydrated = 'true'; });
}
