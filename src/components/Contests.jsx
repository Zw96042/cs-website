import EventItem from './EventItem.jsx';
import { getUpcomingContests } from '../lib/events.js';
import { useEventDate } from '../lib/event-clock.jsx';

export default function Contests () {
  const contests = getUpcomingContests(useEventDate());

  if (contests.length === 0) return null;

  return (
    <section
      className='section-shell contests-section'
      id='contests'
      aria-labelledby='contests-heading'
    >
      <div className='section-inner section-stack'>
        <div className='split-heading'>
          <h2 className='section-heading' id='contests-heading'>
            Contests.
          </h2>
          <p className='section-intro'>
            Upcoming programming competitions for high school teams.
          </p>
        </div>

        <ol className='ledger'>
          {contests.map((contest) => (
            <EventItem
              event={contest}
              key={`${contest.date}-${contest.title}`}
              showType={false}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
