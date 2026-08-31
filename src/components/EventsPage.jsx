import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Footer from './Footer.jsx';
import Header from './Header.jsx';
import { events } from '../lib/events.js';

export default function EventsPage () {
  return (
    <div className='site-page'>
      <a className='skip-link' href='#events-content'>Skip to events</a>
      <Header currentPage='events' />
      <main className='events-main' id='events-content'>
        <section className='events-page-section' aria-labelledby='events-heading'>
          <div className='section-inner events-page-layout'>
            <header className='events-page-heading'>
              <h1 className='section-heading' id='events-heading'>Events.</h1>
            </header>

            <div className='event-ledger'>
              {events.map((event, index) => (
                <article className='event-ledger-item' key={`${event.dateLabel}-${event.title}`}>
                  <time className='event-date' dateTime={event.date ?? undefined}>
                    {event.dateLabel}
                    <span>{event.dayLabel}</span>
                  </time>
                  <div className='event-details'>
                    <p className={`event-type${event.type === 'Hack Club' ? ' event-type-hack-club' : ''}`}>{event.type}</p>
                    <h2>{event.title}</h2>
                    <p className='event-description'>
                      {event.location && <strong className='event-location'>{event.location}</strong>}
                      {event.description}
                    </p>
                  </div>
                  <p className='event-number' aria-hidden='true'>{String(index + 1).padStart(2, '0')} / {String(events.length).padStart(2, '0')}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <Analytics />
        <SpeedInsights />
      </main>
      <Footer />
    </div>
  );
}
