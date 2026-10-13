import { formatEventDate } from '../lib/events.js';

function getTitleId (event) {
  const slug = event.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `event-${event.date ?? 'tbd'}-${slug}`;
}

/* Events page row. The month heading supplies context, so the date shows as a
   day number while screen readers still hear the full date. */
function ScheduleEventItem ({ event, headingLevel }) {
  const Heading = headingLevel;
  const dateDisplay = formatEventDate(event);
  const titleId = getTitleId(event);
  const endDayLabel =
    event.endDate && event.endDate.slice(0, 7) === event.date?.slice(0, 7)
      ? event.endDate.slice(-2)
      : dateDisplay.endDateLabel;
  const accessibleEndDateLabel = event.endDate
    ? formatEventDate({ date: event.endDate }).startDateLabel
    : null;

  return (
    <article className='events-row' data-event-track={event.track}>
      <div className='events-row-when'>
        {event.date
          ? (
            <>
              <span className='events-row-day'>
                <time dateTime={event.date}>
                  <span className='sr-only'>{dateDisplay.startDateLabel}</span>
                  <span aria-hidden='true'>{event.date.slice(-2)}</span>
                </time>
                {event.endDate
                  ? (
                    <>
                      <span aria-hidden='true'>–</span>
                      <time dateTime={event.endDate}>
                        <span className='sr-only'> through {accessibleEndDateLabel}</span>
                        <span aria-hidden='true'>{endDayLabel}</span>
                      </time>
                    </>
                    )
                  : null}
              </span>
              <span className='events-row-weekday'>{dateDisplay.dayLabel}</span>
            </>
            )
          : (
            <span className='events-row-day events-row-day-tbd'>{dateDisplay.startDateLabel}</span>
            )}
      </div>
      <div className='events-row-body'>
        <Heading className='events-row-title' id={titleId}>{event.title}</Heading>
        {event.credential
          ? (
            <p className='events-row-credential'>{event.credential}</p>
            )
          : null}
        {event.location || event.format
          ? (
            <p className='events-row-facts'>
              {event.location
                ? (
                  <span>
                    <span className='sr-only'>Location: </span>
                    {event.location}
                  </span>
                  )
                : null}
              {event.format
                ? (
                  <span>
                    <span className='sr-only'>Format: </span>
                    {event.format}
                  </span>
                  )
                : null}
            </p>
            )
          : null}
        <p className='events-row-description'>{event.description}</p>
        {event.signupNote
          ? event.link
            ? (
              <a className='events-row-action' href={event.link} aria-describedby={titleId}>
                <span className='events-row-action-label'>{event.signupNote}</span>
                <span className='events-row-action-arrow' aria-hidden='true'>→</span>
              </a>
              )
            : (
              <p className='events-row-note'>{event.signupNote}</p>
              )
          : null}
      </div>
    </article>
  );
}

/* Homepage ledger row shared by Upcoming events and Contests. */
function LedgerEventItem ({ event, headingLevel, showType }) {
  const Heading = headingLevel;
  const { startDateLabel, endDateLabel } = formatEventDate(event);
  const titleId = getTitleId(event);
  const kind = showType ? event.format ?? event.type : event.format;

  return (
    <li className='ledger-row'>
      <LedgerDate date={event.date} endDate={event.endDate} startLabel={startDateLabel} endLabel={endDateLabel} />
      <div className='ledger-body'>
        <Heading className='ledger-title' id={titleId}>{event.title}</Heading>
        {event.credential ? <p className='ledger-credential'>{event.credential}</p> : null}
        <p className='ledger-description'>{event.description}</p>
        {event.signupNote
          ? event.link
            ? (
              <a className='ledger-action' href={event.link} aria-describedby={titleId}>
                <span className='ledger-action-label'>{event.signupNote}</span>
                <span className='ledger-action-arrow' aria-hidden='true'>→</span>
              </a>
              )
            : <p className='ledger-note'>{event.signupNote}</p>
          : null}
      </div>
      {kind || event.location
        ? (
          <p className='ledger-aside'>
            {kind ? <span>{kind}</span> : null}
            {event.location
              ? (
                <span className='ledger-aside-secondary'>
                  <span className='sr-only'>Location: </span>
                  {event.location}
                </span>
                )
              : null}
          </p>
          )
        : null}
    </li>
  );
}

export function LedgerDate ({ date, endDate, startLabel, endLabel }) {
  if (!date) return <p className='ledger-date'>{startLabel}</p>;

  return (
    <p className='ledger-date'>
      <time dateTime={date}>{startLabel}</time>
      {endDate
        ? (
          <>
            <span aria-hidden='true'>–</span>
            <time dateTime={endDate}>
              <span className='sr-only'>through </span>
              {endLabel}
            </time>
          </>
          )
        : null}
    </p>
  );
}

export default function EventItem ({
  event,
  headingLevel = 'h3',
  schedule = false,
  showType = true
}) {
  if (schedule) {
    return <ScheduleEventItem event={event} headingLevel={headingLevel} />;
  }

  return <LedgerEventItem event={event} headingLevel={headingLevel} showType={showType} />;
}
