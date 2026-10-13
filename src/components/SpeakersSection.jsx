import { LedgerDate } from './EventItem.jsx';
import { formatEventDate, getPastSpeakers } from '../lib/events.js';
import { useEventDate } from '../lib/event-clock.jsx';

export default function SpeakersSection () {
  const speakers = getPastSpeakers(useEventDate());

  if (speakers.length === 0) return null;

  return (
    <section
      className='section-shell speakers-section'
      id='speakers'
      aria-labelledby='speakers-heading'
    >
      <div className='section-inner section-stack'>
        <div className='split-heading'>
          <h2 className='section-heading' id='speakers-heading'>
            Guest lectures.
          </h2>
          <p className='section-intro'>
            Alumni, professors, and industry leaders visit to talk about their work and
            answer questions from members.
          </p>
        </div>
        <ol className='ledger'>
          {speakers.map((talk) => (
            <li className='ledger-row' key={`${talk.date}-${talk.title}`}>
              <LedgerDate date={talk.date} startLabel={formatEventDate(talk).startDateLabel} />
              <div className='ledger-body'>
                <h3 className='ledger-title'>{talk.title}</h3>
              </div>
              <p className='ledger-aside'>{talk.speaker}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
