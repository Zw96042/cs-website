import { formatEventDate, getUpcomingContests } from '../lib/events.js';

export default function Contests () {
  const contests = getUpcomingContests();

  if (contests.length === 0) return null;

  return (
    <div className='section-inner contests-page-layout'>
      <header className='contests-page-heading'>
        <h1 className='section-heading' id='contests-heading'>
          Contests.
        </h1>
      </header>

      <div className='contest-ledger'>
        {contests.map((contest) => {
          const { dayLabel, startDateLabel, endDateLabel } = formatEventDate(contest);

          return (
            <article
              className='contest-ledger-item'
              key={`${contest.date}-${contest.title}`}
            >
              <div className='contest-date'>
                <div className='event-date-range'>
                  <time dateTime={contest.date}>{startDateLabel}</time>
                  {contest.endDate && (
                    <>
                      <span aria-hidden='true'>–</span>
                      <time dateTime={contest.endDate}>
                        <span className='sr-only'>through </span>
                        {endDateLabel}
                      </time>
                    </>
                  )}
                </div>
                <span className='event-day-label'>{dayLabel}</span>
              </div>
              <div className='contest-details'>
                <h2>{contest.title}</h2>
                <p className='contest-type'>{contest.format ?? contest.type}</p>
                <p className='contest-description'>{contest.description}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
