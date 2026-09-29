import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import { getNavigationTarget, getPage } from './lib/navigation.js';
import homeHtml from '../index.html?raw';
import eventsHtml from '../events/index.html?raw';
import practiceHtml from '../practice/index.html?raw';

const pageHtml = { home: homeHtml, events: eventsHtml, practice: practiceHtml };
const contentIds = { home: 'club-content', events: 'events-content', practice: 'practice-content' };
const loaders = {
  home: () => import('./App.jsx'),
  events: () => import('./components/EventsPage.jsx'),
  practice: () => Promise.all([import('./components/PracticePage.jsx'), import('./practice.css')]).then(([page]) => page)
};
const pageModules = new Map();

function loadPage (page) {
  if (!pageModules.has(page)) {
    pageModules.set(page, loaders[page]().catch((error) => {
      pageModules.delete(page);
      throw error;
    }));
  }
  return pageModules.get(page);
}

function updateMetadata (page) {
  const source = new DOMParser().parseFromString(pageHtml[page], 'text/html');
  document.title = source.title;
  for (const selector of ['meta[name="description"]', 'link[rel="canonical"]', 'meta[property^="og:"]', 'meta[name^="twitter:"]']) {
    for (const original of source.head.querySelectorAll(selector)) {
      const name = original.getAttribute('name');
      const property = original.getAttribute('property');
      const match = name ? `meta[name="${name}"]` : property ? `meta[property="${property}"]` : 'link[rel="canonical"]';
      const existing = document.head.querySelector(match);
      if (existing) existing.replaceWith(original.cloneNode(true));
      else document.head.append(original.cloneNode(true));
    }
  }
}

function RouteContent ({ Component, page, onReady }) {
  useEffect(() => {
    if (page !== 'practice') onReady();
  }, [page, onReady]);
  // Practice waits for its manifest and selected test before restoring a long view.
  return <Component embedded onReady={page === 'practice' ? onReady : undefined} />;
}

export default function SiteApp () {
  const [location, setLocation] = useState({ href: window.location.href });
  const { href } = location;
  const page = getPage(new URL(href).pathname) || 'home';
  const [loaded, setLoaded] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState(false);
  const pendingScroll = useRef({ href, position: [window.scrollX, window.scrollY], focus: false });
  const scrollPositions = useRef(new Map());

  useLayoutEffect(() => { updateMetadata(page); }, [page]);

  useEffect(() => {
    let active = true;
    setError(false);
    loadPage(page).then((module) => {
      if (active) setLoaded({ page, Component: module.default });
    }).catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [page, attempt]);

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    const rememberScroll = () => {
      // Loading layouts can clamp scroll; keep the saved destination until it is ready.
      if (pendingScroll.current?.href === window.location.href) return;
      scrollPositions.current.set(window.location.href, [window.scrollX, window.scrollY]);
    };
    const onPopState = () => {
      const nextHref = window.location.href;
      if (!getPage(window.location.pathname)) return;
      pendingScroll.current = {
        href: nextHref,
        position: scrollPositions.current.get(nextHref) || [0, 0],
        focus: false
      };
      // Practice pushes its own query URLs. Always render, even if the shell's last
      // URL already matches this destination, so its readiness callback runs again.
      setLocation({ href: nextHref });
    };
    window.addEventListener('scroll', rememberScroll, { passive: true });
    window.addEventListener('popstate', onPopState);
    return () => {
      window.history.scrollRestoration = previousRestoration;
      window.removeEventListener('scroll', rememberScroll);
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  const finishNavigation = () => {
    const pending = pendingScroll.current;
    if (!pending || pending.href !== window.location.href) return;
    pendingScroll.current = null;
    const main = document.getElementById(contentIds[page]);
    if (pending.focus && main) {
      main.tabIndex = -1;
      main.focus({ preventScroll: true });
    }
    const hash = new URL(pending.href).hash.slice(1);
    let target = null;
    try { target = hash ? document.getElementById(decodeURIComponent(hash)) : null; } catch { /* Invalid fragments have no matching element. */ }
    if (target) target.scrollIntoView({ behavior: 'instant' });
    else window.scrollTo({ left: pending.position[0], top: pending.position[1], behavior: 'instant' });
  };

  const navigate = (event) => {
    const link = event.target.closest?.('a[href]');
    const target = getNavigationTarget(event, link, window.location.href);
    if (!target) return;
    event.preventDefault();
    if (target.href === window.location.href) return;
    scrollPositions.current.set(window.location.href, [window.scrollX, window.scrollY]);
    window.history.pushState({}, '', target);
    pendingScroll.current = { href: target.href, position: [0, 0], focus: true };
    setLocation({ href: target.href });
    // Existing practice links manage this themselves; support ordinary query links too.
    if (page === 'practice' && getPage(target.pathname) === 'practice') {
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const ready = loaded?.page === page && !error;
  return (
    <div className={`site-page${page === 'practice' ? ' practice-page' : ''}`} onClick={navigate}>
      <a className='skip-link' href={`#${contentIds[page]}`}>Skip to content</a>
      <Header currentPage={page} />
      {ready
        ? <RouteContent Component={loaded.Component} page={page} onReady={finishNavigation} />
        : <main id={contentIds[page]} className={page === 'home' ? 'club-main' : `${page}-main`} aria-busy={!error}>
            {error
              ? <section role='alert'><h1>This page could not load.</h1><p>Check your connection and try again.</p><button type='button' onClick={() => setAttempt((value) => value + 1)}>Try again</button></section>
              : <p role='status'>Loading {page === 'home' ? 'home' : page}…</p>}
          </main>}
      <Footer />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
