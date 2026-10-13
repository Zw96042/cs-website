import { useState } from 'react';
import '../events.css';
import EventItem, { EventAction, LedgerDate, getTitleId, getTrackLabel } from './EventItem.jsx';
import {
  eventTracks,
  formatEventDate,
  getEventCountdown,
  getPastEvents,
  getScheduledEvents,
  getUnscheduledEvents
} from '../lib/events.js';
import { useEventDate } from '../lib/event-clock.jsx';

const filters = [{ track: 'all', filterLabel: 'All' }, ...eventTracks];

/* The soonest event gets a large calendar-style date and its full details. */
function NextEvent ({ event, now }) {
  const { dayLabel, monthLabel } = formatEventDate(event);
  const start = event.date.slice(-2).replace(/^0/, '');
  const end = event.endDate?.slice(-2).replace(/^0/, '');
  const details = [getTrackLabel(event.track), event.format, event.location].filter(Boolean);

  return (
    <article className='events-next' aria-labelledby={getTitleId(event)}>
      <p className='events-next-date'>
        <span className='events-next-month'>{monthLabel}</span>
        <span className='events-next-day'>
          <time dateTime={event.date}>{start}</time>
          {end
            ? (
              <>
                <span aria-hidden='true'>–</span>
                <time dateTime={event.endDate}><span className='sr-only'> through </span>{end}</time>
              </>
              )
            : null}
        </span>
        <span className='events-next-weekday'>{dayLabel}</span>
      </p>
      <div className='events-next-body'>
        <p className='events-next-countdown'>Next up · {getEventCountdown(event, now)}</p>
        <h2 className='events-next-title' id={getTitleId(event)}>{event.title}</h2>
        {event.credential ? <p className='ledger-credential'>{event.credential}</p> : null}
        <p className='events-next-details'>{details.join(' · ')}</p>
        <p className='events-next-description'>{event.description}</p>
        <EventAction event={event} className='ledger-action' />
      </div>
    </article>
  );
}

function PastEvent ({ event }) {
  const { startDateLabel, endDateLabel } = formatEventDate(event);

  return (
    <li className='ledger-row events-past-row'>
      <LedgerDate date={event.date} endDate={event.endDate} startLabel={startDateLabel} endLabel={endDateLabel} />
      <h3 className='events-past-title'>{event.title}</h3>
      <p className='ledger-aside'>{getTrackLabel(event.track)}</p>
    </li>
  );
}

export default function EventsPage () {
  const now = useEventDate();
  const [track, setTrack] = useState('all');
  const matches = (event) => track === 'all' || event.track === track;
  const [nextEvent, ...laterEvents] = getScheduledEvents(now);
  const upcoming = [...laterEvents, ...getUnscheduledEvents()].filter(matches);
  const pastEvents = getPastEvents(now).filter(matches);

  return (
    <main className='events-main' id='events-content'>
      <section className='section-shell events-page-section' aria-labelledby='events-heading'>
        <div className='section-inner section-stack'>
          <div className='split-heading'>
            <h1 className='section-heading' id='events-heading'>Events.</h1>
            <p className='section-intro'>
              Guest lectures, contests, and build sessions, on top of regular meetings
              every Monday from 4:30 to 5:30 in Room 291A.
            </p>
          </div>

          {nextEvent ? <NextEvent event={nextEvent} now={now} /> : null}

          <section className='events-block' aria-labelledby='upcoming-heading'>
            <div className='events-block-heading'>
              <h2 className='events-block-title' id='upcoming-heading'>
                {nextEvent ? 'After that' : 'Upcoming'}
              </h2>
              <div className='events-filters' role='group' aria-label='Show events by type'>
                {filters.map((filter) => (
                  <button
                    className='events-filter'
                    type='button'
                    aria-pressed={track === filter.track}
                    onClick={() => setTrack(filter.track)}
                    key={filter.track}
                  >
                    {filter.filterLabel}
                  </button>
                ))}
              </div>
            </div>
            {upcoming.length > 0
              ? (
                <ol className='ledger'>
                  {upcoming.map((event) => (
                    <EventItem event={event} key={`${event.date}-${event.title}`} />
                  ))}
                </ol>
                )
              : (
                <p className='events-empty'>
                  {track === 'all'
                    ? 'Nothing else is on the calendar yet.'
                    : 'Nothing of this type is on the calendar yet.'}
                  {' '}Check back after the next club meeting.
                </p>
                )}
          </section>

          {pastEvents.length > 0
            ? (
              <section className='events-block' aria-labelledby='past-events-heading'>
                <h2 className='events-block-title' id='past-events-heading'>Past events</h2>
                <ol className='ledger'>
                  {pastEvents.map((event) => (
                    <PastEvent event={event} key={`${event.date}-${event.title}`} />
                  ))}
                </ol>
              </section>
              )
            : null}
        </div>
      </section>
    </main>
  );
}
