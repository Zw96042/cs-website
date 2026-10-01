import { formatEventDate } from '../lib/events.js';

export default function EventItem ({
  event,
  headingLevel = 'h2',
  monthContext = false,
  preview = false
}) {
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
