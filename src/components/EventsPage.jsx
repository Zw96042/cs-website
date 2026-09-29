import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import EventItem from './EventItem.jsx';
import Footer from './Footer.jsx';
import Header from './Header.jsx';
import { formatEventDate, getScheduledEvents, getUnscheduledEvents } from '../lib/events.js';

function groupEventsByMonth (events) {
  return events.reduce((groups, event) => {
    const currentGroup = groups[groups.length - 1];
    const month = formatEventDate(event).monthLabel;

    if (currentGroup?.month === month) {
      currentGroup.events.push(event);
      return groups;
    }

    return [...groups, { month, events: [event] }];
  }, []);
}

export default function EventsPage ({ embedded = false }) {
  const scheduledEvents = getScheduledEvents();
  const unscheduledEvents = getUnscheduledEvents();
  const eventGroups = groupEventsByMonth(scheduledEvents);

  const content = (
    <main className='events-main' id='events-content'>
      <section className='events-page-section' aria-labelledby='events-heading'>
        <div className='section-inner events-page-layout'>
          <header className='events-page-heading'>
            <div>
              <h1 className='section-heading' id='events-heading'>Events.</h1>
            </div>
            <p className='section-intro'>
              Guest lectures, build sessions, and competitions.
            </p>
          </header>

          <section className='events-schedule' aria-labelledby='upcoming-events-heading'>
            <header className='events-schedule-heading'>
              <h2 id='upcoming-events-heading'>Upcoming</h2>
            </header>

            {eventGroups.length > 0
              ? eventGroups.map((group) => {
                const monthId = `${group.month.toLowerCase()}-events`;

                return (
                  <section className='event-month' aria-labelledby={monthId} key={group.month}>
                    <header className='event-month-heading'>
                      <h3 id={monthId}>{group.month}</h3>
                    </header>
                    <div className='event-ledger'>
                      {group.events.map((event) => (
                        <EventItem event={event} headingLevel='h4' key={`${event.date}-${event.title}`} monthContext />
                      ))}
                    </div>
                  </section>
                );
              })
              : (
                <p className='events-empty'>No dated events are on the calendar yet. Check back after the next club meeting.</p>
                )}
          </section>

          {unscheduledEvents.length > 0
            ? (
              <section className='events-unscheduled' aria-labelledby='unscheduled-events-heading'>
                <header className='events-schedule-heading'>
                  <div>
                    <h2 id='unscheduled-events-heading'>Dates in progress</h2>
                    <p>Confirmed events whose timing is still being finalized.</p>
                  </div>
                </header>
                <div className='event-ledger'>
                  {unscheduledEvents.map((event) => (
                    <EventItem event={event} headingLevel='h3' key={event.title} />
                  ))}
                </div>
              </section>
              )
            : null}
        </div>
      </section>
      {!embedded && <Analytics />}
      {!embedded && <SpeedInsights />}
    </main>
  );

  if (embedded) return content;

  return (
    <div className='site-page'>
      <a className='skip-link' href='#events-content'>Skip to events</a>
      <Header currentPage='events' />
      {content}
      <Footer />
    </div>
  );
}
