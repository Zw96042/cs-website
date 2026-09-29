import assert from 'node:assert/strict';
import test from 'node:test';
import { getNavigationTarget, getPage } from './navigation.js';

const currentHref = 'https://www.westlakecs.org/events/';
const primaryClick = { button: 0 };
const anchor = (href, attributes = {}) => ({
  href,
  ...attributes,
  hasAttribute: (name) => Object.hasOwn(attributes, name)
});

test('recognizes the three public entry pages and leaves unknown paths alone', () => {
  for (const path of ['/', '/index.html']) assert.equal(getPage(path), 'home');
  for (const path of ['/events', '/events/', '/events/index.html']) assert.equal(getPage(path), 'events');
  for (const path of ['/practice', '/practice/', '/practice/index.html']) assert.equal(getPage(path), 'practice');
  for (const path of ['/events-other/', '/practice-data/manifest.json', '/proto/hero-type-actions/']) assert.equal(getPage(path), null);
});

test('keeps query strings and cross-page home fragments in client navigation', () => {
  assert.equal(getNavigationTarget(primaryClick, anchor('/practice/?test=contest-1'), currentHref).href, 'https://www.westlakecs.org/practice/?test=contest-1');
  assert.equal(getNavigationTarget(primaryClick, anchor('/#join'), currentHref).href, 'https://www.westlakecs.org/#join');
});

test('preserves modified clicks, middle clicks, downloads and new tabs', () => {
  for (const change of [{ button: 1 }, { metaKey: true }, { ctrlKey: true }, { shiftKey: true }, { altKey: true }, { defaultPrevented: true }]) {
    assert.equal(getNavigationTarget({ ...primaryClick, ...change }, anchor('/'), currentHref), null);
  }
  for (const attributes of [{ download: '' }, { target: '_blank' }, { target: 'other-window' }, { rel: 'nofollow external' }]) {
    assert.equal(getNavigationTarget(primaryClick, anchor('/', attributes), currentHref), null);
  }
  assert.ok(getNavigationTarget(primaryClick, anchor('/', { target: '_self' }), currentHref));
});

test('leaves external links, resources, already-handled practice links and local fragments native', () => {
  for (const href of ['https://hackclub.com/', 'mailto:club@example.com', '/practice-data/test.pdf', '#events-heading']) {
    assert.equal(getNavigationTarget(primaryClick, anchor(href), currentHref), null);
  }
  assert.equal(getNavigationTarget({ button: 0, defaultPrevented: true }, anchor('/practice/?test=contest-1'), 'https://www.westlakecs.org/practice/'), null);
  assert.equal(getNavigationTarget(primaryClick, null, currentHref), null);
});
