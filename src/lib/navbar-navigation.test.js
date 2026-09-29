import assert from 'node:assert/strict';
import test from 'node:test';
import {
  allArchiveFilters,
  getArchiveRequest,
  getInitialArchiveFilters,
  getNavigationTarget,
  getPracticeType,
  getPracticeTypeHref,
  getSavedArchiveFilters,
  withArchiveFilters
} from './navigation.js';

const primaryClick = { button: 0 };
const anchor = (href) => ({ href, hasAttribute: () => false });

test('builds archive links for each practice type', () => {
  assert.equal(getPracticeTypeHref('all'), '/practice/?type=all#library-heading');
  assert.equal(getPracticeTypeHref('mc'), '/practice/?type=mc#library-heading');
  assert.equal(getPracticeTypeHref('frq'), '/practice/?type=frq#library-heading');
  assert.throws(() => getPracticeTypeHref('exam'));
});

test('reads only known practice types from a query', () => {
  assert.equal(getPracticeType('?type=mc'), 'mc');
  assert.equal(getPracticeType('?test=contest-1&type=frq'), 'frq');
  assert.equal(getPracticeType('?type=all'), 'all');
  for (const search of ['', '?test=contest-1', '?type=', '?type=MC', '?type=exam', '?type=constructor']) {
    assert.equal(getPracticeType(search), null);
  }
});

test('keeps practice type links in client navigation from other pages and open tests', () => {
  for (const currentHref of [
    'https://www.westlakecs.org/',
    'https://www.westlakecs.org/events/#october-events',
    'https://www.westlakecs.org/practice/?test=contest-1',
    'https://www.westlakecs.org/practice/?type=mc#library-heading'
  ]) {
    const target = getNavigationTarget(primaryClick, anchor(getPracticeTypeHref('frq')), currentHref);
    assert.equal(target.href, 'https://www.westlakecs.org/practice/?type=frq#library-heading');
  }
});

test('leaves modified clicks on practice type links to the browser', () => {
  for (const change of [{ button: 1 }, { metaKey: true }, { ctrlKey: true }, { shiftKey: true }, { altKey: true }]) {
    assert.equal(getNavigationTarget({ ...primaryClick, ...change }, anchor(getPracticeTypeHref('mc')), 'https://www.westlakecs.org/'), null);
    assert.equal(getArchiveRequest({ ...primaryClick, ...change }, anchor(getPracticeTypeHref('mc')), 'https://www.westlakecs.org/practice/'), null);
  }
});

test('a type link requests its Type with Year and Round cleared, even at the current URL', () => {
  const href = getPracticeTypeHref('frq');
  for (const currentHref of [
    'https://www.westlakecs.org/events/',
    'https://www.westlakecs.org/practice/?test=contest-1',
    `https://www.westlakecs.org${href}`
  ]) {
    assert.deepEqual(getArchiveRequest(primaryClick, anchor(href), currentHref), { mode: 'frq', year: 'all', round: 'all' });
  }
  // SiteApp may have prevented the default and pushed the URL already.
  assert.deepEqual(getArchiveRequest({ ...primaryClick, defaultPrevented: true }, anchor(href), 'https://www.westlakecs.org/'), { mode: 'frq', year: 'all', round: 'all' });
  for (const other of ['/practice/', '/practice/?test=contest-1', '/events/?type=mc', 'https://example.com/practice/?type=mc']) {
    assert.equal(getArchiveRequest(primaryClick, anchor(other), 'https://www.westlakecs.org/practice/'), null);
  }
  assert.equal(getArchiveRequest(primaryClick, { ...anchor(href), target: '_blank' }, 'https://www.westlakecs.org/'), null);
  assert.equal(getArchiveRequest(primaryClick, null, 'https://www.westlakecs.org/'), null);
});

test('an archive entry restores its saved filters before reading its ?type=', () => {
  const saved = { mode: 'frq', year: '2023', round: 'District' };
  assert.deepEqual(getInitialArchiveFilters('?type=mc', { practiceArchive: saved }), saved);
  assert.deepEqual(getInitialArchiveFilters('?type=mc', {}), { mode: 'mc', year: 'all', round: 'all' });
  assert.deepEqual(getInitialArchiveFilters('?type=mc', null), { mode: 'mc', year: 'all', round: 'all' });
  assert.deepEqual(getInitialArchiveFilters('', null), allArchiveFilters);
  for (const state of [null, {}, 'x', { practiceArchive: { mode: 'exam', year: 'all', round: 'all' } }, { practiceArchive: { mode: 'mc', year: 2023, round: 'all' } }]) {
    assert.equal(getSavedArchiveFilters(state), null);
  }
});

test('saving filters keeps other history state', () => {
  const filters = { mode: 'mc', year: '2024', round: 'State' };
  assert.deepEqual(withArchiveFilters({ other: 1 }, filters), { other: 1, practiceArchive: filters });
  assert.deepEqual(withArchiveFilters(null, filters), { practiceArchive: filters });
  assert.deepEqual(getSavedArchiveFilters(withArchiveFilters({}, filters)), filters);
});

// Mirrors PracticePage: a mounted archive saves its filters on the current entry,
// popstate restores saved filters (or keeps the current ones), and a Type link click
// applies its request.
test('Back from a test restores the Type, Year, and Round left on the archive', () => {
  const entries = [{ href: `https://www.westlakecs.org${getPracticeTypeHref('mc')}`, state: {} }];
  let index = 0;
  const save = (filters) => { entries[index].state = withArchiveFilters(entries[index].state, filters); };
  const push = (href) => { entries.splice(index + 1, Infinity, { href, state: {} }); index += 1; };
  const popTo = (next, current) => { index = next; return getSavedArchiveFilters(entries[index].state) || current; };

  let filters = getInitialArchiveFilters(new URL(entries[0].href).search, entries[0].state);
  assert.deepEqual(filters, { mode: 'mc', year: 'all', round: 'all' });
  filters = { ...filters, year: '2023', round: 'District' };
  save(filters);

  push('https://www.westlakecs.org/practice/?test=contest-1');
  filters = popTo(0, filters);
  assert.deepEqual(filters, { mode: 'mc', year: '2023', round: 'District' });

  // Clicking the same Type link again is a fresh request.
  filters = getArchiveRequest(primaryClick, anchor(getPracticeTypeHref('mc')), entries[0].href) || filters;
  assert.deepEqual(filters, { mode: 'mc', year: 'all', round: 'all' });
  save(filters);

  // Leaving the site shell and coming back remounts the page from saved state.
  push('https://www.westlakecs.org/events/');
  index = 0;
  assert.deepEqual(getInitialArchiveFilters(new URL(entries[0].href).search, entries[0].state), { mode: 'mc', year: 'all', round: 'all' });
});
