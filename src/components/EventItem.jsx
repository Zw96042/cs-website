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

export default function EventItem ({
  event,
  headingLevel = 'h2',
  monthContext = false,
  preview = false,
  schedule = false
}) {
  if (schedule) {
    return <ScheduleEventItem event={event} headingLevel={headingLevel} />;
  }

  const Heading = headingLevel;
  const className = `event-ledger-item${preview ? ' event-preview-item' : ''}`;
  const dateDisplay = formatEventDate(event);
  const startDateLabel =
    monthContext && event.date
      ? event.date.slice(-2)
      : dateDisplay.startDateLabel;
  const endDateLabel =
    monthContext && event.endDate?.slice(0, 7) === event.date?.slice(0, 7)
      ? event.endDate.slice(-2)
      : dateDisplay.endDateLabel;
  const accessibleEndDateLabel = event.endDate
    ? formatEventDate({ date: event.endDate }).startDateLabel
    : null;

  return (
    <article className={className}>
      <div className='event-date'>
        {event.date
          ? (
            <div className='event-date-range'>
              <time dateTime={event.date}>
                {monthContext
                  ? (
                    <>
                      <span className='sr-only'>{dateDisplay.startDateLabel}</span>
                      <span aria-hidden='true'>{startDateLabel}</span>
                    </>
                    )
                  : (
                      startDateLabel
                    )}
              </time>
              {event.endDate
                ? (
                  <>
                    <span aria-hidden='true'>–</span>
                    <time dateTime={event.endDate}>
                      {monthContext
                        ? (
                          <>
                            <span className='sr-only'>
                              through {accessibleEndDateLabel}
                            </span>
                            <span aria-hidden='true'>{endDateLabel}</span>
                          </>
                          )
                        : (
                          <>
                            <span className='sr-only'>through </span>
                            {endDateLabel}
                          </>
                          )}
                    </time>
                  </>
                  )
                : null}
            </div>
            )
          : (
            <span className='event-date-tbd'>{dateDisplay.startDateLabel}</span>
            )}
        {dateDisplay.dayLabel
          ? (
            <span className='event-day-label'>{dateDisplay.dayLabel}</span>
            )
          : null}
      </div>
      <div className='event-details'>
        <p className='event-type' data-event-track={event.track}>
          {event.type}
        </p>
        <Heading>{event.title}</Heading>
        {event.credential
          ? (
            <p className='event-credential'>{event.credential}</p>
            )
          : null}
        {event.location
          ? (
            <p className='event-meta'>
              <span>Location</span>
              <strong>{event.location}</strong>
            </p>
            )
          : null}
        <p className='event-description'>{event.description}</p>
        {event.signupNote
          ? (
            <p className='event-meta'>
              <span>Signup</span>
              {event.link
                ? (
                  <a href={event.link}>
                    <strong>{event.signupNote}</strong>
                  </a>
                  )
                : (
                  <strong>{event.signupNote}</strong>
                  )}
            </p>
            )
          : null}
      </div>
    </article>
  );
}
