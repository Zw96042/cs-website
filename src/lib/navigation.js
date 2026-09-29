export function getPage (pathname) {
  if (pathname === '/' || pathname === '/index.html') return 'home';
  if (/^\/events(?:\/|\/index\.html)?$/.test(pathname)) return 'events';
  if (/^\/practice(?:\/|\/index\.html)?$/.test(pathname)) return 'practice';
  return null;
}

// Practice archive Type filters that links can request with ?type=.
const practiceTypes = ['all', 'mc', 'frq'];

export function getPracticeType (search) {
  const type = new URLSearchParams(search).get('type');
  return practiceTypes.includes(type) ? type : null;
}

export function getPracticeTypeHref (type) {
  if (!practiceTypes.includes(type)) throw new Error(`Unknown practice type: ${type}`);
  return `/practice/?type=${type}#library-heading`;
}

export const allArchiveFilters = { mode: 'all', year: 'all', round: 'all' };

// Filters saved on a practice history entry, so Back, Forward, and reload return to them.
export function getSavedArchiveFilters (state) {
  const saved = state?.practiceArchive;
  if (!saved || !practiceTypes.includes(saved.mode) || typeof saved.year !== 'string' || typeof saved.round !== 'string') return null;
  return { mode: saved.mode, year: saved.year, round: saved.round };
}

export function withArchiveFilters (state, filters) {
  const base = state && typeof state === 'object' && !Array.isArray(state) ? state : {};
  return { ...base, practiceArchive: { mode: filters.mode, year: filters.year, round: filters.round } };
}

// Filters for a practice entry the archive hasn't shown yet: a ?type= link applies its
// Type with Year and Round cleared; anything else starts unfiltered.
export function getInitialArchiveFilters (search, state) {
  const type = getPracticeType(search);
  return getSavedArchiveFilters(state) || (type ? { ...allArchiveFilters, mode: type } : allArchiveFilters);
}

// Browser shortcuts, downloads, and new-tab or external links keep their default behavior.
function isPlainLinkClick (event, link) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  return Boolean(link) && !link.hasAttribute('download') && !(link.target && link.target.toLowerCase() !== '_self') && !link.rel?.split(/\s+/).includes('external');
}

// A plain click on a practice ?type= link is a fresh request for that Type, even when
// it matches the current URL and the browser only moves to its fragment.
export function getArchiveRequest (event, link, currentHref) {
  if (!isPlainLinkClick(event, link)) return null;
  const current = new URL(currentHref);
  const target = new URL(link.href, current);
  if (target.origin !== current.origin || getPage(target.pathname) !== 'practice') return null;
  const type = getPracticeType(target.search);
  return type ? { ...allArchiveFilters, mode: type } : null;
}

export function getNavigationTarget (event, link, currentHref) {
  if (event.defaultPrevented || !isPlainLinkClick(event, link)) return null;
  const current = new URL(currentHref);
  const target = new URL(link.href, current);
  if (target.origin !== current.origin || !getPage(target.pathname)) return null;
  if (target.pathname === current.pathname && target.search === current.search && target.hash) return null;
  return target;
}
