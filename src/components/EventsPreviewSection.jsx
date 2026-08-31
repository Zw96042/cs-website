import { getUpcomingEvents } from '../lib/events.js';

export default function EventsPreviewSection () {
  const upcomingEvents = getUpcomingEvents();

  return (
    <section className='section-shell event-preview-section' id='events' aria-labelledby='event-preview-heading'>
      <div className='section-inner event-preview-layout'>
        <header className='event-preview-heading'>
          <h2 className='section-heading' id='event-preview-heading'>Upcoming events.</h2>
          <a className='text-action event-preview-link' href='/events/'>
            View all events <span className='action-arrow' aria-hidden='true'>→</span>
          </a>
        </header>

        <div className='event-ledger event-preview-ledger'>
          {upcomingEvents.map((event) => (
            <article className='event-ledger-item event-preview-item' key={`${event.dateLabel}-${event.title}`}>
              <time className='event-date' dateTime={event.date ?? undefined}>
                {event.dateLabel}
                <span>{event.dayLabel}</span>
              </time>
              <div className='event-details'>
                <p className={`event-type${event.type === 'Hack Club' ? ' event-type-hack-club' : ''}`}>{event.type}</p>
                <h3>{event.title}</h3>
                <p className='event-description'>
                  {event.location && <strong className='event-location'>{event.location}</strong>}
                  {event.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
