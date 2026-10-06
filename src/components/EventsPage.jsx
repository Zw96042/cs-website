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
            <h1 className='section-heading' id='events-heading'>Events.</h1>
            <p className='section-intro'>
              Guest lectures, build sessions, and competitions.
            </p>
          </header>

          <div className='events-schedule'>
            {eventGroups.length > 0
              ? eventGroups.map((group) => {
                const monthId = `${group.month.toLowerCase()}-events`;

                return (
                  <section className='events-group' aria-labelledby={monthId} key={group.month}>
                    <h2 className='events-group-heading' id={monthId}>{group.month}</h2>
                    {group.events.map((event) => (
                      <EventItem event={event} headingLevel='h3' key={`${event.date}-${event.title}`} schedule />
                    ))}
                  </section>
                );
              })
              : (
                <p className='events-empty'>No dated events are on the calendar yet. Check back after the next club meeting.</p>
                )}

            {unscheduledEvents.length > 0
              ? (
                <section className='events-group' aria-labelledby='unscheduled-events-heading'>
                  <h2 className='events-group-heading' id='unscheduled-events-heading'>Dates to be announced</h2>
                  {unscheduledEvents.map((event) => (
                    <EventItem event={event} headingLevel='h3' key={event.title} schedule />
                  ))}
                </section>
                )
              : null}
          </div>
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
