import EventItem from './EventItem.jsx';
import { getEventPreview } from '../lib/events.js';

export default function EventsPreviewSection () {
  const upcomingEvents = getEventPreview();

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
            <div className='event-ledger event-preview-ledger'>
              {upcomingEvents.map((event) => (
                <EventItem event={event} headingLevel='h3' key={`${event.date}-${event.title}`} preview />
              ))}
            </div>
            )
          : (
            <p className='events-empty'>No dated events are on the calendar yet. Check back after the next club meeting.</p>
            )}
      </div>
    </section>
  );
}
