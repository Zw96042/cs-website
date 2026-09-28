import assert from 'node:assert/strict';
import test from 'node:test';
import { events, formatEventDate, getEventPreview, getScheduledEvents, getUnscheduledEvents } from './events.js';

test('keeps events scheduled for today in the club timezone', () => {
  const eventTitles = getEventPreview(new Date('2026-09-08T04:59:59Z')).map(({ title }) => title);

  assert.deepEqual(eventTitles, [
    'Build a website from scratch',
    'Computer architecture and CS at UT'
  ]);
});

test('drops an event when the next club calendar day starts', () => {
  const eventTitles = getEventPreview(new Date('2026-09-08T05:00:00Z')).map(({ title }) => title);

  assert.deepEqual(eventTitles, [
    'Computer architecture and CS at UT',
    'Code Bash'
  ]);
});

test('keeps a multi-day competition upcoming through its final day', () => {
  const eventTitles = getScheduledEvents(new Date('2026-10-12T04:59:59Z')).map(({ title }) => title);

  assert.deepEqual(eventTitles, [
    'Code Bash',
    'Seven Lakes'
  ]);
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
  const eventTitles = getScheduledEvents(new Date('2026-10-12T05:00:00Z')).map(({ title }) => title);

  assert.deepEqual(eventTitles, ['Seven Lakes']);
});

test('keeps unscheduled events separate from the dated schedule', () => {
  const eventTitles = getUnscheduledEvents().map(({ title }) => title);

  assert.deepEqual(eventTitles, ['Inside the Turing Scholars program']);
});

test('returns no homepage events after every scheduled event has passed', () => {
  const eventTitles = getEventPreview(new Date('2026-10-18T12:00:00Z')).map(({ title }) => title);

  assert.deepEqual(eventTitles, []);
});
