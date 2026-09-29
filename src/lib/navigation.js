export function getPage (pathname) {
  if (pathname === '/' || pathname === '/index.html') return 'home';
  if (/^\/events(?:\/|\/index\.html)?$/.test(pathname)) return 'events';
  if (/^\/practice(?:\/|\/index\.html)?$/.test(pathname)) return 'practice';
  return null;
}

// Keep ordinary anchor behavior for browser shortcuts and destinations outside the site.
export function getNavigationTarget (event, link, currentHref) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  if (!link || link.hasAttribute('download') || (link.target && link.target.toLowerCase() !== '_self') || link.rel?.split(/\s+/).includes('external')) return null;
  const current = new URL(currentHref);
  const target = new URL(link.href, current);
  if (target.origin !== current.origin || !getPage(target.pathname)) return null;
  if (target.pathname === current.pathname && target.search === current.search && target.hash) return null;
  return target;
}
