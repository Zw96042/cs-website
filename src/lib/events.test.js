import assert from 'node:assert/strict';
import test from 'node:test';
import {
  events,
  formatEventDate,
  getEventPreview,
  getScheduledEvents,
  getUpcomingContests,
  getUnscheduledEvents
} from './events.js';

test('keeps events scheduled for today in the club timezone', () => {
  const eventTitles = getEventPreview(new Date('2026-09-30T04:59:59Z')).map(
    ({ title }) => title
  );

  assert.deepEqual(eventTitles, [
    'Computer architecture and CS at UT',
    'Quantum computing with HitoMatch'
  ]);
});

test('drops an event when the next club calendar day starts', () => {
  const eventTitles = getEventPreview(new Date('2026-09-30T05:00:00Z')).map(
    ({ title }) => title
  );

  assert.deepEqual(eventTitles, [
    'Quantum computing with HitoMatch',
    'Code Bash'
  ]);
});

test('keeps a multi-day competition upcoming through its final day', () => {
  const eventTitles = getScheduledEvents(new Date('2026-10-12T04:59:59Z')).map(
    ({ title }) => title
  );

  assert.deepEqual(eventTitles, ['Code Bash', 'Seven Lakes', 'Clements', 'An Afternoon with Neo Wang', 'Stacey & UIL contest']);
});

test('derives the display labels for a multi-day event from its canonical dates', () => {
  const codeBash = events.find(({ title }) => title === 'Code Bash');

  assert.deepEqual(formatEventDate(codeBash), {
    dayLabel: 'Monday–Sunday, 2026',
    endDateLabel: '11',
    monthLabel: 'October',
    startDateLabel: 'Oct 05'
  });
});

test('drops a multi-day competition on the next club calendar day', () => {
  const eventTitles = getScheduledEvents(new Date('2026-10-12T05:00:00Z')).map(
    ({ title }) => title
  );

  assert.deepEqual(eventTitles, ['Seven Lakes', 'Clements', 'An Afternoon with Neo Wang', 'Stacey & UIL contest']);
});

test('keeps unscheduled events separate from the dated schedule', () => {
  const eventTitles = getUnscheduledEvents().map(({ title }) => title);

  assert.deepEqual(eventTitles, ['Build a website from scratch']);
});

test('previews the November guest speaker and December contest after Clements', () => {
  const eventTitles = getEventPreview(new Date('2026-11-22T12:00:00Z')).map(
    ({ title }) => title
  );

  assert.deepEqual(eventTitles, ['An Afternoon with Neo Wang', 'Stacey & UIL contest']);
});

test('keeps the limited-availability December contest through club midnight', () => {
  const now = new Date('2026-12-06T05:59:59Z');
  const contests = getUpcomingContests(now);

  assert.deepEqual(contests.map(({ title }) => title), ['Stacey & UIL contest']);
  assert.deepEqual(getEventPreview(now), contests);
  assert.equal(contests[0].date, '2026-12-05');
  assert.match(contests[0].description, /Stacey and the UIL contest writers/);
  assert.match(contests[0].description, /Limited availability/);
  assert.deepEqual(formatEventDate(contests[0]), {
    dayLabel: 'Saturday, 2026',
    endDateLabel: null,
    monthLabel: 'December',
    startDateLabel: 'Dec 05'
  });
  assert.deepEqual(getUpcomingContests(new Date('2026-12-06T06:00:00Z')), []);
});

test('returns no homepage events after every scheduled event has passed', () => {
  const eventTitles = getEventPreview(new Date('2026-12-06T06:00:00Z')).map(
    ({ title }) => title
  );

  assert.deepEqual(eventTitles, []);
});

test('keeps the latest schedule addition, reschedule and cancellation', () => {
  assert.equal(
    events.find((e) => e.title === 'Quantum computing with HitoMatch').date,
    '2026-10-05'
  );
  assert.equal(
    events.find((e) => e.title === 'Build a website from scratch').date,
    null
  );
  assert.ok(
    !events.some((e) => e.title === 'Inside the Turing Scholars program')
  );
});
