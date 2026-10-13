import EventItem from './EventItem.jsx';
import { getEventPreview } from '../lib/events.js';
import { useEventDate } from '../lib/event-clock.jsx';

export default function EventsPreviewSection () {
  const upcomingEvents = getEventPreview(useEventDate());

  return (
    <section className='section-shell event-preview-section' id='events' aria-labelledby='event-preview-heading'>
      <div className='section-inner event-preview-layout'>
        <header className='event-preview-heading'>
          <h2 className='section-heading' id='event-preview-heading'>Upcoming events.</h2>
          <a className='text-action event-preview-link' href='/events/'>
            View all events <span className='action-arrow' aria-hidden='true'>→</span>
          </a>
        </header>

        {upcomingEvents.length > 0
          ? (
            <ol className='ledger'>
              {upcomingEvents.map((event) => (
                <EventItem event={event} key={`${event.date}-${event.title}`} />
              ))}
            </ol>
            )
          : (
            <p className='events-empty'>No speakers or club events are scheduled right now. Check back after the next club meeting.</p>
            )}
      </div>
    </section>
  );
}
