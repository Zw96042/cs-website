import assert from 'node:assert/strict';
import test from 'node:test';
import { getUpcomingEvents } from './events.js';

test('keeps events scheduled for today in the club timezone', () => {
  const eventTitles = getUpcomingEvents(new Date('2026-09-01T04:59:59Z')).map(({ title }) => title);

  assert.deepEqual(eventTitles, [
    'Transformer architecture with Joseph Zhang',
    'Build a website from scratch'
  ]);
});

test('drops an event when the next club calendar day starts', () => {
  const eventTitles = getUpcomingEvents(new Date('2026-09-01T05:00:00Z')).map(({ title }) => title);

  assert.deepEqual(eventTitles, [
    'Build a website from scratch',
    'Computer architecture and CS at UT'
  ]);
});

test('returns no homepage events after every scheduled event has passed', () => {
  const eventTitles = getUpcomingEvents(new Date('2026-10-01T12:00:00Z')).map(({ title }) => title);

  assert.deepEqual(eventTitles, []);
});
