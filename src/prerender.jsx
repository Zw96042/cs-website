import { StrictMode } from 'react';
import { renderToString } from 'preact-render-to-string';
import SiteApp from './SiteApp.jsx';
import App from './App.jsx';
import EventsPage from './components/EventsPage.jsx';
import PracticePage from './components/PracticePage.jsx';

const components = { home: App, events: EventsPage, practice: PracticePage };

export function renderPage (page, initialManifest = null, initialNow) {
  return renderToString(
    <StrictMode>
      <SiteApp initialPage={page} InitialComponent={components[page]} initialManifest={initialManifest} initialNow={initialNow} prerendered />
    </StrictMode>
  );
}
